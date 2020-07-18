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

                <el-table-column prop="_id" label="ID" align="center" width="100"></el-table-column>
                <el-table-column prop="Time" label="访问时间" align="center" width="200" sortable></el-table-column>
                
                
                <el-table-column prop=username label="姓名" align="center" width="150"></el-table-column>
                
                <el-table-column prop=commands label="访问服务" align="center" width="200" sortable></el-table-column>
               
                <el-table-column prop=frequency label="访问频率" align="center"  sortable></el-table-column>
                

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
                 
                <div ref="myChart" style="width: 100%; height: 400px;"></div>

                 <span slot="footer" class="dialog-footer" >
                 <el-button @click="close()">关 闭</el-button>
                 <el-button type="primary" @click="open()">绘 图</el-button>
                </span>
      </el-dialog> 
    </div>

</template>
<script>

export default {
    name:'invasionList1',
    provide(){
        return this;
    },

    data(){
        return{
            tableData:[], 
            alltableData:[],
            filterTableData: [],  
            form:{
                 "_id": "",
                "username": "",
                frequency:"",
                commands: "",
                
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

    mounted(){
        
        
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
        open(){
            
            this.$nextTick(() => {           
            console.log("==========================\n=================");
            this.myChart = this.$echarts.init(this.$refs.myChart);
            
            this.myChart.setOption({
                title:{text: "用户：" + this.user_ + '  服务访问情况'},
                    tooltip: {},
                    xAxis: {
                        type: 'category',
                        data: this.chartData_x,
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: this.chartData_y,
                        type: 'line'
                    }]
                           
                }); 
            var myChart = this.myChart;
            console.log(this.myChart);
            window.onresize = function(){
                console.log(this.myChart);
                myChart.resize();
                //myChart1.resize();    //若有多个图表变动，可多写
            
            }
            
            });
            
            console.log("**********end**********");
        },

        close(){
            
            this.myChart.clear();
            this.centerDialogVisible = false;
        },

        getAlert(){
            this.$axios.get('/api/ids_log/users_frequency').then(res => {
            
            this.tableData = res.data;
            this.allTableData = res.data;
            this.filterTableData = res.data;
            // // 设置分页数据
            this.setPaginations();
            }).catch(err => console.log(err));
        },        
        

        //显示详细信息
        showDetail(index,row){
            
            this.user_ = row.username;
            this.$axios.put(
                '/api/ids_log/chart_tool_time', 
                {params:{
                username:row.username
                }}
                ).then(res => {        

            var list_x = [];           
            if(res.data!=undefined){
               
                res.data.forEach(function(key, value) {
                    if(key){
                            
                            if(value!=null){
                                    
                                    
                                    list_x.push(key.Time);

                            }else{
                                    
                                    console.log("OK");
                                    
                            }
                    }
                });    
            }else{
                    console.log("error");
                    
            }

            console.log("list_x");
            console.log(list_x);
            this.chartData_x = list_x.reverse();
            }).catch(err => console.log(err));

            this.$axios.put(
                '/api/ids_log/chart_tool_freq', 
                {params:{
                username:row.username
                }}
                ).then(res => {
            console.log("chart_y data");   
            var list_y = [];
            var result = res.data;
            if(result!=undefined){
                
                result.forEach(function(key, value) {
                    if(key){                           
                            if(value!=null){                      
                                    list_y.push(key.frequency);
                            }else{                                   
                                    console.log("OK");                                 
                            }
                    }
                });    
            }else{
                    console.log("error");
            }

            
            this.chartData_y = list_y.reverse();
            
            }).catch(err => console.log(err));
            
            this.centerDialogVisible = true;
            
           
            
            return this.user_;          
        },

        
        onDelete(index,row){
            // 删除
            this.$axios.put(`/api/ids_log/users_frequency_del`,{params:{_id:row._id}});
            
            this.$message("删除成功");
            this.getAlert();
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
           
            console.log("moment test");
            stime = this.time(stime);
            etime = this.time(etime);
            
            this.$axios.put('/api/ids_log/users_frequency_time',{params:{
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
        
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 <= 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate()+1 <= 10 ? '0'+(date.getDate()) : date.getDate())+' ' ;
        var h = (date.getHours()+1 <= 10 ? '0'+(date.getHours() ) : date.getHours())+ ':';
        var m = (date.getMinutes()+1 <= 10 ? '0'+(date.getMinutes() ) : date.getMinutes() )+ ':';
        var s = (date.getSeconds()+1 <= 10 ? '0'+(date.getSeconds() ) : date.getSeconds());
        return Y+M+D+h+m+s;

    }
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
