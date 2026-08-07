import request from './request'

/**
 * 管理员 API
 */
export const staffApi = {
  /**
   * 获取管理员分页列表
   * @param {Object} params - 查询参数
   * @param {number} [params.page] - 页码
   * @param {number} [params.pageSize] - 每页数量
   * @param {string} [params.keyword] - 搜索关键词
   * @param {string} [params.status] - 状态 active/disabled
   * @param {string} [params.roleCode] - 角色编码
   * @returns {Promise<Object>} 分页数据
   */
  async getList(params) {
    const response = await request.get('/admin/staff', { params })
    return response
  },

  /**
   * 获取管理员详情
   * @param {string} id - 管理员 ID
   * @returns {Promise<Object>} 管理员详情
   */
  async getDetail(id) {
    const response = await request.get(`/admin/staff/${id}`)
    return response
  },

  /**
   * 新增管理员（生成临时密码）
   * @param {Object} data - 管理员数据
   * @param {string} data.username - 用户名
   * @param {string} data.email - 邮箱
   * @param {string} [data.nickname] - 昵称
   * @param {Array<string>} data.roleCodes - 角色编码数组
   * @param {string} [data.status] - 状态 active/disabled
   * @returns {Promise<Object>} 创建的管理员和临时密码
   */
  async create(data) {
    const response = await request.post('/admin/staff', data)
    return response
  },

  /**
   * 修改管理员资料
   * @param {string} id - 管理员 ID
   * @param {Object} data - 需要更新的字段
   * @param {string} [data.nickname] - 昵称
   * @param {string} [data.email] - 邮箱
   * @param {string} [data.avatar] - 头像
   * @returns {Promise<Object>} 更新后的管理员
   */
  async update(id, data) {
    const response = await request.put(`/admin/staff/${id}`, data)
    return response
  },

  /**
   * 启用/禁用管理员
   * @param {string} id - 管理员 ID
   * @param {string} status - 状态 active/disabled
   * @returns {Promise<Object>}
   */
  async updateStatus(id, status) {
    const response = await request.patch(`/admin/staff/${id}/status`, { status })
    return response
  },

  /**
   * 分配角色
   * @param {string} id - 管理员 ID
   * @param {Array<string>} roleCodes - 角色编码数组
   * @returns {Promise<Object>}
   */
  async updateRoles(id, roleCodes) {
    const response = await request.put(`/admin/staff/${id}/roles`, { roleCodes })
    return response
  },

  /**
   * 重置密码（生成新的临时密码）
   * @param {string} id - 管理员 ID
   * @returns {Promise<Object>} 包含新的临时密码
   */
  async resetPassword(id) {
    const response = await request.post(`/admin/staff/${id}/reset-password`)
    return response
  }
}
