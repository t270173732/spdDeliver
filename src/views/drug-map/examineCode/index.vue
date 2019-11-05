<template>
    <a-card>
        <Searchpanel ref="searchPanel" :list="list">
            <div slot="control">
                <a-button type="primary" @click="search">查询</a-button>
                <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
            </div>
        </Searchpanel>
        <a-spin tip="加载中..." :spinning="loading">
            <el-table
                ref="table"
                :data="loadData"
                class="margin-top-10"
                border
            >
                <el-table-column :show-overflow-tooltip="true" v-for="item in columns" :key="item.dataIndex" :label="item.title" :prop="item.dataIndex" :width="item.width" :align="item.align">
                    <template slot-scope="props">
                        <span v-if="item.dataIndex == 'status'">
                            <a-badge :status="props.row.status == 0? 'default':'processing'" :text="props.row.status==0?'未完成':'已完成'"/>
                        </span>
                        <span v-else-if="item.dataIndex == 'action'">
                            <div v-if="props.row.endTime">
                                {{props.row.endTime}}通过审核
                            </div>
                            <div v-else class='editable-row-operations'>
                            <span>
                                <a @click.prevent="edit(props)">审核</a>
                            </span>
                            </div>
                        </span>
                        <span v-else>{{props.row[item.dataIndex]}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <a-pagination
                    :total="total"
                    class="pnstyle"
                    :defaultPageSize="pageSize"
                    @change="pageChange"
                    showSizeChanger
                    v-model="curent"
                    :pageSizeOptions="['10', '20','50']"
                    @showSizeChange="sizeChange"
                    size="small"
            >
            </a-pagination>
        </a-spin>
    </a-card>
</template>
<script>
    import { getSupplierList, examineCodePage } from '@/api/login'
    export default {
        data() {
            return {
                loading:false,
                total:10,
                curent:1,
                pageSize:10,
                columns: [
                    {title: '供应商',dataIndex: 'supplierName'},
                    {title: '药品编码',dataIndex: 'drugId',width:'150px'},
                    {title: '药品名称',dataIndex: 'drugName'},
                    {title: '规格',dataIndex: 'packSpec',width:'150px'},
                    {title: '单位',dataIndex: 'packUnit',width:'70px'},
                    {title: '生产厂商',dataIndex: 'factoryId'},
                    {title: '操作',dataIndex: 'action',align:'center',width:'100px'}
                ],

                loadData:[],
                supplierData:[]
            }
        },
        computed: {
            list() {
                return [
                    {   name: '供应商', dataField: 'supplierName', type: 'text' },
                    // {   name: '供应商',
                    //     dataField: 'supplierId',
                    //     type: 'select',
                    //     keyExpr: 'supplierId',
                    //     valueExpr: 'supplierName',
                    //     dataSource: this.supplierData
                    // },
                    {   name: '药品名称', dataField: 'drugName', type: 'text' },
                    {   name: '生产厂商', dataField: 'factoryId', type: 'text' }
                ]
            }
        },
        mounted() {
            this.fetchSupplierListData()
            this.getData()
        },
        methods: {
            sizeChange(current,size){
                this.curent = 1
                this.getData({pageSize:size})
            },
            pageChange(page, pageSize){
                let params = this.$refs.searchPanel.form.getFieldsValue()
                params.offset = (page-1)*pageSize
                params.pageSize = pageSize
                this.getData(params)
            },
            //搜索
            search() {
                this.curent = 1;
                let params = this.$refs.searchPanel.form.getFieldsValue()
                params.pageSize = 10;
                params.offset = 0;
                this.getData(params)
            },
            //重置
            resetForm() {
                this.curent = 1;
                this.$refs.searchPanel.form.resetFields()
                this.getData({ pageSize: 10, offset: 0 })
            },
            // 对码
            edit (data) {
                this.$router.push({
                    name:'examinePair',
                    params:{drugId:data.row.erpDrugId,extId:data.row.erpExtDrugId,id:data.row.erpId,}
                })
            },
            //获取数据
            getData(data) {
                this.loading = true
                let params = {offset:0,pageSize:10}
                if(data){
                    params = data
                }
                examineCodePage(params).then(res => {
                    if (res.code == '200') {
                        this.loadData = res.rows
                        this.total = res.total
                        this.pageSize = res.pageSize
                        this.loading = false
                    } else {
                        this.loading = false
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.loading = false;
                    this.error(err)
                })
            },
            fetchSupplierListData(){
                getSupplierList({}).then(res => {
                    if (res.code == '200') {
                        this.supplierData = res.rows;
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
        }
    }
</script>