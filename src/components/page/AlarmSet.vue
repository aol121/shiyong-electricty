<template>
  <div class="table">
    <!--<div class="handle-box">-->
    <el-dialog title="配置规则" :visible.sync="dialogFormVisible" size="tiny" @close="closeDialog">
      <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" ref="formLabelAlign">
        <el-row>
          <el-col :span="24" v-for="(field,index) in formLabelAlign.fieldList">
            <div class="grid-content bg-purle">
              <el-form-item :label="field.fieldName" :key="field.fieldCode">
                <el-row>
                  <el-col :span="12">
                    <div class="grid-content bg-purle">
                      <el-form-item>
                        <el-select @visible-change="selectChange" v-model="field.compareType" placeholder="请选择类型">
                          <el-option label="大于" value="gt"></el-option>
                          <el-option label="小于" value="lt"></el-option>
                          <el-option label="等于" value="eq"></el-option>
                        </el-select>
                      </el-form-item>
 
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid-content bg-purle">

                      <!--循环遍历出来的表单，添加错误提示-->
                      <el-form-item :prop="'fieldList[' + index + '].compareValue'" :rules="{
                            type: 'number',
                            message: '参数仅限数字',
                            trigger: 'blur,change'
                          }">
                        <el-input placeholder="数字参数" v-model.number="field.compareValue"></el-input>
                      </el-form-item>

                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveConfig('formLabelAlign')">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--</div>-->
    <el-table :data="data" stripe style="width: 100%" ref="multipleTable">
      <el-table-column prop="code" label="设备编号" sortable width="150">
      </el-table-column>
      <el-table-column prop="name" label="设备名称" width="120">
      </el-table-column>
      <el-table-column prop="content" label="采集内容">
      </el-table-column>
      <el-table-column prop="deviceInfoName" label="采集器型号">
      </el-table-column>
      <el-table-column prop="rule" label="告警规则">
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">配置</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">清空</el-button>
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
          alarmSetList: 'api/alarm/getDeviceAlarmPageList',
          saveConfig: 'api/alarm/save',
          resetAlarm: 'api/alarm/delete'
        },
        tableData: [],
        cur_page: 1,
        recordCount: 0,
        multipleSelection: [],
        select_cate: '',
        select_word: '',
        del_list: [],
        is_search: false,
        dialogFormVisible: false,
        labelPosition: 'left', //设置label的位置参数
        deviceId: '',
        formLabelAlign: {
 
          fieldList: [{
            compareType: '',
            compareValue: '',
            fieldCode: '',
            fieldName: ''
          }]
        },
        content: [], //提交 配置 参数容器
        fieldList: [] //设备可配置项目
      }
    },
    created() { //页面创建完成时
      if(sessionStorage.getItem('ms_userid') && sessionStorage.getItem('ms_username')){
        this.getData();       
      }else {
        this.$router.push('/login');
      }
    },
    computed: {
      data() {
        const self = this;
        return self.tableData.filter(function(d) {

          d.content = '';
          for(let i in d.fieldList) {
            d.content += d.fieldList[i].fieldName + '、'
            //          self.content.push(d.fieldList[i].fieldName)
          }
          d.content = d.content.slice(0, d.content.length - 1)
          d.rule = '';
          if(d.alarmConfig && d.alarmConfig.fieldList) {
            let list = d.alarmConfig.fieldList
            for(let j in list) {

              let symbol = list[j].compareType == 'gt' ? '>' : (list[j].compareType == 'lt' ? '<' : '=')
              d.rule += list[j].fieldName + symbol + list[j].compareValue + '、'
            }
            d.rule = d.rule.slice(0, d.rule.length - 1)
          }

          return d

        })
      }
    },
    methods: {
      closeDialog(){
        /*alert(1)*/
       this.content = [];
        this.formLabelAlign={
          fieldList: [{
            compareType: '',
            compareValue: '',
            fieldCode: '',
            fieldName: ''
          }]
        }
        
      },
      selectChange(val) {
        console.log(val)// 展开true || 收起false
        
        if(this.content && this.content.length > 0 && !val) {
          let selectFieldList = []
          for(let i in this.content) {
//          if(this.formLabelAlign.fieldList[i].compareType && this.formLabelAlign.fieldList[i].compareType){
              for(let j in this.formLabelAlign.fieldList){
                if(this.content[i].fieldName == this.formLabelAlign.fieldList[j].fieldName) {
                  selectFieldList.push(this.content[i])
                }
//            } 
            }
          }
          this.formLabelAlign.fieldList = selectFieldList
        }

      },
      handleCurrentChange(val) { //分页功能
        this.cur_page = val;
        this.getData();
      },
      getData() {
        let self = this;
        self.$axios.get(self.url.alarmSetList, {
          params: {
            pageIndex: self.cur_page - 1,
            pageSize: 10
          }
        }).then((res) => {
          self.tableData = res.data.data.records;
          self.recordCount = res.data.data.recordCount
          console.log('139', res.data)
        })
      },
      saveConfig(formName) {
        //      alert(formName)
        console.log('170', this.formLabelAlign)
        this.$refs[formName].validate((valid) => {
          if(valid) {
            let params1 = [] //提交表单用的参数
            for(let i in this.formLabelAlign.fieldList){
              if(this.formLabelAlign.fieldList[i].compareType && this.formLabelAlign.fieldList[i].compareType){              
                params1.push(this.formLabelAlign.fieldList[i])
              }else {
//              this.formLabelAlign.fieldList.splice(i,1)
              }
            }
            console.log('params',params1)
            console.log('172', this.content)
            //        console.log('173', content)
            this.$axios.post(this.url.saveConfig, {
              params: {
                deviceId: this.deviceId,
                fieldList: params1
              }
            }).then((res) => {
              if(res.data.success) {
                this.$message.success(res.data.message)
                this.getData();
                this.dialogFormVisible = false
                
              } else {
                this.$message.error(res.data.message)
              }
            })
            
          }
        })

      },
      handleEdit(index, row) {
        
        //      let self = this
        console.log('160', row)
        this.content = row.fieldList //循环出表单
        this.deviceId = row.id //设备id
        this.dialogFormVisible = true
        for(let i in this.content) { //预填充表单
          if(row.alarmConfig && row.alarmConfig.fieldList) { //存在赋值才进行赋值
            for(let j in row.alarmConfig.fieldList) {
              if(row.alarmConfig.fieldList[j].fieldName == this.content[i].fieldName) { //如果两者相等就填充
                this.content[i].compareType = row.alarmConfig.fieldList[j].compareType
                this.content[i].compareValue = row.alarmConfig.fieldList[j].compareValue
              }
            }
          }
        }

        for(let i in this.content){
          if(!this.content[i].compareType || !this.content[i].compareValue){
            this.content[i].compareType = ''
            this.content[i].compareValue = null
          }
        }

        this.formLabelAlign.fieldList = this.content
      },
      handleDelete(index, row) {
        //      this.$message.error('删除第' + (index + 1) + '行');
        console.log('223', row)
        if(!row.rule) {
          this.$message.error("当前告警规则为空，无需清空")
        } else {
          this.open2(row.id);
        }

      },
      open2(id) { //删除提示
        this.$confirm('此操作将清空警告规则, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'

        }).then(() => {
          console.log("300", id)
          this.$axios.post(this.url.resetAlarm, {
            params: {
              deviceId: id
            }
          }).then((res) => {
            if(res.data.success) {
              this.$message({
                type: 'success',
                message: '清空成功!'
              });
              this.getData();
            } else if(res.data.code == 200) {
              this.$message.error("您已下线请重新登录！")
              this.$router.push('/login');
              sessionStorage.removeItem('ms_username')
              sessionStorage.removeItem('ms_userid')
            } else {
              this.$message.error("请求出错")
            }

          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
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
  
  .el-dialog--small .el-col-12 {
    padding: 0 5px;
  }
</style>