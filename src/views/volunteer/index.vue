<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <label>任务状态：</label>
        <el-select v-model="queryParams.status" placeholder="请选择" clearable @change="handleQuery">
          <el-option label="待取餐" :value="4" />
          <el-option label="配送中" :value="5" />
          <el-option label="已完成" :value="6" />
        </el-select>
      </div>
      
      <el-row :gutter="20">
        <el-col :span="8" v-for="item in tableData" :key="item.id" style="margin-bottom: 20px;">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>订单号: {{ item.number }}</span>
              <el-tag :type="getStatusType(item.status)" style="float: right">{{ getStatusText(item.status) }}</el-tag>
            </div>
            <div class="text item">
              <p><strong>取餐点:</strong> {{ item.diningPointName || '未知' }}</p>
              <p><strong>送餐地址:</strong> {{ item.address }}</p>
              <p><strong>收货人:</strong> {{ item.consignee }} ({{ item.phone }})</p>
              <p><strong>下单时间:</strong> {{ item.orderTime }}</p>
              <p v-if="item.remark" style="color: red"><strong>备注:</strong> {{ item.remark }}</p>
            </div>
            <div style="margin-top: 15px; text-align: center">
              <el-button type="primary" v-if="item.status === 4" @click="handlePickup(item.id)">确认取餐</el-button>
              <el-button type="success" v-if="item.status === 5" @click="handleComplete(item.id)">确认送达</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <el-pagination
        class="pageList"
        :page-sizes="[12, 24, 36]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getOrderDetailPage, deliveryOrder, completeOrder } from '@/api/order'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'VolunteerTask'
})
export default class extends Vue {
  private tableData: any[] = []
  private loading = false
  private total = 0
  private page = 1
  private pageSize = 12
  private queryParams = {
    status: 4, // 默认显示待取餐
    volunteerId: undefined
  }

  created() {
    this.queryParams.volunteerId = (UserModule.userInfo as any).id
    this.getList()
  }

  private async getList() {
    this.loading = true
    try {
      const res = await getOrderDetailPage({
        page: this.page,
        pageSize: this.pageSize,
        status: this.queryParams.status,
        volunteerId: this.queryParams.volunteerId
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

  private async handlePickup(id: number) {
    this.$confirm('确认已到达助餐点并取餐?', '提示', {
      type: 'warning'
    }).then(async () => {
      await deliveryOrder({ id })
      this.$message.success('操作成功')
      this.getList()
    })
  }

  private async handleComplete(id: number) {
    this.$confirm('确认餐品已送达老人手中?', '提示', {
      type: 'success'
    }).then(async () => {
      await completeOrder({ id })
      this.$message.success('任务完成')
      this.getList()
    })
  }

  private getStatusText(status: number) {
    const map: any = { 4: '待取餐', 5: '配送中', 6: '已完成' }
    return map[status] || '未知'
  }

  private getStatusType(status: number) {
    const map: any = { 4: 'warning', 5: 'primary', 6: 'success' }
    return map[status] || 'info'
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
    padding: 30px;
    border-radius: 4px;
  }
  .item p {
    margin: 8px 0;
    font-size: 14px;
    color: #606266;
  }
}
</style>
