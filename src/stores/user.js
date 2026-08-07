import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('admin_token') || '')
  const permissions = ref([])
  const roles = ref([])

  const isLoggedIn = computed(() => !!token.value)

  /**
   * RSA 加密登录
   * @param {Object} credentials
   * @param {string} credentials.username - 用户名或邮箱
   * @param {string} credentials.password - 密码
   */
  async function login(credentials) {
    try {
      // 调用 RSA 加密登录接口
      const response = await authApi.login(credentials.username, credentials.password)
      
      // 登录成功，response 已经是解包后的 data（包含 token 和 user）
      const { token: newToken, user: userData } = response
      
      user.value = userData
      token.value = newToken
      permissions.value = userData.permissions || []
      roles.value = userData.roles || []
      
      // 持久化存储
      localStorage.setItem('admin_token', newToken)
      localStorage.setItem('admin_user', JSON.stringify(userData))
      
      console.log('✅ 登录成功:', userData.username, '角色:', userData.roles)
      
      return { success: true, data: userData }
    } catch (error) {
      console.error('❌ 登录失败:', error.message)
      throw error
    }
  }

  /**
   * 退出登录
   */
  async function logout() {
    try {
      // 调用后端退出接口（使旧 Token 失效）
      await authApi.logout()
    } catch (error) {
      console.error('退出登录接口调用失败:', error)
    } finally {
      // 清除本地状态
      user.value = null
      token.value = ''
      permissions.value = []
      roles.value = []
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      
      console.log('✅ 已退出登录')
    }
  }

  /**
   * 获取当前用户信息（含角色和权限）
   */
  async function getCurrentUser() {
    try {
      const userData = await authApi.getCurrentUser()
      
      user.value = userData
      permissions.value = userData.permissions || []
      roles.value = userData.roles || []
      
      // 更新本地存储
      localStorage.setItem('admin_user', JSON.stringify(userData))
      
      return userData
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 如果获取用户信息失败（如 Token 过期），清除登录状态
      await logout()
      throw error
    }
  }

  /**
   * 获取动态菜单树
   */
  async function getMenus() {
    try {
      const menus = await authApi.getMenus()
      return menus
    } catch (error) {
      console.error('获取菜单失败:', error)
      throw error
    }
  }

  /**
   * 修改个人资料
   * @param {Object} data
   */
  async function updateProfile(data) {
    try {
      const updatedUser = await authApi.updateProfile(data)
      // 更新本地用户信息
      user.value = { ...user.value, ...updatedUser }
      localStorage.setItem('admin_user', JSON.stringify(user.value))
      return updatedUser
    } catch (error) {
      console.error('修改资料失败:', error)
      throw error
    }
  }

  /**
   * 修改密码
   * @param {string} oldPassword
   * @param {string} newPassword
   */
  async function changePassword(oldPassword, newPassword) {
    try {
      await authApi.changePassword(oldPassword, newPassword)
      // 修改密码成功后，所有旧 Token 失效，需要重新登录
      await logout()
    } catch (error) {
      console.error('修改密码失败:', error)
      throw error
    }
  }

  /**
   * 恢复登录状态（页面刷新时调用）
   */
  function restoreUser() {
    const savedUser = localStorage.getItem('admin_user')
    if (savedUser && token.value) {
      try {
        const userData = JSON.parse(savedUser)
        user.value = userData
        permissions.value = userData.permissions || []
        roles.value = userData.roles || []
        
        // 可选：验证 token 是否仍然有效
        // getCurrentUser().catch(() => {
        //   // Token 已失效，清除登录状态
        // })
      } catch (e) {
        console.error('解析用户信息失败:', e)
        logout()
      }
    }
  }

  /**
   * 检查是否有某个权限
   * @param {string} permission - 权限码
   * @returns {boolean}
   */
  function hasPermission(permission) {
    return permissions.value.includes(permission)
  }

  /**
   * 检查是否有某个角色
   * @param {string} role - 角色编码
   * @returns {boolean}
   */
  function hasRole(role) {
    return roles.value.includes(role)
  }

  return {
    // 状态
    user,
    token,
    permissions,
    roles,
    isLoggedIn,
    
    // 方法
    login,
    logout,
    getCurrentUser,
    getMenus,
    updateProfile,
    changePassword,
    restoreUser,
    hasPermission,
    hasRole
  }
})

