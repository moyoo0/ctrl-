<template>

    <div class="menuContainer">
     <!--  <div class="group">
          <el-upload :action="'/api/eduoss/fileoss/uploadFileAvatar'" :show-file-list="false" :on-success="upload" :on-error="onError">
            <div class="menuItem">更换头像</div>
          </el-upload>
          <div class="menuItem" @click="changeNickName">修改昵称</div>
        </div>
        <div class="group">
          <div class="menuItem">修改密码</div>
          <div class="menuItem" @click="isAboutDialogShow = true">关于</div>
        </div>
        <div class="group">
          <div class="menuItem" @click="logout">退出登录</div>
        </div>
      -->
    </div>


    <!-- 修改昵称的输入框dialog
    <el-dialog
        title="修改昵称"
        :visible.sync="isNickNameDialogShow"
        width="400px"
    >
      <el-input
          v-model="newNickName"
          autocomplete="off"
          class="nickNameInput"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isNickNameDialogShow = false" size="small"
        >取 消</el-button
        >
        <el-button type="primary" @click="confirmNickName" size="small"
        >确 定</el-button
        >
      </div>
    </el-dialog>-->

</template>

<script>
import router from "@/router";
import store from "@/store";
export default {
  name: "UserInfoCard",
  data() {
    return {
      userInfo: {},
      // 是否显示menu
      isMenuShow: false,
      // 是否显示修改昵称的dialog
      isNickNameDialogShow: false,
      // 新的昵称
      newNickName: "",
      // 是否显示about的dialog
      isAboutDialogShow: false,
    };
  },
  methods: {
    // 点击退出登录的回调
    logout() {
      window.localStorage.removeItem("userInfo");
      store.commit("updateUserInfo", {});
      router.push("/login");
    },

    // 显示菜单
    showMenu() {
      setTimeout(() => {
        store.commit("updateIsUserInfoCardMenuShow", true);
      });
    },


    async goUserInfo() {
      await router.push("/userinfo")
    },


    // 上传成功的钩子
    async upload(response) {
      console.log(response);
      if (!response.success) {
        this.$message.error("上传失败,请稍后重试!");
        return;
      }
      // 深拷贝对象 以防出现下面的请求没有成功 但是头像已经在this.userInfo中被更换的情况
      let data = JSON.parse(JSON.stringify(this.userInfo));
      data.avatar = response.data.url;
      // 调用此接口以通知后端将上传的文件存入数据库
      let res = await this.$request(
          "/educenter/member/updateMemberInfo",
          data,
          "post",
          "params"
      );
      console.log(res);
      if (res.data.success) {
        this.$message.success("头像设置成功!");
        // window.localStorage.setItem("userInfo", data);
        store.commit("updateUserInfo", data);
        // 更新用户数据
        await this.getUserInfo();
      } else {
        this.$message.error("头像设置失败，请稍后重试!");
      }
    },

    // 上传失败的钩子
    onError(err) {
      //   console.log(err);
      this.$message.error("头像设置失败，请稍后重试!");
    },

    // 点击修改昵称的回调
    changeNickName() {
      this.newNickName = this.userInfo.nickname;
      this.isNickNameDialogShow = true;

      // 聚焦输入框
      // dialog在第一次打开前是不渲染的 所以里面的input需要在下一帧中获取
      this.$nextTick(() => {
        // console.log([document.querySelector(".nickNameInput")]);
        document.querySelector(".nickNameInput").children[0].focus();
      });
    },

    // 确认修改昵称
    async confirmNickName() {
      // 先判断昵称是否合法
      if (this.newNickName === "") {
        this.$message.warning("昵称不能为空哦!");
        return;
      } else if (this.newNickName === this.userInfo.nickname) {
        this.isNickNameDialogShow = false;
        return;
      }

      // 深拷贝对象 以防出现请求没有成功 但是昵称已经在this.userInfo中被修改的情况
      let data = JSON.parse(JSON.stringify(this.userInfo));
      data.nickname = this.newNickName;
      // 调用此接口以通知后端将上传的文件存入数据库
      let res = await this.$request(
          "/educenter/member/updateMemberInfo",
          data,
          "post",
          "params"
      );
      console.log(res);
      if (res.data.success) {
        this.$message.success("昵称修改成功!");
        // 更新用户数据
        await this.getUserInfo();
        this.isNickNameDialogShow = false;
      } else {
        this.$message.error("昵称修改失败，请稍后重试!");
      }
    },
  },
  created() {
    this.getUserInfo();
  },
  mounted() {},
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
    "store.state.userInfo"(current) {
      this.userInfo = current;
    },
    // 上面监听不到内存属性的变化，因为但内存属性发生改变时，userInfo的地址没有发生变化
    "store.state.userInfo.neicun"(current) {
      this.userInfo.neicun = current;
    },
  },
};
</script>

<style scoped>
.UserInfoCard {
  height: 75px;
  width: 240px;
  border-top: 1px solid #ccc;
  display: flex;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  color: #25262b;
  position: relative;
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
  align-items: center;
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
  font-size: 14px;
  margin-left: 15px;
  width: 110px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.iconfont {
  font-size: 18px;
  color: rgb(104, 104, 104);
  cursor: pointer;
}

.menuContainer {
  position: absolute;
  right: 20px;
}

.menu {
  position: absolute;
  background-color: white;
  /* display: none; */
  bottom: 30px;
  width: 150px;
  border: 1px solid #ddd;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.1);
  z-index: 3000;
  padding: 5px 5px;
  border-radius: 7px;
  font-size: 15px;
  display: none;
}

.UserInfoCard /deep/ .el-upload {
  width: 100%;
  cursor: unset;
  text-align: left;
}

.showMenu {
  display: block;
}

.group {
  padding: 4px 0;
  border-bottom: 1px solid #eee;
}

.group:last-child {
  border: none;
}

.group > div {
  padding: 4px 20px;
  font-size: 14px;
  color: rgb(70, 70, 70);
  user-select: none;
}

.group > div:hover {
  background-color: #696bcc;
  color: white;
}

.UserInfoCard /deep/ .el-dialog {
  border-radius: 10px;
}

.UserInfoCard /deep/ .aboutDialog {
  line-height: 20px;
}

.UserInfoCard /deep/ .aboutDialog .el-dialog__body {
  padding-top: 10px;
}
</style>
