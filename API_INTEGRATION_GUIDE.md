# API 对接完成说明

## 📋 对接概览

喜茶后台管理系统已完成与 `tea-demo-api` 的完整对接，所有业务模块的 API 接口均已实现。

**Base URL**: `https://haonan.online/api/tea-demo/v1`

## ✅ 已完成的功能模块

### 1. 认证与安全
- ✅ **RSA-OAEP 加密登录**（Challenge-Response 模式）
- ✅ 注册、登录、退出
- ✅ 修改密码（RSA 加密）
- ✅ 获取当前用户信息（含角色和权限）
- ✅ 动态菜单获取
- ✅ 个人资料修改
- ✅ Token 刷新

**文件**: `src/api/crypto.js`, `src/api/auth.js`

### 2. 商品管理
- ✅ 商品 CRUD
- ✅ 商品状态管理（上架/下架/售罄）
- ✅ 批量修改商品状态
- ✅ 商品规格配置
- ✅ 获取公开商品分类

**文件**: `src/api/product.js`

### 3. 分类管理
- ✅ 分类 CRUD
- ✅ 分类状态管理（启用/停用）
- ✅ 分类排序
- ✅ 分类下拉列表

**文件**: `src/api/category.js`

### 4. 订单管理
- ✅ 订单列表查询（支持多条件筛选）
- ✅ 订单详情（含商品和状态历史）
- ✅ 订单状态流转
- ✅ 订单统计
- ✅ 订单导出（CSV）

**文件**: `src/api/order.js`

### 5. 顾客管理
- ✅ 顾客列表（含消费汇总）
- ✅ 顾客详情
- ✅ 顾客订单查询
- ✅ 顾客消费统计
- ✅ 顾客地址列表
- ✅ 顾客状态管理
- ✅ 顾客标签管理
- ✅ 顾客导出（CSV）

**文件**: `src/api/customer.js`

### 6. 地址管理
- ✅ 地址列表查询
- ✅ 地址详情
- ✅ 地址统计
- ✅ 省市区三级联动
- ✅ 地址删除
- ✅ 地址导出（CSV）

**文件**: `src/api/address.js`

### 7. 门店管理
- ✅ 门店 CRUD
- ✅ 门店状态管理
- ✅ 门店城市列表
- ✅ 门店下拉列表
- ✅ 门店图片上传

**文件**: `src/api/store.js`

### 8. 工作台
- ✅ 汇总数据（今日订单/销售额、待处理订单等）
- ✅ 销售趋势分析
- ✅ 订单状态分布
- ✅ 热销商品 TOP N
- ✅ 最近订单

**文件**: `src/api/dashboard.js`

### 9. 管理员管理
- ✅ 管理员 CRUD
- ✅ 管理员状态管理
- ✅ 角色分配
- ✅ 重置密码（生成临时密码）

**文件**: `src/api/staff.js`

### 10. 角色权限
- ✅ 角色 CRUD
- ✅ 角色状态管理
- ✅ 权限分配
- ✅ 菜单分配
- ✅ 角色下拉列表

**文件**: `src/api/role.js`

### 11. 菜单管理
- ✅ 菜单树查询
- ✅ 菜单 CRUD
- ✅ 菜单状态管理
- ✅ 菜单排序
- ✅ 支持目录/菜单/按钮三种类型

**文件**: `src/api/menu.js`

### 12. 操作日志
- ✅ 操作日志查询（支持多条件筛选）
- ✅ 操作日志详情

**文件**: `src/api/operationLog.js`

### 13. 文件上传
- ✅ 图片上传（JPG/PNG/WEBP，最大 2 MB）
- ✅ 客户端文件验证
- ✅ FormData 自动处理

**文件**: `src/api/upload.js`

### 14. User Store
- ✅ 移除测试账号逻辑
- ✅ 使用真实 RSA 加密登录
- ✅ 权限和角色管理
- ✅ 动态菜单支持
- ✅ 个人资料和密码修改

