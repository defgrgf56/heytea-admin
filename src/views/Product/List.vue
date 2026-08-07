<template>
  <div class="product-list">
    <div class="content-card">
      <!-- 工具栏 -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="searchText"
            placeholder="搜索商品名称"
            clearable
            style="width: 300px"
            @clear="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加商品
          </el-button>
        </div>
      </div>

      <!-- 表格 -->
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        
        <el-table-column label="商品图片" width="100">
          <template #default="{ row }">
            <div class="image-cell">
              <el-image
                v-if="row.image || row.imageUrl"
                :src="getProxyImageUrl(row.image || row.imageUrl)"
                :preview-src-list="[getProxyImageUrl(row.image || row.imageUrl)]"
                fit="cover"
                style="width: 60px; height: 60px; border-radius: 4px;"
                @error="handleImageError(row)"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div v-else class="no-image">
                <el-icon><Picture /></el-icon>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="name" label="商品名称" min-width="150" />
        
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            <el-tag>{{ getCategoryName(row.category || row.categoryCode) }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        
        <el-table-column prop="stock" label="库存" width="100" />
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'ON_SALE' ? 'success' : 'info'">
              {{ row.status === 'ON_SALE' ? '已上架' : '已下架' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="标签" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.isNew" type="danger" size="small">新品</el-tag>
            <el-tag v-if="row.isHot" type="warning" size="small">热销</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              link
              :type="row.status === 'ON_SALE' ? 'warning' : 'success'"
              size="small"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'ON_SALE' ? '下架' : '上架' }}
            </el-button>
            <el-button
              link
              type="danger"
              size="small"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import { productApi } from '@/api/product'
import { getProxyImageUrl } from '@/utils/image'

const router = useRouter()

const loading = ref(false)
const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])

// 分类映射
const categoryMap = {
  'fruit': '水果茶',
  'cheese': '芝士茶',
  'tea': '纯茶',
  'milk': '奶茶',
  'coffee': '咖啡'
}

onMounted(() => {
  loadData()
})

// 当页面被激活时（从添加/编辑页返回），重新加载数据
onActivated(() => {
  loadData()
})

// 加载数据
async function loadData() {
  loading.value = true
  
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchText.value
    }
    
    console.log('🔍 请求商品列表，参数:', params)
    
    // API 响应拦截器已经解包了 data，这里直接使用
    const data = await productApi.getList(params)
    
    console.log('📦 收到商品数据:', data)
    
    // 根据实际返回的数据结构解析
    if (Array.isArray(data)) {
      // 如果直接返回数组
      tableData.value = data
      total.value = data.length
    } else if (data && typeof data === 'object') {
      // 如果返回对象，尝试不同的字段名
      tableData.value = data.list || data.items || data.products || []
      total.value = data.total || data.count || 0
    } else {
      tableData.value = []
      total.value = 0
    }
    
    console.log('✅ 解析后的表格数据:', tableData.value.length, '条')
  } catch (error) {
    console.error('❌ 加载商品列表失败:', error)
    ElMessage.error('加载商品列表失败')
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function getCategoryName(code) {
  return categoryMap[code] || code
}

function handleSearch() {
  currentPage.value = 1
  loadData()
}

function handleAdd() {
  router.push('/products/add')
}

function handleEdit(row) {
  router.push(`/products/edit/${row.id}`)
}

async function handleToggleStatus(row) {
  const action = row.status === 'ON_SALE' ? '下架' : '上架'
  try {
    await ElMessageBox.confirm(`确定要${action}该商品吗？`, '提示', {
      type: 'warning'
    })
    
    const newStatus = row.status === 'ON_SALE' ? 'OFF_SALE' : 'ON_SALE'
    await productApi.updateStatus(row.id, newStatus)
    
    row.status = newStatus
    ElMessage.success(`${action}成功`)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更新状态失败:', error)
      ElMessage.error(`${action}失败`)
    }
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？此操作不可恢复！', '警告', {
      type: 'error'
    })
    
    await productApi.delete(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

function handleSizeChange(val) {
  pageSize.value = val
  loadData()
}

function handleCurrentChange(val) {
  currentPage.value = val
  loadData()
}

// 图片加载错误处理
function handleImageError(row) {
  console.warn('⚠️ 图片加载失败:', row.image || row.imageUrl)
  console.log('商品数据:', row)
}
</script>

<style lang="scss" scoped>
.product-list {
  .content-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .toolbar-left {
      display: flex;
      gap: 10px;
    }
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .image-cell {
    .image-error,
    .no-image {
      width: 60px;
      height: 60px;
      border-radius: 4px;
      background-color: #f5f7fa;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #c0c4cc;
      font-size: 24px;
    }
  }
}
</style>
