<template>
    <el-dialog title="重命名" width="400px" :visible="visible" :before-close="close">
        <el-form>
            <el-form-item label="新文档名">
                <el-input v-model="docName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="文档简介">
                <el-input v-model="docDescri" auto-complete="off"></el-input>
            </el-form-item>
            <el-select v-model="posi" placeholder="请选择权限">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="realChange">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>

export default {
    props: ['visible'],
    data() {
        return {
            docName: "",
            docDescri: "",
            posi: "",
            options: [
            {
                value: '0',
                label: '可编辑'
            }, 
            {
                value: '1',
                label: '只读'
            }],
        }
    },
    methods: {
        close() {
            this.$emit("update:visible", false);
            this.docName = "";
            //console.log('closed');
        },
        realChange() {
            
            if (this.docName.length<=20&&this.docName.length>0) {
                this.$parent.changedocname(this.docName,this.docDescri,this.posi);
                this.close();
            }
            else this.$message.warning('文档名不符合要求');
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