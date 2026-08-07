/**
 * API 统一导出文件
 * 使用方式：import { authApi, productApi } from '@/api'
 */

export { authApi } from './auth'
export { productApi } from './product'
export { categoryApi } from './category'
export { orderApi } from './order'
export { customerApi } from './customer'
export { addressApi } from './address'
export { storeApi } from './store'
export { dashboardApi } from './dashboard'
export { staffApi } from './staff'
export { roleApi } from './role'
export { menuApi } from './menu'
export { operationLogApi } from './operationLog'
export { uploadApi } from './upload'

// 默认导出 request 实例
export { default as request } from './request'
