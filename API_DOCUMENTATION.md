# 喜茶后台管理系统 API 文档

## 基础信息

**API 基础地址：** `https://haonan.online/api/tea-demo/v1`

**认证方式：** Bearer Token

**请求头：**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**统一响应格式：**
```json
{
  "success": true,
  "message": "success",
  "data": {}
}
```

---

## 目录

1. [认证相关 API](#1-认证相关-api)
2. [用户管理 API](#2-用户管理-api)
3. [商品管理 API](#3-商品管理-api)
4. [商品分类管理 API](#4-商品分类管理-api)
5. [订单管理 API](#5-订单管理-api)
6. [门店管理 API](#6-门店管理-api)
7. [收货地址管理 API](#7-收货地址管理-api)

---

## 1. 认证相关 API

### 1.1 管理员登录

**接口：** `POST /auth/login`

**请求参数：**
```json
{
  "identifier": "admin",
  "password": "123456"
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "username": "admin",
      "name": "管理员",
      "email": "admin@heytea.com",
      "role": "admin",
      "avatar": "https://..."
    }
  }
}
```

### 1.2 获取当前用户信息

**接口：** `GET /auth/me`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "username": "admin",
    "name": "管理员",
    "role": "admin"
  }
}
```

### 1.3 退出登录

**接口：** `POST /auth/logout`

**响应示例：**
```json
{
  "success": true,
  "message": "退出成功"
}
```

---

## 2. 用户管理 API

### 2.1 获取用户列表

**接口：** `GET /admin/users`

**请求参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页数量 |
| keyword | string | 否 | 搜索关键词（用户名/邮箱/手机号） |
| status | string | 否 | 用户状态 (active/disabled) |
| tag | string | 否 | 用户标签 (vip/new/active) |

**响应示例：**
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": "1",
        "username": "张三",
        "email": "zhangsan@example.com",
        "phone": "13800138000",
        "avatar": "https://...",
        "status": "active",
        "tags": ["vip", "active"],
        "orderCount": 25,
        "totalSpent": 2680,
        "createdAt": "2026-01-15T10:30:00Z",
        "lastLoginAt": "2026-07-23T08:15:00Z"
      }
    ],
    "total": 100
  }
}
```

### 2.2 获取用户详情

**接口：** `GET /admin/users/:id`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "username": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "avatar": "https://...",
    "gender": "male",
    "birthday": "1995-06-15",
    "status": "active",
    "tags": ["vip", "active"],
    "createdAt": "2026-01-15T10:30:00Z",
    "lastLoginAt": "2026-07-23T08:15:00Z",
    "addresses": [
      {
        "id": "1",
        "receiverName": "张三",
        "receiverPhone": "13800138000",
        "province": "广东省",
        "city": "深圳市",
        "district": "南山区",
        "detailAddress": "科技园南区10栋A座",
        "isDefault": true
      }
    ]
  }
}
```

### 2.3 更新用户状态

**接口：** `PATCH /admin/users/:id/status`

**请求参数：**
```json
{
  "status": "active"
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "状态更新成功"
}
```

### 2.4 更新用户标签

**接口：** `PATCH /admin/users/:id/tags`

**请求参数：**
```json
{
  "tags": ["vip", "new", "active"]
}
```

### 2.5 获取用户订单历史

**接口：** `GET /admin/users/:id/orders`

**请求参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

**响应示例：**
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": "1",
        "orderNo": "HT202607230001",
        "items": [
          { "name": "多肉葡萄", "quantity": 2 }
        ],
        "totalAmount": 58,
        "status": "completed",
        "createdAt": "2026-07-23T14:30:00Z"
      }
    ],
    "total": 25
  }
}
```

### 2.6 获取用户消费统计

**接口：** `GET /admin/users/:id/statistics`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "orderCount": 25,
    "totalSpent": 2680,
    "avgOrderAmount": 107.2,
    "favoriteCount": 8
  }
}
```

### 2.7 删除用户

**接口：** `DELETE /admin/users/:id`

### 2.8 重置用户密码

**接口：** `POST /admin/users/:id/reset-password`

**请求参数：**
```json
{
  "newPassword": "123456"
}
```

### 2.9 导出用户数据

**接口：** `GET /admin/users/export`

**响应：** Excel 文件流

---

## 3. 商品管理 API

### 3.1 获取商品列表

**接口：** `GET /admin/products`

**请求参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页数量 |
| keyword | string | 否 | 搜索关键词 |
| status | string | 否 | 商品状态 (ON_SALE/OFF_SALE) |

**响应示例：**
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": "1",
        "name": "多肉葡萄",
        "nameEn": "Juicy Grape",
        "desc": "满杯葡萄果肉和清爽茶底",
        "price": 26,
        "category": "fruit",
        "categoryCode": "fruit",
        "categoryName": "水果茶",
        "image": "https://...",
        "imageUrl": "https://...",
        "stock": 999,
        "status": "ON_SALE",
        "isNew": false,
        "isHot": true,
        "sort": 10,
        "createdAt": "2026-01-15T10:30:00Z"
      }
    ],
    "total": 50
  }
}
```

### 3.2 获取商品详情

**接口：** `GET /admin/products/:id`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "多肉葡萄",
    "nameEn": "Juicy Grape",
    "desc": "满杯葡萄果肉和清爽茶底",
    "description": "满杯葡萄果肉和清爽茶底",
    "price": 26,
    "category": "fruit",
    "image": "https://...",
    "stock": 999,
    "status": "ON_SALE",
    "isNew": false,
    "isHot": true,
    "sort": 10,
    "specs": {
      "sizes": [
        { "code": "small", "name": "小杯", "extraPrice": -2 },
        { "code": "medium", "name": "中杯", "extraPrice": 0 },
        { "code": "large", "name": "大杯", "extraPrice": 3 }
      ],
      "sweetness": [
        { "code": "none", "name": "无糖" },
        { "code": "less", "name": "少糖" },
        { "code": "normal", "name": "正常糖" }
      ],
      "toppings": [
        { "code": "pearl", "name": "珍珠", "price": 3 },
        { "code": "coconut", "name": "椰果", "price": 3 }
      ]
    }
  }
}
```

### 3.3 添加商品

**接口：** `POST /admin/products`

**请求参数：**
```json
{
  "name": "多肉葡萄",
  "nameEn": "Juicy Grape",
  "desc": "满杯葡萄果肉和清爽茶底",
  "price": 26,
  "category": "fruit",
  "image": "https://...",
  "stock": 999,
  "status": "ON_SALE",
  "isNew": false,
  "isHot": true
}
```

### 3.4 更新商品

**接口：** `PUT /admin/products/:id`

**请求参数：** 同添加商品

### 3.5 删除商品

**接口：** `DELETE /admin/products/:id`

### 3.6 更新商品状态

**接口：** `PATCH /admin/products/:id/status`

**请求参数：**
```json
{
  "status": "ON_SALE"
}
```

---

## 4. 商品分类管理 API

### 4.1 获取分类列表

**接口：** `GET /admin/categories`

**请求参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页数量 |
| keyword | string | 否 | 搜索关键词 |

**响应示例：**
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": "1",
        "code": "fruit",
        "name": "水果茶",
        "nameEn": "Fruit Tea",
        "icon": "🍇",
        "sort": 1,
        "status": "active",
        "productCount": 15,
        "createdAt": "2026-07-23T10:00:00Z"
      }
    ],
    "total": 10
  }
}
```

