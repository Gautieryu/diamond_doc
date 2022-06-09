<template>
  <el-app id="inspire">

    <el-container>
      <el-header app color="white" flat height="100">
        <el-app-bar>
          <el-container class="py-0 fill-height">

            <el-avatar :size="40" height="100" :src="require('./assets/diamond.jpg')"></el-avatar>

            <v-btn @click="toIndex()">Diamond-Doc</v-btn>

            <v-btn v-for="v in 5" :key="v" text @click="changePage(v)">
              <!-- {{ v }} -->
              <!-- {{PageLink[v]}} -->
              {{ PageName[v - 1] }}
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn text @click="toMessage()">
              通知
            </v-btn>

            <OpenCardButton v-if="!isLogin"></OpenCardButton>
            <LogoutButton v-if="isLogin"></LogoutButton>
          </el-container>

        </el-app-bar>
      </el-header>

      <el-container>
        <el-aside width="300px">

          <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
            background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">导航二</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
              <i class="el-icon-document"></i>
              <span slot="title">导航三</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-setting"></i>
              <span slot="title">导航四</span>
            </el-menu-item>
          </el-menu>

        </el-aside>

        <el-main class="grey lighten-3" min-height="70vh" rounded="lg">
          <v-container>
            <v-row>
              <v-col cols="10">
                <v-sheet>
                  <router-view v-if="isRouterAlive"></router-view>
                </v-sheet>
              </v-col>
            </v-row>
          </v-container>
        </el-main>

      </el-container>

    </el-container>
  </el-app>
</template>

<script>
import OpenCardButton from "./components/OpenCardButton";
import LogoutButton from "./components/LogoutButton";
export default {
  name: "App",
  components: {
    OpenCardButton,
    LogoutButton
  },

  provide() {
    return {
      reload: this.reload
    }
  },

  data: () => ({

    isRouterAlive: true,

    PageLink: {
      1: "userInfo",
      2: "WorkSpace",
      3: "Group",
      4: "collect",
      5: "recently",
    },
    PageName: ["个人信息", "工作台", "团队", "收藏文档", "最近浏览"],
  }),
  methods: {
    changePage(key) {
      let toLink = this.PageLink[key];
      this.$router.push(toLink);
    },
    toMessage() {
      this.$router.push("message");
    },
    toIndex() {
      this.$router.push("App");
    },
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  },
  computed: {
    // isLogin: function(){
    //   return this.$store.getters.getUser==='' || this.$store.getters.getUser===null
    // },
    isLogin: function () {
      return this.$store.getters.isLogin
    }
  },

};
</script>

<style>
.el-header,
.el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body>.el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
