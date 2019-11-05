<template>
    <div>
        <a-card>
            <Searchpanel ref="searchPanel" :list="list">
                <div slot="control">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
                </div>
            </Searchpanel>
            <a-spin tip="加载中..." :spinning="loading">
                <el-table
                        class="margin-top-10"
                        :data="dataSource"
                        border
                        style="width: 100%"
                >
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="50"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <a @click="drugMap(scope.row)">对码</a>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :show-overflow-tooltip="true"
                            :prop="item.prop"
                            :label="item.title"
                            :key="index"
                            v-for="(item,index) in columns"
                            :width="item.width"
                            :align="item.align"
                            :formatter="item.formatter"
                    >
                    </el-table-column>
                </el-table>
                <a-pagination
                        showSizeChanger
                        :total="total"
                        class="pnstyle"
                        v-model="current"
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
    import { getSupplierList, yjsDrugMap, mappingDeliver } from '@/api/login'
    export default {
        data(){
            return{
                supplierData:[],
                dataSource:[],
                loading:false,
                total:null,
                current:1,
                columns:[
                    { title: '供应商', prop: 'supplierName' },
                    { title: '药品编码', prop: 'drugId',width:100 },
                    { title: '药品名称', prop: 'drugName' },
                    { title: '规格', prop: 'packSpec' },
                    { title: '单位', prop: 'packUnit',align: 'center',width:80 },
                    { title: '生产厂商', prop: 'factoryId' }
                ]
            }
        },
        computed: {
            list() {
                return [
                    {
                        name: '供应商',
                        dataField: 'supplierId',
                        type: 'select',
                        keyExpr: 'supplierId',
                        valueExpr: 'supplierName',
                        dataSource: this.supplierData
                    },
                    { name: '药品名称', dataField: 'drugName', type: 'text' },
                    { name: '生产厂商', dataField: 'factoryId', type: 'text' },
                    {
                        name: '来源',
                        dataField: 'drugSource',
                        type: 'select',
                        keyExpr: 'id',
                        valueExpr: 'text',
                        dataSource: this.enum.drugSource
                    }
                ]
            }
        },
        mounted(){
            this.fetchMapTaskData();
            this.fetchSupplierListData();
        },
        methods:{
            //搜索
            search() {
                this.current = 1;
                let params = this.$refs.searchPanel.form.getFieldsValue();
                this.fetchMapTaskData(params)
            },
            //重置
            resetForm() {
                this.current = 1;
                this.$refs.searchPanel.form.resetFields()
                this.fetchMapTaskData()
            },
            drugMap(row){
                this.$router.push({
                    name:'deliverDetail',
                    params:{id:row.id}
                })
            },
            pageChange(page,pageSize){
                this.fetchMapTaskData({offset:(page-1)*pageSize})
            },
            sizeChange(current,size){
                this.current = 1;
                this.fetchMapTaskData({pageSize:size})
            },
            fetchMapTaskData(val={}){
                this.loading = true;
                let params = val;
                params.pageSize = val.pageSize || 10;
                params.offset = val.offset || 0;
                params.statusErp = '1';
                params.drugSource = '3';
                yjsDrugMap(params).then(res => {
                    if (res.code == '200') {
                        this.dataSource = res.rows;
                        this.total = res.total;
                        this.loading = false;
                    } else {
                        this.loading = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.loading = false;
                    this.error(err)
                })
            },
            fetchSupplierListData(params = {}){
                getSupplierList(params).then(res => {
                    if (res.code == '200') {
                        this.supplierData = res.rows;
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            fetchMappingTaskData(val={}){
                this.loading = true;
                let params = val;
                params.pageSize = val.pageSize || 10;
                params.offset = val.offset || 0;
                mappingDeliver(params).then(res => {
                    if (res.code == '200') {
                        this.dataSource = res.rows;
                        this.total = res.total;
                        this.loading = false;
                    } else {
                        this.loading = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.loading = false;
                    this.error(err)
                })
            }
        }
    }
</script>