<template>
    <div v-if="!success">
        <a-spin tip="加载中..." :spinning="spinning">
            <a-card>
                <detail-list title="响应订单信息" :col="3">
                    <detail-list-item term="订单号">{{resInfo.orderId}}</detail-list-item>
                    <detail-list-item term="供应商">{{resInfo.supplierName}}</detail-list-item>
                    <detail-list-item term="订单类型">{{resInfo.orderType=='1'?'采购':'移库'}}</detail-list-item>
                    <detail-list-item term="加急订单">{{resInfo.urgent?'是':'否'}}</detail-list-item>
                    <detail-list-item term="客户">{{resInfo.clientName}}</detail-list-item>
                    <detail-list-item term="到货期限">{{resInfo.arriveTime}}</detail-list-item>
                    <detail-list-item term="收货人">{{resInfo.takeUser}}</detail-list-item>
                    <detail-list-item term="联系电话">{{resInfo.takeNumber}}</detail-list-item>
                    <detail-list-item term="状态">{{resInfo.status=='2'?'响应':'部分响应'}}</detail-list-item>
                    <detail-list-item term="收货地址">{{resInfo.takeAddress}}</detail-list-item>
                </detail-list>
                <a-divider/>
                <div class="title">配送信息</div>
                <a-form :form="form">
                    <a-row :gutter="16">
                        <a-col span="6">
                            <a-form-item label="配送单号">
                                <a-input
                                        placeholder="不输入系统自动生成"
                                        v-decorator="[
                                    'shippingId',
                                    {rules: [{max:50}]}
                                    ]"/>
                            </a-form-item>
                        </a-col>
                        <a-col span="6">
                            <a-form-item label="发货仓库">
                                <a-input
                                        placeholder="请输入..."
                                        v-decorator="[
                                    'shippingStore',
                                    {rules: [{ required: true, message: '请输入发货仓库'},{max:20}]}
                                    ]"/>
                            </a-form-item>
                        </a-col>
                        <a-col span="6">
                            <a-form-item label="送货人">
                                <a-input
                                        placeholder="请输入..."
                                        v-decorator="[
                                    'sender',
                                    {rules: [{ required: true, message: '请输入送货人'},{max:20}]}
                                    ]"/>
                            </a-form-item>
                        </a-col>
                        <a-col span="6">
                            <a-form-item label="联系电话">
                                <a-input
                                        placeholder="请输入..."
                                        v-decorator="[
                                    'senderPhone',
                                    {rules: [{ required: true, message: '请输入联系电话'},{validator:validPhone,}]}
                                    ]"/>
                            </a-form-item>
                        </a-col>
                        <a-col span="6">
                            <a-form-item label="装车单号">
                                <a-input
                                        placeholder="不输入系统自动生成"
                                        v-decorator="[
                                    'loadingId',
                                    {rules: [{max:20}]}
                                    ]"/>
                            </a-form-item>
                        </a-col>
                        <a-col span="6">
                            <a-form-item label="发货时间">
                                <a-date-picker
                                        placeholder="请选择..."
                                        v-decorator="[
                                    'shippingTime',
                                    {rules: [{ required: true, message: '请选择发货时间'}]}
                                    ]"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
                <a-divider/>
                <div class="title">药品信息</div>
                <a-button type="primary" @click="drugSplit" :disabled="disabled">药品拆分</a-button>
                <el-table
                        ref="singleTable"
                        class="margin-top-10"
                        :data="dataSource"
                        style="width: 100%"
                        border
                        row-class-name="drugTr"
                        highlight-current-row
                        @current-change="handleCurrentChange"
                >
                    <el-table-column
                            :show-overflow-tooltip="true"
                            fixed="left"
                            label="药品名称"
                            width="150"
                            prop="drugName"
                    >
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="120"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <a @click="editChange(scope.row,scope.$index,true)">
                                {{scope.row.isSet?'保存':'编辑'}}
                            </a>
                            <template v-if="scope.row.del">
                                <a-divider type="vertical"/>
                                <a
                                    class="delColor"
                                    v-if="!scope.row.isSet"
                                    @click="drugDel(scope.row,scope.$index)"
                                >
                                    删除
                                </a>
                                <a v-else @click="editChange(scope.row,scope.$index,false)">
                                    取消
                                </a>
                            </template>
                            <template v-else>
                                <a-divider type="vertical" v-if="scope.row.isSet"/>
                                <a v-if="scope.row.isSet" @click="editChange(scope.row,scope.$index,false)">
                                    取消
                                </a>
                            </template>
                            <!--<a-divider type="vertical" v-if="scope.row.isSet"/>-->
                            <!--<a-popconfirm v-if="!scope.row.isSet && scope.row.del" title="确认删除吗？"-->
                            <!--@confirm="drugDel(scope.row,scope.$index)">-->
                            <!--<a>-->
                            <!--删除-->
                            <!--</a>-->
                            <!--</a-popconfirm>-->
                            <!--<a v-else @click="editChange(scope.row,scope.$index,false)">-->
                            <!--取消-->
                            <!--</a>-->
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
                    >
                        <template slot-scope="scope">
                            <template v-if="item.edit && scope.row.isSet">
                            <span v-if="item.text">
                                <a-input
                                        size="small"
                                        placeholder="请输入..."
                                        v-model="selRow[item.prop]"
                                />
                            </span>
                             <span v-else-if="item.num">
                                <a-input-number
                                        @change="inputChage(selRow[item.prop],item.prop)"
                                        style="width:100%"
                                        size="small"
                                        :min="0"
                                        placeholder="请输入..."
                                        v-model="selRow[item.prop]"
                                />
                            </span>
                            <span v-else-if="item.date">
                                <a-date-picker
                                        size="small"
                                        placeholder="请选择..."
                                        v-model="selRow[item.prop]"
                                />
                            </span>
                            </template>
                            <template v-else>
                                <span>{{scope.row[item.prop]}}</span>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </a-card>
        </a-spin>
        <footer-tool-bar>
            <a-button @click="cancle">取消</a-button>
            <a-button
                    type="primary"
                    :loading="loading"
                    class="margin-left-5"
                    @click="submit"
            >
                配送出库
            </a-button>
        </footer-tool-bar>
    </div>
    <div v-else>
        <a-card>
            <result :is-success="true" title="配送成功">
                <!--<template slot="action">-->
                    <!--<a-button type="primary" @click="cancle">返回列表</a-button>-->
                    <!--<a-button class="margin-left-5">查看项目</a-button>-->
                    <!--<a-button class="margin-left-5">打印</a-button>-->
                    <!--<a-button class="margin-left-5">打印箱码</a-button>-->
                <!--</template>-->
                <div>
                    <detail-list title="订单信息" :col="3">
                        <detail-list-item term="订单号">{{resSuccessInfo.orderId}}</detail-list-item>
                        <detail-list-item term="供应商">{{resSuccessInfo.supplierName}}</detail-list-item>
                        <detail-list-item term="订单类型">{{resSuccessInfo.orderType=='1'?'采购':'移库'}}</detail-list-item>
                        <detail-list-item term="加急订单">{{resSuccessInfo.urgent?'是':'否'}}</detail-list-item>
                        <detail-list-item term="客户">{{resSuccessInfo.clientName}}</detail-list-item>
                        <detail-list-item term="到货期限">{{resSuccessInfo.arriveTime}}</detail-list-item>
                        <detail-list-item term="收货人">{{resSuccessInfo.takeUser}}</detail-list-item>
                        <detail-list-item term="联系电话">{{resSuccessInfo.takeNumber}}</detail-list-item>
                        <detail-list-item term="状态">{{resSuccessInfo.status=='2'?'响应':'部分响应'}}</detail-list-item>
                        <detail-list-item term="收货地址">{{resSuccessInfo.takeAddress}}</detail-list-item>
                    </detail-list>
                    <detail-list title="配送信息" :col="3">
                        <detail-list-item term="配送单号">{{resSuccessInfo.shippingId}}</detail-list-item>
                        <detail-list-item term="发货仓库">{{resSuccessInfo.shippingStore}}</detail-list-item>
                        <detail-list-item term="送货人">{{resSuccessInfo.sender}}</detail-list-item>
                        <detail-list-item term="联系电话">{{resSuccessInfo.senderPhone}}</detail-list-item>
                        <detail-list-item term="装车单号">{{resSuccessInfo.loadingId}}</detail-list-item>
                        <detail-list-item term="发货时间">{{resSuccessInfo.shippingTime}}</detail-list-item>
                    </detail-list>
                    <el-table
                            class="margin-top-10"
                            :data="resSuccessInfo.plDeliverDetailVOS"
                            style="width: 100%"
                            border
                    >
                        <el-table-column
                                :show-overflow-tooltip="true"
                                fixed="left"
                                label="药品名称"
                                width="150"
                                prop="drugName"
                        >
                        </el-table-column>
                        <el-table-column
                                :show-overflow-tooltip="true"
                                :prop="item.prop"
                                :label="item.title"
                                :key="index"
                                v-for="(item,index) in columns"
                                :width="item.width"
                                :align="item.align"
                        >
                        </el-table-column>
                    </el-table>
                </div>
            </result>
        </a-card>
        <footer-tool-bar>
            <template slot="center">
                <a-button type="primary" @click="cancle">返回列表</a-button>
                <a-button class="margin-left-5">查看项目</a-button>
                <a-button class="margin-left-5">打印</a-button>
                <a-button class="margin-left-5">打印箱码</a-button>
            </template>
        </footer-tool-bar>
    </div>
