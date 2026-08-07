import request from './request'

/**
 * 商品管理 API
 */
export const productApi = {
  /**
   * 获取商品列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.keyword - 搜索关键词
   * @param {string} params.status - 商品状态
   */
  async getList(params) {
    const response = await request.get('/admin/products', { params })
    return response
  },

  /**
   * 获取商品详情
   * @param {string|number} id - 商品 ID
   */
  async getDetail(id) {
    const response = await request.get(`/admin/products/${id}`)
    return response
  },

  /**
   * 添加商品
   * @param {Object} data - 商品数据
   */
  async create(data) {
    const response = await request.post('/admin/products', data)
    return response
  },

  /**
   * 更新商品
   * @param {string|number} id - 商品 ID
   * @param {Object} data - 商品数据
   */
  async update(id, data) {
    const response = await request.put(`/admin/products/${id}`, data)
    return response
  },

  /**
   * 删除商品
   * @param {string|number} id - 商品 ID
   */
  async delete(id) {
    const response = await request.delete(`/admin/products/${id}`)
    return response
  },

  /**
   * 更新商品状态（上架/下架）
   * @param {string|number} id - 商品 ID
   * @param {string} status - 状态 (ON_SALE/OFF_SALE)
   */
  async updateStatus(id, status) {
    const response = await request.patch(`/admin/products/${id}/status`, { status })
    return response
  },

  /**
   * 获取商品分类列表
   */
  async getCategories() {
    const response = await request.get('/product-categories')
    return response
  }
}
