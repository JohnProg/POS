import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
    app,
    models: () => models.map(m => import(`../models/${m}.js`)),
    component,
});

// nav data
export const getNavData = app => [
    {
        component: dynamicWrapper(app, ['commodity', 'user', 'login'], () => import('../layouts/PosLayout')),
        layout: 'PosLayout',
        name: 'POS系统',
        path: '/pos',
        children: [
            {
                name: 'Point of Sale',
                icon: 'shopping-cart',
                path: 'pos/list',
                // component: dynamicWrapper(app, ['commodity'], () => import('../routes/Pos/Choose')),
                component: dynamicWrapper(app, ['commodity'], () => import('../routes/Pos/GoodsList')),
            },
            {
                path: 'pos/table',
                component: dynamicWrapper(app, ['commodity'], () => import('../routes/Pos/GoodsTable')),
            },
            {
                path: 'pos/payment',
                component: dynamicWrapper(app, ['commodity'], () => import('../routes/Pos/Payment')),

            },
            {
                path: 'pos/customer',
                component: dynamicWrapper(app, ['commodity'], () => import('../routes/Pos/Customer')),
            }
                // children: [
                //     {
                //         path: 'list',
                //         component: dynamicWrapper(app, ['commodity'], () => import('../routes/Pos/GoodsList')),
                //     },
                //     {
                //         path: 'table',
                //         component: dynamicWrapper(app, ['commodity'], () => import('../routes/Pos/GoodsTable')),
                //     },
                //     {
                //         path: 'payment',
                //         component: dynamicWrapper(app, ['commodity'], () => import('../routes/Pos/Payment')),
                //     }
                // ]
        ],
    },
    {
        component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
        layout: 'BasicLayout',
        name: '首页', // for breadcrumb
        path: '/',
        children: [
            {
                name: '销售分析',
                icon: 'area-chart',
                path: 'analysis',
                component: dynamicWrapper(app, ['user', 'login'], () => import('../routes/Drag/')),
            },
            {
                name: '日结管理',
                icon: 'line-chart',
                path: 'dailyClosing',
                children: [
                    {
                        name: '数据统计',
                        path: 'statistics',
                        component: dynamicWrapper(app, ['rule'], () => import('../routes/DailyClosing/Statistics')),
                    },
                    {
                        name: '现金收款复查',
                        path: 'cashStatistics',
                        component: dynamicWrapper(app, ['form'], () => import('../routes/DailyClosing/CashStatistics')),
                    },
                ]
            },
            {
                name: '订货管理',
                icon: 'shop',
                path: 'orderGoods',
            },
            {
                name: '历史订单',
                icon: 'exception',
                path: 'historyOrders',
                component: dynamicWrapper(app, ['rule'], () => import('../routes/HistoryOrders/HistoryOrdersTable')),
            },
            {
                name: '调拨管理',
                icon: 'notification',
                path: 'allocateAndTransfer',
                component: dynamicWrapper(app, ['commodity'], () => import('../routes/Allocate/AllocateTable')),
            },
            {
                name: 'Dashboard',
                icon: 'dashboard',
                path: 'dashboard',
                children: [
                    {
                        name: '分析页',
                        path: 'analysis',
                        component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
                    },
                    {
                        name: '监控页',
                        path: 'monitor',
                        component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
                    },
                    {
                        name: '工作台',
                        path: 'workplace',
                        component: dynamicWrapper(app, ['project', 'activities', 'chart'], () => import('../routes/Dashboard/Workplace')),
                    },
                ],
            },
            {
                name: '表单页',
                path: 'form',
                icon: 'form',
                children: [
                    {
                        name: '基础表单',
                        path: 'basic-form',
                        component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
                    },
                    {
                        name: '分步表单',
                        path: 'step-form',
                        component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
                        children: [
                            {
                                path: 'confirm',
                                component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
                            },
                            {
                                path: 'result',
                                component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
                            },
                        ],
                    },
                    {
                        name: '高级表单',
                        path: 'advanced-form',
                        component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
                    },
                ],
            },
            {
                name: '列表页',
                path: 'list',
                icon: 'table',
                children: [
                    {
                        name: '查询表格',
                        path: 'table-list',
                        component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
                    },
                    {
                        name: '标准列表',
                        path: 'basic-list',
                        component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
                    },
                    {
                        name: '卡片列表',
                        path: 'card-list',
                        component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
                    },
                    {
                        name: '搜索列表（项目）',
                        path: 'cover-card-list',
                        component: dynamicWrapper(app, ['list'], () => import('../routes/List/CoverCardList')),
                    },
                    {
                        name: '搜索列表（应用）',
                        path: 'filter-card-list',
                        component: dynamicWrapper(app, ['list'], () => import('../routes/List/FilterCardList')),
                    },
                    {
                        name: '搜索列表（文章）',
                        path: 'search',
                        component: dynamicWrapper(app, ['list'], () => import('../routes/List/SearchList')),
                    },
                ],
            },
            {
                name: '详情页',
                path: 'profile',
                icon: 'profile',
                children: [
                    {
                        name: '基础详情页',
                        path: 'basic',
                        component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
                    },
                    {
                        name: '高级详情页',
                        path: 'advanced',
                        component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/AdvancedProfile')),
                    },
                ],
            },
            {
                name: '结果',
                path: 'result',
                icon: 'check-circle-o',
                children: [
                    {
                        name: '成功',
                        path: 'success',
                        component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
                    },
                    {
                        name: '失败',
                        path: 'fail',
                        component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
                    },
                ],
            },
            {
                name: '异常',
                path: 'exception',
                icon: 'warning',
                children: [
                    {
                        name: '403',
                        path: '403',
                        component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
                    },
                    {
                        name: '404',
                        path: '404',
                        component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
                    },
                    {
                        name: '500',
                        path: '500',
                        component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
                    },
                ],
            },
        ],
    },
    {
        component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
        path: '/user',
        layout: 'UserLayout',
        children: [
            {
                name: '帐户',
                icon: 'user',
                path: 'user',
                children: [
                    {
                        name: '登录',
                        path: 'login',
                        component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
                    },
                    {
                        name: '注册',
                        path: 'register',
                        component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
                    },
                    {
                        name: '注册结果',
                        path: 'register-result',
                        component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
                    },
                ],
            },
        ],
    },
    {
        component: dynamicWrapper(app, [], () => import('../layouts/BlankLayout')),
        layout: 'BlankLayout',
        children: {
            name: '使用文档',
            path: 'http://pro.ant.design/docs/getting-started',
            target: '_blank',
            icon: 'book',
        },
    },
];
