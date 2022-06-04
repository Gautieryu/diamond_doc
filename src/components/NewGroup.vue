<template>
    <el-dialog title="新建团队" width="400px" :visible="visible" :before-close="close">
        <el-form>
            <el-form-item label="团队名(不超过20字符的数字字母)">
                <el-input v-model="groupName" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="realNew">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>

export default {
    props:['visible','email'],
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
            var re=/[a-zA-Z0-9]{1,20}/;
            if(re.test(this.groupName))
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
    }
    ::v-deep .el-dialog__body
    {
        padding: 5px 20px;
    }
</style>