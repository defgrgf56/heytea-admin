import request from './request'

/**
 * 角色权限 API
 */
export const roleApi = {
  /**
   * 获取角色分页列表（含管理员数量）
   * @param {Object} params - 查询参数
   * @param {number} [params.page] - 页码
   * @param {number} [params.pageSize] - 每页数量
   * @param {string} [params.keyword] - 搜索关键词
   * @param {string} [params.status] - 状态 active/inactive
   * @returns {Promise<Object>} 分页数据
   */
  async getList(params) {
    const response = await request.get('/admin/roles', { params })
    return response
  },

  /**
   * 获取所有启用角色（用于下拉框）
   * @returns {Promise<Array>} 角色列表
   */
  async getAll() {
    const response = await request.get('/admin/roles/all')
    return response
  },

  /**
   * 获取角色详情
   * @param {string} id - 角色 ID
   * @returns {Promise<Object>} 角色详情
   */
  async getDetail(id) {
    const response = await request.get(`/admin/roles/${id}`)
    return response
  },

  /**
   * 新增角色
   * @param {Object} data - 角色数据
   * @param {string} data.code - 角色编码（大写字母、数字、下划线，创建后不可修改）
   * @param {string} data.name - 角色名称
   * @param {string} [data.description] - 角色说明
   * @param {number} [data.sortOrder] - 排序
   * @param {string} [data.status] - 状态 active/inactive
   * @param {Array<string>} [data.permissions] - 权限码数组
   * @param {Array<string>} [data.menuCodes] - 菜单编码数组
   * @returns {Promise<Object>} 创建的角色
   */
  async create(data) {
    const response = await request.post('/admin/roles', data)
    return response
  },

  /**
   * 修改角色（名称、说明、状态、排序）
   * @param {string} id - 角色 ID
   * @param {Object} data - 需要更新的字段（不包含 code）
   * @returns {Promise<Object>} 更新后的角色
   */
  async update(id, data) {
    const response = await request.put(`/admin/roles/${id}`, data)
    return response
  },

  /**
   * 启用/停用角色
   * @param {string} id - 角色 ID
   * @param {string} status - 状态 active/inactive
   * @returns {Promise<Object>}
   */
  async updateStatus(id, status) {
    const response = await request.patch(`/admin/roles/${id}/status`, { status })
    return response
  },

  /**
   * 分配权限与菜单
   * @param {string} id - 角色 ID
   * @param {Object} data
   * @param {Array<string>} data.permissions - 权限码数组
   * @param {Array<string>} data.menuCodes - 菜单编码数组
   * @returns {Promise<Object>}
   */
  async updatePermissions(id, data) {
    const response = await request.put(`/admin/roles/${id}/permissions`, data)
    return response
  },

  /**
   * 删除角色（仅能删除未使用的自定义角色）
   * @param {string} id - 角色 ID
   * @returns {Promise<Object>}
   */
  async delete(id) {
    const response = await request.delete(`/admin/roles/${id}`)
    return response
  }
}
