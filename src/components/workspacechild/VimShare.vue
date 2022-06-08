<template>
    <el-dialog title="查看分享文档" width="400px" :visible="visible" :before-close="close">
        <el-form>
            <el-form-item label="文档ID">
                <el-input v-model="docsID" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="realView">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import axios from "axios";
import qs from "qs";
export default {
    props: ['visible'],
    data() {
        return {
            docsID: "",
            form:{
                email:"",
                targetFileID:"",
            }
        }
    },
    methods: {
        close() {
            this.$emit("update:visible", false);
            this.docName = "";
            //console.log('closed');
        },
        realView() {
            this.form.email=this.$store.getters.getUser;
            this.form.targetFileID=this.docsID;
            var that=this;
            this.$axios.post("workplace/checkSharedPersonalFile/", qs.stringify(this.form))
                .then(res => {
                    if (res.data.result == 0) {
                        this.$parent.viewshare(this.docsID);
                        that.close();
                    }
                    else if(res.data.result == 2){
                        that.$message.warning('目标文档不存在');
                        that.close();
                    }
                    else if(res.data.result == 3){
                        that.$message.warning('无权限查看');
                        that.close();
                    }
                }).catch(
                    err => { console.log(err); }
                )
        }
    }
}
</script>

<style scoped>
::v-deep .el-dialog__header {
    font-size: 20px;
    text-align: center;
}

::v-deep .el-dialog__body {
    padding: 5px 20px;
}

::v-deep .el-textarea__inner {
    min-height: 150px !important;
}
</style>