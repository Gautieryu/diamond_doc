<template>
  <div>

    <header>
      <span>个人文档</span>
      <div>

        <button @click="enterBin">
          <i class="el-icon-delete"></i>
          <span class="createNew">回收站</span>
        </button>

        <button @click="viewShare">
          <i class="el-icon-share"></i>
          <span class="createNew">查看分享文档</span>
        </button>

        <button @click="newDoc">
          <i class="el-icon-plus"></i>
          <span class="createNew">创建文档</span>
        </button>

      </div>
    </header>


    <div class="clear"></div>

    <div v-if="docs.length == 0">
      <el-empty description="暂无个人文档"></el-empty>
    </div>

    <div v-else>

      <el-table :data="searchData" height="500" borderstyle="width:100%">

        <el-table-column label="文档名" width="420">
          <template slot-scope="scope">
            <button @click="lookDoc(scope.row.name)">
              <i class="el-icon-files"></i>
              <a :title="scope.row.name">
                {{ scope.row.name }}
              </a>
            </button>
          </template>
        </el-table-column>

        <el-table-column label="详细信息" width="180">
          <template slot-scope="scope">
            <el-button class="el-icon-info" @click="checkPersonalFileInfo(docs[scope.$index])">

            </el-button>
          </template>
        </el-table-column>

        <el-table-column label="修改信息" width="180">
          <template slot-scope="scope">
            <el-button class="el-icon-edit-outline" @click="changeDocName(docs[scope.$index])">

            </el-button>
          </template>
        </el-table-column>

        <el-table-column label="删除文档" width="180">
          <template slot-scope="scope">
            <el-button class="el-icon-delete-solid" @click="delDoc(docs[scope.$index])">

            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>



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
        position: 0,
        description: "",
        file: "",
        personalFile: "",
        targetFileID: "",
      },

      docs: [],
      collect: [],
      searchData: [],
      tableData: [],

      isNew: false,
      isChangeDoc: false,
      isDelDoc: false,
      isEnterBin: false,
      isVimShare: false,
    }
  },

  methods: {

    getInfo: function () {
      this.tableData = [];
      var that = this;
      this.$axios.post("workplace/checkCreatedPersonalFile/", qs.stringify(this.form))
        .then(res => {
          if (res.data.result == 0) {
            that.docs = res.data.personalFileName;
            that.collect = res.data.isCollect;
            var i;
            for (i = 0; i < res.data.personalFileName.length; i++) {
              var group = { name: "", };
              group.name = res.data.personalFileName[i];
              that.tableData.push(group);
            }
            that.searchData = that.tableData;
          }
        }).catch(
          err => { console.log(err); }
        )
    },

    checkPersonalFileInfo: function (name) {
      this.form.personalFileName = name;
      var that = this;
      this.$axios.post("workplace/checkPersonalFileInfo/", qs.stringify(this.form))
        .then(res => {
          if (res.data.result == 0) {
            if (res.data.description.length == 0) {
              that.$alert('暂无简介', '文档简介', {
                confirmButtonText: '确定',
                callback: null,
              });
            }
            else{
              that.$alert(res.data.description, '文档简介', {
                confirmButtonText: '确定',
                callback: null,
              });
            }

          }
        }).catch(
          err => { console.log(err); }
        )
    },

    viewShare: function () {
      this.isVimShare = true;
    },
    viewshare: function (ID) {
      this.form.targetFileID = ID;
      this.form.email = this.$store.getters.getUser;
      var that = this;
      this.$axios.post("workplace/checkSharedPersonalFile/", qs.stringify(this.form))
        .then(res => {
          if (res.data.result == 0) {
            this.$store.dispatch('saveShareUserInfo', res.data.email);
            this.$store.dispatch('saveText', res.data.targetFile);
            this.$store.dispatch('saveFile', res.data.fileName);
            if (res.data.position == 1) //只读
            {
              window.open('#/VimShareReadOnly', '_self');
            }
            else if (res.data.position == 0) //可编辑
            {
              window.open('#/VimShareWrite', '_self');
            }
            that.close();
          }
        }).catch(
          err => { console.log(err); }
        )
    },

    newDoc: function () {
      this.isNew = true;
    },
    newdoc: function (name, text) {
      this.form.personalFileName = name;
      this.form.file = text;
      var that = this;
      this.$axios.post("workplace/createPersonalFile/", qs.stringify(this.form))
        .then(res => {
          if (res.data.result == 0) {
            that.$message.success('创建文档成功');
            that.getInfo();
          }
          else that.$message.error('文档重名');
        }).catch(
          err => { console.log(err); }
        )
    },

    changeDocName: function (name) {
      this.isChangeDoc = true;
      this.form.personalFileName = name;
    },
    changedocname: function (name, des, pos) {
      this.form.oldPersonalFileName = this.form.personalFileName;
      this.form.newPersonalFileName = name;
      this.form.description = des;
      if (pos == '0') this.form.position = 0;
      else this.form.position = 1;
      var that = this;
      this.$axios.post('workplace/editPersonalFileInfo/', qs.stringify(this.form))
        .then(res => {
          if (res.data.result == 0) {
            that.$message.success('修改文档信息成功');
            that.getInfo();
          }
          else that.$message.error('文档重名');
        }).catch(err => {
          console.log(err);
        })
    },
    delDoc: function (doc) {
      this.isDelDoc = true;
      this.form.personalFileName = doc;
    },
    deldoc: function () {
      var that = this;
      this.$axios.post('workplace/deletePersonalFile/', qs.stringify(this.form))
        .then(res => {
          if (res.data.result == 0) {
            that.$message.success('成功移入回收站');
            that.getInfo();
          }
        }).catch(err => {
          console.log(err);
        })
    },
    lookDoc: function (doc) {
      this.form.personalFileName = doc;
      this.form.email = this.$store.getters.getUser;
      var that = this;
      this.$axios.post("workplace/checkPersonalFile/", qs.stringify(this.form))
        .then(res => {
          if (res.data.result == 0) {
            that.$store.dispatch('saveText', res.data.personalFile);
            that.$store.dispatch('saveFile', doc);
            window.open('#/VimWord', '_self');
          }
        }).catch(err => {
          console.log(err);
        })
    },


    enterBin: function () {
      this.isEnterBin = true;
      this.$refs.Bin.getInfo();
    },


  },

  created() {
    this.form.email = this.$store.getters.getUser;

    //this.form.email="19375162@buaa.edu.cn"
    this.getInfo();
  }
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
  border-radius: 3px;
  padding: 5px 5px;
  width: 160px;
  align-items: center;
}

.el-button {
  width: 26px;
}

button:hover {
  background-color: rgb(240, 240, 240);
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
</style>
