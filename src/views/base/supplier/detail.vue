<template>
    <div>

        <a-card>
            <div class="cardHead">
                <a href="#" @click.prevent="cancle">
                    <a-icon type="left"></a-icon>
                    返回
                </a>
            </div>
            <a-spin tip="加载中..." :spinning="spinning">
                <a-form :form="form">
                    <a-row :gutter="24">
                        <a-col span="24">
                            <h2>基本信息：</h2>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col span="6" v-if="!isNew">
                            <a-form-item
                                    label="供应商编码"
                            >
                                <a-input
                                        :disabled="true"
                                        v-decorator="['supplierId',{initialValue: formData.supplierId}]"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col span="6">
                            <a-form-item
                                    label="供应商名称"
                            >
                                <a-input
                                        placeholder="请输入..."
                                        @blur="onBluer"
                                        v-decorator="[
                                'supplierName',
                                {rules: [{ required: true, message: '请输入供应商名称' },{ max:100, message:'最多100字' }],initialValue: formData.supplierName}
                                ]"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col span="6">
                            <a-form-item
                                    label="供应商简称"
                            >
                                <a-input
                                        placeholder="请输入..."
                                        v-decorator="[
                                'supplierShortName',
                                {rules: [{ required: true, message: '请输入供应商简称' },{ max:10, message:'最多10字' }],initialValue: formData.supplierShortName}
                                ]"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col span="6">
                            <a-form-item
                                    label="上级供应商"
                            >
                                <a-select
                                        showSearch
                                        optionFilterProp="children"
                                        placeholder="请选择..."
                                        :allowClear="true"
                                        v-decorator="['parentId',{initialValue: formData.parentId}]"
                                >
                                    <a-select-option
                                            v-for="(item,index) in parentSupplier"
                                            :value="item.supplierId"
                                            :key="index"
                                    >
                                        {{item.supplierName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col span="6">
                            <a-form-item
                                    label="联系人"
                            >
                                <a-input
                                        placeholder="请输入..."
                                        v-decorator="[
                                'contacts',
                                {rules: [{ required: true, message: '请输入联系人' },{ max:25, message:'最多25字' }],initialValue: formData.contacts}
                                ]"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col span="6">
                            <a-form-item
                                    label="联系电话"
                            >
                                <a-input
                                        placeholder="请输入..."
                                        v-decorator="[
                                'phone',
                                {rules: [{ required: true, message: '请输入联系电话' },
                                {validator:validPhone,
                                }],initialValue: formData.phone}
                                ]"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col span="6">
                            <a-form-item
                                    label="联系地址"
                            >
                                <a-input
                                        placeholder="请输入..."
                                        v-decorator="[
                                'address',
                                {rules: [{ required: true, message: '请输入联系地址' },{ max:100, message:'最多100字' }],initialValue: formData.address}
                                ]"
                                />
                            </a-form-item>
                        </a-col>
                        <!--<a-col span="6">-->
                        <!--<a-form-item-->
                        <!--label="药交所编码"-->
                        <!--&gt;-->
                        <!--<a-input-->
                        <!--placeholder="请输入..."-->
                        <!--v-decorator="[-->
                        <!--'exchangeId',-->
                        <!--{rules: [{ required: true, message: '请输入药交所编码' },{ max:20 }]}-->
                        <!--]"-->
                        <!--/>-->
                        <!--</a-form-item>-->
                        <!--</a-col>-->
                        <!--<a-col span="6">-->
                        <!--<a-form-item-->
                        <!--label="平台编码"-->
                        <!--&gt;-->
                        <!--<a-input-->
                        <!--placeholder="请输入..."-->
                        <!--v-decorator="[-->
                        <!--'plSupplierId',-->
                        <!--{rules: [{ required: true, message: '请输入平台编码' },{ max:50 }]}-->
                        <!--]"-->
                        <!--/>-->
                        <!--</a-form-item>-->
                        <!--</a-col>-->
                        <a-col span="6">
                            <a-form-item
                                    label="拼音码"
                            >
                                <a-input
                                        placeholder="请输入..."
                                        v-decorator="[
                                'spellCode',
                                {rules: [{ required: true, message: '请输入拼音码' },{validator:validSpell},{ max:20 , message:'最多20个拼音码'}],initialValue: formData.spellCode}
                                ]"
                                />
                            </a-form-item>
                        </a-col>
                        <!--<a-col span="6">-->
                        <!--<a-form-item-->
                        <!--label="结算方式"-->
                        <!--v-bind="formItemLayout"-->
                        <!--&gt;-->
                        <!--<a-radio-group-->
                        <!--:defaultValue="2"-->
                        <!--v-decorator="[-->
                        <!--'js',-->
                        <!--{rules: [{ required: true, message: '请输选择结算方式' }]}-->
                        <!--]"-->
                        <!--&gt;-->
                        <!--<a-radio :value="1">采购结算</a-radio>-->
                        <!--<a-radio :value="2">用后结算</a-radio>-->
                        <!--</a-radio-group>-->
                        <!--</a-form-item>-->
                        <!--</a-col>-->
                        <a-col span="6">
                            <a-form-item
                                    label="状态"
                                    :required="true"
                            >
                                <a-radio-group v-decorator="['status',{initialValue: formData.status}]">
                                    <a-radio value="1">启用</a-radio>
                                    <a-radio value="0">停用</a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                        <!--<a-col span="6">-->
                            <!--<a-form-item-->
                                    <!--label="营业执照文件"-->
                                    <!--:required="true"-->
                            <!--&gt;-->
                                <!--<Upload :count="1" ref="upload" type="text"></Upload>-->
                            <!--</a-form-item>-->
                        <!--</a-col>-->
                    </a-row>
                    <a-row>
                        <a-col span="24">
                            <h2>附加信息：</h2>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col span="6">
                            <a-form-item
                                    label="企业性质"
                            >
                                <a-select placeholder="请选择..."
                                          v-decorator="['property',{initialValue: formData.property}]"
                                >
                                    <a-select-option
                                            :value='item.code'
                                            v-for="(item,index) in propertyList"
                                            :key="index"
                                    >
                                        {{item.name}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col span="6">
                            <a-form-item
                                    label="法人"
                            >
                                <a-input
                                        placeholder="请输入..."
                                        v-decorator="[
                                     'legalPerson',
                                     {rules: [{ max:10, message:'最多10字' }],initialValue: formData.legalPerson}
                                     ]"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col span="6">
                            <a-form-item
                                    label="开户行"
                            >
                                <a-select placeholder="请选择..."
                                          v-decorator="['accountBank',{rules: [{ required: true, message: '请选择开户行' }],initialValue: formData.accountBank}]"
                                >
                                    <a-select-option
                                            :value='item.code'
                                            v-for="(item,index) in bankList"
                                            :key="index"
                                    >
                                        {{item.name}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col span="6">
                            <a-form-item
                                    label="银行卡号"
                            >
                                <a-input
                                        placeholder="请输入..."
                                        v-decorator="[
                                     'account',
                                     {rules: [{ required: true, message: '请输入银行卡号' },{ max:20 , message:'最多20字'}],initialValue: formData.account}
                                     ]"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col span="6">
                            <a-form-item
                                    label="纳税人识别号"
                            >
                                <a-input
                                        placeholder="请输入..."
                                        v-decorator="[
                                     'taxNumber',
                                     {rules: [{ max:20 , message:'最多20字'}],initialValue: formData.taxNumber}
                                     ]"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col span="6">
                            <a-form-item
                                    label="注册号"
                            >
                                <a-input
                                        placeholder="请输入..."
                                        v-decorator="[
                                     'regNumber',
                                     {rules: [{ max:20, message:'最多20字' }],initialValue: formData.regNumber}
                                     ]"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col span="12">
                            <a-form-item
                                    label="备注"
                            >
                                <a-input placeholder="请输入..."
                                         v-decorator="[ 'remark',{rules: [{ max:100, message:'最多100字' }],initialValue: formData.remark}]"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row style="text-align: center">
                        <a-button type="primary" @click="handleSubmit" :loading="loading">保存</a-button>
                    </a-row>
                </a-form>
            </a-spin>
        </a-card>
    </div>
