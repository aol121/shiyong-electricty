<template>
  <div class="table">

    <div class="handle-box">
      <el-button type="primary" class="handle-del mr10" @click="addDevice('formLabelAlign')">添加设备</el-button>
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">

        <el-form :label-position="labelPosition" :rules="rules" label-width="80px" :model="formLabelAlign" @before-close="" ref="formLabelAlign">
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
                <el-select :disabled="is_disabled" @change="loadFeildList($event,deviceInfo,deviceInfo.$index)" v-model="formLabelAlign.deviceInfoId" placeholder="请选择型号">
                  <el-option v-for="info in deviceInfo" :label="info.name" :value="info.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采集内容">
                <el-select multiple value-key="fieldCode" v-model="formLabelAlign.content" placeholder="请选择内容" no-data-text="先选择采集器">
                  <el-option v-for="field in fieldList" :label="field.fieldName" :value="field"></el-option>
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
    <el-table :data="data" stripe style="width: 100%" ref="multipleTable">

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
          deviceList: 'api/device/getPageList',
          deviceInfoList: 'api/deviceInfo/getList',
          addDevice: 'api/device/add',
          editDevice: 'api/device/update',
          deletDevice: 'api/device/delete'
        },
        rules: {
          code: [{
              required: true,
              message: '编号不能为空'
            },
            {
              type: 'number',
              message: '编号必须为数字',
              trigger: 'blur'
            }
          ],
          name: [{
            required: true,
            message: '名称不能为空'
          }, ]
        },
        is_disabled: false, //采集器型号是否可修改
        tableData: [],
        dialogTitle: '添加设备',
        cur_page: 1, //当前页
        recordCount: 0, //总条目
        dialogFormVisible: false, //弹窗隐藏显示
        labelPosition: 'top',
        fieldList: [ //采集内容 容器

        ],
        ruleId: '',
        deviceId: '', //设备id
        deviceInfo: [ //设备型号

        ],
        formLabelAlign: { //表单数据
          code: '',
          name: '',
          deviceInfoId: '',
          remark: '',
          content: [{
            evalExpression: '',
            fieldCode: '',
            fieldName: '',
            length: '',
            ruleId: '',
            startIndex: ''
          }]
        },
        content: [], //临时保存 ’采集内容‘
        cacheContent: [] //保存编辑模式预加载的  采集内容

      }
    },
    mounted() { //页面创建完成时
      this.getData();

    },
    computed: {
      data() {
        const self = this;
        console.log('147', self.tableData)
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

      loadFeildList(e, obj, i) { //采集器执行 change 事件

        let fieldList = []
        for(let a in obj) {
          if(obj[a].id == e) { //找出对应的 采集器类型
            console.log('169', obj[a].ruleList)
            for(let j in obj[a].ruleList) {
              this.ruleId = obj[a].ruleList[j].id //规则id
              for(let k in obj[a].ruleList[j].ruleResponse.fieldList) {

                let fieldObj = obj[a].ruleList[j].ruleResponse.fieldList[k]
                fieldObj.ruleId = obj[a].ruleList[j].id
                fieldList.push(fieldObj) //获取当前  采集器  所有可采集内容的列表[{},{}...]

              }
            }
          }
        }
        this.fieldList = fieldList //采集器对应的 所有采集内容

        //编辑时已选中内容处理

        if(this.formLabelAlign.selectedContent && this.formLabelAlign.selectedContent.length > 0) {

          let selectFieldList = []
          for(let i in fieldList) {
            for(let j in this.formLabelAlign.selectedContent) {
              if(fieldList[i].fieldCode == this.formLabelAlign.selectedContent[j].fieldCode) {
                let selectField = fieldList[i]
                selectFieldList.push(selectField)
                break
              }
            }
          }
          this.cacheContent = this.formLabelAlign.content = selectFieldList
          console.log('195', this.cacheContent)

        }
      },
      submitForm(formName) { //提交表单，根据不同 情况执行 添加还是编辑
        if(this.dialogTitle === '添加设备') {
          this.submitAdd(formName)
        } else {
          this.submitEdit(formName)
        }
      },
      filterRuleConfigList() { //格式化    RuleConfigList  以符合  请求参数格式
        const self = this;
        let ruleConfigList = []; //创建临时存放变量
        for(let i in self.formLabelAlign.content) {
          if(JSON.stringify(ruleConfigList).indexOf(self.formLabelAlign.content[i].id) == -1) { //不存在
            ruleConfigList.push({
              ruleId: self.formLabelAlign.content[i].ruleId,
              fieldList: [{
                evalExpression: '',
                length: '',
                ruleId: '',
                startIndex: '',
                fieldCode: self.formLabelAlign.content[i].fieldCode,
                fieldName: self.formLabelAlign.content[i].fieldName
              }]

            })
          } else {
            for(let j in ruleConfigList) {
              if(ruleConfigList[j].id == self.formLabelAlign.content[i].id) {
                ruleConfigList[j].fieldList.push({
                  fieldCode: self.formLabelAlign.content[i].fieldCode,
                  fieldName: self.formLabelAlign.content[i].fieldName
                })
              }
            }
          }
        }
        return ruleConfigList
      },
      submitEdit(formName) { //提交编辑设备
//      const self = this;

        if(JSON.stringify(this.cacheContent) == JSON.stringify(this.formLabelAlign.content)) {//提交表单时检验采集内容当前值与初始值是否相等    JSON.stringify（）保证验证准确性
          this.checkSubmit(formName)//表单提交前检验          
        } else {
          this.open3(formName)
        }
      },
      open3(formName) {
        this.$confirm('改变采集内容将清空“告警设置”模块中该设备的告警规则, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          this.checkSubmit(formName)//表单提交前检验
        }).catch(() => {
          this.formLabelAlign.content = this.cacheContent
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      checkSubmit(formName){//表单提交前检验
        let self = this
          self.$refs[formName].validate((valid) => {
            if(valid) {
              self.$axios.post(self.url.editDevice, {
                params: {
                  id: self.deviceId,
                  name: self.formLabelAlign.name,
                  code: self.formLabelAlign.code,
                  deviceInfoId: self.formLabelAlign.deviceInfoId,
                  enable: 1,
                  remark: self.formLabelAlign.remark,
                  ruleConfigList: self.filterRuleConfigList()
                }
              }).then((res) => {
                if(res.data.success) {
                  self.$message.success(res.data.message)
                  self.dialogFormVisible = false
                  self.formLabelAlign = {
                    code: '',
                    name: '',
                    deviceInfoId: '',
                    remark: '',
                    content: []
                  };
                  self.getData()
                } else {
                  self.$message.error(res.data.message)
                }
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
      },
      submitAdd(formName) { //提交添加设备
        const self = this;
        self.$refs[formName].validate((valid) => {
          if(valid) {
            self.$axios.post(self.url.addDevice, {
              params: {
                name: self.formLabelAlign.name,
                code: self.formLabelAlign.code,
                deviceInfoId: self.formLabelAlign.deviceInfoId,
                enable: 1,
                remark: self.formLabelAlign.remark,
                ruleConfigList: self.filterRuleConfigList()
              }
            }, {
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json;charset=utf-8'
              },
              responseType: 'json' // default
            }).then((res) => {
              if(res.data.success) {
                self.$message.success(res.data.message)
                self.dialogFormVisible = false
                self.resetForm(formName)
                self.getData()
              } else if(res.data.code == 200) {
                this.$message.error("您已下线请重新登录！")
                this.$router.push('/login');
                localStorage.removeItem('ms_username')
                localStorage.removeItem('ms_userid')
              } else {
                self.$message.error(res.data.message)
              }
              console.log('222', res.data)
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) { //重置表单
        this.$refs[formName].resetFields();
      },
      handleEdit(index, row) { //编辑按钮     
        console.log('283row', row)
        this.deviceId = row.id; //当前设备id

        this.formLabelAlign = { //预加载   
          code: row.code - 0,
          name: row.name,
          selectedDeviceInfoId: row.deviceInfoId,
          remark: row.remark || '',
          content: [],
          selectedContent: JSON.parse(JSON.stringify(row.fieldList))
        }
        this.editDevice() //异步的 最后执行

      },
      editDevice() { //显示   编辑设备   弹窗
        this.dialogTitle = '编辑设备';
        this.is_disabled = true;
        this.getDeviceInfo() //获取采集器列表
        this.dialogFormVisible = true
      },
      addDevice() { //添加设备 “按钮”
        this.dialogTitle = '添加设备';
        this.is_disabled = false;
        this.getDeviceInfo() //获取采集器列表
        this.formLabelAlign = { //清空表单内容
          code: '',
          name: '',
          deviceInfoId: '',
          remark: '',
          content: []
        }
        this.fieldList = [ //采集内容 容器

        ]

        this.dialogFormVisible = true
      },
      getDeviceInfo() { //获取设备型号列表 及他们相关联的可采集内容
        this.$axios.get(this.url.deviceInfoList, {
          params: {
            method: 'withConfigurableRule'
          }
        }).then((res) => {
          console.log('324', res.data.data)
          this.deviceInfo = res.data.data
          if(this.formLabelAlign.selectedDeviceInfoId != null) { //渲染列表后赋值
            this.formLabelAlign.deviceInfoId = this.formLabelAlign.selectedDeviceInfoId
          }
        })
      },
      handleCurrentChange(val) { //翻页
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
          if(res.data.success) {
            self.tableData = res.data.data.records;
            self.recordCount = res.data.data.recordCount;
          } else if(res.data.code == 200) {
            this.$message.error("您已下线请重新登录！")
            this.$router.push('/login');
            localStorage.removeItem('ms_username')
            localStorage.removeItem('ms_userid')
          } else {
            this.$message.error("请求出错")
          }

        })
      },
      handleDelete(index, row) {
        this.open2(row.id);
      },
      open2(id) { //删除提示
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'

        }).then(() => {
          console.log("300", id)
          this.$axios.post(this.url.deletDevice, {
            params: {
              id: id
            }
          }).then((res) => {
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