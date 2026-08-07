<template>
  <div class="user-detail">
    <el-page-header @back="$router.back()" title="返回">
      <template #content>
        <span class="page-title">用户详情</span>
      </template>
    </el-page-header>

    <div v-loading="loading" style="margin-top: 20px;">
      <!-- 用户基本信息 -->
      <div class="content-card">
        <div class="card-header">
          <h3>基本信息</h3>
          <div class="header-actions">
            <el-tag :type="user.status === 'active' ? 'success' : 'danger'">
              {{ user.status === 'active' ? '正常' : '已禁用' }}
            </el-tag>
          </div>
        </div>
        
        <div class="user-info-section">
          <div class="user-avatar-section">
            <el-avatar :src="user.avatar || getDefaultAvatar(user.username)" :size="120" />
            <div class="avatar-info">
              <h2>{{ user.username }}</h2>
              <p class="user-id">ID: {{ user.id }}</p>
              <div class="user-tags">
                <el-tag
                  v-for="tag in user.tags"
                  :key="tag"
                  :type="getTagType(tag)"
                  size="small"
                  style="margin-right: 5px"
                >
                  {{ getTagText(tag) }}
                </el-tag>
              </div>
            </div>
          </div>
          
          <el-descriptions :column="2" border>
            <el-descriptions-item label="邮箱">
              {{ user.email || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="手机号">
              {{ user.phone || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="性别">
              {{ getGenderText(user.gender) }}
            </el-descriptions-item>
            <el-descriptions-item label="生日">
              {{ user.birthday || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="注册时间">
              {{ formatDate(user.createdAt) }}
            </el-descriptions-item>
            <el-descriptions-item label="最后登录">
              {{ formatDate(user.lastLoginAt) }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <!-- 消费统计 -->
      <div class="content-card" style="margin-top: 20px;">
        <div class="card-header">
          <h3>消费统计</h3>
        </div>
        
        <div class="statistics-grid">
          <div class="stat-card primary">
            <div class="stat-icon">
              <el-icon><ShoppingCart /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics.orderCount || 0 }}</div>
              <div class="stat-label">订单总数</div>
            </div>
          </div>
          
          <div class="stat-card success">
            <div class="stat-icon">
              <el-icon><Wallet /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">¥{{ statistics.totalSpent || 0 }}</div>
              <div class="stat-label">消费总额</div>
            </div>
          </div>
          
          <div class="stat-card warning">
            <div class="stat-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">¥{{ statistics.avgOrderAmount || 0 }}</div>
              <div class="stat-label">平均订单金额</div>
            </div>
          </div>
          
          <div class="stat-card danger">
            <div class="stat-icon">
              <el-icon><Star /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics.favoriteCount || 0 }}</div>
              <div class="stat-label">收藏商品</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单历史 -->
      <div class="content-card" style="margin-top: 20px;">
        <div class="card-header">
          <h3>订单历史</h3>
          <div class="header-actions">
            <el-button size="small" @click="loadOrders">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
        
        <el-table
          :data="orders"
          v-loading="ordersLoading"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="orderNo" label="订单号" width="180" />
          
          <el-table-column label="商品" min-width="200">
            <template #default="{ row }">
              <div class="order-items">
                {{ row.items?.map(i => i.name).join('、') || '-' }}
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
              <el-tag :type="getOrderStatusType(row.status)">
                {{ getOrderStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="createdAt" label="下单时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button
                link
                type="primary"
                size="small"
                @click="handleViewOrder(row)"
              >
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="pagination" v-if="ordersTotal > 10">
          <el-pagination
            v-model:current-page="ordersPage"
            v-model:page-size="ordersPageSize"
            :total="ordersTotal"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next"
            @size-change="loadOrders"
            @current-change="loadOrders"
          />
        </div>
      </div>

      <!-- 收货地址 -->
      <div class="content-card" style="margin-top: 20px;">
        <div class="card-header">
          <h3>收货地址</h3>
        </div>
        
        <div v-if="addresses.length > 0" class="address-list">
          <div
            v-for="address in addresses"
            :key="address.id"
            class="address-card"
          >
            <div class="address-header">
              <div>
                <span class="address-name">{{ address.receiverName }}</span>
                <span class="address-phone">{{ address.receiverPhone }}</span>
              </div>
              <el-tag v-if="address.isDefault" type="success" size="small">
                默认地址
              </el-tag>
            </div>
            <div class="address-detail">
              {{ address.province }} {{ address.city }} {{ address.district }}
              {{ address.detailAddress }}
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无收货地址" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userApi } from '@/api/user'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const ordersLoading = ref(false)

const user = ref({
  id: '',
  username: '',
  email: '',
  phone: '',
  avatar: '',
  gender: '',
  birthday: '',
  status: 'active',
  tags: [],
  createdAt: '',
  lastLoginAt: ''
})

const statistics = ref({
  orderCount: 0,
  totalSpent: 0,
  avgOrderAmount: 0,
  favoriteCount: 0
})

const orders = ref([])
const ordersPage = ref(1)
const ordersPageSize = ref(10)
const ordersTotal = ref(0)

const addresses = ref([])

// 标签映射
const tagMap = {
  'vip': { text: 'VIP', type: 'danger' },
  'new': { text: '新用户', type: 'success' },
  'active': { text: '活跃用户', type: 'warning' }
}

// 订单状态映射
const orderStatusMap = {
  pending: { text: '待支付', type: 'info' },
  confirmed: { text: '已确认', type: 'primary' },
  preparing: { text: '制作中', type: 'warning' },
  delivering: { text: '配送中', type: '' },
  completed: { text: '已完成', type: 'success' },
  cancelled: { text: '已取消', type: 'danger' }
}

onMounted(() => {
  loadUserDetail()
  loadUserStatistics()
  loadOrders()
})

// 加载用户详情
async function loadUserDetail() {
  loading.value = true
  
  try {
    console.log('🔍 请求用户详情，ID:', route.params.id)
    
    // API 响应拦截器已经解包了 data
    const data = await userApi.getDetail(route.params.id)
    
    console.log('📦 收到用户详情:', data)
    
    user.value = {
      id: data.id || '',
      username: data.username || '',
      email: data.email || '',
      phone: data.phone || data.mobile || '',
      avatar: data.avatar || '',
      gender: data.gender || '',
      birthday: data.birthday || '',
      status: data.status || 'active',
      tags: data.tags || [],
      createdAt: data.createdAt || data.createTime || '',
      lastLoginAt: data.lastLoginAt || data.lastLoginTime || ''
    }
    
    addresses.value = data.addresses || []
    
    console.log('✅ 用户详情加载成功')
  } catch (error) {
    console.error('❌ 加载用户详情失败:', error)
    ElMessage.error('加载用户详情失败')
  } finally {
    loading.value = false
  }
}

// 加载消费统计
async function loadUserStatistics() {
  try {
    const data = await userApi.getUserStatistics(route.params.id)
    
    statistics.value = {
      orderCount: data.orderCount || 0,
      totalSpent: data.totalSpent || 0,
      avgOrderAmount: data.avgOrderAmount || 0,
      favoriteCount: data.favoriteCount || 0
    }
  } catch (error) {
    console.error('❌ 加载消费统计失败:', error)
  }
}

// 加载订单历史
async function loadOrders() {
  ordersLoading.value = true
  
  try {
    const params = {
      page: ordersPage.value,
      pageSize: ordersPageSize.value
    }
    
    const data = await userApi.getUserOrders(route.params.id, params)
    
    if (Array.isArray(data)) {
      orders.value = data
      ordersTotal.value = data.length
    } else if (data && typeof data === 'object') {
      orders.value = data.list || data.items || data.orders || []
      ordersTotal.value = data.total || 0
    } else {
      orders.value = []
      ordersTotal.value = 0
    }
  } catch (error) {
    console.error('❌ 加载订单历史失败:', error)
    ElMessage.error('加载订单历史失败')
  } finally {
    ordersLoading.value = false
  }
}

// 查看订单详情
function handleViewOrder(row) {
  router.push(`/orders/${row.id}`)
}

// 获取标签文本
function getTagText(tag) {
  return tagMap[tag]?.text || tag
}

// 获取标签类型
function getTagType(tag) {
  return tagMap[tag]?.type || ''
}

// 获取性别文本
function getGenderText(gender) {
  const map = {
    'male': '男',
    'female': '女',
    'other': '其他'
  }
  return map[gender] || '未设置'
}

// 获取订单状态文本
function getOrderStatusText(status) {
  return orderStatusMap[status]?.text || status
}

// 获取订单状态类型
function getOrderStatusType(status) {
  return orderStatusMap[status]?.type || ''
}

// 获取默认头像
function getDefaultAvatar(username) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&size=200`
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
</script>

<style lang="scss" scoped>
.user-detail {
  .page-title {
    font-size: 18px;
    font-weight: 600;
  }
  
  .content-card {
    background: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
    
    .header-actions {
      display: flex;
      gap: 10px;
    }
  }
  
  .user-info-section {
    .user-avatar-section {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid #ebeef5;
      
      .avatar-info {
        h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 600;
        }
        
        .user-id {
          margin: 0 0 12px 0;
          color: #909399;
          font-size: 14px;
        }
        
        .user-tags {
          display: flex;
          gap: 8px;
        }
      }
    }
  }
  
  .statistics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    
    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      border-radius: 8px;
      background: linear-gradient(135deg, var(--color-start) 0%, var(--color-end) 100%);
      color: white;
      
      &.primary {
        --color-start: #667eea;
        --color-end: #764ba2;
      }
      
      &.success {
        --color-start: #11998e;
        --color-end: #38ef7d;
      }
      
      &.warning {
        --color-start: #f093fb;
        --color-end: #f5576c;
      }
      
      &.danger {
        --color-start: #fa709a;
        --color-end: #fee140;
      }
      
      .stat-icon {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
      }
      
      .stat-content {
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 14px;
          opacity: 0.9;
        }
      }
    }
  }
  
  .order-items {
    font-size: 14px;
    color: #606266;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .address-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
    
    .address-card {
      padding: 16px;
      border: 1px solid #ebeef5;
      border-radius: 8px;
      transition: all 0.3s;
      
      &:hover {
        border-color: #409eff;
        box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
      }
      
      .address-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        
        .address-name {
          font-weight: 600;
          margin-right: 12px;
        }
        
        .address-phone {
          color: #606266;
          font-size: 14px;
        }
      }
      
      .address-detail {
        color: #606266;
        font-size: 14px;
        line-height: 1.6;
      }
    }
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
