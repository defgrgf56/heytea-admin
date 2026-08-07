import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('admin_token') || '')

  const isLoggedIn = computed(() => !!token.value)

  // 登录
  async function login(credentials) {
    try {
      // 开发环境使用测试账号
      if (import.meta.env.DEV) {
        // 模拟登录验证
        if (credentials.username === 'admin' && credentials.password === '123456') {
          // 模拟用户数据
          const userData = {
            id: 1,
            username: 'admin',
            nickname: '管理员',
            email: 'admin@heytea.com',
            role: 'admin',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
          }
          const mockToken = 'mock_token_' + Date.now()
          
          user.value = userData
          token.value = mockToken
          localStorage.setItem('admin_token', mockToken)
          localStorage.setItem('admin_user', JSON.stringify(userData))
          
          return { success: true }
        } else {
          throw new Error('用户名或密码错误，请使用测试账号：admin / 123456')
        }
      }
      
      // 生产环境调用真实 API
      const response = await authApi.login({
        identifier: credentials.username,
        password: credentials.password
      })
      
      if (response.success) {
        const { token: newToken, user: userData } = response.data
        
        user.value = userData
        token.value = newToken
        localStorage.setItem('admin_token', newToken)
        localStorage.setItem('admin_user', JSON.stringify(userData))
        
        return { success: true }
      } else {
        throw new Error(response.message || '登录失败')
      }
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  // 退出登录
  async function logout() {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      user.value = null
      token.value = ''
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
    }
  }

  // 获取当前用户信息
  async function getCurrentUser() {
    try {
      const response = await authApi.getCurrentUser()
      if (response.success) {
        user.value = response.data
        localStorage.setItem('admin_user', JSON.stringify(response.data))
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 如果获取用户信息失败，清除登录状态
      logout()
    }
  }

  // 恢复登录状态
  function restoreUser() {
    const savedUser = localStorage.getItem('admin_user')
    if (savedUser && token.value) {
      try {
        user.value = JSON.parse(savedUser)
        // 可选：验证 token 是否有效
        // getCurrentUser()
      } catch (e) {
        console.error('解析用户信息失败:', e)
        logout()
      }
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    login,
    logout,
    getCurrentUser,
    restoreUser
  }
})

