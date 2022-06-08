<template>
  <div>

    <div style="height: 60px; border-bottom: 1px solid black;">
      <a href="#/WorkSpace" style="float:left;font-size: 16px;margin: 20px 20px; ">个人站</a>
      <span style="line-height: 60px;margin-left: 35%;font-size: 30px;">收藏夹</span>
      <a href="#/Group" style="float:right;font-size: 16px;margin: 20px 20px; ">团队站</a>
    </div>
    <div class="clear"></div>
    <ul>
      <p style="font-size:large;color:darkgray;">个人文档收藏</p>
      <p v-if="collectedPersonalFileName.length==0" >暂无个人文档收藏</p>  
                  <li v-for="v of collectedPersonalFileName.length" :key="v" @mouseover="indoc(v)" @mouseout="outdoc">
                    <a class="doc" @click="lookDoc_personal(collectedPersonalFileName[v-1])">{{collectedPersonalFileName[v-1]}}</a>
                  </li>
    </ul>
    <div class="clear"></div>
    <ul>
      <p style="font-size:large;color:darkgray;">团队文档收藏</p>
      <p v-if="collectedGroupFileName.length==0" >暂无团队文档收藏</p>  
                  <li v-for="v of collectedGroupFileName.length" :key="v" @mouseover="indoc(v)" @mouseout="outdoc">
                    <a class="doc" @click="lookDoc_group(collectedGroupFileName[v-1],groupName[v-1])">{{collectedGroupFileName[v-1]}}</a>
                    <a class="doc" style="margin:70%">{{groupName[v-1]}}</a>
                  </li>
    </ul>
  </div>
  
</template>

<script>

import qs from "qs";

export default {
  name: "collect",

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
        groupName:"",
      },

      collectedPersonalFileName:[],
      collectedGroupFileName:[],
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
      this.$axios.post("workplace/checkCollectFile/", qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.collectedPersonalFileName=res.data.collectedPersonalFileName;
          that.collectedGroupFileName=res.data.collectedGroupFileName;
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
          this.$store.dispatch('saveText',res.data.personalFile);
          this.$store.dispatch('saveFile',doc);
          window.open('#/VimWord', '_self');
        }
      }).catch(err=>{
          console.log(err);
      })
    },

    lookDoc_group: function(doc,team){
      this.form.groupFileName=doc;
      this.form.groupName=team;
      var that=this;
      this.$axios.post("group/checkGroupFile/",qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.$store.dispatch('saveText',res.data.groupFile);
          that.$store.dispatch('saveFile',doc);
          that.$store.dispatch('saveUserInfo',that.form.email);
          that.$store.dispatch('saveGroup',team);
          window.open('#/VimGroupDoc', '_self');
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