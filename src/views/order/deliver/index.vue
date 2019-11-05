<template>
    <div>
        <a-card>
            <a-tabs v-model="tabValue">
                <a-tab-pane tab="待配送" key="stay"  :forceRender="true">
                    <Searchpanel ref="stayPanel" :list="stayList">
                        <div slot="control">
                            <a-button type="primary" @click="staySearch">查询</a-button>
                            <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
                        </div>
                    </Searchpanel>
                    <a-spin tip="加载中..." :spinning="stayLoading">
                        <el-table
                                class="margin-top-10"
                                :data="resData"
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
                                    <a @click="deliver(scope.row)">配送</a>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    :show-overflow-tooltip="true"
                                    :prop="item.prop"
                                    :label="item.title"
                                    :key="index"
                                    v-for="(item,index) in resColumns"
                                    :width="item.width"
                                    :align="item.align"
                            >
                                <template slot-scope="scope">
                                    <span v-if="item.prop == 'urgent'">
                                        <a-badge :status="scope.row.urgent == 0? 'default':'processing'" :text="scope.row.urgent ==0?'否':'是'"/>
                                    </span>
                                    <span v-else-if="item.prop == 'status'" v-html="setStatus(scope.row.status)"></span>
                                    <span v-else>
                                        {{scope.row[item.prop]}}
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <a-pagination
                                :total="total"
                                class="pnstyle"
                                v-model="current"
                                :defaultPageSize="10"
                                showSizeChanger
                                @change="pageChange"
                                :pageSizeOptions="['10', '20','50']"
                                @showSizeChange="pageSizeChange"
                                size="small"
                        >
                        </a-pagination>
                    </a-spin>
                </a-tab-pane>
                <a-tab-pane tab="配送" key="deliver"  :forceRender="true">
                    <Searchpanel ref="deliverPanel" :list="deliverList">
                        <div slot="control">
                            <a-button type="primary" @click="deliverSearch">查询</a-button>
                            <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
                        </div>
                    </Searchpanel>
                    <!--<a-card>-->
                        <div style="text-align: right" class="margin-top-10">
                            <a-radio-group v-model="value" @change="onChange">
                                <a-radio-button value="1">全部</a-radio-button>
                                <a-radio-button value="2">发货</a-radio-button>
                                <a-radio-button value="3">收货</a-radio-button>
                                <a-radio-button value="4">拒收</a-radio-button>
                            </a-radio-group>
                        </div>
                        <a-spin tip="加载中..." :spinning="deliverLoading">
                            <el-table
                                    ref="singleTable"
                                    class="margin-top-10"
                                    :data="deliverData"
                                    border
                                    style="width: 100%"
                                    highlight-current-row
                                    @current-change="handleCurrentChange"
                            >
                                <el-table-column
                                        :show-overflow-tooltip="true"
                                        :prop="item.prop"
                                        :label="item.title"
                                        :key="index"
                                        v-for="(item,index) in deliverColumns"
                                        :width="item.width"
                                        :align="item.align"
                                >
                                </el-table-column>
                            </el-table>
                            <a-pagination
                                    :total="deliverTotal"
                                    class="pnstyle"
                                    v-model="deliverCurrent"
                                    :defaultPageSize="10"
                                    showSizeChanger
                                    @change="deliverPageChange"
                                    :pageSizeOptions="['10', '20','50']"
                                    @showSizeChange="deliverPageSizeChange"
                                    size="small"
                            >
                            </a-pagination>
                        </a-spin>
                    <a-spin tip="加载中..." :spinning="drugLoading">
                        <el-table
                                class="margin-top-10"
                                :data="drugData"
                                border
                                style="width: 100%"
                        >
                            <el-table-column
                                    :show-overflow-tooltip="true"
                                    :prop="item.prop"
                                    :label="item.title"
                                    :key="index"
                                    v-for="(item,index) in drugColumns"
                                    :width="item.width"
                                    :align="item.align"
                            >
                                <template slot-scope="scope">
                                    <span v-if="item.prop === 'isbox'">{{scope.row[item.prop] === '1'?'整箱':'拼箱'}}</span>
                                    <span v-else>
                                            {{scope.row[item.prop]}}
                                        </span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <a-pagination
                                :total="drugTotal"
                                class="pnstyle"
                                v-model="drugCurrent"
                                :defaultPageSize="10"
                                showSizeChanger
                                @change="drugPageChange"
                                :pageSizeOptions="['10', '20','50']"
                                @showSizeChange="drugPageSizeChange"
                                size="small"
                        >
                        </a-pagination>
                    </a-spin>
                    <!--</a-card>-->
                </a-tab-pane>
            </a-tabs>
        </a-card>
    </div>
