# 🍵 喜茶后台管理系统

基于 Vue 3 + Element Plus + ECharts 的现代化后台管理系统

## 项目规划

后台最终功能、页面结构、角色权限、接口清单、数据模型、实施阶段和验收标准统一参见：

- [喜茶后台管理系统项目规划](docs/喜茶后台管理系统项目规划.md)

## ✨ 功能特性

- ✅ 用户登录与权限管理
- ✅ 数据可视化仪表盘
- ✅ 商品管理（列表/添加/编辑/删除）
- ✅ 订单管理（列表/详情/状态更新）
- ✅ 响应式设计，支持移动端

## 🛠️ 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI 组件**: Element Plus
- **图表库**: ECharts
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP 客户端**: Axios
- **样式**: SCSS

## 📦 项目结构

```
heytea-admin/
├── src/
│   ├── layout/              # 布局组件
│   │   └── MainLayout.vue   # 主框架布局
│   ├── views/              # 页面
│   │   ├── Dashboard.vue   # 仪表盘
│   │   ├── Login.vue       # 登录页
│   │   ├── Product/        # 商品管理
│   │   │   ├── List.vue    # 商品列表
│   │   │   └── Edit.vue    # 添加/编辑商品
│   │   └── Order/          # 订单管理
│   │       ├── List.vue    # 订单列表
│   │       └── Detail.vue  # 订单详情
│   ├── stores/             # 状态管理
│   │   └── user.js         # 用户 Store
│   ├── router/             # 路由配置
│   │   └── index.js
│   ├── styles/             # 全局样式
│   │   └── index.scss
│   ├── App.vue             # 根组件
│   └── main.js             # 入口文件
├── index.html
├── vite.config.js
└── package.json
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:5174

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产构建

```bash
npm run preview
```

## 🔑 测试账号

```
用户名: admin
密码: 123456
```

## 📋 功能模块

### 1. 仪表盘
- 实时数据统计（今日订单、销售额、待处理订单、商品总数）
- 销售趋势图表（近7天）
- 订单状态分布饼图
- 热销商品 TOP 5

### 2. 商品管理
- 商品列表展示（支持搜索、筛选）
- 添加/编辑商品
- 商品上下架
- 批量操作

### 3. 订单管理
- 订单列表（支持按状态筛选）
- 订单详情查看
- 订单状态更新
- 订单取消

## 🔧 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

## 🎨 页面截图

### 登录页
- 渐变背景
- 表单验证

### 仪表盘
- 数据卡片
- ECharts 图表
- 响应式布局

### 商品管理
- 表格展示
- 搜索筛选
- CRUD 操作

### 订单管理
- 状态标签
- 详情查看
- 状态流转

## 📝 开发说明

### 对接后端 API

目前所有数据都是 Mock 数据，需要对接真实后端 API：

1. 在 `src/api/` 目录创建 API 模块
2. 使用 Axios 配置请求拦截器
3. 替换各页面中的 Mock 数据

示例：

```javascript
// src/api/product.js
import axios from 'axios'

export const productApi = {
  // 获取商品列表
  getList(params) {
    return axios.get('/api/products', { params })
  },
  
  // 获取商品详情
  getDetail(id) {
    return axios.get(`/api/products/${id}`)
  },
  
  // 添加商品
  create(data) {
    return axios.post('/api/products', data)
  },
  
  // 更新商品
  update(id, data) {
    return axios.put(`/api/products/${id}`, data)
  },
  
  // 删除商品
  delete(id) {
    return axios.delete(`/api/products/${id}`)
  }
}
```

### 路由守卫

已配置路由守卫，未登录用户会自动跳转到登录页。

### 权限管理

可以在 `src/stores/user.js` 中扩展权限管理逻辑。

## 📄 许可证

MIT License

## 👨‍💻 作者

Kiro AI

---

**如有问题，请提交 Issue** 🐛
