<template>
    <div>
        <a-card>
            <Searchpanel ref="searchPanel" :list="list">
                <div slot="control">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button style="margin-left: 5px" @click="resetForm">重置</a-button>
                </div>
            </Searchpanel>
            <a-button type="primary" class="margin-top-10" @click="exporDrug">导入药品</a-button>
            <a-button class="margin-left-5">下载模板</a-button>
            <a-spin tip="加载中..." :spinning="drugLoading">
                <el-table
                        class="margin-top-10"
                        ref="singleTable"
                        :data="drugData"
                        border
                        style="width: 100%"
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
                        class="pnstyle"
                        v-model="current"
                        :defaultPageSize="10"
                        :pageSize="pageSize"
                        showSizeChanger
                        @change="pageChange"
                        :pageSizeOptions="['10', '20','50']"
                        @showSizeChange="drugSizeChange"
                        size="small"
                >
                </a-pagination>
            </a-spin>
        </a-card>
        <a-modal
                title="导入药品"
                v-model="exModal.visible"
                okText="提交"
                centered
                :maskClosable="false"
        >
            <div style="text-align: center">
                <p>
                    选择供应商：
                    <a-select
                            style="width:250px"
                            v-model="exModal.supplierId"
                    >
                        <a-select-option
                                v-for="(item,index) in exModal.supplierList"
                                :value="item.supplierId"
                                :key="index"
                        >
                            {{item.supplierName}}
                        </a-select-option>
                    </a-select>
                </p>
                <a-upload
                        :fileList="fileList"
                        :beforeUpload="beforeUpload"
                        :remove="handleRemove"
                        accept=".xls,.xlsx"
                >
                    <a-button :disabled="fileList.length == 1">
                        <a-icon type="upload"/>
                        选择文件
                    </a-button>
                </a-upload>
            </div>
            <template slot="footer">
                <a-button key="back" @click="handleCancel">取消</a-button>
                <a-button key="submit" type="primary" :loading="exModal.loading" @click="handleExport">
                    导入
                </a-button>
            </template>
        </a-modal>
    </div>
</template>
<script>
    import {
        supplierDrugData,
        supplierByRole
    } from '@/api/login';

    export default {
        data() {
            return {
                drugLoading: false,
                drugData: [],
                drugColumns: [
                    { title: '供应商', prop: 'supplierName'},
                    { title: '药品编码', prop: 'drugId', width: 100 },
                    { title: '药品名称', prop: 'drugName' },
                    { title: '规格', prop: 'packSpec', width: 200 },
                    { title: '单位', prop: 'packUnit', align: 'center', width: 50 },
                    { title: '生产厂商', prop: 'factoryId' }
                ],
                total: 0,
                current:1,
                //导入modal
                exModal: {
                    visible: false,
                    loading: false,
                    supplierId: null,
                    supplierList: []
                },
                fileList: [],
                pageSize:10
            }
        },
        computed: {
            list() {
                return [
                    { name: '供应商', dataField: 'supplierKeyword', type: 'text' },
                    { name: '药品名称', dataField: 'drugName', type: 'text' },
                    { name: '生产厂商', dataField: 'factoryName', type: 'text' }
                ]
            },
            roleId() {
                return this.$store.state.user.roleId
            },
        },
        mounted() {
            this.fetchSupplierDrugData();
        },
        methods: {
            //搜索
            search() {
                this.current = 1;
                this.pageSize = 10;
                let params = this.$refs.searchPanel.form.getFieldsValue();
                params.pageSize = 10;
                params.offset = 0;
                this.fetchSupplierDrugData(params)
            },
            //重置
            resetForm() {
                this.current = 1;
                this.pageSize = 10;
                this.$refs.searchPanel.form.resetFields();
                this.fetchSupplierDrugData()
            },
            //供应商药品网格页码变化
            pageChange(page, pageSize) {
                let params = this.$refs.searchPanel.form.getFieldsValue();
                params.pageSize = pageSize;
                params.offset = (page - 1) * pageSize;
                this.fetchSupplierDrugData(params)
            },
            drugSizeChange(current,pageSize){
                this.current = 1;
                this.pageSize = pageSize;
                let params = this.$refs.searchPanel.form.getFieldsValue();
                params.pageSize = pageSize;
                params.offset = 0;
                this.fetchSupplierDrugData(params)
            },
            //modal取消
            handleCancel() {
                this.exModal.visible = false;
            },
            //供应商药品数据
            fetchSupplierDrugData(params = { pageSize: 10, offset: 0 }) {
                params.extClass = '1';
                params.roleId = this.roleId;
                this.drugLoading = true;
                supplierDrugData(params).then(res => {
                    if (res.code == '200') {
                        this.drugData = res.rows;
                        this.total = res.total;
                        this.drugLoading = false;
                    } else {
                        this.drugLoading = false;
                        this.warn(res.msg);
                    }
                }).catch(err => {
                    this.drugLoading = false;
                    this.error(err);
                })
            },
            //导入
            exporDrug() {
                this.exModal.supplierId = null;
                this.exModal.visible = true
                this.fetchSupplierByRole()
            },
            //删除选中文件
            handleRemove(file) {
                const index = this.fileList.indexOf(file)
                const newFileList = this.fileList.slice()
                newFileList.splice(index, 1)
                this.fileList = newFileList
            },
            //文件上传之前
            beforeUpload(file) {
                this.fileList = [...this.fileList, file]
                return false
            },
            //导入文件
            handleExport() {
                if (!this.exModal.supplierId) {
                    this.warn('请选择供应商')
                    return
                }
                if (this.fileList.length == 0) {
                    this.warn('请选择文件')
                    return
                }
                const { fileList } = this
                const formData = new FormData()
                fileList.forEach((file) => {
                    formData.append('files[]', file)
                })
                formData.append('extId', this.exModal.supplierId)
                this.exModal.loading = true
                this.$axios.post('/api/biz/uploadExcel/importDrug', formData).then(res => {
                    if (res.data.code == '200') {
                        this.success('导入成功', () => {
                            this.resetForm();
                            this.exModal.visible = false;
                            this.exModal.loading = false;
                        })
                    } else {
                        this.exModal.loading = false;
                        this.warn(res.data.msg)
                    }
                }).catch(err => {
                    this.exModal.loading = false;
                    this.error(err)
                })
            },
            //通过当前角色获取供应商List
            fetchSupplierByRole() {
                let params = {}
                params.roleId = this.roleId
                supplierByRole(params).then(res => {
                    if (res.code == '200') {
                        this.exModal.supplierList = res.rows
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
    .table-add-row {
        border: 1px dashed #D9D9D9;
        text-align: center;
        padding: 5px 0;
        border-radius: 5px;
    }

    .table-add-row:hover {
        cursor: pointer;
    }
</style>