import request from './request'

/**
 * 收货地址管理 API
 */
export const addressApi = {
  /**
   * 获取地址列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.keyword - 搜索关键词（用户名、手机号、地址）
   * @param {string} params.userId - 用户 ID 筛选
   * @param {string} params.province - 省份筛选
   * @param {string} params.city - 城市筛选
   */
  async getList(params) {
    const response = await request.get('/admin/addresses', { params })
    return response
  },

  /**
   * 获取地址详情
   * @param {string|number} id - 地址 ID
   */
  async getDetail(id) {
    const response = await request.get(`/admin/addresses/${id}`)
    return response
  },

  /**
   * 获取用户的地址列表
   * @param {string|number} userId - 用户 ID
   */
  async getUserAddresses(userId) {
    const response = await request.get(`/admin/users/${userId}/addresses`)
    return response
  },

  /**
   * 删除地址
   * @param {string|number} id - 地址 ID
   */
  async delete(id) {
    const response = await request.delete(`/admin/addresses/${id}`)
    return response
  },

  /**
   * 获取省份列表
   */
  async getProvinces() {
    const response = await request.get('/admin/addresses/provinces')
    return response
  },

  /**
   * 获取城市列表
   * @param {string} province - 省份
   */
  async getCities(province) {
    const response = await request.get('/admin/addresses/cities', {
      params: { province }
    })
    return response
  },

  /**
   * 获取区域列表
   * @param {string} city - 城市
   */
  async getDistricts(city) {
    const response = await request.get('/admin/addresses/districts', {
      params: { city }
    })
    return response
  },

  /**
   * 获取地址统计
   */
  async getStatistics() {
    const response = await request.get('/admin/addresses/statistics')
    return response
  },

  /**
   * 导出地址数据
   * @param {Object} params - 导出参数
   */
  async exportAddresses(params) {
    const response = await request.get('/admin/addresses/export', {
      params,
      responseType: 'blob'
    })
    return response
  }
}
