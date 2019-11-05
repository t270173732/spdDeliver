<template>
    <div v-if="!subSuccess">
        <a-spin tip="加载中..." :spinning="loading">
            <a-card>
                <detail-list title="订单信息" :col="3">
                    <detail-list-item term="订单编号">{{orderInfo.orderId}}</detail-list-item>
                    <detail-list-item term="供应商">{{orderInfo.supplierName}}</detail-list-item>
                    <detail-list-item term="订单类型">{{orderInfo.orderType=='1'?'采购':'移库'}}</detail-list-item>
                    <detail-list-item term="是否加急">{{orderInfo.urgent?'是':'否'}}</detail-list-item>
                    <detail-list-item term="提交人">{{orderInfo.submitUser}}</detail-list-item>
                    <detail-list-item term="提交时间">{{orderInfo.submitTime}}</detail-list-item>
                    <detail-list-item term="到货期限">{{orderInfo.arriveTime}}</detail-list-item>
                    <detail-list-item term="客户名称">{{orderInfo.clientName}}</detail-list-item>
                </detail-list>
                <a-divider/>
                <detail-list title="配送信息" :col="3">
                    <detail-list-item term="收货人">{{orderInfo.takeUser}}</detail-list-item>
                    <detail-list-item term="联系电话">{{orderInfo.takeNumber}}</detail-list-item>
                    <detail-list-item term="收货地址">{{orderInfo.takeAddress}}</detail-list-item>
                    <detail-list-item term="备注">{{orderInfo.remark}}</detail-list-item>
                </detail-list>
                <!--<h2>订单信息</h2>-->
                <!--<a-row>-->
                    <!--<a-col span="6">订单编号：</a-col>-->
                    <!--<a-col span="6">供应商：</a-col>-->
                    <!--<a-col span="6">订单类型：</a-col>-->
                    <!--<a-col span="6">是否加急：</a-col>-->
                <!--</a-row>-->
                <!--<a-row class="margin-top-10">-->
                    <!--<a-col span="6">提交人：</a-col>-->
                    <!--<a-col span="6">提交时间：</a-col>-->
                    <!--<a-col span="6">到货期限：</a-col>-->
                    <!--<a-col span="6">客户名称：</a-col>-->
                <!--</a-row>-->
                <!--<a-divider/>-->
                <!--<h2>配送信息</h2>-->
                <!--<a-row>-->
                    <!--<a-col span="6">收货人：</a-col>-->
                    <!--<a-col span="6">联系电话：</a-col>-->
                    <!--<a-col span="12">收货地址：</a-col>-->
                <!--</a-row>-->
                <!--<a-row class="margin-top-10">备注：</a-row>-->
                <a-divider/>
                <!--<h2>订单药品</h2>-->
                <div class="title">订单药品</div>
                <a-button type="primary" @click="allRes">全部响应</a-button>
                <a-button class="margin-left-5" @click="reset">全部重置</a-button>
                <div class="margin-top-10">
                    <a-alert type="info" showIcon v-if="noResNum || noMap">
                        <span slot="message">
                            <span v-if="noResNum">还有<a>{{noResNum}}</a>个药未完全响应</span>
                            <span v-if="noMap">，还有<a class="delColor">{{noMap}}</a>个药未对码</span>
                        </span>
                    </a-alert>
                    <!--<a-alert type="error" showIcon style="margin-top: 5px" v-if="noMap">-->
                        <!--<span slot="message">-->
                            <!--还有<a>{{noMap}}</a>个药未对码，为避免数据丢失，请先对码-->
                        <!--</span>-->
                    <!--</a-alert>-->
                </div>
                <el-table
                        class="margin-top-10"
                        :data="drugData"
                        show-summary
                        style="width: 100%"
                >
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="120"
                            align="center"
                            v-if="orderInfo.status != '2'"
                    >
                        <template slot-scope="scope">
                            <a @click="editChange(scope.row,scope.$index,true)" v-if="scope.row.changedPlanNum-scope.row.difRespNum">
                                {{scope.row.isSet?'保存':'编辑'}}
                            </a>
                            <a-divider type="vertical" v-if="scope.row.changedPlanNum-scope.row.difRespNum"/>
                            <a-popconfirm v-if="!scope.row.isSet" title="确认删除吗？"
                                          @confirm="drugDel(scope.row,scope.$index)">
                                <a>删除</a>
                            </a-popconfirm>
                            <a v-else @click="editChange(scope.row,scope.$index,false)">
                                取消
                            </a>
                        </template>
                    </el-table-column>
                    <!--<el-table-column type="expand">-->
                        <!--<template slot-scope="props">-->
                            <!--<detail-list :col="4" v-if="props.row.mRatio">-->
                                <!--<detail-list-item term="转换关系">{{ props.row.maxPackRatio }}</detail-list-item>-->
                                <!--<detail-list-item term="M">{{ props.row.mRatio}}</detail-list-item>-->
                                <!--<detail-list-item term="N">{{ props.row.nRatio }}</detail-list-item>-->
                                <!--<detail-list-item term="SPD药品编码">{{ props.row.drugId }}</detail-list-item>-->
                                <!--<detail-list-item term="SPD药品名称">{{ props.row.drugName }}</detail-list-item>-->
                                <!--<detail-list-item term="SPD规格">{{ props.row.packSpec }}</detail-list-item>-->
                                <!--<detail-list-item term="SPD单位">{{ props.row.packUnit }}</detail-list-item>-->
                                <!--<detail-list-item term="SPD生产厂商">{{ props.row.factoryId }}</detail-list-item>-->
                                <!--<detail-list-item term="SPD申请数量">{{ props.row.changedPlanNum }}</detail-list-item>-->
                            <!--</detail-list>-->
                            <!--<div v-else>-->
                                <!--<a-alert type="error" showIcon>-->
                                    <!--<span slot="message">-->
                                        <!--该药品未完成对码，请先对码&nbsp;&nbsp;<a @click="drugMap(props.row)"> 立即对码>> </a>-->
                                    <!--</span>-->
                                <!--</a-alert>-->
                            <!--</div>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column
                            :show-overflow-tooltip="true"
                            :prop="item.prop"
                            :label="item.title"
                            :key="index"
                            v-for="(item,index) in drugColumns"
                            :width="item.width"
                            :align="item.align"
                            :formatter="item.formatter"
                    >
                        <template slot-scope="scope">
                            <span v-if="(item.prop == 'respNum') && scope.row.isSet">
                                <a-input-number
                                        style="width:100%"
                                        size="small"
                                        :min="0"
                                        :max="scope.row.changedPlanNum"
                                        placeholder="请输入..."
                                        v-model="selRow[item.prop]"
                                />
                            </span>
                            <span v-else-if="item.prop == 'difRespNum'">
                                <a-popover
                                        trigger="click"

                                >
                                    <template slot="content">
                                        <a-spin tip="加载中..." :spinning="popover.loading">
                                            <el-table
                                                    class="margin-top-10"
                                                    :data="popover.data"
                                                    size="small"
                                                    style="width: 500px"
                                                    border
                                            >
                                                <el-table-column
                                                        :show-overflow-tooltip="true"
                                                        :prop="item.prop"
                                                        :label="item.title"
                                                        :key="index"
                                                        v-for="(item,index) in popover.columns"
                                                        :width="item.width"
                                                        :align="item.align"
                                                >
                                                </el-table-column>
                                            </el-table>
                                            <a-pagination
                                                    :total="popover.total"
                                                    class="pnstyle"
                                                    :defaultPageSize="5"
                                                    @change="popoverPageChange"
                                                    size="small"
                                            >
                                            </a-pagination>
                                        </a-spin>
                                    </template>
                                    <a @click="getHisData(scope.row,scope.$index)">{{scope.row['difRespNum']}}</a>
                                </a-popover>
                            </span>
                            <span v-else>{{scope.row[item.prop]}}</span>
                        </template>
                    </el-table-column>
                </el-table>

                <!--<div style="text-align: center;margin-top: 50px">-->
                    <!--<a-button type="primary" :loading="suLoading">提交响应</a-button>-->
                    <!--<a-button class="margin-left-20" @click="cancle">放弃修改</a-button>-->
                <!--</div>-->
            </a-card>
        </a-spin>
        <footer-tool-bar>
            <a-button @click="cancle">{{orderInfo.status != '2'?'放弃修改':'返回'}}</a-button>
            <a-button
                    type="primary"
                    :loading="suLoading"
                    class="margin-left-5"
                    @click="submit"
                    :style="{display:display}"
            >
                提交响应
            </a-button>
        </footer-tool-bar>
        <a-modal
                title="对码"
                v-model="mapModal.visible"
                @ok="mapSubmit"
                @cancel="handleCancel"
                width=""
                centered
                :maskClosable="false"
        >
            <div class="drugContent">
                <div class="innerDiv">
                    <p>
                        <a-badge count="供" :numberStyle="{backgroundColor: '#FF6600',margin:'-2px 10px 0 0'}"/>
                        <a-select
                                ref="drugSelect"
                                placeholder="请输入..."
                                style="width:150px"
                                showSearch
                                :filterOption="false"
                                @search="searchDrug"
                                @change="handleChange"
                                :notFoundContent="mapModal.fetching ? undefined : null"
                        >
                            <a-spin v-if="mapModal.fetching" slot="notFoundContent" size="small"/>
                            <a-select-option
                                    :value='op.id'
                                    v-for="(op,index) in mapModal.dataSource"
                                    :key="index"
                            >
                                {{op.drugName}}
                            </a-select-option>
                        </a-select>
                        <a-popover
                                trigger="click"
                                v-model="mapModal.popVisible"
                                placement="rightBottom"
                        >
                            <template slot="content">
                                <a-spin tip="加载中..." :spinning="mapModal.drugLoading">
                                    <el-table
                                            class="margin-top-10"
                                            :data="mapModal.drugData"
                                            size="small"
                                            style="width: 500px"
                                            border
                                            @row-click="rowClick"
                                    >
                                        <el-table-column
                                                :show-overflow-tooltip="true"
                                                :prop="item.prop"
                                                :label="item.title"
                                                :key="index"
                                                v-for="(item,index) in mapModal.columns"
                                                :width="item.width"
                                                :align="item.align"
                                        >
                                        </el-table-column>
                                    </el-table>
                                    <a-pagination
                                            :total="mapModal.total"
                                            v-model="mapModal.current"
                                            class="pnstyle"
                                            :defaultPageSize="5"
                                            @change="pageChange"
                                            size="small"
                                    >
                                    </a-pagination>
                                </a-spin>
                            </template>
                            <a style="margin-left: 5px" @click="mapDrug">相似药品</a>
                        </a-popover>
                    </p>
                    <a-row class="marginCol">
                        <a-col span="7">药品编码:</a-col>
                        <a-col span="16">
                            <a-input size="small" :read-only="true" v-model="splData.drugId"></a-input>
                        </a-col>
                    </a-row>
                    <a-row class="marginCol">
                        <a-col span="7">生产厂商:</a-col>
                        <a-col span="16">
                            <a-input size="small" v-model="splData.factoryId"></a-input>
                        </a-col>
                    </a-row>
                    <a-row class="marginCol">
                        <a-col span="7">包装规格:</a-col>
                        <a-col span="16">
                            <a-input size="small" v-model="splData.packSpec"></a-input>
                        </a-col>
                    </a-row>
                    <a-row class="marginCol">
                        <a-col span="7">包装单位:</a-col>
                        <a-col span="16">
                            <a-input size="small" v-model="splData.packUnit"></a-input>
                        </a-col>
                    </a-row>
                    <a-row class="marginCol">
                        <a-col span="7">大包装单位:</a-col>
                        <a-col span="16">
                            <a-input size="small" v-model="splData.maxUnit"></a-input>
                        </a-col>
                    </a-row>
                    <a-row class="marginCol">
                        <a-col span="7">大包装数:</a-col>
                        <a-col span="16">
                            <a-input size="small" type="number" v-model="splData.maxPackRatio"></a-input>
                        </a-col>
                    </a-row>
                    <div class="contenFoot">
                        <span>转换系数</span>
                        <a-divider type="vertical"/>
                        <a-input-number v-model="N" :min="1" :max="100000" :defaultValue="1"
                                        @change="onNChange"/>
                    </div>
                </div>
                <div class="innerDiv marLeft10">
                    <p style="line-height: 32px">
                        <a-badge count="客" :numberStyle="{backgroundColor: '#1890FF',margin:'-2px 10px 0 0'}"/>
                        <span class="title">{{clentDate.drugName}}</span>
                    </p>
                    <p>药品编码：<span class="opacity8">{{clentDate.drugId}}</span></p>
                    <p>生产厂商：<span class="opacity8">{{clentDate.factoryId}}</span></p>
                    <p>包装规格：<span class="opacity8">{{clentDate.packSpec}}</span></p>
                    <p>包装单位：<span class="opacity8">{{clentDate.packUnit}}</span></p>
                    <p>大包装单位：<span class="opacity8">{{clentDate.maxUnit}}</span></p>
                    <p>大包装数：<span class="opacity8">{{clentDate.maxPackRatio}}</span></p>
                    <div class="contenFoot">
                        <span>转换系数</span>
                        <a-divider type="vertical"/>
                        <a-input-number
                                v-model="M"
                                :min="1"
                                :max="100000"
                                :defaultValue="1"
                                @change="onMChange"/>
                    </div>
                </div>
            </div>
        </a-modal>
    </div>
    <div v-else>
        <a-card>
            <result :is-success="true" title="响应成功">
                <template slot="action">
                    <a-button type="primary" @click="cancle">返回列表</a-button>
                    <!--<a-button class="margin-left-5">查看项目</a-button>-->
                    <!--<a-button class="margin-left-5">打印</a-button>-->
                </template>
                <div>
                    <detail-list title="订单信息" :col="3">
                        <detail-list-item term="订单编号">{{orderInfo.orderId}}</detail-list-item>
                        <detail-list-item term="供应商">{{orderInfo.supplierName}}</detail-list-item>
                        <detail-list-item term="客户名称">{{orderInfo.clientName}}</detail-list-item>
                        <detail-list-item term="订单类型">{{orderInfo.orderType=='1'?'采购':'移库'}}</detail-list-item>
                        <detail-list-item term="到货期限">{{orderInfo.arriveTime}}</detail-list-item>
                        <detail-list-item term="是否加急">{{orderInfo.urgent?'是':'否'}}</detail-list-item>
                        <detail-list-item term="提交人">{{orderInfo.submitUser}}</detail-list-item>
                        <detail-list-item term="响应时间">{{orderInfo.createTime}}</detail-list-item>
                    </detail-list>
                </div>
            </result>
        </a-card>
    </div>
