import request from './request'

/**
 * 操作日志 API
 */
export const operationLogApi = {
  /**
   * 获取操作日志分页列表
   * @param {Object} params - 查询参数
   * @param {number} [params.page] - 页码
   * @param {number} [params.pageSize] - 每页数量
   * @param {string} [params.staffId] - 管理员 ID
   * @param {string} [params.module] - 模块名称
   * @param {string} [params.action] - 操作动作
   * @param {boolean} [params.success] - 是否成功 true/false
   * @param {string} [params.startDate] - 开始日期 YYYY-MM-DD
   * @param {string} [params.endDate] - 结束日期 YYYY-MM-DD
   * @returns {Promise<Object>} 分页数据
   */
  async getList(params) {
    const response = await request.get('/admin/operation-logs', { params })
    return response
  },

  /**
   * 获取操作日志详情
   * @param {string} id - 日志 ID
   * @returns {Promise<Object>} 日志详情
   */
  async getDetail(id) {
    const response = await request.get(`/admin/operation-logs/${id}`)
    return response
  }
}
