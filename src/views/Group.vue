<template>
  <div>
    <header>
      <span>已加入团队</span>
      <div>
        <button @click="establish">
          <i class="el-icon-circle-plus-outline"></i>
          <span class="createNew">创建新团队</span>
        </button>
        <el-input v-model="search" size="mini" prefix-icon="el-icon-search" placeholder="输入团队名搜索"/>
      </div>
    </header>
    <div class="clear"></div>
    <div v-if="tableData.length==0">
      <el-empty description="暂未加入任何队伍"></el-empty>
    </div>
    
    <div v-else>
      <div v-if="searchData.length!=0">
        <el-table :data="searchData" height="500" borderstyle="width:100%">
          <el-table-column label="团队名" width="360" sortable sort-by="name">
            <template slot-scope="scope">
              <i class="el-icon-menu"></i>
              <a :title="scope.row.name" target="_self"
                href="#/GroupInfo" @click="lookInfo(scope.row.name)">
              {{scope.row.name}}
              </a>
            </template>
          </el-table-column>
          <el-table-column prop="owner" label="创建者" width="180"></el-table-column>
          <el-table-column prop="num" label="团队人数" width="180"></el-table-column>
          <el-table-column prop="time" label="创建时间" sortable sort-by="time"></el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-empty :image="noRes" description="无搜索结果"></el-empty>
      </div>
    </div>
    <NewGroup :visible.sync="show"></NewGroup>
  </div>
</template>

<script>
import noResult from "../assets/noResult.png";
import NewGroup from "../components/NewGroup.vue";
import qs from "qs";

export default {
  name: "Group",
  data() {
    return {
      infoForm: {
        email: "",
        groupName : ""
      },

      tableData:[],

      search: "",
      searchData:[],
      noRes: noResult,
      show: false,
    }
  },
  components: {
    NewGroup,
},
  methods: {
    getInfo: function() {
      this.tableData=[];
      var that=this;
      this.$axios.post("group/checkGroups/",qs.stringify(this.infoForm))
      .then(res=>{
        if(res.data.result==0)
        {
          var i;
          for(i=0;i<res.data.groupName.length;i++)
          {
            var group={name:"",owner:"",num:"",time:""};
            group.name=res.data.groupName[i];
            group.owner=res.data.ownerName[i];
            group.num=res.data.memberNum[i];
            group.time=res.data.createTime[i];
            that.tableData.push(group);
          }
          that.search="";
          that.searchData=that.tableData;
        }
      }).catch(
        err=>{console.log(err);}
      )
    },
    lookInfo: function(name) {
      this.infoForm.groupName=name;
      this.$store.dispatch("saveGroup",name);
    },
    establish: function() {
      this.show=true;
    },
    newGroup: function(name) {
      this.infoForm.groupName=name;
      var that=this;
      this.$axios.post("group/createGroup/",qs.stringify(this.infoForm))
      .then(res=>{
        if(res.data.result==0)
        {
          that.$message.success('创建团队成功');
          that.getInfo();
        }
        else that.$message.error('队伍重名');
      }).catch(
        err=>{console.log(err);}
      )
    }
  },
  created() {
    //this.infoForm.email="19375162@buaa.edu.cn";
    this.infoForm.email=this.$store.getters.getUser;
    this.getInfo();
  },
  watch: {
    $route: {
      handler: function(val,oldVal){
        if(val.path=="/Group")
          this.getInfo();
      },
      deep: true
    },
    search: function() {
      if(this.search.length!=0) {
        this.searchData=[];
        for(const item of this.tableData) {
          if(item.name.includes(this.search)) {
            this.searchData.push(item)
          }
        }
      }
      else this.searchData=this.tableData;
    }
  }
}
</script>

<style scoped>
  div{font-family: "PingFang SC","HarmonyOS_Regular","Helvetica Neue",
                  "Microsoft YaHei","sans-serif"!important;}
  a{text-decoration: none;color: black;}
  a:hover{text-decoration:underline;}
  .el-icon-circle-plus-outline{font-size: 18px;}
  header
  {
    display: flex;
    height: 64px;
    padding: 0 32px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid silver;
  }
  header span
  {
    font-size: 20px;
    font-weight: 500;
  }
  header div
  {
    display: flex;
    align-items: center;
  }
  button
  {
    display: inline-flex;
    border-radius: 3px;
    padding: 5px 5px;
    align-items: center;
  }
  button:hover
  {
    background-color: rgb(240, 240, 240);
  }
  .el-input
  {
    display: inline-flex;
    width: 180px;
    border-radius: 3px;
    margin-left: 20px;
    align-items: center;
  }
  .createNew{
    font-size: 14px; 
    margin-left: 4px; 
  }
  .clear{clear:both;}
  ::v-deep .el-empty
  {
    padding: 90px;
  }
  ::v-deep .el-table__cell
  {
    padding-left: 23px;
  }
  ::v-deep .el-table__body-wrapper::-webkit-scrollbar 
  {
    width: 10px;
  }
  ::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb 
  {
    border-radius: 5px;
    height: 58px;
    background: rgba(131, 131, 134, 0.2);
  }
  ::v-deep .el-table__body-wrapper::-webkit-scrollbar-track 
  {
    box-shadow: inset 0 0 5px rgba(241, 240, 245, 0.2);
    border-radius: 5px;
    background: #F1F0F5;
  }
</style>
