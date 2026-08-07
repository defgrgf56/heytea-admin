import request from './request'

/**
 * 订单管理 API
 */
export const orderApi = {
  /**
   * 获取订单列表
   * @param {Object} params - 查询参数
   * @param {number} [params.page] - 页码
   * @param {number} [params.pageSize] - 每页数量
   * @param {string} [params.status] - 订单状态 pending/confirmed/preparing/delivering/completed/cancelled
   * @param {string} [params.keyword] - 搜索关键词（订单号、用户名）
   * @param {string} [params.userId] - 用户 ID
   * @param {string} [params.startDate] - 开始日期 YYYY-MM-DD
   * @param {string} [params.endDate] - 结束日期 YYYY-MM-DD
   * @returns {Promise<Object>} 分页数据
   */
  async getList(params) {
    const response = await request.get('/admin/orders', { params })
    return response
  },

  /**
   * 获取订单详情（含商品和状态历史）
   * @param {string} id - 订单 ID
   * @returns {Promise<Object>} 订单详情
   */
  async getDetail(id) {
    const response = await request.get(`/admin/orders/${id}`)
    return response
  },

  /**
   * 更新订单状态（执行合法状态流转）
   * @param {string} id - 订单 ID
   * @param {string} status - 新状态 confirmed/preparing/delivering/completed/cancelled
   * @returns {Promise<Object>}
   */
  async updateStatus(id, status) {
    const response = await request.patch(`/admin/orders/${id}/status`, { status })
    return response
  },

  /**
   * 获取订单统计数据（今日及状态统计）
   * @returns {Promise<Object>} 统计数据
   */
  async getStatistics() {
    const response = await request.get('/admin/orders/statistics')
    return response
  },

  /**
   * 导出订单 CSV（按筛选条件）
   * @param {Object} params - 筛选参数（同 getList）
   * @returns {Promise<Blob>} CSV 文件 Blob
   */
  async export(params) {
    const response = await request.get('/admin/orders/export', {
      params,
      responseType: 'blob'
    })
    return response
  }
}
