<template>
  <div class="store-edit">
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
        v-loading="loading"
      >
        <el-form-item label="门店名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入门店名称" />
        </el-form-item>

        <el-form-item label="门店图片" prop="image">
          <el-upload
            class="store-uploader"
            :action="uploadAction"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
            :headers="uploadHeaders"
          >
            <img v-if="form.image" :src="form.image" class="store-image" />
            <el-icon v-else class="store-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="form-tip">建议上传 16:9 比例的图片，大小不超过 2MB</div>
        </el-form-item>

        <el-form-item label="所在城市" prop="city">
          <el-input v-model="form.city" placeholder="请输入城市，如：深圳市" />
        </el-form-item>

        <el-form-item label="所在区域" prop="district">
          <el-input v-model="form.district" placeholder="请输入区域，如：南山区" />
        </el-form-item>

        <el-form-item label="详细地址" prop="address">
          <el-input
            v-model="form.address"
            type="textarea"
            :rows="2"
            placeholder="请输入详细地址"
          />
        </el-form-item>

        <el-form-item label="地图坐标">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-input
                v-model="form.latitude"
                placeholder="纬度，如：22.5431"
                type="number"
              >
                <template #prepend>纬度</template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <el-input
                v-model="form.longitude"
                placeholder="经度，如：114.0579"
                type="number"
              >
                <template #prepend>经度</template>
              </el-input>
            </el-col>
          </el-row>
          <div class="form-tip">
            可在 <a href="https://lbs.amap.com/tools/picker" target="_blank">高德地图坐标拾取器</a> 获取精确坐标
          </div>
        </el-form-item>

        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>

        <el-form-item label="营业时间" required>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item prop="openTime">
                <el-time-select
                  v-model="form.openTime"
                  start="00:00"
                  step="00:30"
                  end="23:30"
                  placeholder="开始时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="closeTime">
                <el-time-select
                  v-model="form.closeTime"
                  start="00:00"
                  step="00:30"
                  end="23:30"
                  placeholder="结束时间"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="门店状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="open">营业中</el-radio>
            <el-radio label="closed">已关闭</el-radio>
            <el-radio label="maintenance">维护中</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="门店特色">
          <el-input
            v-model="form.features"
            type="textarea"
            :rows="3"
            placeholder="请输入门店特色，如：提供外卖服务、支持到店自提、24小时营业等"
          />
        </el-form-item>

        <el-form-item label="停车信息">
          <el-input
            v-model="form.parking"
            type="textarea"
            :rows="2"
            placeholder="请输入停车信息，如：商场地下停车场，前2小时免费"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
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
import { storeApi } from '@/api/store'

const route = useRoute()
const router = useRouter()
const formRef = ref()
const loading = ref(false)
const submitLoading = ref(false)

const storeId = computed(() => route.params.id)
const pageTitle = computed(() => storeId.value ? '编辑门店' : '添加门店')

const form = ref({
  name: '',
  image: '',
  city: '',
  district: '',
  address: '',
  latitude: '',
  longitude: '',
  phone: '',
  openTime: '09:00',
  closeTime: '22:00',
  status: 'open',
  features: '',
  parking: ''
})

const rules = {
  name: [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
  city: [{ required: true, message: '请输入所在城市', trigger: 'blur' }],
  district: [{ required: true, message: '请输入所在区域', trigger: 'blur' }],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  openTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  closeTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
}

// 上传相关
const uploadAction = import.meta.env.VITE_API_BASE_URL + '/admin/stores/upload'
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${localStorage.getItem('admin_token')}`
}))

onMounted(() => {
  if (storeId.value) {
    loadStore()
  }
})

// 加载门店数据
async function loadStore() {
  try {
    loading.value = true
    
    console.log('🔍 请求门店详情，ID:', storeId.value)
    
    // API 响应拦截器已经解包了 data
    const data = await storeApi.getDetail(storeId.value)
    
    console.log('📦 收到门店详情:', data)
    
    form.value = {
      name: data.name || '',
      image: data.image || '',
      city: data.city || '',
      district: data.district || '',
      address: data.address || '',
      latitude: data.latitude || '',
      longitude: data.longitude || '',
      phone: data.phone || '',
      openTime: data.openTime || '09:00',
      closeTime: data.closeTime || '22:00',
      status: data.status || 'open',
      features: data.features || '',
      parking: data.parking || ''
    }
    
    console.log('✅ 门店详情加载成功')
  } catch (error) {
    console.error('❌ 加载门店失败:', error)
    ElMessage.error('加载门店失败')
  } finally {
    loading.value = false
  }
}

// 上传前验证
function beforeUpload(file) {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 上传成功
function handleUploadSuccess(response) {
  if (response.success) {
    form.value.image = response.data.url
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error(response.message || '图片上传失败')
  }
}

// 上传失败
function handleUploadError(error) {
  console.error('上传失败:', error)
  ElMessage.error('图片上传失败')
}

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value.validate()
    submitLoading.value = true
    
    const data = { ...form.value }
    
    // 转换坐标为数字类型
    if (data.latitude) data.latitude = parseFloat(data.latitude)
    if (data.longitude) data.longitude = parseFloat(data.longitude)
    
    if (storeId.value) {
      // 编辑门店
      await storeApi.update(storeId.value, data)
      ElMessage.success('更新成功')
    } else {
      // 添加门店
      await storeApi.create(data)
      ElMessage.success('添加成功')
    }
    
    router.back()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('保存失败:', error)
      ElMessage.error('保存失败')
    }
  } finally {
    submitLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.store-edit {
  .page-title {
    font-size: 18px;
    font-weight: 600;
  }
  
  .content-card {
    background: white;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 800px;
  }
  
  .store-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s;
      
      &:hover {
        border-color: #409eff;
      }
    }
  }
  
  .store-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .store-image {
    width: 178px;
    height: 100px;
    display: block;
    object-fit: cover;
  }
  
  .form-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
    
    a {
      color: #409eff;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
