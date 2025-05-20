# Letter Club

## 项目简介

Letter Club 是一个基于 React Native 和 Expo 的移动应用程序，提供用户友好的界面和流畅的用户体验。

## 安装与设置

### 前提条件

- Node.js (推荐 v16+)
- npm 或 yarn
- Expo CLI

### 安装步骤

1. 克隆仓库：
   ```bash
   git clone https://github.com/yourusername/letter-club.git
   cd letter-club
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动应用：
   ```bash
   npx expo start
   ```

## Node.js 兼容性配置

本项目使用了一些需要 Node.js 模块的库（如 WebSockets），但 React Native 环境下并不直接支持这些模块。我们通过以下配置解决了这些兼容性问题：

### Polyfill 配置

项目中包含了特定平台的 polyfill 文件：
- `polyfills.ios.js`：iOS 平台的 polyfill
- `polyfills.android.js`：Android 平台的 polyfill

这些文件提供了在 React Native 环境中模拟 Node.js 功能所需的全局对象和函数。

### Metro 配置

`metro.config.js` 文件配置了各种 Node.js 模块的 polyfill，包括：
- stream
- crypto
- http/https
- url
- buffer
- assert
- 等等...

## 主要依赖

- React Native
- Expo
- Supabase (后端服务)
- React Native URL Polyfill
- 各种 Node.js 兼容性库

## 常见问题与解决方案

### WebSocket 相关错误

如果遇到 WebSocket 相关错误，请确保：
1. 已正确安装所有 polyfill 依赖
2. 在应用入口点导入了 polyfill 文件
3. Metro 配置包含所有必要的 Node.js 模块映射

### Metro 绑定失败

如果遇到 Metro 绑定失败，尝试：
1. 清除缓存：`npx expo start --clear`
2. 检查是否缺少依赖
3. 确认 Metro 配置是否正确
