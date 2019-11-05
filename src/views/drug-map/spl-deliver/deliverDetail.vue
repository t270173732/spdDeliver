<template>
    <div>
        <a-card>
            <div class="cardHead">
                <a href="#" @click.prevent="cancle">
                    <a-icon type="left"></a-icon>
                    返回
                </a>
            </div>
            <a-row>
                <a-col :lg="{span:8,offset:4}" :md="{span:12,offset:0}">
                    <div class="container">
                        <h2>SPD院内药品</h2>
                        <h3>{{ SPDDrug.clientName }}</h3>
                        <a-spin tip="加载中..." :spinning="spdLoading">
                            <div class="drugContent">
                                <div class="innerDiv" style="width:500px">
                                    <p style="line-height: 32px">
                                        <a-badge count="客" :numberStyle="{backgroundColor: '#FF6600',margin:'-2px 0 0 0'}"/>
                                        <span class="title">{{ SPDDrug.clientName }}</span></p>
                                    <p>药品编码：<span class="opacity8">{{ SPDDrug.drugId }}</span></p>
                                    <p>生产厂商：<span class="opacity8">{{ SPDDrug.factoryId }}</span></p>
                                    <p>包装规格：<span class="opacity8">{{ SPDDrug.packSpec }}</span></p>
                                    <p>包装单位：<span class="opacity8">{{ SPDDrug.packUnit }}</span></p>
                                    <p>大包装单位：<span class="opacity8">{{ SPDDrug.maxUnit }}</span></p>
                                    <p>大包装数：<span class="opacity8">{{ SPDDrug.maxRatio }}</span></p>
                                    <div class="contenFoot">
                                        <span>转换系数</span>
                                        <a-divider type="vertical"/>
                                        <a-input-number :min="1" :max="100000" :defaultValue="1"
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
                        <h2>药交所药品</h2>
                        <h3>药交所</h3>
                        <div class="drugContent">
                            <div class="innerDiv" style="width:500px">
                                <p>
                                    <a-badge count="供" :numberStyle="{backgroundColor: '#1890FF',margin:'-2px 0 0 0'}"/>
                                    <a-select
                                            ref="drugSelect"
                                            v-model="value"
                                            placeholder="请搜索..."
                                            style="width:180px;margin-left: 10px"
                                            showSearch
                                            optionLabelProp="title"
                                            :filterOption="false"
                                            @search="fetchDrug"
                                            @change="handleChange"
                                            :notFoundContent="fetching ? undefined : null"
                                    >
                                        <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
                                        <a-select-option
                                                :value='op.id'
                                                v-for="(op,index) in copyData"
                                                :key="index"
                                                :title="op.drugName"
                                        >
                                            <!--{{op.drugName}}-->
                                            <span v-html="op.text" class="search-item-title"></span>
                                            <span class="search-item-info">{{op.packSpec}}/{{op.packUnit}}</span>
                                            <span class="search-item-info">{{op.factoryId}}</span>
                                        </a-select-option>
                                        <a-select-option disabled key="all" v-if="dataSource.length>10&&!isAll">
                                            <a @click="checkAll">查看所有结果</a>
                                        </a-select-option>
                                    </a-select>
                                    <a-popover
                                            trigger="click"
                                            v-model="visible"
                                            placement="rightBottom"
                                    >
                                        <template slot="content">
                                            <a-spin tip="加载中..." :spinning="drugLoading">
                                                <el-table
                                                        class="margin-top-10"
                                                        :data="yjsDrugData"
                                                        size="small"
                                                        style="width: 500px"
                                                        border
                                                        @row-click="rowClick"
                                                >
                                                    <el-table-column
                                                            :show-overflow-tooltip="true"
                                                            :prop="item.prop"
                                                            :label="item.title"
                                                            :key="index"
                                                            v-for="(item,index) in drugColumns"
                                                            :width="item.width"
                                                            :align="item.align"
                                                    >
                                                    </el-table-column>
                                                </el-table>
                                                <a-pagination
                                                        :total="total"
                                                        v-model="current"
                                                        class="pnstyle"
                                                        :defaultPageSize="5"
                                                        @change="pageChange"
                                                        size="small"
                                                >
                                                </a-pagination>
                                            </a-spin>
                                        </template>
                                        <a style="margin-left: 5px" @click="mapDrug">相似药品</a>
                                    </a-popover>
                                </p>
                                <a-row class="marginCol">
                                    <a-col span="7">药品编码:</a-col>
                                    <a-col span="16">
                                        <a-input size="small" :read-only="true" v-model="YJSDrug.drugId"></a-input>
                                    </a-col>
                                </a-row>
                                <a-row class="marginCol">
                                    <a-col span="7">生产厂商:</a-col>
                                    <a-col span="16">
                                        <a-input size="small" v-model="YJSDrug.factoryId"></a-input>
                                    </a-col>
                                </a-row>
                                <a-row class="marginCol">
                                    <a-col span="7">包装规格:</a-col>
                                    <a-col span="16">
                                        <a-input size="small" v-model="YJSDrug.packSpec"></a-input>
                                    </a-col>
                                </a-row>
                                <a-row class="marginCol">
                                    <a-col span="7">包装单位:</a-col>
                                    <a-col span="16">
                                        <a-input size="small" v-model="YJSDrug.packUnit"></a-input>
                                    </a-col>
                                </a-row>
                                <a-row class="marginCol">
                                    <a-col span="7">大包装单位:</a-col>
                                    <a-col span="16">
                                        <a-input size="small" v-model="YJSDrug.maxUnit"></a-input>
                                    </a-col>
                                </a-row>
                                <a-row class="marginCol">
                                    <a-col span="7">大包装数:</a-col>
                                    <a-col span="16">
                                        <a-input size="small" type="number" v-model="YJSDrug.maxPackRatio"></a-input>
                                    </a-col>
                                </a-row>
                                <div class="contenFoot">
                                    <span>转换系数</span>
                                    <a-divider type="vertical"/>
                                    <a-input-number :min="1" :max="100000" :defaultValue="1"
                                                    v-model="N"
                                                    @change="onNChange"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </a-card>
        <footer-tool-bar
                :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%',textAlign:'center'}">
            <div slot="center">
                <a-button @click="pre" :loading="updateLoading">上一条</a-button>
                <a-button type="primary" class="btnMarginLeft" @click="update" :loading="updateLoading">更新</a-button>
                <a-button class="btnMarginLeft" @click="next" :loading="updateLoading">下一条</a-button>
            </div>
        </footer-tool-bar>
    </div>
