<template>
    <div>
        <a-card>
            <Searchpanel ref="searchPanel" :list="list">
                <div slot="control">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
                </div>
            </Searchpanel>
            <!--<div class="divInfo margin-top-10">-->
                <!--<div class="infoIcon">-->
                    <!--<a-icon type="info" style="color: white"/>-->
                <!--</div>-->
                <!--<span>未对码<a>1223</a>    项     已对码<a>12</a>项</span>-->
            <!--</div>-->
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
                        <!--<template slot-scope="scope">-->
                            <!--<span v-if="item.prop == 'status'">-->
                                <!--<a-badge :status="scope.row.status == 0? 'default':'processing'" :text="scope.row.status ==0?'停用':'启用'"/>-->
                            <!--</span>-->
                            <!--<span v-else>-->
                                <!--{{scope.row[item.prop]}}-->
                            <!--</span>-->
                        <!--</template>-->
                    </el-table-column>
                </el-table>
                <a-pagination
                        showSizeChanger
                        :total="total"
                        class="pnstyle"
                        v-model="current"
                        :defaultPageSize="10"
                        :pageSizeOptions="['10', '20','50']"
                        @showSizeChange="clientSizeChange"
                        @change="customerPageChange"
                        size="small"
                >
                </a-pagination>
            </a-spin>
        </a-card>
    </div>
</template>
<script>
    import { yjsDrugMap, clientListData } from '@/api/login'
    export default {
        data(){
            return{
                clientData:[],
                loading:false,
                dataSource:[],
                columns:[
                    { title: '客户', prop: 'clientName' },
                    { title: '药品编码', prop: 'drugId' },
                    { title: '药品名称', prop: 'drugName' },
                    { title: '规格', prop: 'packSpec',width:100 },
                    { title: '单位', prop: 'packUnit',align: 'center',width:80 },
                    { title: '生产厂商', prop: 'factoryId' },
                    { title: '任务来源', prop: 'drugSource',align:'center',width:100,formatter:this.formatter }
                ],
                total:null,
                current:1
            }
        },
        computed: {
            list() {
                return [
                    {
                        name: '客户',
                        dataField: 'clientId',
                        type: 'select',
                        keyExpr: 'clientId',
                        valueExpr: 'clientName',
                        dataSource: this.clientData
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
            this.fetchYJSMapData();
            this.fetchClientListData();
        },
        methods:{
            //搜索
            search() {
                this.current = 1;
                let params = this.$refs.searchPanel.form.getFieldsValue()
                params.pageSize = 10;
                params.offset = 0;
                this.fetchYJSMapData(params)
            },
            //重置
            resetForm() {
                this.current = 1;
                this.$refs.searchPanel.form.resetFields()
                this.fetchYJSMapData({ pageSize: 10, offset: 0 })
            },
            customerPageChange(page,pageSize){
                let params = {};
                params.pageSize = pageSize;
                params.offset = (page-1)*pageSize;
                this.fetchYJSMapData(params)
            },
            clientSizeChange(current,size){
                this.current = 1;
                let params = {};
                params.pageSize = size;
                params.offset = 0;
                this.fetchYJSMapData(params)
            },
            drugMap(row){
                this.$router.push({
                    name:'yjsDetail',
                    params:{id:row.id}
                })
            },
            formatter(row,column){
                let source;
                switch (row.drugSource){
                    case '1':
                        source = 'SPD提交';
                        break;
                    case '2':
                        source = '采购订单';
                        break;
                    case '3':
                        source = '订单配送';
                        break;
                    default:
                        break;
                }
                return source
            },
            fetchYJSMapData(params = { pageSize: 10 , offset : 0}){
                params.statusYjs = '1';
                params.drugSource = '1';
                this.loading = true;
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
            fetchClientListData(params = {}){
                clientListData(params).then(res => {
                    if (res.code == '200') {
                        this.clientData = res.rows;
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            }
        }
    }
</script>
<style>
    .divInfo {
        width: 100%;
        height: 40px;
        border-radius: 5px;
        background-color: #E6F7FF;
        padding-left: 20px;
        padding-top: 10px;
    }

    .infoIcon {
        width: 20px;
        height: 20px;
        background-color: #108EE9;
        text-align: center;
        border-radius: 50%;
        display: inline-block;
    }

    .divInfo span {
        margin-left: 10px;
    }
</style>