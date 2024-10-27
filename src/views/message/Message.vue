<template>
  <div>
    <div v-for="message in messages" :key="message.record" class="message-container">
      <p class="message-content">{{ message.userId }} 向您申请加入 {{ message.groupId }} 组</p>
      <button class="accept-button" @click="acceptMessage(message)">同意</button>
      <button class="reject-button" @click="rejectMessage(message)">拒绝</button>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import store from "@/store";
import axios from "axios";
import GroupList from "@/components/GroupList";
import {createRouter as $router} from "vue-router";
export default {
  name: "Group",
  data() {
    return {
      messages: [],
    };
  },
  created() {
    this.getMessage();
  },
  methods: {
    async getMessage(){
      let res = await this.$request(
          `/edugro/group/performMessage?masterid=${store.state.userInfo.id}`,
          "",
          "post",
          "json"
      );

      if(res.data.success){
        this.messages = res.data.data.list.map(group => {
          return{
            record:group.requestId,
            groupId:group.groupId,
            userId:group.userId,
            status:group.status
          }
        });
      } else {
        this.$message.error('获取群组数据失败');
      }
    },
    async acceptMessage(message){
      const requestData = {
        groupId: message.groupId,
        userId:  message.userId
      }
      const res = await this.$request(
          '/edugro/group/handleMessage',
          requestData,
          "post",
          "params"
      )
      if(res.data.success){
        this.$message.success("已同意");
        const index = this.messages.indexOf(message);
        if (index !== -1) {
          this.messages.splice(index, 1);
        }
      }else {
        this.$message.error("出错了")
      }
    },
    async rejectMessage(message){
      const requestData = {
        groupId: message.groupId,
        userId:  message.userId
      }
      const res = await this.$request(
          '/edugro/group/handleRejectMessage',
          requestData,
          "post",
          "params"
      )
      if(res.data.success){
        this.$message.success("已拒绝");
        const index = this.messages.indexOf(message);
        if (index !== -1) {
          this.messages.splice(index, 1);
        }
      }else {
        this.$message.error("出错了")
      }
    },


    watch: {
    },
  },
}
</script>

<style scoped>
.message-container {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  background-color: #f7f7f7;
}

.message-content {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.accept-button,
.reject-button {
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.reject-button {
  background-color: #dc3545;
}
</style>
