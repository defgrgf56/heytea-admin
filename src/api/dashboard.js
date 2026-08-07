import request from './request'

/**
 * 工作台 API
 * 全部接口要求后台账号和 dashboard:view 权限
 */
export const dashboardApi = {
  /**
   * 获取工作台汇总数据
   * 包含：今日订单/销售额、待处理订单、商品/顾客/门店数
   * @returns {Promise<Object>} 汇总数据
   */
  async getSummary() {
    const response = await request.get('/admin/dashboard/summary')
    return response
  },

  /**
   * 获取销售趋势数据
   * @param {Object} params - 查询参数
   * @param {number} [params.days] - 最近 N 天
   * @param {string} [params.startDate] - 开始日期 YYYY-MM-DD
   * @param {string} [params.endDate] - 结束日期 YYYY-MM-DD
   * @returns {Promise<Object>} 趋势数据（日期、订单数、销售额）
   */
  async getSalesTrend(params) {
    const response = await request.get('/admin/dashboard/sales-trend', { params })
    return response
  },

  /**
   * 获取订单状态分布
   * @returns {Promise<Object>} 各状态的订单数量
   */
  async getOrderDistribution() {
    const response = await request.get('/admin/dashboard/order-distribution')
    return response
  },

  /**
   * 获取热销商品 TOP N
   * @param {number} [limit=10] - 数量限制（1-20）
   * @returns {Promise<Array>} 热销商品列表
   */
  async getTopProducts(limit = 10) {
    const response = await request.get('/admin/dashboard/top-products', {
      params: { limit }
    })
    return response
  },

  /**
   * 获取最近订单
   * @param {number} [limit=10] - 数量限制（1-20）
   * @returns {Promise<Array>} 最近订单列表
   */
  async getRecentOrders(limit = 10) {
    const response = await request.get('/admin/dashboard/recent-orders', {
      params: { limit }
    })
    return response
  }
}
