<template>
  <div id="app">
    <yk-editor ref="editorRef"></yk-editor>
    <el-row>
        <el-button type="primary" round @click="setContent">设置内容</el-button>
        <el-button type="primary" round @click="getContent">获取内容</el-button>
    </el-row>
  </div>
    
</template>

<script>
  import ykEditor from "@/components/ykeditor";

  export default {
    name: 'ClassicEditor',

    components: {
      ykEditor
    },

    data() {
  
      return {

      }
    },

    methods: {
      setContent(){
        var a="<h1>测试文字</h1>"
        this.$refs.editorRef.setContent(a)
      },

      getContent(){
        this.$refs.editorRef.setContent("文本内容："+this.$refs.editorRef.getContent())
        console.log(this.$refs.editorRef.getContent())
      }
    }

  }

    
</script>