</template>
<script>
    import {
        orderDetail,
        getDrugListData,
        getDrugDetail,
        similardDrugData,
        supplierMap,
        orderResSubmit,
        supplierMapShip,
        updateSupplierMapShip,
        orderDrugHis
    } from '@/api/login';
    import { getDate } from '@/utils/misc';
    import debounce from 'lodash/debounce';
    import FooterToolBar from '@/components/FooterToolbar';
    import DetailList from '@/components/tools/DetailList';
    const DetailListItem = DetailList.Item
    export default {
        data() {
            this.searchDrug = debounce(this.searchDrug, 800)
            return {
                drugColumns: [
                    { title: '药品名称', prop: 'extDrugName' },
                    { title: '规格', prop: 'spec' },
                    { title: '生产厂商', prop: 'extFactoryId' },
                    { title: '申请数量', prop: 'changedPlanNum', align: 'right', width: 100 },
                    { title: '已响应数量', prop: 'difRespNum', align: 'right', width: 100 },
                    { title: '响应数量', prop: 'respNum', align: 'right', width: 100 }
                ],
                //选中行
                selRow: null,
                loading: false,
                suLoading: false,
                drugData:[],
                orderInfo:{},
                mapModal:{
                    visible:false,
                    loading:false,
                    value:'',
                    current:1,
                    dataSource:[],
                    fetching:false,
                    drugData:[],
                    columns:[
                        { title: '药品编码', prop: 'drugId' },
                        { title: '药品名称', prop: 'drugName' },
                        { title: '规格', prop: 'packSpec' },
                        { title: '单位', prop: 'packUnit', align: 'center' },
                        { title: '生产厂商', prop: 'factoryId' }
                    ],
                    total:null,
                    drugLoading:false,
                    popVisible:false
                },
                splData:{},
                clentDate:{},
                N:1,
                M:1,
                popover:{
                    visible:[],
                    loading:false,
                    data:[],
                    columns:[
                        { title: '药品名称', prop: 'drugName' },
                        { title: '规格', prop: 'spec',width:100 },
                        { title: '生产厂商', prop: 'factoryId' },
                        { title: '响应数量', prop: 'respNum', align: 'right', width: 80 }
                    ],
                    total:null
                },
                subSuccess:false
            }
        },
        components:{
            DetailList,
            DetailListItem,
            FooterToolBar
        },
        computed:{
            noResNum(){
                let num = 0,data = this.drugData,len = data.length;
                for (let i=0 ; i<len ; i++){
                    if(data[i].changedPlanNum != data[i].difRespNum + data[i].respNum && data[i].mRatio) {
                        num++
                    }
                }
                return num
            },
            noMap(){
                let num = 0,data = this.drugData,len = data.length;
                for (let i=0 ; i<len ; i++){
                    if(!data[i].mRatio) {
                        num++
                    }
                }
                return num
            },
            display(){
                if(this.orderInfo.status == '2'){
                    return 'none';
                }else{
                    return 'inline-block'
                }
            }
        },
        mounted() {
            this.orderInit();
        },
        methods: {
            orderInit(){
                this.loading = true;
                let params = {};
                params.orderId = this.$route.params.id;
                orderDetail(params).then(res => {
                    if (res.code == '200') {
                        res.data.purchaseOrderDetailVOList.map((i)=>{
                            this.popover.visible[i] = false;
                            i.isSet = false;//给后台返回数据添加isSet标识
                            return i;
                        })
                        this.drugData = res.data.purchaseOrderDetailVOList;
                        this.orderInfo = res.data;
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
            editChange(row, index, cg) {
                //点击修改 判断是否已经保存所有操作
                for (let i of this.drugData) {
                    if (i.isSet && i.id != row.id) {
                        this.warn('请先保存当前编辑项');
                        return false;
                    }
                }
                //是否是取消操作
                if (!cg) {
                    return row.isSet = !row.isSet;
                }
                //提交数据
                if (row.isSet) {
                    this.drugData.forEach((item)=>{
                        if(item.drugId == row.drugId){
                            item.respNum = this.selRow.respNum;
                            item.isSet = false
                        }
                    })
                } else {
                    this.selRow = JSON.parse(JSON.stringify(row));
                    row.isSet = true;
                }
            },
            drugDel(row,index){
                this.drugData.splice(index,1)
            },
            fecthData() {

            },
            cancle() {
                this.$router.push({
                    name: 'orderRes'
                })
            },
            allRes(){
                let data = this.drugData,len = data.length;
                for (let i=0 ; i<len ; i++) {
                    data[i].respNum = data[i].changedPlanNum - data[i].difRespNum;
                }
            },
            reset(){
                let data = this.drugData,len = data.length;
                for (let i=0 ; i<len ; i++) {
                    data[i].respNum = 0;
                }
            },
            getHisData(row,index){
                let params = {};
                params.drugId = row.drugId;
                params.orderId = this.orderInfo.orderId;
                this.fetchDrugResHis(params);
            },
            popoverPageChange(page,pageSize){
                let params = {};
                params.drugId = this.popover.data[0].drugId;
                params.orderId = this.orderInfo.orderId;
                params.offset = (page-1)*pageSize;
                this.fetchDrugResHis(params);
            },
            drugMap(row){
                let params = {};
                params.extClass = '2';
                params.extId = this.orderInfo.clientId;
                params.drugId = row.drugId;
                this.splData = {};
                this.clentDate = {};
                if(this.$refs.drugSelect){
                    this.$refs.drugSelect.value = '';
                }
                this.fetchDrugDetail(params)
            },
            mapSubmit(){
                this.mapModal.loading = true;
                if (!this.splData.id) {
                    this.warn('请选择药品');
                    this.mapModal.loading = false;
                    return;
                }
                let params = Object.assign({}, this.splData);
                params.maxPackRatio = Number(params.maxPackRatio);
                params.drugExtId = this.clentDate.id
                params.extId = this.orderInfo.supplierId;
                params.clientId = this.orderInfo.clientId;
                params.isNew = 1;
                params.mRatio = this.M
                params.nRatio = this.N
                updateSupplierMapShip(params).then(res => {
                    if (res.code == '200') {
                        this.success('对码成功', () => {
                            this.orderInit();
                            this.mapModal.visible = false;
                            this.mapModal.loading = false
                        })
                    } else {
                        this.mapModal.loading = false
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.mapModal.loading = false
                    this.error(err)
                })
            },
            handleCancel(){
                this.mapModal.visible = false;
            },
            onNChange(val){
                if(val>1){
                    this.M = 1;
                }
            },
            onMChange(val){
                if(val>1){
                    this.N = 1;
                }
            },
            searchDrug(value){
                this.mapModal.dataSource = [];
                this.mapModal.fetching = true;
                let params = {};
                params.extClass = '1';
                params.extId = this.orderInfo.supplierId;
                params.keyword = value;
                getDrugListData(params).then(res => {
                    if (res.code == '200') {
                        this.mapModal.dataSource = res.rows;
                        this.mapModal.fetching = false
                    } else {
                        this.mapModal.fetching = false
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.mapModal.fetching = false
                    this.error(err)
                })
            },
            handleChange(value){
                Object.assign(this.mapModal, {
                    value,
                    dataSource: [],
                    fetching: false
                })
                getDrugDetail({ id: value }).then(res => {
                    if (res.code == '200') {
                        this.$refs.drugSelect.value = res.data.drugName;
                        this.splData = res.data
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            mapDrug(){
                this.mapModal.current = 1;
                this.fetchSPDDrugData(this.clentDate)
            },
            rowClick(row, column, event){
                this.splData = row;
                this.$refs.drugSelect.value = row.drugName;
                this.mapModal.popVisible = false
            },
            pageChange(page, pageSize){
                let params = this.clentDate;
                params.offset = (page - 1) * pageSize;
                this.fetchSPDDrugData(params)
            },
            //获取院内药品数据
            fetchSPDDrugData(value = {}) {
                this.mapModal.drugData = [];
                this.mapModal.drugLoading = true;
                let params = value;
                params.pageSize = value.pageSize || 5;
                params.offset = value.offset || 0;
                params.extClass = '1';
                params.extId = this.orderInfo.supplierId;
                similardDrugData(params).then(res => {
                    if (res.code == '200') {
                        this.mapModal.drugData = res.rows;
                        this.mapModal.dataSource = res.rows;
                        this.mapModal.total = res.total
                        this.mapModal.drugLoading = false
                    } else {
                        this.mapModal.drugLoading = false
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.mapModal.drugLoading = false
                    this.error(err)
                })
            },
            submit(){
                this.suLoading = true;
                // for (let i = 0, len = this.drugData.length; i < len; i++) {
                //     if(!this.drugData[i].mRatio){
                //         this.warn('还有药品未对码');
                //         this.suLoading = false;
                //         return false;
                //     }
                // }
                if(this.noMap){
                    this.warn('存在未对码药品，不能提交响应!');
                    this.suLoading = false;
                    return;
                }
                let params = {};
                params.orderId = this.orderInfo.orderId;
                params.purchaseOrderDetailVOList = this.drugData;
                orderResSubmit(params).then(res => {
                    if (res.code == '200') {
                        this.orderInfo.createTime = getDate(new Date(),'year');
                        this.subSuccess = true
                    } else {
                        this.suLoading = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.suLoading = false;
                    this.error(err)
                })
            },
            //药品详情
            fetchDrugDetail(params){
                getDrugDetail(params).then(res => {
                    if (res.code == '200') {
                        if(res.data){
                            this.clentDate = res.data;
                            this.mapModal.visible = true;
                        }else {
                            this.warn('后台数据问题!')
                        }
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            //药品响应历史
            fetchDrugResHis(val){
                this.popover.loading = true;
                let params = val;
                params.pageSize = val.pageSize || 5;
                params.offset = val.offset || 0;
                orderDrugHis(params).then(res => {
                    if (res.code == '200') {
                        this.popover.data = res.rows;
                        this.popover.total = res.total;
                        this.popover.loading = false;
                    } else {
                        this.popover.loading = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.popover.loading = false;
                    this.error(err)
                })
            },
        }
    }
</script>
<style lang="less" scoped>
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
    .title {
        color: rgba(0, 0, 0, .85);
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 16px;
        margin-left: 0;
    }
</style>