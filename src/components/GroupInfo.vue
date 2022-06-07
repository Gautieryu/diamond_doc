<template>
  <div>
    <div id="group">
      <div>{{form.groupName}}<a href="#/Group">返回</a></div>
    </div>
    <span class="clear"></span>
    <span id="teamDocs">
      <div>团队文档
        <button id="newdoc" @click="newDoc" v-show="userPosition!=2"><i class="el-icon-plus"></i></button>
      </div>
      <ul>
        <p v-if="docs.length==0">暂无文档</p>
        <li v-for="v of docs.length" :key="v" @mouseover="indoc(v)" @mouseout="outdoc">
          <a class="doc" @click="lookDoc(docs[v-1])">{{docs[v-1]}}</a>
          <span id="docTransfer" v-show="userPosition!=2&&inDoc==v">
            <a @click="changeDocName(docs[v-1])">重命名</a>&nbsp;&nbsp;&nbsp;&nbsp;
            <button @click="delDoc(docs[v-1])"><i class="el-icon-close"></i></button>
          </span>
        </li>
      </ul>
      <div>
        <button id="bin" @click="enterBin" v-show="userPosition!=2"><i class="el-icon-delete"></i></button>
      </div>
    </span>
    <span id="teamInfo">
      <div id="intro"> 
          创建者：{{ownerName}}
          <span>成员数：{{nickNames.length}}</span>
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="团队简介" name="1">
              <div>{{form.description}}</div>
            </el-collapse-item>
          </el-collapse>
      </div>
      <span class="clear"></span>
      <ul>
        <li v-for="i of nickNames.length" :key="i" class="member" @mouseover="show(i)" @mouseout="common">
          <span>{{nickNames[i-1]}}</span>
          <span v-if="poss[i-1]!=2"><strong>{{ocup[poss[i-1]]}}</strong></span> 
          <span v-else>{{ocup[poss[i-1]]}}</span>
          <span id="memberTransfer" v-show="userPosition<poss[i-1]&&isShow==i">
            <a v-show="userPosition==0" @click="alterPosition(i-1)">{{transfer[poss[i-1]]}}</a>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button @click="kickMember(i-1)"><i class="el-icon-close"></i></button>
          </span>
        </li>
      </ul>

      <div id="manage">
        <input type="button" value="邀请成员" v-show="userPosition!=2" @click="inviteMember"/>
        <input type="button" value="修改团队信息" id="changeinfo" v-show="userPosition==0" @click="changeInfo"/>
        <input type="button" value="队长转让" id="grant" v-show="userPosition==0" @click="alterLeader"/>
        <input type="button" value="解散团队" class="run" v-if="userPosition==0" @click="dismiss"/>
        <input type="button" value="退出团队" class="run" v-else @click="leaveTeam"/>
      </div> 
    </span>
    <Invite :visible.sync="isInvite"></Invite>
    <ChangeInfo :visible.sync="isChange"></ChangeInfo>
    <AlterLeader :visible.sync="isAlterL"></AlterLeader>
    <LeaveTeam :visible.sync="isLeave"></LeaveTeam>
    <Dismiss :visible.sync="isDismiss"></Dismiss>
    <AlterPosition :visible.sync="isAlterP"></AlterPosition>
    <KickMember :visible.sync="isKick"></KickMember>
    <NewDoc :visible.sync="isNew"></NewDoc>
    <ChangeDocName :visible.sync="isChangeDoc"></ChangeDocName>
    <DelDoc :visible.sync="isDelDoc"></DelDoc>
    <Bin :visible.sync="isEnterBin" ref="Bin"></Bin>
  </div>
</template>

<script>
import qs from "qs";
import Invite from "./gIchild/Invite.vue";
import LeaveTeam from "./gIchild/LeaveTeam.vue";
import Dismiss from "./gIchild/Dismiss.vue";
import AlterLeader from "./gIchild/AlterLeader.vue";
import AlterPosition from "./gIchild/AlterPosition.vue";
import KickMember from "./gIchild/KickMember.vue";
import ChangeInfo from "./gIchild/ChangeInfo.vue";
import NewDoc from "./gIchild/NewDoc.vue";
import ChangeDocName from "./gIchild/ChangeDocName.vue";
import DelDoc from "./gIchild/DelDoc.vue";
import Bin from "./gIchild/Bin.vue";

