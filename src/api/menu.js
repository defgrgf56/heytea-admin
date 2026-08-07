import request from './request'

/**
 * 菜单管理 API
 */
export const menuApi = {
  /**
   * 获取完整菜单树（默认包含停用项）
   * @param {Object} params - 查询参数
   * @param {boolean} [params.includeInactive] - 是否包含停用项
   * @returns {Promise<Array>} 菜单树
   */
  async getTree(params) {
    const response = await request.get('/admin/menus/tree', { params })
    return response
  },

  /**
   * 获取菜单详情
   * @param {string} id - 菜单 ID
   * @returns {Promise<Object>} 菜单详情
   */
  async getDetail(id) {
    const response = await request.get(`/admin/menus/${id}`)
    return response
  },

  /**
   * 新增菜单（目录、菜单或按钮）
   * @param {Object} data - 菜单数据
   * @param {string} data.code - 菜单编码（唯一）
   * @param {string} [data.parentCode] - 父菜单编码
   * @param {string} data.name - 菜单名称
   * @param {string} data.type - 类型 DIRECTORY/MENU/BUTTON
   * @param {string} [data.path] - 路由路径
   * @param {string} [data.componentKey] - 组件映射键
   * @param {string} [data.icon] - 图标
   * @param {string} [data.permission] - 权限码
   * @param {number} [data.sortOrder] - 排序
   * @param {boolean} [data.hidden] - 是否隐藏
   * @param {string} [data.status] - 状态 active/inactive
   * @returns {Promise<Object>} 创建的菜单
   */
  async create(data) {
    const response = await request.post('/admin/menus', data)
    return response
  },

  /**
   * 修改菜单
   * @param {string} id - 菜单 ID
   * @param {Object} data - 需要更新的字段
   * @returns {Promise<Object>} 更新后的菜单
   */
  async update(id, data) {
    const response = await request.put(`/admin/menus/${id}`, data)
    return response
  },

  /**
   * 启用/停用菜单
   * @param {string} id - 菜单 ID
   * @param {string} status - 状态 active/inactive
   * @returns {Promise<Object>}
   */
  async updateStatus(id, status) {
    const response = await request.patch(`/admin/menus/${id}/status`, { status })
    return response
  },

  /**
   * 修改菜单排序
   * @param {string} id - 菜单 ID
   * @param {number} sortOrder - 排序值
   * @returns {Promise<Object>}
   */
  async updateSort(id, sortOrder) {
    const response = await request.patch(`/admin/menus/${id}/sort`, { sortOrder })
    return response
  },

  /**
   * 删除菜单（仅能删除无子项的自定义菜单）
   * @param {string} id - 菜单 ID
   * @returns {Promise<Object>}
   */
  async delete(id) {
    const response = await request.delete(`/admin/menus/${id}`)
    return response
  }
}
