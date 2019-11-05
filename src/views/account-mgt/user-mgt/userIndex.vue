<template>
    <a-card>
        <a-row :gutter="24">
            <a-col :md="24" :lg="5">
                <a-card style="width: 100%;overflow: auto">
                    <a-spin tip="加载中..." :spinning="orgSpin">
                        <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange" />
                        <a-tree
                                style="max-height: 500px"
                                @expand="onExpand"
                                :expandedKeys="expandedKeys"
                                :autoExpandParent="autoExpandParent"
                                @select="onSelect"
                                :treeData="gData"
                        >
                            <template slot="title" slot-scope="{title}">
                            <span v-if="title.indexOf(searchValue) > -1">
                                {{title.substr(0, title.indexOf(searchValue))}}
                                <span style="color: #f50">{{searchValue}}</span>
                                {{title.substr(title.indexOf(searchValue) + searchValue.length)}}
                            </span>
                                <span v-else>{{title}}</span>
                            </template>
                        </a-tree>
                    </a-spin>
                </a-card>
            </a-col>
            <a-col :md="24" :lg="19">
                <a-button type="primary" icon="add" :disabled="btnDidsbled" @click="addUser">新建</a-button>
                <a-spin tip="加载中..." :spinning="spinning">
                    <el-table
                            :data="dataSource"
                            border
                            class="margin-top-10"
                    >
                        <el-table-column
                                fixed="right"
                                label="操作"
                                width="150"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <opcol :items="items" :more="true" :data="scope.row" :filterItem="['status']"></opcol>
                            </template>
                        </el-table-column>
                        <el-table-column 
                                :show-overflow-tooltip="true" 
                                v-for="item in columns"
                                :key="item.prop" 
                                :label="item.title" 
                                :prop="item.prop"
                                :width="item.width" 
                                :align="item.align"
                        >
                            <template slot-scope="props">
                                <span v-if="item.prop == 'status'">
                                    <a-badge :status="props.row.status == 0? 'default':'processing'" :text="props.row.status==0?'停用':'启用'"/>
                                </span>
                                <span v-else-if="item.prop == 'roleNum'">
                                    <a-badge showZero :count="props.row.roleNum" @click="checkRol(props.row)" :numberStyle= "{backgroundColor: '#1694fb',cursor: 'pointer'}"/>
                                </span>
                                <span v-else>{{props.row[item.prop]}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <a-pagination
                            ref="pagination"
                            :total="total"
                            class="pnstyle"
                            v-model="current"
                            :defaultPageSize="10"
                            :pageSize="pageSize"
                            @change="pageChange"
                            showSizeChanger
                            :pageSizeOptions="['10', '20','50']"
                            @showSizeChange="sizeChange"
                            size="small"
                    >
                    </a-pagination>
                </a-spin>
            </a-col>
        </a-row>
        <a-modal
                title="用户角色"
                :visible="visible"
                @ok="handleOk"
                :maskClosable="false"
                @cancel="handleCancel"
                :confirmLoading="confirmLoading"
                width="690px"
        >
            <a-row>
                <a-col :span="10"><p class="userModel-p">未选择角色</p></a-col>
                <a-col :span="11" :offset="3"><p class="userModel-p">已选择角色</p></a-col>
            </a-row>
            <a-spin tip="加载中..." :spinning="transferLoading">
                <a-transfer
                        :dataSource="mockData"
                        :listStyle="{ width: '280px', height: '300px' }"
                        :titles="['全部角色', '拥有角色']"
                        :targetKeys="targetKeys"
                        @change="handleChange"
                        :render="item=>item.title"
                        :operations="['添加', '移除']"
                        :lazy="{ height: 32, offset: 32 }"
                >
                </a-transfer>
            </a-spin>
        </a-modal>
    </a-card>
</template>
<script>
    import {
        getOrgList,
        getUserPage,
        updateUser,
        getRoleByUser,
        resetPassword,
        setRoleForUser
    } from '@/api/login';
    import debounce from 'lodash/debounce';


    // const dataList = []
    // const generateList = (data) => {
    //     for (let i = 0; i < data.length; i++) {
    //         const node = data[i]
    //         const key = node.key
    //         dataList.push({ key, title: key })
    //         if (node.children) {
    //             generateList(node.children, node.key)
    //         }
    //     }
    // }
    // generateList(gData)

    const getParentKey = (key, tree) => {
        let parentKey
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i]
            if (node.children) {
                if (node.children.some(item => item.key === key)) {
                    parentKey = node.key
                } else if (getParentKey(key, node.children)) {
                    parentKey = getParentKey(key, node.children)
                }
            }
        }
        return parentKey
    }
    export default {
        data(){
            this.onChange = debounce(this.onChange, 800);
            return{
                expandedKeys: [],
                searchValue: '',
                autoExpandParent: true,
                gData:[],
                dataList:[],
                orgSpin:false,
                spinning:false,
                dataSource:[],
                columns: [
                    {title: '账号',prop: 'account'},
                    {title: '用户名称',prop: 'username'},
                    {title: '电话',prop: 'phone'},
                    {title: '拥有角色',prop: 'roleNum',align:'center',width:80},
                    {title: '创建人',prop: 'createUser'},
                    {title: '创建时间',prop: 'createTime'},
                    {title: '编辑人',prop: 'editUser'},
                    {title: '编辑时间',prop: 'editTime'},
                    {title: '状态',prop: 'status',align:'center',width:80}
                ],
                items:[
                    { text: '数据权限', showtip: false, click: this.assign },
                    { text: '编辑', showtip: false, click: this.editUser },
                    { text: '重置密码', showtip: true, tip: '确认重置吗？', click: this.resetPass },
                    { text: '删除', showtip: true, tip: '确认删除吗？', click: this.delUser, color: '#ff9900' },
                    { text: '启用', showtip: false, click: this.changeStatus, status: '1' },
                    { text: '停用', showtip: true, tip: '确认停用吗？', click: this.changeStatus, status: '0', color: '#ff9900' }
                ],
                selectData:{},
                selectOrgData:{},
                visible:false,
                mockData: [],
                targetKeys: [],
                confirmLoading:false,
                pageSize:10,
                total:0,
                current:1,
                btnDidsbled:true,
                transferLoading:false
            }
        },
        mounted() {
            this.getOrgData();
        },
        methods:{
            onExpand(expandedKeys) {
                this.expandedKeys = expandedKeys;
                this.autoExpandParent = false;
            },
            onChange(e){
                const value = e.target.value
                const expandedKeys = this.dataList.map((item) => {
                    if (item.title.indexOf(value) > -1) {
                        return getParentKey(item.key, this.gData)
                    }
                    return null
                }).filter((item, i, self) =>{
                    return item && self.indexOf(item) === i
                } )
                Object.assign(this, {
                    expandedKeys,
                    searchValue: value,
                    autoExpandParent: true,
                })
            },
            onSelect(selectedKeys,e){
                if( e.selected){
                    this.selectOrgData = e.node.dataRef;
                    let params = {};
                    params.userProp = e.node.dataRef.key;
                    this.getUserData(params);
                    this.btnDidsbled = false
                }else{
                    this.selectOrgData = {};
                    this.dataSource = [];
                    this.total = 0;
                    this.current = 1;
                    this.btnDidsbled = true
                }
            },
            addUser(){
                this.$router.push({
                    name:'userDetail',
                    params:{ id:0, orgId:this.selectOrgData.key }
                })
            },
            pageChange(page,size){
                let params = {};
                params.offset = (page-1)*size;
                params.userProp = this.selectOrgData.key;
                this.getUserData(params);
            },
            sizeChange(current,size){
                this.pageSize = size;
                this.current = 1;
                let params = {};
                params.pageSize = size;
                params.userProp = this.selectOrgData.key;
                this.getUserData(params);
            },
            assign(row){
                this.$router.push({
                    name:'dataAssign',
                    params:{ id:row.account,orgId:this.selectOrgData.key }
                })
            },
            editUser(row){
                this.$router.push({
                    name:'userDetail',
                    params:{ id:row.account,orgId:this.selectOrgData.key }
                })
            },
            delUser(row){
                let params = {};
                if(row.status == '1'){
                    this.warn('请先停用，再删除!');
                    return;
                }
                params.userProp = row.userProp;
                params.status = '2';
                params.account = row.account;
                updateUser(params).then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!',()=>{
                            this.pageSize = 10;
                            this.current = 1;
                            this.getUserData({userProp:this.selectOrgData.key})
                        })
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            changeStatus(row){
                let params = {};
                if(row.status == '0'){
                    params.status = '1'
                }else{
                    params.status = '0'
                }
                params.userProp = row.userProp;
                params.account = row.account;
                updateUser(params).then(res => {
                    if (res.code == '200') {
                        this.success('保存成功!',()=>{
                            this.pageSize = size;
                            this.current = 1;
                            this.getUserData({userProp:this.selectOrgData.key})
                        })
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            resetPass(row){
                let params = {};
                params.account = row.account;
                resetPassword(params).then(res => {
                    if (res.code == '200') {
                        this.success('重置成功!')
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            checkRol(row){
                this.visible = true;
                let selectData = {account:row.account,centerId:row.centerId,status:1,roleType:row.dataType};
                this.selectData = selectData;
                this.getUserRole(selectData);
            },
            getUserRole(data){
                this.transferLoading = true;
                // 全部角色
                let mockData = []
                // 拥有角色
                let targetKeys = []
                getRoleByUser(data).then(res => {
                    if (res.code == '200') {
                        for(let i = 0; i < res.data.roles.length; i++){
                            let role = {key:res.data.roles[i].roleId,title:res.data.roles[i].roleName}
                            mockData.push(role)
                        }
                        for(let j = 0; j < res.data.userRole.length; j++){
                            let checkedRole =  res.data.userRole[j].roleId
                            targetKeys.push(checkedRole)
                        }
                        this.transferLoading = false;
                    } else {
                        this.transferLoading = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.transferLoading = false;
                    this.error(err)
                })
                this.mockData = mockData
                this.targetKeys = targetKeys
            },
            handleOk() {
                this.confirmLoading = true;
                let params = this.selectData
                params.roles = this.targetKeys
                setRoleForUser(params).then(res => {
                    if (res.code == '200') {
                        this.$message.info('修改成功!');
                        this.getUserData({userProp:this.selectOrgData.key});
                        this.visible = false;
                        this.confirmLoading = false;
                    } else {
                        this.confirmLoading = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.confirmLoading = false;
                    this.error(err)
                })
            },
            handleCancel() {
                this.visible = false
            },
            handleChange(targetKeys, direction, moveKeys) {
                this.targetKeys = targetKeys
            },

            getOrgData(){
                this.orgSpin = true;
                getOrgList({}).then(res => {
                    if (res.code == '200') {
                        let arr = this.dataTransformation(res.rows), parantKeys = [];
                        this.gData = [{key:'-1',title:'维护',scopedSlots: { title: 'title' }},...arr];
                        this.generateList(this.gData);
                        this.orgSpin = false;
                    } else {
                        this.orgSpin = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.orgSpin = false;
                    this.error(err)
                })
            },
            //数据改造
            dataTransformation(data){
                let newData = [];
                data.map((arr,index)=>{
                    let row = {};
                    row = {
                        title:arr.supplierName,
                        key:arr.supplierId,
                        scopedSlots: { title: 'title' }
                    };
                    if(arr.children && arr.children.length > 0){
                        let child = this.dataTransformation(arr.children);
                        row.children = child;
                    }
                    newData.push(row);
                })
                return newData;
            },
            generateList(data){
                for (let i = 0; i < data.length; i++) {
                    const node = data[i];
                    const key = node.key;
                    this.dataList.push({ key, title: node.title });
                    if (node.children) {
                        this.generateList(node.children, node.key)
                    }
                }
            },
            getUserData(obj = {}){
                this.spinning = true;
                let params = obj;
                params.offset = obj.offset || 0;
                params.pageSize = obj.pageSize || 10;
                getUserPage(params).then(res => {
                    if (res.code == '200') {
                        this.dataSource = res.rows;
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
        }
    }
</script>