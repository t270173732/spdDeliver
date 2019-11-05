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
                        :data="orderData"
                        style="width: 100%"
                >
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="50"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <a @click="response(scope.row)" v-if="scope.row.status === '2'">查看</a>
                            <a @click="response(scope.row)" v-else>响应</a>
                        </template>
                    </el-table-column>
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <detail-list :col="4">
                                <detail-list-item term="响应人">{{ props.row.createUser }}</detail-list-item>
                                <detail-list-item term="采购类型">{{ props.row.purchase?'线上':'线下'}}</detail-list-item>
                                <detail-list-item term="响应时间">{{ props.row.createTime }}</detail-list-item>
                                <detail-list-item term="收货人">{{ props.row.takeUser }}</detail-list-item>
                                <detail-list-item term="联系电话">{{ props.row.takeNumber }}</detail-list-item>
                                <detail-list-item term="收货地址">{{ props.row.takeAddress }}</detail-list-item>
                            </detail-list>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :show-overflow-tooltip="true"
                            :prop="item.prop"
                            :label="item.title"
                            :key="index"
                            v-for="(item,index) in orderColumns"
                            :width="item.width"
                            :align="item.align"
                            :formatter="item.formatter"
                    >
                        <template slot-scope="scope">
                            <span v-if="item.prop == 'mappingType'" v-html="setMapType(scope.row.mappingType)"></span>
                            <span v-else-if="item.prop == 'varietyNumber'">
                                <a-badge :count="scope.row.varietyNumber" :numberStyle="{backgroundColor: '#1890FF'} "
                                         v-if="scope.row.varietyNumber"/>
                                <a-badge showZero :count="scope.row.varietyNumber"
                                         :numberStyle="{backgroundColor: '#999999'} " v-else/>
                            </span>
                            <span v-else-if="item.prop == 'status'" v-html="setStatus(scope.row.status)"></span>
                            <span v-else-if="item.prop == 'orderType'" v-html="setOrderType(scope.row.orderType)"></span>
                            <span v-else-if="item.prop == 'urgent'">
                                <a-badge :status="scope.row.urgent == 0? 'default':'processing'" :text="scope.row.urgent ==0?'否':'是'"/>
                            </span>
                            <span v-else>
                                {{scope.row[item.prop]}}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <a-pagination
                        showSizeChanger
                        :total="pageTotal"
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
    import { orderRes, clientListData } from '@/api/login';
    import DetailList from '@/components/tools/DetailList';
    const DetailListItem = DetailList.Item
    export default {
        data(){
            return{
                clientData:[],
                supplierData:[],
                loading:false,
                orderData:[],
                pageTotal:null,
                current:1,
                orderColumns:[
                    { title: '订单编号', prop: 'orderId',width:150 },
                    { title: '客户名称', prop: 'clientName' },
                    { title: '供应商', prop: 'supplierName' },
                    { title: '订单类型', prop: 'orderType', align: 'center',width:100 },
                    { title: '是否加急', prop: 'urgent',align: 'center',width:80 },
                    { title: '到货期限', prop: 'arriveTime',width:150 },
                    { title: '单据状态', prop: 'status',align: 'center',width:80 },
                    { title: '单据品种数', prop: 'varietyNumber',align: 'center',width:100 },
                    // { title: '对码状态', prop: 'mappingType', align: 'center', width: 80, }
                ]
            }
        },
        components:{
            DetailList,
            DetailListItem
        },
        computed: {
            list() {
                return [
                    { name: '订单号', dataField: 'orderId', type: 'text' },
                    {
                        name: '客户',
                        dataField: 'clientKeyword',
                        type: 'text'
                    },
                    {
                        name: '订单类型',
                        dataField: 'orderType',
                        type: 'select',
                        keyExpr: 'id',
                        valueExpr: 'text',
                        dataSource: this.enum.orderType
                    },
                    {
                        name: '是否加急',
                        dataField: 'urgent',
                        type: 'select',
                        keyExpr: 'id',
                        valueExpr: 'text',
                        dataSource: this.enum.yesNo
                    },
                    { name: '药品名称', dataField: 'drugName', type: 'text' },
                    { name: '供应商', dataField: 'supplierKeyword', type: 'text' },
                    { name: '到货期限', dataField: 'arriveTime', type: 'range-picker' },
                    { name: '响应时间', dataField: 'createTime', type: 'range-picker' },
                    {
                        name: '状态',
                        dataField: 'multipleStatus',
                        mode:'multiple',
                        type: 'select',
                        keyExpr: 'id',
                        valueExpr: 'text',
                        dataSource: this.enum.orderStatus
                    }
                ]
            },
            roleId(){
                return this.$store.state.user.roleId
            }
        },
        mounted(){
            this.fetchOrderRes();
            this.fetchClientList();
        },
        methods:{
            getFormData(){
                let params = this.$refs.searchPanel.form.getFieldsValue();
                if(params.createTime){
                    params.createTime = [params.createTime[0].format('YYYY-MM-DD'),params.createTime[1].format('YYYY-MM-DD')];
                }
                if(params.arriveTime){
                    params.arriveTime = [params.arriveTime[0].format('YYYY-MM-DD'),params.arriveTime[1].format('YYYY-MM-DD')];
                }
                return params
            },
            //搜索
            search() {
                this.current = 1;
                let params = this.getFormData();
                this.fetchOrderRes(params);
            },
            //重置
            resetForm() {
                this.current = 1;
                this.$refs.searchPanel.form.resetFields();
                this.fetchOrderRes();
            },
            response(row){
                this.$router.push({
                    name:'orderResInfo',
                    params:{id:row.orderId}
                })
            },
            setMapType(value){
                if(value<0){
                    return '未对码'
                }else if(value >0){
                    return '部分对码'
                }else{
                    return '已对码'
                }
            },
            setStatus(value){
                let status = ['下单','响应','部分响应'];
                return status[value-1]
            },
            setOrderType(value){
                let arr = ['采购','移库'];
                return arr[value-1]
            },
            pageChange(page,size){
                let params = this.getFormData();
                params.offset = (page-1)*size;
                this.fetchOrderRes(params)
            },
            sizeChange(current,size){
                this.current = 1;
                let params = this.getFormData();
                params.pageSize = size;
                this.fetchOrderRes(params)
            },
            fetchOrderRes(val = {}){
                this.loading = true;
                let params = val;
                params.pageSize = val.pageSize || 10;
                params.offset = val.offset || 0;
                params.roleId = this.roleId;
                orderRes(params).then(res => {
                    if (res.code == '200') {
                        this.orderData = res.rows;
                        this.pageTotal = res.total;
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
            fetchClientList(){
                clientListData({}).then(res => {
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