<template>
    <a-card>
        <a-spin tip="加载中..." :spinning="spinning">
            <el-table
                    class="margin-top-10"
                    :data="dataSource"
                    border
                    style="width: 100%"
                    ref="table"
                    @selection-change="onSelectChange"
            >
                <el-table-column
                        type="selection"
                        width="55"
                ></el-table-column>
                <el-table-column
                        :show-overflow-tooltip="true"
                        :prop="item.prop"
                        :label="item.title"
                        :key="index"
                        v-for="(item,index) in columns"
                        :width="item.width"
                        :align="item.align"
                >
                    <template slot-scope="scope">
                        <span v-if="item.prop == 'clientClass'" v-html="clientClass(scope.row.clientClass)"></span>
                        <span v-else-if="item.prop == 'clientLevel'" v-html="clientLevel(scope.row.clientLevel)"></span>
                        <span v-else>{{scope.row[item.prop]}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </a-spin>
        <footer-tool-bar :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}">
            <a-button @click="cancel" slot="back" icon="left">返回</a-button>
            <a-button type="primary" @click="submit" :loading="loading">保存</a-button>
        </footer-tool-bar>
    </a-card>
</template>
<script>
    import FooterToolBar from '@/components/FooterToolbar';
    import { mixin, mixinDevice } from '@/utils/mixin.js';
    import { getDataRight, setDataPermissions } from '@/api/login';
    export default {
        mixins: [mixin,mixinDevice],
        data(){
            return{
                spinning:false,
                dataSource:[],
                columns: [
                    { title: '编码', prop: 'clientId',width:100 },
                    { title: '客户名称', prop: 'clientName' },
                    { title: '联系人', prop: 'contacts', width: 100 },
                    { title: '联系电话', prop: 'phone', width: 120 },
                    { title: '地址', prop: 'address' },
                    { title: '分类', prop: 'clientClass', align: 'center' },
                    { title: '级别', prop: 'clientLevel', width: 80, align: 'center' }
                ],
                selectRows:[],
                loading:false
            }
        },
        mounted() {
            this.getData();
        },
        methods:{
            cancel(){
                this.$router.push({
                    name:'userIndex'
                })
            },
            onSelectChange(selection){
                this.selectRows = selection;
            },
            submit(){
                this.loading = true;
                let params = {},clientIds = [];
                this.selectRows.map(item =>{
                    clientIds.push(item.clientId)
                })
                params.ids = clientIds;
                params.account = this.$route.params.id;
                setDataPermissions(params).then(res => {
                    if (res.code == '200') {
                        this.success('设置成功!',()=>{
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
            },
            clientLevel(row){
                let level
                if(row != undefined){
                    this.enum.clientLevel.map((data)=>{
                        if(data.id == row){
                            level = data.text
                        }
                    })
                }
                return level
            },
            clientClass(row){
                let clientclass
                if(row != undefined){
                    this.enum.clientClass.map((data)=>{
                        if(data.id == row){
                            clientclass = data.text
                        }
                    })
                }
                return clientclass
            },
            getData(){
                this.spinning = true;
                let params = {};
                params.status = '1';
                params.account = this.$route.params.id;
                getDataRight(params).then(res => {
                    if (res.code == '200') {
                        let selected = [];
                        this.dataSource = res.data.client;
                        res.data.rights.map(right =>{
                            res.data.client.map(client =>{
                                if(right.dataId == client.clientId){
                                    this.$nextTick(()=>{
                                        this.$refs.table.toggleRowSelection(client);
                                    })

                                }
                            })
                        })
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
        }
    }
</script>