<template>
  <div class="login-wrap">
    <div class="ms-title">杭州世永电力</div>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <!--<p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填。</p>-->
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
          /*if(this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }*/
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if(value === '') {
          callback(new Error('请输入密码'));
        } else {
          /*if(this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }*/
          callback();
        }
      };
      return {
        url: '/api/auth/login',
        visiable:['real-time-status','historic-record','alarm-record','alarm-set','device-management','user-management'],
        getList:[],
        firstRouter:'',
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
        }
      }
    },
    computed:{
      filterList(){
        return this.visiable.filter((v)=>{
          for(let i in this.getList){
            if(v==this.getList[i]){
              return v
            }
          }
        })
      }
    },
    methods: {
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
//              localStorage.setItem('ms_password', res.data.data.password);
                console.log(res.data)
                self.getList = res.data.data.accessModuleCodeList
                if(res.data.data.accessModuleCodeList.length==0){
                  self.$router.push('/space-page'); //添加router--设置首页
                }else if(res.data.data.accessModuleCodeList.length==6){
                  self.$router.push('/real-time-status'); //添加router--设置首页
                }else {
                  self.$router.push('/'+self.filterList[0]); //添加router--设置首页
                }
                
//              self.$router.push('/spacePage.vue'); //添加router--设置首页
                self.$message({
                  type: 'success',
                  message:res.data.message
                })
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
</style>