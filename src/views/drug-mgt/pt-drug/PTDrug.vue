<style>
    @import "../supplier-drug/index.css";
</style>
<template>
    <div>
        <a-card>
            <Searchpanel ref="searchPanel" :list="list">
                <div slot="control">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
                </div>
            </Searchpanel>
            <a-button type="primary" class="margin-top-10" @click="addDrug">新建</a-button>
            <a-upload
                    action="/api/biz/uploadExcel/importDrug?extId=-999&extClass=3"
                    style="display: inline-block"
                    :showUploadList="false"
                    @change="handleChange"
                    accept=".xls,.xlsx"
            >
                <a-button class="margin-left-5" :loading="upLoading">导入药品</a-button>
            </a-upload>
            <a-button class="margin-left-5">下载模板</a-button>
            <a-spin tip="加载中..." :spinning="fetching">
                <el-table
                        class="margin-top-10"
                        ref="singleTable"
                        :data="drugData"
                        style="width: 100%"
                >
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="120"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <a @click="edit(scope.row)">编辑</a>
                            <a-divider type="vertical"/>
                            <a-popconfirm title="确认启用吗？" @confirm="updateStatus(scope.row,1)" v-if="scope.row.status == '0'">
                                <a style="color:#E6A23C">启用</a>
                            </a-popconfirm>
                            <a-popconfirm title="确认停用吗？" @confirm="updateStatus(scope.row,0)" v-else>
                                <a style="color:#E6A23C">停用</a>
                            </a-popconfirm>
                        </template>
                    </el-table-column>
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <detail-list :col="4">
                                <detail-list-item term="包装转换系数">{{ props.row.packRatio }}</detail-list-item>
                                <detail-list-item term="拼音码">{{ props.row.spellCode }}</detail-list-item>
                                <detail-list-item term="备注">{{ props.row.remark }}</detail-list-item>
                            </detail-list>
                            <!--<a-form layout="inline">-->
                                <!--<a-form-item label="包装转换系数" >-->
                                    <!--<span>{{ props.row.packRatio }}</span>-->
                                <!--</a-form-item>-->
                                <!--<a-form-item label="拼音码">-->
                                    <!--<span>{{ props.row.spellCode }}</span>-->
                                <!--</a-form-item>-->
                                <!--<a-form-item label="备注">-->
                                    <!--<span>{{ props.row.remark }}</span>-->
                                <!--</a-form-item>-->
                            <!--</a-form>-->
                        </template>
                    </el-table-column>
                    <el-table-column
                            :show-overflow-tooltip="true"
                            :prop="item.prop"
                            :label="item.title"
                            :key="index"
                            v-for="(item,index) in drugColumns"
                            :width="item.width"
                            :align="item.align"
                    >
                        <template slot-scope="scope">
                            <span v-if="item.prop == 'status'">
                                <a-badge :status="scope.row.status == 0? 'default':'processing'"
                                         :text="scope.row.status == 0?'停用':'启用'"/>
                            </span>
                                <span v-else>
                                {{scope.row[item.prop]}}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <a-pagination
                        :total="total"
                        showSizeChanger
                        class="pnstyle"
                        v-model="current"
                        :defaultPageSize="10"
                        :pageSizeOptions="['10', '20','50']"
                        @showSizeChange="PTSizeChange"
                        @change="pageChange"
                        size="small"
                >
                </a-pagination>
            </a-spin>
        </a-card>
    </div>
</template>
<script>
    import { getYJSDrugData, updatePTDrug } from '@/api/login';
    import DetailList from '@/components/tools/DetailList';
    const DetailListItem = DetailList.Item

    export default {
        data() {
            return {
                fetching: false,
                drugData: [],
                drugColumns: [
                    { title: '药品编码', prop: 'drugId', width: 100 },
                    { title: '药品名称', prop: 'drugName' },
                    { title: '规格', prop: 'packSpec' },
                    { title: '单位', prop: 'packUnit', align: 'center', width: 80 },
                    { title: '生产厂商', prop: 'factoryId' },
                    { title: '状态', prop: 'status', align: 'center', width: 80 }
                ],
                total: null,
                current:1,
                upLoading: false
            }
        },
        components:{
            DetailList,
            DetailListItem
        },
        computed: {
            list() {
                return [
                    { name: '药品名称', dataField: 'keyword', type: 'text' },
                    { name: '生产厂商', dataField: 'factoryName', type: 'text' },
                    {
                        name: '状态',
                        dataField: 'status',
                        type: 'select',
                        keyExpr: 'id',
                        valueExpr: 'text',
                        dataSource: this.enum.status
                    }
                ]
            },
            roleId() {
                return this.$store.state.user.roleId
            }
        },
        mounted() {
            this.fetchYJSData()
        },
        methods: {
            //搜索
            search() {
                this.current = 1;
                let params = this.$refs.searchPanel.form.getFieldsValue()
                this.fetchYJSData(params)
            },
            //重置
            resetForm() {
                this.current = 1;
                this.$refs.searchPanel.form.resetFields()
                this.fetchYJSData()
            },
            pageChange(page, pageSize) {
                let params = this.$refs.searchPanel.form.getFieldsValue();
                params.offset = (page - 1) * pageSize;
                this.fetchYJSData(params)
            },
            PTSizeChange(current,size){
                this.current = 1;
                let params = this.$refs.searchPanel.form.getFieldsValue();
                params.pageSize = size;
                this.fetchYJSData(params)
            },
            //新建药品
            addDrug(){
                this.$router.push({
                    name:'PTDrugDetail',
                    params:{id:0}
                })
            },
            edit(row){
                this.$router.push({
                    name:'PTDrugDetail',
                    params:{ id:row.id }
                })
            },
            updateStatus(row,val){
                let params = {};
                params.id = row.id;
                params.status = val;
                updatePTDrug(params).then(res => {
                    if (res.code == '200') {
                        this.success('操作成功',()=>{
                            this.resetForm();
                        })
                    } else {
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.error(err);
                })
            },
            //导入药品
            handleChange(info) {
                if (info.file.status == 'done') {
                    this.upLoading = false
                    if (info.file.response.code == 800) {
                        this.warn(info.file.response.msg)
                    }
                } else if (info.file.status == 'error') {
                    this.upLoading = false
                    this.error('上传失败')
                } else {
                    this.upLoading = true
                }
            },
            fetchYJSData(value = {}) {
                this.fetching = true
                let params = value
                params.pageSize = value.pageSize || 10
                params.offset = value.offset || 0
                params.extClass = '3'
                params.extId = '-999'
                params.roleId = this.roleId
                getYJSDrugData(params).then(res => {
                    if (res.code == '200') {
                        this.drugData = res.rows
                        this.total = res.total
                        this.fetching = false
                    } else {
                        this.fetching = false
                        this.warn(res.msg)
                    }
                }).catch(err => {
                    this.fetching = false
                    this.error(err)
                })
            }
        }
    }
</script>