</template>
<script>
    import {
        getSupplierDetail,
        getSupplierList,
        insertSupplier,
        updateSupplier,
        getProperty
    } from '@/api/login'
    import { name_to_code } from '@/utils/misc'
    import FooterToolBar from '@/components/FooterToolbar'
    import { mixin, mixinDevice } from '@/utils/mixin'
    import Upload from '@/my-components/upload/upload'

    export default {
        mixins: [mixin, mixinDevice],
        data() {
            return {
                spinning: false,
                isNew: true,
                propertyList: [],
                parentSupplier: [],
                loading: false,
                value: '1',
                formData: {
                    parentId:'&',
                    status: '1'
                },
                bankList: []
            }
        },
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        components: {
            FooterToolBar,
            Upload
        },
        mounted() {
            this.supplierInit()
            this.fetchSupplierList()
            this.fetchProperty()
            this.fetchBank()
        },
        methods: {
            supplierInit() {
                this.spinning = true;
                let parentId = this.$route.params.parentId;
                if (this.$route.params.id == 0) {
                    this.isNew = true;
                    this.formData.parentId = parentId;
                    this.spinning = false;
                } else {
                    this.isNew = false
                    getSupplierDetail({ supplierId: this.$route.params.id }).then(res => {
                        if (res.code == '200') {
                            // if (res.data.fileImg) {
                            //     let obj = {
                            //         url: this.$config.img_base_url + res.data.fileImg,
                            //         status: 'done',
                            //         uid: '-1',
                            //         name: res.data.orgFilename,
                            //         fileName: res.data.orgFilename
                            //     }
                            //     setTimeout(() => {
                            //         this.$refs.upload.fileList = [obj]
                            //         this.$refs.upload.imgArr = [obj]
                            //     })
                            // }
                            this.formData = res.data
                            this.spinning = false
                        } else {
                            this.spinning = false
                            this.warn(res.msg)
                        }
                    }).catch(err => {
                        this.spinning = false
                        this.error(err)
                    })
                }
            },
            onBluer() {
                let params = this.form.getFieldsValue(['supplierName']).supplierName,code = name_to_code(params),newCode = '';
                if(code.length > 20){
                    newCode = code.substring(0,20)
                }else{
                    newCode = code
                }
                this.form.setFieldsValue({ spellCode: newCode })
            },
            cancle() {
                this.$router.push({
                    name: 'supplier'
                })
            },
            handleSubmit() {
                this.loading = true
                // if (this.$refs.upload.imgArr.length == 0) {
                //     this.warn('请上传文件!')
                //     this.loading = false
                //     return
                // }
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let params = values
                        if (!this.isNew) {
                            // if (this.$refs.upload.imgArr[0].fileName != this.formData.orgFilename) {
                            //     params.fileInfo = this.$refs.upload.imgArr[0]
                            // }
                            params.supplierId = this.$route.params.id
                            params.editInfo = true
                            updateSupplier(params).then(res => {
                                if (res.code == '200') {
                                    this.success('保存成功!', () => {
                                        this.cancle()
                                    })
                                } else {
                                    this.loading = false
                                    this.warn(res.msg)
                                }
                            }).catch(err => {
                                this.loading = false
                                this.error(err)
                            })
                        } else {
                            // params.fileInfo = this.$refs.upload.imgArr[0]
                            insertSupplier(params).then(res => {
                                if (res.code == '200') {
                                    this.success('保存成功!', () => {
                                        this.cancle()
                                    })
                                } else {
                                    this.loading = false
                                    this.warn(res.msg)
                                }
                            }).catch(err => {
                                this.loading = false
                                this.error(err)
                            })
                        }
                    } else {
                        this.loading = false
                    }
                })
            },
            //验证手机
            validPhone(rule, value, callback) {
                if (value) {
                    if (!(/^(((0\d{2,3}-?)?\d{7,8})|(1[3567984]\d{9}))$/.test(value))) {
                        callback('请输入正确的联系电话')
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            },
            validSpell(rule, value, callback){
                if (value) {
                    if (!(/^[a-zA-Z0-9]+$/.test(value))) {
                        callback('请输入正确的拼音码')
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            },
            fetchSupplierList() {
                getSupplierList({ excludeId: this.$route.params.id }).then(res => {
                    if (res.code == '200') {
                        this.parentSupplier = [{supplierId:'&',supplierName:'该供应商为顶级供应商'},...res.rows];
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            fetchProperty() {
                getProperty({ codeClass: '4' }).then(res => {
                    if (res.code == '200') {
                        this.propertyList = res.rows
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            fetchBank() {
                getProperty({ codeClass: '5' }).then(res => {
                    if (res.code == '200') {
                        this.bankList = res.rows
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