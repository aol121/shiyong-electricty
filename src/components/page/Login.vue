<template>
  <div class="login-wrap">
    <div class="ms-title">杭州世永电力</div>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" autofocus placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data: function() {
      var validateName = (rule, value, callback) => {
        if(value === '') {
          callback(new Error('请输入用户名'));
        } else {

          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if(value === '') {
          callback(new Error('请输入密码'));
        } else {

          callback();
        }
      };
      return {
        url: 'api/auth/login',
        visiable: ['real-time-status', 'historic-record', 'alarm-record', 'alarm-set', 'device-management', 'user-management'],
        getList: [],
        firstRouter: '',
        ruleForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [{
            required: true,
            validator: validateName,
            //          message: '请输入用户名',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            validator: validatePass,
            //          message: '用户名或密码错误',
            trigger: 'blur'
          }]
        },
        isMobile: false
      }
    },
    mounted() {
      this.is_moblie();
    },
    computed: {
      filterList() {
        return this.visiable.filter((v) => {
          if(this.getList && this.getList > 0) {
            for(let i in this.getList) {
              if(v == this.getList[i]) {
                return v;
              }
            }
          } else {
            return [];
          }

        })
      }
    },
    methods: {
      is_moblie() {
        let browser = {
          versions: function() {
            let u = navigator.userAgent,
              app = navigator.appVersion;
            return { //移动终端浏览器版本信息   
              trident: u.indexOf('Trident') > -1, //IE内核  
              presto: u.indexOf('Presto') > -1, //opera内核  
              webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核  
              gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核  
              mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端  
              ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端  
              android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器  
              iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器  
              iPad: u.indexOf('iPad') > -1, //是否iPad    
              webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部  
              weixin: u.indexOf('MicroMessenger') > -1, //是否微信   
              qq: u.match(/\sQQ/i) == " qq" //是否QQ  
            };
          }(),
          language: (navigator.browserLanguage || navigator.language).toLowerCase()
        }

        if(browser.versions.mobile || browser.versions.ios || browser.versions.android ||
          browser.versions.iPhone || browser.versions.iPad) {
//        window.location = "http://m.zhaizhainv.com";
          this.isMobile = true;
        }else {
          this.isMobile = false;
        }
      },
      submitForm(formName) {
        const self = this;
        //              elememnt-Ui 里的表单验证
        self.$refs[formName].validate((valid) => {
          if(valid) {
            self.$axios.post(self.url, JSON.stringify({
              params: {
                username: self.ruleForm.username,
                password: self.ruleForm.password
              }
            }), {
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json;charset=utf-8'
              },
              responseType: 'json' // default
            }).then((res) => {
              if(res.data.success) {
                localStorage.setItem('ms_username', self.ruleForm.username);
                localStorage.setItem('ms_userid', res.data.data.id);
                self.getList = res.data.data.accessModuleCodeList
                if(!self.isMobile) {
                  if(!res.data.data.accessModuleCodeList) {
                    self.$router.push('/space-page'); //添加router--设置首页
                  } else if(res.data.data.accessModuleCodeList.length == 6) {
                    self.$router.push('/real-time-status'); //添加router--设置首页
                  } else {
                    self.$router.push('/' + self.filterList[0]); //添加router--设置首页
                  }
                  self.$message({
                    type: 'success',
                    message: res.data.message
                  })
                } else {
                  self.$router.push('/mobile');

                }

              } else {
                self.$message.error(res.data.message)
              }
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;
  }
  
  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 160px;
    margin: -150px 0 0 -190px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
  }
  
  .login-btn {
    text-align: center;
  }
  
  .login-btn button {
    width: 100%;
    height: 36px;
  }
  
  @media screen and (max-width:480px) {
    .ms-login {
      width: 230px;
      padding: 30px;
      margin: -120px 0 0 -145px;
    }
  }
</style>