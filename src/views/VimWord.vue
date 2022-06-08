<template>

    <div>
        <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
        <el-divider></el-divider>
        <el-row>
            <el-button type="primary" round @click="newComment">评论文档</el-button>
            <el-button type="primary" round @click="commentDocu">查看评论</el-button>
            <el-button type="primary" round @click="saveContent">保存文档</el-button>
            <el-button type="primary" round @click="shareDocu">分享文档</el-button>
            <el-button type="primary" round @click="collectPersonalFile">收藏文档</el-button>
            <el-button type="primary" round @click="cancelCollectPersonalFile">取消收藏</el-button>
        </el-row>

        <CommentDocu :visible.sync="isComment"  ref="commentContent"> </CommentDocu>
        <NewComment :visible.sync="isNewComment"></NewComment>
    </div>

</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn'
import CommentDocu from "@/components/vimWordChild/commentDocu.vue"
import NewComment from '@/components/vimWordChild/newComment.vue'
import axios from "axios"
import qs from "qs"

export default {
    name: 'vimWord',

    components: {
        CommentDocu,
        NewComment,
    },

    props: {
        content: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '请输入内容'
        }
    },

    data() {
        return {
            editor: ClassicEditor,
            editorData: this.content,
            editorConfig: {
                placeholder: this.placeholder,
                language: 'zh-cn',
                //该方式本人没有使用过,使用ckfinder上传时要注意返回的格式
                //应该是{"uploaded":1,"url":"/"}
                //或者{"uploaded":true,"url":"/"}
                ckfinder: {
                    uploadUrl: '/'
                }
            },

            form: {
                email: "",
                fileName: "",
                commentContent: "",
                file: "",
                personalFileName: "",
            },

            isComment: false,
            isNewComment: false,
        };
    },

    methods: {

        getInfo: function () {
            this.form.email = this.$store.getters.getUser;
            this.form.personalFileName=this.$store.getters.getfile;
            var that = this;
            this.$axios.post("workplace/checkPersonalFile/", qs.stringify(this.form))
                .then(res => {
                    if (res.data.result == 0) {
                        that.editorData = res.data.personalFile;
                    }
                }).catch(
                    err => { console.log(err); }
                )
        },

        saveContent: function () {
            this.form.personalFileName = this.form.fileName;
            this.form.file = this.editorData;
            var that = this;
            this.$axios.post("editor/savePersonalFile/", qs.stringify(this.form))
                .then(res => {
                    if (res.data.result == 0) {
                        that.$message.success('保存文档成功');
                        that.getInfo();
                    }
                }).catch(
                    err => { console.log(err); }
                )
        },

        shareDocu() {
            this.form.personalFileName = this.form.fileName;
            var that = this;
            this.$axios.post("editor/sharePersonalFile/", qs.stringify(this.form))
                .then(res => {
                    if (res.data.result == 0) {
                        that.$message({
                            duration:1000,
                            message:"文件ID"+res.data.fileID,
                            type:'success',
                        });
                        that.getInfo();
                    }
                }).catch(
                    err => { console.log(err); }
                )
        },

        commentDocu: function () {
            this.$store.dispatch("saveFile",this.form.fileName);
            console
            this.isComment = true;
            this.$refs.commentContent.getInfo();
        },

        newComment: function () {
            this.isNewComment = true;
        },
        newcomment: function (name) {
            this.form.commentContent = name;
            var that = this;
            this.$axios.post("editor/commentPersonalFile/", qs.stringify(this.form))
                .then(res => {
                    if (res.data.result == 0) {
                        that.$message.success('评论成功');
                        that.getInfo();
                    }
                }).catch(
                    err => { console.log(err); }
                )
        },

        collectPersonalFile: function() {
            this.form.personalFileName = this.form.fileName;
            var that = this;
            this.$axios.post("editor/collectPersonalFile/", qs.stringify(this.form))
                .then(res => {
                    if (res.data.result == 0) {
                        that.$message.success('收藏成功');
                        that.getInfo();
                    }
                    else{
                        that.$message.warning('已收藏该文档');
                    }
                }).catch(
                    err => { console.log(err); }
                )
        },

        cancelCollectPersonalFile: function(){
            this.form.personalFileName = this.form.fileName;
            var that = this;
            this.$axios.post("editor/cancelCollectPersonalFile/", qs.stringify(this.form))
                .then(res => {
                    if (res.data.result == 0) {
                        that.$message.success('取消收藏成功');
                        that.getInfo();
                    }
                    else{
                        that.$message.warning('还未收藏该文档！');
                    }
                }).catch(
                    err => { console.log(err); }
                )
        },

        setContent() {
            this.editorData = "<p>aa</p>"

        },

        getContent() {
            console.log(this.editorData)
            this.$message(this.editorData)
        }
    },
    created() {
        //this.form.email="19375162@buaa.edu.cn";
        this.form.email = this.$store.getters.getUser;
        this.editorData=this.$store.getters.gettext;
        this.form.fileName=this.$store.getters.getfile;
        this.form.personalFileName=this.$store.getters.getfile;

        console.log(this.form.email);
        console.log(this.editorData);
        console.log(this.form.fileName);
        console.log(this.form.personalFileName);

        this.getInfo();
    }
}
</script>
