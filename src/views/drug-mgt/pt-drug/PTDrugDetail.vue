<template>
    <div>
        <a-card class="card">
            <a-form :form="form">
                <a-row :gutter="16">
                    <a-col span="8">
                        <a-form-item label="药品编码">
                            <a-input
                                    placeholder="请输入..."
                                    v-decorator="[
                                    'drugId',
                                    {rules: [{ required: true, message: '请输入药品编码'},{max:50}]}
                                    ]" />
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-form-item label="药品名称">
                            <a-input
                                    @blur="onBluer"
                                    placeholder="请输入..."
                                    v-decorator="[
                                      'drugName',
                                      {rules: [{ required: true, message: '请输入药品名称'},{max:120}]}
                                    ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-form-item label="拼音码">
                            <a-input
                                    placeholder="请输入..."
                                    v-decorator="[
                                      'spellCode',
                                      {rules: [{ required: true, message: '请输入拼音码'},{max:100}]}
                                    ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-form-item label="包装规格">
                            <a-input
                                    placeholder="请输入..."
                                    v-decorator="[
                                      'packSpec',
                                      {rules: [{ required: true, message: '请输入包装规格'},{max:200}]}
                                    ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-form-item label="包装单位">
                            <a-input
                                    placeholder="请输入..."
                                    v-decorator="[
                                      'packUnit',
                                      {rules: [{ required: true, message: '请输入包装单位'},{max:50}]}
                                    ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-form-item label="最小规格">
                            <a-input
                                    placeholder="请输入..."
                                    v-decorator="[
                                      'minSpec',
                                      {rules: [{ required: true, message: '请输入最小规格'},{max:100}]}
                                    ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-form-item label="最小单位">
                            <a-input
                                    placeholder="请输入..."
                                    v-decorator="[
                                      'minUnit',
                                      {rules: [{ required: true, message: '请输入最小单位'},{max:100}]}
                                    ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-form-item label="大包装单位">
                            <a-input
                                    placeholder="请输入..."
                                    v-decorator="[
                                      'maxUnit',
                                      {rules: [{ required: true, message: '请输入大包装单位'},{max:10}]}
                                    ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-form-item label="生产厂商">
                            <a-input
                                    placeholder="请输入..."
                                    v-decorator="[
                                      'factoryId',
                                      {rules: [{ required: true, message: '请输入生产厂商'},{max:120}]}
                                    ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-form-item label="批准文号">
                            <a-input
                                    placeholder="请输入..."
                                    v-decorator="[
                                      'authorizeNo',
                                      {rules: [{ required: true, message: '请输入批准文号'},{max:100}]}
                                    ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-form-item label="注册证号">
                            <a-input
                                    placeholder="请输入..."
                                    v-decorator="[
                                      'registerNo',
                                      {rules: [{ required: true, message: '请输入注册证号'},{max:50}]}
                                    ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-form-item label="商品码">
                            <a-input
                                    placeholder="请输入..."
                                    v-decorator="[
                                      'barCode',
                                      {rules: [{ required: true, message: '请输入商品码'},{max:100}]}
                                    ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-form-item label="监管码">
                            <a-input
                                    placeholder="请输入..."
                                    v-decorator="[
                                      'supervisionCode',
                                      {rules: [{ required: true, message: '请输入监管码'},{max:50}]}
                                    ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-form-item
                                label="状态"
                                :required="true"
                        >
                            <a-radio-group v-decorator="['status',{initialValue: '1'}]">
                                <a-radio value="1">启用</a-radio>
                                <a-radio value="0">停用</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-form-item label="购买价格">
                            <a-input-number
                                    style="width: 200px"
                                    :min="0.1"
                                    :max="1000000000"
                                    placeholder="请输入..."
                                    v-decorator="[
                                      'purchasePrice',
                                      {rules: [{ required: true, message: '请输入购买价格'}]}
                                    ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-form-item label="大包装转换关系">
                            <a-input-number
                                    style="width: 200px"
                                    :min="0.1"
                                    :max="1000000000"
                                    placeholder="请输入..."
                                    v-decorator="[
                                      'maxPackRatio',
                                      {rules: [{ required: true, message: '请输入大包装转换关系'}]}
                                    ]"/>
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-form-item label="包装转换关系">
                            <a-input-number
                                    style="width: 200px"
                                    :min="1"
                                    :max="10000"
                                    placeholder="请输入..."
                                    v-decorator="[
                                      'packRatio',
                                      {rules: [{ required: true, message: '请输入包装转换关系'}]}
                                    ]"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col>
                        <a-form-item label="备注">
                            <a-textarea placeholder="请输入..." :autosize="{ minRows: 4 }" v-decorator="[ 'remark',{rules: [{ max:255 }]}]"/>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-card>
        <footer-tool-bar :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}">
            <a-button @click="cancle">取消</a-button>
            <a-button type="primary" @click="handleSubmit" :loading="loading" class="margin-left-5">提交</a-button>
        </footer-tool-bar>
    </div>
</template>
<script>
    import { insertPTDrug, updatePTDrug, getDrugDetail } from '@/api/login'
    import FooterToolBar from '@/components/FooterToolbar';
    import { mixin, mixinDevice } from '@/utils/mixin'
    import { name_to_code } from '@/utils/misc'
    export default {
        mixins: [mixin, mixinDevice],
        data(){
            return{
                form:this.$form.createForm(this),
                loading:false,
                isNew:true,
            }
        },
        components: {
            FooterToolBar
        },
        mounted(){
            this.drugInit();
        },
        methods:{
            drugInit(){
                if(this.$route.params.id == 0){
                    this.isNew = true
                }else{
                    this.isNew = false;
                    getDrugDetail({ id: this.$route.params.id }).then(res => {
                        if (res.code == '200') {
                            this.form.setFieldsValue(res.data);
                        } else {
                            this.warn(res.msg);
                        }
                    }).catch(err => {
                        this.error(err);
                    })
                }
            },
            cancle(){
                this.$router.push({
                    name:'PTDrug'
                })
            },
            onBluer() {
                let params = this.form.getFieldsValue(['drugName']).drugName
                this.form.setFieldsValue({ spellCode: name_to_code(params) })
            },
            handleSubmit(){
                this.loading = true;
                this.form.validateFields((err, values) => {
                    if (!err) {
                        values.extClass = '3';
                        values.extId = '-999';
                        if(this.isNew){
                            insertPTDrug(values).then(res => {
                                if (res.code == '200') {
                                    this.success('保存成功',()=>{
                                        this.$router.push({
                                            name:'PTDrug'
                                        });
                                    })
                                } else {
                                    this.loading = false;
                                    this.warn(res.msg);
                                }
                            }).catch(err => {
                                this.loading = false;
                                this.error(err);
                            })
                        }else{
                            values.id = this.$route.params.id;
                            updatePTDrug(values).then(res => {
                                if (res.code == '200') {
                                    this.success('保存成功',()=>{
                                        this.$router.push({
                                            name:'PTDrug'
                                        });
                                    })
                                } else {
                                    this.loading = false;
                                    this.warn(res.msg);
                                }
                            }).catch(err => {
                                this.loading = false;
                                this.error(err);
                            })
                        }
                    }else{
                        this.loading = false;
                    }
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    .card{
        margin-bottom: 24px;
    }
    .card .ant-form-item{
        margin-bottom: 12px;
    }
</style>