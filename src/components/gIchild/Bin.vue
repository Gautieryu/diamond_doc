<template>
    <el-dialog title="回收站" width="800px" :visible="visible" :before-close="close" custom-class="popup">
        <el-dialog width="30%" title="确定执行该操作？" :visible.sync="isChoose" append-to-body custom-class="popup">
            <div slot="footer" class="dialog-footer">
                <el-button @click="isChoose=false">取 消</el-button>
                <el-button type="primary" @click="operation">确 定</el-button>
            </div>
        </el-dialog>
        <el-table :data="tableData" height="500" borderstyle="width:100%">
          <el-table-column label="文档名" width="400">
            <template slot-scope="scope">
              <i class="el-icon-tickets"></i>
              {{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column prop="time" label="删除时间" width="280" sortable sort-by="time"></el-table-column>
          <el-table-column>
            <template slot-scope="scope">
                <button title="恢复文档" @click="isNew(scope.row.name)"><i class="el-icon-refresh-left"></i>
                </button>&nbsp;&nbsp;
                <button title="彻底删除文档" @click="isDel(scope.row.name)"><i class="el-icon-close"></i>
                </button>
            </template>
          </el-table-column>
        </el-table>
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
                groupName: "",
                groupFileName: ""
            },

            tableData:[],
            urls:["group/removeGroupFile/","group/recoverGroupFile/"],
            suInfo: ["删除成功","恢复成功"],
            isIn: 0,
            isChoose: false,
            opcode: 0
        }
    },
    methods:{
        getInfo(){
            this.tableData=[];
            var that=this;
            this.$axios.post("group/checkGroupRecycleBin/",qs.stringify(this.form))
            .then(res=>{
                    if(res.data.result==0)
                    {
                        var i;
                        for(i=0;i<res.data.groupDeleteFileNames.length;i++)
                        {
                            var doc={name:"",time:""}
                            doc.name=res.data.groupDeleteFileNames[i];
                            doc.time=res.data.deleteTimes[i];
                            that.tableData.push(doc);
                        }
                    }
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
            this.form.groupFileName=file;
            this.isChoose=true;
            this.opcode=0;
        },
        isNew(file)
        {
            this.form.groupFileName=file;
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
        //this.form.groupName="LenGroup"; 
        this.form.groupName=this.$store.getters.getGroup;
    }
}
</script>

<style scoped>
    i{font-size: 17px;}
    ::v-deep .el-table__header
    {
        border-top: 2px solid #bdc0c859;
    }
    ::v-deep .el-dialog__header
    {
        font-size: 20px;
        font-weight: bold;
        margin: 0 20px;
        padding: 20px 20px 10px 1px;
    }
    ::v-deep .el-dialog__body
    {
        padding: 5px 20px;
    }

</style>