</template>
<script>
    import {
        getYJSDrugData,
        YJSDrugSingleData,
        yjsDrugMap,
        getDrugListData,
        getDrugDetail,
        similardDrugData,
        mappingYSJ
    } from '@/api/login'
    import debounce from 'lodash/debounce'
    import { pinyinMatch } from '@/utils/misc'
    import FooterToolBar from '@/components/FooterToolbar'
    import { mixin, mixinDevice } from '@/utils/mixin'

    export default {
        mixins: [mixin, mixinDevice],
        data() {
            this.fetchDrug = debounce(this.fetchDrug, 800)
            return {
                SPDDrug: {},
                YJSDrug: {},
                dataSource: [],
                copyData: [],
                drugLoading: false,
                yjsDrugData: [],
                drugColumns: [
                    { title: '药品编码', prop: 'drugId' },
                    { title: '药品名称', prop: 'drugName' },
                    { title: '规格', prop: 'packSpec' },
                    { title: '单位', prop: 'packUnit', align: 'center' },
                    { title: '生产厂商', prop: 'factoryId' }
                ],
                visible: false,
                upDown: [],
                M: 1,
                N: 1,
                offset:0,
                total: 0,
                current:1,
                value: '',
                fetching: false,
                updateLoading: false,
                isAll: false,
                taskData:[],
                spdLoading:false
            }
        },
        components: {
            FooterToolBar
        },
        mounted() {
            this.init()
            // this.fetchDrugListData();
        },
        methods: {
            //任务详情
            init() {
                let params = {};
                params.pageSize = 10;
                params.offset = 0;
                params.statusErp = '1';
                params.drugSource = '3';
                yjsDrugMap(params).then(res => {
                    if (res.code == '200') {
                        this.taskData = JSON.parse(JSON.stringify(res.rows));
                        this.taskData.forEach(item=>{
                            if(item.id == this.$route.params.id){
                                this.SPDDrug = item
                            }
                        })
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            //根据输入值获取药品数据
            fetchDrug(value) {
                this.dataSource = []
                this.fetching = true
                let params = {}
                params.extClass = '3'
                params.extId = '-999'
                params.keyword = value
                getDrugListData(params).then(res => {
                    if (res.code == '200') {
                        // this.dataSource = res.rows;
                        this.dataSource = pinyinMatch(res.rows, value, 'drugName')
                        this.copyData = this.dataSource.splice(0, 10)
                        this.fetching = false
                    } else {
                        this.fetching = false
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.fetching = false
                    this.error(err)
                })
            },
            //选中药品获取药品详情
            handleChange(value) {
                getDrugDetail({ id: value }).then(res => {
                    if (res.code == '200') {
                        this.YJSDrug = res.data
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            },
            //更新
            update() {
                this.updateLoading = true
                if (!this.YJSDrug.id) {
                    this.warn('请选择药品')
                    this.updateLoading = false
                    return
                }
                let params = this.YJSDrug
                console.log(params)
                if(params.maxPackRatio){
                    params.maxPackRatio = parseInt(params.maxPackRatio)
                }
                params.taskId = this.SPDDrug.id
                params.mRatio = this.M
                params.nRatio = this.N
                mappingYSJ(params).then(res => {
                    if (res.code == '200') {
                        this.success('对码成功', () => {
                            this.next()
                            this.M = 1
                            this.N = 1
                            this.updateLoading = false
                        })
                    } else {
                        this.updateLoading = false
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.updateLoading = false
                    this.error(err)
                })
            },
            //上一条
            pre() {
                this.spdLoading = true;
                this.updateLoading = true;
                let index, i , len = this.taskData.length;
                for (i=0; i<len; i++){
                    if(this.taskData[i].id == this.SPDDrug.id){
                        index = i;
                        break;
                    }
                }
                if(index == 0){
                    this.warn('已经到顶了');
                    this.spdLoading = false;
                    this.updateLoading = false;
                }else{
                    this.SPDDrug = this.taskData[index-1];
                    this.spdLoading = false;
                    this.updateLoading = false;
                }
            },
            //下一条
            next() {
                this.spdLoading = true;
                let index, i , len = this.taskData.length;
                for (i=0; i<len; i++){
                    if(this.taskData[i].id == this.SPDDrug.id){
                        index = i;
                        break;
                    }
                }
                if(index == (len - 1)){
                    this.updateLoading = true;
                    let params = {};
                    params.statusErp = '1';
                    params.drugSource = '3';
                    params.pageSize = 10;
                    params.offset = len;
                    yjsDrugMap(params).then(res => {
                        if (res.code == '200') {
                            this.taskData = this.taskData.concat(JSON.parse(JSON.stringify(res.rows)));
                            this.SPDDrug = this.taskData[len];
                            this.spdLoading = false;
                            this.updateLoading = false;
                        } else {
                            this.spdLoading = false;
                            this.updateLoading = false;
                            this.warn(res.msg)
                        }
                    }).catch(err => {
                        this.spdLoading = false;
                        this.updateLoading = false;
                        this.error(err)
                    })
                }else{
                    this.SPDDrug = this.taskData[index + 1];
                    this.spdLoading = false;
                }
            },
            //返回首页
            cancle() {
                this.$router.push({
                    name: 'yjs-map'
                })
            },
            //M值变化
            onMChange(val) {
                if (val > 1) {
                    this.N = 1
                }
            },
            //N值变化
            onNChange(val) {
                if (val > 1) {
                    this.M = 1
                }
            },
            checkAll() {
                this.copyData = this.dataSource
                this.isAll = true
            },
            //气泡网格选中行
            rowClick(row, column, event) {
                this.YJSDrug = row
                this.value = row.id
                // this.$refs.drugSelect.value = row.drugName;
                this.visible = false
            },
            //相似药品
            mapDrug() {
                this.current = 1;
                this.fetchYJSDrugData(this.SPDDrug)
            },
            //气泡网格页码变化
            pageChange(page, pageSize) {
                let params = this.SPDDrug;
                params.offset = (page - 1) * pageSize;
                this.fetchYJSDrugData(params)
            },
            fetchYJSDrugData(value = {}) {
                this.yjsDrugData = []
                this.drugLoading = true
                let params = value
                params.pageSize = value.pageSize || 5
                params.offset = value.offset || 0
                params.extClass = '3'
                params.extId = '-999'
                similardDrugData(params).then(res => {
                    if (res.code == '200') {
                        this.yjsDrugData = res.rows
                        this.dataSource = pinyinMatch(res.rows, null, 'drugName')
                        this.copyData = this.dataSource
                        this.total = res.total
                        this.drugLoading = false
                    } else {
                        this.drugLoading = false
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.drugLoading = false
                    this.error(err)
                })
            },
            fetchDrugListData() {
                let params = {}
                params.extClass = '3'
                params.extId = '-999'
                getDrugListData(params).then(res => {
                    if (res.code == '200') {
                        this.dataSource = res.rows
                    } else {
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.error(err)
                })
            }
        }
    }
</script>
<style>
    .container {
        /*text-align: center;*/
        margin: 0 auto;
    }
</style>