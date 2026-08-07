<template>
  <div class="user-list">
    <div class="content-card">
      <!-- 工具栏 -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="searchText"
            placeholder="搜索用户名/邮箱/手机号"
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
            placeholder="用户状态"
            clearable
            style="width: 150px"
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="正常" value="active" />
            <el-option label="已禁用" value="disabled" />
          </el-select>
          
          <el-select
            v-model="tagFilter"
            placeholder="用户标签"
            clearable
            style="width: 150px"
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="VIP" value="vip" />
            <el-option label="新用户" value="new" />
            <el-option label="活跃用户" value="active" />
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
        
        <el-table-column label="用户头像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar || getDefaultAvatar(row.username)" :size="50" />
          </template>
        </el-table-column>
        
        <el-table-column prop="username" label="用户名" width="150" />
        
        <el-table-column prop="email" label="邮箱" min-width="180" />
        
        <el-table-column prop="phone" label="手机号" width="130" />
        
        <el-table-column label="用户标签" width="200">
          <template #default="{ row }">
            <el-tag
              v-for="tag in row.tags"
              :key="tag"
              :type="getTagType(tag)"
              size="small"
              style="margin-right: 5px"
              closable
              @close="handleRemoveTag(row, tag)"
            >
              {{ getTagText(tag) }}
            </el-tag>
            <el-dropdown @command="(tag) => handleAddTag(row, tag)">
              <el-button size="small" text>
                <el-icon><Plus /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item 
                    v-for="tag in availableTags.filter(t => !row.tags.includes(t))"
                    :key="tag"
                    :command="tag"
                  >
                    {{ getTagText(tag) }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
        
        <el-table-column label="消费统计" width="150">
          <template #default="{ row }">
            <div class="stat-info">
              <div>订单：{{ row.orderCount || 0 }} 笔</div>
              <div>消费：¥{{ row.totalSpent || 0 }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="active"
              inactive-value="disabled"
              active-text="正常"
              inactive-text="禁用"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        
        <el-table-column prop="createdAt" label="注册时间" width="180">
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
              @click="handleView(row)"
            >
              查看详情
            </el-button>
            <el-button
              link
              type="warning"
              size="small"
              @click="handleResetPassword(row)"
            >
              重置密码
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
import { userApi } from '@/api/user'

const router = useRouter()

const loading = ref(false)
const searchText = ref('')
const statusFilter = ref('')
const tagFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])

// 可用的标签
const availableTags = ['vip', 'new', 'active']

// 标签映射
const tagMap = {
  'vip': { text: 'VIP', type: 'danger' },
  'new': { text: '新用户', type: 'success' },
  'active': { text: '活跃用户', type: 'warning' }
}

onMounted(() => {
  loadData()
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
      tag: tagFilter.value
    }
    
    const response = await userApi.getList(params)
    
    if (response.success) {
      tableData.value = response.data.list || response.data.items || []
      total.value = response.data.total || 0
    }
  } catch (error) {
    console.error('加载用户列表失败:', error)
    ElMessage.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

// 获取标签文本
function getTagText(tag) {
  return tagMap[tag]?.text || tag
}

// 获取标签类型
function getTagType(tag) {
  return tagMap[tag]?.type || ''
}

// 获取默认头像
function getDefaultAvatar(username) {
  // 使用 UI Avatars 生成默认头像
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&size=100`
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
  statusFilter.value = ''
  tagFilter.value = ''
  currentPage.value = 1
  loadData()
}

// 查看详情
function handleView(row) {
  router.push(`/users/${row.id}`)
}

// 状态切换
async function handleStatusChange(row) {
  const action = row.status === 'active' ? '启用' : '禁用'
  try {
    await ElMessageBox.confirm(`确定要${action}该用户吗？`, '提示', {
      type: 'warning'
    })
    
    await userApi.updateStatus(row.id, row.status)
    ElMessage.success(`${action}成功`)
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更新状态失败:', error)
      ElMessage.error(`${action}失败`)
      // 恢复原状态
      row.status = row.status === 'active' ? 'disabled' : 'active'
    } else {
      // 用户取消，恢复原状态
      row.status = row.status === 'active' ? 'disabled' : 'active'
    }
  }
}

// 添加标签
async function handleAddTag(row, tag) {
  try {
    const newTags = [...(row.tags || []), tag]
    await userApi.updateTags(row.id, newTags)
    
    row.tags = newTags
    ElMessage.success('标签添加成功')
  } catch (error) {
    console.error('添加标签失败:', error)
    ElMessage.error('添加标签失败')
  }
}

// 移除标签
async function handleRemoveTag(row, tag) {
  try {
    const newTags = (row.tags || []).filter(t => t !== tag)
    await userApi.updateTags(row.id, newTags)
    
    row.tags = newTags
    ElMessage.success('标签移除成功')
  } catch (error) {
    console.error('移除标签失败:', error)
    ElMessage.error('移除标签失败')
  }
}

// 重置密码
async function handleResetPassword(row) {
  try {
    const { value: newPassword } = await ElMessageBox.prompt(
      '请输入新密码',
      `重置 ${row.username} 的密码`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{6,}$/,
        inputErrorMessage: '密码长度至少 6 位'
      }
    )
    
    await userApi.resetPassword(row.id, newPassword)
    ElMessage.success('密码重置成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('重置密码失败:', error)
      ElMessage.error('重置密码失败')
    }
  }
}

// 删除用户
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${row.username}" 吗？此操作不可恢复！`,
      '警告',
      {
        type: 'error',
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      }
    )
    
    await userApi.delete(row.id)
    ElMessage.success('删除成功')
    loadData()
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
      status: statusFilter.value,
      tag: tagFilter.value
    }
    
    const response = await userApi.exportUsers(params)
    
    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `users_${Date.now()}.xlsx`)
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
.user-list {
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
  
  .stat-info {
    font-size: 12px;
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
