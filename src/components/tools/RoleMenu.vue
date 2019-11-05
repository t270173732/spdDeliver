<template>
    <div v-if="roles.length">
        <span v-if="roles.length == 1">{{roles[0].roleName}}</span>
        <a-dropdown v-else>
            <span class="ant-dropdown-link">
                {{currentName}} <a-icon type="down" />
            </span>
            <a-menu slot="overlay" @click="onClick">
                <a-menu-item
                        v-for="(item,index) in roles"
                        :key="index"
                >
                    <a href="javascript:;">{{item.roleName}}</a>
                </a-menu-item>
            </a-menu>
        </a-dropdown>
    </div>
</template>
<script>
    import { mapActions } from 'vuex';
    export default {
        data(){
            return{

            }
        },
        computed:{
            roles(){
                return this.$store.state.user.roles;
            },
            currentName(){
                return this.$store.state.user.roleName;
            }
        },
        mounted(){

        },
        methods:{
            ...mapActions( 'page',['closeAll']),
            onClick({key}){
                console.log(key)
                let obj;
                obj = this.roles[key]
                // this.roles.forEach((item)=>{
                //     if(item.roleId = key){
                //         // this.currentName = item.roleName;
                //         obj = item;
                //     }
                // })
                this.$store.commit('SET_CURRENT_ROLE',obj);
                this.$store.commit('setUserModuleList',obj.roleId);
                this.closeAll(this)
            }
        },
        // watch:{
        //     curRole(value){
        //         this.currentName = value.roleName
        //     }
        // }
    }
</script>