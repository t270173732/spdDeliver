<template>
    <a-card>
        <div class="cardHead">
            <a href="#" @click.prevent="cancel">
                <a-icon type="left"></a-icon>
                返回
            </a>
        </div>
        <a-spin tip="加载中..." :spinning="spinning">
            <a-form :form="form" >
                <a-form-item
                        label="角色编码"
                        v-bind="formItemLayout"
                        v-if="$route.params.id != 0"
                >
                    <a-input :disabled="!isNew" v-decorator="['roleId',{initialValue: formData.roleId}]"/>
                </a-form-item>
                <a-form-item
                        label="角色名称"
                        v-bind="formItemLayout"
                >
                    <a-input
                            v-decorator="['roleName',{rules: [{ required: true, message: '请输入名称' }],initialValue: formData.roleName}]"/>
                </a-form-item>
                <a-form-item
                        label="状态"
                        v-bind="formItemLayout"
                        :required="true"
                >
                    <a-radio-group v-decorator="['status',{initialValue: formData.status}]">
                        <a-radio value="1">启用</a-radio>
                        <a-radio value="0">停用</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                        label="角色类型"
                        v-bind="formItemLayout"
                        :required="true"
                >
                    <a-radio-group
                            v-decorator="['roleType',{initialValue: formData.roleType}]">
                        <a-radio :value="0">维护</a-radio>
                        <a-radio :value="1">供应商</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                        label="备注"
                        v-bind="formItemLayout"
                >
                    <a-textarea placeholder="请输入..." :autosize="{ minRows: 4 }"
                                v-decorator="[ 'remark',{rules: [{ max:100,message:'最多100字' }],initialValue: formData.remark}]"/>
                </a-form-item>
                <a-form-item
                        :wrapper-col="{ span: 24, offset: 11 }"
                >
                    <a-button type="primary" @click="handleSubmit" :loading="loading">保存</a-button>
                </a-form-item>
            </a-form>
        </a-spin>
    </a-card>
</template>
<script>
    import { getRoleDetail, insertRole, roleUpdate } from '@/api/login'

    export default {
        data() {
            return {
                formData: {
                    status: '1',
                    roleType: 0
                },
                formItemLayout: {
                    labelCol: {
                        lg: { span: 7 },
                        sm: { span: 7 }
                    },
                    wrapperCol: {
                        lg: { span: 10 },
                        sm: { span: 17 }
                    }
                },
                form: this.$form.createForm(this),
                isNew:true,
                spinning:false,
                loading:false
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.spinning = true;
                let id = this.$route.params.id;
                if(id == 0){
                    this.isNew = true;
                    this.spinning = false;
                }else{
                    this.isNew = false;
                    getRoleDetail({roleId:id}).then(res => {
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
            handleSubmit() {
                this.loading = true;
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let params = values,methods;
                        if(this.isNew){
                            methods = insertRole;
                        }else{
                            params.roleId = this.$route.params.id;
                            methods = roleUpdate;
                        }
                        methods(params).then(res => {
                            if (res.code == '200') {
                                this.success('保存成功!',() => {
                                    this.cancel()
                                })
                            } else {
                                this.loading = false;
                                this.warn(res.msg)
                            }
                        }).catch(err => {
                            this.loading = false;
                            this.error(err)
                        })
                    }else {
                        this.loading = false;
                    }
                })
            },
            cancel() {
                this.$router.push({
                    name: 'roleIndex'
                })
            },
            confirm(e) {

            },
            typeChange(e){
                this.getOrgList(e.target.value)
            }
        }
    }
</script>
<style>
    .btn {
        margin: 0 5px;
    }

    .spanBtn {
        color: #1694fb
    }
</style>