</template>
<script>
    import { stayDeliverDetail, submitDeliver } from '@/api/login'
    import FooterToolBar from '@/components/FooterToolbar'
    import DetailList from '@/components/tools/DetailList'
    import moment from 'moment';

    const DetailListItem = DetailList.Item
    export default {
        data() {
            return {
                spinning: false,
                resInfo: {},
                selRow: {},
                selectRow: {},
                disabled: true,
                form: this.$form.createForm(this),
                dataSource: [],
                columns: [
                    { title: '生产厂商', prop: 'factoryId', width: 150, edit: false },
                    { title: '规格', prop: 'spec', width: 100, edit: false },
                    { title: '单位', prop: 'unit', align: 'center', width: 80, edit: false },
                    { title: '响应数量', prop: 'respNum', align: 'right', width: 100, edit: false },
                    { title: '已配送数量', prop: 'deliverQuantity', align: 'right', width: 100, edit: false },
                    { title: '配送数量', prop: 'quantity', align: 'right', width: 100, edit: true, num: true },
                    { title: '件数', prop: 'packingNum', align: 'right', width: 80, edit: true, num: true },
                    { title: '每箱数量', prop: 'packingQuantity', align: 'right', width: 100, edit: true, num: true },
                    { title: '装箱编号', prop: 'packingNo', edit: true, text: true, width: 100 },
                    { title: '发货单号', prop: 'invoiceId', edit: true, text: true, width: 100 },
                    { title: '批号', prop: 'batchNum', edit: true, text: true, width: 80 },
                    { title: '生产日期', prop: 'productionDate', edit: true, date: true, width: 130 },
                    { title: '效期', prop: 'validityDate', edit: true, date: true, width: 130 },
                    { title: '发票时间', prop: 'receiptTime', edit: true, date: true, width: 130 },
                    { title: '发票号', prop: 'receiptNo', edit: true, text: true, width: 100 },
                    { title: '药品编码', prop: 'drugId', width: 150, edit: false }
                ],
                loading: false,
                success:false,
                resSuccessInfo:{}
            }
        },
        components: {
            DetailList,
            DetailListItem,
            FooterToolBar
        },
        mounted() {
            this.init();
        },
        methods: {
            moment,
            init() {
                this.spinning = true
                stayDeliverDetail({ responseId: this.$route.params.id }).then(res => {
                    if (res.code == '200') {
                        res.data.plDeliverDetailVOS.map((i) => {
                            i.isSet = false;//给后台返回数据添加isSet标识
                            i.del = false;
                            i.packingNum = Math.floor(i.quantity/i.packingQuantity);
                            return i
                        })
                        this.dataSource = res.data.plDeliverDetailVOS
                        this.resInfo = res.data
                        this.spinning = false
                    } else {
                        this.spinning = false
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.spinning = false
                    this.error(err)
                })
            },
            cancle() {
                // this.setBgColor([0,1],2,true);
                // console.log($('.drugTr')[0].style)
                this.$router.push({
                    name: 'orderDeliver'
                })
            },
            submit() {
                // let params = this.form.getFieldsValue();
                // params.responseId = this.$route.params.id;
                // params.plDeliverDetailVOS = this.dataSource;
                // console.log(params)
                // this.setBgColor([0,1],2,false);
                this.loading = true;
                let len = this.dataSource.length,
                    data=this.dataSource,
                    ids = [];
                for (let i=0; i<len; i++){
                    if(!data[i].quantity || !data[i].batchNum || !data[i].productionDate || !data[i].validityDate){
                        this.warn('请完善药品配送信息');
                        this.setBgColor([i],len,true);
                        this.loading = false;
                        return;
                    }
                }
                for (let j=0; j<len; j++){
                    if(ids.indexOf(data[j].drugId)<0){
                        ids.push(data[j].drugId)
                    }
                }
                for (let k=0; k<ids.length; k++){
                    let rowKeys = [], respNum, deliverQuantity, quantity = 0;
                    for (let y=0; y<len; y++){
                        if(ids[k] == data[y].drugId){
                            rowKeys.push(y);
                            respNum = data[y].respNum
                            deliverQuantity = data[y].deliverQuantity
                            // quantity += data[y].quantity + data[y].packingNum * data[y].packingQuantity
                            quantity += data[y].quantity
                        }
                    }
                    if ((respNum - deliverQuantity) < quantity) {
                        this.warn('配送数量大于响应数量');
                        this.setBgColor(rowKeys,len,true);
                        this.loading = false;
                        return;
                    }
                }
                this.form.validateFields((err,values) => {
                    if(err){
                        this.loading = false
                    }else{
                        let params = values;
                        params.shippingTime = params.shippingTime.format('YYYY-MM-DD');
                        params.responseId = this.$route.params.id;
                        params.plDeliverDetailVOS = this.dataSource;
                        this.resSuccessInfo = Object.assign(this.resInfo,params)
                        submitDeliver(params).then(res => {
                            if (res.code == '200') {
                                this.loading = false;
                                this.success = true;
                            } else {
                                this.loading = false;
                                this.warn(res.msg)
                            }
                        }).catch(err => {
                            this.loading = false;
                            this.error(err)
                        })
                    }
                })
            },
            validPhone(rule, value, callback) {
                if (value) {
                    if (!(/^1[3584679]\d{9}$/.test(value))) {
                        callback('请输入正确的联系电话')
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            },
            editChange(row, index, flag) {
                for (let i of this.dataSource) {
                    if (i.isSet && i.id != row.id) {
                        this.warn('请先保存当前编辑项');
                        return false
                    }
                }
                this.setBgColor([index], this.dataSource.length, false);
                //是否是取消操作
                if (!flag) {
                    return row.isSet = !row.isSet
                }
                //保存数据
                if (row.isSet) {
                    this.dataSource[index].quantity = this.selRow.quantity;
                    this.dataSource[index].packingNum = this.selRow.packingNum;
                    this.dataSource[index].packingQuantity = this.selRow.packingQuantity;
                    this.dataSource[index].packingNo = this.selRow.packingNo;
                    this.dataSource[index].invoiceId = this.selRow.invoiceId;
                    this.dataSource[index].batchNum = this.selRow.batchNum;
                    this.dataSource[index].receiptTime = this.selRow.receiptTime;
                    this.dataSource[index].receiptNo = this.selRow.receiptNo;
                    this.dataSource[index].isSet = false;
                    if(this.selRow.productionDate){
                        this.dataSource[index].productionDate = this.selRow.productionDate.format('YYYY-MM-DD')
                    }
                    if(this.selRow.validityDate){
                        this.dataSource[index].validityDate = this.selRow.validityDate.format('YYYY-MM-DD')
                    }
                    if(this.selRow.receiptTime){
                        this.dataSource[index].receiptTime = this.selRow.receiptTime.format('YYYY-MM-DD')
                    }

                    this.selectRow = JSON.parse(JSON.stringify(this.selRow));
                    this.selectRow.quantity = this.selectRow.respNum - this.selectRow.deliverQuantity - (this.selectRow.quantity + this.selectRow.packingNum * this.selectRow.packingQuantity);
                    this.selectRow.del = true;
                    this.selectRow.isSet = false
                } else {
                    this.selRow = JSON.parse(JSON.stringify(row));
                    row.isSet = true
                }
            },
            setBgColor(arr, len, flag) {
                let color
                if (flag) {
                    color = '#F56C6C'
                } else {
                    color = ''
                }
                arr.forEach((item) => {
                    $('.drugTr')[item].style.backgroundColor = color
                    $('.drugTr')[item + len].style.backgroundColor = color
                })
            },
            handleCurrentChange(val) {
                this.disabled = false
                this.selectRow = JSON.parse(JSON.stringify(val))
                this.selectRow.del = true
                this.selectRow.isSet = false
            },
            drugSplit() {
                let indices = [], respNum, deliverQuantity, quantity = 0;
                this.dataSource.forEach((i, index) => {
                    if (i.drugId == this.selectRow.drugId) {
                        indices.push(index);
                        respNum = i.respNum;
                        deliverQuantity = i.deliverQuantity;
                        quantity += i.quantity + i.packingNum * i.packingQuantity;
                    }
                })
                if ((respNum - deliverQuantity) <= quantity) {
                    this.warn('没有数量可以拆分了')
                    return false
                }
                this.dataSource.splice(indices[indices.length - 1] + 1, 0, this.selectRow)
                // console.log(indices)
                this.$refs.singleTable.clearSelection()
            },
            drugDel(row, index) {
                this.dataSource.splice(index, 1)
            },
            inputChage(val,prop){
                let deliverNum = this.selRow.respNum - this.selRow.deliverQuantity;
                if( prop === 'packingNum' ) {
                    if (val === undefined){
                        val = 0;
                        this.selRow.packingNum = 0;
                    }
                    let num = val * this.selRow.packingQuantity,
                        maxPackNum = Math.floor(deliverNum/this.selRow.packingQuantity);
                    if( val > maxPackNum ){
                        this.selRow.packingNum = maxPackNum;
                        num = maxPackNum * this.selRow.packingQuantity
                    }
                    this.selRow.quantity = num;
                }else if( prop === 'quantity' ) {
                    if (val === undefined){
                        val = 0;
                        this.selRow.quantity = 0;
                    }
                    let packNum;
                    if( val > deliverNum ){
                        this.selRow.quantity = deliverNum;
                        packNum = Math.floor(deliverNum/this.selRow.packingQuantity);
                    }else {
                        packNum = Math.floor(val/this.selRow.packingQuantity);
                    }
                    this.selRow.packingNum = packNum
                }else if ( prop === 'packingQuantity' ) {
                    if (val === undefined){
                        val = 0;
                        this.selRow.packingQuantity = 0;
                    }
                    if ( deliverNum && !this.selRow.packingNum ) {
                        this.selRow.packingNum = Math.floor(deliverNum/val);
                    }else if ( deliverNum && this.selRow.packingNum ){
                        let num = val * this.selRow.packingNum;
                        if( val > deliverNum/this.selRow.packingNum ){
                            this.selRow.packingQuantity = Math.floor(deliverNum/this.selRow.packingNum);
                            this.selRow.quantity = this.selRow.packingNum * this.selRow.packingQuantity;
                        }else {
                            this.selRow.quantity = this.selRow.packingNum * val;
                        }
                    }
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    .title {
        color: rgba(0, 0, 0, .85);
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 16px;
        margin-left: 0;
    }

    .bgRed {
        background-color: red;
    }
</style>