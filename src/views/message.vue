<template>
  <div>

    <header>
      <span>消息通知</span>
      <div>

        <button @click="renewMessage()">
          <i class="el-icon-loading"></i>
          <span class="createNew">刷新消息</span>
        </button>

        <button @click="clearMessage()">
          <i class="el-icon-bell"></i>
          <span class="createNew">清空消息</span>
        </button>

      </div>
    </header>

    <div class="clear"></div>

    <div v-if="searchData.length == 0">
      <el-empty description="暂无消息通知"></el-empty>
    </div>

    <div v-else>

      <el-table :data="searchData" height="500" borderstyle="width:100%">

        <el-table-column label="消息标题" width="550">
          <template slot-scope="scope">
            <i class="el-icon-files"></i>
            <a :title="scope.row.name" @click="lookMessage(contents[scope.$index])">
              {{ scope.row.name }}
            </a>
          </template>
        </el-table-column>

        <el-table-column prop="time" label="时间" width="200">

        </el-table-column>

        <el-table-column label="删除" width="180">
          <template slot-scope="scope">
            <el-button class="el-icon-delete" @click="delMessage(times[scope.$index])">

            </el-button>
          </template>
        </el-table-column>

      </el-table>

    </div>

    <DelMes :visible.sync="isDelMes"></DelMes>
    <ClearMes :visible.sync="isClearMes"></ClearMes>

  </div>
</template>

<script>
import qs from "qs";


import DelMes from '../components/MessageChild/DelMes.vue';
import ClearMes from '../components/MessageChild/ClearMes.vue';


export default {

  components: {
    DelMes,
    ClearMes,
  },

  data() {
    return {
      form: {
        email: "",
        time: "",
      },

      titles: [],
      contents: [],
      times: [],
      inDoc: 0,
      searchData: [],
      tableData: [],


      isDelMes: false,
      isClearMes: false,

    }
  },

  methods: {

    getInfo: function () {
      this.tableData = [];
      this.form.email = this.$store.getters.getUser;
      var that = this;
      this.$axios.post("message/checkMessages/", qs.stringify(this.form))
        .then(res => {
          if (res.data.result == 0) {
            that.titles = res.data.titles;
            that.contents = res.data.contents;
            that.times = res.data.times;

            var i;
            for (i = 0; i < res.data.titles.length; i++) {
              var group = { name: "", time: "" };
              group.name = res.data.titles[i];
              group.time = res.data.times[i];
              that.tableData.push(group);
            }



            that.searchData = that.tableData;
          }
        }).catch(
          err => { console.log(err); }
        )
    },

    indoc: function (i) {
      this.inDoc = i;
    },
    outdoc: function () {
      this.inDoc = false;
    },


    delMessage: function (timee) {
      this.isDelMes = true;
      this.form.time = timee;
      this.form.email = this.$store.getters.getUser;
    },
    delmessage: function () {
      var that = this;
      this.$axios.post('message/deleteMessage/', qs.stringify(this.form))
        .then(res => {
          if (res.data.result == 0) {
            that.$message.success('成功删除消息');
            that.getInfo();
          }
        }).catch(err => {
          console.log(err);
        })
    },

    clearMessage: function (timee) {
      this.isClearMes = true;
      this.form.email = this.$store.getters.getUser;
    },
    clearmessage: function () {
      var that = this;
      this.$axios.post('message/deleteMessages/', qs.stringify(this.form))
        .then(res => {
          if (res.data.result == 0) {
            that.$message.success('成功清空消息');
            that.getInfo();
          }
        }).catch(err => {
          console.log(err);
        })
    },

    lookMessage: function (content) {
      this.$alert(content, '消息内容', {
        confirmButtonText: '确定',
        callback: null,
      });
    },

    renewMessage: function () {
      this.$message.success("刷新成功");
      this.getInfo();
    }


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
  border-radius: 10px;
  padding: 5px 5px;
  width: 160px;
  align-items: center;
}

button:hover {
  background-color: rgb(240, 240, 240);
}

.el-button {
  border-radius: 10px;
  padding: 5px 5px;
  width: 27px;
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