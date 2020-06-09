<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="query.orderNo" placeholder="订单号" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px; float: right;" type="success" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <el-table :key="tableKey" v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="课程名称" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.courseId}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付金额" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.orderPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单时间" align="center" width="200">
        <template slot-scope="scope">
          <span >{{ scope.row.tradeTime}}</span>
        </template>
      </el-table-column>
        <el-table-column label="交易银行" align="center" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.tradeBank}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.orderStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-show="total>0"
        :current-page="query.current"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="query.size"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="dataForm" :model="modelForm" :rules="rules" label-position="left" label-width="100px" style="width: 450px; margin-left:50px;">
        <el-form-item label="商品名称" prop="proName">
          <el-input v-model="modelForm.proName" />
        </el-form-item>
        <el-form-item label="商品金额" prop="price">
          <el-input v-model="modelForm.price" />
        </el-form-item>
        <el-form-item label="支付方式" prop="payWay">
          <el-input v-model="modelForm.payWay" />
        </el-form-item>
        <el-form-item label="订单时间" prop="orderTime">
          <el-input v-model="modelForm.orderTime" />
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-input v-model="modelForm.orderStatus" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">新增</el-button>
        <el-button v-else type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { page, add, get, update, del } from '@/api/order'

export default {
  data() {
    return {
      rules: {
        serviceName: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 1, max: 10, message: '不能超过10个汉字', trigger: 'blur' }
        ]
      },
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      modelForm: {
      },
      showOptions: [
        { label: '未支付', key: '1', value: 1 },
        { label: '已支付', key: '2', value: 2 },
        { label: '已取消', key: '3', value: 3 }
      ],
      query: {
        current: 1,
        size: 10
      },
      total: 0,
      tableKey: 0,
      loading: true,
      list: null
    }
  },
  created() {
    this.page()
  },
  methods: {
    del(row) {
      const _this = this
      _this
        .$confirm('确认删除？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
        .then(() => {
          del({ id: row.id }).then(response => {
            if (response.resultCode === 10000) {
              _this.$message({
                type: 'success',
                message: response.resultDesc
              })
            }
            _this.page()
          })
        })
        .catch(action => {})
    },
    page() {
      const _this = this
      _this.loading = true

      page(_this.query).then(response => {
        _this.list = response.data.records
        _this.total = Number(response.data.total)
        _this.loading = false
      })
    },
    resetForm() {
      this.modelForm = {
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFilter() {
      this.query.page = 1
      this.page()
    },
    handleSizeChange(val) {
      this.query.size = val
      this.page()
    },
    handleCurrentChange(val) {
      this.query.current = val
      this.page()
    },
    createData() {
      const _this = this
      _this.$refs['dataForm'].validate(valid => {
        if (valid) {
          add(_this.modelForm).then(response => {
            if (response.resultCode === 10000) {
              _this.dialogFormVisible = false
              _this.$message({
                type: 'success',
                message: response.resultDesc
              })
              _this.page()
            }
          })
        }
      })
    },
    updateData() {
      const _this = this
      _this.$refs['dataForm'].validate(valid => {
        if (valid) {
          delete _this.modelForm.createTime
          delete _this.modelForm.updatedTime
          update(_this.modelForm).then(response => {
            if (response.resultCode === 10000) {
              _this.dialogFormVisible = false
              _this.$message({
                type: 'success',
                message: response.resultDesc
              })
              _this.page()
            }
          })
        }
      })
    },
    handleUpdate(row) {
      const _this = this
      get({ id: row.id }).then(response => {
        _this.modelForm = Object.assign({}, response.data)
        _this.dialogStatus = 'update'
        _this.dialogFormVisible = true
        _this.$nextTick(() => {
          _this.$refs['dataForm'].clearValidate()
        })
      })
    }
  }
}
</script>
<style>
</style>
