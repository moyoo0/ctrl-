<template>
  <div class="login">
    <!-- login 占整个页面 -->
    <div class="main">
      <!-- main 包括logo和登录块 -->
      <div class="logoContainer">
        <!-- logo -->
      </div>
      <div class="mainBox">
        <!-- mainbox 登录块 -->
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" stretch>
          <!-- 标签页转换 -->
          <el-tab-pane label="通过用邮箱找回" name="first">
            <!-- 邮箱注册 -->
            <div class="registeredInput">
              <el-form ref="form" :model="login" label-width="80px">
                <el-form-item>
                  <el-input v-model="registered.account" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="registered.password" placeholder="请输入密码" type="password"></el-input>
                </el-form-item>
                <el-form-item class="codeContainer">
                  <el-input v-model="registered.code" placeholder="请输入验证码"></el-input>
                  <div class="codeButtonContainer">
                    <el-button size="small" class="getcode" v-if="!isCountDownShow" @click="getmailCode">获取验证码</el-button>
                    <div class="countDown" v-else>{{ countDownSecond }} s</div>
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="clickRegistered">提交</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>

          <el-tab-pane label="通过手机找回" name="second">
            <!-- 手机注册 -->
            <div class="registeredInput">
              <el-form ref="form" :model="login" label-width="80px">
                <el-form-item>
                  <el-input v-model="registered.account" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="registered.password" placeholder="请输入密码" type="password"></el-input>
                </el-form-item>
                <el-form-item class="codeContainer">
                  <el-input v-model="registered.code" placeholder="请输入验证码"></el-input>
                  <div class="codeButtonContainer">
                    <el-button size="small" class="getcode" v-if="!isCountDownShow" @click="getCode">获取验证码</el-button>
                    <div class="countDown" v-else>{{ countDownSecond }} s</div>
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="clickRegistered">提交</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>

        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import store from "@/store";
import {encryptByAES, generateKey, MD5} from "@/plugins/utils";
// 倒计时名称
let timer;
// vue3 跳转


export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "FindPassword",
  data() {
    return {
      registered: {
        account: "",
        password: "",
        code: "",
      },
      activeName: "first",
      // 倒计时秒数
      countDownSecond: 60,
      // 是否显示秒数
      isCountDownShow: false,
    };
  },
  methods: {

    // 标签页转换
    handleClick(e) {
      console.log(e.name);
    },

    // 获取邮箱验证码
    async getmailCode() {
      this.isCountDownShow = true;

      let res = await this.$request(
          `/edumsm/msm/sendmail/${this.registered.account}`
      );
      console.log(res);
      if (res.data.success) {
        this.startCountDown();
      }
    },

    // 获取手机验证码
    async getCode() {
      this.isCountDownShow = true;
      let res = await this.$request(
          `/edumsm/msm/sendmobile/${this.registered.account}`
      );
      console.log(res);
      if (res.data.success) {
        this.startCountDown();
      } else {
        let inf = res.data.message;
        this.$message.error(inf);
      }
    },

    // 倒计时
    startCountDown() {
      this.countDownSecond = 60;
      timer = setInterval(() => {
        this.countDownSecond--;
        if (this.countDownSecond === 0) {
          clearInterval(timer);
          this.isCountDownShow = false;
        }
      }, 1000);
    },
    // 点击注册的回调
    async clickRegistered() {
      let res = await this.$request(
          "/educenter/member/findpassword",
          {
            account:this.registered.account,
            password:encryptByAES(MD5(this.registered.password),store.state.tmpKey),
            code:encryptByAES(this.registered.code,store.state.tmpKey),
          },
          "post",
          "params"
      );
      console.log(res);
      // 如果注册成功，清空所有数据并跳转至登录界面，自动填写手机号码
      if (res.data.success) {
        this.$message.success("更改成功!");
      } else {
        let inf = res.data.message;
        this.$message.error(inf);
      }
    },
  },
};
</script>

<style scoped>
.login {
  background-color: #ffffff;
  height: 100vh;
}

.logoContainer {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: center;
}

.logo {
  width: 50px;
}

.logo img {
  width: 100%;
}

.name {
  color: #25262b;
  font-size: 20px;
  letter-spacing: 4px;
  font-weight: bold;
  margin-left: 0px;
}

.main {
  width: 80%;
  position: relative;
  margin: 0 auto; /* 水平居中 */
  top: 15vh;
  text-align: center; /* 水平居中内部内容 */
}


.mainBox {
  width: 60vm;
  background-color: #fff;
  height: 430px;
  overflow: hidden;
}

.mainBoxRegistered {
  height: 430px;
}

.el-form /deep/ .el-form-item__content {
  margin: 0 !important;
}

.el-input /deep/ input {
}

.loginInput {
  margin-top: 20px;
}

.el-tabs /deep/ .is-active,
.el-tabs /deep/ div:hover {
  color: #595bb3;
}

.el-tabs /deep/ .is-active {
  background-color: #f5f5f6;
}

.el-tabs /deep/ .el-tabs__item {
  border: none !important;
  font-size: 18px;
  height: 50px;
  line-height: 50px;
}

.el-tabs /deep/ .el-tabs__nav {
  border: none;
}

.el-tabs /deep/ .el-tabs__nav-scroll {
  background-color: #ffffff;
}

.el-input /deep/ .el-input__inner {
  height: 48px;
  font-size: 15px;
}

.el-button {
  width: 100%;
  background-color: #6c6dbb;
  border: none;
  border-radius: 10px;
  margin-top: 10px;
  height: 45px;
  font-size: 15px;
}

.el-button:hover {
  background-color: #595bb3;
}

.codeContainer {
  position: relative;
}

.codeButtonContainer {
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
}

.getcode {
  background-color: #6c6dbb;
  color: white;
  height: 35px;
  margin: 0;
}

.countDown {
  color: rgb(141, 141, 141);
}
</style>
