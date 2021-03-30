<template>
    <div class="index-wrap">
      <el-container class="main">
        <el-header class="main-header">
          <div class="title-wrap">
            <div>
              <div class="isClossTab">
                <i :class="isCollapse?'el-icon-d-arrow-right':'el-icon-d-arrow-left'" ></i>
              </div>
              <h3>VKnow</h3>
            </div>
            <div>
              <strong style="margin:0 10px;cursor:pointer" @click="addMenuItem('0')">个人中心</strong>
              <img src="../img/avatar.jpg" class="avatar" />
              <strong style="margin:0 10px;cursor:pointer" @click="outIndex">退出</strong>
            </div>
          </div>
        </el-header>
         <el-container>
           <el-aside width="200px">
                <el-menu :class="'menu'"
                          :default-active="editableTabsValue"
                          class="el-menu-vertical-demo"
                          :collapse="isCollapse"
                          background-color="#263238"
                          text-color="#fff"
                          active-text-color="#ffd04b"
                          @select="addMenuItem">
                <el-menu-item index="1">
                   <template slot="title">
                    <i class="el-icon-s-home"></i>
                    <span slot="title">导流管理</span>
                  </template>
                </el-menu-item>
                <el-submenu index="2">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span slot="title">冷启动管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="2-1">冷启内容管理</el-menu-item>
                    <el-menu-item index="2-2">冷启账号管理</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="3">
                   <template slot="title">
                    <i class="el-icon-money" ></i>
                    <span slot="title">内容发布审核管理</span>
                   </template>
                </el-menu-item>
                <el-menu-item index="4">
                   <template slot="title">
                    <i class="el-icon-money" ></i>
                    <span slot="title">奖励模块设置</span>
                   </template>
                </el-menu-item>
              </el-menu>
          </el-aside>
          <el-container>
            <el-main>
            <el-tabs v-model="editableTabsValue" type="card" closable class="body-wrap" @tab-remove="removeTab">
              <el-tab-pane
                :key="item.name"
                v-for="item in editableTabs"
                :label="item.title"
                :name="item.name">
                  <component :is="item.component"></component>
              </el-tab-pane>
            </el-tabs>
            </el-main>
            <el-footer class="main-footer" height="35px">© VKnowInventory.com - 后台管理系统</el-footer>
          </el-container>
        </el-container>
        
       
        </el-container>
    </div>
</template>

<script>
import Product from './Product';
import Diversion from './Diversion';//导流管理
import ColdStartContent from './ColdStartContent';//冷启内容管理
import ColdStartAccount from './ColdStartAccount';//冷启账号管理
import Rewards from './activity';//奖励设置
import NewsExamine from './news-examine';//内容发布审核
import Personal from './personal';
export default {
    components: {
      Product,
      Diversion,
      Rewards,
      ColdStartAccount,
      ColdStartContent,
      NewsExamine,
      Personal,
    },
    data() {
       const menuMap=[
         {
            value: '0',
            label:'个人中心',
            component:'Personal',
          },
          {
            value: '1',
            label:'导流管理',
            component:'Diversion',
          },
          {
            value: '2-1',
            label:'冷启内容管理',
            component:'ColdStartContent',
          },
          {
            value: '2-2',
            label:'冷启账号管理',
            component:'ColdStartAccount',
          },
          {
            value: '3',
            label:'内容发布审核管理',
            component:'NewsExamine',
          },
          {
            value: '4',
            label:'奖励模块设置',
            component:'Rewards',
          },
        ];
        return {
            isCollapse: false,
            tabWidth: 200,
            test1: 1,
            editableTabsValue:'1',
            intelval: null,
            changeComponent:'Product',
            menuMap,
            editableTabs: [],
            tabIndex: 1,
        };
    },
    mounted(){
      this.addMenuItem('1');
    },
    methods: {
        addMenuItem(index){
         this.menuMap.forEach(item=>{
           if(item.value === index){
              const bol = this.editableTabs.every(tab=>{
                return tab.name !== index;
              });
              bol && this.editableTabs.push({
                title: item.label,
                name: index,
                component:item.component,
              });
              this.changeComponent = item.component;
              this.editableTabsValue = index;
           }
         })
        },
        outIndex(){
           this.$confirm('请问您是否要退出登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.post(`/users/logout`).then(res=>{
              location.href="./index.html";
              window.sessionStorage.clear();
            }).catch(e=>{
              this.$error('退出失败，请重新尝试');
            })
          })
        },
        removeTab(targetName) {
          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }
          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    }
}
</script>
<style lang="less">
.index-wrap{
  padding: 0;
  margin: 0;
  box-sizing: content-box;
  height: 100%;
  .main{
    height: 100%;
      aside{
          height:100%;
          background-color:  #263238;
          color: #FFF;
          .menu {
              border-right:0;
              width: 200px;
          }
      }
      .main-header {
          color: #FFF;
          padding: 0 !important;
           .title-wrap{
              width: 100%;
              height: 60px;
              background-color: #263238;
              color: #eee;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 18px;
              position: fixed;
              font-weight: 600;
              z-index:600;
              .isClossTab{
                width: 30px;
                height: 60px;
                margin-left: 20px;
                font-size: 25px;
                text-align: center;
                line-height: 60px;
                font-weight: bold;
                box-sizing: border-box;
              }
              .avatar{
                width: 45px;
                height: 45px;
                border-radius: 45px;
                margin: 0 5px;
              }
              .logo-wrap{
                margin-left: 100px;
                margin-top: 8px;
                height:40px;
                margin-right: 20px;
                width: 60px;
              }
              div{
                margin-right: 30px;
                display: flex;
                align-items: center;
              }
          }
      }
      .el-container{
          height: calc(100% - 60px);
      }
      .crumbs {
          margin-bottom: 20px;
      }
      .el-main{
        padding: 0;
        .body-wrap{
          margin: 20px 30px 0 30px;
        }
      }
      .main-footer{
          background-color:  #F0F0F0;
          line-height: 30px;
          position: fixed;
          display: flex;
          justify-content: center;
          bottom: 0;
          width: calc(100% - 200px);
      }
  }
}


</style>
