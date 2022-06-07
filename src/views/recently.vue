<template>
  <div>
    <div style="height: 60px; border-bottom: 1px solid black;">
      <a href="#/WorkSpace" style="float:left;font-size: 16px;margin: 20px 20px; ">个人站</a>
      <span style="line-height: 60px;margin-left: 33%;font-size: 30px;">最近浏览</span>
      <a href="#/Group" style="float:right;font-size: 16px;margin: 20px 20px; ">团队站</a>
    </div>
    <div class="clear"></div>
    <ul>
      <p style="font-size:large;color:darkgray;">最近浏览的个人文档</p>
      <p v-if="personalFileName.length==0" >暂无</p>  
                  <li v-for="v of personalFileName.length" :key="v" @mouseover="indoc(v)" @mouseout="outdoc">
                    <a class="doc" @click="lookDoc_personal(personalFileName[v-1])">{{personalFileName[v-1]}}</a>
                  </li>
    </ul>
    <div class="clear"></div>
    <ul>
      <p style="font-size:large;color:darkgray;">最近浏览的团队文档</p>
      <p v-if="groupFileName.length==0" >暂无</p>  
                  <li v-for="v of groupFileName.length" :key="v" @mouseover="indoc(v)" @mouseout="outdoc">
                    <a class="doc" @click="lookDoc_group(groupFileName[v-1])">{{groupFileName[v-1]}}</a>
                    <a class="doc" style="margin:70%">{{groupName[v-1]}}</a>
                  </li>
    </ul>
      
  </div>
</template>

<script>

import qs from "qs";

export default {
  name: "recently",

  components: {
    
  },

  data() {
    return {
      form: {
        email: "",
        personalFileName: "",
        groupFileName: "",
        personalFile: "",
        groupFile: "",
      },

      personalFileName:[],
      groupFileName:[],
      groupName:[],
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
      this.$axios.post("workplace/checkBrowseFile/", qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.personalFileName=res.data.personalFileName;
          that.groupFileName=res.data.groupFileName;
          that.groupName=res.data.groupName;
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

    lookDoc_personal: function(doc){
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

    lookDoc_group: function(doc){
      this.form.groupFileName=doc;
      this.$axios.post("group/checkGroupFile/",qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          this.$store.dispatch('text/saveText',res.data.groupFile);
          this.$store.dispatch('file/saveFile',doc);
          window.open('#/VimWord', '_self');
        }
      }).catch(err=>{
          console.log(err);
      })
    },

  },

  created() {
    this.form.email=this.$store.getters.getUser;
    this.getInfo();
  },
};
</script>

<style>
  
  .clear{clear:both;}
</style>