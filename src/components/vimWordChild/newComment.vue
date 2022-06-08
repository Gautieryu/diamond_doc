<template>
    <el-dialog title="发表评论" width="400px" :visible="visible" :before-close="close">
        <el-form>
            <el-form-item label="评论内容">
                <el-input v-model="commentName" auto-complete="off"></el-input>
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
            commentName: "",
        }
    },
    methods:{
        close() {
            this.$emit("update:visible",false);
            this.commentName="";
            //console.log('closed');
        },
        realNew() {
            //var re=/[]{1,255}/;
            if(this.commentName.length<256&&this.commentName.length>0)
            {
                this.$parent.newcomment(this.commentName);
                this.close();
            }
            else this.$message.warning('评论不符合要求');
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
