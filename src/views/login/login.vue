<template>
  <div class="login">
    <!-- login 占整个页面 -->
    <div class="main">
      <!-- main 包括logo和登录块 -->
      <div class="logoContainer">
        <!-- logo -->
        <div class="name">CtrlYun</div>
      </div>
      <div class="mainBox" >
        <!-- mainbox 登录块 -->
        <div class="loginInput">
          <!-- 包括输入框，登录按钮 -->
          <p>登录</p>
          <el-form ref="form" :model="login" label-width="80px">
            <el-form-item>
              <el-input v-model="login.account" placeholder="请输入账号/邮箱/手机号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="login.password" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
        <router-link to="/register" style="font-size: x-small;">没有账号？立即注册</router-link>
        <div class="otherlogin">
          <div class="login-sns-item"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAgVBMVEUAAABXu0BYt0BQt0BXu0BWu0BXu0BXu0BXu0BWukBWukBXvEBXu0BXvEBXvEBYukBVukBXu0BWt0BXukBXuEBXu0D////1+/Pq9+fV7s/A5rer3aBsw1jg89uBzHBiwEy14auL0Xug2ZOW1YeBzG93yGSW1YjL6sO14azL6cN2yGP3XpzOAAAAFXRSTlMA3yAQ78+/r5+AUI9w74BgYEBAkHDBb56KAAACF0lEQVRIx52W6XKDIBRGwT3GZmsRUXFP0vb9H7AKGS8aiCXnR0TCmU/gOoh0uJck8jEZwUGYXND/cOPggyz4CE//0HZgKeDIsdSA3Qs1Bk2XejLF7ckGe1fnOT7ZBDsaDxNiZ4Jna4Jnb7rgbeKrK7QnFuzBOxIrYrsJAth9iIdl/9CwLE0pv/elqfoegWpfXdAUYINW9GRkRIBWakBemiOVGRbpE1lpijwaPDANCxvCc8qBbcVF47vq5EQ1YjCK3nyXiXE3QqrpSseeu+jptc96XgWmHSGDEGtCmDHygpK5nUuRdr2MvvfNdMvzXCN+KVNk6RO0qOpr37fXJzFCwdzmT9532THZovmqFHxlF3/WcdWQGUsBI2g3K/G3WG3o4oEVsVqOK4RHaTpfaKkXCVsWzPTL65pPN7X4kxnEX6qIXS4mJqfOH5tVKSJWzJsiXqlcklxe5AI0yuL4RDUpiKkGphRrRFRK+lLk88AQSg4KXVC9TvwSRQ4MU5m1xZ2xlmnEm1LkrqeKTVbU5rcaNtJDCAWqCOutq90CpjiKMTFQZuuah/9Oo+h6ZtPkYTSxI0YKReWLtxFBpJ5bzjOasWYsoBp6HQSRW5R5tz4C4HS0PltjO/H05sH6iQDXtz0d3/94ANPes/9Asjd9572PwE8X6Tm+DPViZMQ5mLUDxGnVCFtqwDH0VlYQS22bcxIGIhn7UXLWWn+10s6FZo+4YQAAAABJRU5ErkJggg==" class="login-sns-item-icon"><span class="login-sns-name">微信登录</span></div>
          <div class="login-sns-item"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAb1BMVEUAAABMouVIn+NEn99MouVMouVMo+ZMouVKouRKouJMn+NMouZLouRLo+VMoeNMouZLoeVLoeVNn+RMouX///+83Pal0PL0+v6x1vRireiay/FXqOfS6Pl5uevH4vePxe+Ev+1utOrp9Pzp8/yEv+7XzqLPAAAAE3RSTlMA3yAQ74C/n2BQQK9wz5CPz7BwJ8NfpgAAAbNJREFUSMe1lutygjAQhTeEOyi2AQIC3t//GcvYqk3OYsh0+v1yMN+czc4mQBwyL5ONUDMiLsqc1iGzOFQGYZGu0KLZQkQSrNSQ6I2aGRqkpktxlXJQSc4LNsqJCBhPOCQwwXOa6PmbErxlNpJeVMqD6uWliqOfprPiyN5tcOp0PaObntnmo9hIAV39pFNA9BOogKb+RQN/h9+RCfzR1gbtQqSArtQmemAjUy4QI7GxBTy92qKGJfEshlgp0DO15srmhuIRFuX0Cc/2KO5hUUkF1xt3dxKKuUS3uCPBjA0w4rySwqYyDLCM+EqxVrd45UTtFm81ywlEuzkHXhyhOfY1DArfntg+jRMY/PB80CeODaLhHigpt7fYNSgeuvpgD7k0j9V4Gfbc6RjN7oRE1rCeejVo27vMD4/WFokynB33qUpnUYb+t5zg7+OhNYrVxx5PIzGRJ9ijniwxIC7y3DV3urZ9/DrDfQxvR793a+YnpvRk6+Nt6YXceRQq//rxgKb/h87/fVrtAmKQW2c/JfGkb0PDjBYJomUtMuJQTcRKDUmL0LLiDDWevCzie7LYJGXOWl/BnLhvbq/sWgAAAABJRU5ErkJggg==" class="login-sns-item-icon"><span class="login-sns-name">QQ登录</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import router from "@/router";
import {generateKey, MD5, rsaEncrypt} from "@/plugins/utils";
import {JSEncrypt} from "jsencrypt";
import axios from "axios";



