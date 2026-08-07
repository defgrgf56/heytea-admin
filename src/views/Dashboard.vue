<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :xs="24" :sm="12" :md="6" v-for="stat in stats" :key="stat.title">
        <div class="stat-card">
          <div class="stat-icon" :class="stat.type">
            <el-icon :size="24">
              <component :is="stat.icon" />
            </el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.title }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts">
      <el-col :xs="24" :md="16">
        <div class="content-card">
          <h3>销售趋势</h3>
          <div ref="salesChart" style="width: 100%; height: 300px;"></div>
        </div>
      </el-col>
      
      <el-col :xs="24" :md="8">
        <div class="content-card">
          <h3>订单状态分布</h3>
          <div ref="orderChart" style="width: 100%; height: 300px;"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 热销商品 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="content-card">
          <h3>热销商品 TOP 5</h3>
          <el-table :data="topProducts" stripe v-loading="loading">
            <el-table-column prop="name" label="商品名称" min-width="200">
              <template #default="{ row }">
                <span>{{ row.name || '-' }}</span>
              </template>
            </el-table-column>
            <!-- 分类列被隐藏，因为后端接口不返回分类数据 -->
            <el-table-column prop="salesCount" label="销量" width="120" align="center">
              <template #default="{ row }">
                <el-tag type="primary">{{ row.salesCount || 0 }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" width="120" align="right">
              <template #default="{ row }">
                ¥{{ typeof row.price === 'number' ? row.price.toFixed(2) : '0.00' }}
              </template>
            </el-table-column>
            <el-table-column prop="totalRevenue" label="销售额" width="150" align="right">
              <template #default="{ row }">
                <span style="color: #67C23A; font-weight: bold;">
                  ¥{{ row.totalRevenue ? row.totalRevenue.toLocaleString() : '0' }}
                </span>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty description="暂无热销商品数据" />
            </template>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { dashboardApi } from '@/api'

// 加载状态
const loading = ref(false)

// 统计卡片数据
const stats = ref([
  { title: '今日订单', value: '-', icon: 'ShoppingCart', type: 'primary' },
  { title: '今日销售额', value: '-', icon: 'Money', type: 'success' },
  { title: '待处理订单', value: '-', icon: 'Warning', type: 'warning' },
  { title: '商品总数', value: '-', icon: 'Goods', type: 'danger' }
])

// 热销商品数据
const topProducts = ref([])

const salesChart = ref()
const orderChart = ref()

let salesChartInstance = null
let orderChartInstance = null

onMounted(async () => {
  await loadDashboardData()
})

// 加载仪表盘数据
async function loadDashboardData() {
  loading.value = true
  try {
    // 并行加载所有数据
    const [summary, salesTrend, orderDistribution, topProductsData] = await Promise.all([
      dashboardApi.getSummary(),
      dashboardApi.getSalesTrend({ days: 7 }),
      dashboardApi.getOrderDistribution(),
      dashboardApi.getTopProducts(5)
    ])
    
    // 更新统计卡片
    updateStats(summary)
    
    // 初始化图表
    initSalesChart(salesTrend)
    initOrderChart(orderDistribution)
    
    // 更新热销商品
    console.log('🔥 热销商品原始数据:', topProductsData)
    
    // 处理热销商品数据
    topProducts.value = (topProductsData || []).map(item => {
      return {
        // 商品基本信息
        id: item.id || item._id || item.productId,
        name: item.name || item.productName || item.title || '-',
        
        // 商品图片
        image: item.image || item.imageUrl || item.img,
        
        // 分类信息 - 热销商品接口可能不返回分类，显示占位符
        categoryName: item.categoryName || item.category || item.categoryCode || 
                     item.categoryLabel || '-',
        
        // 销量 - 后端返回的是 sales 字段
        salesCount: item.sales || item.salesCount || item.soldCount || 
                   item.count || item.quantity || 0,
        
        // 价格 - 热销商品接口可能不返回单价，根据销售额和销量计算（保持数字类型）
        price: item.price || item.unitPrice || item.salePrice || 
              (item.revenue && item.sales ? Number((item.revenue / item.sales).toFixed(2)) : 0),
        
        // 销售额 - 后端返回的是 revenue 字段
        totalRevenue: item.revenue || item.totalRevenue || item.salesAmount || 
                     item.totalAmount || 0
      }
    })
    
    console.log('🔥 热销商品处理后:', topProducts.value)
    
  } catch (error) {
    console.error('加载仪表盘数据失败:', error)
    ElMessage.error('加载数据失败，请刷新页面重试')
  } finally {
    loading.value = false
  }
}

// 更新统计卡片数据
function updateStats(summary) {
  if (!summary) return
  
  // 根据实际 API 返回的字段名调整
  // 可能的字段名：todayOrders/todayOrderCount, todaySales/todaySalesAmount, 
  // pendingOrders/pendingOrderCount, totalProducts/productCount
  const todayOrders = summary.todayOrders || summary.todayOrderCount || 0
  const todaySales = summary.todaySales || summary.todaySalesAmount || summary.todayRevenue || 0
  const pendingOrders = summary.pendingOrders || summary.pendingOrderCount || 0
  const totalProducts = summary.totalProducts || summary.productCount || summary.totalProductCount || 0
  
  stats.value = [
    { 
      title: '今日订单', 
      value: todayOrders, 
      icon: 'ShoppingCart', 
      type: 'primary' 
    },
    { 
      title: '今日销售额', 
      value: `¥${todaySales ? todaySales.toLocaleString() : 0}`, 
      icon: 'Money', 
      type: 'success' 
    },
    { 
      title: '待处理订单', 
      value: pendingOrders, 
      icon: 'Warning', 
      type: 'warning' 
    },
    { 
      title: '商品总数', 
      value: totalProducts, 
      icon: 'Goods', 
      type: 'danger' 
    }
  ]
  
  console.log('📊 工作台汇总数据:', summary)
}

// 初始化销售趋势图
function initSalesChart(trendData) {
  if (!salesChart.value) return
  
  // 销毁旧实例
  if (salesChartInstance) {
    salesChartInstance.dispose()
  }
  
  salesChartInstance = echarts.init(salesChart.value)
  
  // 处理数据 - 支持多种可能的字段名
  // API 可能返回: { date, sales/revenue/salesAmount, orders/orderCount }
  const dates = trendData?.map(item => {
    const dateStr = item.date || item.day || item.time
    if (!dateStr) return ''
    
    // 格式化日期显示
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }) || []
  
  const sales = trendData?.map(item => 
    item.sales || item.revenue || item.salesAmount || item.totalSales || 0
  ) || []
  
  console.log('📈 销售趋势数据:', { dates, sales, rawData: trendData })
  
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>销售额: ¥{c}'
    },
    xAxis: {
      type: 'category',
      data: dates
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '¥{value}'
      }
    },
    series: [
      {
        name: '销售额',
        type: 'line',
        data: sales,
        smooth: true,
        itemStyle: {
          color: '#409EFF'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
            ]
          }
        }
      }
    ]
  }
  
  salesChartInstance.setOption(option)
  
  // 响应式
  window.addEventListener('resize', () => {
    salesChartInstance?.resize()
  })
}

