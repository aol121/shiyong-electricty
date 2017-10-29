<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="item in sidebarList">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [                   
                    {
                        icon: 'iconfont icon-shishizhuangtai1',
                        index: 'real-time-status',
                        title: '实时状态'
                    },
                    {
                        icon: 'iconfont icon-lishishuju',
                        index: 'historic-record',
                        title: '历史记录'
                    },
                    {
                        icon: 'iconfont icon-gaojingjilu1',
                        index: 'alarm-record',
                        title: '告警记录'
                    },
                    {
                        icon: 'iconfont icon-gaojingshezhi',
                        index: 'alarm-set',
                        title: '告警设置'
                    },
                    {
                        icon: 'iconfont icon-shebeiguanli1',
                        index: 'device-management',
                        title: '设备管理'
                    },
                    {
                        icon: 'iconfont icon-yonghuguanli1',
                        index: 'user-management',
                        title: '用户管理'
                    }
                ],
                visiable:[/*'real-time-status','historic-record','alarm-record','alarm-set','device-management','user-management'*/]
            }
        },
        
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            },         
            sidebarList() {
              const self = this;
              return self.items.filter(function(item) {
                for(let i in self.visiable){
                  if(item.index==self.visiable[i]){
                    return item;
                  }
                }             
              })
            }           
        },
        created(){
              this.getVisiableList();
        },
        methods:{
          getVisiableList(){
            this.$axios.get('/api/user/get',{
              params:{
                params:{
                  id:localStorage.getItem('ms_userid')
                }
              }
            }).then((res)=>{
              if(res.data.success){
                this.visiable = res.data.data.accessModuleCodeList
              }
              console.log('87',res.data.data)
            }).catch((error)=>{
              this.$message.error("网络不稳定，请求出错")
            })
          }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #fff;
    }
    .sidebar > ul {
        height:100%;
        overflow: auto;
    }
    /*.el-menu-item {
      background: #324157;
    }*/
</style>
