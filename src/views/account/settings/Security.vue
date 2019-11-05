<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-form ref="formRegister" :form="form" id="formRegister">
          <a-form-item
            label="旧密码"
            v-bind="formItemLayout">
            <a-input size="large"
                     v-decorator="['oldPassWord',{rules: [{ required: true, message: '请输入旧密码' }]}]"
                     type="password" autocomplete="false" placeholder="请输入旧密码"></a-input>
          </a-form-item>
          <a-popover placement="rightTop" trigger="click" :visible="state.passwordLevelChecked">
            <template slot="content">
              <div :style="{ width: '200px' }" >
                <div :class="['user-register', passwordLevelClass]">强度：<span>{{ passwordLevelName }}</span></div>
                <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor " />
                <div style="margin-top: 10px;">
                  <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
                </div>
              </div>
            </template>
            <a-form-item
              label="新密码"
              v-bind="formItemLayout"
             >
              <a-input size="large"
                       v-decorator="['password',{rules: [{ required: true, message: '至少6位密码，区分大小写'}, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
                       type="password" @click="handlePasswordInputClick" autocomplete="false" placeholder="至少6位密码，区分大小写"></a-input>
            </a-form-item>
          </a-popover>
          <a-form-item
            label="再次输入新密码"
            v-bind="formItemLayout">
            <a-input size="large"
                     v-decorator="['password2',{rules: [{ required: true, message: '至少6位密码，区分大小写' }, { validator: this.handlePasswordCheck }],validateTrigger: ['change', 'blur']}]"
                     type="password" autocomplete="false" placeholder="确认密码"></a-input>
          </a-form-item>
          <a-form-item
            v-bind="Layout">
            <a-button type="primary" style='float: right'  @click.stop.prevent="refresh" :loading="loading">
              更新密码</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>

  </div>
</template>

<script>
  import { mixinDevice } from '@/utils/mixin.js'
  import { accountPass,updatePassword } from '@/api/login'
  const levelNames = {
    0: '低',
    1: '低',
    2: '中',
    3: '强'
  }
  const levelClass = {
    0: 'error',
    1: 'error',
    2: 'warning',
    3: 'success'
  }
  const levelColor = {
    0: '#ff0000',
    1: '#ff0000',
    2: '#ff7e05',
    3: '#52c41a',
  }
  export default {
    mixins: [mixinDevice],
    data () {
      return {
        form: this.$form.createForm(this),
        state: {
          time: 60,
          smsSendBtn: false,
          passwordLevel: 0,
          passwordLevelChecked: false,
          percent: 10,
          progressColor: '#FF0000'
        },
        formItemLayout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 },
        },
        Layout: {
          wrapperCol: { span: 24 },
        },
        loading:false
      }
    },
    computed: {
      passwordLevelClass () {
        return levelClass[this.state.passwordLevel]
      },
      passwordLevelName () {
        return levelNames[this.state.passwordLevel]
      },
      passwordLevelColor () {
        return levelColor[this.state.passwordLevel]
      }
    },
    methods:{
      handlePasswordLevel (rule, value, callback) {

        let level = 0

        // 判断这个字符串中有没有数字
        if (/[0-9]/.test(value)) {
          level++
        }
        // 判断字符串中有没有字母
        if (/[a-zA-Z]/.test(value)) {
          level++
        }
        // 判断字符串中有没有特殊符号
        if (/[^0-9a-zA-Z_]/.test(value)) {
          level++
        }
        this.state.passwordLevel = level
        this.state.percent = level * 30
        if (level >= 2) {
          if (level >= 3) {
            this.state.percent = 100
          }
          callback()
        } else {
          if (level === 0) {
            this.state.percent = 10
          }
          callback(new Error('密码强度不够'))
        }
      },
      handlePasswordInputClick () {
        if (!this.isMobile()) {
          this.state.passwordLevelChecked = true
          return
        }
        this.state.passwordLevelChecked = false
      },
      handlePasswordCheck (rule, value, callback) {
        const password = this.form.getFieldValue('password')
        // console.log('value', value)
        if (value === undefined) {
          callback(new Error('请输入密码'))
        }
        if (value && password && value.trim() !== password.trim()) {
          callback(new Error('两次密码不一致'))
        }
        callback()
      },
      refresh(){
        this.loading = true;
        let _this = this;
        this.state.passwordLevelChecked = false
        this.form.validateFields((err, values) => {
          if (!err) {
            let params = {};
            params.password = values.oldPassWord;
            params.newPassword = values.password;
            this.state.passwordLevelChecked = false;
            updatePassword(params).then(res=>{
              if (res.code == '200') {
                this.success('修改成功,请重新登录!',()=>{
                  this.$store.commit('Logout',this);
                });
              }else {
                this.loading = false;
                this.warn(res.msg);
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
    },
    deactivated(){
      this.state.passwordLevelChecked = false;
    },
    activated () {
      this.form.resetFields();
      this.state.passwordLevel = 0;
      this.state.percent = 10;
    },
    watch: {
      'state.passwordLevel' (val) {
      }
    }
  }
</script>

<style lang="less">
  .user-register {

    &.error {
      color: #ff0000;
    }

    &.warning {
      color: #ff7e05;
    }

    &.success {
      color: #52c41a;
    }
  }
</style>