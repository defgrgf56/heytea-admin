import request from './request'

/**
 * 商品分类管理 API
 */
export const categoryApi = {
  /**
   * 获取分类列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.keyword - 搜索关键词
   */
  async getList(params) {
    const response = await request.get('/admin/categories', { params })
    return response
  },

  /**
   * 获取所有分类（不分页）
   */
  async getAll() {
    const response = await request.get('/admin/categories/all')
    return response
  },

  /**
   * 获取分类详情
   * @param {string|number} id - 分类 ID
   */
  async getDetail(id) {
    const response = await request.get(`/admin/categories/${id}`)
    return response
  },

  /**
   * 添加分类
   * @param {Object} data - 分类数据
   * @param {string} data.name - 分类名称
   * @param {string} data.nameEn - 英文名称
   * @param {string} data.code - 分类编码
   * @param {string} data.icon - 分类图标
   * @param {number} data.sort - 排序
   * @param {string} data.status - 状态
   */
  async create(data) {
    const response = await request.post('/admin/categories', data)
    return response
  },

  /**
   * 更新分类
   * @param {string|number} id - 分类 ID
   * @param {Object} data - 分类数据
   */
  async update(id, data) {
    const response = await request.put(`/admin/categories/${id}`, data)
    return response
  },

  /**
   * 删除分类
   * @param {string|number} id - 分类 ID
   */
  async delete(id) {
    const response = await request.delete(`/admin/categories/${id}`)
    return response
  },

  /**
   * 更新分类状态
   * @param {string|number} id - 分类 ID
   * @param {string} status - 状态 (active/inactive)
   */
  async updateStatus(id, status) {
    const response = await request.patch(`/admin/categories/${id}/status`, { status })
    return response
  },

  /**
   * 更新分类排序
   * @param {string|number} id - 分类 ID
   * @param {number} sort - 排序值
   */
  async updateSort(id, sort) {
    const response = await request.patch(`/admin/categories/${id}/sort`, { sort })
    return response
  }
}
