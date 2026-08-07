import request from './request'

/**
 * 门店管理 API
 */
export const storeApi = {
  /**
   * 获取门店分页列表
   * @param {Object} params - 查询参数
   * @param {number} [params.page] - 页码
   * @param {number} [params.pageSize] - 每页数量
   * @param {string} [params.keyword] - 搜索关键词
   * @param {string} [params.city] - 城市
   * @param {string} [params.status] - 营业状态 open/closed/maintenance
   * @returns {Promise<Object>} 分页数据
   */
  async getList(params) {
    const response = await request.get('/admin/stores', { params })
    return response
  },

  /**
   * 获取所有门店（用于下拉框）
   * @returns {Promise<Array>} 门店列表
   */
  async getAll() {
    const response = await request.get('/admin/stores/all')
    return response
  },

  /**
   * 获取门店城市列表
   * @returns {Promise<Array>} 城市列表
   */
  async getCities() {
    const response = await request.get('/admin/stores/cities')
    return response
  },

  /**
   * 获取门店详情
   * @param {string} id - 门店 ID
   * @returns {Promise<Object>} 门店详情
   */
  async getDetail(id) {
    const response = await request.get(`/admin/stores/${id}`)
    return response
  },

  /**
   * 新增门店
   * @param {Object} data - 门店数据
   * @param {string} data.name - 门店名称
   * @param {string} [data.image] - 门店图片
   * @param {string} data.province - 省份
   * @param {string} data.city - 城市
   * @param {string} data.district - 区县
   * @param {string} data.address - 详细地址
   * @param {number} [data.latitude] - 纬度
   * @param {number} [data.longitude] - 经度
   * @param {string} [data.phone] - 电话
   * @param {string} [data.openTime] - 营业开始时间 HH:mm
   * @param {string} [data.closeTime] - 营业结束时间 HH:mm
   * @param {string} [data.status] - 营业状态 open/closed/maintenance
   * @param {string} [data.features] - 特色服务
   * @param {string} [data.parking] - 停车信息
   * @returns {Promise<Object>} 创建的门店
   */
  async create(data) {
    const response = await request.post('/admin/stores', data)
    return response
  },

  /**
   * 修改门店
   * @param {string} id - 门店 ID
   * @param {Object} data - 需要更新的字段
   * @returns {Promise<Object>} 更新后的门店
   */
  async update(id, data) {
    const response = await request.put(`/admin/stores/${id}`, data)
    return response
  },

  /**
   * 修改门店营业状态
   * @param {string} id - 门店 ID
   * @param {string} status - 状态 open/closed/maintenance
   * @returns {Promise<Object>}
   */
  async updateStatus(id, status) {
    const response = await request.patch(`/admin/stores/${id}/status`, { status })
    return response
  },

  /**
   * 软删除门店
   * @param {string} id - 门店 ID
   * @returns {Promise<Object>}
   */
  async delete(id) {
    const response = await request.delete(`/admin/stores/${id}`)
    return response
  },

  /**
   * 上传门店图片（兼容旧路径）
   * @param {File} file - 图片文件
   * @returns {Promise<Object>} 上传结果
   */
  async uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await request.post('/admin/stores/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  }
}
