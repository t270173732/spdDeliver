<template>
    <a-card :bordered="false">
        <Searchpanel ref="searchPanel" :list="list">
            <div slot="control">
                <a-button type="primary" @click="search">查询</a-button>
                <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
            </div>
        </Searchpanel>
        <a-button type="primary" class="margin-top-10" @click="addRole">新建</a-button>
        <a-spin :spinning="loading" tip="加载中...">
            <el-table :data="loadData" border class="margin-top-10">
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="150"
                        align="center"
                >
                    <template slot-scope="props">
                        <opcol :items="items" :more="true" :data="props.row" :filterItem="['status']"></opcol>
                    </template>
                </el-table-column>
                <el-table-column
                        v-for="item in columns"
                        :show-overflow-tooltip="true" 
                        :key="item.prop"
                        :label="item.title"
                        :prop="item.prop"
                        :width="item.width"
                        :align="item.align"
                >
                    <template slot-scope="props">
                        <span v-if="item.prop == 'status'">
                            <a-badge :status="props.row.status == 0? 'default':'processing'"
                                       :text="props.row.status==0?'停用':'启用'"/>
                        </span>
                        <span v-else-if="item.prop == 'roleType'">
                            <a-badge :status="props.row.roleType == 0? 'default':'processing'"
                                     :text="props.row.roleType==0?'维护':'供应商'"/>
                        </span>
                        <span v-else-if="item.prop == 'userNum'">
                            <a-badge showZero @click="menberShow(props.row)" :count="props.row.userNum"
                                   :numberStyle="{backgroundColor: '#1694fb', color: '#fff',cursor:'pointer'}"/>
                        </span>
                        <span v-else>{{props.row[item.prop]}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <a-pagination
                    :total="total"
                    class="pnstyle"
                    :defaultPageSize="10"
                    :pageSize="pageSize"
                    @change="pageChange"
                    showSizeChanger
                    v-model="curent"
                    :pageSizeOptions="['10', '20','50']"
                    @showSizeChange="sizeChange"
                    size="small"
            >
            </a-pagination>
        </a-spin>
        <a-modal
                :title="title"
                :maskClosable="false"
                v-model="visible"
                :footer="null"
                width="700px"
        >
            <a-spin :spinning="spinning" tip="加载中...">
                <a-button type="primary" @click="menberConfirm" :loading="bathLoading">批量移除</a-button>
                <el-table
                        class="margin-top-10"
                        ref="table"
                        :data="menberData"
                        max-height="400"
                        size="small"
                        border
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="50"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <a-popconfirm title="确认移除?" @confirm="menberConfirm(scope.row)" okText="移除" cancelText="取消">
                                <a class="delColor">移除</a>
                            </a-popconfirm>
                        </template>
                    </el-table-column>
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column v-for="item in menberColumns" :show-overflow-tooltip="true" :key="item.prop"
                                     :label="item.title" :prop="item.prop" :width="item.width" :align="item.align">
                        <template slot-scope="scope">
          <span v-if="item.prop == 'status'">
          <a-badge :status="scope.row.status == 0? 'default':'processing'" :text="scope.row.status==0?'禁用':'启用'"/>
          </span>
                            <span v-else>{{scope.row[item.prop]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </a-spin>
        </a-modal>
    </a-card>
</template>

<script>
    import {
        getRolePage,
        getRoleList,
        roleUpdate,
        getUserByRole,
        removeRoleUser
    } from '@/api/login'

    export default {
        data() {
            return {
                title: '<暂无数据>',
                visible: false,
                QPshow: false,
                total: 10,
                curent: 1,
                pageSize: 10,
                loading: false,
                items: [
                    { text: '分配权限', showtip: false, click: this.assign },
                    { text: '编辑', showtip: false, click: this.editRole },
                    { text: '删除', showtip: true, tip: '确认删除吗？', click: this.confirm, color: '#ff9900' },
                    { text: '启用', showtip: false, click: this.checkStatus, status: '1' },
                    { text: '停用', showtip: true, tip: '确认停用吗？', click: this.checkStatus, status: '0', color: '#ff9900' }
                ],
                columns: [
                    { title: '角色编码', prop: 'roleId', width: 80 },
                    { title: '角色名称', prop: 'roleName' },
                    { title: '角色类型', prop: 'roleType', align:'center', width:100 },
                    { title: '创建人', prop: 'createUser', width: 150 },
                    { title: '创建时间', prop: 'createTime', width: 150 },
                    { title: '编辑人', prop: 'editUser', width: 150 },
                    { title: '编辑时间', prop: 'editTime', width: 150 },
                    { title: '成员', prop: 'userNum', width: 80, align: 'center' },
                    { title: '状态', prop: 'status', width: 80, align: 'center' }
                ],
                loadData: [],
                menberData: [],
                menberColumns: [
                    { title: '账号', prop: 'account' },
                    { title: '用户名称', prop: 'username' },
                    { title: '电话', prop: 'phone' },
                    { title: '状态', prop: 'status', width: 80, align: 'center' }
                ],
                multipleSelection: [],
                bathLoading: false,
                spinning:false
            }
        },
        computed: {
            list() {
                return [
                    { name: '角色编码', dataField: 'roleId', type: 'text' },
                    { name: '角色名称', dataField: 'roleName', type: 'text' },
                    {
                        name: '状态',
                        dataField: 'status',
                        type: 'select',
                        keyExpr: 'id',
                        valueExpr: 'text',
                        dataSource: this.enum.status
                    }
                ]
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            sizeChange(current, size) {
                this.curent = 1;
                this.pageSize = size;
                this.getData({ pageSize: size })
            },
            pageChange(page, pageSize) {
                let params = this.$refs.searchPanel.form.getFieldsValue()
                params.pageSize = pageSize
                params.offset = (page - 1) * pageSize
                this.getData(params)
            },
            popconfirmShow(data) {
                this.QPshow = true
            },
            cancel() {
                this.QPshow = false
            },
            assign(row) {
                this.$router.push({
                    name: 'assignModules',
                    params: { id:row.roleId }
                })
            },
            addRole() {
                this.$router.push({
                    name: 'roleDetail',
                    params: { id:0 }
                })
            },
            editRole(row){
                this.$router.push({
                    name: 'roleDetail',
                    params: { id:row.roleId }
                })
            },
            search() {
                this.curent = 1;
                this.pageSize = 10;
                let params = this.$refs.searchPanel.form.getFieldsValue()
                params.pageSize = 10
                params.offset = 0
                this.getData(params)
            },
            checkStatus(data) {
                let params = {
                    roleId: data.roleId,
                    roleName: data.roleName
                }
                if (data.status == '1') {
                    params.status = '0'
                }
                if (data.status == '0') {
                    params.status = '1'
                }
                roleUpdate(params).then(res => {
                    if (res.code == '200') {
                        this.success('修改成功!', () => {
                            this.resetForm()
                        })
                    } else {
                        this.$message.error('修改失败!')
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            menberShow(data) {
                this.visible = true;
                this.spinning = true;
                this.title = data.roleName;
                let params = {
                    roleId: data.roleId
                }
                getUserByRole(params).then(res => {
                    if (res.code == '200') {
                        this.menberData = res.rows;
                        this.spinning = false;
                    } else {
                        this.spinning = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.spinning = false;
                    this.error(err);
                })
            },
            handleSelectionChange(rows) {
                let arr = []
                rows.map((item) => {
                    arr.push(item.account)
                })
                this.multipleSelection = arr
            },
            resetForm() {
                this.curent = 1;
                this.pageSize = 10;
                this.$refs.searchPanel.form.resetFields()
                this.getData({ pageSize: 10, offset: 0 })
            },
            confirm(data) {
                if(data.status == 1){
                    this.warn('请停用后，再删除!');
                    return;
                }
                let params = {
                    roleId: data.roleId,
                    status:'2'
                }
                roleUpdate(params).then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!', () => {
                            this.resetForm()
                        })
                    } else {
                        this.$message.error('删除失败!')
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            menberConfirm(row) {
                this.bathLoading = true
                let params = {};
                if (row) {
                    params.ids = [row.account];
                    params.roleId = row.roleId;
                } else {
                    if (this.multipleSelection.length == 0) {
                        this.warn('请选择成员!')
                        this.bathLoading = false
                        return
                    }
                    params.ids = this.multipleSelection;
                    params.roleId = this.multipleSelection[0].roleId;
                }
                removeRoleUser(params).then(res => {
                    if (res.code == '200') {
                        this.success('移除成功!', () => {
                            this.visible = false
                            this.bathLoading = false
                            this.resetForm()
                        })
                    } else {
                        this.bathLoading = false
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.bathLoading = false
                    this.error(err)
                })
            },
            getData(data) {
                let params = {}
                this.loading = true;
                if (data) {
                    params = data
                }
                getRolePage(params).then(res => {
                    if (res.code == '200') {
                        this.loadData = res.rows
                        this.total = res.total
                        this.pageSize = res.size
                        this.loading = false
                    } else {
                        this.warn(res.msg)
                        this.loading = false
                    }
                }).catch(err => {
                    this.loading = false
                    this.error(err)
                })
            },
        }
    }
</script>
