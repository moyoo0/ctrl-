<template>
  <div class="Files" >
    <div class="funciton" >
      <el-button type="danger" @click="deleteSelectedFiles" style="position: fixed;left: 20%">删除</el-button>
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
import {dataURItoBlob, decryptByAES, encryptByAES} from "@/plugins/utils";
import axios from 'axios'
import CryptoJS from "crypto-js";
import {Base64} from "jsencrypt/lib/lib/asn1js/base64";

export default {
  name: "Files",
  data() {
    return {
      listData: [],
      uid: store.state.userInfo.id,
      account:store.state.userInfo.account,
      currentFolder: store.state.currentFolder,
      File:{},
      decryptedText:''
    };
  },
  methods: {
    // 请求文件列表
    async getListData() {
      let res = await this.$request(
          `/educenter/file/getCurDirFiles/${store.state.userInfo.id}`,
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
        // 解密
        let decryptofile = [];
        res.data.data.files.forEach( function (s) {
          s.url = decryptByAES(s.url,store.state.tmpKey);
          s.name = decryptByAES(s.name,store.state.tmpKey);
          s.type = decryptByAES(s.type,store.state.tmpKey);
          s.filetype = decryptByAES(s.filetype,store.state.tmpKey);
          s.fdir = decryptByAES(s.fdir ,store.state.tmpKey);
          decryptofile.push(s)
        })

        this.listData = decryptofile.map(file => ({
          ...file,
          selected: false
        }));
      } else {
        this.$message.error("获取文件列表失败,请刷新页面重试!");
      }
    },

    // 上传文件请求
    async uploadFiles(data) {
      // 先从第三方服务器获取私钥
      // 发送 POST 请求 ，获取私钥 ，私钥使用了会话密钥加密
      this.$message.success(encodeURIComponent(this.account))
      let res3 = await axios.post(`/apl/keystore/getprivatekey`,encodeURIComponent(this.account), "post", "params")
      if(res3.status!==200) {this.$message.warning("找不到密钥服务器！")}

      let encryptedPrivateKey = res3.data.encryptedPrivateKey;

     ////// this.$message.success(privateKey);

      const fileReader = new FileReader();

      fileReader.readAsDataURL(data.file)

      fileReader.onload = (event) => {

        const fileData = event.target.result;

        // // arraybuffer 转成unit8array
        // const fileDataArray = new Uint8Array(this.fileData); // 将ArrayBuffer转换为Uint8Array
        // const fileDataString = String.fromCharCode.apply(null, fileDataArray); // 将Uint8Array转换为字符串


        const key = CryptoJS.enc.Utf8.parse(store.state.tmpKey)
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

    // 向后端发送文件
    async sendFileToBackend(file) {
      // 创建一个FormData对象来包装文件
      const formData = new FormData();
      formData.append('file', file);

      // 使用axios或其他HTTP库将formData发送到后端
      // 示例：
      let response = await axios.post(`api/eduoss/fileoss/upload/${this.uid}`, formData, {
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
        memId: store.state.userInfo.id,
        url: encryptByAES(response.data.file.url, store.state.tmpKey),
        name: encryptByAES(response.data.file.name, store.state.tmpKey),
        type: encryptByAES(response.data.file.type, store.state.tmpKey),
        videoId: response.data.file.videoId,
        filetype: encryptByAES(response.data.file.filetype, store.state.tmpKey),
        fdir: encryptByAES(response.data.file.fdir, store.state.tmpKey),
        size: response.data.file.size,
      };
      // 调用此接口以通知后端将上传的文件存入数据库
      let res = await this.$request(
          "/educenter/file/addFile",
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
        let userInfo = store.state.userInfo;
        userInfo.neicun += response.data.file.size;
        store.commit("updateUserInfo", userInfo);
      } else {
        this.$message.error("文件上传失败123，请稍后重试!");
      }
    },
    // 上传失败
    onError(err, file) {
      let arr = store.state.uploadProgressList;
      store.commit("updateUploadProgressList", arr);
      this.$message.error("文件上传失败，请稍后重试1234!");
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

    async downloadSelectedFiles() {
      const selectedFiles = this.listData.filter((file) => file.selected);
      const idList = selectedFiles.map((file) => file.id);

      try {
        const response = await axios.post(`api/educenter/file/downloadFile?id=${idList}`, null, {
          responseType: 'Blob',
        });

        const headers = response.headers['content-disposition'];
        const matches = headers.match(/filename="(.+)"/);

        // 获取加密后的文件数据
        const encryptedFileData = response.data;

        // 使用AES算法进行解密
        const key = CryptoJS.enc.Utf8.parse(store.state.tmpKey);
        const decrypted = CryptoJS.AES.decrypt(encryptedFileData, key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        });
        this.$message.success(decrypted.toString(CryptoJS.enc.Utf8))
        const  dataURI = decrypted.toString(CryptoJS.enc.Utf8)


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

    // 删除文件
    async deleteSelectedFiles() {
      const selectedFiles = this.listData.filter((file) => file.selected);
      const idList = selectedFiles.map((file) => file.id);
      const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);

      let res = await this.$request(
          `/educenter/file/collectFile?id=${idList}`,
          "",
          "post"
      );
      if (res.data.success) {
        // 使用 setTimeout 延迟 1000 毫秒（1 秒）执行下面的操作
        setTimeout(() => {
          this.$message.success("删除成功！");}, 2000);
          // 更新用户存储空间
        let userInfo = store.state.userInfo;
        userInfo.neicun =userInfo.neicun- totalSize;

        let body = {
          id:userInfo.id,
          neicun:userInfo.neicun
        }

        let res = await this.$request('/educenter/member/updateMemberInfo',body,"post","params");

        store.commit("updateUserInfo", userInfo);
        this.refreshPage();
      } else {
        this.$message.error("删除失败,请稍后重试!");
      }
    },
  },
  created() {
    // 在组件创建时调用getListData方法
    this.getListData();
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
