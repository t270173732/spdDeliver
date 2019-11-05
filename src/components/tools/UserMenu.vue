<template>
  <div class="user-wrapper">
    <top-lock  class="action"/>
    <!--<header-notice class="action"/>-->
    <err-log class="action"/>
      <role-menu class="action"/>
    <a-dropdown>
            <span class="action ant-dropdown-link user-dropdown-menu">
              <a-avatar class="avatar" size="small" v-if="avatar()==undefined||avatar().length === 0" style="background-color:#F0F2F5 ">{{nickname().substr(0,1)}}</a-avatar>
              <a-avatar class="avatar" size="small" v-else :src="avatar()"></a-avatar>
                <span>{{ nickname() }}</span>
            </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <a-menu-item key="1" v-if="nickname() != 'admin'">
          <router-link :to="{ name: 'settings' }">
            <a-icon type="setting"/>
            <span>账户设置</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <a href="javascript:;" @click="handleLogout">
            <a-icon type="logout"/>
            <span>退出登录</span>
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
  import HeaderNotice from './HeaderNotice'
  import ErrLog from './ErrLog'
  import TopLock from './TopLock'
  import RoleMenu from './RoleMenu'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'UserMenu',
    components: {
      HeaderNotice,
      ErrLog,
      TopLock,
        RoleMenu
    },
    methods: {
      // ...mapActions(['Logout']),
      ...mapGetters(['nickname', 'avatar']),
      handleLogout() {
        const that = this
        this.$confirm({
          title: '提示',
          content: '真的要注销登录吗 ?',
          onOk() {
            // return that.Logout({}).then(() => {
            //   window.location.reload()
            // }).catch(err => {
            //   that.$message.error({
            //     title: '错误',
            //     description: err.message
            //   })
            // })
              that.$store.commit('Logout',that);
          },
          onCancel() {
          }
        })
      }
    }
  }
</script>