<template>
  <div class="address-list">
    <div class="content-card">
      <!-- 统计卡片 -->
      <div class="statistics-section" v-if="statistics">
        <div class="stat-card">
          <div class="stat-icon primary">
            <el-icon><Location /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.totalCount || 0 }}</div>
            <div class="stat-label">地址总数</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon success">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.userCount || 0 }}</div>
            <div class="stat-label">用户数</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon warning">
            <el-icon><Star /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.defaultCount || 0 }}</div>
            <div class="stat-label">默认地址数</div>
          </div>
        </div>
      </div>

      <!-- 工具栏 -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="searchText"
            placeholder="搜索用户名/手机号/地址"
            clearable
            style="width: 300px"
            @clear="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select
            v-model="provinceFilter"
            placeholder="省份筛选"
            clearable
            filterable
            style="width: 150px"
            @change="handleProvinceChange"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="province in provinces"
              :key="province"
              :label="province"
              :value="province"
            />
          </el-select>
          
          <el-select
            v-model="cityFilter"
            placeholder="城市筛选"
            clearable
            filterable
            style="width: 150px"
            @change="handleSearch"
            :disabled="!provinceFilter"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="city in cities"
              :key="city"
              :label="city"
              :value="city"
            />
          </el-select>
          
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </div>
        
        <div class="toolbar-right">
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            导出数据
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
        
        <el-table-column label="用户信息" min-width="150">
          <template #default="{ row }">
            <div class="user-info">
              <div class="user-name">{{ row.userName }}</div>
              <div class="user-id">ID: {{ row.userId }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="收货人" width="120">
          <template #default="{ row }">
            {{ row.receiverName }}
          </template>
        </el-table-column>
        
        <el-table-column prop="receiverPhone" label="联系电话" width="130" />
        
        <el-table-column label="收货地址" min-width="300">
          <template #default="{ row }">
            <div class="address-text">
              {{ row.province }} {{ row.city }} {{ row.district }} {{ row.detailAddress }}
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="标签" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.isDefault" type="danger" size="small">
              默认地址
            </el-tag>
            <el-tag v-if="row.label" type="info" size="small" style="margin-left: 5px">
              {{ row.label }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleViewUser(row)"
            >
              查看用户
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addressApi } from '@/api/address'

const router = useRouter()

const loading = ref(false)
const searchText = ref('')
const provinceFilter = ref('')
const cityFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])
const provinces = ref([])
const cities = ref([])
const statistics = ref(null)

onMounted(() => {
  loadData()
  loadProvinces()
  loadStatistics()
})

// 加载数据
async function loadData() {
  loading.value = true
  
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchText.value,
      province: provinceFilter.value,
      city: cityFilter.value
    }
    
    console.log('🔍 请求地址列表，参数:', params)
    
    // API 响应拦截器已经解包了 data
    const data = await addressApi.getList(params)
    
    console.log('📦 收到地址数据:', data)
    
    // 根据实际返回的数据结构解析
    if (Array.isArray(data)) {
      tableData.value = data
      total.value = data.length
    } else if (data && typeof data === 'object') {
      tableData.value = data.list || data.items || data.addresses || []
      total.value = data.total || data.count || 0
    } else {
      tableData.value = []
      total.value = 0
    }
    
    console.log('✅ 解析后的表格数据:', tableData.value.length, '条')
  } catch (error) {
    console.error('❌ 加载地址列表失败:', error)
    ElMessage.error('加载地址列表失败')
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 加载省份列表
async function loadProvinces() {
  try {
    const data = await addressApi.getProvinces()
    provinces.value = Array.isArray(data) ? data : (data.provinces || data.list || [])
  } catch (error) {
    console.error('❌ 加载省份列表失败:', error)
  }
}

// 加载城市列表
async function loadCities() {
  if (!provinceFilter.value) return
  
  try {
    const data = await addressApi.getCities(provinceFilter.value)
    cities.value = Array.isArray(data) ? data : (data.cities || data.list || [])
  } catch (error) {
    console.error('❌ 加载城市列表失败:', error)
  }
}

// 加载统计数据
async function loadStatistics() {
  try {
    const data = await addressApi.getStatistics()
    statistics.value = data
  } catch (error) {
    console.error('❌ 加载统计数据失败:', error)
  }
}

// 格式化日期
function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 搜索
function handleSearch() {
  currentPage.value = 1
  loadData()
}

// 重置
function handleReset() {
  searchText.value = ''
  provinceFilter.value = ''
  cityFilter.value = ''
  cities.value = []
  currentPage.value = 1
  loadData()
}

// 省份改变
function handleProvinceChange() {
  cityFilter.value = ''
  cities.value = []
  if (provinceFilter.value) {
    loadCities()
  }
  handleSearch()
}

// 查看用户
function handleViewUser(row) {
  router.push(`/users/${row.userId}`)
}

// 删除
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(
      `确定要删除 "${row.receiverName}" 的收货地址吗？此操作不可恢复！`,
      '警告',
      {
        type: 'error',
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      }
    )
    
    await addressApi.delete(row.id)
    ElMessage.success('删除成功')
    loadData()
    loadStatistics()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 导出数据
async function handleExport() {
  try {
    ElMessage.info('正在导出数据...')
    
    const params = {
      keyword: searchText.value,
      province: provinceFilter.value,
      city: cityFilter.value
    }
    
    const response = await addressApi.exportAddresses(params)
    
    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `addresses_${Date.now()}.xlsx`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
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
</script>

<style lang="scss" scoped>
.address-list {
  .content-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .statistics-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
    
    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      border-radius: 8px;
      background: white;
      border: 1px solid #ebeef5;
      transition: all 0.3s;
      
      &:hover {
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      }
      
      .stat-icon {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
        
        &.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        &.success {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }
        
        &.warning {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
      }
      
      .stat-content {
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #303133;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }
  
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .toolbar-left {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
  }
  
  .user-info {
    .user-name {
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .user-id {
      font-size: 12px;
      color: #909399;
    }
  }
  
  .address-text {
    font-size: 14px;
    color: #606266;
    line-height: 1.6;
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
