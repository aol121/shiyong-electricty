<template>
  <div class="header">
    <!--我是头部-->
    <span class="iconfont icon-sanheng1" @click="showSidebar"></span>
    <div class="mask" v-show="maskShow" @click="is_showSidebar = false;maskShow = false;">

    </div>
    <transition name="xx">
      <div class="sidebar" v-if="is_showSidebar">
    	  <i class="el-icon-close" @click="hideSidebar"></i>
    		<ul>
    			<li :class="{current:is_currtent==1}" @click="is_currtent=1;is_showSidebar = false;maskShow = false;">
    			  <router-link to="/mobile/real-time-status"> 
    			    <span class="iconfont icon-shishizhuangtai1"></span>实时状态
    			  </router-link >
    			</li>
    			<li :class="{current:is_currtent==2}" @click="is_currtent=2;is_showSidebar = false;maskShow = false;">
    			  <router-link to="/mobile/historic-record"> 
    			  <span class="iconfont icon-lishishuju"></span>历史记录
    			  </router-link >
    			</li>
    			<li :class="{current:is_currtent==3}" @click="is_currtent=3;is_showSidebar = false;maskShow = false;">
    			  <router-link to="/mobile/alarm-record"> 
    			  <span class="iconfont icon-gaojingjilu1"></span>告警记录
    			  </router-link >
    			</li>
    		</ul>
    		<div class="logout" @click="logout">
    			<span class="iconfont icon-tuichu"></span>退出
    		</div>
    	</div>
    </transition>
  </div>
</template>

<script>
  export default {
    data() {
      return {

        is_currtent: 1,
        maskShow: false,
        is_showSidebar: false
      }
    },
    mounted(){
      if(this.$router.app._route.fullPath=='/mobile/real-time-status'){
        this.is_currtent = 1;
      }else if(this.$router.app._route.fullPath=='/mobile/historic-record'){
        this.is_currtent = 2;
      }else if(this.$router.app._route.fullPath=='/mobile/alarm-record'){
        this.is_currtent = 3;
      }
    },

    methods: {
      hideSidebar() {
        this.is_showSidebar = false
        this.maskShow = false;
      },
      showSidebar(){
        this.is_showSidebar = true
        this.maskShow = true;
      },
      logout() {
          this.$axios.post('api/auth/logout').then((res) => {
            this.$message(res.data.message)
            this.$router.push('/login');
            localStorage.removeItem('ms_username')
            localStorage.removeItem('ms_userid')
          }).catch((e) => {
            this.$router.push('/login');
          })
      }
    }
  }
</script>

<style scoped="scoped">
  .header {
    height: 50px;
    background: url(../../../static/img/mob-logo.png) no-repeat center center;
    color: #fff;
    /*text-align: center;*/
    /*box-shadow: 0px 0px 3px #ccc;*/
    border-bottom: 1px solid #edeef2;
    box-sizing: border-box;
    line-height: 50px;
    padding-left: 15px
  }
  
  .icon-sanheng1 {
    color: #3c9ef6;
  }
  
  .sidebar {
    position: fixed;
    top: 0;
    left: -00%;
    height: 100%;
    width: 60%;
    background-color: rgba(255, 255, 255, .98);
    color: #3c9ef6;
    z-index: 2501;
    /*padding:0 10px;*/
    text-align: right;

  }

  .xx-enter-active, .xx-leave-active {
    transition: all .3s ease-in-out;
  }
  .xx-enter, .xx-leave-to{
    opacity: .5;
    transform: translateX(-100%);
  }
  

  
  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .3);
    z-index: 2400;
  }
  .logout {
    position: absolute;
    left:0;
    bottom:0;
    width:100%;
    text-align: center;
    color:#333;
    border-top:1px solid #edeef2;
    
  }
  .logout .iconfont {
    font-size: 22px !important;
    vertical-align: middle;
  }
  .el-icon-close {
    margin-right: 10px;
    margin-bottom: 20%;
  }
  .sidebar ul {
    height:100%;
  }
  .sidebar ul li {
    text-align: center;
  }
  
  .sidebar ul li.current {
    background-color: #edeef2;
  }
  .sidebar ul li a {
    display: block;
    height:100%;
    color:#333;
  }
  .sidebar ul li .iconfont {
    font-size: 22px !important;
    vertical-align: middle;
    color: #3c9ef6;
  }
</style>