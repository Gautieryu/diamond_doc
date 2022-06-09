<template>
    <el-dialog title="新建文档" width="400px" :visible="visible" :before-close="close" custom-class="popup">
        <el-form>
            <el-form-item label="文档名(不超过20个字符)">
                <el-input v-model="docName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="选择文档模板">
                <el-select v-model="posi" placeholder="请选择模板">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
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
    props: ['visible'],
    data() {
        return {
            docName: "",
            text: "",
            posi: "",
            options: [
                {
                    value: '0',
                    label: '无模板'
                },
                {
                    value: '1',
                    label: '数学建模'
                },
                {
                    value: '2',
                    label: '冯如杯报告'
                }],
        }
    },
    methods: {
        close() {
            this.$emit("update:visible", false);
            this.docName = "";
            //console.log('closed');
        },
        realNew() {
            //var re = /[a-zA-Z0-9]{1,20}/;
            if (this.docName.length<=20&&this.docName.length>0) {
                if (this.posi == '0') this.text = "";
                else if (this.posi == '1') {
                    this.text = "<h1>数学建模</h1><h2>摘要</h2><p>关键词</p><h2>问题重述</h2><h2>问题分析</h2><h2>变量及假设</h2><h2>模型建立</h2><h2>模型求解</h2><h2>模型评价</h2><h2>模型推广</h2><h2>参考文献</h2>";
                }
                else if (this.posi == '2') {
                    this.text = "<h1>冯如杯竞赛项目论文</h1><h2>摘要</h2><p>关键词</p><h2>Abstract</h2><p>Keywords</p><h2>项目背景</h2><h2>项目的目的与意义</h2><h2>项目创新点</h2><h2>项目简介</h2><h2>项目设计</h2><h2>后期规划</h2><h2>总结</h2><h2>参考文献</h2>";
                }
                this.$parent.newdoc(this.docName, this.text);
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
    }
    ::v-deep .el-select
    {
        display: block;
    }
    ::v-deep .el-input__suffix
    {
        top: 20px;
    }
</style>