### 4.2 获取所有分类（不分页）

**接口：** `GET /admin/categories/all`

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "code": "fruit",
      "name": "水果茶",
      "nameEn": "Fruit Tea",
      "icon": "🍇"
    }
  ]
}
```

### 4.3 添加分类

**接口：** `POST /admin/categories`

**请求参数：**
```json
{
  "code": "fruit",
  "name": "水果茶",
  "nameEn": "Fruit Tea",
  "icon": "🍇",
  "sort": 1,
  "status": "active"
}
```

### 4.4 更新分类

**接口：** `PUT /admin/categories/:id`

**请求参数：** 同添加分类

### 4.5 删除分类

**接口：** `DELETE /admin/categories/:id`

### 4.6 更新分类状态

**接口：** `PATCH /admin/categories/:id/status`

**请求参数：**
```json
{
  "status": "active"
}
```

### 4.7 更新分类排序

**接口：** `PATCH /admin/categories/:id/sort`

**请求参数：**
```json
{
  "sort": 1
}
```

---

## 5. 订单管理 API

### 5.1 获取订单列表

**接口：** `GET /admin/orders`

**请求参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页数量 |
| status | string | 否 | 订单状态 |
| keyword | string | 否 | 搜索关键词 |

**响应示例：**
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": "1",
        "orderNo": "HT202608070001",
        "userName": "张三",
        "items": [
          { "name": "多肉葡萄", "quantity": 2 },
          { "name": "芝士莓莓", "quantity": 1 }
        ],
        "totalAmount": 82,
        "status": "confirmed",
        "createdAt": "2026-08-07T14:23:15Z"
      }
    ],
    "total": 100
  }
}
```

