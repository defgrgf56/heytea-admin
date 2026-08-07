# 🚀 喜茶后台管理系统 - 启动指南

## 📋 目录
1. [项目概览](#项目概览)
2. [安装步骤](#安装步骤)
3. [启动项目](#启动项目)
4. [功能演示](#功能演示)
5. [后续开发](#后续开发)

---

## 🎯 项目概览

**喜茶后台管理系统** 是一个基于 Vue 3 + Element Plus + ECharts 的现代化管理后台。

### 已实现功能

✅ **登录系统** - 用户认证和权限管理  
✅ **仪表盘** - 数据可视化展示（ECharts 图表）  
✅ **商品管理** - 增删改查，上下架  
✅ **订单管理** - 列表查看，状态更新，详情查看  

### 技术栈

- **前端框架**: Vue 3 (Composition API)
- **UI 组件库**: Element Plus
- **图表库**: ECharts
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router

---

## 🛠️ 安装步骤

### 前置要求

确保已安装：
- **Node.js** >= 16.0.0
- **npm** >= 7.0.0

检查版本：
```bash
node -v
npm -v
```

### 步骤 1：进入项目目录

```bash
cd heytea-admin
```

### 步骤 2：安装依赖

```bash
npm install
```

**预计安装时间**: 2-3 分钟

安装的主要依赖：
```json
{
  "vue": "^3.4.0",
  "vue-router": "^4.2.5",
  "pinia": "^2.1.7",
  "element-plus": "^2.5.0",
  "@element-plus/icons-vue": "^2.3.1",
  "echarts": "^5.4.3",
  "axios": "^1.6.0"
}
```

---

## 🚀 启动项目

### 启动开发服务器

```bash
npm run dev
```

**输出示例：**
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: http://192.168.1.100:5174/
  ➜  press h to show help
```

### 访问系统

在浏览器中打开：**http://localhost:5174**

### 测试账号

```
用户名: admin
密码: 123456
```

---

## 🎮 功能演示

### 1. 登录页面

**路径**: `/login`

**功能：**
- 表单验证
- 记住登录状态
- 渐变背景设计

**测试步骤：**
1. 输入用户名：`admin`
2. 输入密码：`123456`
3. 点击"登录"
4. 自动跳转到仪表盘

---

### 2. 仪表盘

**路径**: `/dashboard`

**功能：**
- 📊 实时数据统计卡片
  - 今日订单：126
  - 今日销售额：¥8,542
  - 待处理订单：23
  - 商品总数：156

- 📈 销售趋势图（近7天）
  - 折线图 + 面积图
  - 响应式设计

- 🥧 订单状态分布图
  - 饼图展示
  - 5种状态分类

- 🏆 热销商品 TOP 5
  - 表格展示
  - 销量、价格、销售额统计

**界面预览：**
```
┌─────────────────────────────────────────────┐
│  [今日订单]  [今日销售]  [待处理]  [商品数]   │
│     126       ¥8,542      23       156      │
└─────────────────────────────────────────────┘

┌────────────────────┐ ┌───────────────────┐
│  销售趋势图         │ │  订单状态分布      │
│  [ECharts 折线图]  │ │  [ECharts 饼图]   │
└────────────────────┘ └───────────────────┘

┌─────────────────────────────────────────────┐
│  热销商品 TOP 5                              │
│  [Element Plus Table]                       │
└─────────────────────────────────────────────┘
```

---

### 3. 商品管理

**路径**: `/products`

**功能：**

#### 3.1 商品列表
- ✅ 搜索商品（按名称）
- ✅ 查看商品图片（点击预览大图）
- ✅ 商品信息展示（ID、名称、分类、价格、库存、状态）
- ✅ 商品标签（新品/热销）
- ✅ 分页功能
- ✅ 操作按钮：
  - 编辑
  - 上架/下架
  - 删除

**测试步骤：**
1. 点击侧边栏"商品管理"
2. 查看商品列表
3. 尝试搜索功能
4. 点击"编辑"按钮

#### 3.2 添加/编辑商品
- ✅ 表单验证
- ✅ 商品基本信息（名称、分类、价格、描述）
- ✅ 库存管理
- ✅ 商品状态（上架/下架）
- ✅ 商品标签（新品/热销）

**测试步骤：**
1. 点击"添加商品"按钮
2. 填写表单
3. 点击"保存"
4. 返回商品列表

---

### 4. 订单管理

**路径**: `/orders`

**功能：**

#### 4.1 订单列表
- ✅ 搜索订单（按订单号）
- ✅ 筛选订单（按状态）
  - 待支付
  - 已确认
  - 制作中
  - 配送中
  - 已完成
  - 已取消
- ✅ 订单信息展示
- ✅ 状态标签（不同颜色）
- ✅ 分页功能
- ✅ 快捷操作：
  - 查看详情
  - 开始制作（已确认 → 制作中）
  - 开始配送（制作中 → 配送中）

**测试步骤：**
1. 点击侧边栏"订单管理"
2. 查看订单列表
3. 尝试状态筛选
4. 点击"查看详情"

#### 4.2 订单详情
- ✅ 订单基本信息（订单号、时间、状态、支付方式）
- ✅ 用户信息（姓名、电话、地址）
- ✅ 商品清单（名称、规格、单价、数量、小计）
- ✅ 价格明细（商品总价、配送费、实付金额）
- ✅ 状态更新按钮
- ✅ 取消订单功能

**测试步骤：**
1. 在订单列表点击"查看详情"
2. 查看完整订单信息
3. 尝试更新订单状态
4. 点击"返回"按钮

---

## 🎨 界面特点

### 布局设计

**左侧菜单 + 顶部导航 + 内容区**

```
┌────────────────────────────────────────────┐
│  Logo         [搜索]   [通知] [用户] [退出] │
├─────────┬──────────────────────────────────┤
│ 📊 仪表盘 │                                  │
│         │        内容区域                   │
│ 🛍️ 商品  │                                  │
│   管理   │                                  │
│         │                                  │
│ 📦 订单  │                                  │
│   管理   │                                  │
└─────────┴──────────────────────────────────┘
```

### 配色方案

- **主色调**: #409EFF (Element Plus 蓝)
- **成功色**: #67C23A (绿色)
- **警告色**: #E6A23C (橙色)
- **危险色**: #F56C6C (红色)
- **侧边栏**: #001529 (深色)

### 响应式设计

- ✅ 支持桌面端（1920px+）
- ✅ 支持平板（768px - 1920px）
- ✅ 支持移动端（<768px）
- ✅ 侧边栏可折叠

---

## 🔧 后续开发指南

### 1. 对接后端 API

#### 步骤 1：创建 API 模块

```bash
mkdir src/api
```

创建 `src/api/request.js`（Axios 配置）：

```javascript
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const request = axios.create({
  baseURL: 'https://haonan.online/api/tea-demo/v1',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  }
)

export default request
```

#### 步骤 2：创建 API 接口

创建 `src/api/product.js`：

```javascript
import request from './request'

export const productApi = {
  // 获取商品列表
  getList(params) {
    return request.get('/admin/products', { params })
  },
  
  // 获取商品详情
  getDetail(id) {
    return request.get(`/admin/products/${id}`)
  },
  
  // 添加商品
  create(data) {
    return request.post('/admin/products', data)
  },
  
  // 更新商品
  update(id, data) {
    return request.put(`/admin/products/${id}`, data)
  },
  
  // 删除商品
  delete(id) {
    return request.delete(`/admin/products/${id}`)
  },
  
  // 更新商品状态
  updateStatus(id, status) {
    return request.patch(`/admin/products/${id}/status`, { status })
  }
}
```

创建 `src/api/order.js`：

```javascript
import request from './request'

export const orderApi = {
  // 获取订单列表
  getList(params) {
    return request.get('/admin/orders', { params })
  },
  
  // 获取订单详情
  getDetail(id) {
    return request.get(`/admin/orders/${id}`)
  },
  
  // 更新订单状态
  updateStatus(id, status) {
    return request.put(`/admin/orders/${id}/status`, { status })
  },
  
  // 取消订单
  cancel(id, reason) {
    return request.put(`/admin/orders/${id}/cancel`, { reason })
  }
}
```

#### 步骤 3：替换页面中的 Mock 数据

在 `src/views/Product/List.vue` 中：

```javascript
// 替换前（Mock）
function loadData() {
  loading.value = true
  setTimeout(() => {
    tableData.value = [...]
    loading.value = false
  }, 500)
}

// 替换后（真实 API）
import { productApi } from '@/api/product'

async function loadData() {
  loading.value = true
  try {
    const response = await productApi.getList({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchText.value
    })
    tableData.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    console.error('加载失败:', error)
  } finally {
    loading.value = false
  }
}
```

---

### 2. 添加更多功能

#### 用户管理模块

```bash
mkdir src/views/User
```

创建 `src/views/User/List.vue`

#### 营销管理模块

```bash
mkdir src/views/Marketing
```

创建优惠券、活动管理等页面

#### 数据统计模块

```bash
mkdir src/views/Statistics
```

创建更多数据分析页面

---

### 3. 权限管理

在 `src/router/index.js` 中添加权限检查：

```javascript
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 检查登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
    return
  }
  
  // 检查权限
  if (to.meta.permission) {
    const hasPermission = userStore.user?.permissions?.includes(to.meta.permission)
    if (!hasPermission) {
      ElMessage.error('无权限访问')
      next(from.path)
      return
    }
  }
  
  next()
})
```

---

### 4. 图片上传功能

使用 Element Plus 的 Upload 组件：

```vue
<el-upload
  class="avatar-uploader"
  action="/api/upload"
  :show-file-list="false"
  :on-success="handleUploadSuccess"
>
  <img v-if="form.image" :src="form.image" class="avatar" />
  <el-icon v-else class="avatar-uploader-icon">
    <Plus />
  </el-icon>
</el-upload>
```

---

## 📝 常见问题

### Q1: 启动时报错 "Cannot find module"

**解决方案：**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Q2: 端口 5174 被占用

**解决方案：**

修改 `vite.config.js`：
```javascript
export default defineConfig({
  server: {
    port: 5175  // 改为其他端口
  }
})
```

### Q3: ECharts 图表不显示

**解决方案：**

确保容器有明确的高度：
```css
.chart-container {
  width: 100%;
  height: 300px;  /* 必须设置高度 */
}
```

### Q4: Element Plus 图标不显示

**解决方案：**

确保 `main.js` 中已注册所有图标：
```javascript
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```

---

## 🎓 学习资源

- **Vue 3 官方文档**: https://cn.vuejs.org/
- **Element Plus 文档**: https://element-plus.org/zh-CN/
- **ECharts 文档**: https://echarts.apache.org/zh/index.html
- **Vite 文档**: https://cn.vitejs.dev/
- **Pinia 文档**: https://pinia.vuejs.org/zh/

---

## 📞 技术支持

如有问题，请：
1. 查看本文档的常见问题部分
2. 查看项目 README.md
3. 提交 Issue

---

## ✅ 检查清单

- [ ] 已安装 Node.js 和 npm
- [ ] 已运行 `npm install`
- [ ] 已启动开发服务器 `npm run dev`
- [ ] 能访问登录页 http://localhost:5174
- [ ] 能使用测试账号登录
- [ ] 能看到仪表盘和图表
- [ ] 能访问商品管理页面
- [ ] 能访问订单管理页面

**全部完成？恭喜！🎉 你已成功启动喜茶后台管理系统！**

---

**下一步：** 开始对接真实后端 API，让系统真正运行起来！💪

**文档创建时间**: 2026-08-07  
**版本**: v1.0.0  
