<template>
  <a-modal
    title="修改头像"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :width="800"
    @cancel="cancelHandel">
    <a-row>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="true"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixedBox="option.fixedBox"
          @realTime="realTime"
        ></vueCropper>
      </a-col>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img"/>
        </div>
      </a-col>
    </a-row>

    <template slot="footer">
      <a-button key="back" @click="cancelHandel">取消</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="okHandel">保存</a-button>
    </template>
  </a-modal>
</template>
<script>
  import { VueCropper } from 'vue-cropper'

  export default {
    components: {
      VueCropper
    },
    data() {
      return {
        visible: false,
        id: null,
        confirmLoading: false,

        option: {
          img: '',
          outputSize:1, //剪切后的图片质量（0.1-1）
          full: false,//输出原图比例截图 props名full
          outputType: 'png',
          canMove: true,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          autoCropWidth: 150,
          autoCropHeight: 150,
          fixedBox: true
        },
        previews: {},
      }
    },
    methods: {
      edit(id) {
        this.visible = true
        this.id = id
        /* 获取原始头像 */

      },
      close() {
        this.id = null
        this.visible = false
      },
      cancelHandel() {
        this.close()
      },
      okHandel() {
        const vm = this

        vm.confirmLoading = true
        setTimeout(() => {
          vm.confirmLoading = false
          vm.close()
          vm.$message.success('上传头像成功')
        }, 2000)

      },

      realTime(data) {
        this.previews = data
      }
    }
  }
</script>

<style lang="less" scoped>

  .avatar-upload-preview {
    position: absolute;
    top: 50%;
    transform: translate(50%, -50%);
    width: 180px;
    height: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>