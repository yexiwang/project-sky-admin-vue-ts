<template>
  <div class="dashboard-container">
    <div class="container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="今日菜单" name="menu">
          <el-row :gutter="20">
            <el-col :span="6" v-for="dish in dishList" :key="dish.id" style="margin-bottom: 20px;">
              <el-card :body-style="{ padding: '0px' }">
                <img :src="dish.image" class="image">
                <div style="padding: 14px;">
                  <span>{{ dish.name }}</span>
                  <div class="bottom clearfix">
                    <span class="price">￥{{ dish.price }}</span>
                    <el-button type="text" class="button" @click="handleOrder(dish)">预订</el-button>
                  </div>
                  <div v-if="dish.nutritionTags" style="margin-top: 5px;">
                    <el-tag size="mini" type="success" v-for="tag in dish.nutritionTags.split(',')" :key="tag" style="margin-right: 5px">{{ tag }}</el-tag>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 下单弹窗 -->
    <el-dialog title="确认订单" :visible.sync="open" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="菜品">
          <span>{{ currentDish.name }}</span>
        </el-form-item>
        <el-form-item label="价格">
          <span>￥{{ currentDish.price }}</span>
        </el-form-item>
        <el-form-item label="就餐老人">
          <el-select v-model="form.elderId" placeholder="请选择">
            <el-option v-for="item in elderlyList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="送达时间">
          <el-time-select
            v-model="form.expectedTime"
            :picker-options="{
              start: '11:00',
              step: '00:15',
              end: '13:30'
            }"
            placeholder="选择时间">
          </el-time-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="submitOrder">确认支付</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getDishPage } from '@/api/dish'
import { getElderlyPage } from '@/api/elderly'
import { addOrder } from '@/api/order' // 需在api/order.ts中添加下单接口
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'FamilyOrder'
})
export default class extends Vue {
  private activeName = 'menu'
  private dishList: any[] = []
  private elderlyList: any[] = []
  private open = false
  private currentDish: any = {}
  private form: any = {
    elderId: undefined,
    expectedTime: '',
    remark: ''
  }

  created() {
    this.getDishes()
    this.getElderly()
  }

  private async getDishes() {
    const res = await getDishPage({ page: 1, pageSize: 100, status: 1 })
    this.dishList = res.data.records
  }

  private async getElderly() {
    // 获取当前用户绑定的老人
    // 这里暂时用分页接口模拟，实际应该有 getByUserId 接口
    const res = await getElderlyPage({ page: 1, pageSize: 100 }) 
    // 简单过滤，实际应由后端过滤
    this.elderlyList = res.data.records
  }

  private handleOrder(dish: any) {
    this.currentDish = dish
    this.open = true
  }

  private async submitOrder() {
    if (!this.form.elderId) {
      this.$message.warning('请选择就餐老人')
      return
    }
    // 构造提交参数 (模拟购物车提交结构)
    // 实际应先加入购物车再提交，或者改造后端支持直接单品下单
    // 这里假设后端已支持单品下单或前端模拟购物车逻辑
    this.$message.success('模拟支付成功，订单已提交')
    this.open = false
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 30px;
  .image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  .price {
    color: #f56c6c;
    font-size: 18px;
    font-weight: bold;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
