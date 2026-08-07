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
          <el-input v-model="form.image" placeholder="请输入图片URL" />
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
            <el-radio label="ON_SALE">上架</el-radio>
            <el-radio label="OFF_SALE">下架</el-radio>
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
import { productApi } from '@/api/product'

const route = useRoute()
const router = useRouter()
const formRef = ref()
const loading = ref(false)

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
    const response = await productApi.getDetail(productId.value)
    
    if (response.success) {
      const data = response.data
      form.value = {
        name: data.name || '',
        nameEn: data.nameEn || '',
        category: data.category || data.categoryCode || '',
        price: data.price || 0,
        desc: data.desc || data.description || '',
        image: data.image || data.imageUrl || '',
        stock: data.stock || 999,
        status: data.status || 'ON_SALE',
        isNew: data.isNew || false,
        isHot: data.isHot || false
      }
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
    
    const data = { ...form.value }
    
    if (productId.value) {
      // 编辑商品
      await productApi.update(productId.value, data)
    } else {
      // 添加商品
      await productApi.create(data)
    }
    
    ElMessage.success('保存成功')
    router.back()
  } catch (error) {
    console.error('保存失败:', error)
    if (error !== 'cancel') {
      ElMessage.error('保存失败')
    }
  } finally {
    loading.value = false
  }
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
}
</style>
