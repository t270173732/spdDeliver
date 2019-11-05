<template>
    <div>
        <a-card>
            <Searchpanel ref="searchPanel" :list="list">
                <div slot="control">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
                </div>
            </Searchpanel>
            <a-button type="primary" class="margin-top-10" @click="addClient">新建</a-button>
            <a-spin tip="加载中..." :spinning="spinning">
                <el-table
                        class="margin-top-10"
                        :data="dataSource"
                        border
                        style="width: 100%"
                >
                    <el-table-column
                            :show-overflow-tooltip="true"
                            :prop="item.prop"
                            :label="item.title"
                            :key="index"
                            v-for="(item,index) in columns"
                            :width="item.width"
                            :align="item.align"
                    >
                        <template slot-scope="scope">
                            <span v-if="item.value == 'status'">
                                <a-badge :status="scope.row.status == '1'? 'processing':'default'" :text="scope.row.status == '1'?'启用':'停用'"/>
                            </span>
                            <span v-else-if="item.value == 'clientClass'" v-html="clientClass(scope.row.clientClass)"></span>
                            <span v-else-if="item.value == 'clientLevel'" v-html="clientLevel(scope.row.clientLevel)"></span>
                            <span v-else>{{scope.row[item.value]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="150"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <!--<opcol :items="items" :more="true" :data="scope.row" :filterItem="['status']"></opcol>-->
                            <a @click="edit(scope.row)">编辑</a>
                            <a-divider type="vertical"/>
                            <a-popconfirm title="确认删除吗？" @confirm="delRow(scope.row)">
                                <a class="delColor">删除</a>
                            </a-popconfirm>
                            <a-divider type="vertical"/>
                            <a @click="changeStatus(scope.row)" v-if="scope.row.status == 0">启用</a>
                            <a-popconfirm title="确认停用吗？" @confirm="changeStatus(scope.row)"  v-else>
                                <a class="delColor">停用</a>
                            </a-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <a-pagination
                        :total="total"
                        showSizeChanger
                        v-model="current"
                        class="pnstyle"
                        :defaultPageSize="10"
                        :pageSizeOptions="['10', '20','50']"
                        @showSizeChange="sizeChange"
                        @change="pageChange"
                        size="small"
                >
                </a-pagination>
            </a-spin>
        </a-card>
    </div>
</template>
<script>
    import { getClientData,updateClient } from '@/api/login'

    export default {
        data() {
            return {
                dataSource: [],
                columns: [
                    { title: '编码', value: 'clientId' },
                    { title: '客户名称', value: 'clientName' },
                    { title: '联系人', value: 'contacts', width: 80 },
                    { title: '联系电话', value: 'phone', width: 120 },
                    { title: '地址', value: 'address' },
                    { title: '分类', value: 'clientClass', align: 'center' },
                    { title: '级别', value: 'clientLevel', width: 80, align: 'center' },
                    { title: '备注', value: 'remark' },
                    { title: '状态', value: 'status', align: 'center', width: 80 }
                ],
                total: 0,
                current:1,
                spinning:false
            }
        },
        computed: {
            list() {
                return [
                    { name: '客户名称', dataField: 'keyword', type: 'text' },
                    { name: '联系人', dataField: 'contacts', type: 'text' },
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
            this.fetckData();
        },
        methods: {
            //搜索
            search() {
                this.current = 1;
                let params = this.$refs.searchPanel.form.getFieldsValue();
                this.fetckData(params)
            },
            //重置
            resetForm() {
                this.current = 1;
                this.$refs.searchPanel.form.resetFields();
                this.fetckData()
            },
            clientLevel(row){
                let level
                if(row != undefined){
                    this.enum.clientLevel.map((data)=>{
                        if(data.id == row){
                            level = data.text
                            return
                        }
                    })
                }
                return level
            },
            clientClass(row){
                let clientclass
                if(row != undefined){
                    this.enum.clientClass.map((data)=>{
                        if(data.id == row){
                            clientclass = data.text
                            return
                        }
                    })
                }
                return clientclass
            },
            addClient() {
                this.$router.push({
                    name:'clientDetail',
                    params:{ id:0 }
                })
            },
            // 编辑配送中心
            edit(row) {
                this.$router.push({
                    name:'clientDetail',
                    params:{ id:row.clientId }
                })
            },
            // 删除配送中心
            delRow(row) {
                if(row.status == '1'){
                    this.warn('请先停用，再删除!');
                    return;
                }
                let params = {};
                params.clientId = row.clientId;
                params.status = '2';
                updateClient(params).then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!', () => {
                            this.resetForm()
                        });
                    } else {
                        this.loading = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.loading = false;
                    this.error(err)
                })
            },
            //启用/停用
            changeStatus(row){
                let params = {
                    clientId : row.clientId
                };
                if(row.status == 0){
                    params.status = '1'
                }else{
                    params.status = '0'
                }
                updateClient(params).then(res => {
                    if (res.code == '200') {
                        this.success('操作成功!', () => {
                            this.resetForm()
                        });
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            pageChange(page, pageSize) {
                let params = this.$refs.searchPanel.form.getFieldsValue();
                params.offset = (page-1)*pageSize
                this.fetckData(params)
            },
            sizeChange(current,size){
                this.current = 1;
                let params = this.$refs.searchPanel.form.getFieldsValue();
                params.pageSize = size;
                this.fetckData(params)
            },
            fetckData(value = {}) {
                this.spinning = true;
                let params = value;
                params.pageSize = value.pageSize || 10;
                params.offset = value.offset || 0;
                getClientData(params).then(res => {
                    if (res.code == '200') {
                        this.dataSource = res.rows;
                        this.total = res.total;
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
        }
    }
</script>