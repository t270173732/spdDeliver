<template>
  <result
    :isSuccess="true"
    :content="false"
    :title="title"
    :description="description">
    <template slot="action">
      <a-button size="large" style="margin-left: 8px" @click="goHomeHandle">返回首页</a-button>
    </template>
  </result>
</template>

<script>
  import Result from '@/views/result/Result'

  export default {
    name: 'RegisterResult',
    components: {
      Result
    },
    data () {
      return {
        description: '你的账户申请已发送后台提交管理员审核,请等待后台审核通过的通知。',
        form: {},
        title:'',
      }
    },
    // computed: {
    //   account () {
    //     setTimeout(()=>{
    //       const v = this.form && this.form.account || 'xxx'
    //       const title = `你的账户：${v}提交注册审核成功`
    //       return title
    //     },500)
    //   }
    // },
    // created () {
    //   this.form = this.$route.query
    // },
    mounted(){
      this.form = this.$route.query;
      setTimeout(()=>{
        // const v = this.form && this.form || 'xxx'
        this.title = `你的账户：`+this.form.account+`提交注册审核成功`
      },500)
    },
    methods: {
      goHomeHandle () {
        this.$router.push({ name: 'login' })
      }
    }
  }
</script>

<style scoped>

</style>