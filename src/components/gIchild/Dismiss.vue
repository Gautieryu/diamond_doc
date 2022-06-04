<template>
    <el-dialog width="400px" :visible="visible" :before-close="close">
        <p>是否解散此团队？</p>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="danger" @click="realDismiss">确 定</el-button>
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
        realDismiss() {
            this.$parent.disband();
            this.close();
        }
    }
}
</script>

<style scoped>
    p
    {
        font-size: 30px;
        text-align: center;
        padding-top: 20px;
    }
    ::v-deep .el-dialog__body
    {
        padding: 15px 20px;
    }
</style>