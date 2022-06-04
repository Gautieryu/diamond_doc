<template>
    <el-dialog title="新建文档" width="400px" :visible="visible" :before-close="close">
        <el-form>
            <el-form-item label="文档名">
                <el-input v-model="docName" auto-complete="off"></el-input>
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
    props:['visible'],
    data() {
        return {
            docName: "",
        }
    },
    methods:{
        close() {
            this.$emit("update:visible",false);
            this.docName="";
            //console.log('closed');
        },
        realNew() {
            var re=/[a-zA-Z0-9]{1,20}/;
            if(re.test(this.docName))
            {
                this.$parent.newdoc(this.docName);
                this.close();
            }
            else this.$message.warning('文档名不符合要求');
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
