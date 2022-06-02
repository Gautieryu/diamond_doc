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

      tmp_html:open(test.html)
  

      return {

      }
    },

    methods: {
      setContent(){
        this.$refs.editorRef.setContent(tmp_html)
      },

      getContent(){
        console.log(this.$refs.editorRef.getContent())
      }
    }

  }

    
</script>