**文件**: `src/stores/user.js`

## 📦 使用方式

### 1. 统一导入
```javascript
import { authApi, productApi, orderApi } from '@/api'
```

### 2. 登录示例
```javascript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 登录（自动进行 RSA 加密）
await userStore.login({
  username: 'admin',
  password: '123456'
})
```

### 3. 调用业务接口
```javascript
import { productApi } from '@/api'

// 获取商品列表
const products = await productApi.getList({
  page: 1,
  pageSize: 20,
  keyword: '葡萄',
  status: 'ON_SALE'
})

// 批量修改商品状态
await productApi.batchUpdateStatus(['id1', 'id2'], 'OFF_SALE')
```

### 4. 文件上传
```javascript
import { uploadApi } from '@/api'

// 上传图片（带验证）
const result = await uploadApi.uploadImageWithValidation(file)
console.log('图片 URL:', result.data.url)
```

### 5. CSV 导出
```javascript
import { orderApi } from '@/api'

// 导出订单
const blob = await orderApi.export({ status: 'completed' })

// 下载文件
const url = URL.createObjectURL(blob)
const link = document.createElement('a')
link.href = url
link.download = 'orders.csv'
link.click()
URL.revokeObjectURL(url)
```

## 🔐 测试账号

| 用户名 | 密码 | 角色 | 权限范围 |
|---|---|---|---|
| `admin` | `123456` | 超级管理员 | 全部功能 |
| `productop` | `123456` | 商品运营 | 商品、分类管理 |
| `service` | `123456` | 订单客服 | 订单、顾客管理 |
| `storemgr` | `123456` | 门店经理 | 门店管理 |

## 🔧 核心特性

### RSA 加密登录流程
1. 前端调用 `/auth/challenge?purpose=login` 获取 Challenge
2. 后端返回 `challengeId`、`nonce`、RSA 公钥
3. 前端使用 Web Crypto API 进行 RSA-OAEP-SHA256 加密
4. 前端提交加密后的 Base64 密文
5. 后端解密验证并返回 Token

### 统一错误处理
- 401: 自动清除 Token 并跳转登录页
- 403: 显示无权限提示
- 409: 业务冲突，显示详细错误信息
- 其他: 显示友好的错误提示

### 响应拦截
所有接口响应统一解包，直接返回 `data` 字段：
```javascript
// 自动解包
const response = await productApi.getList(params)
// response 已经是 data 内容，无需 response.data.data
```

## 📝 注意事项

1. **不要直接传输明文密码**
   - 登录、注册、改密都使用 RSA 加密
   - Challenge 有效期 2 分钟，用完即失效

2. **CSV 导出需要设置 responseType**
   ```javascript
   responseType: 'blob'
   ```

3. **FormData 上传不要手动设置 Content-Type**
   浏览器会自动添加 multipart boundary

4. **订单状态流转有严格规则**
   ```
   pending -> confirmed -> preparing -> delivering -> completed
      |          |            |
      +----------+------------+-> cancelled
   ```

5. **角色权限修改后旧 Token 失效**
   修改角色权限后，相关管理员需要重新登录

6. **ID 使用 MongoDB ObjectId 格式**
   24 位十六进制字符串，例如 `66b1e8c304da2123db1e0011`

## 🎯 下一步建议

1. **路由守卫**：在 `router/index.js` 中添加权限验证
2. **权限指令**：创建 `v-permission` 自定义指令
3. **菜单渲染**：根据 `/auth/menus` 动态生成侧边栏
4. **组件开发**：基于 API 实现各业务模块的页面组件
5. **错误边界**：添加全局错误处理和用户友好提示

## 📚 参考文档

- API 详细文档: `tea-demo-api.md`
- 项目规划: `docs/喜茶后台管理系统项目规划.md`
- 代理规则: `AGENTS.md`

---

**对接完成时间**: 2026-08-07  
**API 版本**: v1  
**文档版本**: v2.0
