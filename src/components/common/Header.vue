<template>
  <div class="header">
    <div class="logo"></div>
    <div class="user-info">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link iconfont icon-gerenxinxi" title="个人信息更改">
                    <!--<img class="user-logo" src="../../../static/img/img.jpg">-->
                    <!--{{username}}-->
                </span>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="editOwnMess">{{username}}</el-dropdown-item>
          <el-dropdown-item command="changePassWord">修改密码</el-dropdown-item>

        </el-dropdown-menu>

      </el-dropdown>
      <span class="el-dropdown-link iconfont icon-tuichu" @click="logout" style="padding-left:0;" title="注销登录"></span>

    </div>

    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" class="changePassword" size="tiny">
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="demo-ruleForm">
        <el-row>

          <el-col :span="18" :offset="3">
            <div class="grid-content bg-purple">
              <el-form-item label="原密码" prop="oldPass">
                <el-input type="password" v-model="ruleForm2.oldPass" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="pass">
                <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </el-col>

        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm2')">确 定</el-button>
        <el-button @click="resetForm('ruleForm2')">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="个人信息" :visible.sync="dialogFormVisible3" size="tiny">
      <el-form label-position="top" :model="ruleForm3" ref="ruleForm3" class="demo-ruleForm">
        <el-row>
          <el-col :span="9" :offset="2">
            <div class="grid-content">
              <el-form-item label="用户名">
                <el-input :disabled="isDisabled" type="text" v-model="ruleForm3.username" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="9" :offset="2">
            <div class="grid-content">
              <el-form-item label="姓名">
                <el-input type="text" v-model="ruleForm3.name" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="9" :offset="2">
            <div class="grid-content">
              <el-form-item label="手机号">
                <el-input type="text" v-model="ruleForm3.mobile" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="9" :offset="2">
            <div class="grid-content">
              <el-form-item label="角色">
                <el-select v-model="ruleForm3.roleId" disabled placeholder="请选择角色">
                  <el-option v-for="role in roleList" :label="role.name" :value="role.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editOwnMess">确 定</el-button>
        <el-button @click="resetForm('ruleForm3')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if(value === '') {
          callback(new Error('请输入密码'));
        } else if(value && value.length < 6) {
          callback(new Error('密码至少为6个字母或数字或两者组合'));
        } else {
          if(this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if(value === '') {
          callback(new Error('请再次输入密码'));
        } else if(value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        name: '世永电力',
        dialogFormVisible: false,
        dialogFormVisible3: false,
        ruleForm2: { //修改密码弹窗
          oldPass: '',
          pass: '',
          checkPass: ''
        },
        ruleForm3: { //修改个人信息弹窗
          id: '',
          username: '',
          name: '',
          mobile: '',
          roleId: '',
          receiveAlarmMessage: ''
        },
        roleList: [],
        isDisabled: false,
        rules2: { //修改密码验证规则
          pass: [{
            validator: validatePass, //指定验证器
            trigger: 'blur'
          }],
          checkPass: [{
            validator: validatePass2,
            trigger: 'blur'
          }]
        }
      };

    },
    computed: {
      username() {
        let username = sessionStorage.getItem('ms_username');
        return username ? username : this.name;
      }
    },
    methods: {
      resetForm(formName) { //重置弹框数据
        this.dialogFormVisible = false
        this.dialogFormVisible3 = false
        this.$refs[formName].resetFields();
      },
      editOwnMess() { //修改个人信息
        this.$axios.post('api/user/update', {
          params: this.ruleForm3
        }).then((res) => {
          console.log('165', res.data)
          console.log(this.$router.app._route.fullPath)
          if(res.data.success) {
            this.$message.success(res.data.message)
            this.dialogFormVisible3 = false;
          }else if(res.data.code==200){
              this.$message.error("您已下线请重新登录！")
              this.$router.push('/login');
              sessionStorage.removeItem('ms_username')
              sessionStorage.removeItem('ms_userid')
            }else {
              this.$message.error("请求出错")
            }
        })
      },
      logout() {
          this.open2();
      },
      open2() { //注销提示
        this.$confirm('此操作将”退出登录“返回登录界面, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'

        }).then(() => {
          this.$axios.post('api/auth/logout').then((res) => {
            this.$message(res.data.message)
            this.$router.push('/login');
            sessionStorage.removeItem('ms_username')
            sessionStorage.removeItem('ms_userid')
            /*localStorage.removeItem('ms_username')
            localStorage.removeItem('ms_userid')*/
          }).catch((e) => {
            this.$router.push('/login');
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      submitForm(formName) {

        this.$refs[formName].validate((valid) => {
          if(valid) {

            this.$axios.post('api/user/editPassword', {
              params: {
                id: sessionStorage.getItem('ms_userid'),
                originalPassword: this.ruleForm2.oldPass,
                newPassword: this.ruleForm2.checkPass
              }
            }).then((res) => {
              if(res.data.success) {
                this.dialogFormVisible = false
                this.$message.success(res.data.message)
                this.logout();
              } else {
                this.$message.error(res.data.message)
              }
            }).catch((err) => {

            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleCommand(command) {
        let self = this;
        if(command === 'editOwnMess') { //command的值不同 执行方式不同
          this.dialogFormVisible3 = true

          function getRoleList() {
            return self.$axios.get('api/role/getList');
          }

          function getCurrentUser() {
            return self.$axios.get('api/user/get', {
              params: {
                params: {
                  id: sessionStorage.getItem('ms_userid')
                }
              }
            });
          }

          this.$axios.all([getRoleList(), getCurrentUser()])
            .then(this.$axios.spread((role, user) => {
              this.roleList = role.data.data
              console.log('219', user.data.data)
              let data = user.data.data
              this.ruleForm3 = { //修改个人信息弹窗
                id: data.id,
                username: data.username,
                name: data.name,
                mobile: data.mobile,
                roleId: data.roleId,
                receiveAlarmMessage: data.receiveAlarmMessage
              }
              this.isDisabled = true;

            }));
      

        } else if(command === 'changePassWord') {
          this.dialogFormVisible = true
          //        this.$router.push('/user-management'); //添加router--设置首页
        }
      }
    }
  }
</script>
<style scoped>
  .iconfont {
    font-size: 26px;
  }
  
  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
    border-bottom: 1px solid #edeef2;
  }
  
  .header .logo {
    float: left;
    width: 250px;
    height: 69px;
    text-align: center;
    background: url(../../../static/img/logo.png) no-repeat center center;
    background-size: 88%;
  }
  
  .el-dropdown-link {
    display: inline-block;
    line-height: 70px;
  }
  
  .user-info {
    float: right;
    padding-right: 30px;
    font-size: 16px;
    color: #fff;
  }
  
  .user-info .el-dropdown-link {
    position: relative;
    display: inline-block;
    padding-left: 30px;
    color: #000;
    cursor: pointer;
    vertical-align: middle;
  }
  /*  .changePassword .el-dialog__body {
    padding:0 100px;
  }*/
  
  .user-info .user-logo {
    position: absolute;
    left: 0;
    top: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  .el-dropdown-menu__item {
    text-align: center;
    font-size: 14px;
  }
</style>