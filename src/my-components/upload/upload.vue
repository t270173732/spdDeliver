<template>
    <div class="clearfix">
        <a-upload
                action="/api/sys/upload/file"
                :listType="type"
                :fileList="fileList"
                @preview="handlePreview"
                @change="handleChange"
                :headers="upLoadHeader"
        >
            <div v-if="fileList.length < count">
                <template v-if="type == 'picture-card'">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">Upload</div>
                </template>
                <template v-else-if="type == 'text'">
                    <a-button>
                        <a-icon type="upload" /> 上传
                    </a-button>
                </template>
            </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    import { ACCESS_TOKEN } from '@/store/mutation-types';
    export default {
        props:{
            count:{
                type:Number,
                require:true
            },
            type:{
                type:String,
                default:'picture-card'
            }
        },
        data () {
            return {
                previewVisible: false,
                previewImage: '',
                fileList: [],
                upLoadHeader:{
                    Authorization:Vue.ls.get(ACCESS_TOKEN)
                },
                imgArr:[]
            }
        },
        methods: {
            handleCancel () {
                this.previewVisible = false
            },
            handlePreview (file) {
                this.previewImage = file.url || file.thumbUrl
                this.previewVisible = true
            },
            handleChange ({file, fileList}) {
                this.fileList = fileList;
                // console.log(file, fileList)
                let imgUrls = []
                fileList.forEach((file,index) => {
                    if (file.response && file.response.code === '200') {
                        this.$message.info("上传成功!")
                        imgUrls.push(file.response.rows[0])

                    }
                    if(file.response && file.response.code != '200'&& file.status == 'done'){
                        this.warn(file.response.msg);
                        if(file.response.code == '401'){
                            Vue.ls.remove(ACCESS_TOKEN)
                            router.replace({
                                path: 'login',
                            });
                        }
                        fileList.splice(index,1)
                        this.fileList = fileList;
                    }
                })
                this.imgArr = imgUrls;
            },
        },
    }
</script>
<style>
    /* you can make up upload button and sample style by using stylesheets */
    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }
</style>