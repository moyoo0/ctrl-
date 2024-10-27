<template>
  <div style="width: 70%;margin-top: 5%">
    <el-form :model="userInfo"
             ref="ruleForm"
             label-width="100px"
             class="demo-dynamic" >
      <el-form-item
          style="width: 49%"
          label="昵称修改"
          prop="昵称" required>
          <el-input v-model="ChangeInfo.nickname" >{{ChangeInfo.nickname}}</el-input>
      </el-form-item>
      <br>
      <el-form-item style="width: 60%" label="旧密码" required>
        <el-input v-model="ChangeInfo.password"></el-input>
      </el-form-item>

      <el-form-item style="width: 60%" label="新密码" required>
        <el-input v-model="ChangeInfo.newpassword"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">提交修改</el-button>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import store from "@/store";
import {aes128Encrypt, encryptByAES, MD5} from "@/plugins/utils";
export default {
  name: "ChangeInfo",
  data() {
    return {
      ChangeInfo: {
        id:store.state.userInfo.id,
        nickname: store.state.userInfo.nickname,
        password:'',
        newpassword:'',
      },
    };
  },
  methods: {
    async submitForm() {
      //this.userInfo = res.data.member;
      const tmpKey = store.state.tmpKey;
      if(true) {
        let res2 = await this.$request(
            `/educenter/member/updatepassword`,
            {
              id:this.ChangeInfo.id,
              nickname: encryptByAES(this.ChangeInfo.nickname,tmpKey),
              password: encryptByAES(MD5(this.ChangeInfo.password),tmpKey),
              newpassword: encryptByAES(MD5(this.ChangeInfo.newpassword),tmpKey),
            },
            "post",
            "params"
        );
        console.log(res2);
        if(res2.data.success) {
          this.$message("更改成功！")
        } else {this.$message("更改失败！")}
      } else {this.$message("密码不正确！")}
    },

  }

}
</script>

<style scoped>

</style>
