import request from './request'

/**
 * 用户管理 API
 */
export const userApi = {
  /**
   * 获取用户列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.keyword - 搜索关键词（用户名、邮箱、手机号）
   * @param {string} params.status - 用户状态 (active/disabled)
   * @param {string} params.tag - 用户标签 (vip/new/active)
   * @param {string} params.startDate - 注册开始日期
   * @param {string} params.endDate - 注册结束日期
   */
  async getList(params) {
    const response = await request.get('/admin/users', { params })
    return response
  },

  /**
   * 获取用户详情
   * @param {string|number} id - 用户 ID
   */
  async getDetail(id) {
    const response = await request.get(`/admin/users/${id}`)
    return response
  },

  /**
   * 更新用户状态
   * @param {string|number} id - 用户 ID
   * @param {string} status - 状态 (active/disabled)
   */
  async updateStatus(id, status) {
    const response = await request.patch(`/admin/users/${id}/status`, { status })
    return response
  },

  /**
   * 更新用户标签
   * @param {string|number} id - 用户 ID
   * @param {Array<string>} tags - 标签数组 ['vip', 'new', 'active']
   */
  async updateTags(id, tags) {
    const response = await request.patch(`/admin/users/${id}/tags`, { tags })
    return response
  },

  /**
   * 获取用户订单历史
   * @param {string|number} id - 用户 ID
   * @param {Object} params - 查询参数
   */
  async getUserOrders(id, params = {}) {
    const response = await request.get(`/admin/users/${id}/orders`, { params })
    return response
  },

  /**
   * 获取用户消费统计
   * @param {string|number} id - 用户 ID
   */
  async getUserStatistics(id) {
    const response = await request.get(`/admin/users/${id}/statistics`)
    return response
  },

  /**
   * 删除用户（软删除）
   * @param {string|number} id - 用户 ID
   */
  async delete(id) {
    const response = await request.delete(`/admin/users/${id}`)
    return response
  },

  /**
   * 重置用户密码
   * @param {string|number} id - 用户 ID
   * @param {string} newPassword - 新密码
   */
  async resetPassword(id, newPassword) {
    const response = await request.post(`/admin/users/${id}/reset-password`, { 
      newPassword 
    })
    return response
  },

  /**
   * 批量导出用户数据
   * @param {Object} params - 导出参数
   */
  async exportUsers(params) {
    const response = await request.get('/admin/users/export', { 
      params,
      responseType: 'blob'
    })
    return response
  }
}
