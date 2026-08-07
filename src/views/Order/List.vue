<template>
  <div class="order-list">
    <div class="content-card">
      <!-- 工具栏 -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="searchText"
            placeholder="搜索订单号"
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
            placeholder="订单状态"
            clearable
            style="width: 150px"
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="待支付" value="pending" />
            <el-option label="已确认" value="confirmed" />
            <el-option label="制作中" value="preparing" />
            <el-option label="配送中" value="delivering" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
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
        <el-table-column prop="orderNo" label="订单号" width="180" />
        
        <el-table-column prop="userName" label="用户" width="120" />
        
        <el-table-column label="商品" min-width="200">
          <template #default="{ row }">
            <div class="order-items">
              {{ row.items.map(i => i.name).join('、') }}
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="totalAmount" label="订单金额" width="120">
          <template #default="{ row }">
            ¥{{ row.totalAmount }}
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="createTime" label="下单时间" width="180" />
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleView(row)"
            >
              查看详情
            </el-button>
            <el-button
              v-if="row.status === 'confirmed'"
              link
              type="success"
              size="small"
              @click="handleUpdateStatus(row, 'preparing')"
            >
              开始制作
            </el-button>
            <el-button
              v-if="row.status === 'preparing'"
              link
              type="success"
              size="small"
              @click="handleUpdateStatus(row, 'delivering')"
            >
              开始配送
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
import { orderApi } from '@/api/order'

const router = useRouter()

const loading = ref(false)
const searchText = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])

const statusMap = {
  pending: { text: '待支付', type: 'info' },
  confirmed: { text: '已确认', type: 'primary' },
  preparing: { text: '制作中', type: 'warning' },
  delivering: { text: '配送中', type: '' },
  completed: { text: '已完成', type: 'success' },
  cancelled: { text: '已取消', type: 'danger' }
}

onMounted(() => {
  loadData()
})

async function loadData() {
  loading.value = true
  
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchText.value,
      status: statusFilter.value
    }
    
    const response = await orderApi.getList(params)
    
    if (response.success) {
      tableData.value = response.data.list || response.data.items || []
      total.value = response.data.total || 0
    }
  } catch (error) {
    console.error('加载订单列表失败:', error)
    ElMessage.error('加载订单列表失败')
  } finally {
    loading.value = false
  }
}

function getStatusText(status) {
  return statusMap[status]?.text || status
}

function getStatusType(status) {
  return statusMap[status]?.type || ''
}

function handleSearch() {
  currentPage.value = 1
  loadData()
}

function handleView(row) {
  router.push(`/orders/${row.id}`)
}

async function handleUpdateStatus(row, newStatus) {
  const statusText = getStatusText(newStatus)
  try {
    await ElMessageBox.confirm(`确定要将订单状态更新为"${statusText}"吗？`, '提示', {
      type: 'warning'
    })
    
    await orderApi.updateStatus(row.id, newStatus)
    row.status = newStatus
    ElMessage.success('状态更新成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更新状态失败:', error)
      ElMessage.error('状态更新失败')
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
.order-list {
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
  
  .order-items {
    font-size: 14px;
    color: #606266;
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
