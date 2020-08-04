<template>
    <div class="fillcontain">
    <div id="topDiv">
        <div class="left">
            <h2 id="organization">北大深研院</h2>
        </div>
        <div class="right">
            <div id="timeClock"></div>
        </div>
        <div class="navigation">
            <ul id="navList">
                <li class="view-nav active J_changeView" data-type="world">世界</li>
                <li class="view-nav J_changeView" data-type="china">中国</li>
                <div id="dynamicNav"></div>
            </ul>
        </div>
    </div>

    <div id="mainContainer">
        <div id="mapChart"></div>
        <input type="hidden" id="orgAdminId" value="${orgAdmin.id}">

        <div class="monitor" id="sitesDiv">
            <div class="monitor-inner">
                <table class="table table-condensed" id="sitesTable">
                    <thead>
                        <tr>
                            <th class="span2">态势名称</th>
                            <th class="span2">评分</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><a href="#" class="default">主机态势值</a></td>
                            <td>{{SA_host_value}}</td>
                        </tr>
                        <tr>
                            <td><a href="#" class="default">网络态势值</a></td>
                            <td>{{SA_value}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <a href="javascript:void(0)" class="monitor-status J_changeMonitor" data-orient="right">收起</a>
        </div>

        <div class="monitor" id="attacksDiv">
            <div class="monitor-inner">
                <table class="table table-condensed" id="attacksTable">
                    <thead>
                        <tr>
                            <th class="span2">攻击源IP</th>
                            <th class="span2">攻击源地址</th>
                            <th class="span2">攻击目标IP</th>
                            <th class="span2">攻击目标地址</th>
                            <th class="span2">攻击类型</th>
                            <th class="span2">攻击时间</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            <a href="javascript:void(0)" class="monitor-status J_changeMonitor" data-orient="bottom">收起</a>
        </div>
    </div>
    

        
    </div>

</template>
<script>
import jwt_decode from "jwt-decode";
export default {
    name:'invasionMap',
    data(){
        return{
            SA_value:[],
            SA_host_value:[],
            tableData:[], 
            alltableData:[],
            filterTableData: [],  
            form:{
                "_id": "",
                "username": "",
                request:"",
                packet_type: "",
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
        this.getScore();
    },
    mounted(){
        this.getScore();
        let mapScript = document.createElement('script');
        mapScript.setAttribute('src', '../js/app/mainMap.js');
        document.head.appendChild(mapScript);
    },
    methods:{
        getScore(){
            this.$axios.get('/api/ids_log/SA_value').then(res => {
                this.SA_value = res.data[0].value;
            }).catch(err => console.log(err));

            this.$axios.get('/api/ids_log/SA_host_value').then(res => {
                this.SA_host_value = res.data[0].value;
            }).catch(err => console.log(err));
        },        
        //删除信息函数  目前服务器未实现


        //显示详细信息
        showDetail(index,row){
            this.centerDialogVisible =true;
            this.full_log = row.message;
            return this.full_log;          
        },

        onDelete(index,row){
            // 删除
            this.$axios.put(`/api/ids_log/event_log_del`,{params:{_id:row._id}});
            
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
            
            this.$axios.put('/api/ids_log/event_log_time',{params:{
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
    html, body{
        overflow: hidden;
    }
    .fillcontain{
        background: url('../assets/img/bg1.jpg') no-repeat;
        /*background-size: 100% 100%;*/
        background-size: cover;
        min-height: 100vh;
    }
    #topDiv{
        /*background-color: #000;*/
        height: 50px;
        padding: 10px 12px;
        overflow: hidden;
        *zoom: 1;
    }
    #topDiv .left{
        float: left;
    }
    #topDiv .right{
        float: right;
        width: 180px;
    }

    #organization{
        margin: 0;
        color: #fff;
        font-size: 36px;
        text-shadow: 0 0 5px #00c6ff;
    }
    #timeClock{
        color: #fff;
        font-family: 'BebasNeueRegular', Arial, Helvetica, sans-serif;
        font-size: 16px;
        text-shadow: 0 0 5px #00c6ff;
        text-align: right;
    }
    #timeClock .time{
        font-size: 26px;
    }


    /* nav STARTS */
    .navigation{
        width: 220px;
        margin: 0 auto;
    }
    #navList{
        font-family: 'Miscrosoft Yahei';
        margin: 10px 0;
        padding: 0;
        list-style: none;
        overflow: hidden;
        *zoom: 1;
    }
    .view-nav{
        color: #fff;
        cursor: pointer;
        float: left;
        font-size: 20px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        padding: 0 5px;
        min-width: 60px;
    }
    .view-nav.active{
        background-color: #fc0;
        color: #333;
    }
    /* nav ENDS */


    /* monitor STARTS */
    .monitor{
        border: 1px solid #fff;
        border-radius: 5px;
        background-color: rgba(0,0,0,0.5);
        color: #fff;
        font-size: 12px;
    }
    .monitor table{
        width: 100%;
    }
    .monitor-inner{
        height: 100%;
        overflow: hidden;
    }
    .monitor-status{
        border: 1px solid #fff;
        border-radius: 5px;
        background-color: rgba(0,0,0,0.5);
        color: #fff;
        font-size: 14px;
        text-align: center;
        text-decoration: none;
    }
    #sitesDiv{
        position: fixed;
        bottom: 200px;
        right: 0;
        width: 200px;
        height: 250px;
        padding: 6px 10px;
        box-sizing: border-box;
        margin-bottom: -1px;
    }
    #sitesDiv .monitor-status{
        position: absolute;
        top: -1px;
        left: -30px;
        padding: 1em 0.5em;
        width: 1em;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    #attacksDiv{
        position: fixed;
        bottom: 0;
        left: 25%;
        height: 200px;
        padding: 12px 20px;
        box-sizing: border-box;
    }
    #attacksDiv .monitor-status{
        position: absolute;
        top: -32px;
        right: 200px;
        padding: 0.5em 1em;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }
    /* monitor ENDS */

    .attack-detail .current{
        background-color: rgba(0,0,0,0.5);
        border: 1px solid #fff;
        border-radius: 4px;
        color: #fff;
        font-size: 13px;
        padding: 4px 6px;
    }
    .attack-detail p{
        margin: 4px;
    }
</style>
