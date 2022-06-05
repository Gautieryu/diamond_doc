<template>
    <el-dialog title="回收站" width="600px" :visible="visible" :before-close="close">
        <el-dialog width="30%" title="确定执行该操作？" :visible.sync="isChoose" append-to-body>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isChoose=false">取 消</el-button>
                <el-button type="primary" @click="operation">确 定</el-button>
            </div>
        </el-dialog>
        
        <ul>
            
            <li v-for="i of personalDeleteFileNames.length" :key="i" @mouseover="indoc(i)" @mouseout="outdoc">
                {{personalDeleteFileNames[i-1]}}
                <span v-show="isIn==i">
                    <button title="恢复文档" @click="isNew(personalDeleteFileNames[i-1])"><i class="el-icon-refresh-left"></i>
                    </button>&nbsp;&nbsp;
                    <button title="彻底删除文档" @click="isDel(personalDeleteFileNames[i-1])"><i class="el-icon-close"></i>
                    </button>
                </span>
            </li>
        </ul>
    </el-dialog>
</template>

<script>
import qs from "qs";

export default {
    props:['visible'],
    data() {
        return {
            form: {
                email: "",
                personalFileName: "",
            },
            personalDeleteFileNames: [],

            urls:["workplace/removePersonalFile/","workplace/recoverPersonalFile/"],
            suInfo: ["删除成功","恢复成功"],
            isIn: 0,
            isChoose: false,
            opcode: 0
        }
    },
    methods:{
        getInfo(){
            var that=this;
            this.$axios.post("workplace/checkPersonalRecycleBin/",qs.stringify(this.form))
            .then(res=>{
                if(res.data.result==0)
                    that.personalDeleteFileNames=res.data.personalDeleteFileNames;
                }).catch(err=>{
                    console.log(err);
            })
        },
        indoc(i) {
            this.isIn=i;
        },
        outdoc() {
            this.isIn=0;
        },
        close() {
            this.$emit("update:visible",false);
            //console.log('closed');
        },
        isDel(file)
        {
            this.form.personalFileName=file;
            this.isChoose=true;
            this.opcode=0;
        },
        isNew(file)
        {
            this.form.personalFileName=file;
            this.isChoose=true;
            this.opcode=1;
        },
        operation() {
            var that=this;
            this.$axios.post(this.urls[this.opcode],qs.stringify(this.form))
            .then(res=>{
                if(res.data.result==0)
                {
                    that.$message.success(that.suInfo[that.opcode]);
                    that.getInfo();
                    if(that.opcode==1)
                        that.$parent.getInfo();
                }
            }).catch(err=>{
                console.log(err);
            })
            this.isChoose=false;
        }
    },
    created() {
        //this.form.email="19375162@buaa.edu.cn";
        this.form.email=this.$store.getters.getUser;
        this.getInfo();
    }
}
</script>

<style scoped>
    ::v-deep .el-dialog__title
    {
        font-size: 28px;
        font-family: '宋体';
    }
    ::v-deep .el-dialog__header
    {
        font-size: 20px;
        text-align: center;
    }
    ::v-deep .el-dialog__body
    {
        padding: 5px 20px;
    }
    ul
    {
        height: 500px;
        overflow-y: auto;
        list-style-type: none;
    }
    li
    {
        font-size:26px;   
    }
    span
    {
        float:right;
    }
</style>