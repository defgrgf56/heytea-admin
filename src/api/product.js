import request from './request'

/**
 * 商品管理 API
 */
export const productApi = {
  /**
   * 获取商品列表（管理端，含下架商品）
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} [params.keyword] - 搜索关键词
   * @param {string} [params.status] - 商品状态 ON_SALE/OFF_SALE/SOLD_OUT
   * @param {string} [params.categoryCode] - 分类编码
   * @param {boolean} [params.isHot] - 是否热门
   * @param {boolean} [params.isNew] - 是否新品
   * @returns {Promise<Object>} 分页数据
   */
  async getList(params) {
    const response = await request.get('/admin/products', { params })
    return response
  },

  /**
   * 获取商品详情
   * @param {string} id - 商品 ID
   * @returns {Promise<Object>} 商品详情
   */
  async getDetail(id) {
    const response = await request.get(`/admin/products/${id}`)
    return response
  },

  /**
   * 添加商品
   * @param {Object} data - 商品数据
   * @param {string} data.name - 商品名称
   * @param {string} [data.nameEn] - 英文名称
   * @param {string} data.description - 商品描述
   * @param {string} [data.descriptionEn] - 英文描述
   * @param {number} data.price - 价格
   * @param {string} data.categoryCode - 分类编码
   * @param {string} data.imageUrl - 主图
   * @param {Array<string>} [data.bannerImages] - 轮播图
   * @param {boolean} [data.isNew] - 是否新品
   * @param {boolean} [data.isHot] - 是否热门
   * @param {string} [data.status] - 状态
   * @param {number} [data.stock] - 库存
   * @param {number} [data.sortOrder] - 排序
   * @param {Object} [data.specs] - 规格配置
   * @returns {Promise<Object>} 创建的商品
   */
  async create(data) {
    const response = await request.post('/admin/products', data)
    return response
  },

  /**
   * 更新商品（部分字段）
   * @param {string} id - 商品 ID
   * @param {Object} data - 需要更新的字段
   * @returns {Promise<Object>} 更新后的商品
   */
  async update(id, data) {
    const response = await request.put(`/admin/products/${id}`, data)
    return response
  },

  /**
   * 删除商品
   * @param {string} id - 商品 ID
   * @returns {Promise<Object>}
   */
  async delete(id) {
    const response = await request.delete(`/admin/products/${id}`)
    return response
  },

  /**
   * 更新单个商品状态
   * @param {string} id - 商品 ID
   * @param {string} status - 状态 ON_SALE/OFF_SALE/SOLD_OUT
   * @returns {Promise<Object>}
   */
  async updateStatus(id, status) {
    const response = await request.patch(`/admin/products/${id}/status`, { status })
    return response
  },

  /**
   * 批量更新商品状态
   * @param {Array<string>} ids - 商品 ID 数组（最多 100 个）
   * @param {string} status - 状态 ON_SALE/OFF_SALE/SOLD_OUT
   * @returns {Promise<Object>}
   */
  async batchUpdateStatus(ids, status) {
    const response = await request.patch('/admin/products/batch-status', { ids, status })
    return response
  },

  /**
   * 获取公开商品分类列表（首项为 all）
   * @returns {Promise<Array>} 分类列表
   */
  async getCategories() {
    const response = await request.get('/product-categories')
    return response
  }
}
