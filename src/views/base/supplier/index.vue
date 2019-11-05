<template>
    <div>
        <a-card>
            <Searchpanel ref="searchPanel" :list="list">
                <div slot="control">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
                </div>
            </Searchpanel>
            <a-button type="primary" @click="addSupplier" class="margin-top-10">新建</a-button>
            <a-spin tip="加载中..." :spinning="spinning">
                <tree-table
                        class="margin-top-10"
                        :moreOp="true"
                        :filterItem="['status']"
                        :items="items"
                        :data="dataSource"
                        :columns="columns"
                        :opColWidth="150"
                ></tree-table>
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
        <a-modal
                title="参数配置"
                :visible="parModal.visible"
                okText="提交"
                @ok="submit"
                :confirmLoading="parModal.loading"
                @cancel="handleCancel"
                :width="600"
                :centered="true"
                :maskClosable="false"
        >
            <div style="width: 500px">
                <a-form :form="parModal.form">
                    <a-form-item
                            v-bind="formItemLayout"
                            label="是否交换信息"
                    >
                        <a-radio-group
                                v-decorator="['exchangable',{initialValue: formData.exchangable}]"
                        >
                            <a-radio value="1">是</a-radio>
                            <a-radio value="0">否</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <p class="radioText">当前供应商是否与SPD接口是否打开</p>
                    <a-form-item
                            v-bind="formItemLayout"
                            label="药品编码方式"
                    >
                        <a-radio-group
                                v-decorator="['codingType',{initialValue: formData.codingType}]"
                        >
                            <a-radio value="2">SPD编码</a-radio>
                            <a-radio value="1">自主编码</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <p class="radioText">SPD编码，供应商在配送平台上使用SPD的药品编码。<br/>自主编码，配送平台供应商使用自己的药品编码</p>
                    <a-form-item
                            v-bind="formItemLayout"
                            label="装箱编码方式"
                    >
                        <a-radio-group
                                v-decorator="['packingType',{initialValue: formData.packingType }]"
                        >
                            <a-radio value="2">SPD编码</a-radio>
                            <a-radio value="1">自主编码</a-radio>
                            <a-radio value="3">不填写</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <p class="radioText">
                        SPD编码，在订单配送进行装箱操作时，系统自动产生。界面允许修改。
                        <br/>
                        自主编码，订单配送用户在界面手工录入。
                        <br/>
                        不填写，订单配送界面不显示装箱相关操作按钮，药品输入网格当中不显示装箱相关的列。
                    </p>
                    <a-form-item
                            v-bind="formItemLayout"
                            label="发货编码方式"
                    >
                        <a-radio-group
                                v-decorator="['deliveryType',{initialValue: formData.deliveryType }]"
                        >
                            <a-radio value="2">SPD编码</a-radio>
                            <a-radio value="1">自主编码</a-radio>
                            <a-radio value="3">不填写</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <p class="radioText">
                        SPD编码，在订单配送批量录入发货单号时系统自动产生。界面允许修改。
                        <br/>
                        自主编码，订单配送用户在界面手工录入。
                        <br/>
                        不填写，订单配送界面不显示发货单号输入列，界面不显示相关按钮。
                    </p>
                    <a-form-item
                            v-bind="formItemLayout"
                            label="配送编码方式"
                    >
                        <a-radio-group
                                v-decorator="['shippingType',{initialValue: formData.shippingType }]"
                        >
                            <a-radio value="2">SPD编码</a-radio>
                            <a-radio value="1">自主编码</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <p class="radioText">
                        SPD编码，配送订单保存时系统自动产生，界面不可输入不显示。
                        <br/>
                        自主编码，订单配送用户在界面手工录入，订单配送界面当前编码不允许为空，并不能与系统当前已经存在的单号重复。
                    </p>
                    <a-form-item
                            v-bind="formItemLayout"
                            label="装车编码方式"
                    >
                        <a-radio-group
                                v-decorator="['loadingType',{initialValue: formData.loadingType }]"
                        >
                            <a-radio value="1">手动输入</a-radio>
                            <a-radio value="2">自主编码</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <p class="radioText">
                        SPD编码，订单配送界面打开时系统自动产生一个装车单号，界面不允许修改。
                        <br/>
                        自主编码，订单配送界面需要配送人员自己手工录入单号。
                    </p>
                </a-form>
            </div>
        </a-modal>
    </div>
