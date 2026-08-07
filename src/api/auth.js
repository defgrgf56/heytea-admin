import request from './request'

/**
 * 认证相关 API
 */
export const authApi = {
  /**
   * 登录
   * @param {Object} credentials - 登录凭证
   * @param {string} credentials.identifier - 用户名或邮箱
   * @param {string} credentials.password - 密码
   */
  async login(credentials) {
    // TODO: 实现 RSA 加密登录
    // 暂时使用简单登录
    const response = await request.post('/auth/login', credentials)
    return response
  },

  /**
   * 获取当前用户信息
   */
  async getCurrentUser() {
    const response = await request.get('/auth/me')
    return response
  },

  /**
   * 刷新 Token
   */
  async refreshToken() {
    const response = await request.post('/auth/refresh')
    return response
  },

  /**
   * 退出登录
   */
  async logout() {
    const response = await request.post('/auth/logout')
    return response
  }
}
