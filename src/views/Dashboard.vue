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
          <el-table :data="topProducts" stripe>
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="category" label="分类" width="120" />
            <el-table-column prop="sales" label="销量" width="100" />
            <el-table-column prop="price" label="价格" width="100">
              <template #default="{ row }">
                ¥{{ row.price }}
              </template>
            </el-table-column>
            <el-table-column prop="revenue" label="销售额" width="120">
              <template #default="{ row }">
                ¥{{ row.revenue }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// 统计卡片数据
const stats = ref([
  { title: '今日订单', value: '126', icon: 'ShoppingCart', type: 'primary' },
  { title: '今日销售额', value: '¥8,542', icon: 'Money', type: 'success' },
  { title: '待处理订单', value: '23', icon: 'Warning', type: 'warning' },
  { title: '商品总数', value: '156', icon: 'Goods', type: 'danger' }
])

// 热销商品数据
const topProducts = ref([
  { name: '多肉葡萄', category: '水果茶', sales: 234, price: 26, revenue: 6084 },
  { name: '芝士莓莓', category: '芝士茶', sales: 198, price: 28, revenue: 5544 },
  { name: '金凤茶王', category: '纯茶', sales: 167, price: 16, revenue: 2672 },
  { name: '芝芝桃桃', category: '芝士茶', sales: 145, price: 29, revenue: 4205 },
  { name: '生打椰椰', category: '椰子', sales: 128, price: 25, revenue: 3200 }
])

const salesChart = ref()
const orderChart = ref()

onMounted(() => {
  initSalesChart()
  initOrderChart()
})

// 初始化销售趋势图
function initSalesChart() {
  const chart = echarts.init(salesChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '销售额',
        type: 'line',
        data: [5420, 6130, 5890, 7240, 6780, 8120, 8542],
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
  
  chart.setOption(option)
  
  // 响应式
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 初始化订单状态图
function initOrderChart() {
  const chart = echarts.init(orderChart.value)
  
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
        data: [
          { value: 856, name: '已完成', itemStyle: { color: '#67C23A' } },
          { value: 45, name: '已确认', itemStyle: { color: '#409EFF' } },
          { value: 32, name: '制作中', itemStyle: { color: '#E6A23C' } },
          { value: 23, name: '待支付', itemStyle: { color: '#909399' } },
          { value: 12, name: '已取消', itemStyle: { color: '#F56C6C' } }
        ]
      }
    ]
  }
  
  chart.setOption(option)
  
  // 响应式
  window.addEventListener('resize', () => {
    chart.resize()
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
