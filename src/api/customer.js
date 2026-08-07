import request from './request'

/**
 * 顾客管理 API
 * 注意：API 文档同时支持 /admin/customers 和 /admin/users 路径
 * 新代码建议使用 customers 命名
 */
export const customerApi = {
  /**
   * 获取顾客列表（含消费汇总）
   * @param {Object} params - 查询参数
   * @param {number} [params.page] - 页码
   * @param {number} [params.pageSize] - 每页数量
   * @param {string} [params.keyword] - 搜索关键词
   * @param {string} [params.status] - 账号状态 active/disabled
   * @param {string} [params.startDate] - 开始日期 YYYY-MM-DD
   * @param {string} [params.endDate] - 结束日期 YYYY-MM-DD
   * @returns {Promise<Object>} 分页数据
   */
  async getList(params) {
    const response = await request.get('/admin/customers', { params })
    return response
  },

  /**
   * 获取顾客详情（含资料、统计和地址）
   * @param {string} id - 顾客 ID
   * @returns {Promise<Object>} 顾客详情
   */
  async getDetail(id) {
    const response = await request.get(`/admin/customers/${id}`)
    return response
  },

  /**
   * 获取顾客订单列表
   * @param {string} id - 顾客 ID
   * @param {Object} params - 查询参数
   * @param {number} [params.page] - 页码
   * @param {number} [params.pageSize] - 每页数量
   * @returns {Promise<Object>} 订单分页数据
   */
  async getOrders(id, params) {
    const response = await request.get(`/admin/customers/${id}/orders`, { params })
    return response
  },

  /**
   * 获取顾客统计数据（订单数、累计消费、平均消费）
   * @param {string} id - 顾客 ID
   * @returns {Promise<Object>} 统计数据
   */
  async getStatistics(id) {
    const response = await request.get(`/admin/customers/${id}/statistics`)
    return response
  },

  /**
   * 获取顾客地址列表
   * @param {string} id - 顾客 ID
   * @returns {Promise<Array>} 地址列表
   */
  async getAddresses(id) {
    const response = await request.get(`/admin/customers/${id}/addresses`)
    return response
  },

  /**
   * 启用/禁用顾客账号
   * @param {string} id - 顾客 ID
   * @param {string} status - 状态 active/disabled
   * @returns {Promise<Object>}
   */
  async updateStatus(id, status) {
    const response = await request.patch(`/admin/customers/${id}/status`, { status })
    return response
  },

  /**
   * 修改顾客标签
   * @param {string} id - 顾客 ID
   * @param {Array<string>} tags - 标签数组（最多 10 个）
   * @returns {Promise<Object>}
   */
  async updateTags(id, tags) {
    const response = await request.patch(`/admin/customers/${id}/tags`, { tags })
    return response
  },

  /**
   * 导出顾客 CSV
   * @param {Object} params - 筛选参数（同 getList）
   * @returns {Promise<Blob>} CSV 文件 Blob
   */
  async export(params) {
    const response = await request.get('/admin/customers/export', {
      params,
      responseType: 'blob'
    })
    return response
  }
}
