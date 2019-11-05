<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="10">

        <a-form layout="vertical" :form="form"  :hideRequiredMark="true">
          <a-form-item>
            <span slot="label" class="textBlod">账号</span>
            <span style="color: #5f5f5f">{{userData.account}}</span>
          </a-form-item>
          <a-form-item>
            <span slot="label" class="textBlod">用户名</span>
            <a-input placeholder="请输入用户名"
                     v-decorator="[ 'username',{rules: [{ required: true, message: '请输入用户名' },{massage:'输入用户名过长',max:10}]}]"/>
          </a-form-item>

          <a-form-item>
            <span slot="label" class="textBlod">联系电话</span>
            <a-input size="large"
                     v-decorator="['phone',{rules: [{ required: true,message: '请输入手机号' },{ message: '请输入正确的手机号', pattern: /^((0\d{2,3}-?\d{7,8})|(1[3567984]\d{9}))$/ }], validateTrigger: ['change', 'blur'] }]"
                     placeholder="11 位手机号">
            </a-input>
          </a-form-item>

          <a-form-item
            label="邮箱"
            :required="false"
          >
            <a-input placeholder="exp@admin.com"
            v-decorator="['email',{rules: [{  type: 'email', message: '请输入邮箱地址' }]}]"/>
          </a-form-item>

          <a-form-item>
            <a-button type="primary"  @click.stop.prevent="editor">
              更新信息</a-button>
            <!--<a-button style="margin-left: 8px">保存</a-button>-->
          </a-form-item>
        </a-form>

      </a-col>
    </a-row>
  </div>
</template>

<script>
  import AvatarModal from './AvatarModal'
  import { VueCropper } from 'vue-cropper'
  import { sysUser,updateUser } from '@/api/login'
  export default {
    components: {
      AvatarModal,
      VueCropper
    },
    data () {
      return {
        userData:{},
        roleTags: [],
        clientTags:[],
        previews: {},
        option: {
          img: '',
          info: true,
          size: 1,
          outputType: 'jpeg',
          canScale: false,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 180,
          autoCropHeight: 180,
          fixedBox: true,
          // 开启宽度和高度比例
          fixed: true,
          fixedNumber: [1, 1]
        },
        picModal: {
          visible: false,
          confirmLoading:false,
        },
        imageData:null,
        form: this.$form.createForm(this),
        spinning:false,
      }
    },

    mounted(){
      this.pickUserData();

    },
    methods: {
      pickUserData(){
        sysUser({}).then(res=>{
          if (res.code == '200') {
            this.userData = res.data;
            this.roleTags = res.data.role;
            this.clientTags = res.data.client;
            this.option.img ='http://192.168.0.150:40080/res/'+res.data.avatar;
            this.form.setFieldsValue({username:res.data.username,phone:res.data.phone,email:res.data.email});
          }else {
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err)
        })
      },
      //更新信息
      editor(){
        this.form.validateFields((err, values) => {
          console.log(err);
          if (!err){
            values.account = this.userData.account;
            updateUser(values).then(res=>{
              if (res.code == '200') {
                this.success('更新成功!')
              }else {
                this.warn(res.msg);
              }
            }).catch(err => {
              this.error(err)
            })
          }
        })
      }
    },
    deactivated(){
      // this.form.resetFields();
    },


  }
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }
  .up-button{
    width: 100%;
    text-align: center;
    margin-top: 10px;
  }
  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 150px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      /*width: 100%;*/
      width: 150px;
      height: 150px;
      /*height: 100%;*/
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>