// 初始化订单状态图
function initOrderChart(distributionData) {
  if (!orderChart.value) return
  
  // 销毁旧实例
  if (orderChartInstance) {
    orderChartInstance.dispose()
  }
  
  orderChartInstance = echarts.init(orderChart.value)
  
  // 状态颜色映射
  const statusColors = {
    completed: '#67C23A',
    confirmed: '#409EFF',
    preparing: '#E6A23C',
    delivering: '#F89C26',
    pending: '#909399',
    cancelled: '#F56C6C'
  }
  
  // 状态名称映射
  const statusNames = {
    completed: '已完成',
    confirmed: '已确认',
    preparing: '制作中',
    delivering: '配送中',
    pending: '待处理',
    cancelled: '已取消'
  }
  
  console.log('📊 订单状态分布原始数据:', distributionData)
  
  // 处理数据 - distributionData 可能是对象或数组
  let chartData = []
  
  if (Array.isArray(distributionData)) {
    // 如果是数组格式: [{ status: 'completed', count: 100 }, ...]
    chartData = distributionData.map(item => ({
      value: item.count || item.value || 0,
      name: statusNames[item.status] || item.status || item.name,
      itemStyle: { color: statusColors[item.status] || '#909399' }
    }))
  } else if (distributionData && typeof distributionData === 'object') {
    // 如果是对象格式: { completed: 100, confirmed: 50, ... }
    chartData = Object.keys(distributionData).map(status => ({
      value: distributionData[status] || 0,
      name: statusNames[status] || status,
      itemStyle: { color: statusColors[status] || '#909399' }
    }))
  }
  
  console.log('📊 订单状态图表数据:', chartData)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center'
    },
    series: [
      {
        name: '订单状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: chartData
      }
    ]
  }
  
  orderChartInstance.setOption(option)
  
  // 响应式
  window.addEventListener('resize', () => {
    orderChartInstance?.resize()
  })
}
</script>

<style lang="scss" scoped>
.dashboard {
  .stat-cards {
    margin-bottom: 20px;
    
    .stat-card {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }
      
      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        
        &.primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        &.success { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
        &.warning { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
        &.danger { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
      }
      
      .stat-info {
        flex: 1;
        
        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #303133;
          margin-bottom: 8px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }
  
  .charts {
    margin-bottom: 20px;
  }
  
  .content-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 20px 0;
    }
  }
}
</style>
