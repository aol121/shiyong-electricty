<template>
  <el-row>
    <el-col :span="6" v-for="item in realTimeData">
        <el-row class="data-box ">
          <el-col :span="24/(item.params.length)" v-for="param in item.params">
            <p>{{param.name}}</p>
            <p>{{param.name=="温度" ? param.value+'°c' : (param.name=="湿度" ? param.value+'%' : param.value+'w')}}<br />
              <span class="iconfont icon-gaojingjilu1" v-show="param.value<param.warmValue"></span>
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
    data(){
      return {
//      humidityWarning:false,
        realTimeData:[
          {
            name:"设备1",
            params:[
              {
                name:"温度",
                value:20,
                warmValue:15
              },
              {
                name:"湿度",
                value:20,
                warmValue:25
              },
              {
                name:"电力",
                value:80,
                warmValue:70
              }
            ]                          
          },
          {
            name:"设备2",
            params:[
              {
                name:"温度",
                value:20,
                warmValue:15
              },
              {
                name:"湿度",
                value:20,
                warmValue:25
              },
              {
                name:"电力",
                value:80,
                warmValue:90
              }
            ]                          
          },
          {
            name:"设备3",
            params:[
              {
                name:"温度",
                value:20,
                warmValue:15
              },
              {
                name:"湿度",
                value:20,
                warmValue:25
              }
            ]                          
          },
          {
            name:"设备4",
            params:[
              {
                name:"温度",
                value:20,
                warmValue:15
              },
              {
                name:"湿度",
                value:20,
                warmValue:25
              }
            ]                          
          }
          
        ]
      }  
    },
    computed:{

    }
  }
</script>

<style scoped="scoped">

  .el-row {
    padding:10px;
  }
  
  .el-row .el-col-6 {
    padding: 10px;
    min-width: 215px;
  }
  .el-row .el-col-6 .data-box {
    padding:5px 0;
    border-radius:8px;
    background-color: #fff;
    
  }
 
  .el-row .el-col-6 .data-box div p {
    text-align: center;
    padding:6px 0 8px 0;
  }
/*  .el-row .el-col-6 .data-box div p:first-of-type {
    font-size: 14px;
  }*/
  .el-row .el-col-6 .data-box div p:nth-of-type(2) {
    font-size: 28px;
    font-weight:300;
    color:#09bafd;
  }
  .el-row .el-col-6 .data-box>.el-col-24 {
    border-top:1px solid #edeef2;
    padding:6px 0 3px 12px;
  }
  .icon-gaojingjilu1 {
    color:#ff2728;
    margin-right:10px;
  }

</style>