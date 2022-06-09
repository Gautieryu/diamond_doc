<template>
    <el-dialog title="邀请成员" width="400px" :visible="visible" :before-close="close" custom-class="popup">
        <el-form>
            <el-form-item label="成员email">
                <el-input v-model="memberEmail" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="info" v-show="memberEmail.length==0" plain disabled>确 定</el-button>
            <el-button type="primary" v-if="memberEmail.length" @click="realInvite">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>

export default {
    props:['visible'],
    data() {
        return {
            memberEmail: "",
        }
    },
    methods:{
        close() {
            this.$emit("update:visible",false);
            this.memberEmail="";
            //console.log('closed');
        },
        realInvite() {
            this.$parent.invitemember(this.memberEmail);
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
        font-weight: bold;
    }
    ::v-deep .el-dialog__body
    {
        padding: 10px 10px;
    }
    ::v-deep .el-dialog__footer
    {
        padding: 10px 40px 20px;
    }
    ::v-deep .el-form-item
    {
        padding: 0 30px;
        margin-bottom: 10px;
    }
</style>
