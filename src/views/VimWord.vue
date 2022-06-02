<template>
    <div id="app">
        <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
        <el-row>
            <el-button type="primary" round @click="setContent">设置内容</el-button>
            <el-button type="primary" round @click="getContent">获取内容</el-button>
        </el-row>
    </div>
    
</template>

<script>
    import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

    export default {
        name: 'app',
        data() {
            return {
                editor: ClassicEditor,
                editorData: '<p>Content of the editor.</p>',
                editorConfig: {
                    // The configuration of the editor.
                }
            };
        },

        methods: {
        setContent(){
            this.editorData=open(test.html)
        },

        getContent(){
         console.log(this.$refs.editorRef.getContent())
        }
    }
    }
</script>
