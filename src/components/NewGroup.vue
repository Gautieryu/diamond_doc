<template>
    <el-dialog title="创建新团队" width="500px" :visible="visible" :before-close="close">
        <el-form>
            <el-form-item label="团队名(不超过20字符的数字或字母)">
                <el-input v-model="groupName" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="info" v-show="groupName.length==0" plain disabled>确 定</el-button>
            <el-button type="primary" v-if="groupName.length" @click="realNew">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>

export default {
    props:['visible'],
    data() {
        return {
            groupName: "",
        }
    },
    methods:{
        close() {
            this.$emit("update:visible",false);
            this.groupName="";
            //console.log('closed');
        },
        realNew() {
            // judge groupname there
            if(this.groupName.length<=20)
            {
                this.$parent.newGroup(this.groupName);
                this.close();
            }
            else this.$message.warning('团队名不符合要求');
        }
    },
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
    ::v-deep .el-form-item
    {
        padding: 0 30px;
        margin-bottom: 10px;
    }
    ::v-deep .el-dialog__footer
    {
        padding: 10px 40px 20px;
    }
</style>
