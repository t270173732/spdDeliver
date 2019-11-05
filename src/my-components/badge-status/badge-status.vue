<style lang="less">
    .badge-status {
        font-size: 10px;
        color: rgba(0, 0, 0, .65);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        list-style: none;
        position: relative;
        display: inline-block;
        line-height: 1;
        vertical-align: middle;
        line-height: inherit;
        vertical-align: baseline;
    }
    .badge-status-text {
        color: rgba(0,0,0,.65);
        font-size: 10px;
        margin-left: 4px;
        box-sizing: border-box;
        line-height: inherit;
    }
    .badge-status-dot{
        width: 6px;
        height: 6px;
        display: inline-block;
        border-radius: 50%;
        vertical-align: middle;
        position: relative;
        top: -1px;
    }

    .badge-status-default{
        background-color: #d9d9d9;
    }
    .badge-status-success{
        background-color: #52c41a;
    }
    .badge-status-info{
        background-color: #2db7f5;
    }
    .badge-status-processing{
        background-color: #1890ff;
    }
    .badge-status-error{
        background-color: #f5222d;
    }
    .badge-status-warning{
        background-color: #FC9619;
    }
</style>

<template>
    <span class="badge-status">
        <span :class="'badge-status-dot '" :style="{backgroundColor:bgColor}"></span>
        <span class="badge-status-text">{{value}}</span>
    </span>
</template>

<script>
    import Vue from 'vue';
    export default {
        props: {
            bgColor: {
                type: String,
            },
            value: {
                type: String,
            },
        },
    };
</script>
