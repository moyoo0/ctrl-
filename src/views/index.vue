<template>
  <div class="Index" >
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="240px">
        <div class="asideHeader">
          <div class="logo"><img src="" alt="" /></div>
          <div class="name">CtrlYun</div>
        </div>
        <aside-bar :asideBarData="asideBarData"></aside-bar>
        <!-- 头像 -->
        <div class="UserInfoCard" v-if="userInfo">
          <div class="storageProgressContainer">
            <div class="">{{ storageSize }}MB/1G</div>
            <el-progress :percentage="storageProgress.toFixed(0) * 1 ? storageProgress.toFixed(0) * 1 : 0"
                         :format="() => storageProgress + '%'" color="#696bcc" class="storageProgress"></el-progress>
          </div>
          <div class="avatar">
            <div class="el-menu-item" style="width: 50px" @click="goUserInfo">
              <img :src="userInfo.avatar" alt="" v-if="userInfo.avatar" />
              <!-- 初始头像 -->
              <img src="/logo.png" alt="" v-else />
              <span class="userName">{{ userInfo.nickname }}</span>
            </div>
          </div>

        </div>
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
import {decryptByAES} from "@/plugins/utils";
export default {
  components: {
    AsideBar,
  },
  name: "Index",
  data() {
    return {
      asideBarData: [
        {path: "/file", name: "文件"},
        { path: "/bin", name: "回收站"},
        {path: "/group", name:"群组"},
        {path: "/message", name:"消息"}
      ],

      userInfo: {},
    };
  },
  methods: {
    // 请求用户信息
    async getUserInfo() {
      let res = await this.$request(
          `/educenter/member/getMemberInfo/${store.state.userInfo.id}`
      );
      // console.log(res);
      const encryInfo = res.data.data.member;
      this.userInfo = encryInfo;

      this.userInfo.account = decryptByAES(encryInfo.account, store.state.tmpKey);
      this.userInfo.sessionkey = decryptByAES(encryInfo.sessionkey, store.state.tmpKey);
      this.userInfo.publickey = decryptByAES(encryInfo.publickey, store.state.tmpKey);

      this.$message.info(store.state.tmpKey)
      this.$message.info(store.state.TmpKeyStore)

      store.commit("updateUserInfo", this.userInfo);
    },
    // 前往用户页面
    goUserInfo() {
      router.push("/userinfo")
    },

  },
  created() {
    this.getUserInfo();
  },
  computed: {
    // 内存进度条
    storageProgress() {
      return ((this.userInfo.neicun / 1048576 / 1024) * 100).toFixed(2) * 1;
    },
    storageSize() {
      return (this.userInfo.neicun / 1048576).toFixed(2);
    },
  },
  watch: {
    "store.state.currentFolder"(current) {
      this.asideBarData[0].params.path = current;
    },
    "router.currentRoute.value.path"(current) {
      // console.log(this.$route.name==files);
      if (router.currentRoute.value.path === "files") {
        store.commit("updateCurrentFolder", current);
        console.log(207);
      }
      // if (this.isCreated) {
      //   this.getListData();
      //   // console.log("199");
      // }
    },
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
  margin: 20px;
  position: relative;
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
}

.userName {
  font-size: 18px;
  margin-left: 55px;

}

.iconfont {
  font-size: 18px;
  color: rgb(104, 104, 104);
  cursor: pointer;
}

</style>
