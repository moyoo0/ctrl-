import { createApp } from "vue";
import { createRouter, createWebHistory } from 'vue-router'
import App from "@/App";
import vueIndex from '@/store/index.js'
import showInfo from "@/views/userinfo/ShowInfo";


// 创建应用实例
const app = createApp(App)

// 定义异步组件加载
const Index = () => import('views/index.vue')
const Login = () => import('views/login/login.vue')
const Files = () => import('views/files/Files.vue')
const Bin = () => import('views/bin/Bin.vue')
const Group = () => import('views/group/Group.vue')
const Register = () => import('views/register/Register.vue')
const Userinfo = () => import('views/userinfo/UserInfo.vue')
const Showinfo = () => import('views/userinfo/ShowInfo.vue')
const Changeinfo = () => import('views/userinfo/ChangeInfo.vue')
const FindPassword = () => import('views/userinfo/FindPassword.vue')
const GroupSpace = () => import('views/group/GroupSpace.vue')
const Message = () => import('views/message/Message.vue')
// 定义路由
const routes = [
    {path: '/', redirect: '/index'},
    {
        path: '/index',
        component: Index,
        redirect: '/file',
        children: [
            { path: '/file', component:Files},
            { path: '/bin', component:Bin },
            {path: '/group', component:Group},
            {path: '/message', component: Message}
        ]
    },
    { path: '/login', component:Login, name:Login, props: true},
    { path: '/register', component:Register },
    {
        path: "/space/:groupId", // 定义动态路由参数 groupId
        name: "GroupSpace",
        component: GroupSpace,
        props: true,
    },
    {
        path: '/userinfo',
        component:Userinfo,
        redirect: "/showinfo",
        children: [
            { path: '/showinfo', name:'showinfo', component:Showinfo },
            { path: '/changeinfo', name:'changeinfo', component:Changeinfo },
            { path: '/FindPassword', name:'findpassword', component:FindPassword },
        ],
    },
]

// 定义路由器实例
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

// 安装路由器插件
app.use(router)

/* 路由守卫，拦截未登录用户 */
router.beforeEach((to, from, next) => {
    if ((to.path !== '/login' && to.path !=='/register')
        && !vueIndex.state.userInfo
    ) {
        router.replace('/login')
    }
    next(vm => {
        if (to.path === '/login' && to.query.account) {
            vm.login.account = to.query.account;
        }
    });
})

export  default  router
