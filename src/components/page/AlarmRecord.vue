<template>
  <div class="table">

    <div class="handle-box">
      <el-select v-model="deviceId" placeholder="选择设备" class="handle-select mr10">
        <el-option label="不指定设备" value=""></el-option>
        <el-option v-for="device in deviceList" :label="device.name" :value="device.id"></el-option>

      </el-select>

      <el-date-picker
        v-model="value1"
        type="datetime"
        placeholder="选择开始时间">
      </el-date-picker> 
      <el-date-picker
        v-model="value2"
        type="datetime"
        placeholder="选择结束时间">
      </el-date-picker>
      <el-button type="primary" icon="search" @click="search">查询</el-button>
    </div>
    <el-table :data="data" stripe style="width: 100%" ref="multipleTable">
      <el-table-column prop="deviceCode" label="设备编号" sortable min-width="150">
      </el-table-column>
      <el-table-column prop="deviceName" label="设备名称" min-width="120">
      </el-table-column>
      <el-table-column prop="fieldName" label="采集内容">
      </el-table-column>
      <el-table-column prop="params" label="告警规则">
      </el-table-column>
      <el-table-column prop="value" label="采集参数">
      </el-table-column>
      <el-table-column prop="updateDate" label="告警时间" sortable min-width="200">
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="recordCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        url:{
          historicList:'api/data/getPageList',
          deviceList:'api/device/getPageList',//设备列表
        },
        deviceList:[],//设备列表
        deviceId:'',//用于查询设备时传参
        tableData: [],
        cur_page: 1,
        recordCount: 1,
        /*multipleSelection: [],
        select_cate: '',
        select_word: '',
        del_list: [],
        is_search: false,*/
        params:{
            beAlarm:1
        },
        value1:'',
        value2:''
      
    }

  },
  created() {
      this.getData();
    },
    computed: {
      data() {
        const self = this;
        return self.tableData.filter(function(d) {
          
          d.params = '';
          if(d.beAlarm == 1){
            d.alarmCompareType = d.alarmCompareType=='gt'? '>':(d.alarmCompareType=='lt'? '<': '=')
            d.params = d.alarmCompareType + d.alarmValue
          }
          
          return d;
 
        })
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getData();
      },
      getData() {
        let self = this;
        function historicList() {
          return self.$axios.get(self.url.historicList, {
            params: {
              params:self.params,
              pageIndex: self.cur_page - 1,
              pageSize: 10
              
            }
          });
        }
        function deviceList() {
          return self.$axios.get(self.url.deviceList,{
            params: {
              pageIndex: 0,
              pageSize: 9999
            }
          });
        }
        self.$axios.all([historicList(), deviceList()])
        .then(self.$axios.spread((res, deviceList)=>{
//        self.tableData = res.data.list;
          console.log(res.data.data)
          if(res.data.success){
            self.tableData = res.data.data.records
            self.recordCount = res.data.data.recordCount
          }
          if(deviceList.data.success) {
            self.deviceList = deviceList.data.data.records
          }
          
        }))

      },
      search() {
        this.params = {
          beAlarm:1
        };
        let flag = true;
        let value5 = [];
      
        if(this.deviceId){
          console.log('151',this.deviceId)
          this.params.deviceId = this.deviceId
        }
        if(this.value1) {
          console.log('168',this.value1)
          let d = new Date(this.value1)
          value5[0] = d.getFullYear() + '-' +
              (d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' +
              (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()) + ' ' +
              (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) + ':' +
              (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) + ':' +
              (d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds());                 
              this.params.createDate__gt = value5[0]

        }
        if(this.value2) {
          let d = new Date(this.value2) 
          value5[1] = d.getFullYear() + '-' +
              (d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' +
              (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()) + ' ' +
              (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) + ':' +
              (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) + ':' +
              (d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds());

          this.params.createDate__lt = value5[1]
        }
        console.log('218',value5)
        console.log('219',this.params)
        if(this.value1 && this.value2){
          if(new Date(this.value1).getTime()>new Date(this.value2).getTime()){
            this.$message.error("开始时间不能晚于结束时间！")
            this.value1 = ''
            this.value2 = ''
            flag = false;
          }else {
            flag = true;
          }
        }
        if(flag){
          if((this.deviceId || value5)) {
            this.getData()
          }else {
            this.params = {
              beAlarm:1
            }
            this.getData()
          }
        }                          
      }
    }
  }
</script>

<style scoped>
  .handle-select {
    width: 120px;
  }
  
  .handle-input {
    width: 300px;
    display: inline-block;
  }
  @media screen and (max-width:480px){
    .handle-box {
      line-height: 41px;
    }
  }
</style>