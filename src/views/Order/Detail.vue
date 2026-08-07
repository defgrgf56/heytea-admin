<template>
  <div class="order-detail">
    <el-page-header @back="$router.back()" title="返回">
      <template #content>
        <span class="page-title">订单详情</span>
      </template>
    </el-page-header>

    <div class="content-card" style="margin-top: 20px;" v-loading="loading">
      <!-- 订单基本信息 -->
      <el-descriptions title="订单信息" :column="2" border>
        <el-descriptions-item label="订单号">{{ order.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ order.createTime }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getStatusType(order.status)">
            {{ getStatusText(order.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="支付方式">{{ order.payMethod }}</el-descriptions-item>
      </el-descriptions>

      <!-- 用户信息 -->
      <el-descriptions title="用户信息" :column="2" border style="margin-top: 20px;">
        <el-descriptions-item label="用户名">{{ order.userName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ order.phone }}</el-descriptions-item>
        <el-descriptions-item label="收货地址" :span="2">
          {{ order.address }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 商品清单 -->
      <div style="margin-top: 20px;">
        <h3>商品清单</h3>
        <el-table :data="order.items" border style="margin-top: 10px;">
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="specs" label="规格" />
          <el-table-column prop="price" label="单价" width="100">
            <template #default="{ row }">
              ¥{{ row.price }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="80" />
          <el-table-column label="小计" width="100">
            <template #default="{ row }">
              ¥{{ (row.price * row.quantity).toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 价格信息 -->
      <div class="price-info">
        <div class="price-row">
          <span>商品总价：</span>
          <span>¥{{ order.goodsAmount }}</span>
        </div>
        <div class="price-row">
          <span>配送费：</span>
          <span>¥{{ order.deliveryFee }}</span>
        </div>
        <div class="price-row total">
          <span>实付金额：</span>
          <span class="amount">¥{{ order.totalAmount }}</span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions" v-if="order.status !== 'completed' && order.status !== 'cancelled'">
        <el-button
          v-if="order.status === 'confirmed'"
          type="primary"
          @click="handleUpdateStatus('preparing')"
        >
          开始制作
        </el-button>
        <el-button
          v-if="order.status === 'preparing'"
          type="success"
          @click="handleUpdateStatus('delivering')"
        >
          开始配送
        </el-button>
        <el-button
          v-if="order.status === 'delivering'"
          type="success"
          @click="handleUpdateStatus('completed')"
        >
          完成订单
        </el-button>
        <el-button
          type="danger"
          @click="handleCancelOrder"
        >
          取消订单
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { orderApi } from '@/api/order'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const order = ref({
  orderNo: '',
  createTime: '',
  status: '',
  payMethod: '',
  userName: '',
  phone: '',
  address: '',
  items: [],
  goodsAmount: 0,
  deliveryFee: 0,
  totalAmount: 0
})

const statusMap = {
  pending: { text: '待支付', type: 'info' },
  confirmed: { text: '已确认', type: 'primary' },
  preparing: { text: '制作中', type: 'warning' },
  delivering: { text: '配送中', type: '' },
  completed: { text: '已完成', type: 'success' },
  cancelled: { text: '已取消', type: 'danger' }
}

onMounted(() => {
  loadOrder()
})

async function loadOrder() {
  loading.value = true
  
  try {
    const response = await orderApi.getDetail(route.params.id)
    
    if (response.success) {
      order.value = response.data
    }
  } catch (error) {
    console.error('加载订单详情失败:', error)
    ElMessage.error('加载订单详情失败')
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

async function handleUpdateStatus(newStatus) {
  const statusText = getStatusText(newStatus)
  try {
    await ElMessageBox.confirm(`确定要将订单状态更新为"${statusText}"吗？`, '提示', {
      type: 'warning'
    })
    
    await orderApi.updateStatus(route.params.id, newStatus)
    order.value.status = newStatus
    ElMessage.success('状态更新成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更新状态失败:', error)
      ElMessage.error('状态更新失败')
    }
  }
}

async function handleCancelOrder() {
  try {
    await ElMessageBox.confirm('确定要取消该订单吗？', '警告', {
      type: 'error'
    })
    
    await orderApi.updateStatus(route.params.id, 'cancelled')
    order.value.status = 'cancelled'
    ElMessage.success('订单已取消')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消订单失败:', error)
      ElMessage.error('取消订单失败')
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
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
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }
  
  .price-info {
    margin-top: 20px;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 8px;
    text-align: right;
    
    .price-row {
      display: flex;
      justify-content: flex-end;
      gap: 20px;
      margin-bottom: 10px;
      font-size: 14px;
      
      &.total {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #dcdfe6;
        font-size: 16px;
        font-weight: 600;
        
        .amount {
          color: #f56c6c;
          font-size: 20px;
        }
      }
    }
  }
  
  .actions {
    margin-top: 30px;
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;
  }
}
</style>
