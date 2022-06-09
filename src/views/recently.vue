<template>
  <div>
    <header>
      <span>最近浏览</span>
      <div>

        <button @click="toWorkSpace">
          <i class="el-icon-user"></i>
          <span class="createNew">个人站</span>
        </button>

        <button @click="toGroup">
          <i class="el-icon-table-lamp"></i>
          <span class="createNew">团队站</span>
        </button>

      </div>
    </header>

    <div class="clear"></div>


    <div v-if="searchData.length == 0">
      <el-empty description="暂无最近浏览的个人文档"></el-empty>
    </div>

    <div v-else>

      <el-table :data="searchData" height="500" borderstyle="width:100%">

        <el-table-column label="文档名" width="550">
          <template slot-scope="scope">
            <i class="el-icon-files"></i>
            <a :title="scope.row.name" @click="lookDoc(scope.row.name,scope.row.type)">
              {{ scope.row.name }}
            </a>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="所属团队或个人文档" width="200">
          
    
        </el-table-column>
        <el-table-column prop="time" label="最近浏览时间" width="200">

        </el-table-column>

      </el-table>

    </div>
      
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
        groupName:"",
      },

      personalFileName:[],
      groupFileName:[],
      groupName:[],
      inDoc: 0,
      searchData: [],
      tableData: [],
      personalFileTime:[],
      groupFileTime:[],

      isNew: false,
      isChangeDoc: false,
      isDelDoc: false,
      isEnterBin: false,
    }
  },

  methods: {

    getInfo: function(){
      this.tableData = [];
      var that=this;
      this.$axios.post("workplace/checkBrowseFile/", qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.personalFileName=res.data.personalFileName;
          that.groupFileName=res.data.groupFileName;
          that.groupName=res.data.groupName;
          that.personalFileTime=res.data.personalFileTime;
          that.groupFileTime=res.data.groupFileTime;

          var i;
            for (i = 0; i < res.data.personalFileName.length; i++) {
              var group = { name: "", type:"",time:""};
              group.name = res.data.personalFileName[i];
              group.type="个人文档";
              group.time=res.data.personalFileTime[i];
              that.tableData.push(group);
            }

            for (i = 0; i < res.data.groupFileName.length; i++) {
              var group = { name: "", type:"",time:""};
              group.name = res.data.groupFileName[i];
              group.type=res.data.groupName[i];
              group.time=res.data.groupFileTime[i];
              that.tableData.push(group);
            }

            that.searchData = that.tableData;
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

    toWorkSpace() {
      this.$router.push("WorkSpace");
    },

    toGroup() {
      this.$router.push("Group");
    },

    lookDoc: function(doc,team){
      if(team=="个人文档"){
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
      }
      else{
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
      }
    },

    lookDoc_personal: function(doc){
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
  border-radius: 10px;
  padding: 5px 5px;
  width:160px;
  align-items: center;
}

button:hover {
  background-color: rgb(240, 240, 240);
}

.el-button{
  border-radius: 10px;
  padding: 5px 5px;
  width:27px;
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