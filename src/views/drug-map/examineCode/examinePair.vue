<template>
    <div>
        <a-card>
            <div class="cardHead">
                <a href="#"  @click.prevent="cancle" >
                    <a-icon type="left"></a-icon>
                    返回
                </a>
            </div>
            <a-row>
                <a-col>
                    <a-row>
                        <a-col :lg="{span:8,offset:4}" :md="{span:12,offset:0}">
                            <div class="container">
                                <h2>SPD院内药品</h2>
                                <h3 class="s-font">{{ SPDDrug.clientName }}</h3>
                                <a-spin tip="加载中..." :spinning="spdLoading">
                                    <div class="drugContent">
                                        <div class="innerDiv" style="width:500px">
                                            <p>
                                                <a-badge count="客" :numberStyle="{backgroundColor: '#FF6600',margin:'-2px 0 0 0'}"/>
                                                <span class="title">{{ SPDDrug.drugName }}</span></p>
                                            <p>药品编码： <span class="s-font">{{ SPDDrug.drugId }}</span> </p>
                                            <p>生产厂商： <span class="s-font">{{ SPDDrug.factoryId }}</span> </p>
                                            <p>包装规格： <span class="s-font">{{ SPDDrug.packSpec }}</span> </p>
                                            <p>包装单位： <span class="s-font">{{ SPDDrug.packUnit }}</span> </p>
                                            <p>大包装单位： <span class="s-font">{{ SPDDrug.maxUnit }}</span> </p>
                                            <p>大包装数： <span class="s-font">{{ SPDDrug.maxRatio }}</span> </p>
                                            <div class="contenFoot">
                                                <span>转换系数</span>
                                                <a-divider type="vertical"/>
                                                <a-input-number size="small" :min="1" :max="100000" :defaultValue="1"
                                                                v-model="M"
                                                                @change="onMChange"/>
                                            </div>
                                        </div>
                                    </div>
                                </a-spin>
                            </div>
                        </a-col>
                        <a-col :lg="{span:8,offset:1}" :md="{span:12,offset:0}">
                            <div class="container">
                                <h2>供应商</h2>
                                <h3 class="s-font">{{ YJSDrug.supplierName }}</h3>
                                <a-spin tip="加载中..." :spinning="loading">
                                    <div class="drugContent">
                                        <div class="innerDiv" style="width:500px">
                                            <p>
                                                <a-badge count="供" :numberStyle="{backgroundColor: '#1890FF',margin:'-2px 0 0 0'}"/>
                                                <span class="title">{{ YJSDrug.drugName }}</span></p>
                                            <a-row class="marginCol">
                                                <a-col span="7">药品编码:</a-col>
                                                <a-col span="16">
                                                    <a-input size="small" class="s-font"
                                                             v-model="YJSDrug.drugId"></a-input>
                                                </a-col>
                                            </a-row>
                                            <a-row class="marginCol">
                                                <a-col span="7">生产厂商:</a-col>
                                                <a-col span="16">
                                                    <a-input size="small" class="s-font"
                                                             v-model="YJSDrug.factoryId"></a-input>
                                                </a-col>
                                            </a-row>
                                            <a-row class="marginCol">
                                                <a-col span="7">包装规格:</a-col>
                                                <a-col span="16">
                                                    <a-input size="small" class="s-font"
                                                             v-model="YJSDrug.packSpec"></a-input>
                                                </a-col>
                                            </a-row>
                                            <a-row class="marginCol">
                                                <a-col span="7">包装单位:</a-col>
                                                <a-col span="16">
                                                    <a-input size="small" class="s-font"
                                                             v-model="YJSDrug.packUnit"></a-input>
                                                </a-col>
                                            </a-row>
                                            <a-row class="marginCol">
                                                <a-col span="7">大包装单位:</a-col>
                                                <a-col span="16">
                                                    <a-input size="small" class="s-font"
                                                             v-model="YJSDrug.maxUnit"></a-input>
                                                </a-col>
                                            </a-row>
                                            <a-row class="marginCol">
                                                <a-col span="7">大包装数:</a-col>
                                                <a-col span="16">
                                                    <a-input size="small" class="s-font"
                                                             v-model="YJSDrug.maxRatio"></a-input>
                                                </a-col>
                                            </a-row>
                                            <div class="contenFoot">
                                                <span>转换系数</span>
                                                <a-divider type="vertical"/>
                                                <a-input-number size="small" :min="1" :max="100000" :defaultValue="1"
                                                                v-model="N"
                                                                @change="onNChange"/>
                                            </div>
                                        </div>
                                    </div>
                                </a-spin>
                            </div>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
        </a-card>
        <footer-tool-bar
                :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%',textAlign:'center'}">
            <div slot="center">
                <a-button @click="pre">上一条</a-button>
                <a-button style="margin-left: 50px" type="primary" @click="pass">审核通过</a-button>
                <a-button style="margin-left: 50px" @click="notPass">审核不通过</a-button>
                <a-button style="margin-left: 50px" @click="next">下一条</a-button>
            </div>
        </footer-tool-bar>
        <a-modal
                title="审核不通过"
                v-model="moadl"
                okText="确认"
                cancelText="取消"
                :maskClosable=false
                @ok="ok"
        >
            <p class="s-font"  :class="{ 'fontColor':warnShow }">请输入审核不通过的原因:</p>
            <a-textarea v-model="textareaVal" placeholder="请输入" :rows="4"/>
        </a-modal>
    </div>
