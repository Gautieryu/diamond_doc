<template>
  <div class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-sheet rounded="lg">
              <v-list color="transparent">
                <v-list-item v-for="v in 2" :key="v" link @click="LeftClick(v)">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ n }}
                      {{ LeftButtons[v - 1] }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

           <v-col cols="10">
            <v-sheet min-height="70vh" rounded="lg">
                <el-row>
                  <el-col :span="1" ><el-button @click="enterBin" style="font-size: 17px;margin: 12px; ">回收站</el-button></el-col>
                  <el-col :span="8" offset="6"><span style="line-height: 60px; margin-left: 40%; font-size: 30px;">个人文档</span></el-col>
                  <el-col :span="1" offset="5"><el-button @click="newDoc" style="font-size: 17px;margin: 12px; ">创建文档</el-button></el-col>
                </el-row>
                <el-divider></el-divider>


                <ul>
                  <p v-if="docs.length==0">暂无文档</p>
                  <li v-for="v of docs.length" :key="v" @mouseover="indoc(v)" @mouseout="outdoc">
                    <a class="doc" @click="lookDoc(docs[v-1])">{{docs[v-1]}}</a>
                    <span id="docTransfer" v-show="inDoc==v">
                      <a @click="changeDocName(docs[v-1])">重命名</a>&nbsp;&nbsp;&nbsp;&nbsp;
                      <button @click="delDoc(docs[v-1])"><i class="el-icon-close"></i></button>
                    </span>
                  </li>
                </ul>
              
              
            </v-sheet>
          </v-col>
          
        </v-row>
      </v-container>

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

      docs:[""],
      collect:[],
      inDoc: 0,

      isNew: false,
      isChangeDoc: false,
      isDelDoc: false,
      isEnterBin: false,



      LeftButtons: ["最近浏览", "收藏的文档"],
      LeftButtonsLinks: {
        1: "recently",
        2: "collect",
      },
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
          this.$store.dispatch('text/saveText',res.data.groupFile);
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


    LeftClick(key) {
      console.log("LeftClick" + key);
      let toLink = this.LeftButtonsLinks[key];
      this.$router.push(toLink);
    },
    ToTrash() {
      this.$router.push("trash");
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
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .clear{clear:both;}
</style>