<style scoped>
    @import "index.css";
</style>
<template>
    <div>
        <a-card>
            <Searchpanel ref="searchPanel" :list="list">
                <div slot="control">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
                </div>
            </Searchpanel>
            <a-button type="primary" class="margin-top-10" @click="exporDrug">导入药品</a-button>
            <a-button class="margin-left-5">下载模板</a-button>
            <a-spin tip="加载中..." :spinning="drugLoading">
                <el-table
                        class="margin-top-10"
                        ref="singleTable"
                        :data="drugData"
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
                            v-for="(item,index) in drugColumns"
                            :width="item.width"
                            :align="item.align"
                    >
                        <template slot-scope="scope">
                            <span v-if="item.prop == 'status'">
                                <a-badge :status="scope.row.mappingNum == 0? 'default':'processing'"
                                         :text="scope.row.mappingNum ==0?'未对码':'已对码'"/>
                            </span>
                            <span v-else-if="item.prop == 'mappingNum'">
                                <a-badge showZero :count="scope.row.mappingNum" :numberStyle="{backgroundColor: scope.row.mappingNum?'#1890FF':'#999999'} "/>
                            </span>
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
                        @showSizeChange="drugSizeChange"
                        size="small"
                >
                </a-pagination>
            </a-spin>
            <h2>对码关系</h2>
            <a-divider/>
            <a-alert type="info" showIcon v-if="selectRowData.drugId">
                <span slot="message">
                    【{{selectRowData.drugId}}】&nbsp;{{selectRowData.drugName}}/{{selectRowData.packSpec}}/{{selectRowData.packUnit}}/{{selectRowData.factoryId}}
                </span>
            </a-alert>
            <a-spin tip="加载中..." :spinning="clientLoading">
                <el-table
                        class="margin-top-10"
                        :data="customerData"
                        style="width: 100%"
                        border
                >
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="150"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <a @click="editShip(scope.row)">编辑</a>
                            <a-divider type="vertical"/>
                            <a @click="history(scope.row)">历史记录</a>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :show-overflow-tooltip="true"
                            :prop="item.prop"
                            :label="item.title"
                            :key="index"
                            v-for="(item,index) in customerColumns"
                            :width="item.width"
                            :align="item.align"
                            :formatter="item.formatter"
                    >
                        <!--<template slot-scope="scope">-->
                            <!--<span v-if="item.prop == 'status'">-->
                                <!--<a-badge :status="scope.row.status == 0? 'default':'processing'"-->
                                         <!--:text="scope.row.status ==0?'停用':'启用'"/>-->
                            <!--</span>-->
                            <!--<span v-else>-->
                                <!--{{scope.row[item.prop]}}-->
                            <!--</span>-->
                        <!--</template>-->
                    </el-table-column>
                </el-table>
                <div class="table-add-row margin-top-10" @click="addShip">
                    <span>+ 新增对码关系</span>
                </div>
            </a-spin>
        </a-card>
        <a-modal
                title="新建对码关系"
                v-model="modal.visible"
                okText="提交"
                @ok="submit"
                :confirmLoading="modal.loading"
                @cancel="handleCancel"
                width=""
                centered
                :maskClosable="false"
        >
            <div class="mapContent">
                <a-form class="marginTop" :form="form">
                    <a-form-item
                            label="客户"
                            :label-col="{ span: 6 }"
                            :wrapper-col="{ span: 12 }"
                    >
                        <a-select
                                :disabled="modal.disabled"
                                v-decorator="['clientId']"
                                placeholder="请选择"
                                @change="clientSelectChange"
                        >
                            <a-select-option :value="item.clientId" v-for="(item,index) in modal.clientData"
                                             :key="index">
                                {{item.clientName}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                            class="marginTop"
                            label="药品"
                            :label-col="{ span: 6 }"
                            :wrapper-col="{ span: 12 }"
                    >
                        <a-select
                                v-decorator="['drugId']"
                                showSearch
                                placeholder="请选择"
                                optionLabelProp="title"
                                :filterOption="false"
                                @search="fetchDrugList"
                                @change="handleSelectChange"
                                :notFoundContent="modal.fetching ? undefined : null"
                        >
                            <a-spin v-if="modal.fetching" slot="notFoundContent" size="small"/>
                            <a-select-option
                                    :value="item.drugId"
                                    v-for="(item,index) in modal.copyData"
                                    :key="index"
                                    :title="item.drugName"
                            >
                                <!--{{item.drugName}}-->
                                <span v-html="item.text" class="search-item-title"></span>
                                <span class="search-item-info">{{item.packSpec}}/{{item.packUnit}}</span>
                                <span class="search-item-info">{{item.factoryId}}</span>
                            </a-select-option>
                            <a-select-option disabled key="all">
                                <a @click="checkAll" v-if="modal.drugData.length>10&&!allResult">查看所有结果</a>
                                <a-divider v-else class="bottom-text">我也是有底线的</a-divider>
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-form>
                <a-popover
                        trigger="click"
                        v-model="popover.visible"
                        placement="rightBottom"
                >
                    <template slot="content">
                        <a-spin tip="加载中..." :spinning="drugLoading">
                            <el-table
                                    class="margin-top-10"
                                    :data="popover.drugData"
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
                                        v-for="(item,index) in popover.drugColumns"
                                        :width="item.width"
                                        :align="item.align"
                                >
                                </el-table-column>
                            </el-table>
                            <a-pagination
                                    :total="popover.total"
                                    class="pnstyle"
                                    :defaultPageSize="5"
                                    @change="popPageChange"
                                    size="small"
                            >
                            </a-pagination>
                        </a-spin>
                    </template>
                    <a class="like" @click="mapDrug">相似药品</a>
                </a-popover>
                <div class="drugContent">
                    <div class="innerDiv">
                        <p>
                            <a-badge count="供" :numberStyle="{backgroundColor: '#FF6600',margin:'-2px 0 0 0'}"/>
                            <span class="title">{{splData.drugName}}</span></p>
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
                                <a-input size="small" type="number" v-model="splData.maxRatio"></a-input>
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
                        <p>
                            <a-badge count="客" :numberStyle="{backgroundColor: '#1890FF',margin:'-2px 0 0 0'}"/>
                            <span class="title">{{clentDate.drugName}}</span></p>
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
            </div>
        </a-modal>
        <a-modal
                title="对码历史记录"
                v-model="hisModal.visible"
                width=""
                :footer="null"
                :centered="true"
                :maskClosable="true"
        >
            <div style="width: 900px">
                <a-spin tip="加载中..." :spinning="hisModal.hisLoading">
                    <el-table
                            class="margin-top-10"
                            :data="hisModal.historyData"
                            border
                            size="small"
                            style="width: 100%"
                    >
                        <el-table-column
                                :show-overflow-tooltip="true"
                                :prop="item.prop"
                                :label="item.title"
                                :key="index"
                                v-for="(item,index) in customerColumns"
                                :width="item.width"
                                :align="item.align"
                                :formatter="item.formatter"
                        >
                            <!--<template slot-scope="scope">-->
                                <!--<span v-if="item.prop == 'typeRelate'">-->
                                    <!--<a-badge :status="scope.row.typeRelate == 1? 'default':'processing'"-->
                                             <!--:text="scope.row.typeRelate ==1?'新增':'修改'"/>-->
                                <!--</span>-->
                                <!--<span v-else>-->
                                    <!--{{scope.row[item.prop]}}-->
                                <!--</span>-->
                            <!--</template>-->
                        </el-table-column>
                    </el-table>
                    <a-pagination
                            :total="hisModal.total"
                            class="pnstyle"
                            :defaultPageSize="10"
                            showSizeChanger
                            @change="hisPageChange"
                            @showSizeChange="hisSizeChange"
                            size="small"
                    >
                    </a-pagination>
                </a-spin>
            </div>
        </a-modal>
        <a-modal
                title="导入药品"
                v-model="exModal.visible"
                okText="提交"
                centered
                :maskClosable="false"
        >
            <div style="text-align: center">
                <p>
                    选择供应商：
                    <a-select
                            style="width:250px"
                            v-model="exModal.supplierId"
                    >
                        <a-select-option
                                v-for="(item,index) in exModal.supplierList"
                                :value="item.supplierId"
                                :key="index"
                        >
                            {{item.supplierName}}
                        </a-select-option>
                    </a-select>
                </p>
                <a-upload
                        :fileList="fileList"
                        :beforeUpload="beforeUpload"
                        :remove="handleRemove"
                        accept=".xls,.xlsx"
                >
                    <a-button :disabled="fileList.length == 1">
                        <a-icon type="upload"/>
                        选择文件
                    </a-button>
                </a-upload>
            </div>
            <template slot="footer">
                <a-button key="back" @click="handleCancel">取消</a-button>
                <a-button key="submit" type="primary" :loading="exModal.loading" @click="handleExport">
                    导入
                </a-button>
            </template>
        </a-modal>
    </div>
</template>
<script>
    import {
        supplierDrugData,
        getSupplierList,
        supplierDrugMapShip,
        supplierByRole,
        getDrugDetail,
        clientListData,
        similardDrugData,
        getDrugListByClient,
        updateSupplierMapShip,
        mapHistory
    } from '@/api/login';
    import debounce from 'lodash/debounce';
    import { pinyinMatch } from '@/utils/misc';

    export default {
        data() {
            this.fetchDrugList = debounce(this.fetchDrugList, 800);
            return {
                supplierData: [],
                drugLoading: false,
                drugData: [],
                drugColumns: [
                    {
                        title: '供应商',
                        prop: 'supplierName',
                        width: 300
                    },
                    { title: '药品编码', prop: 'drugId', width: 100 },
                    { title: '对码关系', prop: 'mappingNum', align: 'center', width: 80 },
                    { title: '药品名称', prop: 'drugName' },
                    { title: '规格', prop: 'packSpec', width: 200 },
                    { title: '单位', prop: 'packUnit', align: 'center', width: 50 },
                    { title: '生产厂商', prop: 'factoryId', width: 200 },
                    { title: '大包装单位', prop: 'maxUnit', align: 'center', width: 100 },
                    { title: '状态', prop: 'status', align: 'center', width: 80 }
                ],
                total: 0,
                current:1,
                selectRowData: {},
                clientLoading: false,
                customerData: [],
                customerColumns: [
                    { title: '客户', prop: 'clientName' },
                    { title: '客户药品编码', prop: 'drugId' },
                    { title: '客户药品名称', prop: 'drugName' },
                    { title: '生产厂商', prop: 'factoryId' },
                    { title: '包装规格', prop: 'packSpec' },
                    { title: '包装单位', prop: 'packUnit', align: 'center',width:80 },
                    { title: '操作人', prop: 'username',width:100 },
                    { title: '操作时间', prop: 'newdate',width:150 },
                    { title: '状态', prop: 'typeRelate', align: 'center', width: 80,formatter:this.formatter }
                ],
                pageTotal: 0,
                modal: {
                    visible: false,
                    loading: false,
                    supplierData: {},
                    clientId:null,
                    clientData: [],
                    drugData: [],
                    copyData:[],
                    fetching: false,
                    disabled:false,
                    isNew:1,
                    erpId:null,
                    value:''
                },
                splData: {},
                clentDate: {},
                form: this.$form.createForm(this),
                hisModal: {
                    visible: false,
                    historyData: [],
                    hisLoading:false,
                    // columns: [
                    //     { title: '客户', prop: 'clientName' },
                    //     { title: '客户药品编码', prop: '' },
                    //     { title: '客户药品名称', prop: '' },
                    //     { title: '生产厂商', prop: '' },
                    //     { title: '包装规格', prop: 'packSpec' },
                    //     { title: '包装单位', prop: 'packUnit', align: 'center' },
                    //     { title: '操作人', prop: '' },
                    //     { title: '操作时间', prop: '' },
                    //     { title: '状态', prop: 'status', align: 'center', width: 80 }
                    // ],
                    total: 0
                },
                M: 1,
                N: 1,
                //相似药品弹出框
                popover: {
                    visible: false,
                    drugLoading: false,
                    drugData: [],
                    drugColumns: [
                        { title: '药品编码', prop: 'drugId' },
                        { title: '药品名称', prop: 'drugName' },
                        { title: '规格', prop: 'packSpec' },
                        { title: '单位', prop: 'packUnit', align: 'center' },
                        { title: '生产厂商', prop: 'factoryId' }
                    ],
                    total: 0
                },
                //导入modal
                exModal: {
                    visible: false,
                    loading: false,
                    supplierId: null,
                    supplierList: []
                },
                fileList: [],
                allResult:false
            }
        },
        computed: {
            list() {
                return [
                    {
                        name: '供应商',
                        dataField: 'extId',
                        type: 'select',
                        keyExpr: 'supplierId',
                        valueExpr: 'supplierName',
                        dataSource: this.supplierData
                    },
                    { name: '药品名称', dataField: 'drugName', type: 'text' },
                    { name: '生产厂商', dataField: 'factoryId', type: 'text' },
                    {
                        name: '状态',
                        dataField: 'mapStatus',
                        type: 'select',
                        keyExpr: 'id',
                        valueExpr: 'text',
                        dataSource: this.enum.mapStatus
                    }
                ]
            },
            roleId() {
                return this.$store.state.user.roleId
            },
        },
        mounted() {
            this.fetchSupplierDrugData();
            this.fetchSupplierList()
        },
        methods: {
            //搜索
            search() {
                this.current = 1;
                let params = this.$refs.searchPanel.form.getFieldsValue();
                params.pageSize = 10;
                params.offset = 0;
                this.fetchSupplierDrugData(params)
            },
            //重置
            resetForm() {
                this.current = 1;
                this.$refs.searchPanel.form.resetFields();
                this.fetchSupplierDrugData()
            },
            //供应商药品网格选中变化联动关系
            handleCurrentChange(val) {
                if (val) {
                    this.selectRowData = val;
                    let params = {};
                    params.extId = val.extId;
                    params.drugId = val.drugId;
                    this.fetchMapShip(params)
                } else {
                    this.customerData = []
                }
            },
            //供应商药品网格页码变化
            pageChange(page, pageSize) {
                let params = this.$refs.searchPanel.form.getFieldsValue();
                params.pageSize = pageSize;
                params.offset = (page - 1) * pageSize;
                this.fetchSupplierDrugData(params)
            },
            drugSizeChange(current,pageSize){
                this.current = 1;
                let params = this.$refs.searchPanel.form.getFieldsValue();
                params.pageSize = pageSize;
                params.offset = 0;
                this.fetchSupplierDrugData(params)
            },
            //历史记录
            history(row) {
                this.fetchMapHistory({mapId:row.id});
                this.hisModal.visible = true;
            },
            customerPageChange() {

            },
            formatter(row){
                let val = ['新建','修改'];
                return val[Number(row.typeRelate)-1]
            },
            //新增对码关系
            addShip() {
                this.modal.disabled = false;
                this.modal.isNew = 1;
                this.allResult = false;
                this.shipInit();
                this.fetchClientList()
            },
            //编辑对码关系
            editShip(row){
                this.modal.disabled = true;
                this.modal.isNew = 0;
                this.shipInit();
                this.modal.erpId = row.id;
                this.fetchClientList(row.clientId)
            },
            //初始化对码关系模态框
            shipInit(){
                this.modal.visible = true;
                this.form.resetFields();
                this.popover.drugData = [];
                this.modal.drugData = []
                this.splData = {};
                this.clentDate = {};
                this.splData = this.selectRowData;
                this.M = 1;
                this.N = 1;
            },
            //对码关系提交
            submit() {
                this.modal.loading = true;
                if (!this.clentDate.id) {
                    this.warn('请选择药品');
                    this.modal.loading = false;
                    return;
                }
                let params = Object.assign({}, this.splData);
                params.drugExtId = this.clentDate.id;
                params.clientId = this.modal.clientId;
                // params.extId = this.YJSDrug.id;
                params.mRatio = this.M;
                params.nRatio = this.N;
                params.isNew = this.modal.isNew;
                if(!this.modal.isNew){
                    params.erpId = this.modal.erpId
                }
                // console.log(params);
                updateSupplierMapShip(params).then(res => {
                    if (res.code == '200') {
                        this.success('对码成功', () => {
                            this.modal.visible = false;
                            this.modal.loading = false;
                            // this.fetchMapShip({extId:this.selectRowData.extId,drugId:this.selectRowData.drugId})
                            this.resetForm();
                        })
                    } else {
                        this.modal.loading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.modal.loading = false;
                    this.error(err);
                })
            },
            //modal取消
            handleCancel() {
                this.modal.visible = false;
                this.exModal.visible = false;
                this.hisModal.visible = false;
            },
            //modal客户选中变化
            clientSelectChange(val) {
                this.modal.clientId = val;
                // this.fetchDrugList(val)
            },
            //modal药品选中获取详情
            handleSelectChange(val) {
                this.fetchDrugDetail(val)
            },
            hisPageChange(page,pageSize) {

            },
            hisSizeChange(current,size){

            },
            //M值变化
            onMChange(val) {
                if (val > 1) {
                    this.N = 1
                }
            },
            //N值变化
            onNChange(val) {
                if (val > 1) {
                    this.M = 1
                }
            },
            //相似药品
            mapDrug() {
                if (!this.modal.clientId) {
                    this.warn('请选择客户');
                    setTimeout(()=>{
                        this.popover.visible = false;
                    })
                    return;
                }
                this.fetchSimilarDrug();
            },
            //查看所有药品
            checkAll(){
                this.modal.copyData = this.modal.drugData;
                this.allResult = true
            },
            //modal气泡网格页码改变
            popPageChange(page,pageSize) {
                this.fetchSimilarDrug({ offset: (page - 1) * pageSize })
            },
            //modal气泡网格选中行
            rowClick(val) {
                this.clentDate = val;
                this.form.setFieldsValue({'drugId':val.drugId})
                this.popover.visible = false;
            },
            //相似药品数据
            fetchSimilarDrug(value = {}) {
                this.popover.drugData = [];
                this.popover.drugLoading = true;
                let params = {};
                params.factoryId = this.splData.factoryId;
                params.packSpec = this.splData.packSpec;
                params.drugName = this.splData.drugName;
                params.pageSize = value.pageSize || 5;
                params.offset = value.offset || 0;
                params.extClass = '2';
                params.extId = this.modal.clientId;
                similardDrugData(params).then(res => {
                    if (res.code == '200') {
                        this.popover.drugData = res.rows;
                        this.modal.drugData = pinyinMatch(res.rows,null,'drugName');
                        this.modal.copyData = this.modal.drugData;
                        this.allResult = true;
                        this.popover.total = res.total;
                        this.popover.drugLoading = false
                    } else {
                        this.popover.drugLoading = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.popover.drugLoading = false;
                    console.log(err)
                    this.error(err)
                })
            },
            // 默认选中
            setCurrent() {
                this.$refs.singleTable.setCurrentRow(this.drugData[0])
            },
            //供应商药品数据
            fetchSupplierDrugData(params = { pageSize: 10, offset: 0 }) {
                params.extClass = '1';
                params.roleId = this.roleId;
                this.drugLoading = true;
                supplierDrugData(params).then(res => {
                    if (res.code == '200') {
                        this.drugData = res.rows;
                        this.setCurrent();
                        this.total = res.total;
                        this.drugLoading = false;
                    } else {
                        this.drugLoading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.drugLoading = false;
                    this.error(err);
                })
            },
            //搜索框供应商数据
            fetchSupplierList() {
                getSupplierList({}).then(res => {
                    if (res.code == '200') {
                        this.supplierData = res.rows
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            //供应商药品对码关系
            fetchMapShip(params = {}) {
                this.clientLoading = true
                supplierDrugMapShip(params).then(res => {
                    if (res.code == '200') {
                        this.customerData = res.rows
                        this.clientLoading = false
                    } else {
                        this.clientLoading = false
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.clientLoading = false
                    this.error(err)
                })
            },
            //导入
            exporDrug() {
                this.exModal.supplierId = null;
                this.exModal.visible = true
                this.fetchSupplierByRole()
            },
            //删除选中文件
            handleRemove(file) {
                const index = this.fileList.indexOf(file)
                const newFileList = this.fileList.slice()
                newFileList.splice(index, 1)
                this.fileList = newFileList
            },
            //文件上传之前
            beforeUpload(file) {
                this.fileList = [...this.fileList, file]
                return false
            },
            //导入文件
            handleExport() {
                if (!this.exModal.supplierId) {
                    this.warn('请选择供应商')
                    return
                }
                if (this.fileList.length == 0) {
                    this.warn('请选择文件')
                    return
                }
                const { fileList } = this
                const formData = new FormData()
                fileList.forEach((file) => {
                    formData.append('files[]', file)
                })
                formData.append('extId', this.exModal.supplierId)
                this.exModal.loading = true
                this.$axios.post('/api/biz/uploadExcel/importDrug', formData).then(res => {
                    if (res.data.code == '200') {
                        this.success('导入成功', () => {
                            this.exModal.visible = false
                            this.exModal.loading = false
                        })
                    } else {
                        this.exModal.loading = false
                        this.warn(res.data.msg)
                    }
                }).catch(err => {
                    this.exModal.loading = false
                    this.error(err)
                })
            },
            //通过当前角色获取供应商List
            fetchSupplierByRole() {
                let params = {}
                params.roleId = this.roleId
                supplierByRole(params).then(res => {
                    if (res.code == '200') {
                        this.exModal.supplierList = res.rows
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            //获取客户药品详情
            fetchDrugDetail(val) {
                let params = {}
                params.drugId = val;
                getDrugDetail(params).then(res => {
                    if (res.code == '200') {
                        this.clentDate = res.data
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            //根据客户获取药品list
            fetchDrugList(val) {
                this.modal.fetching = true
                if(!this.modal.clientId){
                    this.warn('请选择客户');
                    this.modal.fetching = true
                    return;
                }
                let params = {};
                params.keyword = val;
                params.extId = this.modal.clientId;
                params.extClass = '2';
                getDrugListByClient(params).then(res => {
                    if (res.code == '200') {
                        this.modal.drugData = pinyinMatch(res.rows,val,'drugName');
                        this.modal.copyData = this.modal.drugData.splice(0,10);
                        this.allResult = false;
                        // this.modal.drugData = res.rows;
                        this.modal.fetching = false
                    } else {
                        this.modal.fetching = false
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.modal.fetching = false
                    this.error(err)
                })
            },
            //获取客户List
            fetchClientList(val) {
                clientListData({}).then(res => {
                    if (res.code == '200') {
                        this.modal.clientData = res.rows;
                        if(val){

                            this.form.setFieldsValue({clientId:val});
                            this.modal.clientId = val;
                        }
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            //历史记录
            fetchMapHistory(val = {}) {
                this.hisModal.hisLoading = true;
                let params = val;
                params.pageSize = val.pageSize || 10;
                params.offset = val.offset || 0;
                mapHistory(params).then(res => {
                    if (res.code == '200') {
                        this.hisModal.historyData = res.rows;
                        this.hisModal.total = res.total;
                        this.hisModal.hisLoading = false;
                    } else {
                        this.hisModal.hisLoading = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.hisModal.hisLoading = false;
                    this.error(err)
                })
            },
        }
    }
</script>
<style>
    .table-add-row {
        border: 1px dashed #D9D9D9;
        text-align: center;
        padding: 5px 0;
        border-radius: 5px;
    }

    .table-add-row:hover {
        cursor: pointer;
    }
</style>