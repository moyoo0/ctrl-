<template>
  <div class="Files" >
    <div class="function">
      <el-button type="danger" @click="setupGroup" style="position: fixed; left: 15%; bottom: 30px">创建群组</el-button>
      <el-button type="primary" @click="input" style="position: fixed; left: 20%; bottom: 30px">加入群组</el-button>

      <!-- 创建群组输入框 -->
      <el-dialog
          v-model="showSetupGroupDialog"
          title="创建群组"
          @closed="resetSetupGroup"
      >
        <el-input v-model="setupGroupId" placeholder="请输入群组号"></el-input>
        <span slot="footer" class="dialog-footer">
        <el-button @click="showSetupGroupDialog = false">取消</el-button>
        <el-button type="primary" @click="createGroup">创建</el-button>
      </span>
      </el-dialog>

      <!-- 加入群组输入框 -->
      <el-dialog
          v-model="showJoinGroupDialog"
          title="加入群组"
          @closed="resetJoinGroup"
      >
        <el-input v-model="joinGroupCode" placeholder="请输入群组代码"></el-input>
        <span slot="footer" class="dialog-footer">
        <el-button @click="showJoinGroupDialog = false">取消</el-button>
        <el-button type="primary" @click="joinGroup">加入</el-button>
      </span>
      </el-dialog>
        <div v-for="item in joinedGroups" :key="item.record">
          <el-button class="custom-button" @click="enterGroupSpace(item.groupId)">
            <p>Group ID: {{ item.groupId }}</p>
          </el-button>
        </div>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import {decryptByAES, encryptByAES, rsaEncrypt} from "@/plugins/utils";
import store from "@/store";
import axios from "axios";
import GroupList from "@/components/GroupList";
import {createRouter as $router} from "vue-router";
export default {
  name: "Group",
  data() {
    return {
      joinedGroups: [],
      showSetupGroupDialog: false,
      showJoinGroupDialog: false,
      setupGroupId: "",
      joinGroupCode: "",
      listData: [],
      uid: store.state.userInfo.id,
      currentFolder: store.state.currentFolder,
    };
  },
  created() {
    // 在组件创建时调用fetchJoinedGroups方法
    this.fetchJoinedGroups();
    console.log("Joined Groups:", this.joinedGroups);
  },
  methods: {

    async fetchJoinedGroups() {
      const requestdata = {
        uid:this.uid
      }
      let res = await this.$request(
          `/edugro/group/performGroup?uid=${store.state.userInfo.id}`,
          "",
          "post",
          "json"
      );

      if(res.data.success){
        this.joinedGroups = res.data.data.list.map(group => {
          return{
            record:group.record,
            groupId:group.groupId,
            memId:group.memId,
          }
            });
      } else {
        this.$message.error('获取群组数据失败');
      }
    },
    refreshPage() {
      // 利用路由跳转到当前页面，实现刷新
      router.go(0)
    },
    setupGroup() {
      this.showSetupGroupDialog = true;
    },
    input() {
      this.showJoinGroupDialog =true
    },
    async joinGroup() {
      const groupID = this.joinGroupCode;
      const uid = this.uid;
      if (!groupID) {
        this.$message.error('群组id不能为空');
      }
      const requestData = {
        groupID: groupID,
        uid: this.uid
      }
      const res = await this.$request(
          '/edugro/group/joinGroup',
          requestData,
          'post',
          "params"
      );

      if(res.data.success){
        this.$message.success("加群申请成功发送");
      }else {
        this.$message.error(res.data.message);
      }
      this.showSetupGroupDialog = false;
    },
    async createGroup() {
        const groupID = this.setupGroupId;

        if (!groupID) {
          this.$message.error('群组id不能为空');
        }
        const requestData = {
          groupID: groupID,
          uid: this.uid
        }
        const res = await this.$request(
           '/edugro/group/createGroup',
          requestData,
            'post',
             "params"
        );

        if(res.data.success){
          this.$message.success("创建成功");
        }else {
          this.$message.error(res.data.message);
        }
      this.showSetupGroupDialog = false;
    },
    resetSetupGroup() {
      this.setupGroupName = "";
    },
    resetJoinGroup() {
      this.joinGroupCode = "";
    },
    async enterGroupSpace(groupId) {
      await router.push({ name: 'GroupSpace', params: { groupId: groupId } });
    },


    watch: {
    },
  },
}
</script>

<style scoped>
.Files {
  width: 100%;
}
.file-logo {
  max-width: 100%;
  width: 50px;
  height: 50px;
}

.file-name {
  text-align: center;
  font-size: x-small;
  --el-font-family: v-bind();
}
.funciton {
  position: fixed;
  bottom: 40px; /* 控制按钮距离底部的距离 */
  right: 60px; /* 控制按钮距离右侧的距离 */
  z-index: 1000; /* 控制按钮的层级，确保它在其他内容之上 */

  /* 添加背景色和内边距以美化按钮 */
  border-radius: 5px;
}
.custom-button {
  font-size: 18px; /* 设置字体大小为 18px，您可以根据需要进行调整 */
  padding: 20px; /* 设置内边距，使按钮更大 */
  background-color: #337ab7; /* 设置背景颜色 */
  color: #fff; /* 设置文字颜色为白色 */
  border-radius: 10px; /* 圆角 */
  cursor: pointer; /* 添加指针样式，表示可点击 */
  margin: 10px 0; /* 设置按钮之间的垂直间距，根据需要进行调整 */
}

/* 设置奇数行的按钮背景颜色为不同的颜色，例如绿色 */
.custom-button:nth-child(odd) {
  background-color: #4caf50;
}

.custom-button:hover {
  background-color: #235a9e; /* 鼠标悬停时的背景颜色 */
}
</style>
