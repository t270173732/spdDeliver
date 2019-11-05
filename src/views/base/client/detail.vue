<template>
    <a-card>
        <div class="cardHead">
            <a href="#" @click.prevent="cancel">
                <a-icon type="left"></a-icon>
                返回
            </a>
        </div>
        <a-spin :spinning="spinning" tip="加载中...">
            <a-form
                    :form="form"
            >
                <a-form-item
                        label="客户编码"
                        :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 8 }"
                        v-if="!isNew"
                >
                    <a-input v-decorator="['clientId',{initialValue:formData.clientId}]" :disabled="true"/>
                </a-form-item>
                <a-form-item
                        label="客户名称"
                        :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 8 }"
                >
                    <a-input @blur="onBluer"
                             v-decorator="['clientName',{rules: [{ required: true, message: '请填写客户名称!' },{ max:30,message:'最多30字' }],initialValue:formData.clientName}]"/>
                </a-form-item>
                <a-form-item
                        label="拼音码"
                        :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 8 }"
                >
                    <a-input
                            v-decorator="['spellCode',{rules: [{ required: true, message: '请填写拼音码!' },{validator:validSpell},{ max:10,message:'最多10字' }],initialValue:formData.spellCode}]"/>
                </a-form-item>
                <a-form-item
                        label="联系人"
                        :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 8 }"
                >
                    <a-input
                            v-decorator="['contacts',{rules: [{ required: true, message: '请填写联系人!' },{ max:10,message:'最多10字' }],initialValue:formData.contacts}]"/>
                </a-form-item>
                <a-form-item
                        label="联系电话"
                        :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 8 }"
                >
                    <a-input
                            v-decorator="['phone',{rules: [{ required: true, message: '请填写联系电话!' },{validator:validPhone}],initialValue:formData.phone}]"/>
                </a-form-item>
                <a-form-item
                        label="地址"
                        :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 8 }"
                >
                    <a-input
                            v-decorator="['address',{rules: [{ required: true, message: '请填写地址!' },{ max:100,message:'最多100字' }],initialValue:formData.address}]"/>
                </a-form-item>
                <a-form-item
                        label="分类"
                        :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 8 }"
                >
                    <a-select
                            v-decorator="['clientClass',{rules: [{ required: true, message: '请填写分类!' }],initialValue:formData.clientClass}]"
                            placeholder="请选择">
                        <a-select-option v-for="(item,index) in this.enum.clientClass" :key="index" :value="item.id">
                            {{item.text}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                        label="级别"
                        :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 8 }"
                >
                    <a-select
                            v-decorator="['clientLevel',{rules: [{ required: true, message: '请填写级别!' }],initialValue:formData.clientLevel}]"
                            placeholder="请选择">
                        <a-select-option v-for="(item,index) in this.enum.clientLevel" :key="index" :value="item.id">
                            {{item.text}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                        label="备注"
                        :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 8 }"
                >
                    <a-textarea
                            v-decorator="['remark',{initialValue:formData.remark},{ max:100,message:'最多100字' }]"></a-textarea>
                </a-form-item>
                <a-form-item
                        label="状态"
                        :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 8 }"
                >
                    <a-radio-group
                            v-decorator="['status',{rules: [{ required: true, message: '请选择状态!' }],initialValue:formData.status}]">
                        <a-radio value="1">启用</a-radio>
                        <a-radio value="0">停用</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 12, offset: 11 }">
                    <a-button type="primary" @click="handleSubmit" :loading="loading">保存</a-button>
                </a-form-item>
            </a-form>
        </a-spin>
    </a-card>
</template>
<script>
    import { getClientDetail, insertClient, updateClient, getCenterList } from '@/api/login'
    import { name_to_code } from '@/utils/misc'

    export default {
        data() {
            return {
                isNew: true,
                spinning:false,
                loading: false,
                formData: {
                    clientName: '',
                    spellCode: '',
                    contacts: '',
                    phone: '',
                    address: '',
                    clientClass: '1',
                    clientLevel: '1',
                    remark: '',
                    status: '1'
                },
                parentSupplier: [],
                form: this.$form.createForm(this)
            }
        },
        computed: {},
        mounted() {
            this.init()
        },
        methods: {
            init() {
                this.spinning = true;
                if (this.$route.params.id == 0) {
                    this.isNew = true;
                    this.spinning = false;
                } else {
                    this.isNew = false;
                    let id = this.$route.params.id
                    getClientDetail({ clientId: id }).then(res => {
                        if (res.code == '200') {
                            this.formData = res.data;
                            this.spinning = false;
                        } else {
                            this.spinning = false;
                            this.warn(res.msg)
                        }
                    }).catch(err => {
                        this.spinning = false;
                        this.error(err)
                    })
                }
            },
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
            validSpell(rule, value, callback) {
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
            handleSubmit(e) {
                this.loading = true;
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let params = values,methods;
                        if(this.isNew){
                            methods = insertClient;
                        }else{
                            methods = updateClient;
                            params.clientId = this.$route.params.id;
                            params.editInfo = true;
                        }
                        methods(values).then(res => {
                            if (res.code == '200') {
                                this.success('保存成功!', () => {
                                    this.cancel();
                                })
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
            cancel() {
                this.$router.push({
                    name: 'client'
                })
            },
            onBluer() {
                let params = this.form.getFieldsValue(['clientName']).clientName
                this.form.setFieldsValue({ spellCode: name_to_code(params) })
            }
        }
    }
</script>
<style scoped>

</style>