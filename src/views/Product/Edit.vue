<template>
  <div class="product-edit">
    <el-page-header @back="$router.back()" :title="pageTitle">
      <template #content>
        <span class="page-title">{{ pageTitle }}</span>
      </template>
    </el-page-header>

    <div class="content-card" style="margin-top: 20px;">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>

        <el-form-item label="英文名称" prop="nameEn">
          <el-input v-model="form.nameEn" placeholder="请输入英文名称" />
        </el-form-item>

        <el-form-item label="商品分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option label="水果茶" value="fruit" />
            <el-option label="芝士茶" value="cheese" />
            <el-option label="纯茶" value="tea" />
            <el-option label="奶茶" value="milk" />
            <el-option label="咖啡" value="coffee" />
          </el-select>
        </el-form-item>

        <el-form-item label="商品价格" prop="price">
          <el-input-number
            v-model="form.price"
            :min="0"
            :precision="2"
            controls-position="right"
          />
        </el-form-item>

        <el-form-item label="商品描述" prop="desc">
          <el-input
            v-model="form.desc"
            type="textarea"
            :rows="3"
            placeholder="请输入商品描述"
          />
        </el-form-item>

        <el-form-item label="商品图片" prop="image">
          <div class="image-upload-container">
            <el-upload
              class="image-uploader"
              :action="uploadAction"
              :show-file-list="false"
              :before-upload="beforeImageUpload"
              :http-request="handleImageUpload"
              :on-change="handleFileChange"
              accept="image/jpeg,image/jpg,image/png,image/webp"
            >
              <!-- 显示本地预览或加号图标 -->
              <img 
                v-if="localPreviewUrl" 
                :src="localPreviewUrl" 
                class="preview-image"
              />
              <el-icon v-else class="image-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="image-url-input">
              <el-input
                v-model="form.image"
                placeholder="或手动输入图片URL"
                clearable
                @clear="handleClearImage"
              >
                <template #prepend>URL</template>
              </el-input>
              <el-text size="small" type="info">
                支持 JPG、PNG、WEBP 格式，最大 2MB
              </el-text>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="库存数量" prop="stock">
          <el-input-number
            v-model="form.stock"
            :min="0"
            controls-position="right"
          />
        </el-form-item>

        <el-form-item label="商品状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio value="ON_SALE">上架</el-radio>
            <el-radio value="OFF_SALE">下架</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="商品标签">
          <el-checkbox v-model="form.isNew">新品</el-checkbox>
          <el-checkbox v-model="form.isHot">热销</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            保存
          </el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, CircleCheck } from '@element-plus/icons-vue'
import { productApi } from '@/api/product'
import { uploadApi } from '@/api/upload'
import { getProxyImageUrl, getFullImageUrl } from '@/utils/image'

const route = useRoute()
const router = useRouter()
const formRef = ref()
const loading = ref(false)
const uploadAction = '' // 不使用默认的 action，使用自定义上传
const imageLoadError = ref(false) // 图片加载错误标记
const localPreviewUrl = ref('') // 本地预览 URL
const uploadedImageUrl = ref('') // 已上传的图片 URL（用于提交）

const productId = computed(() => route.params.id)
const pageTitle = computed(() => productId.value ? '编辑商品' : '添加商品')

const form = ref({
  name: '',
  nameEn: '',
  category: '',
  price: 0,
  desc: '',
  image: '',
  stock: 999,
  status: 'ON_SALE',
  isNew: false,
  isHot: false
})

const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }]
}

onMounted(() => {
  if (productId.value) {
    loadProduct()
  }
})

