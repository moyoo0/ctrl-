<template>
  <div class="Index" >
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="240px">
        <div class="asideHeader" >
            <div class="avatar" style="width: 50px;padding: 10px 10px 10px 10px" @click="goUserInfo">
              <img :src="userInfo.avatar" alt="" v-if="userInfo.avatar" />
              <!-- 初始头像 -->
              <img src="/logo.png" alt="" v-else />
            </div>
            <span class="userName">{{ userInfo.nickname }}</span>
        </div>
        <aside-bar :asideBarData="asideBarData" ></aside-bar>
      </el-aside>
      <el-main>
        <router-view :key="$route.path" ref="routerView"></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
import AsideBar from "components/AsideBar.vue";
import store from "@/store";
import router from "@/router";
export default {
  components: {
    AsideBar,
  },
  name: "userinfo",
  data() {
    return {
      asideBarData: [
        { path: "/showinfo", name: "个人信息" ,componentName:"showinfo"},
        { path: "/changeinfo", name: "编辑信息",componentName:"changeinfo"},
        { path: "/findpassword", name: "找回密码",componentName:"findpassword"}
      ],
      userInfo :{
        avatar:store.state.userInfo.avatar,
        nickname:store.state.userInfo.nickname,
      },
    };
  },
  methods: {

    // 前往用户页面
    goUserInfo() {
      router.push("/userinfo")
    },
  },
  created() {
  },

};
</script>

<style scoped>
.el-aside {
  background-color: #f5f5f6;
  min-height: 100vh;
}

.el-main {
  width: calc(100vw - 240px);
}

.asideHeader {
  display: flex;
  align-items: center;
  position: relative;
  background-color: powderblue;
}

.asideHeader .logo {
  width: 50px;
}

.asideHeader .logo img {
  width: 100%;
}

.asideHeader .name {
  color: #25262b;
  font-size: 20px;
  letter-spacing: 4px;
  font-weight: bold;
  margin-left: 7px;
}

.UserInfoCard {
  height: 75px;
  width: 240px;
  border-top: 1px solid #ccc;
  position: fixed;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  color: #25262b;
  bottom:10px;
  left:0;
}

.storageProgressContainer {
  position: absolute;
  top: -45px;
  left: 25px;
  width: 100%;
  font-size: 13px;
}

.storageProgress {
  display: flex;
  align-items: center;
  width: 85%;
  margin-top: 5px;
}

.storageProgress /deep/ .el-progress__text {
  font-size: 13px !important;
  margin-left: 12px;
}

.avatar img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  margin-top: 7px;
}

.userName {
  font-size: 18px;
  margin-left: 55px;

}


</style>
