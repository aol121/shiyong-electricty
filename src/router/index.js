import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/readme',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    component: resolve => require(['../components/page/SpacePage.vue'], resolve)   // 实时状态
                },
                {
                    path: '/space-page',
                    component: resolve => require(['../components/page/SpacePage.vue'], resolve)   // 实时状态
                },
                {
                    path: '/real-time-status',
                    component: resolve => require(['../components/page/RealTimeStatus.vue'], resolve)    // 实时状态
                },
                {
                    path: '/historic-record',
                    component: resolve => require(['../components/page/HistoricRecord.vue'], resolve)    // 历史记录
                },
                {
                    path: '/alarm-record',
                    component: resolve => require(['../components/page/AlarmRecord.vue'], resolve)    // 告警记录
                },
                {
                    path: '/alarm-set',
                    component: resolve => require(['../components/page/AlarmSet.vue'], resolve)    // 告警设置
                },
                {
                    path: '/device-management',
                    component: resolve => require(['../components/page/DeviceManagement.vue'], resolve)    // 设备管理
                },
                {
                    path: '/user-management',
                    component: resolve => require(['../components/page/UserManagement.vue'], resolve)    // 用户管理
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