### 5.2 获取订单详情

**接口：** `GET /admin/orders/:id`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "orderNo": "HT202608070001",
    "createdAt": "2026-08-07T14:23:15Z",
    "status": "confirmed",
    "payMethod": "微信支付",
    "userName": "张三",
    "phone": "138****5678",
    "address": "广东省深圳市南山区科技园南区深圳湾科技生态园10栋A座",
    "items": [
      {
        "name": "多肉葡萄",
        "specs": "中杯 / 正常糖 / 加珍珠",
        "price": 29,
        "quantity": 2
      }
    ],
    "goodsAmount": 89,
    "deliveryFee": 5,
    "totalAmount": 94
  }
}
```

### 5.3 更新订单状态

**接口：** `PATCH /admin/orders/:id/status`

**请求参数：**
```json
{
  "status": "preparing"
}
```

**状态值：**
- `pending` - 待支付
- `confirmed` - 已确认
- `preparing` - 制作中
- `delivering` - 配送中
- `completed` - 已完成
- `cancelled` - 已取消

### 5.4 获取订单统计

**接口：** `GET /admin/orders/statistics`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "todayOrders": 156,
    "todayRevenue": 8920,
    "pendingOrders": 23,
    "processingOrders": 45
  }
}
```

---

## 6. 门店管理 API

### 6.1 获取门店列表

**接口：** `GET /admin/stores`

**请求参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页数量 |
| keyword | string | 否 | 搜索关键词 |
| status | string | 否 | 门店状态 (open/closed/maintenance) |
| city | string | 否 | 城市筛选 |

**响应示例：**
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": "1",
        "name": "深圳科技园店",
        "image": "https://...",
        "city": "深圳市",
        "district": "南山区",
        "address": "科技园南区10栋A座",
        "phone": "0755-12345678",
        "openTime": "09:00",
        "closeTime": "22:00",
        "status": "open",
        "createdAt": "2026-07-23T10:00:00Z"
      }
    ],
    "total": 50
  }
}
```

### 6.2 获取门店详情

**接口：** `GET /admin/stores/:id`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "深圳科技园店",
    "image": "https://...",
    "city": "深圳市",
    "district": "南山区",
    "address": "科技园南区10栋A座",
    "latitude": 22.5431,
    "longitude": 114.0579,
    "phone": "0755-12345678",
    "openTime": "09:00",
    "closeTime": "22:00",
    "status": "open",
    "features": "提供外卖服务、支持到店自提",
    "parking": "商场地下停车场，前2小时免费",
    "createdAt": "2026-07-23T10:00:00Z"
  }
}
```

### 6.3 添加门店

**接口：** `POST /admin/stores`

**请求参数：**
```json
{
  "name": "深圳科技园店",
  "image": "https://...",
  "city": "深圳市",
  "district": "南山区",
  "address": "科技园南区10栋A座",
  "latitude": 22.5431,
  "longitude": 114.0579,
  "phone": "0755-12345678",
  "openTime": "09:00",
  "closeTime": "22:00",
  "status": "open",
  "features": "提供外卖服务",
  "parking": "商场地下停车场"
}
```

### 6.4 更新门店

**接口：** `PUT /admin/stores/:id`

**请求参数：** 同添加门店

### 6.5 删除门店

**接口：** `DELETE /admin/stores/:id`

### 6.6 更新门店状态

**接口：** `PATCH /admin/stores/:id/status`

**请求参数：**
```json
{
  "status": "open"
}
```

**状态值：**
- `open` - 营业中
- `closed` - 已关闭
- `maintenance` - 维护中

### 6.7 获取城市列表

**接口：** `GET /admin/stores/cities`

