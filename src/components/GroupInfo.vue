<template>
  <div>
    <div id="group">
      <span>{{form.groupName}}</span>
      <button @click="back" id="back">返回</button>
    </div>
    <span class="clear"></span>
    <span id="teamDocs">
      <header class="doctitle">
        <span>团队文档</span>
        <button id="newdoc" @click="newDoc" v-show="userPosition!=2">
          <i class="el-icon-document-add"></i>
        </button>
      </header>
      <ul>
        <el-empty v-if="docs.length==0" description="暂无团队文档" :image="nodoc"></el-empty>
        <li v-for="v of docs.length" :key="v" @mouseover="indoc(v)" @mouseout="outdoc">
          <button class="doc" @click="lookDoc(docs[v-1])" :title="docs[v-1]">
            <i class="el-icon-document"></i>&nbsp;
            <span>{{docs[v-1]}}</span>
          </button>
          <span id="docTransfer" v-show="userPosition!=2&&inDoc==v">
            <a @click="checkGroupFileInfo(docs[v-1])">简介</a>&nbsp;&nbsp;
            <a @click="changeDocInfo(docs[v-1])">信息修改</a>&nbsp;&nbsp;
            <button @click="delDoc(docs[v-1])"><i class="el-icon-close"></i></button>
          </span>
        </li>
      </ul>
      <div class="docbin">
        <button id="bin" @click="enterBin" v-show="userPosition!=2">
          <i class="el-icon-delete-solid"></i>
          <span>回收站</span>
        </button>
      </div>
    </span>
    <span id="teamInfo">
      <header id="intro"> 
          <span><i class="el-icon-user-solid"></i>&nbsp;&nbsp;创建者：{{ownerName}}</span>
          <span><i class="el-icon-user"></i>&nbsp;&nbsp;成员数：{{nickNames.length}}</span>
      </header>
      <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="团队简介" name="1">
              <div>{{form.groupDescription}}</div>
            </el-collapse-item>
      </el-collapse>
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
    <ChangeInfo :visible.sync="isChange" :teamInfo="form.groupDescription"></ChangeInfo>
    <AlterLeader :visible.sync="isAlterL"></AlterLeader>
    <LeaveTeam :visible.sync="isLeave"></LeaveTeam>
    <Dismiss :visible.sync="isDismiss"></Dismiss>
    <AlterPosition :visible.sync="isAlterP"></AlterPosition>
    <KickMember :visible.sync="isKick"></KickMember>
    <NewDoc :visible.sync="isNew"></NewDoc>
    <ChangeDocInfo :visible.sync="isChangeDoc"></ChangeDocInfo>
    <DelDoc :visible.sync="isDelDoc"></DelDoc>
    <Bin :visible.sync="isEnterBin" ref="Bin"></Bin>
  </div>
</template>

