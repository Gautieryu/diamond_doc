<template>

    <div>
        <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
        <el-divider></el-divider>
        <el-row>
            <button @click="newComment">
                <i class="el-icon-chat-round"></i>
                <span class="createNew">评论文档</span>
            </button>

            <button @click="commentDocu">
                <i class="el-icon-chat-dot-square"></i>
                <span class="createNew">查看评论</span>
            </button>

            <button @click="saveContent">
                <i class="el-icon-success"></i>
                <span class="createNew">保存文档</span>
            </button>

            <button @click="shareDocu">
                <i class="el-icon-share"></i>
                <span class="createNew">分享文档</span>
            </button>

            <button @click="collectPersonalFile">
                <i class="el-icon-star-on"></i>
                <span class="createNew">收藏文档</span>
            </button>

            <button @click="cancelCollectPersonalFile">
                <i class="el-icon-star-off"></i>
                <span class="createNew">取消收藏</span>
            </button>
        </el-row>

        <CommentDocu :visible.sync="isComment"></CommentDocu>
        <NewComment :visible.sync="isNewComment"></NewComment>
    </div>

</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn'
import NewComment from '@/components/vimWordChild/newComment.vue'
import axios from "axios"
import qs from "qs"
import CommentDocu from '@/components/vimWordChild/commentDocu.vue'

export default {
    name: 'vimWord',

    inject: ['reload'],

    components: {
        NewComment,
        CommentDocu
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
                    uploadUrl: '/uploads/'
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
            this.form.personalFileName = this.$store.getters.getfile;
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
                        that.$alert("文件ID: " + res.data.fileID, '文档简介', {
                            confirmButtonText: '确定',
                            callback: null,
                        });
                        
                        that.getInfo();
                    }
                }).catch(
                    err => { console.log(err); }
                )
        },

        commentDocu: function () {
            this.$store.dispatch('saveFile', this.form.fileName);
            this.$store.dispatch('saveUserInfo', this.form.email);
            console.log("点击按钮成功");
            this.isComment = true;
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
                        that.reload();
                    }
                }).catch(
                    err => { console.log(err); }
                )
        },

        collectPersonalFile: function () {
            this.form.user = this.$store.getters.getUser;
            this.form.personalFileName = this.form.fileName;
            var that = this;
            this.$axios.post("editor/collectPersonalFile/", qs.stringify(this.form))
                .then(res => {
                    if (res.data.result == 0) {
                        that.$message.success('收藏成功');
                        that.getInfo();
                    }
                    else {
                        that.$message.warning('已收藏该文档');
                    }
                }).catch(
                    err => { console.log(err); }
                )
        },

        cancelCollectPersonalFile: function () {
            this.form.user = this.$store.getters.getUser;
            this.form.personalFileName = this.form.fileName;
            var that = this;
            this.$axios.post("editor/cancelCollectPersonalFile/", qs.stringify(this.form))
                .then(res => {
                    if (res.data.result == 0) {
                        that.$message.success('取消收藏成功');
                        that.getInfo();
                    }
                    else {
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
        this.editorData = this.$store.getters.gettext;
        this.form.fileName = this.$store.getters.getfile;
        this.form.personalFileName = this.$store.getters.getfile;

        console.log(this.form.email);
        console.log(this.editorData);
        console.log(this.form.fileName);
        console.log(this.form.personalFileName);

        this.getInfo();
    }
}
</script>

<style scoped>
div {
    font-family: "PingFang SC", "HarmonyOS_Regular", "Helvetica Neue",
        "Microsoft YaHei", "sans-serif" !important;
}

a {
    text-decoration: none;
    color: black;
}

a:hover {
    text-decoration: underline;
}

.el-icon-circle-plus-outline {
    font-size: 18px;
}

header {
    display: flex;
    height: 64px;
    padding: 0 32px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid silver;
}

header span {
    font-size: 20px;
    font-weight: 500;
}

header div {
    display: flex;
    align-items: center;
}

button {
    display: inline-flex;
    border-radius: 3px;
    padding: 5px 5px;
    align-items: center;
    width: 33.3%;
    height: 50px;
}

button:hover {
    background-color: rgb(160, 179, 193);
}

.el-input {
    display: inline-flex;
    width: 180px;
    border-radius: 3px;
    margin-left: 20px;
    align-items: center;
}

.createNew {
    font-size: 14px;
    margin-left: 4px;
}

.clear {
    clear: both;
}

::v-deep .el-empty {
    padding: 90px;
}

::v-deep .el-table__cell {
    padding-left: 23px;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar {
    width: 10px;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 5px;
    height: 58px;
    background: rgba(131, 131, 134, 0.2);
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(241, 240, 245, 0.2);
    border-radius: 5px;
    background: #F1F0F5;
}

.clear {
    clear: both;
}
</style>