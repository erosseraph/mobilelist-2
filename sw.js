// Service Worker for 歌厅定制应用
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
  '/icons/icon-512.png',
  'https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js'
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

// 获取事件 - 网络优先，失败时使用缓存
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // ============ 新增：排除 Firebase 相关请求 ============
  // 不要让 Service Worker 缓存或处理任何 Firebase 相关资源
  if (url.href.includes('gstatic.com/firebase') || 
      url.href.includes('firebase.googleapis.com') ||
      url.href.includes('__/firebase') ||
      url.href.includes('firebase')) {
    // 直接通过网络请求，不经过缓存
    event.respondWith(fetch(request));
    return;
  }
  // ============ 新增结束 ============
  
  // 跳过非GET请求
  if (request.method !== 'GET') {
    return;
  }

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

  // 处理静态资源 - 缓存优先
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

// 处理消息
self.addEventListener('message', event => {
  console.log('📨 Service Worker 收到消息:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
