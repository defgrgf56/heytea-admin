import request from './request'

/**
 * 地址管理 API
 */
export const addressApi = {
  /**
   * 获取地址分页列表
   * @param {Object} params - 查询参数
   * @param {number} [params.page] - 页码
   * @param {number} [params.pageSize] - 每页数量
   * @param {string} [params.keyword] - 搜索关键词
   * @param {string} [params.userId] - 用户 ID
   * @param {string} [params.province] - 省份
   * @param {string} [params.city] - 城市
   * @returns {Promise<Object>} 分页数据
   */
  async getList(params) {
    const response = await request.get('/admin/addresses', { params })
    return response
  },

  /**
   * 获取地址详情
   * @param {string} id - 地址 ID
   * @returns {Promise<Object>} 地址详情
   */
  async getDetail(id) {
    const response = await request.get(`/admin/addresses/${id}`)
    return response
  },

  /**
   * 获取地址统计数据（地址数、用户数、默认地址数）
   * @returns {Promise<Object>} 统计数据
   */
  async getStatistics() {
    const response = await request.get('/admin/addresses/statistics')
    return response
  },

  /**
   * 获取省份选项
   * @returns {Promise<Array>} 省份列表
   */
  async getProvinces() {
    const response = await request.get('/admin/addresses/provinces')
    return response
  },

  /**
   * 获取城市选项
   * @param {string} province - 省份名称
   * @returns {Promise<Array>} 城市列表
   */
  async getCities(province) {
    const response = await request.get('/admin/addresses/cities', {
      params: { province }
    })
    return response
  },

  /**
   * 获取区县选项
   * @param {string} city - 城市名称
   * @returns {Promise<Array>} 区县列表
   */
  async getDistricts(city) {
    const response = await request.get('/admin/addresses/districts', {
      params: { city }
    })
    return response
  },

  /**
   * 软删除地址
   * @param {string} id - 地址 ID
   * @returns {Promise<Object>}
   */
  async delete(id) {
    const response = await request.delete(`/admin/addresses/${id}`)
    return response
  },

  /**
   * 导出地址 CSV
   * @param {Object} params - 筛选参数（同 getList）
   * @returns {Promise<Blob>} CSV 文件 Blob
   */
  async export(params) {
    const response = await request.get('/admin/addresses/export', {
      params,
      responseType: 'blob'
    })
    return response
  }
}