**响应示例：**
```json
{
  "success": true,
  "data": ["深圳市", "广州市", "北京市", "上海市"]
}
```

### 6.8 上传门店图片

**接口：** `POST /admin/stores/upload`

**请求方式：** `multipart/form-data`

**请求参数：**
- `file`: 图片文件

**响应示例：**
```json
{
  "success": true,
  "data": {
    "url": "https://..."
  }
}
```

---

## 7. 收货地址管理 API

### 7.1 获取地址列表

**接口：** `GET /admin/addresses`

**请求参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页数量 |
| keyword | string | 否 | 搜索关键词 |
| userId | string | 否 | 用户 ID 筛选 |
| province | string | 否 | 省份筛选 |
| city | string | 否 | 城市筛选 |

**响应示例：**
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": "1",
        "userId": "100",
        "userName": "张三",
        "receiverName": "张三",
        "receiverPhone": "13800138000",
        "province": "广东省",
        "city": "深圳市",
        "district": "南山区",
        "detailAddress": "科技园南区10栋A座",
        "isDefault": true,
        "label": "家",
        "createdAt": "2026-07-23T10:00:00Z"
      }
    ],
    "total": 200
  }
}
```

### 7.2 获取用户的地址列表

**接口：** `GET /admin/users/:userId/addresses`

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "receiverName": "张三",
      "receiverPhone": "13800138000",
      "province": "广东省",
      "city": "深圳市",
      "district": "南山区",
      "detailAddress": "科技园南区10栋A座",
      "isDefault": true,
      "label": "家"
    }
  ]
}
```

### 7.3 删除地址

**接口：** `DELETE /admin/addresses/:id`

### 7.4 获取省份列表

**接口：** `GET /admin/addresses/provinces`

**响应示例：**
```json
{
  "success": true,
  "data": ["广东省", "北京市", "上海市", "浙江省"]
}
```

### 7.5 获取城市列表

**接口：** `GET /admin/addresses/cities`

**请求参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| province | string | 是 | 省份 |

**响应示例：**
```json
{
  "success": true,
  "data": ["深圳市", "广州市", "东莞市", "珠海市"]
}
```

### 7.6 获取区域列表

**接口：** `GET /admin/addresses/districts`

**请求参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| city | string | 是 | 城市 |

**响应示例：**
```json
{
  "success": true,
  "data": ["南山区", "福田区", "罗湖区", "宝安区"]
}
```

### 7.7 获取地址统计

**接口：** `GET /admin/addresses/statistics`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "totalCount": 1258,
    "userCount": 856,
    "defaultCount": 856
  }
}
```

### 7.8 导出地址数据

**接口：** `GET /admin/addresses/export`

**请求参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| province | string | 否 | 省份筛选 |
| city | string | 否 | 城市筛选 |

**响应：** Excel 文件流

---

## 附录

### A. 错误码说明

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 没有权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

### B. 状态码对照表

#### 用户状态
- `active` - 正常
- `disabled` - 已禁用

#### 用户标签
- `vip` - VIP 用户
- `new` - 新用户
- `active` - 活跃用户

#### 商品状态
- `ON_SALE` - 已上架
- `OFF_SALE` - 已下架

#### 订单状态
- `pending` - 待支付
- `confirmed` - 已确认
- `preparing` - 制作中
- `delivering` - 配送中
- `completed` - 已完成
- `cancelled` - 已取消

#### 门店状态
- `open` - 营业中
- `closed` - 已关闭
- `maintenance` - 维护中

#### 分类状态
- `active` - 启用
- `inactive` - 禁用

---

## 开发建议

1. **认证处理**
   - 登录后将 Token 存储在 `localStorage`
   - 每次请求在 Header 中携带 Token
   - Token 过期时自动跳转到登录页

2. **错误处理**
   - 统一在 axios 拦截器中处理错误
   - 401 错误清除 Token 并跳转登录
   - 其他错误显示友好提示

3. **数据格式**
   - 所有日期时间使用 ISO 8601 格式
   - 金额单位为元，保留 2 位小数
   - 分页参数统一使用 page/pageSize

4. **文件上传**
   - 图片大小限制：2MB
   - 支持格式：jpg, jpeg, png, gif
   - 使用 FormData 上传

---

**文档版本：** v1.0.0  
**更新时间：** 2026-07-23  
**维护者：** 喜茶技术团队
