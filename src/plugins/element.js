import { createApp } from 'vue'
import App from "@/App";

import {
    ElContainer,
    ElAside,
    ElMain,
    ElButton,
    ElInput,
    ElPopover,
    ElMessage,
    ElSlider,
    ElForm,
    ElFormItem,
    ElTabPane,
    ElTabs,
    ElUpload,
    ElProgress,
    ElDialog,
    ElImage,
    ElTooltip,
    ElTree
} from 'element-plus'


// 创建应用实例
const app = createApp(App)

// 安装组件
app.use(ElContainer)
app.use(ElAside)
app.use(ElMain)
app.use(ElButton)
app.use(ElInput)
app.use(ElPopover)
app.use(ElSlider)
app.use(ElForm)
app.use(ElFormItem)
app.use(ElTabPane)
app.use(ElTabs)
app.use(ElUpload)
app.use(ElProgress)
app.use(ElDialog)
app.use(ElImage)
app.use(ElTooltip)
app.use(ElTree)

// 设置全局属性
app.config.globalProperties.$message = ElMessage

