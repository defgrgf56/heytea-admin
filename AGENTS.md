# Repository Guidelines

## 项目结构与模块组织

本仓库是基于 Vue 3、Vite、Element Plus、Pinia、Vue Router、Axios 与 ECharts 的喜茶后台管理系统。源码集中在 `src/`：`main.js` 负责应用启动、插件注册和登录态恢复；`App.vue` 是根组件；`src/router/` 管理路由；`src/stores/` 放置 Pinia 状态；`src/api/` 放置按业务域拆分的接口模块和 Axios 封装；`src/layout/` 放置后台主布局；`src/views/` 按业务模块组织页面，如 `Product/`、`Order/`、`Store/`、`User/`、`Address/`、`Category/`。全局样式位于 `src/styles/index.scss`。`dist/` 是构建产物，不要手动编辑。

## 构建、测试与本地开发命令

- `npm install`：根据 `package-lock.json` 安装依赖。
- `npm run dev`：启动 Vite 开发服务器，默认端口为 `5174`。
- `npm run build`：生成生产构建到 `dist/`，提交前至少执行一次。
- `npm run preview`：本地预览生产构建，用于发布前冒烟检查。

当前没有独立的 `test` 或 `lint` 脚本；如后续添加，请同步更新 `package.json` 和本文档。

## 编码风格与命名约定

遵循现有 Vue SFC 写法和 Composition API 风格。模板与 JavaScript 对象使用两个空格缩进；JavaScript 使用单引号、不加分号；`src` 路径优先使用 `@` 别名。页面文件按业务和用途命名，例如 `src/views/Product/List.vue`、`src/views/Order/Detail.vue`。接口文件保持业务域聚合，例如 `product.js`、`order.js`、`request.js`。

所有源码、配置、中文注释、日志和文档必须使用 UTF-8 无 BOM。保留已有关键业务注释；新增注释说明“为什么这样做”，避免复述代码。

## 测试指南

仓库暂未配置自动化测试框架。修改后请执行 `npm run build`，并手动检查登录、导航、受影响的 CRUD 页面、接口错误提示和响应式布局。若引入测试，建议使用 Vitest 与 Vue Test Utils，测试文件命名为 `*.spec.js`，可放在相邻目录或 `src/__tests__/`。

## 提交与 Pull Request 规范

历史提交使用简短的约定式前缀，例如 `feat:`、`docs:`，中文摘要可接受，如 `feat: 完整实现喜茶后台管理系统`。保持单次提交聚焦；功能改动与编码、注释清理尽量分开。

PR 应包含变更说明、影响模块、验证步骤、关联 Issue（如有）以及界面变更截图或录屏。涉及接口契约或环境变量时需特别说明，例如 `VITE_API_BASE_URL`。

## Agent 专用说明

AI 面向用户的每次回复都应以 `vans_sx说过，` 开头。执行代码或文档改动前先确认仓库上下文，避免覆盖用户已有改动。
