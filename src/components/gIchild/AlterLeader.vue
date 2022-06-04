<template>
    <el-dialog title="队长转让" width="400px" :visible="visible" :before-close="close">
        <el-form>
            <el-form-item label="成员email">
                <el-input v-model="memberEmail" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="realAlterL">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>

export default {
    props:['visible'],
    data() {
        return {
            memberEmail:""
        }
    },
    methods:{
        close() {
            this.$emit("update:visible",false);
            this.memberEmail="";
            //console.log('closed');
        },
        realAlterL() {
            this.$parent.alterleader(this.memberEmail);
            this.close();
        }
    }
}
</script>

<style scoped>
    ::v-deep .el-dialog__header
    {
        font-size: 20px;
        text-align: center;
    }
    ::v-deep .el-dialog__body
    {
        padding: 5px 20px;
    }
</style>