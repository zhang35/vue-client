<template>
    <div class="fillcontain">
        <div>
            <el-form :inline="true" ref="add_data" >
                <el-form-item label="根据时间筛选:">
                    <el-date-picker v-model="search_data.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>--
                    <el-date-picker v-model="search_data.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" icon="search" @click="onScreeoutMoney()">筛选</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
            v-if="tableData.length > 0"
            :data="tableData"
            max-height="450"
            border
            :default-sort="{prop: '_id', order: '-1'}"
            style="width: 100%"
            >
                <el-table-column prop="_id" label="序号" align="center" width="110"></el-table-column>
                <el-table-column prop="Time" label="访问时间" align="center" width="200" sortable>
                
                </el-table-column>
                <el-table-column prop="username" label="姓名" align="center" width="150"></el-table-column>
                <el-table-column prop="command" label="访问服务" align="center" width="150"></el-table-column>
                <el-table-column prop="request" label="请求前缀" align="center" width="300"></el-table-column>
                <el-table-column prop="packet_type" label="兴趣包/数据包" align="center" width="150"></el-table-column>
                <el-table-column prop="operation" align="center" label="操作" fixed="right" width="240">
                  <template slot-scope="scope">
                    <el-button type="warning" icon="edit" size="small"
                    @click="showDetail(scope.$index,scope.row)">详情</el-button>
                    <el-button type="danger" icon="delete" size="small"
                    @click="onDelete(scope.$index,scope.row)">删除</el-button>
                </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-row>
                <el-col :span="24">
                <div class="pagination">
                    <el-pagination
                    v-if="paginations.total > 0"
                    :page-sizes="paginations.page_sizes"
                    :page-size="paginations.page_size"
                    :layout="paginations.layout"
                    :total="paginations.total"
                    :current-page.sync="paginations.page_index"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    ></el-pagination>
                </div>
                </el-col>
            </el-row>
        </div> 
        <el-dialog
                 title="完整日志"
                 :visible.sync="centerDialogVisible"
                 width="50%"
                 center>
                 <span>{{this.full_log}}</span>
                 
                 <span slot="footer" class="dialog-footer">
                 <el-button @click="centerDialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
                </span>
      </el-dialog> 
    </div>

</template>
<script>
import moment from 'moment';
export default {
    name:'invasionList1',
    data(){
        return{
            tableData:[], 
            alltableData:[],
            filterTableData: [],  
            form:{
                "_id": "",
                "username": "",
                request:"",
                packet_type: "",
                full_log:"",
                Time:""
            },
            centerDialogVisible: false,
            //需要给分页组件传的信息
            paginations: {
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 10, // 1页显示多少条
                page_sizes: [10 , 15, 20, 25], //每页显示多少条
                layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
            },
            //筛选
            search_data: {
                startTime: "",
                endTime: ""
            }
        };
    },
    computed:{
        user() {
          return this.$store.getters.user;
    }
    },
    created(){
        this.getAlert();
    },

    
    methods:{
        getAlert(){
            this.$axios.get('/api/ids_log/ids_log').then(res => {
            console.log(res);
            this.tableData = res.data;
            this.allTableData = res.data;
            this.filterTableData = res.data;
            // // 设置分页数据
            this.setPaginations();
            }).catch(err => console.log(err));
        },        

        getAlertwithTime(){
            this.$axios.put('/api/ids_log/ids_log',{params:{
                time_s:stime,
                time_e:endTime
            }}).then(res => {
            console.log(res);
            this.tableData = res.data;
            this.allTableData = res.data;
            this.filterTableData = res.data;
            // // 设置分页数据
            this.setPaginations();
            }).catch(err => console.log(err));

        },

        //删除信息函数 
        onDelete(index,row){
            // 删除
            this.$axios.put(`/api/ids_log/ids_log_del`,{params:{_id:row._id}});
            
            this.$message("删除成功");
            this.getAlert();
        },
        //显示详细信息
        showDetail(index,row){
            this.centerDialogVisible =true;
            console.log("_____________________________________",row);
            this.full_log = row.data;
            return this.full_log;          
        },
        setPaginations() {
            // 总页数属性
            this.paginations.total = this.allTableData.length;
            this.paginations.page_index = 1;
            this.paginations.page_size = 10;
            // 设置默认分页数据
            this.tableData = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        handleSizeChange(page_size) {
            // 切换size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.tableData = this.allTableData.filter((item, index) => {
                return index < page_size;
            });
        },
        // 
        handleCurrentChange(page) {
            // 获取当前页
            let sortnum = this.paginations.page_size * (page - 1);
            // 数据
            let table = this.allTableData.filter((item, index) => {
                return index >= sortnum;
            });
            // 设置默认分页数据
            this.tableData = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
                // 筛选
        onScreeoutMoney() {
            // 筛选
            
             
            
            if (!this.search_data.startTime || !this.search_data.endTime) {
                this.$message({
                    type: "warning",
                    message: "请选择时间区间"
                });
                this.getAlert();
                return;
            }
            var stime = this.search_data.startTime;
            var etime = this.search_data.endTime;
            //$moment(stime).format('YYYY-MM-DD HH:mm:ss');
            //console.log(Vue.prototype.$moment());
            console.log("moment test");
            stime = this.time(stime);
            etime = this.time(etime);
            
            this.$axios.put('/api/ids_log/ids_log_time',{params:{
                time_s:stime,
                time_e:etime
            }}).then(res => {
            console.log(res);
            this.tableData = res.data;
            this.allTableData = res.data;
            this.filterTableData = res.data;
            // // 设置分页数据
            this.setPaginations();
            }).catch(err => console.log(err));


            /*
            this.allTableData = this.filterTableData.filter(item => {
                let date = new Date(item.timestamp*1000);
                let time = date.getTime() + "";
                return time >= stime && time <= etime;
            });
            // 分页数据
            this.setPaginations(); */
        },
        //时间戳转日期
        time(date) {
        //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 <= 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate()+1 <= 10 ? '0'+(date.getDate()) : date.getDate())+' ' ;
        var h = (date.getHours()+1 <= 10 ? '0'+(date.getHours() ) : date.getHours())+ ':';
        var m = (date.getMinutes()+1 <= 10 ? '0'+(date.getMinutes() ) : date.getMinutes() )+ ':';
        var s = (date.getSeconds()+1 <= 10 ? '0'+(date.getSeconds() ) : date.getSeconds());
        return Y+M+D+h+m+s;
        },

       
    },
};
</script>

<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>
