import Vue from 'vue'
import { login, getInfo, logout, getFuncList } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { hasChild, welcome } from '@/utils/misc'
import setting from '@/setting.js'
import util from '@utils/util.js'
import { message } from 'ant-design-vue';
import { setSessionStore, getSessionStore, removeSessionStore } from '@utils/storage.js'
import Config from '@/config'
import { asyncRouterMap } from '@/config/router.config'

const user = {
    state: {
        account: {
            uuid: '',
            token: '',
            name: '',
            welcome: '',
            avatar: '',
            isLock: getSessionStore({
                name: 'isLock'
            }) || false,
            info: {}
        },
        roles:[],
        currentRole:{},
        roleId:null,
        roleName:'',
        rightsMenus:[],
        menuList: [],
        routers: hasChild(asyncRouterMap[0]) ? asyncRouterMap[0].children : {},
    },

    mutations: {
        SET_TOKEN: (state, token, uuid) => {
            state.account.token = token
            state.account.uuid = uuid
        },
        SET_NAME: (state, { name, welcome }) => {
            state.account.name = name
            state.account.welcome = welcome
        },
        SET_AVATAR: (state, avatar) => {
            state.account.avatar = avatar
        },
        SET_INFO: (state, info) => {
            state.account.info = info
        },
        SET_LOCK: (state, lastopen) => {
            state.account.isLock = true
            setSessionStore({
                name: 'isLock',
                content: state.account.isLock
            })
            setSessionStore({
                name: 'lastPath',
                content: lastopen
            })
        },
        CLEAR_LOCK: (state, action) => {
            state.account.isLock = false
            removeSessionStore({
                name: 'isLock'
            })
        },
        SET_ROLES:(state)=>{
            if(localStorage.roles){
                state.roles = JSON.parse(localStorage.roles);
            }
        },
        SET_CURRENT_ROLE:(state,role)=>{
            if(role){
                state.currentRole = role ;
                state.roleId = role.roleId;
                state.roleName = role.roleName;
                localStorage.currentRole = JSON.stringify(role);
            }else{
                if(localStorage.currentRole){
                    state.currentRole= JSON.parse(localStorage.currentRole);
                    state.roleId = state.currentRole.roleId;
                    state.roleName = state.currentRole.roleName;
                }
            }
        },
        // 获取服务器权限菜单
        setUserModuleList(state,roleId) {
            // 获取权限
            getFuncList({roleId:roleId}).then(res => {
                if (res.code == '200') {
                    // 获取菜单权限，并放入store
                    // 保存到store.app下的Menus属性
                    state.rightsMenus = res.rows;
                    localStorage.rightsMenus = JSON.stringify(state.rightsMenus);
                    this.commit('updateMenulist')
                }
                else {
                    message.warn(res.msg);
                }
            }).catch(err => {
                message.error(err);
            });
        },
        updateMenulist(state) {
            if (localStorage.rightsMenus) {
                state.rightsMenus = JSON.parse(localStorage.rightsMenus);
            }
            let menuList = [];
            // 临时全取,不校验权限
            if (!Config.checkPermission) {
                state.menuList = state.routers
            }
            else {
                state.routers.forEach((router,index)=>{
                    let item1 = router;
                    let ret1 = state.rightsMenus.find((value, index, arr) => {
                        return value.path == item1.name;
                    });
                    if(ret1){
                        let routerMenu = $.extend(true, {}, item1);
                        routerMenu.children = [];
                        if(item1.children){
                            for (let ii in item1.children){
                                let item2 = item1.children[ii];
                                let ret2 = state.rightsMenus.find((value, index, arr) => {
                                    return value.path == item2.name;
                                });
                                if (ret2) {
                                    let sonMenu = $.extend(true, {}, item2);
                                    routerMenu.children.push(sonMenu);
                                }
                            }
                        }
                        menuList.push(routerMenu);
                    }
                });
                state.menuList = menuList;
            }
        },
        // 登出
        Logout(state,vm) {
            Vue.ls.remove(ACCESS_TOKEN)
            localStorage.clear();
            vm.$router.push({ name: 'login' });
            // window.location.reload()
        }
    },
    actions: {
        /**
         * @description 设置用户数据
         * @param {Object} state vuex state
         * @param {*} info info
         */
        SetAccountInfo({ state, dispatch }, info) {
            return new Promise(async resolve => {
                // store 赋值
                state.account = info
                // 持久化
                await dispatch('db/set', {
                    dbName: 'sys',
                    path: 'user.account',
                    value: info,
                    user: true
                }, { root: true })
                // end
                resolve()
            })
        },

        /**
         * @description 从数据库取用户数据
         * @param {Object} state vuex state
         */
        LoadAccountInfo({ state, dispatch }) {
            return new Promise(async (resolve, reject) => {
                // store 赋值
                state.account = await dispatch('db/get', {
                    dbName: 'sys',
                    path: 'user.account',
                    defaultValue: setting.user.account,
                    user: true
                }, { root: true })
                // end
                resolve()
            })
        },

        // 登录
        Login({ dispatch }, userInfo) {
            return new Promise((resolve, reject) => {
                login(userInfo).then(async res => {
                    // const result = response.result
                    // 设置 cookie 一定要存 uuid 和 token 两个 cookie
                    // 整个系统依赖这两个数据进行校验和存储
                    // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
                    // token 代表用户当前登录状态 建议在网络请求中携带 token
                    // 如有必要 token 需要定时更新，默认保存一天
                    // Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
                    // util.cookies.set('uuid', result.uuid || result.id)
                    // util.cookies.set('token', result.token)
                    if(res.code == '200'){
                        Vue.ls.set(ACCESS_TOKEN, res.data.Authorization);
                        util.cookies.set('user',res.data.name);
                        if(userInfo.account == 'admin'){
                            res.data.role.push({roleName:'管理员'})
                        }
                        localStorage.roles = JSON.stringify(res.data.role);
                        if(res.data.role.length){
                            localStorage.currentRole = JSON.stringify(res.data.role[0]);
                            this.commit('SET_CURRENT_ROLE');
                            this.commit('setUserModuleList',JSON.parse(localStorage.currentRole).roleId)
                        }
                        let av = res.data.avatar?('http://192.168.0.150:40080/res' + res.data.avatar):undefined;
                        this.commit('SET_ROLES');
                        // console.log('登录名：', result.name)
                        await dispatch('SetAccountInfo', {
                            name: userInfo.account,
                            avatar: av,
                            // uuid: result.uuid || result.id,
                            // token: result.token,
                            welcome: welcome(),
                            info: res.data
                        }, { root: true })
                        // 用户登录后从持久化数据加载一系列个性化的设置
                        await dispatch('LoadPerfenence')
                        // 用户登录后从持久化数据加载一系列的设置
                        await dispatch('page/openedLoad')
                        resolve()
                    }else{
                        reject(res.msg)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 远程获取用户信息
        GetInfo({ commit }) {
            return new Promise((resolve, reject) => {
                getInfo().then(response => {
                    const result = response.result
                    commit('SET_INFO', result)
                    commit('SET_NAME', { name: result.name, welcome: welcome() })
                    commit('SET_AVATAR', result.avatar)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        LoadPerfenence({ commit, dispatch }) {
            console.log('LoadPerfenence--读取用户个性化配置....')
            return new Promise(async resolve => {
                // DB -> store 加载个性化配置
                await dispatch('preference/load', null, { root: true })
                // end
                resolve()
            })
        },
        // 登出
        Logout({ commit, state }) {
            return new Promise((resolve) => {
                // util.cookies.remove('token')
                // util.cookies.remove('uuid')
                Vue.ls.remove(ACCESS_TOKEN)
                localStorage.clear();
                logout(state.token).then(() => {
                    //跳转到login
                    this.$router.push({ name: 'login' })
                    resolve()
                }).catch(() => {
                    resolve()
                })
                resolve()
            })
        }

    }
}

export default user