export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  data() {
    return {
      login: {
        account: "",
        password: "",
      },
    };
  },
  beforeRouteEnter(to, from, next) {
    // 使用 beforeRouteEnter 导航守卫，在组件渲染之前设置账号值
    next(vm => {
      if (to.query.account) {
        // 如果路由参数包含 str，将其赋值给 login.account
        vm.login.account = to.query.account;
      }
    });
  },
  methods: {
    //   点击登录的回调
    async onSubmit() {
      let res = await this.$request(
          "/educenter/member/login",
          {
            account:this.login.account,
            password:MD5(this.login.password),
          },
          "post",
          "params"
      );
      console.log(res);
      if (res.status === 200 && res.data.success) {
        // 将用户信息保存至vuex
        store.commit("updateUserInfo", res.data.data.thing.mem);

        //登陆成功  与文件服务器协商会话密钥开始
        let res2 = await this.$request(
            `/educenter/member/getpublickey`,
            this.login.account,
            "post",
            "params"
        );

        // 获取公钥成功
        console.log(res2);
        if (res2.status === 200 && res2.data.success) {
          // 获取服务器公钥16进制，生成会话密钥
          store.commit("getFileServerPublicKey", res2.data.data.publicKey);

          let temKey = generateKey(16); //生成会话密钥 AES标准128bit密钥 16字节
          store.commit("getTmpKey", temKey);

        } else {this.$message.warning("获取服务器公钥失败!")}
        // 会话密钥RSA加密
        const encrypt1 = new JSEncrypt()
        encrypt1.setPublicKey(store.state.FileServerPublicKey);
        let secret = encrypt1.encrypt(store.state.tmpKey);
        let encodedBase64 = encodeURIComponent(secret);

        // 发送 POST 请求 传递服务器会话密钥
        let res3 = await this.$request(`/educenter/member/posttmpkey/${store.state.userInfo.id}`, encodedBase64, "post", "params")
            .then(res3 => {
              // 处理后端响应
              if (res3.data.success) {
                // 请求成功，处理响应数据
                console.log(res3.data);
              } else {
                // 请求失败，处理错误
                console.error("Request failed");
              }
            })
            .catch(error => {
              // 处理请求错误
              console.error(error);
            });
        // 与文件服务器协商会话密钥结束

        //与第三方密钥服务器协商会话密钥开始  请求第三方密钥服务器公钥
        let reskey = await axios.get(`/apl/keystore/getpublickey`); // 注意路径修正
        if(reskey.status !== 200) { this.$message.warning("找不到密钥服务器！")}

        let Mimpublickey = reskey.data.publicStoreKey;   //第三方服务器公钥

        // 第三方会话密钥进行RSA公钥加密
        const encrypt = new JSEncrypt()
        const TmpKeyStore = generateKey(16);//生成会话密钥 AES标准128bit密钥 16字节
        encrypt.setPublicKey(Mimpublickey);
        let secret1 = encrypt.encrypt(TmpKeyStore);
        let encodedBase641 = encodeURIComponent(secret1);

        //会话密钥记录
        store.commit("getTmpKeyStore",TmpKeyStore);


        // 发送 POST 请求 传递服务器会话密钥
        let res4 = await axios.post(`/apl/keystore/postsessionkey`, {secret:encodedBase641, account:this.login.account}, "post", "params")
        if(res4.status!==200) {this.$message.warning("找不到密钥服务器！")}

        let publickey = res4.data.publicKey;  //自己的公钥
        store.commit("getPublicKey",publickey);


        //与第三方密钥服务器协商会话密钥结束

        //   跳转至主界面
        await router.push("/index");

      } else if (res.status === 200 && !res.data.success) {
        this.$message.warning("登录失败,账号或密码错误!");
      }
    },

    handleClick(e) {
      console.log(e.name);
    },

  },
};
</script>

<style scoped>
.login {
  background-color: #ecefff;
  height: 100vh;
}

.logoContainer {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: center;
}

.name {
  color: #25262b;
  font-size: 20px;
  letter-spacing: 4px;
  font-weight: bold;
  margin-left: 7px;
}

.main {
  width: 350px;
  position: relative;
  margin: 0 auto; /* 水平居中 */
  top: 15vh;
  text-align: center; /* 水平居中内部内容 */
}

.mainBox {
  width: 350px;
  background-color: #fff;
  height: 350px;
  border-radius: 10px;
  overflow: hidden;
}


.el-form /deep/ .el-form-item__content {
  margin: 0 !important;
  padding: 0 20px;
}

.el-input /deep/ input {
  border-radius: 10px;
}

.loginInput {
  margin-top: 20px;
}

.el-tabs /deep/ .is-active,
.el-tabs /deep/ div:hover {
  color: #595bb3;
}

.el-tabs /deep/ .is-active {
  background-color: #fff;
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
  background-color: #f5f5f6;
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

.otherlogin {
  display: flex; /* 将子元素变为弹性布局 */
  justify-content: space-between; /* 将子元素平均分布在水平方向上 */
  max-width: 200px; /* 设置最大宽度，以避免它们占据太多空间 */
  position: relative;
  margin: 0 auto; /* 水平居中 */
  padding-top: 20px;

}

.login-sns-item {
  display: flex; /* 将子元素变为弹性布局，使图标和文本水平排列 */
  align-items: center; /* 垂直居中对齐图标和文本 */
  margin-right: 10px; /* 可以根据需要调整图标之间的间距 */
}

.login-sns-item-icon {
  width: 24px; /* 设置图标的宽度 */
  height: 24px; /* 设置图标的高度 */
  margin-right: 5px; /* 可以根据需要调整图标与文本之间的间距 */
}

.login-sns-name {
  font-size: 14px; /* 设置文本的字体大小 */
}

</style>