</template>
<script>
    import TreeTable from '@/my-components/tree-table/treeTable.vue';
    import {
        getSupplierData,
        getSupplierList,
        delSupplier,
        updateSupplier,
        getSupplierProperty,
        setSupplierProperty
    } from '@/api/login';
    export default {
        components:{ TreeTable },
        data(){
            return{
                total: 0,
                current:1,
                spinning:false,
                dataSource: [],
                columns:[
                    { text: '编码', value: 'supplierId', width: 150 },
                    { text: '供应商名称', value: 'supplierName', },
                    { text: '供应商简称', value: 'supplierShortName', width:150 },
                    { text: '联系人', value: 'contacts', width:100 },
                    { text: '联系电话', value: 'phone', width:120 },
                    { text: '状态', value: 'status', align:'center', width: 80 },
                    { text: '备注', value: 'remark', }
                ],
                items:[
                    { text:'参数设置', showTip:false, click:this.setParams },
                    { text:'编辑', color:'#1890FF', showTip:false,click:this.edit },
                    { text:'新建下级', color:'#1890FF', showTip:false, click:this.createChild },
                    { text:'启用', color:'#1890FF', showTip:false, click:this.setStatus, status:'1' },
                    { text:'停用', color:'#ff9900', showTip:true, tip:'确定停用吗？', click:this.setStatus, status:'0' },
                    { text:'删除', color:'#ff9900', showTip:true, tip:'确定删除吗？', click:this.delRow },
                ],
                formItemLayout: {
                    labelCol: {
                        xs: { span: 24 },
                        sm: { span: 8 },
                    },
                    wrapperCol: {
                        xs: { span: 24 },
                        sm: { span: 16 },
                    },
                },
                parModal:{
                    visible:false,
                    loading:false,
                    form:this.$form.createForm(this),
                    supplierId:null
                },
                formData:{
                    exchangable:'0',
                    codingType:'2',
                    packingType:'2',
                    deliveryType:'2',
                    shippingType:'2',
                    loadingType:'2'
                }
            }
        },
        computed: {
            list() {
                return [
                    { name: '供应商名称', dataField: 'keyword', type: 'text' },
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
            this.fetckData()
        },
        methods:{
            search() {
                this.current = 1;
                let params = this.$refs.searchPanel.form.getFieldsValue();
                this.fetckData(params)
            },
            resetForm() {
                this.current = 1;
                this.$refs.searchPanel.form.resetFields();
                this.fetckData()
            },
            setParams(row){
                this.parModal.supplierId = row.supplierId;
                getSupplierProperty({supplierId:row.supplierId}).then(res => {
                    if (res.code == '200') {
                        if(res.data){
                            this.formData = res.data;
                        }
                        this.parModal.visible = true;
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            addSupplier(){
                this.$router.push({
                    name:'supplierDetail',
                    params:{ id:0,parentId:'&' }
                })
            },
            edit(row){
                this.$router.push({
                    name:'supplierDetail',
                    params:{ id:row.supplierId,parentId:row.parentId }
                })
            },
            createChild(row){
                this.$router.push({
                    name:'supplierDetail',
                    params:{ id:0,parentId:row.supplierId }
                })
            },
            setStatus(row){
                let params = {};
                if(row.status == '0'){
                    params.status = '1'
                }else {
                    params.status = '0'
                }
                params.supplierId = row.supplierId;
                updateSupplier(params).then(res => {
                    if (res.code == '200') {
                        this.success('保存成功!',()=>{
                            this.resetForm();
                        })
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            delRow(row){
                let params = {};
                if(row.status == '1'){
                    this.warn('请先停用，再删除!');
                    return;
                }
                params.status = '2';
                params.supplierId = row.supplierId;
                updateSupplier(params).then(res => {
                    if (res.code == '200') {
                        this.success('删除成功!',()=>{
                            this.resetForm();
                        })
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
            handleCancel(){
                this.parModal.visible = false
            },
            submit(){
                this.parModal.loading = true;
                let params = this.parModal.form.getFieldsValue();
                params.supplierId = this.parModal.supplierId;
                setSupplierProperty(params).then(res => {
                    if (res.code == '200') {
                        this.success('设置成功!', () => {
                            this.resetForm();
                            this.parModal.visible = false;
                            this.parModal.loading = false;
                        });
                    } else {
                        this.parModal.loading = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.parModal.loading = false;
                    this.error(err)
                })
            },
            fetckData(value = {}) {
                this.spinning = true;
                let params = value;
                params.pageSize = value.pageSize || 10;
                params.offset = value.offset || 0;
                getSupplierData(params).then(res => {
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