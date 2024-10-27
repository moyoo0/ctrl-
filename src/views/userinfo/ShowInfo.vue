<template>
  <div>
    <div  class="el-avatar" style="height: 100px;width: auto" >
      <img :src="userInfo.avatar" alt="" v-if="userInfo.avatar" />
      <!-- 初始头像 -->
      <img src="/logo.png" alt="" v-else />
    </div>

    <br>
    <br>
    <el-descriptions :column="1" border>

      <el-descriptions-item label="账号" v-model="userInfo.account" ><p class="message">{{userInfo.account}}</p></el-descriptions-item>
      <el-descriptions-item label="昵称" v-model="userInfo.nickname" class="message"><p class="message">{{userInfo.nickname}}</p></el-descriptions-item>
      <el-descriptions-item label="UID" v-model="userInfo.id" class="message"><p class="message">{{userInfo.id}}</p></el-descriptions-item>
      <el-descriptions-item label="文件数量" v-model="filenum" class="message" ><p class="message">{{filenum}}</p></el-descriptions-item>
      <el-descriptions-item label="存储空间" v-model="userInfo.neicun" class="message"><p class="message">{{(userInfo.neicun/1000000).toFixed(2)}}MB/1G</p></el-descriptions-item>

    </el-descriptions>
  </div>
</template>

<script>
import store from "@/store";
import router from "@/router";
import {decryptByAES} from "@/plugins/utils";

export default {
  name: "showinfo",
  data(){
    return{
      userInfo :{},
      filenum:"",
    }
  },
  methods: {
    // 请求用户信息
    async getUserInfo() {
      let res = await this.$request(
          `/educenter/member/getMemberInfo/${store.state.userInfo.id}`,
      );
      // 获取后端返回的加密用户数据
      this.userInfo = res.data.data.member;
      const encryInfo = res.data.data.member;

      this.userInfo.account = decryptByAES(encryInfo.account, store.state.tmpKey);
      this.userInfo.sessionkey = decryptByAES(encryInfo.sessionkey, store.state.tmpKey);
      this.userInfo.publickey = decryptByAES(encryInfo.publickey, store.state.tmpKey);
      //const a = decryptByAES(encryUserInfo,store.state.tmpKey);

      store.commit("updateUserInfo", this.userInfo);
    },
    // 获取文件数
    async getFileNum() {
      let res = await this.$request(
          `/educenter/file/getFileNum/${store.state.userInfo.id}`,
          router.currentRoute.value.path,
          "post",
          "params",
          "json"
      );
      this.filenum = res.data.data.fileNum;
    },
    // 前往用户页面
    goUserInfo() {
      router.push("/userinfo")
    },

  },
  created() {
    this.getUserInfo();
    this.getFileNum();
  },
}
</script>

<style scoped>
.message{
  width: 20em;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
