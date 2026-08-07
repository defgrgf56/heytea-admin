<template>
  <div class="category-list">
    <div class="content-card">
      <!-- 工具栏 -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="searchText"
            placeholder="搜索分类名称"
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
            添加分类
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
        <el-table-column prop="code" label="分类编码" width="120" />
        
        <el-table-column label="分类图标" width="100">
          <template #default="{ row }">
            <div class="category-icon">
              {{ row.icon || '🏷️' }}
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="name" label="分类名称" min-width="150" />
        
        <el-table-column prop="nameEn" label="英文名称" min-width="150" />
        
        <el-table-column label="商品数量" width="100">
          <template #default="{ row }">
            {{ row.productCount || 0 }}
          </template>
        </el-table-column>
        
        <el-table-column prop="sort" label="排序" width="150">
          <template #default="{ row }">
            <el-input-number
              v-model="row.sort"
              :min="0"
              size="small"
              controls-position="right"
              @change="handleSortChange(row)"
            />
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="active"
              inactive-value="inactive"
              active-text="启用"
              inactive-text="禁用"
              @change="handleStatusChange(row)"
            />
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
              @click="handleEdit(row)"
            >
              编辑
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

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="分类编码" prop="code">
          <el-input 
            v-model="form.code" 
            placeholder="请输入分类编码，如：fruit"
            :disabled="isEdit"
          />
          <div class="form-tip">分类编码创建后不可修改</div>
        </el-form-item>

        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称，如：水果茶" />
        </el-form-item>

        <el-form-item label="英文名称" prop="nameEn">
          <el-input v-model="form.nameEn" placeholder="请输入英文名称，如：Fruit Tea" />
        </el-form-item>

        <el-form-item label="分类图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标 Emoji，如：🍇" />
          <div class="form-tip">可以从 <a href="https://emojipedia.org/" target="_blank">Emojipedia</a> 复制</div>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="form.sort"
            :min="0"
            controls-position="right"
          />
          <div class="form-tip">数字越小越靠前</div>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { categoryApi } from '@/api/category'

const loading = ref(false)
const submitLoading = ref(false)
const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])

const dialogVisible = ref(false)
const formRef = ref()
const isEdit = ref(false)
const currentId = ref(null)

const form = ref({
  code: '',
  name: '',
  nameEn: '',
  icon: '',
  sort: 0,
  status: 'active'
})

const rules = {
  code: [
    { required: true, message: '请输入分类编码', trigger: 'blur' },
    { pattern: /^[a-z0-9_-]+$/, message: '只能包含小写字母、数字、下划线和横线', trigger: 'blur' }
  ],
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  nameEn: [{ required: true, message: '请输入英文名称', trigger: 'blur' }]
}

const dialogTitle = computed(() => isEdit.value ? '编辑分类' : '添加分类')

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
      keyword: searchText.value
    }
    
    const response = await categoryApi.getList(params)
    
    if (response.success) {
      tableData.value = response.data.list || response.data.items || []
      total.value = response.data.total || 0
    }
  } catch (error) {
    console.error('加载分类列表失败:', error)
    ElMessage.error('加载分类列表失败')
  } finally {
    loading.value = false
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

// 添加
function handleAdd() {
  isEdit.value = false
  currentId.value = null
  form.value = {
    code: '',
    name: '',
    nameEn: '',
    icon: '',
    sort: 0,
    status: 'active'
  }
  dialogVisible.value = true
}

// 编辑
function handleEdit(row) {
  isEdit.value = true
  currentId.value = row.id
  form.value = {
    code: row.code,
    name: row.name,
    nameEn: row.nameEn,
    icon: row.icon || '',
    sort: row.sort || 0,
    status: row.status
  }
  dialogVisible.value = true
}

// 状态切换
async function handleStatusChange(row) {
  const action = row.status === 'active' ? '启用' : '禁用'
  try {
    await categoryApi.updateStatus(row.id, row.status)
    ElMessage.success(`${action}成功`)
  } catch (error) {
    console.error('更新状态失败:', error)
    ElMessage.error(`${action}失败`)
    // 恢复原状态
    row.status = row.status === 'active' ? 'inactive' : 'active'
  }
}

// 排序修改
async function handleSortChange(row) {
  try {
    await categoryApi.updateSort(row.id, row.sort)
    ElMessage.success('排序更新成功')
    loadData()
  } catch (error) {
    console.error('更新排序失败:', error)
    ElMessage.error('更新排序失败')
    loadData()
  }
}

// 删除
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类 "${row.name}" 吗？删除后该分类下的商品将不再关联此分类。`,
      '警告',
      {
        type: 'error',
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      }
    )
    
    await categoryApi.delete(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value.validate()
    submitLoading.value = true
    
    if (isEdit.value) {
      await categoryApi.update(currentId.value, form.value)
      ElMessage.success('更新成功')
    } else {
      await categoryApi.create(form.value)
      ElMessage.success('添加成功')
    }
    
    dialogVisible.value = false
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('保存失败:', error)
      ElMessage.error('保存失败')
    }
  } finally {
    submitLoading.value = false
  }
}

// 关闭对话框
function handleDialogClose() {
  formRef.value?.resetFields()
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
.category-list {
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
  
  .category-icon {
    font-size: 24px;
    text-align: center;
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .form-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
    
    a {
      color: #409eff;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
