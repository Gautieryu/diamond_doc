<template>
    <el-dialog title="修改团队信息" width="500px" :visible="visible" :before-close="close" custom-class="popup">
        <el-form>
            <el-form-item label="新团队名">
                <el-input v-model="groupName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="团队信息(不多于80字符)">
                <el-input v-model="groupInfo" type="textarea" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="info" v-show="groupName.length==0" plain disabled>确 定</el-button>
            <el-button type="primary" v-if="groupName.length" @click="realChange">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props:['visible','teamInfo'],
    data() {
        return {
            groupName: "",
            groupInfo: "",
        }
    },
    methods:{
        close() {
            this.$emit("update:visible",false);
            this.groupName=this.$store.getters.getGroup;
            this.groupInfo=this.teamInfo;
            //console.log('closed');
        },
        realChange() {
            if(this.groupName.length<=20)
            {
                if(this.groupInfo.length<=80)
                {
                    this.$parent.changeinfo(this.groupName,this.groupInfo);
                    this.close();
                }
                else this.$message.warning('团队信息过长');
            }
            else this.$message.warning('团队名不符合要求');
            
        }
    },
    created() {
        this.groupName=this.$store.getters.getGroup;
        this.groupInfo=this.teamInfo;
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
        padding: 5px 20px;
    }
    ::v-deep .el-textarea__inner
    {
        min-height: 150px !important;
    }
</style>