async function loadProduct() {
  try {
    loading.value = true
    const data = await productApi.getDetail(productId.value)
    
    // API 响应拦截器已经解包了 data
    const imageUrl = data.imageUrl || data.image || ''
    
    form.value = {
      name: data.name || '',
      nameEn: data.nameEn || '',
      category: data.categoryCode || data.category || '',
      price: data.price || 0,
      desc: data.description || data.desc || '',
      image: '', // 编辑时，URL 输入框初始为空
      stock: data.stock || 999,
      status: data.status || 'ON_SALE',
      isNew: data.isNew || false,
      isHot: data.isHot || false
    }
    
    // 如果有图片，保存到 uploadedImageUrl，显示"已上传"状态
    if (imageUrl) {
      uploadedImageUrl.value = getProxyImageUrl(imageUrl)
    }
  } catch (error) {
    console.error('加载商品失败:', error)
    ElMessage.error('加载商品失败')
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 优先使用上传的图片 URL，如果没有则使用手动输入的 URL
    const finalImageUrl = uploadedImageUrl.value || form.value.image
    
    // 构造提交数据，字段名按照 API 文档要求
    const submitData = {
      name: form.value.name,
      nameEn: form.value.nameEn,
      categoryCode: form.value.category,  // 前端用 category，提交时改为 categoryCode
      price: form.value.price,
      description: form.value.desc,  // 前端用 desc，提交时改为 description
      // 如果是代理路径，转换回完整 URL；如果已经是完整 URL，保持不变
      imageUrl: getFullImageUrl(finalImageUrl),
      stock: form.value.stock,
      status: form.value.status,
      isNew: form.value.isNew,
      isHot: form.value.isHot
    }
    
    console.log('📤 提交商品数据:', submitData)
    
    if (productId.value) {
      // 编辑商品
      await productApi.update(productId.value, submitData)
      ElMessage.success('修改成功')
    } else {
      // 添加商品
      await productApi.create(submitData)
      ElMessage.success('添加成功')
    }
    
    // 返回列表页并刷新数据
    router.push('/products')
  } catch (error) {
    console.error('保存失败:', error)
    if (error !== 'cancel') {
      // 显示后端返回的详细错误信息
      const errorMsg = error.response?.data?.message || error.message || '保存失败'
      ElMessage.error(errorMsg)
    }
  } finally {
    loading.value = false
  }
}

// 图片上传前的验证
function beforeImageUpload(file) {
  const validation = uploadApi.validateImage(file)
  if (!validation.valid) {
    ElMessage.error(validation.error)
    return false
  }
  return true
}

// 文件选择变化时（用于本地预览）
function handleFileChange(file) {
  if (file.raw) {
    // 创建本地预览 URL
    localPreviewUrl.value = URL.createObjectURL(file.raw)
  }
}

// 自定义上传处理
async function handleImageUpload(options) {
  const { file } = options
  
  try {
    const loadingMsg = ElMessage({
      message: '图片上传中...',
      type: 'info',
      duration: 0
    })
    
    // 调用上传 API
    const result = await uploadApi.uploadImageWithValidation(file)
    
    loadingMsg.close()
    
    // 上传成功，保存图片 URL 但清空输入框
    uploadedImageUrl.value = getProxyImageUrl(result.url)
    form.value.image = '' // 清空 URL 输入框
    
    // 清除本地预览，显示上传成功状态
    if (localPreviewUrl.value) {
      URL.revokeObjectURL(localPreviewUrl.value)
      localPreviewUrl.value = ''
    }
    
    ElMessage.success('图片上传成功')
    console.log('✅ 图片上传成功，已保存 URL:', uploadedImageUrl.value)
  } catch (error) {
    console.error('❌ 图片上传失败:', error)
    ElMessage.error(error.message || '图片上传失败')
    
    // 上传失败，清除本地预览
    if (localPreviewUrl.value) {
      URL.revokeObjectURL(localPreviewUrl.value)
      localPreviewUrl.value = ''
    }
  }
}

// 清除图片
function handleClearImage() {
  if (localPreviewUrl.value) {
    URL.revokeObjectURL(localPreviewUrl.value)
    localPreviewUrl.value = ''
  }
  uploadedImageUrl.value = '' // 同时清除已上传的 URL
  imageLoadError.value = false
}

// 图片加载错误处理（已废弃，但保留以防万一）
function handleImageError(e) {
  console.warn('⚠️ 图片预览失败:', form.value.image)
  imageLoadError.value = true
}
</script>

<style lang="scss" scoped>
.product-edit {
  .page-title {
    font-size: 18px;
    font-weight: 600;
  }
  
  .content-card {
    background: white;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .image-upload-container {
    display: flex;
    gap: 20px;
    align-items: flex-start;
    
    .image-uploader {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s;
      
      &:hover {
        border-color: #409eff;
      }
      
      :deep(.el-upload) {
        width: 148px;
        height: 148px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .preview-image {
        width: 148px;
        height: 148px;
        object-fit: cover;
        display: block;
      }
      
      .uploaded-indicator {
        width: 148px;
        height: 148px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #f0f9ff;
        
        .success-icon {
          font-size: 48px;
          color: #67c23a;
          margin-bottom: 8px;
        }
        
        .success-text {
          font-size: 14px;
          color: #67c23a;
        }
      }
      
      .image-uploader-icon {
        font-size: 28px;
        color: #8c939d;
      }
    }
    
    .image-url-input {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
}
</style>
