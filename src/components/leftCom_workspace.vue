<template>
  <div>
      
    <div style="height: 60px; border-bottom: 1px solid black;">
      <a @click="enterBin" style="float:left;font-size: 16px;margin: 20px 20px; ">回收站</a>
      <span style="line-height: 60px;margin-left: 35%;font-size: 30px;">个人文档</span>
      <a @click="newDoc" style="float:right;font-size: 16px;margin: 20px 20px; ">创建文档</a>
    </div>
    <div class="clear"></div>
    <p v-if="docs.length==0">暂无文档</p>
    <ul>           
                  <li v-for="v of docs.length" :key="v" @mouseover="indoc(v)" @mouseout="outdoc">
                    <a class="doc" @click="lookDoc(docs[v-1])">{{docs[v-1]}}</a>
                    <span id="docTransfer" v-show="inDoc==v" >
                      <a @click="changeDocName(docs[v-1])">重命名</a>&nbsp;&nbsp;&nbsp;&nbsp;
                      <button @click="delDoc(docs[v-1])"><i class="el-icon-close"></i></button>
                    </span>
                  </li>
    </ul>

      <NewDoc :visible.sync="isNew"></NewDoc>
      <ChangeDocName :visible.sync="isChangeDoc"></ChangeDocName>
      <DelDoc :visible.sync="isDelDoc"></DelDoc>
      <Bin :visible.sync="isEnterBin" ref="src\components\workspacechild\Bin.vue"></Bin>
  
  
  </div>
</template>

<script>
import qs from "qs";
import NewDoc from './workspacechild/NewDoc.vue';
import Bin from './workspacechild/Bin.vue';
import ChangeDocName from './workspacechild/ChangeDocName.vue';
import DelDoc from './workspacechild/DelDoc.vue';

export default {

  components: {
    NewDoc,
    Bin,
    ChangeDocName,
    DelDoc
},

  data() {
    return {
      form: {
        email: "",
        personalFileName: "",
        oldPersonalFileName: "",
        newPersonalFileName: "",
        file: "",
        personalFile: "",
      },

      docs:[],
      collect:[],
      inDoc: 0,

      isNew: false,
      isChangeDoc: false,
      isDelDoc: false,
      isEnterBin: false,
    }
  },

  methods: {

    getInfo: function(){
      var that=this;
      this.$axios.post("workplace/checkCreatedPersonalFile/",qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.docs=res.data.personalFileName;
          that.collect=res.data.isCollect;
        }
      }).catch(
        err=>{console.log(err);}
      )
    },

    indoc: function(i){
      this.inDoc=i;
    },
    outdoc: function(){
      this.inDoc=false;
    },



    newDoc: function(){
      this.isNew=true;
    },
    newdoc: function(name){
      this.form.personalFileName=name;
      var that=this;
      this.$axios.post("workplace/createPersonalFile/",qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.$message.success('创建文档成功');
          that.getInfo();
        }
        else that.$message.error('文档重名');
      }).catch(
        err=>{console.log(err);}
      )
    },

    changeDocName: function(name){
      this.isChangeDoc=true;
      this.form.personalFileName=name;
    },
    changedocname: function(name){
      this.form.oldPersonalFileName=this.form.personalFileName;
      this.form.newPersonalFileName=name;
      var that=this;
      this.$axios.post('workplace/editPersonalFileInfo/',qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.$message.success('修改文档成功');
          that.getInfo();
        }
        else that.$message.error('文档重名');
      }).catch(err=>{
        console.log(err);
      })
    },
    delDoc: function(doc){
      this.isDelDoc=true;
      this.form.personalFileName=doc;
    },
    deldoc: function(){
      var that=this;
      this.$axios.post('workplace/deletePersonalFile/',qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.$message.success('成功移入回收站');
          that.getInfo();
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    lookDoc: function(doc){
      this.form.personalFileName=doc;
      this.$axios.post("workplace/checkPersonalFile/",qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          this.$store.dispatch('text/saveText',res.data.personalFile);
          this.$store.dispatch('file/saveFile',doc);
          window.open('#/VimWord', '_self');
        }
      }).catch(err=>{
          console.log(err);
      })
    },


    enterBin: function(){
      this.isEnterBin=true;
      this.$refs.Bin.getInfo();
    },


  },

  created() {
    this.form.email=this.$store.getters.getUser;
    //this.form.email="19375162@buaa.edu.cn"
    this.getInfo();
  }
};
</script>

<style>
  
  .clear{clear:both;}
</style>