<template>
    <el-dialog title="评论区" width="1000px" :visible="visible" :before-close="close">

        <ul >
            <li v-for="i of commentContents.length" :key="i" >
                <p1>{{commentContents[i-1]}}</p1>
                <p>
                    {{nicknames[i-1]}} &nbsp;&nbsp;&nbsp;&nbsp;
                    {{commentTimes[i-1]}} &nbsp;&nbsp;&nbsp;&nbsp;
                    <button  v-show="checkUser[i-1]" @click="delComments(commentTimes[i-1])"><i class="el-icon-delete"></i></button>
                </p>
            </li>
        </ul>

    </el-dialog>
</template>

<script>
import axios from "axios";
import qs from "qs";

export default {
    props:['visible'],
    data() {
        return {
            form: {
                email: "",
                groupName: "",
                groupFileName: "",
                commentTime: "",
            },
            commentContents: [],
            commentTimes:[],
            emails:[],
            nicknames: [],
            checkUser:[],

            isIn: 0,
        }
    },
    methods:{
        getInfo(){
            this.form.email=this.$store.getters.getUser;
            this.form.groupFileName=this.$store.getters.getfile;
            this.form.groupName=this.$store.getters.getGroup;
            var that=this;
            this.$axios.post("editor/checkGroupFileComment/",qs.stringify(this.form))
            .then(res=>{
                if(res.data.result==0)
                    that.commentContents=res.data.commentContents;
                    that.commentTimes=res.data.commentTimes;
                    that.emails=res.data.emails;
                    that.nicknames=res.data.nicknames;
                    var emaill=that.$store.getters.getUser;
                    for (let index = 0; index < that.commentContents.length; index++) {
                        if(that.emails[index] == emaill)
                        {
                            that.checkUser[index]=true;
                        }
                        else that.checkUser[index]=false;
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

        delComments: function(timeee){
            this.form.commentTime=timeee;
            var that=this;
            this.$axios.post("editor/cancelGroupFileComment/", qs.stringify(this.form))
                .then(res => {
                    if (res.data.result == 0) {
                        that.$message.success('删除评论成功');
                        that.getInfo();
                    }
                }).catch(
                    err => { console.log(err); }
                )
        },
    },

    
    created() {
        //this.form.email="19375162@buaa.edu.cn";
        this.form.email=this.$store.getters.getUser;

        this.form.groupName=this.$store.getters.getGroup;

        this.form.groupFileName=this.$store.getters.getfile;



        this.getInfo();
    }
}
</script>

<style scoped>

    p{
        border-radius: 4px;
        background-color: rgb(174, 179, 199);
    }

    p1{
        border-radius: 4px;
        background-color: rgb(240, 240, 240);
    }

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