</template>
<script>
    import {  examineCode,examineCodeUpdate,examineCodePage } from '@/api/login'
    import FooterToolBar from '@/components/FooterToolbar'
    import { mixin, mixinDevice } from '@/utils/mixin'
    export default {
        mixins: [mixin, mixinDevice],
        data() {
            return {
                SPDDrug:{},
                YJSDrug:{},
                cacheData:[],
                loading:false,
                spdLoading:false,
                moadl:false,
                textareaVal:'',
                offset:0,
                M:1,
                N:1,
                warnShow:false,
                taskData:[]
            }
        },
        components: {
            FooterToolBar
        },
        mounted() {
            this.init()
        },
        methods: {
            init(){
                this.loading = true;
                this.spdLoading = true;
                let params = {};
                params.pageSize = 10;
                params.offset = 0;
                examineCodePage(params).then(res => {
                    if (res.code == '200') {
                        this.taskData = JSON.parse(JSON.stringify(res.rows));
                        for (let i=0;i<this.taskData.length;i++){
                            if(this.taskData[i].erpId == this.$route.params.id){
                                this.getSPD({
                                    id:this.taskData[i].erpId,
                                    drugId:this.taskData[i].erpDrugId
                                })
                                this.getYJS({
                                    id:this.taskData[i].erpId,
                                    extDrugId:this.taskData[i].erpExtDrugId
                                })
                                break;
                            }
                        }
                    } else {
                        this.loading = false;
                        this.spdLoading = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.loading = false;
                    this.spdLoading = false;
                    this.error(err)
                })
            },
            getSPD(values){
                examineCode(values).then(res => {
                    if (res.code == '200') {
                        this.SPDDrug = res.data;
                        this.spdLoading = false;
                    } else {
                        this.spdLoading = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.spdLoading = false;
                    this.error(err)
                })
            },
            getYJS(values){
                examineCode(values).then(res => {
                    if (res.code == '200') {
                        this.YJSDrug = res.data;
                        this.loading = false;
                    } else {
                        this.loading = false;
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.loading = false;
                    this.error(err)
                })
            },
            pre(){
                this.loading = true;
                this.spdLoading = true;
                let index, i , len = this.taskData.length;
                for (i=0; i<len; i++){
                    if(this.taskData[i].erpDrugId == this.SPDDrug.drugId){
                        index = i;
                        break;
                    }
                }
                if(index == 0){
                    this.warn('已经到顶了');
                    this.loading = false;
                    this.spdLoading = false;
                }else{
                    this.getSPD({
                        id:this.taskData[index-1].erpId,
                        drugId:this.taskData[index-1].erpDrugId
                    })
                    this.getYJS({
                        id:this.taskData[index-1].erpId,
                        extDrugId:this.taskData[index-1].erpExtDrugId
                    })
                }
                // let id = this.YJSDrug.erpId
                // if(this.cacheData.indexOf(id)){
                //     let nowId = this.cacheData.indexOf(id)
                //     let preId = this.cacheData[nowId-1]
                //     if(nowId<2){
                //         this.preDisabled = true
                //     }
                //     this.loading = true
                //     examineCodePage({id:preId}).then(res => {
                //         if (res.code == '200') {
                //             this.YJSDrug = res.rows[0]
                //         } else {
                //             this.warn(res.msg)
                //         }
                //         this.loading = false
                //     }).catch(err => {
                //         this.error(err)
                //     })
                // }
            },
            next(){
                this.loading = true;
                this.spdLoading = true;
                let index, i , len = this.taskData.length;
                for (i=0; i<len; i++){
                    if(this.taskData[i].erpDrugId == this.SPDDrug.drugId){
                        index = i;
                        break;
                    }
                }
                console.log(index)
                if(index == (len - 1)){
                    let params = {};
                    params.pageSize = 10;
                    params.offset = len;
                    examineCodePage(params).then(res => {
                        if (res.code == '200') {
                            this.taskData = this.taskData.concat(JSON.parse(JSON.stringify(res.rows)));
                            this.getSPD({
                                id:this.taskData[len].erpId,
                                drugId:this.taskData[len].erpDrugId
                            })
                            this.getYJS({
                                id:this.taskData[len].erpId,
                                extDrugId:this.taskData[len].erpExtDrugId
                            })
                        } else {
                            this.loading = false;
                            this.spdLoading = false;
                            this.warn(res.msg)
                        }
                    }).catch(err => {
                        this.loading = false;
                        this.spdLoading = false;
                        this.error(err)
                    })
                }else {
                    this.getSPD({
                        id:this.taskData[index+1].erpId,
                        drugId:this.taskData[index+1].erpDrugId
                    })
                    this.getYJS({
                        id:this.taskData[index+1].erpId,
                        extDrugId:this.taskData[index+1].erpExtDrugId
                    })
                }
            },
            pass(){
                let prams = {
                    drugId:this.YJSDrug.drugId,
                    factoryId:this.YJSDrug.factoryId,
                    packSpec:this.YJSDrug.packSpec,
                    packUnit:this.YJSDrug.packUnit,
                    maxUnit:this.YJSDrug.maxUnit,
                    maxPackRatio:this.YJSDrug.maxRatio,
                    mRatio:this.M,
                    nRatio:this.N
                }
                prams.id=this.$route.params.id
                prams.status=1
                examineCodeUpdate(prams).then(res => {
                    if (res.code == '200') {
                         this.success('审核成功!', () => {})
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            notPass(){
                this.textareaVal = ''
                this.warnShow = false
                this.moadl = true
            },
            ok(){
                if(this.textareaVal == ''){
                    this.warnShow = true
                }else{
                    let prams = {
                        drugId:this.YJSDrug.drugId,
                        factoryId:this.YJSDrug.factoryId,
                        packSpec:this.YJSDrug.packSpec,
                        packUnit:this.YJSDrug.packUnit,
                        maxUnit:this.YJSDrug.maxUnit,
                        maxPackRatio:this.YJSDrug.maxRatio,
                        mRatio:this.M,
                        nRatio:this.N
                    }
                    prams.id=this.$route.params.id
                    prams.status=2
                    prams.auditReason=this.textareaVal
                    examineCodeUpdate(prams).then(res => {
                        if (res.code == '200') {
                            this.success('审核成功!', () => {})
                        } else {
                            this.warn(res.msg)
                        }
                    }).catch(err => {
                        this.error(err)
                    })
                    this.moadl = false
                }
            },
            cancle(){
                this.$router.push({
                    name:'examineCodeIndex'
                })
            },
            onMChange(val){
                if(val>1){
                    this.N = 1
                }
            },
            onNChange(val){
                if(val>1){
                    this.M = 1
                }
            },
        }
    }
</script>
<style>
    .container {
        margin: 0 auto;
    }
    .s-font{
        opacity: 0.6;
    }
    .fontColor{
        color: #f0092c;
    }
</style>