<template>
    <div class="table">

        <div class="handle-box">
            <el-select v-model="select_cate" placeholder="选择设备" class="handle-select mr10">
                <el-option key="0" label="选择设备" value=""></el-option>
                <el-option key="1" label="李" value="李"></el-option>
                <el-option key="2" label="设备2" value="设备2"></el-option>
            </el-select>
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">查询</el-button>
        </div>
        <el-table :data="data" stripe style="width: 100%" ref="multipleTable" >
            <el-table-column prop="num" label="设备编号" sortable width="150">
            </el-table-column>
            <el-table-column prop="name" label="设备名称" width="120">
            </el-table-column>
            <el-table-column prop="content" label="采集内容">
            </el-table-column>
            <el-table-column prop="params" label="采集参数">
            </el-table-column>
            <el-table-column prop="time" label="采集时间" sortable width="200">
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    @current-change ="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="1000">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                url: './static/deviceData.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false
            }
        },
        created(){
            this.getData();
        },
        computed: {
            data(){
                const self = this;
                return self.tableData.filter(function(d){
                  return d;
                    /*let is_del = false;
                    for (let i = 0; i < self.del_list.length; i++) {
                        if(d.name === self.del_list[i].name){
                            is_del = true;
                            break;
                        }
                    }
                    if(!is_del){
                        if(d.content.indexOf(self.select_cate) > -1 && 
                            (d.name.indexOf(self.select_word) > -1 ||
                            d.content.indexOf(self.select_word) > -1)
                        ){
                            return d;
                        }
                    }*/
                })
            }
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                /*if(process.env.NODE_ENV === 'development'){
                    self.url = '/ms/table/list';
                };
                self.$axios.post(self.url, {page:self.cur_page}).then((res) => {
                    self.tableData = res.data.list;
                })*/
               self.$axios.get(self.url).then((res) => {
                    self.tableData = res.data.list;
                })
               
            },
            search(){
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.$message('编辑第'+(index+1)+'行');
            },
            handleDelete(index, row) {
                this.$message.error('删除第'+(index+1)+'行');
            },
            delAll(){
                const self = this,
                    length = self.multipleSelection.length;
                let str = '';
                self.del_list = self.del_list.concat(self.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += self.multipleSelection[i].name + ' ';
                }
                self.$message.error('删除了'+str);
                self.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>

<style scoped>

.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
</style>