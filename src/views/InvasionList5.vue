<template>
<div>
    <router-view v-if="isRouterAlive"></router-view>
    <div id="container" class="echarts"></div>
    <div id="container2" class="echarts"></div>
</div>
    

    
</template>


<script>

import io from 'socket.io-client'

import Highcharts from "highcharts/highstock";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsDrilldown from "highcharts/modules/drilldown";
import Highcharts3D from "highcharts/highcharts-3d";
import Highmaps from "highcharts/modules/map";

HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);
Highmaps(Highcharts);


export default {
    name:'invasionList2',
    
    provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。                                             
            return {
                reload: this.reload                                              
            }
        },

    data(){
        return{
            isRouterAlive: true,
            datacollection:null,
            char_x:[],
            char_y:[],
            chart_data:[],
            host_chart_x:[],
            host_chart_y:[],
            host_chart_data:[],
            predict_char_x:[],
            predict_char_y:[],
            predict_chart_data:[],
            predict_host_chart_x:[],
            predict_host_chart_y:[],
            predict_host_chart_data:[]
        };
    },

    sockets: {
        //查看socket是否渲染成功
            connect: function () {// socket的connect事件
            console.log('socket connected from Page')
        },
        STREAM_STATUS(data) {// 后端按主题名推送的消息数据
            console.log('Page：' + data)
        },
        //客户端接收后台传输的socket事件
        message(data) {
            console.log(data);
        this.$notify({
            title: '新消息',
            message: data,
            type: 'warning',
            duration:10000
        });
        console.log("data", data);//接收的消息
        }
    },

    activated: function(){
        
        console.log("***************************\nactivated tes\n");


    },

    mounted(){
        
        console.log("***************************\nactivated tes\n");
        this.$socket.emit("request", "request");
        this.$socket.open();
        console.log(this);
        this.sockets.listener.subscribe('data', (res) =>{
            //读取数据，将数据转化为x轴与y轴的列表
            var list_x = [];
            
            var result = res;
            //var result = res.reverse();
            if(result!=undefined){
                
                result.forEach(function(key, v) {
                    if(key){                           
                            if(v!=null){                      
                                    list_x.push(key.time);
                            }else{                                   
                                    console.log("OK");                                 
                            }
                    }
                })
            }
            
            this.char_x = list_x;
            var list_y = [];    
            if(result!=undefined){
                
                result.forEach(function(key, v) {
                    if(key){                           
                            if(v!=null){                      
                                    list_y.push(key.value);
                            }else{                                   
                                    console.log("OK");                                 
                            }
                    }
                })   
            }
            this.char_y = list_y;
            this.moreChart()
        });
    
        //接收主机态势威胁值的数据，并进行提取处理
        this.sockets.listener.subscribe('host_value', (res) =>{
            console.log("host_value");
            console.log("========================",res);
            var host_list_x = [];
            
            var result = res;
            //var result = res.reverse();
            if(result!=undefined){
                result.forEach(function(key, v) {
                    if(key){                           
                            if(v!=null){                      
                                    host_list_x.push(key.time);
                            }else{                                   
                                    console.log("OK");                                 
                            }
                    }
                })        
            }
            
            this.host_chart_x = host_list_x;

            var host_list_y = [];
            
            if(result!=undefined){
                
                result.forEach(function(key, v) {
                    if(key){                           
                            if(v!=null){                      
                                    host_list_y.push(key.value);
                            }else{                                   
                                    console.log("OK");                                 
                            }
                    }
                })
                
            }
            this.host_chart_y = host_list_y;
            
            this.moreChart2();
        });      

        //接受网络态势预测值
        this.sockets.listener.subscribe('predict_data', (res) =>{
            //读取数据，将数据转化为x轴与y轴的列表
            var list_x = [];
            console.log("预测数据值", res);
            var result = res;
            //var result = res.reverse();
            if(result!=undefined){
                
                result.forEach(function(key, v) {
                    if(key){                           
                            if(v!=null){                      
                                    list_x.push(key.time);
                            }else{                                   
                                    console.log("OK");                                 
                            }
                    }
                })
            }
            
            this.predict_char_x = list_x;
            var list_y = [];    
            if(result!=undefined){
                
                result.forEach(function(key, v) {
                    if(key){                           
                            if(v!=null){                      
                                    list_y.push(key.value);
                            }else{                                   
                                    console.log("OK");                                 
                            }
                    }
                })   
            }
            this.predict_char_y = list_y;
            this.moreChart()
        });


        this.sockets.listener.subscribe('predict_host_value', (res) =>{
            //读取数据，将数据转化为x轴与y轴的列表
            var list_x = [];
            console.log("预测主机态势值", res);
            var result = res;
            //var result = res.reverse();
            if(result!=undefined){
                
                result.forEach(function(key, v) {
                    if(key){                           
                            if(v!=null){                      
                                    list_x.push(key.time);
                            }else{                                   
                                    console.log("OK");                                 
                            }
                    }
                })
            }
            
            this.predict_host_chart_x = list_x;
            var list_y = [];    
            if(result!=undefined){
                
                result.forEach(function(key, v) {
                    if(key){                           
                            if(v!=null){                      
                                    list_y.push(key.value);
                            }else{                                   
                                    console.log("OK");                                 
                            }
                    }
                })   
            }
            this.predict_host_chart_y = list_y;
            this.moreChart2()
        });
        //io('http://116.77.74.139:9002').on('data', (res) => {
        //    console.log("我没有收到");
        //    console.log('socket.io-client', res)
        //})      
    },

    computed:{
        user() {
    }
    },

    created(){
        //this.getAlert();
        

    },


    methods:{

        reload () {
                this.isRouterAlive = false;            //先关闭，
                this.$nextTick(function () {
                    this.isRouterAlive = true;         //再打开
                }) 
            },

        moreChart() {
            if (this.chart) {
                //this.chart.destroy();
            }
            // 初始化 Highcharts 图表
            var c_data = [];
            var y = this.char_y;
            Highcharts.each(this.char_x, function(xData, i){
                c_data.push([xData, y[i]])
            });

            var predict_c_data = [];
            var predict_y = this.predict_char_y;
            Highcharts.each(this.predict_char_x, function(xData, i){
                predict_c_data.push([xData, predict_y[i]]);
            });
            console.log(c_data);
            this.chart = new Highcharts.Chart("container", {
                title: {
                    text: "网络安全态势威胁值",
                    style:{
                        color:"#000",
                        fontWeight:"bold"
                        }
                },

                yAxis: {
                    title: {
                        text: "威胁值"
                    }
                },

                xAxis:{
                    //横坐标
                    min:0,
                    max:540,
                    tickInterval:60,
                    labels:{
                        formatter:function(){
                            var arr = [];
                            arr[0]   = c_data[0][0];
                            arr[60]  = c_data[60][0];
                            arr[120] = c_data[120][0];
                            arr[180] = c_data[180][0];
                            arr[240] = c_data[240][0];
                            arr[300] = c_data[300][0];
                            arr[360] = c_data[360][0];
                            arr[420] = c_data[420][0];
                            arr[480] = c_data[480][0];
                            arr[540] = c_data[539][0];
                            return arr[this.value];
                        }
                    },

                    title:{
                        text:"Time"
                    },                    
                },

                legend: {
                    layout: "vertical",
                    align: "right",
                    verticalAlign: "middle"
                },
                
                series: [
                    {
                        name: "网络态势威胁值",
                        data: c_data
                    },
                    {
                        name: "网络态势威胁预测值",
                        data: predict_c_data,
                        color: '#8085e9'
                    }
                ],

                //去掉版权标签
                credits: {
                    enabled: false
                },

                responsive: {
                    rules: [
                        {
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                            layout: "horizontal",
                            align: "center",
                            verticalAlign: "bottom"
                            }
                        }
                        }
                    ]
                }
            });
        },


        moreChart2() {
            if (this.chart2) {
                //this.chart2.destroy();
            }
            // 初始化 Highcharts 图表

            var c_data2 = []; //将数据组成[[x1,y1],[x2,y2]]的形式
            var y2 = this.host_chart_y;
            Highcharts.each(this.host_chart_x, function(xData, i){
                c_data2.push([xData, y2[i]])
            });
            //console.log(c_data2);
            var predict_c_data2 = [];
            var predict_y2 = this.predict_host_chart_y;
            Highcharts.each(this.predict_host_chart_x, function(xData, i){
                predict_c_data2.push([xData, predict_y2[i]]);
            });
            console.log("监测点", predict_c_data2);
            this.chart2 = new Highcharts.Chart("container2", {
                title: {
                    text: "主机安全态势威胁值",
                    style:{
                            color:"#000",
                            fontWeight:"bold"
                        }
                },
            
                yAxis: {
                    title: {
                        text: "威胁值"
                    }
                },

                credits: {
                    enabled: false
                },
            
                legend: {
                layout: "vertical",
                align: "right",
                verticalAlign: "middle"
                },

                xAxis:{
                    //横坐标
                    min:0,
                    max:120,
                    tickInterval:20,
                    
                    labels:{
                        formatter:function(){
                            var arr = [];
                            arr[0]   = c_data2[0][0];
                            arr[20]  = c_data2[20][0];
                            arr[40] = c_data2[40][0];
                            arr[60] = c_data2[60][0];
                            arr[80] = c_data2[80][0];
                            arr[100] = c_data2[100][0];
                            arr[120] = c_data2[119][0];
                            
                            return arr[this.value];
                        }
                    },
                
                    title:{
                        text:"Time"
                    },
                },
            
            
                series: [
                    {
                    name: "主机态势威胁值",
                    data: c_data2
                    },
                    {
                    name: "主机态势威胁预测值",
                    data: predict_c_data2,
                    color: '#91e8e1'
                    }
                ],
                responsive: {
                    rules: [
                        {
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                            layout: "horizontal",
                            align: "center",
                            verticalAlign: "bottom"
                            }
                        }
                        }
                    ]
                }
            });
        },
        
        open(){
            
        },

        close(){
            
            
        },

        getAlert(){
    

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
