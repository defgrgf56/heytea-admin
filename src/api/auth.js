import request from './request'
import { encryptCredential } from './crypto'

/**
 * 认证相关 API
 */
export const authApi = {
  /**
   * 获取加密 Challenge
   * @param {string} purpose - 用途: login/register/change-password
   * @returns {Promise<Object>} Challenge 对象
   */
  async getChallenge(purpose) {
    const response = await request.get('/auth/challenge', {
      params: { purpose }
    })
    return response
  },

  /**
   * RSA 加密登录
   * @param {string} identifier - 用户名或邮箱
   * @param {string} password - 密码
   * @returns {Promise<Object>} 包含 token 和 user 信息
   */
  async login(identifier, password) {
    // 1. 获取 Challenge
    const challenge = await this.getChallenge('login')
    
    // 2. 加密凭据
    const credential = await encryptCredential(challenge, {
      identifier,
      password
    })
    
    // 3. 发送登录请求
    const response = await request.post('/auth/login', { credential })
    return response
  },

  /**
   * RSA 加密注册
   * @param {Object} fields - 注册信息
   * @param {string} fields.username - 用户名
   * @param {string} fields.email - 邮箱
   * @param {string} fields.password - 密码
   * @param {string} [fields.nickname] - 昵称
   * @param {string} [fields.avatar] - 头像
   * @returns {Promise<Object>}
   */
  async register(fields) {
    // 1. 获取 Challenge
    const challenge = await this.getChallenge('register')
    
    // 2. 加密凭据
    const credential = await encryptCredential(challenge, fields)
    
    // 3. 发送注册请求
    const response = await request.post('/auth/register', { credential })
    return response
  },

  /**
   * RSA 加密修改密码
   * @param {string} oldPassword - 旧密码
   * @param {string} newPassword - 新密码
   * @returns {Promise<Object>}
   */
  async changePassword(oldPassword, newPassword) {
    // 1. 获取 Challenge
    const challenge = await this.getChallenge('change-password')
    
    // 2. 加密凭据
    const credential = await encryptCredential(challenge, {
      oldPassword,
      newPassword
    })
    
    // 3. 发送修改密码请求
    const response = await request.put('/auth/password', { credential })
    return response
  },

  /**
   * 获取当前用户信息（包含角色和权限）
   * @returns {Promise<Object>}
   */
  async getCurrentUser() {
    const response = await request.get('/auth/me')
    return response
  },

  /**
   * 获取当前用户的动态菜单树
   * @returns {Promise<Array>}
   */
  async getMenus() {
    const response = await request.get('/auth/menus')
    return response
  },

  /**
   * 修改个人资料
   * @param {Object} data
   * @param {string} [data.nickname] - 昵称
   * @param {string} [data.email] - 邮箱
   * @param {string} [data.avatar] - 头像
   * @returns {Promise<Object>}
   */
  async updateProfile(data) {
    const response = await request.put('/auth/profile', data)
    return response
  },

  /**
   * 刷新 Token
   * @returns {Promise<Object>}
   */
  async refreshToken() {
    const response = await request.post('/auth/refresh')
    return response
  },

  /**
   * 退出登录
   * @returns {Promise<Object>}
   */
  async logout() {
    const response = await request.post('/auth/logout')
    return response
  }
}
