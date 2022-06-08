<template>
  <div>
      
    <div style="height: 60px; border-bottom: 1px solid black;">
      <a @click="enterBin" style="float:left;font-size: 16px;margin: 20px 20px; ">回收站</a>
      <a @click="viewShare" style="float:right;font-size: 16px;margin: 20px 20px; ">查看他人分享的文档</a>
      <span style="line-height: 60px;margin-left: 35%;font-size: 30px;">个人文档</span>
      <a @click="newDoc" style="float:right;font-size: 16px;margin: 20px 20px; ">创建文档</a>
    </div>
    <div class="clear"></div>
    <p v-if="docs.length==0">暂无文档</p>
    <ul>           
                  <li v-for="v of docs.length" :key="v" @mouseover="indoc(v)" @mouseout="outdoc">
                    <a class="doc" @click="lookDoc(docs[v-1])">{{docs[v-1]}}</a>
                    <span id="docTransfer" v-show="inDoc==v" >
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <a @click="checkPersonalFileInfo(docs[v-1])">详细信息</a>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <a @click="changeDocName(docs[v-1])">修改信息</a>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <button @click="delDoc(docs[v-1])"><i class="el-icon-close"></i></button>
                    </span>
                  </li>
    </ul>

      <NewDoc :visible.sync="isNew"></NewDoc>
      <ChangeDocName :visible.sync="isChangeDoc"></ChangeDocName>
      <DelDoc :visible.sync="isDelDoc"></DelDoc>
      <Bin :visible.sync="isEnterBin" ref="Bin"></Bin>
      <VimShare :visible.sync="isVimShare"></VimShare>
  
  </div>
</template>

<script>
import qs from "qs";
import NewDoc from './workspacechild/NewDoc.vue';
import Bin from './workspacechild/Bin.vue';
import ChangeDocName from './workspacechild/ChangeDocName.vue';
import DelDoc from './workspacechild/DelDoc.vue';
import VimShare from "./workspacechild/VimShare.vue";

export default {

  components: {
    NewDoc,
    Bin,
    ChangeDocName,
    DelDoc,
    VimShare
},

  data() {
    return {
      form: {
        email: "",
        personalFileName: "",
        oldPersonalFileName: "",
        newPersonalFileName: "",
        position:0,
        description:"",
        file: "",
        personalFile: "",
        targetFileID:"",
      },

      docs:[],
      collect:[],
      inDoc: 0,

      isNew: false,
      isChangeDoc: false,
      isDelDoc: false,
      isEnterBin: false,
      isVimShare: false,
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

    checkPersonalFileInfo: function(name){
      this.form.personalFileName=name;
      var that=this;
      this.$axios.post("workplace/checkPersonalFileInfo/",qs.stringify(this.form))
      .then(res=>{
        if (res.data.result == 0) {
          that.$message({
            duration:1000,
            message:res.data.description,
            type:'success',
          });

        }
      }).catch(
        err=>{console.log(err);}
      )
    },

    viewShare: function(){
      this.isVimShare=true;
    },
    viewshare: function(ID){
      this.form.targetFileID=ID;
      var that =this;
      this.$axios.post("workplace/checkSharedPersonalFile/", qs.stringify(this.form))
                .then(res => {
                    if (res.data.result == 0) {
                        this.$store.dispatch('shareuser/saveShareUserInfo',res.data.email);
                        this.$store.dispatch('text/saveText',res.data.targetFile);
                        this.$store.dispatch('file/saveFile',res.data.fileName);
                        if(res.data.position==1) //只读
                        {
                          window.open('#/VimShareReadOnly', '_self');
                        }
                        else if(res.data.position==0) //可编辑
                        {
                          window.open('#/VimShareWrite', '_self');
                        }
                        that.close();
                    }
                }).catch(
                    err => { console.log(err); }
                )
    },

    newDoc: function(){
      this.isNew=true;
    },
    newdoc: function(name,text){
      this.form.personalFileName=name;
      this.form.file=text;
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
    changedocname: function(name,des,pos){
      this.form.oldPersonalFileName=this.form.personalFileName;
      this.form.newPersonalFileName=name;
      this.form.description=des;
      if(pos=='0') this.form.position=0;
      else this.form.position=1;
      var that=this;
      this.$axios.post('workplace/editPersonalFileInfo/',qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.$message.success('修改文档信息成功');
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
      this.form.email=this.$store.getters.getUser;
      var that =this;
      this.$axios.post("workplace/checkPersonalFile/",qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.$store.dispatch('saveText',res.data.personalFile);
          that.$store.dispatch('saveFile',doc);
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