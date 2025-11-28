# 🎤 定制你的专属歌厅 - MobileList 2.0

一个现代化的 KTV 歌单定制 Web 应用，支持 PWA、移动端优化和完整的订单管理系统。

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-9.22.1-orange)
![PWA](https://img.shields.io/badge/PWA-✅-green)

## ✨ 功能特点

### 🎵 核心功能
- **智能歌曲搜索** - 集成 iTunes API，支持中文歌曲搜索
- **歌单管理** - 拖拽排序、批量操作、实时保存
- **歌曲试听** - 30秒预览播放
- **用户系统** - Firebase 认证，支持邮箱和 Google 登录

### 📱 移动优化
- **PWA 支持** - 可安装到手机主屏幕
- **响应式设计** - 完美适配手机和桌面
- **触摸友好** - 优化的移动端交互
- **离线功能** - Service Worker 缓存

### 🛒 订单系统
- **智能定价** - 根据歌曲数量自动推荐配套
- **多区域配送** - 支持西马/东马不同邮费
- **订单跟踪** - 完整的订单状态管理
- **数据导出** - CSV 格式导出歌单

### 👑 管理面板
- **订单管理** - 状态更新、详情查看
- **数据统计** - 销售数据可视化
- **安全访问** - 密码保护的管理员登录
- **批量操作** - 快速处理多个订单

## 🚀 快速开始

### 环境要求
- 现代浏览器（支持 ES6+）
- Firebase 项目
- Node.js（可选，用于本地开发）

### 本地开发
```bash
# 克隆项目
git clone https://github.com/erosseraph/mobilelist-2.git
cd mobilelist-2

# 安装依赖（可选）
npm install

# 启动本地服务器
npm run dev
# 或使用 Python
python -m http.server 3000

🎯 使用指南
用户流程
注册登录 → 创建账户

搜索歌曲 → 浏览或搜索歌曲

构建歌单 → 添加歌曲到歌单

提交订单 → 选择配套并填写信息

等待确认 → 管理员处理订单

管理员流程
访问 /admin.html

输入管理员密码

查看和处理订单

更新订单状态

导出数据

🔐 安全特性
✅ 环境变量管理敏感信息

✅ Firebase 安全规则

✅ 管理员密码保护

✅ CORS 配置

✅ HTTPS 强制

📱 PWA 功能
添加到主屏幕 - 原生应用体验

离线访问 - 缓存关键资源

推送通知 - 订单状态更新

快速加载 - Service Worker 优化

🛠️ 技术栈
技术	用途
Frontend	HTML5, CSS3, JavaScript (ES6+)
Backend	Firebase (Auth, Firestore)
PWA	Service Worker, Manifest
Deployment	Vercel
API	iTunes Search API
📄 文件结构
text
mobilelist-2/
├── public/                 # 静态文件
│   ├── index.html         # 主应用
│   ├── admin.html         # 管理面板
│   ├── manifest.json      # PWA 配置
│   ├── sw.js             # Service Worker
│   └── firebase-config.js # Firebase 配置
├── vercel.json           # Vercel 配置
├── package.json          # 项目配置
├── .gitignore           # Git 忽略文件
└── README.md            # 项目说明
🤝 贡献
欢迎提交 Issue 和 Pull Request！

Fork 项目

创建功能分支 (git checkout -b feature/AmazingFeature)

提交更改 (git commit -m 'Add some AmazingFeature')

推送到分支 (git push origin feature/AmazingFeature)

开启 Pull Request

📄 许可证
本项目采用 MIT 许可证 - 查看 LICENSE 文件了解详情

🆘 故障排除
常见问题
Firebase 错误 - 检查环境变量配置

CORS 错误 - 确认域名在 Firebase 授权列表中

PWA 不工作 - 检查 HTTPS 和 Manifest 配置

获取帮助
📧 邮箱: [你的邮箱]

🐛 提交 Issue

💬 讨论区: [GitHub Discussions]

🙏 致谢
Firebase - 后端服务

Vercel - 部署平台

iTunes API - 歌曲数据