
<template>
  <div class="diversion-wrap">
    <div class="top">
      <el-card class="welcome-wrap">
        <h2>{{name}}，欢迎来到VKnow新闻管理系统！</h2>
        <div class="welcome-bottom-wrap">
          <div class="welcome-content">
            <p>{{newsNum}}</p>
            <h4>新闻数</h4>
          </div>
          <div class="welcome-content">
            <p>{{userNum}}</p>
            <h4>用户数</h4>
          </div>
          <div class="welcome-content">
            <p>{{activityCount}}</p>
            <h4>活动数</h4>
          </div>
          <div class="welcome-content">
            <p>{{tagList.length}}</p>
            <h4>标签数</h4>
          </div>
        </div>
      </el-card>
    </div>
    <div class="bottom">
      <el-card class="bottom-left-wrap" id="chart2">
      </el-card>
       <el-card class="bottom-middle-wrap" id="chart1">
      </el-card>
      <el-card class="bottom-right-wrap" id="chart3"></el-card>
    </div>
  </div>
</template>
 
<script>
  import echarts from 'echarts'
import obj from '../main.js';

  export default {
    data() {
      return {
        // 饼状图
        name:'',
        data1:{
          stillShowZeroSum: true,
          tooltip: {
            trigger: 'item',
          },
          legend: {
           orient: 'vertical',//图例的显示方式  默认横向显示
            left: 'left',//控制图例的位置
            textStyle: {//图例中文字的样式
                color: '#000',
                fontSize: 14
            },
            data: []//图例上显示的饼图各模块上的名字
          },
           color: ['#FF5850', '#2D93FF', '#71D801','#f47920','#905a3d','#ffc20e','#401c44','#f15b6c'],
          series: {
            type: 'pie',             //echarts图的类型   pie代表饼图
            radius: ['43%', '70%'],//饼图中饼状部分的大小所占整个父元素的百分比
            center: ['50%', '50%'],  //整个饼图在整个父元素中的位置
            roseType:'radius',  
            data: [                  //每个模块的名字和值
            ],
            itemStyle: {
                normal: {
                    label: {
                        show: true,//饼图上是否出现标注文字 标注各模块代表什么  默认是true
                    },
                    labelLine: {
                        show: true//官网demo里外部标注上的小细线的显示隐藏    默认显示
                    }
                }
            },
          }
        },
        // 柱状图
        data2:{
          color: ['#2860fc'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {   // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'    // 默认为直线，可选为：'line' | 'shadow'|'none'
          }
        },
        title: {
          text: '活动参加数',
          top: '15',
          left: '-3',
          textStyle:{
            fontSize: 14,   //字体大小
            color: '#666666',   //字体颜色
            fontWeight: '500'
          },
        },
        grid: {
          left: '-27',
          right: '4',
          bottom: '0%',
          containLabel: true
        },
        xAxis: [ {
          type: 'category',
          // 横坐标活动名称
          data: [],
          axisLine: {   // 改变x轴颜色
            lineStyle: {
              color: '#c1c1c1',
              width: '1',
            }
          },
          axisLabel: {    // 改变x轴字体颜色和大小
            textStyle: {
              color: "#666666",
              fontSize: 12,
            },
          },
        } ],
        yAxis: [ {
          type: 'value',
          axisTick: 'none',    // 右边轴样式的显示
          axisLine: 'none',    // 右边轴样式的显示
          // 纵坐标颜色
          splitLine: {
            show: true,
            lineStyle: {
              type: 'solid',
              color: '#f5f5f5'
            }
          },
        } ],
        series: [ {
          name: '',
          type: 'bar',
          barWidth: '50%',
          // 纵坐标值
          data: []
        } ]
      },
      data3:{
        tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis:  {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: []
        },
        series: [
            {
                name: '占比',
                type: 'bar',
                stack: '总量',
                barWidth: 30,
                itemStyle:{
                    normal: {
                        color: '#2860fc',
                        barBorderRadius: [0, 3, 3, 0],
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                z:  10,
                data: [17,18,24,27,32]
            } 
        ]
      },
        tagList:[],
        tagView:[],
        userActivity:[],
        activity:[],
        activityNum:[],
        obj:[],
        defaultTable:{
          pageSize:20,
          startPage:0,
        },
        activityData:[],
        newsNum:0,
        activityCount:0,
        userNum:5,
      }
    },
    mounted() {
      this.name = obj.username;
    //  展示全部新闻数据
      this.get('/news/showAllNews').then(res => {
        this.tagList = [];
        this.tagView = [];
        let sum = 0;
        this.newsNum = res.length;
        res.forEach(e=>{
          this.userActivity.push(e.news_comment*3+e.news_praise*2+e.news_share*4+e.news_view);
          // 即没有加进入标签数组
          if(this.tagList.indexOf(e.news_tag)===-1){
            this.tagList.push(e.news_tag);
            this.tagView.push(e.news_view);
          }else{
            this.tagView[this.tagList.indexOf(e.news_tag)]+=e.news_view;
          }
          // 数组中没有该活动
          if(e.news_activity && this.activity.indexOf(parseInt(e.news_activity))===-1){
            this.activity.push(parseInt(e.news_activity))
            this.activityNum.push(1)
          }else{
            this.activityNum[this.activity.indexOf(parseInt(e.news_activity))]+=1;
          }
        })
        this.tagView.forEach((e,index)=>{
          this.obj.push({name:this.tagList[index],value:e})
        })
        obj.tagList = this.tagList;
        // 展示活动数据
        this.get("/activity/show",this.defaultTable).then((ele)=>{
          this.activityData = ele.tableData;
          let activityName = [];
          this.activityCount = ele.tableData.length;
          ele.tableData.forEach((e,index)=>{
            if(this.activity.indexOf(e.aid)!==-1){
              activityName.push(e.activity_name);
            }
          })
          this.data2.xAxis[0].data = activityName;
          this.data2.series[0].data = this.activityNum;
          let myChart2 = echarts.init(document.getElementById('chart2'));
          myChart2.setOption(this.data2);
          window.addEventListener('resize',function() {myChart2.resize()});
        }).catch(e=>{
          this.$error(`展示出错`);
        })
        console.log(this.tagList);
        console.log(this.tagView);
        this.data1.series.data = this.obj;
        this.data1.legend.data = this.tagList;
        // console.log(this.obj);
        // console.log(this.tagList);
        let myChart1 = echarts.init(document.getElementById('chart1'));
         let myChart3 = echarts.init(document.getElementById('chart3'));
        myChart1.setOption(this.data1);
        window.addEventListener('resize',function() {myChart1.resize()});
        myChart3.setOption(this.data3);
        window.addEventListener('resize',function() {myChart3.resize()});
      })
       this.get("/UsersActivity/show").then((res)=>{
            let newsActivity = [];
            res.forEach(e=>{
              if(newsActivity.indexOf(e.news_id)==-1){
                newsActivity.push({id:e.news_id,value:e.tag_comment*4+e.tag_praise*2+e.tag_share*3+e.tag_view});
              }
            })
            let activityResult = this.quickSort(newsActivity);
            let length = activityResult.length;
            this.data3.yAxis.data = [`新闻${activityResult[length-5].id}`,`新闻${activityResult[length-4].id}`,
            `新闻${activityResult[length-3].id}`,`新闻${activityResult[length-2].id}`,`新闻${activityResult[length-1].id}`];
            this.data3.series[0].data = [activityResult[length-5].value,activityResult[length-4].value,
            activityResult[length-3].value,
            activityResult[length-2].value,activityResult[length-1].value]
        }).catch(e=>{
          this.$error(`展示出错，${e}`);
        }).finally(e=>{
          this.loading = false;
        });
    },
    methods:{
      quickSort(obj){
      for (let i = 0; i < obj.length - 1; i++) {    //排序趟数 注意是小于
        for (let j = 0; j < obj.length - i - 1; j++) {
          if (obj[j].value > obj[j + 1].value) {
            var temp = obj[j].value;
            var id = obj[j].id;
            obj[j].value = obj[j + 1].value;
            obj[j].id = obj[j + 1].id;
            obj[j + 1].value = temp;
            obj[j + 1].id = id;
          }
        }
      }
      return obj
  },
    }
  }
</script>
<style lang="less">
  h2{
    text-align: center;
  }
  .diversion-wrap{
    width: 100%;
    .top{
      width: 100%;
      margin: 30px 0;
      height: 220px;
      display: flex;
      .welcome-wrap{
        width: 100%;
        height: 100%;
        background-color: white;
        border-radius: 2px;
        .welcome-bottom-wrap{
          width: 100%;
          height: 60%;
          // background-color: blue;
          display: flex;
          margin-top: 40px;
          .welcome-content{
            width: 25%;
            text-align: center;
            p{
              color:#409EFF;
              text-align: center;
              font-size: 42px;
              font-weight: 600;
            }
          }
        }
      }
    }
    .bottom{
      width: 100%;
      margin: 30px 0;
      height: 350px;
      display: flex;
      .bottom-left-wrap{
        width: 32%;
        height: 100%;
        background-color: white;
        margin-right: 2%;
      }
       .bottom-middle-wrap{
         width: 32%;
        height: 100%;
        background-color: white;
        margin-right: 2%;
      }
      .bottom-right-wrap{
        width: 32%;
        background-color: white;
        height: 100%;
      }
    }
  }
</style>
 