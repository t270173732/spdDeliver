<template>
    <a-card>
        <div class="cardHead">
            <a href="#" @click.prevent="cancel">
                <a-icon type="left"></a-icon>
                返回
            </a>
        </div>
        <a-spin :spinning="spinning" tip="加载中...">
            <a-form>
                <a-form-item :wrapper-col="{ span: 24 }">
                    <a-input-search
                            placeholder="请输入"
                            style="width: 200px"
                            @change="onSearch"
                    />
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 24 }">
                    <a-tree
                            checkable
                            @expand="onExpand"
                            :expandedKeys="expandedKeys"
                            :autoExpandParent="autoExpandParent"
                            v-model="checkedKeys"
                            :treeData="treeData"
                    >
                        <template slot="title" slot-scope="{title}">
                        <span v-if="title.indexOf(searchValue) > -1">
                            {{title.substr(0, title.indexOf(searchValue))}}
                            <span style="color: #FFFF00">{{searchValue}}</span>
                            {{title.substr(title.indexOf(searchValue) + searchValue.length)}}
                        </span>
                            <span v-else>{{title}}</span>
                        </template>
                    </a-tree>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 24, offset: 10 }">
                    <a-button type="primary" @click="handleSubmit" :loading="loading">更新</a-button>
                </a-form-item>
            </a-form>
        </a-spin>

    </a-card>
</template>
<script>
    import {
        getRoleModuleList,
        updateRoleModule
    } from '@/api/login'
    import { name_to_code } from '@/utils/misc'
    import debounce from 'lodash/debounce'

    export default {
        data() {
            this.onSearch = debounce(this.onSearch, 800)
            return {
                expandedKeys: [],
                autoExpandParent: true,
                checkedKeys: [],
                treeData: [],
                dataList: [],
                searchValue: '',
                spinning:false,
                loading:false
            }
        },
        computed: {},
        mounted() {
            this.getModuleData()
        },
        methods: {
            onExpand(expandedKeys) {
                this.expandedKeys = expandedKeys
                this.autoExpandParent = false
            },
            //tree的搜索
            onSearch(e) {
                const value = e.target.value
                if (value) {
                    const expandedKeys = this.dataList.map((item) => {
                        if (item.title.indexOf(value) > -1) {
                            return this.getParentKey(item.title, this.treeData)
                        }
                        return null
                    }).filter((item, i, self) => item && self.indexOf(item) === i)
                    Object.assign(this, {
                        expandedKeys,
                        searchValue: value,
                        autoExpandParent: true
                    })
                } else {
                    Object.assign(this, {
                        expandedKeys: [],
                        searchValue: value,
                        autoExpandParent: false
                    })
                }
            },
            getParentKey(title, tree) {
                let parentKey
                for (let i = 0; i < tree.length; i++) {
                    const node = tree[i]
                    if (node.children) {
                        if (node.children.some(item => item.title === title)) {
                            parentKey = node.key
                        } else if (this.getParentKey(title, node.children)) {
                            parentKey = this.getParentKey(title, node.children)
                        }
                    }
                }
                return parentKey
            },
            handleSubmit() {
                this.loading = true;
                let params = {
                    roleId: this.$route.params.id
                }, ids = [], modules = [];
                this.checkedKeys.forEach(item => {
                    if (item.length > 2) {
                        if (ids.indexOf(item.slice(0, 2)) < 0) {
                            ids.push(item.slice(0, 2))
                        }
                        ids.push(item)
                    } else {
                        if (ids.indexOf(item) < 0) {
                            ids.push(item)
                        }
                    }
                })
                ids.forEach(item => {
                    this.treeData.forEach(i => {
                        if (item == i.moduleId) {
                            modules.push(i)
                        } else {
                            if (i.children) {
                                i.children.forEach(child => {
                                    if (item == child.moduleId) {
                                        modules.push(child)
                                    }
                                })
                            }
                        }
                    })
                })
                params.modules = modules
                updateRoleModule(params).then(res => {
                    if (res.code == '200') {
                        this.success('更新成功!',()=>{
                            this.cancel();
                        })
                    } else {
                        this.loading = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.loading = false;
                    this.error(err)
                })
            },
            checkArr(data) {
                data.map((item) => {
                    if (item.moduleId) {
                        item.key = item.moduleId
                    }
                    if (item.moduleName) {
                        item.title = item.moduleName
                    }
                    if (item.children) {
                        this.checkArr(item.children)
                    }
                    item.scopedSlots = { title: 'title' }
                    return item
                })
                return data
            },
            myPower(data, list) {
                let myPowerArr = []
                list.forEach(item => {
                    let parent, son = []
                    data.forEach(i => {
                        if (i.moduleId.length > 2) {
                            if (i.moduleId.slice(0, 2) == item.moduleId) {
                                son.push(i.moduleId)
                            }
                        }
                    })
                    if (item.children.length == son.length) {
                        myPowerArr.push(item.moduleId)

                    }
                    myPowerArr = myPowerArr.concat(son)
                })
                return myPowerArr
            },
            generateList(data) {
                for (let i = 0; i < data.length; i++) {
                    const node = data[i]
                    const key = node.key
                    const title = node.title
                    this.dataList.push({ key, title: title })
                    if (node.children) {
                        this.generateList(node.children, node.title)
                    }
                }
            },
            getModuleData() {
                this.spinning = true;
                getRoleModuleList({ roleId:this.$route.params.id }).then(res => {
                    if (res.code == '200') {
                        let arr = this.checkArr(res.data.modules), parantKeys = []
                        let myPower = this.myPower(res.data.roleModules, res.data.modules), son = []
                        myPower.forEach(item => {
                            if (item.length > 2) {
                                son.push(item)
                            }
                        })
                        res.data.roleModules.forEach(item => {
                            if (item.moduleId <= 2) {
                                parantKeys.push(item.moduleId)
                            }
                        })
                        this.treeData = arr
                        this.generateList(this.treeData)
                        this.checkedKeys = myPower
                        this.expandedKeys = parantKeys
                        this.spinning = false;
                    } else {
                        this.spinning = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.spinning = false;
                    this.error(err)
                })
            },
            cancel() {
                this.$router.push({
                    name: 'roleIndex'
                })
            }
        }
    }
</script>
<style>
    .spanBtn {
        color: #1694fb
    }

    .centerBtn {
        margin-top: 10px;
        margin-left: 50%;
        transform: translate(-50%);
    }
</style>