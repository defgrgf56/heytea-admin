import request from './request'

/**
 * 文件上传 API
 */
export const uploadApi = {
  /**
   * 上传图片
   * @param {File} file - 图片文件（JPG、PNG、WEBP，最大 2 MB）
   * @returns {Promise<Object>} 上传结果
   * @returns {string} url - 图片 URL
   * @returns {string} originalName - 原始文件名
   * @returns {number} size - 文件大小（字节）
   * @returns {string} mimeType - MIME 类型
   */
  async uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    // 上传 FormData 时删除默认的 Content-Type，让浏览器自动设置
    // 浏览器会自动附加 multipart boundary
    const response = await request.post('/admin/uploads/images', formData, {
      headers: {
        'Content-Type': undefined
      }
    })
    return response
  },

  /**
   * 验证图片文件
   * @param {File} file - 文件对象
   * @returns {Object} 验证结果
   */
  validateImage(file) {
    const maxSize = 2 * 1024 * 1024 // 2 MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    
    const result = {
      valid: true,
      error: null
    }
    
    // 检查文件类型
    if (!allowedTypes.includes(file.type)) {
      result.valid = false
      result.error = '只支持 JPG、PNG、WEBP 格式的图片'
      return result
    }
    
    // 检查文件大小
    if (file.size > maxSize) {
      result.valid = false
      result.error = '图片大小不能超过 2 MB'
      return result
    }
    
    return result
  },

  /**
   * 上传图片（带验证）
   * @param {File} file - 图片文件
   * @returns {Promise<Object>} 上传结果
   */
  async uploadImageWithValidation(file) {
    // 先验证
    const validation = this.validateImage(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }
    
    // 通过验证后上传
    return this.uploadImage(file)
  }
}
