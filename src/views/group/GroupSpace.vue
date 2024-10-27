<template>
  <div class="Files" >
    <div class="funciton" >
      <el-button type="primary" @click="downloadSelectedFiles" style="position: fixed;left: 25%">下载</el-button>
      <el-upload
          multiple
          class="uploadButton"
          :show-file-list="false"
          :on-error="onError"
          :http-request="uploadFiles" ><!-- 上传请求 -->
        <el-button type="primary" class="upload custom-button">上传</el-button>
      </el-upload>
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
import {dataURItoBlob, decryptByAES, encryptByAES, rsaEncrypt} from "@/plugins/utils";
import CryptoJS from "crypto-js";
import { ref, computed } from 'vue'
import axios from 'axios'
export default {
  name: "Files",
  data() {
    return {
      listData: [],
      uid: '',
      currentFolder: store.state.currentFolder,
      account:'',
      key:''
    };
  },
  created() {
    // 在组件创建时调用getListData方法
    this.uid = this.$route.params.groupId;
    this.getListData();
    this.account = this.getAccount();
  },
  methods: {
    async getAccount() {
      let res = await this.$request(
          `/edugro/group/getAccount/${this.uid}`,
          router.currentRoute.value.path,
          "post",
          "params",
          "json"
      );
      this.$message.success(res.data.data.account);
      return res.data.data.account;
    },
    // 请求文件列表
    async getListData() {

      let res = await this.$request(
          `/edugro/group/getGroupFiles/${this.uid}`,
          router.currentRoute.value.path,
          "post",
          "params",
          "json"
      );
      console.log(res, 63);
      if (res.data.success) {

        this.listData = res.data.data.files.map(file => ({
          ...file,
          selected: false
        }));
      } else {
        this.$message.error("获取文件列表失败,请刷新页面重试!");
      }
      let decryptofile = [];
      let tmpKey = res.data.data.key;
      this.key = tmpKey;
      res.data.data.files.forEach( function (s) {

        s.url = decryptByAES(s.url,tmpKey);
        s.name = decryptByAES(s.name,tmpKey);
        s.type = decryptByAES(s.type,tmpKey);
        s.filetype = decryptByAES(s.filetype,tmpKey);
        s.fdir = decryptByAES(s.fdir ,tmpKey);
        decryptofile.push(s)
      })
      this.$message.success(tmpKey);
      this.listData = decryptofile.map(file => ({
        ...file,
        selected: false
      }));
    },
    // 上传成功
    async uploadFiles(data) {
      // 先从第三方服务器获取私钥
      // 发送 POST 请求 ，获取私钥 ，私钥使用了会话密钥加密
      let res = await this.$request(
          `/edugro/group/getAccount/${this.uid}`,
          router.currentRoute.value.path,
          "post",
          "params",
          "json"
      );
      this.$message.success(res.data.data.account);
      let res3 = await axios.post(`../apl/keystore/getprivatekey`,encodeURIComponent(res.data.data.account), "post", "params")
      if(res3.status!==200) {this.$message.warning("找不到密钥服务器！")}


      const fileReader = new FileReader();

      fileReader.readAsDataURL(data.file)

      fileReader.onload = (event) => {

        const fileData = event.target.result;



        const key = CryptoJS.enc.Utf8.parse(this.key)
        // 使用AES算法进行加密
        const encrypted = CryptoJS.AES.encrypt(fileData,key ,{
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        });
        const base64Data = encrypted.toString();


        console.log(this.fileData);
        const constructedFile = new File([base64Data], data.file.name, { type: 'application/octet-stream' });
        // 现在您可以将constructedFile发送给后端
        this.sendFileToBackend(constructedFile);
      };

      // 创建一个新的File对象
    },
    async sendFileToBackend(file) {
      // 创建一个FormData对象来包装文件
      const formData = new FormData();
      formData.append('file', file);
      this.$message.success(file.name);
      // 使用axios或其他HTTP库将formData发送到后端
      // 示例：
      let memid = this.uid;
      let response = await axios.post(`../api/eduoss/fileoss/uploadgroup/${memid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 设置请求头为 multipart/form-data
        },
      });

      if (response.status === 200 ) {
        await this.upload(response.data)
      } else {this.$message.warning("上传失败")}
    },
    async upload(response) {

      if (!response.success) {
        this.$message.error("上传失败,请稍后重试!");
        let arr = store.state.uploadProgressList;
        store.commit("updateUploadProgressList", arr);
        return;
      }
      let data = {
        memId: this.uid,
        url: encryptByAES(response.data.file.url, this.key),
        name: encryptByAES(response.data.file.name, this.key),
        type: encryptByAES(response.data.file.type, this.key),
        videoId: response.data.file.videoId,
        filetype: encryptByAES(response.data.file.filetype, this.key),
        fdir: encryptByAES(response.data.file.fdir, this.key),
        size: response.data.file.size,
      };
      // 调用此接口以通知后端将上传的文件存入数据库
      let res = await this.$request(
          "/educenter/file/addGroupFile",
          data,
          "post",
          "params"
      );
      console.log(res);


      if (res.data.success) {
        this.$message.success("文件上传成功!");

        await this.pushUploadData(res.data.data.file);
        //this.$emit("pushUploadData", res.data.data.file);
        // 更新用户存储空间
      } else {
        this.$message.error("文件上传失败123，请稍后重试!");
      }
    },

    // 上传失败
    onError(err, file) {
      let arr = store.state.uploadProgressList;
      store.commit("updateUploadProgressList", arr);
      this.$message.error("文件上传失败，请稍后重试!");
    },

    // 将上传成功的对象push到当前listData中
    async pushUploadData(item) {
      this.listData.push(item);
      this.refreshPage();
    },
    refreshPage() {
      // 利用路由跳转到当前页面，实现刷新
      router.go(0)
    },

    async downloadSelectedFiles()  {
      const selectedFiles = this.listData.filter((file) => file.selected);
      const idList = selectedFiles.map((file) => file.id);

      try {
        const response = await axios.post(`../api/educenter/file/downloadFile?id=${idList}`, null, {
          responseType: 'Blob',
        });

        const headers = response.headers['content-disposition'];
        const matches = headers.match(/filename="(.+)"/);

        // 获取加密后的文件数据
        const encryptedFileData = response.data;

        // 使用AES算法进行解密
        const key = CryptoJS.enc.Utf8.parse(this.key);
        const decrypted = CryptoJS.AES.decrypt(encryptedFileData, key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        });
        this.$message.success(decrypted.toString(CryptoJS.enc.Utf8))
        const dataURI = decrypted.toString(CryptoJS.enc.Utf8)


        // const decryptedBytes = CryptoJS.enc.Hex.parse(decrypted.toString());
        // const decryptedByteArray = new Uint8Array(decryptedBytes.words.length * 4);
        // for (let i = 0; i < decryptedBytes.words.length; i++) {
        //   const word = decryptedBytes.words[i];
        //   decryptedByteArray[i * 4 + 0] = (word >> 24) & 0xff;
        //   decryptedByteArray[i * 4 + 1] = (word >> 16) & 0xff;
        //   decryptedByteArray[i * 4 + 2] = (word >> 8) & 0xff;
        //   decryptedByteArray[i * 4 + 3] = word & 0xff;
        // }
        // // 创建一个新的Blob对象，包含解密后的数据
        // const decryptedBlob = new Blob([decryptedByteArray], { type: response.headers['content-type'] });
        const decryptedBlob = dataURItoBlob(dataURI)


        // 创建一个下载链接并触发下载
        const url = window.URL.createObjectURL(decryptedBlob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', matches[1]);
        document.body.appendChild(link);
        link.click();

        // 释放Blob URL
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error(error);
        this.$message.error('下载失败，请稍后重试！');
      }
    },
  async reset(){
      await router.push("/index");
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
