// Service Worker for 歌厅定制应用 - 修复版
const CACHE_NAME = 'karaoke-customizer-v2.0.0';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/admin.html',
  '/firebase-config.js',
  '/config.js',
  '/manifest.json',
  '/icons/icon-72.png',
  '/icons/icon-96.png',
  '/icons/icon-128.png',
  '/icons/icon-144.png',
  '/icons/icon-152.png',
  '/icons/icon-192.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png'
  // 🔥 注意：已移除 Firebase JS 库的缓存
];

// 需要缓存的动态资源（API端点）
const DYNAMIC_ENDPOINTS = [
  'https://itunes.apple.com/search'
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', event => {
  console.log('🔧 Service Worker 安装中...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 缓存静态资源');
        // 只缓存自己的资源，不缓存第三方库
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker 安装完成');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Service Worker 安装失败:', error);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  console.log('🔄 Service Worker 激活中...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 删除旧版本的缓存
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('🗑️ 删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('✅ Service Worker 激活完成');
      return self.clients.claim();
    })
  );
});

// 获取事件 - 关键修复：排除所有 Firebase/Google 和认证相关请求
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // ============ 关键修复：主页和认证页面完全不走缓存 ============
  // 1. 主页和认证相关页面直接网络请求
  if (url.pathname === '/' || 
      url.pathname === '/index.html' ||
      url.search.includes('auth') ||
      url.search.includes('firebase') ||
      url.search.includes('apiKey') ||
      url.search.includes('__firebase') ||
      url.hash.includes('access_token') ||
      url.hash.includes('id_token')) {
    console.log('SW: 主页/认证页面，直接网络请求:', url.pathname + url.search);
    event.respondWith(fetch(request));
    return;
  }
  
  // 2. 排除所有 Firebase/Google 域名 - 直接网络请求
  const excludedDomains = [
    'gstatic.com',
    'googleapis.com',
    'google.com',
    'firebaseapp.com',
    'firebasestorage.app',
    'firebaseio.com',
    'accounts.google.com',
    'www.googleapis.com',
    'securetoken.googleapis.com',
    'identitytoolkit.googleapis.com'
  ];
  
  const isExcludedDomain = excludedDomains.some(domain => 
    url.hostname.includes(domain)
  );
  
  if (isExcludedDomain) {
    console.log('SW: Firebase/Google 资源，直接网络请求:', url.hostname);
    event.respondWith(fetch(request));
    return;
  }
  
  // 3. 排除所有包含 __/auth 或 __/firebase 的路径
  if (url.pathname.includes('__/auth') || url.pathname.includes('__/firebase')) {
    console.log('SW: Firebase 内部路径，直接网络请求:', url.pathname);
    event.respondWith(fetch(request));
    return;
  }
  
  // 跳过非GET请求
  if (request.method !== 'GET') {
    return;
  }

  // ============ iTunes API 请求处理 ============
  // 处理 iTunes API 请求 - 网络优先
  if (url.href.includes('itunes.apple.com/search')) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          // 克隆响应以同时缓存
          const responseClone = networkResponse.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(() => {
          // 网络失败时尝试从缓存获取
          return caches.match(request);
        })
    );
    return;
  }

  // ============ 静态资源处理 ============
  // 处理自己的静态资源 - 缓存优先
  if (STATIC_ASSETS.some(asset => url.href.includes(asset)) || 
      url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          // 返回缓存版本，同时更新缓存
          const fetchPromise = fetch(request)
            .then(networkResponse => {
              // 更新缓存
              caches.open(STATIC_CACHE)
                .then(cache => cache.put(request, networkResponse));
              return networkResponse.clone();
            })
            .catch(() => cachedResponse); // 网络失败时使用缓存

          return cachedResponse || fetchPromise;
        })
    );
    return;
  }

  // ============ 其他请求处理 ============
  // 其他请求 - 网络优先
  event.respondWith(
    fetch(request)
      .then(networkResponse => {
        // 对于成功的外部请求，缓存它们
        if (url.origin !== self.location.origin) {
          const responseClone = networkResponse.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        // 网络失败时尝试从缓存获取
        return caches.match(request)
          .then(cachedResponse => {
            return cachedResponse || new Response('网络连接失败', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// 后台同步 - 处理离线时的数据同步
self.addEventListener('sync', event => {
  console.log('🔄 后台同步事件:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// 推送通知
self.addEventListener('push', event => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || '歌厅定制有新消息',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: '打开应用'
      },
      {
        action: 'close',
        title: '关闭'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '歌厅定制', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(clientList => {
          for (const client of clientList) {
            if (client.url === event.notification.data.url && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(event.notification.data.url);
          }
        })
    );
  }
});

// 后台同步功能
async function doBackgroundSync() {
  console.log('🔄 执行后台同步...');
  
  // 这里可以添加离线时保存的订单同步逻辑
  // 例如：将本地存储的订单同步到服务器
  
  try {
    // 模拟同步过程
    const pendingOrders = await getPendingOrdersFromLocal();
    if (pendingOrders.length > 0) {
      await syncOrdersToServer(pendingOrders);
      console.log(`✅ 同步了 ${pendingOrders.length} 个待处理订单`);
    }
  } catch (error) {
    console.error('❌ 后台同步失败:', error);
  }
}

// 辅助函数 - 从本地存储获取待处理订单
async function getPendingOrdersFromLocal() {
  // 这里实现从本地存储获取离线订单的逻辑
  return [];
}

// 辅助函数 - 同步订单到服务器
async function syncOrdersToServer(orders) {
  // 这里实现将离线订单同步到服务器的逻辑
  return Promise.resolve();
}

// 处理消息 - 忽略 Firebase 内部消息
self.addEventListener('message', event => {
  console.log('📨 Service Worker 收到消息:', event.data);
  
  // 忽略 Firebase 的 keyChanged 消息
  if (event.data && event.data.eventType === 'keyChanged') {
    console.log('📨 忽略 Firebase keyChanged 消息');
    return;
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('🔄 跳过等待，立即激活新版本');
    self.skipWaiting();
  }
});

// 错误处理
self.addEventListener('error', event => {
  console.error('❌ Service Worker 错误:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('❌ Service Worker Promise 拒绝:', event.reason);
});
