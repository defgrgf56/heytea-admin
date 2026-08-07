import request from './request'

/**
 * 订单管理 API
 */
export const orderApi = {
  /**
   * 获取订单列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.status - 订单状态
   * @param {string} params.keyword - 搜索关键词（订单号、用户名）
   */
  async getList(params) {
    const response = await request.get('/admin/orders', { params })
    return response
  },

  /**
   * 获取订单详情
   * @param {string|number} id - 订单 ID
   */
  async getDetail(id) {
    const response = await request.get(`/admin/orders/${id}`)
    return response
  },

  /**
   * 更新订单状态
   * @param {string|number} id - 订单 ID
   * @param {string} status - 新状态
   */
  async updateStatus(id, status) {
    const response = await request.patch(`/admin/orders/${id}/status`, { status })
    return response
  },

  /**
   * 获取订单统计数据
   */
  async getStatistics() {
    const response = await request.get('/admin/orders/statistics')
    return response
  }
}
