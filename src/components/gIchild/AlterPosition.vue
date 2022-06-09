<template>
    <el-dialog title="确认修改" width="400px" :visible="visible" :before-close="close" custom-class="popup">
        <span>确认进行权限变更？</span>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="warning" @click="realAlterP">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>

export default {
    props:['visible'],
    methods:{
        close() {
            this.$emit("update:visible",false);
            //console.log('closed');
        },
        realAlterP() {
            this.$parent.alterposition();
            this.close();
        }
    }
}
</script>

<style>
    .popup
    {
        border-radius: 6px;
    }
</style>
<style scoped>
    ::v-deep .el-dialog__header
    {
        font-size: 20px;
        margin-left: 20px;
        line-height: 20px;
        font-weight: bold;
    }
    span
    {
        font-family: "PingFang SC","HarmonyOS_Regular";
        font-size: 18px;
        font-weight: normal;
        text-align: center;
        padding-top: 20px;
    }
    ::v-deep .el-dialog__body
    {
        padding: 15px 40px;
        line-height: 40px;
    }
</style>
