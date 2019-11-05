// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/components/layouts'

export const asyncRouterMap = [

    {
        path: '/',
        name: 'index',
        hidden: true,
        component: BasicLayout,
        meta: { title: '首页' },
        redirect: '/dashboard/workplace',
        children: [
            // dashboard
            {
                path: '/dashboard',
                name: 'dashboard',
                redirect: '/dashboard/workplace',
                hidden: true,
                component: RouteView,
                meta: { title: '仪表盘', keepAlive: true, icon: 'dashboard' },
                children: [
                    {
                        path: '/dashboard/workplace',
                        name: 'Workplace',
                        component: () => import('@/views/dashboard/Workplace'),
                        meta: { title: '工作台', keepAlive: true }
                    }
                ]
            },

            // result
            {
                path: '/result',
                name: 'result',
                hidden: true,
                component: PageView,
                redirect: '/result/success',
                meta: { title: '结果页', icon: 'check-circle-o', permission: ['result'] },
                children: [
                    {
                        path: '/result/success',
                        name: 'ResultSuccess',
                        component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
                        meta: { title: '成功', hiddenHeaderContent: true, permission: ['result'] }
                    },
                    {
                        path: '/result/fail',
                        name: 'ResultFail',
                        component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
                        meta: { title: '失败', hiddenHeaderContent: true, permission: ['result'] }
                    }
                ]
            },

            // Exception
            {
                path: '/exception',
                name: 'exception',
                hidden: true,
                component: RouteView,
                redirect: '/exception/403',
                meta: { title: '异常页', icon: 'warning', permission: ['exception'] },
                children: [
                    {
                        path: '/exception/403',
                        name: 'Exception403',
                        component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
                        meta: { title: '403', permission: ['exception'] }
                    },
                    {
                        path: '/exception/404',
                        name: 'Exception404',
                        component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
                        meta: { title: '404', permission: ['exception'] }
                    },
                    {
                        path: '/exception/500',
                        name: 'Exception500',
                        component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
                        meta: { title: '500', permission: ['exception'] }
                    }
                    // {
                    //   path: '/exception/Coming',
                    //   name: 'Coming',
                    //   component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/Coming'),
                    //   meta: { title: 'Coming' }
                    // }
                ]
            },

            //account
            {
                path: '/account',
                component: PageView,
                name: 'account',
                hidden: true,
                meta: { title: '个人页', icon: 'icon-yonghu1', keepAlive: false, permission: ['user'] },
                children: [
                    {
                        path: '/account/settings',
                        name: 'settings',
                        component: () => import('@/views/account/settings/Index'),
                        meta: { title: '用户个人中心', hideHeader: true, keepAlive: true, permission: ['user'] },
                        redirect: '/account/settings/base',
                        alwaysShow: true,
                        children: [
                            {
                                path: '/account/settings/base',
                                name: 'BaseSettings',
                                component: () => import('@/views/account/settings/BaseSetting.vue'),
                                meta: {
                                    title: '用户个人中心',
                                    liTitle: '账户信息',
                                    hidden: true,
                                    keepAlive: true,
                                    permission: ['user'],
                                    index: true
                                }
                            },
                            {
                                path: '/account/settings/security',
                                name: 'SecuritySettings',
                                hidden: true,
                                component: () => import('@/views/account/settings/Security'),
                                meta: {
                                    title: '用户个人中心',
                                    liTitle: '安全设置',
                                    hidden: true,
                                    keepAlive: true,
                                    permission: ['user'],
                                    detail: true
                                }
                            }
                        ]
                    }
                ]
            },

            //base
            {
                path: '/base',
                name: 'base',
                component: RouteView,
                meta: { title: '基础数据', keepAlive: false, icon: 'icon-webicon06' },
                children:[
                    {
                        path: '/base/client',
                        name: 'clientRouter',
                        component: RouteView,
                        meta: { title: '客户维护', keepAlive: false, multistage: true },
                        children: [
                            {
                                path: '/base/client/index',
                                name: 'client',
                                component: () => import('@/views/base/client/index.vue'),
                                meta: { title: '客户维护', keepAlive: false, index: true }
                            },
                            {
                                path: '/base/client/detail/:id',
                                name: 'clientDetail',
                                hidden: true,
                                component: () => import('@/views/base/client/detail.vue'),
                                meta: { title: '客户详情', keepAlive: false, detail: true }
                            }
                        ]
                    },
                    {
                        path: '/base/supplier',
                        name: 'supplierRouter',
                        component: RouteView,
                        meta: { title: '供应商维护', keepAlive: false, multistage: true },
                        children: [
                            {
                                path: '/base/supplier/index',
                                name: 'supplier',
                                component: () => import('@/views/base/supplier/index.vue'),
                                meta: { title: '供应商维护', keepAlive: false, index: true }
                            },
                            {
                                path: '/base/supplier/detail/:id/:parentId',
                                name: 'supplierDetail',
                                hidden: true,
                                component: () => import('@/views/base/supplier/detail.vue'),
                                meta: { title: '供应商详情', keepAlive: false, detail: true }
                            }
                        ]
                    }
                ]
            },

            //权限管理
            {
                path: '/account-mgt',
                name: 'account-mgt',
                component: RouteView,
                meta: { title: '权限管理', keepAlive: false, icon: 'icon-user-lock' },
                children:[
                    {
                        path: '/account-mgt/role-mgt',
                        name: 'roleRoute',
                        component: RouteView,
                        meta: { title: '角色管理', keepAlive: false, multistage: true },
                        children:[
                            {
                                path: '/account-mgt/role-mgt/index',
                                name: 'roleIndex',
                                component: () => import('@/views/account-mgt/role-mgt/roleIndex.vue'),
                                meta: { title: '角色管理', keepAlive: false, index: true }
                            },
                            {
                                path: '/account-mgt/role-mgt/detail/:id',
                                name: 'roleDetail',
                                hidden: true,
                                component: () => import('@/views/account-mgt/role-mgt/roleDetail.vue'),
                                meta: { title: '角色详情', keepAlive: false, detail: true }
                            },
                            {
                                path: '/account-mgt/role-mgt/assignModules/:id',
                                name: 'assignModules',
                                hidden: true,
                                component: () => import('@/views/account-mgt/role-mgt/assignModules.vue'),
                                meta: { title: '分配权限', keepAlive: false, detail: true }
                            }
                        ]
                    },
                    {
                        path: '/account-mgt/user-mgt',
                        name: 'userRoute',
                        component: RouteView,
                        meta: { title: '用户管理', keepAlive: false, multistage: true },
                        children:[
                            {
                                path: '/account-mgt/user-mgt/index',
                                name: 'userIndex',
                                component: () => import('@/views/account-mgt/user-mgt/userIndex.vue'),
                                meta: { title: '用户管理', keepAlive: false, index: true }
                            },
                            {
                                path: '/account-mgt/user-mgt/detail/:id/:orgId',
                                name: 'userDetail',
                                hidden: true,
                                component: () => import('@/views/account-mgt/user-mgt/userDetail.vue'),
                                meta: { title: '用户详情', keepAlive: false, detail: true }
                            },
                            {
                                path: '/account-mgt/user-mgt/dataAssign/:id',
                                name: 'dataAssign',
                                hidden: true,
                                component: () => import('@/views/account-mgt/user-mgt/dataAssign.vue'),
                                meta: { title: '数据权限设置', keepAlive: false, detail: true }
                            },
                        ]
                    }
                ]
            },


            //药品管理
            {
                path: '/drug-mgt',
                name: 'drug-mgt',
                component: RouteView,
                meta: { title: '药品管理', keepAlive: false, icon: 'icon-yaopinshuju' },
                children: [
                    {
                        path: '/drug-mgt/plDrug',
                        name: 'supplier-drug',
                        component: () => import('@/views/drug-mgt/pl-drug/pl-drug.vue'),
                        meta: { title: '供应商药品字典', keepAlive: false}
                    },
                    {
                        path: '/drug-mgt/PTDrug',
                        name: 'PTDrugRouter',
                        component: RouteView,
                        meta: { title: '药交所字典', keepAlive: false, multistage: true },
                        children: [
                            {
                                path: '/drug-mgt/PTDrug/index',
                                name: 'PTDrug',
                                component: () => import('@/views/drug-mgt/pt-drug/PTDrug.vue'),
                                meta: { title: '药交所字典', keepAlive: false, index: true }
                            },
                            {
                                path: '/drug-mgt/PTDrug/detail/:id',
                                name: 'PTDrugDetail',
                                hidden: true,
                                component: () => import('@/views/drug-mgt/pt-drug/PTDrugDetail.vue'),
                                meta: { title: '药交所字典详情', keepAlive: false, detail: true }
                            }
                        ]
                    },
                ]
            },
            // {
            //     path: '/drug-map',
            //     name: 'drug-map',
            //     component: RouteView,
            //     meta: { title: '药品对码', keepAlive: false, icon: 'icon-duima' },
            //     children: [
            //         {
            //             path: '/drug-map/yjsMapRoute',
            //             name: 'yjsMapRoute',
            //             component: RouteView,
            //             meta: { title: '药交所对码任务', multistage: true, keepAlive: false },
            //             children: [
            //                 {
            //                     path: '/drug-map/yjsMapRoute/index',
            //                     name: 'yjs-map',
            //                     component: () => import('@/views/drug-map/yjs-map/yjs-map.vue'),
            //                     meta: {
            //                         title: '药交所对码任务',
            //                         index: true,
            //                         keepAlive: false,
            //                         description: '药交所对码用于客户药品编码与药交所药品进行对码处理，院内SPD药品编码<->药交所药品编码'
            //                     }
            //                 },
            //                 {
            //                     path: '/drug-map/yjsMapRoute/yjsDetail/:id',
            //                     name: 'yjsDetail',
            //                     hidden: true,
            //                     component: () => import('@/views/drug-map/yjs-map/yjsDetail.vue'),
            //                     meta: {
            //                         title: '药交所药品对码',
            //                         detail: true,
            //                         description: '药交所对码用于客户药品编码与药交所药品进行对码处理，院内SPD药品编码<->药交所药品编码',
            //                         keepAlive: false
            //                     }
            //                 }
            //             ]
            //         },
            //         {
            //             path: '/drug-map/splDeliverRoute',
            //             name: 'splDeliverRoute',
            //             component: RouteView,
            //             meta: { title: '配送对码任务', multistage: true, keepAlive: false },
            //             children: [
            //                 {
            //                     path: '/drug-map/splDeliverRoute/index',
            //                     name: 'deliver-map',
            //                     component: () => import('@/views/drug-map/spl-deliver/deliver-map.vue'),
            //                     meta: {
            //                         title: '供应商配送对码任务',
            //                         index: true,
            //                         keepAlive: false,
            //                         description: '对于对客户进行配送过程中需要对码的药品所产生的对码任务,院内SPD药品编码<->供应方药品编码'
            //                     }
            //                 },
            //                 {
            //                     path: '/drug-map/splDeliverRoute/deliverDetail/:id',
            //                     name: 'deliverDetail',
            //                     hidden: true,
            //                     component: () => import('@/views/drug-map/spl-deliver/deliverDetail.vue'),
            //                     meta: {
            //                         title: '配送药品对码',
            //                         detail: true,
            //                         keepAlive: false,
            //                         description: '对于对客户进行配送过程中需要对码的药品所产生的对码任务,院内SPD药品编码<->供应方药品编码'
            //                     }
            //                 }
            //             ]
            //         },
            //         {
            //             path: '/drug-map/codePairTask',
            //             name: 'codePairTask',
            //             component: RouteView,
            //             meta: { title: '供应商对码任务', multistage: true, keepAlive: false },
            //             children: [
            //                 {
            //                     path: '/drug-map/codePairTask/index',
            //                     name: 'codePairTaskIndex',
            //                     component: () => import('@/views/drug-map/codePairTask/index.vue'),
            //                     meta: { title: '供应商对码任务', index: true, keepAlive: false }
            //                 },
            //                 {
            //                     path: '/drug-map/codePairTask/pairCode/:id',
            //                     name: 'pairCode',
            //                     hidden: true,
            //                     component: () => import('@/views/drug-map/codePairTask/pairCode.vue'),
            //                     meta: { title: '供应商对码', detail: true, keepAlive: false }
            //                 }
            //             ]
            //         },
            //         {
            //             path: '/drug-map/examineCode',
            //             name: 'examineCode',
            //             component: RouteView,
            //             meta: { title: '对码审核', multistage: true, keepAlive: false },
            //             children: [
            //                 {
            //                     path: '/drug-map/examineCode/index',
            //                     name: 'examineCodeIndex',
            //                     component: () => import('@/views/drug-map/examineCode/index.vue'),
            //                     meta: { title: '对码审核', index: true, keepAlive: false }
            //                 },
            //                 {
            //                     path: '/drug-map/examineCode/examinePair/:drugId/:extId/:id',
            //                     name: 'examinePair',
            //                     hidden: true,
            //                     component: () => import('@/views/drug-map/examineCode/examinePair.vue'),
            //                     meta: { title: '审核', detail: true, keepAlive: false }
            //                 }
            //             ]
            //         }
            //     ]
            // },
            {
                path: '/order',
                name: 'order',
                component: RouteView,
                meta: { title: '配送平台', keepAlive: false, icon: 'icon-dingdanpeisong' },
                children: [
                    {
                        path: '/order/res',
                        name: 'resRouter',
                        component: RouteView,
                        meta: { title: '订单响应', keepAlive: false, multistage: true },
                        children: [
                            {
                                path: '/order/orderRes/index',
                                name: 'orderRes',
                                component: () => import('@/views/order/orderRes/orderRes.vue'),
                                meta: { title: '订单响应', keepAlive: false, index: true, description: '业务员响应SPD接口发送的订单申请' }
                            },
                            {
                                path: '/order/orderRes/orderResInfo/:id',
                                name: 'orderResInfo',
                                hidden: true,
                                component: () => import('@/views/order/orderRes/orderResInfo.vue'),
                                meta: { title: '订单响应详情', keepAlive: false, detail: true, description: '业务员响应SPD接口发送的订单申请' }
                            }
                        ]
                    },
                    {
                        path: '/order/deliver',
                        name: 'deliverRouter',
                        component: RouteView,
                        meta: { title: '订单配送', keepAlive: false, multistage: true },
                        children: [
                            {
                                path: '/order/deliver/index',
                                name: 'orderDeliver',
                                component: () => import('@/views/order/deliver/index.vue'),
                                meta: { title: '订单配送', keepAlive: false, index: true }
                            },
                            {
                                path: '/order/deliver/detail/:id',
                                name: 'resDetail',
                                hidden: true,
                                component: () => import('@/views/order/deliver/detail.vue'),
                                meta: { title: '响应订单详情', keepAlive: false, detail: true }
                            }
                        ]
                    }
                ]
            }

        ]
    },

    {
        path: '*', redirect: '/404', hidden: true
    }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
    {
        path: '/user',
        component: UserLayout,
        redirect: '/user/login',
        hidden: true,
        children: [
            {
                path: 'login',
                name: 'login',
                component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
            },
            {
                path: 'register',
                name: 'register',
                component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
            },
            {
                path: 'register-result',
                name: 'registerResult',
                component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
            },
            {
                path: 'lock',
                name: 'lock',
                component: () => import(/* webpackChunkName: "user" */ '@/views/user/LockScreen')
            }
        ]
    },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },
  {
    path: '/500',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500')
  },
  {
    path: '/403',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403')
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
