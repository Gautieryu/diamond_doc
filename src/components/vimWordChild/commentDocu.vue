<template>
    <el-dialog title="评论区" width="600px" :visible="visible" :before-close="close">
        
        <ul>
            
            <li v-for="i of commentContents.length" :key="i" @mouseover="indoc(i)" @mouseout="outdoc">
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
import qs from "qs";

export default {
    props:['visible'],
    data() {
        return {
            form: {
                email: "",
                fileName: "",
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
            this.form.fileName=this.$store.getters.getfile;
            var that=this;
            this.$axios.post("editor/checkPersonalFileComment/",qs.stringify(this.form))
            .then(res=>{
                if(res.data.result==0)
                    that.commentContents=res.data.commentContents;
                    that.commentTimes=res.data.commentTimes;
                    that.emails=res.data.emails;
                    that.nicknames=res.data.nicknames;
                    var emaill=that.$store.getters.getUser;
                    console.log(that.commentContents);
                    console.log(that.commentTimes);
                    console.log(that.emails);
                    console.log(that.nicknames);


                    for (let index = 0; index < that.commentContents.length; index++) {
                        if(that.emails[index] == emaill)
                        {
                            that.checkUser[index]=true;
                        }
                        else that.checkUser[index]=false;
                    }
                    console.log(that.checkUser);
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
            console.log(this.form.commentTime);
            console.log(timeee);
            var that=this;
            this.$axios.post("editor/cancelPersonalFileComment/", qs.stringify(this.form))
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
        this.form.fileName=this.$store.getters.getfile;

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