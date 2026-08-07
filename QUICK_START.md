# 快速开始指南

## 🚀 启动项目

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

开发服务器将在 `http://localhost:5174` 启动

### 3. 登录系统

打开浏览器访问 `http://localhost:5174`，使用以下测试账号登录：

#### 超级管理员（推荐）
- **用户名**: `admin`
- **密码**: `123456`
- **权限**: 全部功能

#### 其他测试账号
- **商品运营**: `productop / 123456` - 商品和分类管理
- **订单客服**: `service / 123456` - 订单和顾客管理
- **门店经理**: `storemgr / 123456` - 门店管理

## 🔐 登录流程

系统使用 **RSA-OAEP 加密**登录，确保密码安全传输：

1. 输入用户名和密码
2. 前端自动获取加密 Challenge
3. 使用 RSA 公钥加密凭据
4. 提交加密数据到服务器
5. 服务器验证并返回 Token

**注意**: 所有密码传输都经过 RSA 加密，不会传输明文！

## 📦 项目结构

```
heytea-admin/
├── src/
│   ├── api/              # API 接口层
│   │   ├── crypto.js     # RSA 加密工具
│   │   ├── auth.js       # 认证接口
│   │   ├── product.js    # 商品接口
│   │   ├── category.js   # 分类接口
│   │   ├── order.js      # 订单接口
│   │   ├── customer.js   # 顾客接口
│   │   ├── address.js    # 地址接口
│   │   ├── store.js      # 门店接口
│   │   ├── dashboard.js  # 工作台接口
│   │   ├── staff.js      # 管理员接口
│   │   ├── role.js       # 角色接口
│   │   ├── menu.js       # 菜单接口
│   │   ├── operationLog.js  # 操作日志接口
│   │   ├── upload.js     # 文件上传接口
│   │   ├── request.js    # Axios 封装
│   │   └── index.js      # 统一导出
│   ├── views/            # 页面组件
│   ├── layout/           # 布局组件
│   ├── stores/           # Pinia 状态管理
│   ├── router/           # 路由配置
│   └── styles/           # 全局样式
├── tea-demo-api.md       # API 详细文档
└── API_INTEGRATION_GUIDE.md  # API 对接说明
```

## 💡 常用操作示例

### 登录
```javascript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
await userStore.login({
  username: 'admin',
  password: '123456'
})
```

### 调用 API
```javascript
import { productApi, orderApi } from '@/api'

// 获取商品列表
const products = await productApi.getList({
  page: 1,
  pageSize: 20,
  keyword: '葡萄'
})

// 获取订单列表
const orders = await orderApi.getList({
  page: 1,
  pageSize: 20,
  status: 'pending'
})
```

### 上传图片
```javascript
import { uploadApi } from '@/api'

// 选择文件后上传
const handleUpload = async (file) => {
  try {
    const result = await uploadApi.uploadImageWithValidation(file)
    console.log('图片 URL:', result.data.url)
  } catch (error) {
    console.error('上传失败:', error.message)
  }
}
```

### 导出 CSV
```javascript
import { orderApi } from '@/api'

const handleExport = async () => {
  const blob = await orderApi.export({ status: 'completed' })
  
  // 下载文件
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `orders_${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
```

## 🎯 功能模块

### 已实现
- ✅ 登录/退出（RSA 加密）
- ✅ 工作台（数据统计和图表）
- ✅ 商品管理（CRUD、批量操作）
- ✅ 分类管理
- ✅ 订单管理（状态流转、导出）
- ✅ 顾客管理（标签、统计、导出）
- ✅ 地址管理（省市区联动）
- ✅ 门店管理（图片上传）

### 系统管理（需要超级管理员权限）
- ✅ 管理员管理
- ✅ 角色权限管理
- ✅ 菜单管理
- ✅ 操作日志

## 🔧 环境配置

### 开发环境
`.env.development`
```env
VITE_API_BASE_URL=https://haonan.online/api/tea-demo/v1
VITE_USE_MOCK=false
```

### 生产环境
`.env.production`
```env
VITE_API_BASE_URL=https://haonan.online/api/tea-demo/v1
```

## 📝 注意事项

1. **API Base URL**  
   已配置为线上地址，无需本地启动后端服务

2. **跨域问题**  
   服务端已配置 CORS 白名单，支持常用本地开发端口

3. **Token 过期**  
   Token 有效期为 2 小时，过期后会自动跳转登录页

4. **权限控制**  
   不同账号看到的菜单和功能不同，由后端动态返回

5. **文件上传**  
   图片限制：JPG/PNG/WEBP，最大 2 MB

## 🐛 常见问题

### 登录失败
- 检查网络连接
- 确认用户名和密码正确
- 查看浏览器控制台错误信息

### 接口 401 错误
- Token 已过期，需要重新登录
- 检查 localStorage 中的 `admin_token`

### 接口 403 错误
- 当前账号没有该功能的权限
- 尝试使用 `admin` 超级管理员账号

### 图片上传失败
- 检查文件大小是否超过 2 MB
- 检查文件格式是否为 JPG/PNG/WEBP

## 📚 相关文档

- [API 详细文档](./tea-demo-api.md) - 完整的后端 API 接口说明
- [API 对接指南](./API_INTEGRATION_GUIDE.md) - 前端对接完成情况
- [项目规划](./docs/喜茶后台管理系统项目规划.md) - 详细的功能规划
- [AGENTS 规则](./AGENTS.md) - 仓库开发规范

## 🚀 构建和部署

### 构建生产版本
```bash
npm run build
```

构建产物在 `dist/` 目录

### 预览生产构建
```bash
npm run preview
```

## 🎉 开始使用

1. 启动开发服务器: `npm run dev`
2. 打开浏览器: `http://localhost:5174`
3. 使用 `admin / 123456` 登录
4. 开始探索各个功能模块！

---

**祝你使用愉快！** 🥤
