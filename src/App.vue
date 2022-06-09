<template>
  <v-app id="inspire">
    <v-app-bar app color="white" flat>
      <v-container class="py-0 fill-height">

        <el-avatar :size="40" :fit="fill" :src="curl"></el-avatar>

        <el-button @click="toApp" style="color: gray;background-color:whitesmoke;  font-size:medium;">Diamond-Doc</el-button>

        <v-btn v-for="v in 5" :key="v" text @click="changePage(v)" retain-focus-on-click>
          <!-- {{ v }} -->
          <!-- {{PageLink[v]}} -->
          {{ PageName[v - 1] }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn text @click="toMessage()"> 通知 </v-btn>

        <OpenCardButton v-if="!isLogin"></OpenCardButton>
        <LogoutButton v-if="isLogin"></LogoutButton>
      </v-container>
    </v-app-bar>

    <v-main class="grey lighten-3 backImage">
      <v-container>
        <v-row>
          <v-col cols="10">
            <v-sheet min-height="70vh" rounded="lg">
              <router-view v-if="isRouterAlive"></router-view>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import OpenCardButton from "./components/OpenCardButton";
import LogoutButton from "./components/LogoutButton";
export default {
  name: "App",
  components: {
    OpenCardButton,
    LogoutButton,
  },

  provide (){
    return {
      reload: this.reload,
    };
  },
  data: () => ({
    curl:require('./assets/diamond.jpg'),
    isRouterAlive:true,
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
    toApp(){
      this.$router.push("userInfo");
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
  computed: {
    // isLogin: function(){
    //   return this.$store.getters.getUser==='' || this.$store.getters.getUser===null
    // },
    isLogin: function () {
      return this.$store.getters.isLogin;
    },
  },
};
</script>

<style scoped>
.backImage {
  background-image: url(./assets/cut2.jpg);
  /* background-image: url(./assets/sea.jfif); */
  background-repeat:no-repeat;
  background-size: cover;
  width:100%;			  
  height:100vh;			
  overflow:scroll;
  display:flow-root;
}
</style>
