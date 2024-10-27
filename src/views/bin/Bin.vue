<template>
  <div class="Files" >
    <div class="funciton" >
      <el-button type="danger" @click="deleteSelectedFiles" style="position: fixed;left: 15%;bottom: 30px">彻底删除</el-button>
      <el-button type="primary" @click="canceDeleteSelcetedFiles" style="position: fixed;left: 20%;bottom: 30px">取消删除</el-button>
    </div>

    <el-row :gutter="30" style="margin:20px 20px 0px 20px">
      <el-col
          v-for="file in listData"
          :key="file.id"
          :span="4"  style="margin-bottom: 20px">
        <el-card>
          <div v-if="file.type === 'image' || file.type === 'png' || file.type === 'jpg'">
            <img src="/Jpg.png" alt="Image" class="file-logo" />
          </div>
          <div v-else-if="file.type === 'txt'">
            <img src="/Document.png" alt="Local Logo" class="file-logo" />
          </div>
          <div v-else-if="file.type === 'pdf'">
            <img src="/Pdf.png" alt="Local Logo" class="file-logo" />
          </div>
          <div v-else-if="file.type === 'zip'">
            <img src="/zip.png" alt="Local Logo" class="file-logo" />
          </div>
          <div v-else-if="file.type === 'word'">
            <img src="/doc.png" alt="Local Logo" class="file-logo" />
          </div>
          <div v-else>
            <img src="/Unknown_file_types.png" alt="Local Logo" class="file-logo" />
          </div>
          <el-checkbox v-model="file.selected" ></el-checkbox>
          <div class="file-name">{{ file.name }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import router from "@/router";
import store from "@/store";
export default {
  name: "Bin",
  data() {
    return {
      listData: [],
      uid: store.state.userInfo.id,
      currentFolder: store.state.currentFolder,
    };
  },
  created() {
    // 在组件创建时调用getListData方法
    this.getListData();
  },
  methods: {
    // 请求文件列表
    async getListData() {
      let res = await this.$request(
          `/educenter/file/getDeleteFiles/${store.state.userInfo.id}`,
          router.currentRoute.value.path,
          "post",
          "params",
          "json"
      );
      console.log(res, 63);
      if (res.data.success) {
        if (store.state.sortType === "size") {
          res.data.data.files.sort((a, b) => {
            return a.size - b.size;
          });
        }
        this.listData = res.data.data.files.map(file => ({
          ...file,
          selected: false
        }));
      } else {
        this.$message.error("获取文件列表失败,请刷新页面重试!");
      }
    },

    refreshPage() {
      // 利用路由跳转到当前页面，实现刷新
      router.go(0)
    },
    //deleteSelectedFiles() {
    // 删除选中的文件
    // const selectedFiles = this.listData.filter((file) => file.selected);
    // 执行删除操作，可以根据需要实现
    // console.log('删除选中的文件：', selectedFiles);
    // },

    // 删除文件
    async deleteSelectedFiles() {
      const selectedFiles = this.listData.filter((file) => file.selected);
      const idList = selectedFiles.map((file) => file.id);
      let res = await this.$request(
          `/eduoss/fileoss/removeAlyVideo/${store.state.userInfo.id}?idList=${idList}`,
          "",
          "delete"
      );
      if (res.data.success) {
        // 使用 setTimeout 延迟 1000 毫秒（1 秒）执行下面的操作
        setTimeout(() => {
          this.$message.success("删除成功！");}, 2000);
        // 更新用户存储空间
        let userInfo = store.state.userInfo;
        store.commit("updateUserInfo", userInfo);
        this.refreshPage();
      } else {
        this.$message.error("删除失败,请稍后重试!");
      }
    },
    //取消删除
    async canceDeleteSelcetedFiles() {
      const selectedFiles = this.listData.filter((file) => file.selected);
      const idList = selectedFiles.map((file) => file.id);
      const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);

      let res = await this.$request(
          `/educenter/file/cancelCollection?id=${idList}`,
          "",
          "post"
      );
      if (res.data.success) {
        // 使用 setTimeout 延迟 1000 毫秒（1 秒）执行下面的操作
        setTimeout(() => {
          this.$message.success("取消成功！");}, 2000);
        // 更新用户存储空间
        let userInfo = store.state.userInfo;
        userInfo.neicun += totalSize;
        store.commit("updateUserInfo", userInfo);
        this.refreshPage();
      } else {
        this.$message.error("删除失败,请稍后重试!");
      }
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

</style>
