<template>
  <div class="store-list">
    <div class="content-card">
      <!-- 工具栏 -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="searchText"
            placeholder="搜索门店名称/地址"
            clearable
            style="width: 300px"
            @clear="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select
            v-model="statusFilter"
            placeholder="门店状态"
            clearable
            style="width: 150px"
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="营业中" value="open" />
            <el-option label="已关闭" value="closed" />
            <el-option label="维护中" value="maintenance" />
          </el-select>
          
          <el-select
            v-model="cityFilter"
            placeholder="城市筛选"
            clearable
            filterable
            style="width: 150px"
            @change="handleSearch"
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
        </div>
        
        <div class="toolbar-right">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加门店
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
        
        <el-table-column label="门店图片" width="100">
          <template #default="{ row }">
            <el-image
              v-if="row.image"
              :src="row.image"
              :preview-src-list="[row.image]"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px;"
            />
            <div v-else class="no-image">暂无图片</div>
          </template>
        </el-table-column>
        
        <el-table-column prop="name" label="门店名称" min-width="180" />
        
        <el-table-column label="地址" min-width="250">
          <template #default="{ row }">
            {{ row.city }} {{ row.district }} {{ row.address }}
          </template>
        </el-table-column>
        
        <el-table-column prop="phone" label="联系电话" width="130" />
        
        <el-table-column label="营业时间" width="150">
          <template #default="{ row }">
            {{ row.openTime }} - {{ row.closeTime }}
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
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
            <el-dropdown @command="(cmd) => handleStatusChange(row, cmd)">
              <el-button link type="warning" size="small">
                状态 <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="open">营业中</el-dropdown-item>
                  <el-dropdown-item command="closed">已关闭</el-dropdown-item>
                  <el-dropdown-item command="maintenance">维护中</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
import { storeApi } from '@/api/store'

const router = useRouter()

const loading = ref(false)
const searchText = ref('')
const statusFilter = ref('')
const cityFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])
const cities = ref([])

// 状态映射
const statusMap = {
  'open': { text: '营业中', type: 'success' },
  'closed': { text: '已关闭', type: 'danger' },
  'maintenance': { text: '维护中', type: 'warning' }
}

onMounted(() => {
  loadData()
  loadCities()
})

// 加载数据
async function loadData() {
  loading.value = true
  
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchText.value,
      status: statusFilter.value,
      city: cityFilter.value
    }
    
    console.log('🔍 请求门店列表，参数:', params)
    
    // API 响应拦截器已经解包了 data
    const data = await storeApi.getList(params)
    
    console.log('📦 收到门店数据:', data)
    
    // 根据实际返回的数据结构解析
    if (Array.isArray(data)) {
      tableData.value = data
      total.value = data.length
    } else if (data && typeof data === 'object') {
      tableData.value = data.list || data.items || data.stores || []
      total.value = data.total || data.count || 0
    } else {
      tableData.value = []
      total.value = 0
    }
    
    console.log('✅ 解析后的表格数据:', tableData.value.length, '条')
  } catch (error) {
    console.error('❌ 加载门店列表失败:', error)
    ElMessage.error('加载门店列表失败')
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 加载城市列表
async function loadCities() {
  try {
    const data = await storeApi.getCities()
    cities.value = Array.isArray(data) ? data : (data.cities || data.list || [])
  } catch (error) {
    console.error('❌ 加载城市列表失败:', error)
  }
}

// 获取状态文本
function getStatusText(status) {
  return statusMap[status]?.text || status
}

// 获取状态类型
function getStatusType(status) {
  return statusMap[status]?.type || ''
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

// 添加
function handleAdd() {
  router.push('/stores/add')
}

// 编辑
function handleEdit(row) {
  router.push(`/stores/edit/${row.id}`)
}

// 状态修改
async function handleStatusChange(row, newStatus) {
  const statusText = getStatusText(newStatus)
  try {
    await ElMessageBox.confirm(`确定要将门店状态更改为"${statusText}"吗？`, '提示', {
      type: 'warning'
    })
    
    await storeApi.updateStatus(row.id, newStatus)
    row.status = newStatus
    ElMessage.success('状态更新成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更新状态失败:', error)
      ElMessage.error('状态更新失败')
    }
  }
}

// 删除
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(
      `确定要删除门店 "${row.name}" 吗？此操作不可恢复！`,
      '警告',
      {
        type: 'error',
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      }
    )
    
    await storeApi.delete(row.id)
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
</script>

<style lang="scss" scoped>
.store-list {
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
      flex-wrap: wrap;
    }
  }
  
  .no-image {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
    border-radius: 4px;
    color: #909399;
    font-size: 12px;
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
