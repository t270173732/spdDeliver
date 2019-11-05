<template>
    <a-card>
        <div class="cardHead">
            <a href="#"  @click.prevent="cancel" >
                <a-icon type="left"></a-icon>
                返回
            </a>
        </div>
        <a-spin tip="加载中..." :spinning="spinning">
            <a-form :form="form">
                <a-form-item
                        label="用户账号"
                        :label-col="{ span: 9 }"
                        :wrapper-col="{ span: 7 }"
                >
                    <a-input
                            :disabled="!isNew"
                            v-decorator="['account',{rules: [{ required: true, message: '请输入用户账号!'},{max:10,message:'最多10字'}],initialValue: formData.account}]"
                    />
                </a-form-item>
                <a-form-item
                        label="用户名称"
                        :label-col="{ span: 9 }"
                        :wrapper-col="{ span: 7 }"
                >
                    <a-input
                            v-decorator="['username',{rules: [{ required: true, message: '请输入用户名称!'},{max:30,message:'最多30字'}],initialValue: formData.username}]"
                    />
                </a-form-item>
                <a-form-item
                        label="电话(选填)"
                        :label-col="{ span: 9 }"
                        :wrapper-col="{ span: 7 }"
                >
                    <a-input v-decorator="['phone',{rules:[{validator:validPhone}], initialValue: formData.phone }]">
                    </a-input>
                </a-form-item>
                <a-form-item
                        label="邮箱(选填)"
                        :label-col="{ span: 9 }"
                        :wrapper-col="{ span: 7 }"
                >
                    <a-input v-decorator="['email',{rules:[{max:50,message:'最多50字'}], initialValue: formData.email }]"/>
                </a-form-item>
                <a-form-item
                        label="状态"
                        :label-col="{ span: 9 }"
                        :wrapper-col="{ span: 7 }"
                >
                    <a-radio-group v-decorator="['status',{ initialValue: formData.status }]">
                        <a-radio value="1">启用</a-radio>
                        <a-radio value="0">停用</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                        :wrapper-col="{ span: 12, offset: 11 }"
                >
                    <a-button type="primary" @click="handleSubmit" :loading="loading">提交</a-button>
                </a-form-item>
            </a-form>
        </a-spin>

    </a-card>
</template>
<script>
    import { insertUser,getUserDetail,updateUser } from '@/api/login'
    export default {
        data() {
            return {
                form: this.$form.createForm(this),
                formData: {
                    status:'1',
                },
                isNew: false,
                spinning:false,
                loading:false
            }
        },
        computed: {},
        mounted() {
            this.init()
        },
        methods: {
            init(){
                this.spinning = true;
                if(this.$route.params.id != 0){
                    this.isNew = false
                    getUserDetail({account:this.$route.params.id}).then(res => {
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
                }else{
                    this.isNew = true;
                    this.spinning = false;
                }
            },
            validPhone(rule, value, callback) {
                if (value) {
                    if (!(/^((0\d{2,3}-?\d{7,8})|(1[3567984]\d{9}))$/.test(value))) {
                        callback('请输入正确的联系电话')
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            },
            handleSubmit (e) {
                this.loading = true;
                this.form.validateFields((err, values) => {
                    if (!err) {
                        if(this.isNew){
                            values.userProp = this.$route.params.orgId;
                            insertUser(values).then(res => {
                                if (res.code == '200') {
                                    this.$message.info('提交成功!')
                                    this.cancel()
                                } else {
                                    this.loading = false;
                                    this.warn(res.msg)
                                }
                            }).catch(err => {
                                this.loading = false;
                                this.error(err)
                            })
                        }else{
                            updateUser(values).then(res => {
                                if (res.code == '200') {
                                    this.$message.info('提交成功!')
                                    this.cancel()
                                } else {
                                    this.loading = false;
                                    this.warn(res.msg)
                                }
                            }).catch(err => {
                                this.loading = false;
                                this.error(err)
                            })
                        }
                    }else{
                        this.loading = false;
                    }
                });
            },
            cancel(){
                this.$router.push({
                    name:'userIndex'
                })
            }
        }
    }
</script>