export default {
  name: "GroupInfo",
  data() {
    return {
      form: {
        groupName:"",
        ownerEmail:"",
        email: "",
        targetEmail: "",
        position: 0,
        oldGroupName: "",
        newGroupName: "",
        description: "",

        groupFileName: "",
        oldGroupFileName: "",
        newGroupFileName: "",
        file: "",
      },

      ownerName:"",
      docs:[""],
      nickNames:[""],
      userPosition:0,
      poss:[],
      emails:[],

      activeNames: ['1'],

      ocup:["创建者","管理员","成员"],
      transfer:["","取消管理员","设置管理员"],
      isShow: 0,
      inDoc: 0,
      isInvite: false,
      isChange: false,
      isDismiss:false,
      isAlterL: false,
      isAlterP: false,
      isLeave: false,
      isKick: false,
      isNew: false,
      isChangeDoc: false,
      isDelDoc: false,
      isEnterBin: false,
    }
  },
  components: {
    Invite,
    ChangeInfo,
    LeaveTeam,
    Dismiss,
    AlterLeader,
    AlterPosition,
    KickMember,
    NewDoc,
    ChangeDocName,
    DelDoc,
    Bin
},
  methods: {
    handleChange: function(val){
        console.log(val);
    },
    getInfo: function(){
      var that=this;
      this.form.groupName=this.$store.getters.getGroup;
      this.$axios.post("group/groupDetails/",qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.ownerName=res.data.ownerName;
          that.docs=res.data.documents;
          that.nickNames=res.data.nicknames;
          that.userPosition=res.data.userPosition;
          that.poss=res.data.positions;
          that.emails=res.data.emails;
          that.form.description=res.data.description;
        }
      }).catch(
        err=>{console.log(err);}
      )
    },
    show: function(i){
      this.isShow=i;
    },
    common: function(){
      this.isShow=0;
    },
    indoc: function(i){
      this.inDoc=i;
    },
    outdoc: function(){
      this.inDoc=false;
    },
    inviteMember: function(){
      this.isInvite=true;
    },
    invitemember: function(memberEmail){
      this.form.targetEmail=memberEmail;
      var that=this;
      this.$axios.post('group/inviteGroupMember/',qs.stringify(this.form))
      .then(res=>{
        switch(res.data.result)
        {
          case 0:{
            that.$message.success('成功邀请');
            that.isInvite=false;
            that.getInfo();
            break;
          }
          case 2: that.$message.warning('邮箱格式不正确');break;
          case 3: that.$message.error('用户不存在');break;
          case 4: that.$message.warning('成员已经在团队中');break;
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    changeInfo: function(){
      this.isChange=true;
    },
    changeinfo: function(newname,info){
      this.form.oldGroupName=this.form.groupName;
      this.form.newGroupName=newname;
      this.form.description=info;
      var that=this;
      this.$axios.post('group/changeGroupInfo/',qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.$message.success('修改信息成功');
          if(that.form.oldGroupName!=that.form.newGroupName)
            this.$store.dispatch("saveGroup",that.form.newGroupName);
          that.getInfo();
        }
        else that.$message.error('队伍重名');
      }).catch(err=>{
        console.log(err);
      })
    },
    dismiss: function(){
      this.isDismiss=true;
    },
    disband: function(){
      var that=this;
      this.$axios.post('group/disbandGroup/',qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.$message.success('操作成功');
          that.isDismiss=false;
          that.$router.push("/Group");
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    leaveTeam: function(){
      this.isLeave=true;
    },
    leaveteam: function(){
      var that=this;
      this.$axios.post('group/quitGroup/',qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.$message.success('成功退出');
          that.$router.push("/Group");
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    alterLeader: function(){
      this.isAlterL=true;
    },
    alterleader: function(memberEmail){
      this.form.targetEmail=memberEmail;
      var that=this;
      this.$axios.post('group/changeGroupOwner/',qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.$message.success('转让成功');
          that.getInfo();
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    alterPosition: function(i){
      this.isAlterP=true;
      this.form.position=this.poss[i]^1^2;
      this.form.targetEmail=this.emails[i];
    },
    alterposition: function(){
      var that=this;
      this.$axios.post('group/changePosition/',qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.$message.success('修改权限成功');
          that.getInfo();
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    kickMember: function(i){
      this.isKick=true;
      this.form.targetEmail=this.emails[i];
    },
    kickmember: function(){
      var that=this;
      this.$axios.post('group/deleteGroupMember/',qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.$message.success('操作成功');
          that.getInfo();
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    newDoc: function(){
      this.isNew=true;
    },
    newdoc: function(name,text){
      this.form.groupFileName=name;
      this.form.file=text;
      var that=this;
      this.$axios.post("group/createGroupFile/",qs.stringify(this.form))
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
      this.form.groupFileName=name;
    },
    changedocname: function(name){
      this.form.oldGroupFileName=this.form.groupFileName;
      this.form.newGroupFileName=name;
      var that=this;
      this.$axios.post('group/editGroupFileInfo/',qs.stringify(this.form))
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
      this.form.groupFileName=doc;
    },
    deldoc: function(){
      var that=this;
      this.$axios.post('group/deleteGroupFile/',qs.stringify(this.form))
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
      this.form.groupFileName=doc;
      this.$axios.post("group/checkGroupFile/",qs.stringify(this.form))
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
    }
  },
  created() {
    this.form.email=this.$store.getters.getUser;
    //this.form.email="19375162@buaa.edu.cn"
    this.form.ownerEmail=this.form.email;
    this.getInfo();
  }
};
</script>

<style scoped>
  a{text-decoration: none;}
  a:hover{text-decoration:underline;}
  .stress{font-weight: bold;}
  #group
  {
    height: 60px;
  }
  #group div
  {
    line-height: 60px;
    text-align: center;
    font-size: 40px;
  }
  #group div a
  {
    float: right;
    font-size: 16px;
    margin-right: 20px; 
  }
  .clear{clear: both;}
  #teamDocs
  {
    display: inline-block;
    width: 300px;
    height: 500px;
    border: 1px solid #EBEEF5;
    vertical-align: middle;
  }
  #teamDocs div
  {
    height: 60px;
    line-height: 60px;
    font-size: 20px;
    border-bottom: 1px solid #EBEEF5;
    text-align: center;
  }
  #newdoc
  {
    float: right;
    margin-right: 10px;
    font-size: 15px;
    color: #1976d2;
  }
  #teamDocs ul
  {
    height: 380px;
    overflow-y: auto;
  }
  #teamDocs ul li
  {
    list-style-type: none;
    height: 36px;
  }
  .doc
  {
    display: inline-block;
    width: 120px;
    line-height: 36px;
    font-size: 18px;
  }
  #docTransfer
  {
    float: right;
    margin-right: 10px;
    line-height: 36px;
    font-size: 14px;
  }
  #bin
  {
    float: left;
    margin-left: 20px;
    font-size: 30px;
  }
  #teamInfo
  {
    display: inline-block;
    width: 663px;
    height: 500px;
    border: 1px solid #EBEEF5;
    border-left: 0;
    vertical-align: middle;
  }
  #intro
  {
    line-height: 60px;
    text-indent: 40px;
    font-size: 20px;
    border-bottom: 1px solid #EBEEF5;
  }
  #teamInfo div span
  {
    float: right;
    margin-right: 40px; 
  }
  ::v-deep .el-collapse-item__header
  {
    font-size: 15px;
    height: 40px;
  }
  ::v-deep .el-collapse-item__content
  {
    padding-bottom: 12px;
  }
  ::v-deep .el-collapse-item__arrow
  {
    text-indent: 0px;
  }
  #teamInfo ul
  {
    height: 280px;
    overflow-y: auto;
  }
  .member
  {
    list-style-type: none;
    height: 50px;
    font-size: 20px;
    padding-left:10px;
  }
  .member span
  {
    display: inline-block;
    line-height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 150px;
  }
  #manage
  {
    position: absolute;
    top: 520px;
    width: 661px;
  }
  input
  {
    background: cornflowerblue;
    border: 0.5px solid black;
    height: 30px;
    width: 100px;
    color: white;
    position: relative;
    left: 30px;
  }
  #changeinfo
  {
    left: 60px;
    width: 120px;
  }
  #grant
  {
    left: 90px;
    background: green;
  }
  .run
  {
    float: right;
    margin-right: 50px;
    background: red;
  }
  #memberTransfer
  {
    text-align: right;
    font-size: 15px;
    height: 50px;
    width: 270px;
  }

  ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
  }

  ::-webkit-scrollbar-thumb {
      background-color: rgb(167, 159, 159);
      border-radius: 32px;
  }

  ::-webkit-scrollbar-track {
      background-color: transparent;
      border-radius: 32px;
  }

</style>