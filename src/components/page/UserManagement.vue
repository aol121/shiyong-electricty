<template>
  <div class="table">

    <div class="handle-box">
      <el-button type="primary" icon="" class="handle-del mr10" @click="addUser">新增用户</el-button>
      <!--弹出对话框 Begin-->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form :label-position="labelPosition" :rules="rules" ref="formLabelAlign" label-width="80px" :model="formLabelAlign">
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purle">
                <el-form-item required label="用户名（必填）" prop="username">
                  <el-input :disabled="isDisabled" v-model="formLabelAlign.username"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purle">
                <el-form-item required label="姓名（必填）" prop="name">
                  <el-input v-model="formLabelAlign.name"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model.number="formLabelAlign.mobile"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label=" ">
                <!--<el-input v-model="formLabelAlign.mobile"></el-input>-->
                <el-checkbox v-model="formLabelAlign.receiveAlarmMessage" label="是否用于接收告警短信" name="type"></el-checkbox>
              </el-form-item>

            </el-col>

            <el-col :span="24">
              <el-form-item label="角色">
                <el-select v-model="formLabelAlign.roleId" placeholder="请选择角色">
                  <el-option v-for="role in roleList" :label="role.name" :value="role.id"></el-option>
            
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitDialog('formLabelAlign')">确 定</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>

        </div>
        <footer class="footer-tip">
          * 确认后用户名不可更改，初始密码为：123456，开通账号后请及时修改密码！
        </footer>
      </el-dialog>
      <!--弹出对话框 End-->
    </div>
    <el-table :data="data" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
      <!--<el-table-column type="selection" width="55"></el-table-column>-->
      <el-table-column prop="username" label="用户名" width="150">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号">
      </el-table-column>
      <el-table-column prop="roleName" label="角色">
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalCount">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        url: {
          userList: 'api/user/getPageList',
          roleList: 'api/role/getList',
          addUser: 'api/user/add',
          updateUser: 'api/user/update',
          deletUser: 'api/user/delete'
        },
        rules: {//检验手机号码
          username:[
            {
              required: true,
              message: '用户名不能为空',
              
            },
          ],
          name:[
            {
              required: true,
              message: '姓名不能为空',
              
            },
          ]
        
        },
        deleUserId:'',
        dialogTitle: '新增用户',
        isDisabled: false,
        tableData: [],
        totalCount: 1,
        cur_page: 1,
        multipleSelection: [],
        select_cate: '',
        select_word: '',
        del_list: [],
//      is_search: false,
        dialogFormVisible: false,
        labelPosition: 'top',
        formLabelAlign: { //弹出框数据
          id: '',
          username: '',
          name: '',
          mobile: null,
          receiveAlarmMessage: false,
          roleId: ''
        },
        roleList: [
          //角色列表
        ]
      }
    },

    created() { //页面创建完成时
      this.getData();
    },
    computed: {
      data() {
        const self = this;
        return self.tableData.filter(function(d) {
          return d;
        })
      }
    },
    methods: {
      submitDialog(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            if(this.dialogTitle === '新增用户') {
              this.checkAddUser()
            } else {
              this.checkUpdateUser()
            }
          }
        })

      },
      checkUpdateUser() {
        this.$axios.post(this.url.updateUser, {
          params: {
            id: this.formLabelAlign.id,
            username: this.formLabelAlign.username,
            name: this.formLabelAlign.name,
            mobile: this.formLabelAlign.mobile,
            roleId: this.formLabelAlign.roleId,
            receiveAlarmMessage: this.formLabelAlign.receiveAlarmMessage - 0
          }
        }).then((res) => {
          if(res.data.success) {
            this.dialogFormVisible = false;
            this.$message.success(res.data.message)
            this.getData();
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      checkAddUser() {
        this.$axios.post(this.url.addUser, {
          params: {
            username: this.formLabelAlign.username,
            name: this.formLabelAlign.name,
            mobile: this.formLabelAlign.mobile,
            roleId: this.formLabelAlign.roleId,
            receiveAlarmMessage: this.formLabelAlign.receiveAlarmMessage - 0
          }
        }).then((res) => {
          if(res.data.success) {
            this.dialogFormVisible = false;
            this.$message.success(res.data.message)
            this.getData();
          } else {
            this.$message.error(res.data.message)
          }
  
        })
      },
      addUser() { //新增用户
        this.dialogTitle = '新增用户';

        this.isDisabled = false;
        this.dialogFormVisible = true;
        this.formLabelAlign = { //清空弹出框数据
          id: '',
          username: '',
          name: '',
          mobile: null,
          receiveAlarmMessage: false,
          roleId: ''
        }
      },
      editUser() {
        this.dialogTitle = '编辑用户';
        this.dialogFormVisible = true;
      },
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getData();
      },
      getData() {
        let self = this;

        function getUserList() {
          return self.$axios.get(self.url.userList, {
            params: {
              pageIndex: self.cur_page - 1,
              pageSize: 10
            }
          });
        }
        function getRoleList() {
          return self.$axios.get(self.url.roleList);
        }
        self.$axios.all([getUserList(), getRoleList()]) //并发加载用户列表  角色列表
          .then(self.$axios.spread(function(userList, roleList) {
            // 两个请求现在都执行完成

            if(userList.data.success) {
              self.tableData = userList.data.data.records;
              self.totalCount = userList.data.data.recordCount;
            }else if(res.data.code==200){
              this.$message.error("您已下线请重新登录！")
              this.$router.push('/login');
              localStorage.removeItem('ms_username')
              localStorage.removeItem('ms_userid')
            }else { //请求失败
              this.$message.error("请求出错")
            }
            self.roleList = roleList.data.data;
         
          }));
      },
      handleEdit(index, row) { //编辑用户
        //      this.$message('编辑第' + (index + 1) + '行');
        console.log('165==', row)
        this.dialogTitle = '编辑用户';

        this.dialogFormVisible = true;
        //      填充表单
        this.formLabelAlign = { //弹出框数据
          id: row.id,
          username: row.username,
          name: row.name,
          mobile: row.mobile - 0,
          receiveAlarmMessage: !!(row.receiveAlarmMessage),
          roleId: row.roleId
        }
        this.isDisabled = true;
      },
      handleDelete(index, row) { //删除用户      
        this.open2(row.id);      
      },
      open2(id) {//删除前提示
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
       
        }).then(() => {
          console.log("300",id)
          this.$axios.post(this.url.deletUser,{
            params:{
              id:id
            }
          }).then((res)=>{
            if(res.data.success){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getData();
            }else if(res.data.code==200){
              this.$message.error("您已下线请重新登录！")
              this.$router.push('/login');
              localStorage.removeItem('ms_username')
              localStorage.removeItem('ms_userid')
            }else {
              this.$message.error("请求出错")
            }
            
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;

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
  
  .el-form-item .el-form-item__label {
    display: block;
  }
  
  .el-form-item {
    padding: 0 10px;
  }
  
  .el-select {
    width: 90%;
  }
  
  .el-checkbox {
    padding-top: 7px;
  }
  
  .footer-tip {
    
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    padding: 3px;
    color: #ff8a8e;
    background-color: #fde8e7;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
    
  }
</style>