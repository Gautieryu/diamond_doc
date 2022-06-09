<template>
    <el-dialog title="确认操作" width="400px" :visible="visible" :before-close="close" custom-class="popup">
        <span>是否退出此团队？退出后只能再通过邀请加入。</span>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="danger" @click="realLeave">确 定</el-button>
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
        realLeave() {
            this.$parent.leaveteam();
            this.close();
        }
    }
}
</script>

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
