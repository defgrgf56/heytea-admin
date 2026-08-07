/**
 * RSA 加密工具模块
 * 用于登录、注册、修改密码的安全加密
 */

/**
 * PEM 格式公钥转换为 ArrayBuffer
 * @param {string} pem - PEM 格式的公钥
 * @returns {ArrayBuffer}
 */
function pemToArrayBuffer(pem) {
  const base64 = pem
    .replace('-----BEGIN PUBLIC KEY-----', '')
    .replace('-----END PUBLIC KEY-----', '')
    .replace(/\s+/g, '')
  const binary = atob(base64)
  return Uint8Array.from(binary, char => char.charCodeAt(0)).buffer
}

/**
 * ArrayBuffer 转换为 Base64 字符串
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

/**
 * 使用 RSA-OAEP 加密凭据
 * @param {Object} challenge - Challenge 对象
 * @param {string} challenge.challengeId - Challenge ID
 * @param {string} challenge.nonce - 随机数
 * @param {string} challenge.publicKey - RSA 公钥
 * @param {string} challenge.purpose - 用途
 * @param {Object} fields - 需要加密的字段
 * @returns {Promise<{challengeId: string, payload: string}>}
 */
export async function encryptCredential(challenge, fields) {
  try {
    // 检查 challenge 对象
    if (!challenge || !challenge.publicKey) {
      console.error('❌ Challenge 对象无效:', challenge)
      throw new Error('Challenge 数据无效')
    }

    // 导入公钥
    const key = await crypto.subtle.importKey(
      'spki',
      pemToArrayBuffer(challenge.publicKey),
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    )

    // 构造要加密的明文数据
    const plainText = JSON.stringify({
      purpose: challenge.purpose,
      challengeId: challenge.challengeId,
      nonce: challenge.nonce,
      ...fields
    })

    console.log('🔐 加密数据:', { purpose: challenge.purpose, fields: Object.keys(fields) })

    // 使用 RSA-OAEP 加密
    const encrypted = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      key,
      new TextEncoder().encode(plainText)
    )

    // 返回加密结果
    return {
      challengeId: challenge.challengeId,
      payload: arrayBufferToBase64(encrypted)
    }
  } catch (error) {
    console.error('❌ RSA 加密失败:', error)
    throw new Error('加密失败，请重试')
  }
}
