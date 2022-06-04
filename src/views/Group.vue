<template>
  <div>
    <div id="groups">
      <span>已加入团队</span>
      <a @click="establish">新建团队</a>
    </div>
    <div class="clear"></div>
    <p v-if="groupNames.length==0">暂未加入任何队伍</p>
    <ul>
      <li v-for="i of groupNames.length" :key="i">
        <a id="gname" class="ginfo" :title="groupNames[i-1]" 
           target="_self" href="#/GroupInfo" @click="lookInfo(groupNames[i-1])">{{groupNames[i-1]}}</a>
        <span class="ginfo" :title="ownerNames[i-1]">创建者：{{ownerNames[i-1]}}</span>
        <span class="ginfo">成员数：{{memberNum[i-1]}}</span>
      </li>
    </ul>
    <NewGroup :visible.sync="show"></NewGroup>
  </div>
</template>

<script>
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

      groupNames:[],
      ownerNames:[],
      memberNum:[],

      show: false,
    }
  },
  components: {
    NewGroup,
},
  methods: {
    getInfo: function() {
      this.$axios.post("group/checkGroups/",qs.stringify(this.infoForm))
      .then(res=>{
        if(res.data.result==0)
        {
          this.groupNames=res.data.groupName;
          this.ownerNames=res.data.ownerName;
          this.memberNum =res.data.memberNum;
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
    }
  }
};
</script>

<style scoped>
  a{text-decoration: none;}
  a:hover{text-decoration:underline;}
  #groups
  {
    height: 60px;
    border-bottom: 1px solid black;
  }
  #groups span
  {
    line-height: 60px;
    margin-left: 40%;
    font-size: 30px;
  }
  #groups a
  {
    float:right;
    font-size: 16px;
    margin: 20px 20px; 
  }
  .clear{clear:both;}
  li
  {
    list-style-type: none;
    height: 100px;
    width: 96%;
    border-bottom: 1px solid silver;
  }
  .ginfo
  {
    display: inline-block;
    line-height: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 250px;
    text-indent: 40px;
  }
  #gname
  {
    text-indent: 0;
    text-align: left;
    font-size: 30px;
    width: 300px;
  }
</style>
