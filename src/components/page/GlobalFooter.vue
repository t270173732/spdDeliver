<template>
    <div class="footer">
        <div class="copyright">
            <!--<span>当前版本: {{productInfo}}</span>-->
            <span>Copyright© {{year}} 重庆双达科技有限公司</span>
        </div>
    </div>
</template>

<script>
    import setting from '@/setting.js'

    export default {
        name: 'LayoutFooter',
        data() {
            return {
                productInfo: setting.releases.name + ' ' + setting.releases.version,
                year:''
            }
        },
        mounted(){
            this.year = new Date().getFullYear();
        }
    }
</script>

<style lang="less" scoped>
    .footer {
        padding: 0 16px;
        margin: 10px 0px;
        text-align: center;

        .links {
            margin-bottom: 8px;

            a {
                color: rgba(0, 0, 0, .45);

                &:hover {
                    color: rgba(0, 0, 0, .65);
                }

                &:not(:last-child) {
                    margin-right: 40px;
                }
            }
        }
        .copyright {
            color: rgba(0, 0, 0, .45);
            font-size: 14px;
        }
    }
</style>