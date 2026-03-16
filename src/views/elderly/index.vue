<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <label style="margin-right: 10px">老人姓名：</label>
        <el-input
          v-model="queryParams.name"
          placeholder="请输入老人姓名"
          style="width: 14%"
          clearable
          @clear="handleQuery"
          @keyup.enter.native="handleQuery"
        />
        <div class="tableLab">
          <el-button type="primary" @click="handleAdd">+ 新增老人档案</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        stripe
        class="tableBox"
        v-loading="loading"
      >
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="gender" label="性别" />
        <el-table-column prop="age" label="年龄" />
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column prop="address" label="居住地址" show-overflow-tooltip />
        <el-table-column prop="gridCode" label="所属网格" />
        <el-table-column prop="healthInfo" label="健康状况" show-overflow-tooltip />
        <el-table-column prop="specialNeeds" label="特殊需求" show-overflow-tooltip />
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="blueBug"
              @click="handleEdit(scope.row)"
            >
              修改
            </el-button>
            <el-button
              type="text"
              size="small"
              class="delBut non"
              @click="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pageList"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/修改弹窗 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="form.gender" placeholder="请选择">
                <el-option label="男" value="1" />
                <el-option label="女" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input-number v-model="form.age" :min="50" :max="120" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="居住地址" prop="address">
          <el-input v-model="form.address" type="textarea" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="所属网格" prop="gridCode">
          <el-input v-model="form.gridCode" placeholder="例如: A-01" />
        </el-form-item>
        <el-form-item label="健康状况" prop="healthInfo">
          <el-input v-model="form.healthInfo" type="textarea" placeholder="慢性病、过敏源等" />
        </el-form-item>
        <el-form-item label="特殊需求" prop="specialNeeds">
          <el-input v-model="form.specialNeeds" type="textarea" placeholder="例如: 需敲门大声、行动不便" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getElderlyPage,
  addElderly,
  editElderly,
  deleteElderly,
  queryElderlyById
} from '@/api/elderly'

@Component({
  name: 'Elderly'
})
export default class extends Vue {
  private tableData: any[] = []
  private loading = false
  private total = 0
  private page = 1
  private pageSize = 10
  private queryParams = {
    name: ''
  }
  private open = false
  private title = ''
  private form: any = {}
  private rules = {
    name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
    phone: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
    address: [{ required: true, message: '地址不能为空', trigger: 'blur' }]
  }

  created() {
    this.getList()
  }

  private async getList() {
    this.loading = true
    try {
      const res = await getElderlyPage({
        page: this.page,
        pageSize: this.pageSize,
        name: this.queryParams.name
      })
      this.tableData = res.data.records
      this.total = res.data.total
    } finally {
      this.loading = false
    }
  }

  private handleQuery() {
    this.page = 1
    this.getList()
  }

  private handleAdd() {
    this.reset()
    this.open = true
    this.title = '新增老人档案'
  }

  private async handleEdit(row: any) {
    this.reset()
    const id = row.id
    const res = await queryElderlyById(id)
    this.form = res.data
    this.open = true
    this.title = '修改老人档案'
  }

  private async submitForm() {
    (this.$refs['form'] as any).validate(async (valid: boolean) => {
      if (valid) {
        if (this.form.id != undefined) {
          await editElderly(this.form)
          this.$message.success('修改成功')
        } else {
          await addElderly(this.form)
          this.$message.success('新增成功')
        }
        this.open = false
        this.getList()
      }
    })
  }

  private async handleDelete(id: number) {
    this.$confirm('确认删除该老人档案吗?', '提示', {
      type: 'warning'
    }).then(async () => {
      await deleteElderly(id)
      this.$message.success('删除成功')
      this.getList()
    })
  }

  private reset() {
    this.form = {
      id: undefined,
      name: undefined,
      gender: '1',
      age: 60,
      phone: undefined,
      address: undefined,
      gridCode: undefined,
      healthInfo: undefined,
      specialNeeds: undefined
    }
  }

  private cancel() {
    this.open = false
    this.reset()
  }

  private handleSizeChange(val: number) {
    this.pageSize = val
    this.getList()
  }

  private handleCurrentChange(val: number) {
    this.page = val
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 30px;
  .container {
    background: #fff;
    position: relative;
    z-index: 1;
    padding: 30px 28px;
    border-radius: 4px;
    .tableBar {
      margin-bottom: 20px;
      .tableLab {
        float: right;
      }
    }
    .pageList {
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>
