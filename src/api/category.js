import request from './request'

/**
 * 商品分类管理 API
 */
export const categoryApi = {
  /**
   * 获取分类分页列表（含商品数量）
   * @param {Object} params - 查询参数
   * @param {number} [params.page] - 页码
   * @param {number} [params.pageSize] - 每页数量
   * @param {string} [params.keyword] - 搜索关键词
   * @param {string} [params.status] - 状态 active/inactive
   * @returns {Promise<Object>} 分页数据
   */
  async getList(params) {
    const response = await request.get('/admin/categories', { params })
    return response
  },

  /**
   * 获取所有分类（用于下拉框）
   * @param {boolean} [includeInactive=false] - 是否包含停用项
   * @returns {Promise<Array>} 分类数组
   */
  async getAll(includeInactive = false) {
    const response = await request.get('/admin/categories/all', {
      params: { includeInactive }
    })
    return response
  },

  /**
   * 获取分类详情
   * @param {string} id - 分类 ID
   * @returns {Promise<Object>} 分类详情
   */
  async getDetail(id) {
    const response = await request.get(`/admin/categories/${id}`)
    return response
  },

  /**
   * 新增分类
   * @param {Object} data - 分类数据
   * @param {string} data.code - 分类编码（唯一，创建后不可修改）
   * @param {string} data.name - 分类名称
   * @param {string} [data.nameEn] - 英文名称
   * @param {string} [data.icon] - 图标
   * @param {number} [data.sortOrder] - 排序
   * @param {string} [data.status] - 状态 active/inactive
   * @returns {Promise<Object>} 创建的分类
   */
  async create(data) {
    const response = await request.post('/admin/categories', data)
    return response
  },

  /**
   * 修改分类
   * @param {string} id - 分类 ID
   * @param {Object} data - 需要更新的字段（不包含 code）
   * @returns {Promise<Object>} 更新后的分类
   */
  async update(id, data) {
    const response = await request.put(`/admin/categories/${id}`, data)
    return response
  },

  /**
   * 启用/停用分类
   * @param {string} id - 分类 ID
   * @param {string} status - 状态 active/inactive
   * @returns {Promise<Object>}
   */
  async updateStatus(id, status) {
    const response = await request.patch(`/admin/categories/${id}/status`, { status })
    return response
  },

  /**
   * 修改分类排序
   * @param {string} id - 分类 ID
   * @param {number} sortOrder - 排序值
   * @returns {Promise<Object>}
   */
  async updateSort(id, sortOrder) {
    const response = await request.patch(`/admin/categories/${id}/sort`, { sortOrder })
    return response
  },

  /**
   * 删除分类（仅能删除空分类）
   * @param {string} id - 分类 ID
   * @returns {Promise<Object>}
   */
  async delete(id) {
    const response = await request.delete(`/admin/categories/${id}`)
    return response
  }
}
