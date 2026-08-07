import request from './request'

/**
 * 门店管理 API
 */
export const storeApi = {
  /**
   * 获取门店列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.keyword - 搜索关键词（门店名称、地址）
   * @param {string} params.status - 门店状态 (open/closed/maintenance)
   * @param {string} params.city - 城市筛选
   */
  async getList(params) {
    const response = await request.get('/admin/stores', { params })
    return response
  },

  /**
   * 获取所有门店（不分页）
   */
  async getAll() {
    const response = await request.get('/admin/stores/all')
    return response
  },

  /**
   * 获取门店详情
   * @param {string|number} id - 门店 ID
   */
  async getDetail(id) {
    const response = await request.get(`/admin/stores/${id}`)
    return response
  },

  /**
   * 添加门店
   * @param {Object} data - 门店数据
   */
  async create(data) {
    const response = await request.post('/admin/stores', data)
    return response
  },

  /**
   * 更新门店
   * @param {string|number} id - 门店 ID
   * @param {Object} data - 门店数据
   */
  async update(id, data) {
    const response = await request.put(`/admin/stores/${id}`, data)
    return response
  },

  /**
   * 删除门店
   * @param {string|number} id - 门店 ID
   */
  async delete(id) {
    const response = await request.delete(`/admin/stores/${id}`)
    return response
  },

  /**
   * 更新门店状态
   * @param {string|number} id - 门店 ID
   * @param {string} status - 状态 (open/closed/maintenance)
   */
  async updateStatus(id, status) {
    const response = await request.patch(`/admin/stores/${id}/status`, { status })
    return response
  },

  /**
   * 获取城市列表
   */
  async getCities() {
    const response = await request.get('/admin/stores/cities')
    return response
  },

  /**
   * 上传门店图片
   * @param {File} file - 图片文件
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