</template>
<script>
    import { orderStayDeliver, deliverData, deliverDrugData, clientListData } from '@/api/login'
    export default {
        data(){
            return{
                tabValue:'stay',
                value:'1',
                clientData:[],
                resData:[],
                resColumns:[
                    { title: '响应单号', prop: 'responseId' },
                    { title: '客户', prop: 'clientName' },
                    { title: '收货人', prop: 'takeUser',width:100 },
                    { title: '收货地址', prop: 'takeAddress' },
                    { title: '加急订单', prop: 'urgent',width:80,align:'center' },
                    { title: '状态', prop: 'status',width:80,align:'center' },
                    { title: '响应时间', prop: 'submitTime',width:150 },
                ],
                stayLoading:false,
                total:null,
                current:1,
                deliverLoading:false,
                deliverTotal:null,
                deliverCurrent:1,
                selectData:{},
                deliverData:[],
                deliverColumns:[
                    { title: '装车单号', prop: 'loadingId',width:200 },
                    { title: '配送单号', prop: 'shippingId' },
                    { title: '客户', prop: 'clientName' },
                    { title: '收货人', prop: 'taker',width:100 },
                    { title: '收货地址', prop: 'takerAddress' },
                    { title: '发货时间', prop: 'shippingTime',width:150 },
                    { title: '配送时间', prop: 'deliveryTime',width:150 },
                    // { title: '状态', prop: 'status',align:'center',width:80 },
                ],
                drugLoading:false,
                drugData:[],
                drugColumns:[
                    { title: '药品名称', prop: 'drugName' },
                    { title: '规格', prop: 'spec' },
                    { title: '单位', prop: 'unit',align:'center',width:80 },
                    { title: '厂商', prop: 'factoryId' },
                    { title: '件数', prop: 'packingNum',align:'right',width:80 },
                    { title: '每箱数量', prop: 'packingQuantity',align:'right',width:80 },
                    { title: '数量', prop: 'quantity',align:'right',width:80 },
                    { title: '装箱类型', prop: 'isbox',align:'center',width:80},
                    { title: '装箱条码', prop: 'packingNo'},
                ],
                drugTotal:null,
                drugCurrent:1
            }
        },
        computed: {
            stayList(){
                return [
                    { name: '响应单号', dataField: 'responseId', type: 'text' },
                    { name: '收货人', dataField: 'takeUser', type: 'text' },
                    { name: '收货地址', dataField: 'takeAddress', type: 'text' },
                    { name: '订单单号', dataField: 'clientOrderId', type: 'text' },
                    { name: '客户', dataField: 'clientKeyword', type: 'text' },
                    { name: '药品名称', dataField: 'drugName', type: 'text' },
                    {
                        name: '是否加急',
                        dataField: 'urgent',
                        type: 'select',
                        keyExpr: 'id',
                        valueExpr: 'text',
                        dataSource: this.enum.yesNo
                    },
                    {
                        name: '状态',
                        dataField: 'status',
                        type: 'select',
                        keyExpr: 'id',
                        valueExpr: 'text',
                        dataSource: [{id:'1',text:'响应'},{id:'5',text:'部分配送'},]
                    }
                ]
            },
            deliverList() {
                return [
                    { name: '配送单号', dataField: 'shippingId', type: 'text' },
                    { name: '装车单号', dataField: 'loadingId', type: 'text' },
                    { name: '药品名称', dataField: 'drugName', type: 'text' },
                    { name: '收货人', dataField: 'taker', type: 'text' },
                    { name: '收货地址', dataField: 'takerAddress', type: 'text' },
                    { name: '配送时间', dataField: 'operateTime', type: 'range-picker' },
                    { name: '订单单号', dataField: 'orderId', type: 'text' },
                ]
            },
            roleId(){
                return this.$store.state.user.roleId
            }
        },
        mounted(){
            this.fetchClientList();
            this.fetchResData();
            this.fetchDeliverData();
        },
        methods:{
            staySearch(){
                this.current = 1;
                let params = this.$refs.stayPanel.form.getFieldsValue();
                if(params.status){
                    params.multipleStatus = [params.status]
                }
                this.fetchResData(params);
            },
            deliverSearch(){
                this.deliverCurrent = 1;
                let params = this.$refs.deliverPanel.form.getFieldsValue();
                if(params.operateTime){
                    params.operateTime = [params.operateTime[0].format('YYYY-MM-DD'),params.operateTime[1].format('YYYY-MM-DD')];
                }
                if(this.value !== '1'){
                    params.status = this.value
                }
                this.fetchDeliverData(params);
            },
            resetForm(){
                if(this.tabValue === 'stay'){
                    this.current = 1;
                    this.$refs.stayPanel.form.resetFields();
                    this.fetchResData();
                }else{
                    this.deliverCurrent = 1;
                    this.$refs.deliverPanel.form.resetFields();
                    if(this.value !== '1'){
                        this.fetchDeliverData({status:this.value});
                    }else{
                        this.fetchDeliverData();
                    }
                }
            },
            setStatus(value){
                let text = '';
                switch (value) {
                    case '1':
                        text = '响应';
                        break;
                    case '5':
                        text = '部分响应'
                        break;
                    default:
                        break;
                }
                return text;
            },
            setDeliverStatus(value){
                let status = ['响应','新建','发货','收货','拒收'];
                return status[value]
            },
            tabChange(){

            },
            deliver(row){
                this.$router.push({
                    name:'resDetail',
                    params:{ id:row.responseId }
                })
            },
            pageChange(page,size){
                let params = this.$refs.stayPanel.form.getFieldsValue();
                params.offset = (page-1)*size;
                this.fetchResData(params)
            },
            pageSizeChange(current,size){
                this.current = 1;
                let params = this.$refs.stayPanel.form.getFieldsValue();
                params.pageSize = size;
                this.fetchResData(params)
            },
            deliverPageChange(page,size){
                let params = this.$refs.deliverPanel.form.getFieldsValue();
                if(params.operateTime){
                    params.operateTime = [params.operateTime[0].format('YYYY-MM-DD'),params.operateTime[1].format('YYYY-MM-DD')];
                }
                params.offset = (page-1)*size;
                if(this.value !== '1'){
                    params.status = this.value
                }
                this.fetchDeliverData(params)
            },
            deliverPageSizeChange(current,size){
                this.deliverCurrent = 1;
                let params = this.$refs.deliverPanel.form.getFieldsValue();
                if(params.operateTime){
                    params.operateTime = [params.operateTime[0].format('YYYY-MM-DD'),params.operateTime[1].format('YYYY-MM-DD')];
                }
                params.pageSize = size;
                if(this.value !== '1'){
                    params.status = this.value
                }
                this.fetchDeliverData(params)
            },
            drugPageChange(page,size){
                let params = {};
                params.shippingId = this.selectData.shippingId;
                params.offset = (page-1)*size;
                this.fetchDeliverDrugData(params)
            },
            drugPageSizeChange(current,size){
                this.drugCurrent = 1;
                let params = {};
                params.shippingId = this.selectData.shippingId;
                params.pageSize = size;
                this.fetchDeliverDrugData(params)
            },
            handleCurrentChange(val) {
                if(val){
                    this.selectData = val;
                    let params = {};
                    params.shppingId = val.shippingId;
                    this.fetchDeliverDrugData(params)
                }else{
                    this.drugData = []
                }
            },
            onChange(e){
                this.deliverCurrent = 1;
                let params = this.$refs.deliverPanel.form.getFieldsValue();
                if(params.operateTime){
                    params.operateTime = [params.operateTime[0].format('YYYY-MM-DD'),params.operateTime[1].format('YYYY-MM-DD')];
                }
                if(e.target.value !== '1'){
                    params.status = e.target.value
                }
                this.fetchDeliverData(params)
            },
            fetchResData(value = {}){
                this.stayLoading = true;
                let params = value;
                params.pageSize = value.pageSize || 10;
                params.offset = value.offset || 0;
                params.multipleStatus = ['1','5'];
                params.roleId = this.roleId;
                orderStayDeliver(params).then(res => {
                    if (res.code === '200') {
                        this.resData = res.rows;
                        this.total = res.total;
                        this.stayLoading = false;
                    } else {
                        this.stayLoading = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.stayLoading = false;
                    this.error(err)
                })
            },
            // 默认选中
            setCurrent() {
                this.$refs.singleTable.setCurrentRow(this.deliverData[0])
            },
            fetchDeliverData(value = {}){
                this.deliverLoading = true;
                let params = value;
                params.pageSize = value.pageSize || 10;
                params.offset = value.offset || 0;
                params.roleId = this.roleId;
                deliverData(params).then(res => {
                    if (res.code === '200') {
                        this.deliverData = res.rows;
                        this.deliverTotal = res.total;
                        this.setCurrent();
                        this.deliverLoading = false;
                    } else {
                        this.deliverLoading = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.deliverLoading = false;
                    this.error(err)
                })
            },
            fetchDeliverDrugData(value = {}){
                this.drugLoading = true;
                let params = value;
                params.pageSize = value.pageSize || 10;
                params.offset = value.offset || 0;
                deliverDrugData(params).then(res => {
                    if (res.code === '200') {
                        this.drugData = res.rows;
                        this.drugTotal = res.total;
                        this.drugLoading = false;
                    } else {
                        this.drugLoading = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.drugLoading = false;
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