<script>
import qs from "qs";
// import noDoc from "../assets/noDoc.png";
import Invite from "./gIchild/Invite.vue";
import LeaveTeam from "./gIchild/LeaveTeam.vue";
import Dismiss from "./gIchild/Dismiss.vue";
import AlterLeader from "./gIchild/AlterLeader.vue";
import AlterPosition from "./gIchild/AlterPosition.vue";
import KickMember from "./gIchild/KickMember.vue";
import ChangeInfo from "./gIchild/ChangeInfo.vue";
import NewDoc from "./gIchild/NewDoc.vue";
import ChangeDocInfo from "./gIchild/ChangeDocInfo.vue";
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
        groupDescription: "Code your group description there.",
        fileDescription: "",

        groupFileName: "",
        oldGroupFileName: "",
        newGroupFileName: "",
        file: ""
      },

      ownerName:"",
      docs:[""],
      nickNames:[""],
      userPosition:0,
      poss:[],
      emails:[],

      activeNames: ['1'],
      nodoc: noDoc,
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
    ChangeDocInfo,
    DelDoc,
    Bin
},
  methods: {
    back: function(){
      this.$router.push('/Group');
    },
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
          that.form.groupDescription=res.data.description;
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
      this.form.groupDescription=info;
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
        switch(res.data.result)
        {
          case 0:{
            that.$message.success('转让成功');
            that.getInfo();
            break;
          }
          case 2: that.$message.warning('邮箱格式不正确');break;
          case 3: that.$message.error('用户不存在');break;
          case 4: that.$message.warning('用户不在团队中');break;
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
    checkGroupFileInfo: function(name){
      this.form.groupFileName=name;
      var that=this;
      this.$axios.post("group/checkGroupFileInfo/",qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0) 
        {
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
    changeDocInfo: function(name){
      this.isChangeDoc=true;
      this.form.groupFileName=name;
    },
    changedocinfo: function(name,info){
      this.form.oldGroupFileName=this.form.groupFileName;
      this.form.newGroupFileName=name;
      this.form.fileDescription=info;
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
          this.$store.dispatch('saveFile',doc);
          window.open('#/vimGroupDoc','_self');
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
  a:hover{text-decoration: underline;}
  div{font-family:"Helvetica Neue",Helvetica,"PingFang SC"
    ,"Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;}
  .stress{font-weight: bold;}
  #group
  {
    height: 60px;
  }
  #group span
  {
    font-family: 'Times New Roman',Times,serif;
    font-size: 34px;
    margin-left: 48%;
    line-height: 60px;
  }
  #back
  {
    float: right;
    width: 60px;
    font-size: 14px;
    margin: 14px 20px;
    border-radius: 3px;
    padding: 5px;
  }
  #back:hover
  {
    background-color: rgb(240, 240, 240);
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
  .doctitle
  {
    display: flex;
    height: 60px;
    font-size: 20px;
    padding: 0 22px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #EBEEF5;
  }
  #newdoc
  {
    font-size: 18px;
  }
  #teamDocs ul
  {
    margin: 0;
    padding: 0;
    height: 380px;
    overflow-y: auto;
  }
  #teamDocs ul li
  {
    list-style-type: none;
    height: 32px;
    margin: 5px 0;
  }
  .doc
  {
    display: inline-block;
    text-align: left;
    margin-left: 12px;
    padding: 0 12px;
    width: 140px;
    white-space: nowrap;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis; 
    overflow:hidden;
    line-height: 32px;
    font-size: 16px;
    border-radius: 3px;
  }
  .doc:hover
  {
    background-color: rgb(240, 240, 240);
  }
  #docTransfer
  {
    float: right;
    margin-right: 10px;
    line-height: 36px;
    font-size: 14px;
  }

  .docbin
  {
    border-top: 2px solid #EBEEF5;
    display: flex;
    align-items: center;
  }
  #bin
  {
    float: left;
    margin-top: 8px;
    margin-left: 14px;
    font-size: 30px;
    display: inline-flex;
    border-radius: 6px;
    padding: 5px 5px;
    align-items: center;
  }
  #bin span
  {
    margin-left: 15px;
    font-size: 15px;
  }
  #bin:hover
  {
    background-color: rgb(240, 240, 240);
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
    display: flex;
    line-height: 60px;
    height: 60px;
    font-size: 20px;
    padding: 0 25px;
    align-items: center;
    justify-content: space-between;
  }
  ::v-deep .el-collapse-item__wrap
  {
    padding: 0 25px;
    word-break:break-all;
  }
  ::v-deep .el-collapse-item__header
  {
    font-size: 15px;
    padding-left: 25px;
    height: 40px;
  }
  ::v-deep .el-collapse-item__content
  {
    font-size: 14px;
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
    font-size: 18px;
  }
  .member span
  {
    display: inline-block;
    line-height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 240px;
  }
  #manage
  {
    position: absolute;
    top: 520px;
    width: 661px;
  }
  input
  {
    font-size: 16px;
    background: cornflowerblue;
    border-radius: 5px;
    height: 40px;
    width: 100px;
    color: white;
    position: relative;
    left: 30px;
  }
  #changeinfo
  {
    left: 60px;
    width: 130px;
  }
  #grant
  {
    left: 90px;
    background: #67c23a;
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
    width: 120px;
  }
  ::-webkit-scrollbar 
  {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-thumb
  {
    background-color: rgb(167, 159, 159);
    border-radius: 32px;
  }
  ::-webkit-scrollbar-track 
  {
      background-color: transparent;
      border-radius: 32px;
  }

</style>
