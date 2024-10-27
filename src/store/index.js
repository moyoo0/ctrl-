import { createStore } from "vuex";

export default new createStore({
    state: {
        isSelectAll: false,
        isCreateFolder: false,
        isVideoPlayerShow: false,
        currentVideoInfo: {},
        currentMusicInfo: {},
        isMusicPlayerShow: false,
        musicPlayState: false,
        userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
        currentFolder: "",
        folderList: {},
        selectFiles: [],
        imgScale: true,
        currentDownloadFileInfo: { url: "", name: "" },
        isAllFileCollect: false,
        isGetingFolder: false,
        isUserInfoCardMenuShow: false,
        showType: "icon",
        sortType: "time",
        isUploadProgressShow: false,
        uploadProgressList: [],
        publickey: "",   // 文件服务器的公钥
        FileServerPublicKey: localStorage.getItem("FilleServerPublicKey") || "",  // 文件服务器的公钥
        tmpKey: localStorage.getItem("tmpKey") || "", // 添加 与文件服务器会话密钥
        TmpKeyStore:localStorage.getItem("TmpKeyStore") || "", // 与第三方密钥服务器的会话密钥
    },
    mutations: {
        updateIsSelectAll(state, flag) {
            state.isSelectAll = flag;
        },
        updateIsCreateFolder(state, flag) {
            state.isCreateFolder = flag;
        },
        updateIsVideoPlayerShow(state, flag) {
            state.isVideoPlayerShow = flag;
        },
        updateCurrentVideoInfo(state, currentVideoInfo) {
            state.currentVideoInfo = currentVideoInfo;
        },
        updateCurrentMusicInfo(state, currentMusicInfo) {
            state.currentMusicInfo = currentMusicInfo;
        },
        updateIsMusicPlayerShow(state, flag) {
            state.isMusicPlayerShow = flag;
        },
        updateMusicPlayState(state, flag) {
            state.musicPlayState = flag;
        },
        updateUserInfo(state, userInfo) {
            state.userInfo = userInfo;
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
        },
        updateCurrentFolder(state, currentFolder) {
            state.currentFolder = currentFolder;
        },
        updateFolderList(state, folderList) {
            state.folderList = folderList;
        },
        updateSelectFiles(state, selectFiles) {
            state.selectFiles = selectFiles;
        },
        updateImgScale(state, flag) {
            state.imgScale = flag;
        },
        updateCurrentDownloadFileInfo(state, currentDownloadFileInfo) {
            state.currentDownloadFileInfo = currentDownloadFileInfo;
        },
        updateIsAllFileCollect(state, flag) {
            state.isAllFileCollect = flag;
        },
        updateIsGetingFolder(state, flag) {
            state.isGetingFolder = flag;
        },
        updateIsUserInfoCardMenuShow(state, flag) {
            state.isUserInfoCardMenuShow = flag;
        },
        updateShowType(state, type) {
            state.showType = type;
        },
        updateSortType(state, type) {
            state.sortType = type;
        },
        updateUploadProgressList(state, arr) {
            state.uploadProgressList = arr;
        },
        getFileServerPublicKey(state, FileServerPublicKey) {
            state.FilleServerPublicKey = FileServerPublicKey;
            localStorage.setItem("FilleServerPublicKey",FileServerPublicKey);
        },
        getTmpKey(state, tmpKey) {
            state.tmpKey = tmpKey;
            localStorage.setItem("tmpKey", tmpKey); // 在突变中将 tmpkey 保存到本地存储
        },
        getPublicKey(state, publickey) {
            state.publickey =publickey;
            localStorage.setItem("publickey",publickey); //自己的公钥存缓存
        },
        getTmpKeyStore(state, TmpKeyStore) {
            state.TmpKeyStore = TmpKeyStore;
            localStorage.setItem("TmpKeyStore",TmpKeyStore);
        }
    },
    actions: {},
    modules: {},
});
