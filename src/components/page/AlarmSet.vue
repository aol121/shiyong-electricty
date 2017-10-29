<template>
  <div class="table">
    <!--<div class="handle-box">-->
      <el-dialog title="添加/编辑设备" :visible.sync="dialogFormVisible">
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purle">
                <el-form-item label="设备编号（必填）">
                  <el-input v-model="formLabelAlign.name"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purle">
                <el-form-item label="设备名称（必填）">
                  <el-input v-model="formLabelAlign.name"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采集器型号">
                <el-select v-model="formLabelAlign.region" placeholder="请选择型号">
                  <el-option label="型号一" value="shanghai"></el-option>
                  <el-option label="型号二" value="beijing"></el-option>
                  <el-option label="型号三" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采集内容">
                <el-select v-model="formLabelAlign.content" placeholder="请选择内容">
                  <el-option label="温度" value="shanghai"></el-option>
                  <el-option label="湿度" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
              <el-col :span="24">
                <el-form-item label="备注">
                  <el-input type="textarea" v-model="formLabelAlign.mark"></el-input>
                </el-form-item>
              </el-col>
          </el-row>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>        
        </div>
      </el-dialog>
    <!--</div>-->
    <el-table :data="data" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
      <el-table-column prop="num" label="设备编号" sortable width="150">
      </el-table-column>
      <el-table-column prop="name" label="设备名称" width="120">
      </el-table-column>
      <el-table-column prop="content" label="采集内容">
      </el-table-column>
      <el-table-column prop="model" label="采集器型号">
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
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="100">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        url: './static/alarmSet.json',
        tableData: [],
        cur_page: 1,
        multipleSelection: [],
        select_cate: '',
        select_word: '',
        del_list: [],
        is_search: false,
        dialogFormVisible: false,
        labelPosition: 'top',//设置label的位置参数
        formLabelAlign: {
          name: '',
          region: '',
          type: '',
          mark:'',
          content:''
        }
      }
    },
    created() {//页面创建完成时
      this.getData();
    },
    computed: {
      data() {
        const self = this;
        return self.tableData.filter(function(d) {
          return d;
          /*let is_del = false;
          for(let i = 0; i < self.del_list.length; i++) {
            if(d.name === self.del_list[i].name) {
              is_del = true;
              break;
            }
          }
          if(!is_del) {
            if(d.address.indexOf(self.select_cate) > -1 &&
              (d.name.indexOf(self.select_word) > -1 ||
                d.address.indexOf(self.select_word) > -1)
            ) {
              return d;
            }
          }*/
        })
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getData();
      },
      getData() {
        let self = this;
//      process.env 是读取系统环境变量的，比如你在启动服务的时候，
//      设置环境变量为production或者development
        /*if(process.env.NODE_ENV === 'development') {
          self.url = '/ms/table/list';
        };
      
        self.$axios.post(self.url, {
          page: self.cur_page
        }).then((res) => {
          self.tableData = res.data.list;
          console.log(res.data.list)
        })*/
       self.$axios.get(self.url).then((res) => {
          self.tableData = res.data.list;
          console.log(res.data.list)
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
        this.$message('编辑第' + (index + 1) + '行');
      },
      handleDelete(index, row) {
        this.$message.error('删除第' + (index + 1) + '行');
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