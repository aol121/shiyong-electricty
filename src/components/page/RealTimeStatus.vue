<template>
  <el-row class="row-box">
    <el-col :span="6" v-for="item in realTimeData">
      <el-row class="data-box ">
        <el-col :span="24/(item.recentDataList.length)" v-for="param in item.recentDataList">
          <p>{{param.fieldName}} </p>
          <p>{{param.value}}<br /><span>&nbsp;</span><span class="iconfont icon-gaojingjilu1" v-show="param.beAlarm ==1"></span><span>&nbsp;</span>
          </p>
        </el-col>
        <el-col :span="24">
                             设备：{{item.name}}
        </el-col>
      </el-row>
    </el-col>
  </el-row>

</template>

<script>
  export default {
    data() {
      return {
        url: 'api/data/getRecentDeviceDataPageList',
        pageCount:'',
        times:0,
        pageIndex:1,
        timer:null,
        realTimeData: [

        ]
      }
    },
    computed: {

    },
    mounted(){
      this.getData();
      clearInterval(this.timer)
      this.timer=setInterval(()=>{
        this.pageIndex=1;
        this.realTimeData=[];
        this.getData()
      },180000)
    },

    destroyed () {
      clearInterval(this.timer)
    },
    methods: {
      getData() {
        this.$axios.get(this.url, {
          params: {
            pageIndex: this.pageIndex-1,
            pageSize: 8
          }
        }).then((res)=>{
          console.log(res.data)
          this.pageIndex++              
          this.realTimeData = this.realTimeData.concat(res.data.data.records);//一直追加
          for(let i in this.realTimeData){
            if(this.realTimeData[i].recentDataList && this.realTimeData[i].recentDataList.length>0){
              
            }else {
              this.realTimeData[i].recentDataList = [{
                fieldName:"无~",
                value:"/"
              }]
            }
          }
          
          this.pageCount=res.data.data.pageCount;
          if(this.pageCount>this.pageIndex-1){//没有到最后一页
            this.getData()
          }
        })
      }
    }
  }
</script>

<style scoped="scoped">
  .el-row {
    padding: 10px;
  }
  
  .row-box>.el-col-6 {
    padding: 10px;
    min-width: 215px;
  }
  
  .el-row>.el-col-6 .data-box {
    padding: 5px 0;
    border-radius: 8px;
    background-color: #fff;
  }
  
  .el-row>.el-col-6 .data-box div p {
    text-align: center;
    padding: 6px 0 8px 0;
  }

  .el-row>.el-col-6 .data-box div p:nth-of-type(2) {
    font-size: 28px;
    font-weight: 300;
    color: #09bafd;
  }
  
  .el-row>.el-col-6 .data-box>.el-col-24:last-of-type {
    border-top: 1px solid #edeef2;
    padding: 6px 0 3px 12px;
  }
  
  .icon-gaojingjilu1 {
    color: #ff2728;
    margin-right: 0px;
  }
  
  @media screen and (max-width:480px){
   .el-row {
      padding: 0px;
    }
    .row-box>.el-col-6 {
      padding: 15px 15px 0;
      width:100%;
      
    }
    .row-box>.el-col-6:last-of-type {
      padding-bottom:15px;
    }
    
  }
</style>