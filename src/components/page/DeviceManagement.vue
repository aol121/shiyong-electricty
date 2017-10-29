<template>
  <div class="table">

    <div class="handle-box">
      <el-button type="primary" class="handle-del mr10" @click="addDevice('formLabelAlign')">添加设备</el-button>
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">

        <el-form :label-position="labelPosition" :rules="rules" label-width="80px" :model="formLabelAlign" ref="formLabelAlign">
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purle">
                <el-form-item required label="设备编号" prop="code">
                  <el-input v-model.number="formLabelAlign.code"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purle">
                <el-form-item required label="设备名称" prop="name">
                  <el-input v-model="formLabelAlign.name"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采集器型号">
                <el-select @change="loadFeildList($event,deviceInfo,deviceInfo.$index)" v-model="formLabelAlign.deviceInfoId" placeholder="请选择型号">
                  <el-option v-for="info in deviceInfo" :label="info.name" :key="info.id" :value="info.id"></el-option>
                  <!--<el-option label="型号二" value="beijing"></el-option>
                  <el-option label="型号三" value="beijing"></el-option>-->
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采集内容">
                <el-select multiple value-key="fieldCode" v-model="formLabelAlign.content" placeholder="请选择内容" no-data-text="先选择采集器">
                  <el-option v-for="field in fieldList" :label="field.fieldName" :key="field.fieldCode" :value="JSON.stringify(field)"></el-option>
                  <!-- <el-option v-for="field in fieldList" :label="field.fieldName" :key="field.fieldCode" :value="field"></el-option> -->
                  
                </el-select>
                
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input type="textarea" v-model="formLabelAlign.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('formLabelAlign')">确 定</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <el-table :data="data" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
      <!--<el-table-column type="selection" width="55"></el-table-column>-->
      <el-table-column prop="code" label="设备编号" sortable width="150">
      </el-table-column>
      <el-table-column prop="name" label="设备名称" width="120">
      </el-table-column>
      <el-table-column prop="deviceInfoName" label="设备型号" min-width="180">
      </el-table-column>
      <el-table-column prop="content" label="采集内容">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
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
        url: {
          deviceList: '/api/device/getPageList',
          deviceInfoList: '/api/deviceInfo/getList',
          addDevice: '/api/device/add',
          editDevice: '/api/device/update',
          deletDevice: '/api/device/delete'
          
        },
        rules: {
          code: [{
              required: true,
              message: '编号不能为空',

            },
            {
              type: 'number',
              message: '编号必须为数字',
              trigger: 'blur'
            }
          ],
          name: [{
            required: true,
            message: '名称不能为空',

          }, ]
        },
        tableData: [],
        dialogTitle: '添加设备',
        cur_page: 1,
        recordCount: 0,
        multipleSelection: [],
        select_cate: '',
        select_word: '',
        del_list: [],
        is_search: false,
        dialogFormVisible: false,
        labelPosition: 'top',
        fieldList:[//采集内容 容器

        ],
        ruleId:'',
        deviceId:'',//设备id
        deviceInfo: [ //设备型号

        ],
        formLabelAlign: {
          code: '',
          name: '',
          deviceInfoId: '',
          remark: '',
          content: []
        },
        content:[]//临时保存 ’采集内容‘
      }
    },
    created() { //页面创建完成时
      this.getData();

    },
    computed: {
      data() {
        const self = this;
        return self.tableData.filter(function(d) {
          d.content = '';
          for(let i in d.fieldList) {
            d.content += d.fieldList[i].fieldName + '、'
            self.content.push(d.fieldList[i].fieldName)
          }
          d.content = d.content.slice(0, d.content.length - 1)

          return d

        })
      }
    },
    methods: {
      loadFeildList(e,obj,i){//采集器执行 change 事件
         console.log('173',e)
        console.log('174',obj)
      
         for(let i in obj){
           if(obj[i].id==e){
             this.fieldList = obj[i].ruleList[0].ruleResponse.fieldList
             this.ruleId = obj[i].ruleList[0].id
             console.log('170',this.fieldList)
             
           }
         }
        // this.fieldList = obj.
      },
      submitForm(formName) {//提交表单，根据不同 情况执行 添加还是编辑
        if(this.dialogTitle === '添加设备') {
          this.submitAdd(formName)
        } else {
          this.submitEdit(formName)
        }
      },
      submitEdit(formName) {//提交编辑设备
          const self = this;

        self.$refs[formName].validate((valid) => {
          if(valid) {
           
            let content = [];
            for(let i in self.formLabelAlign.content){
              content.push(JSON.parse(self.formLabelAlign.content[i])
              )
            }
            console.log('206',content)
            console.log( '207',self.formLabelAlign.deviceInfoId)
            self.$axios.post(self.url.editDevice, {
              params: {
                params: {
                id:self.deviceId,
                name: self.formLabelAlign.name,
                code: self.formLabelAlign.code,
                // deviceInfoId: self.formLabelAlign.deviceInfoId,
                deviceInfoId:self.deviceInfo.id,
                enable: 1,
                remark: self.formLabelAlign.remark,
                ruleConfigList: [{
                    ruleId: self.ruleId,
                    customerPeriod:'',
                    fieldList: content
                  }
                ]
              }
              }
            }, {
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json;charset=utf-8'
              },
              responseType: 'json' // default
            }).then((res) => {
                if(res.data.success){
                  self.$message.success(res.data.message)
                  self.dialogFormVisible = false
                }else {
                  self.$message.error(res.data.message)
                }
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitAdd(formName) {//提交添加设备
        const self = this;

        self.$refs[formName].validate((valid) => {
          if(valid) {
           
            let content = [];
            for(let i in self.formLabelAlign.content){
              content.push(JSON.parse(self.formLabelAlign.content[i])
              )
            }
            console.log('206',content)
            console.log( '207',self.formLabelAlign.deviceInfoId)
            self.$axios.post(self.url.addDevice, {
              params: {
                params: {
                name: self.formLabelAlign.name,
                code: self.formLabelAlign.code,
                // deviceInfoId: self.formLabelAlign.deviceInfoId,
                deviceInfoId:self.deviceInfo.id,
                enable: 1,
                remark: self.formLabelAlign.remark,
                ruleConfigList: [{
                    ruleId: self.ruleId,
                    customerPeriod:'',
                    fieldList: content
                  }
                ]
              }
              }
            }, {
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json;charset=utf-8'
              },
              responseType: 'json' // default
            }).then((res) => {
                if(res.data.success){
                  self.$message.success(res.data.message)
                  self.dialogFormVisible = false
                }else {
                  self.$message.error(res.data.message)
                }
                  console.log('222',res.data)
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getDeviceInfo() { //获取设备型号列表 及他们相关联的可采集内容
        this.$axios.get(this.url.deviceInfoList, {
                    params:{
                      method:'withConfigurableRule'
                    }
        }).then((res) => {
          console.log('284', res.data.data)
          this.deviceInfo = res.data.data
        })
      },
      resetForm(formName) {//重置表单
        this.$refs[formName].resetFields();
      },
      editDevice(){
        this.dialogTitle = '编辑设备';
        this.getDeviceInfo()//获取采集器列表
        this.dialogFormVisible = true
      },
      addDevice() { //添加设备 “按钮”
        this.dialogTitle = '添加设备';
        this.getDeviceInfo()//获取采集器列表
        this.formLabelAlign = {//清空表单内容
          code: '',
          name: '',
          deviceInfoId: '',
          remark: '',
          content: []
        }  
        this.fieldList = [//采集内容 容器

        ]  
        this.dialogFormVisible = true
      },
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getData();
      },
      getData() {
        let self = this;
        self.$axios.get(self.url.deviceList, {

          params: {
            pageIndex: self.cur_page - 1,
            pageSize: 10
          }
        }).then((res) => {
          self.tableData = res.data.data.records;
          self.recordCount = res.data.data.recordCount;
          console.log('180', res.data.data.records)
        })
      },
      search() {
        this.is_search = true;
      },
      formatter(row, column) {
        return row.address;
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      handleEdit(index, row) {
        // this.$message('编辑第' + (index + 1) + '行');
        this.editDevice()
        console.log('291',row)
        this.deviceId = row.id;
        this.formLabelAlign = {//预加载
          code: row.code-0,
          name: row.name,
          deviceInfoId: '',
          remark: row.remark || '',
          content:[]
        }  
      },
      handleDelete(index, row) {
        // this.$message.error('删除第' + (index + 1) + '行');
        this.open2(row.id); 
      },
      open2(id) {//删除提示
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
       
        }).then(() => {
          console.log("300",id)
          this.$axios.post(this.url.deletDevice,{
            params:{
              id:id
            }
          }).then((res)=>{
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getData();
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      delAll() {
        const self = this,
          length = self.multipleSelection.length;
        let str = '';
        self.del_list = self.del_list.concat(self.multipleSelection);
        for(let i = 0; i < length; i++) {
          str += self.multipleSelection[i].name + ' ';
        }
        self.$message.error('删除了' + str);
        self.multipleSelection = [];
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
    width: 100%;
  }
</style>