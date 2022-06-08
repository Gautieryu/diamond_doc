<template>
  <v-app id="inspire" >
    <v-app-bar app color="white" flat >
      <v-container class="py-0 fill-height">
        <v-avatar class="mr-10" color="grey darken-1" size="32" tile>
          <v-img
            :src="require('./assets/diamond.jpg')"
            class="my-3"
            contain
            height="100"
          />
        </v-avatar>

        <v-btn v-for="v in 5" :key="v" text @click="changePage(v)">
          <!-- {{ v }} -->
          <!-- {{PageLink[v]}} -->
          {{ PageName[v - 1] }}
        </v-btn>

        <v-spacer></v-spacer>

        <OpenCardButton v-if="!isLogin"></OpenCardButton>
        <LogoutButton v-if="isLogin"></LogoutButton>
      </v-container>
    </v-app-bar>

    <v-main class="grey lighten-3">
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
    LogoutButton
  },

  provide (){
    return {
      reload: this.reload
    }
  },

  data: () => ({

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
    reload(){
      this.isRouterAlive=false
      this.$nextTick(function(){
        this.isRouterAlive=true
      })
    }
  },
  computed:{
    // isLogin: function(){
    //   return this.$store.getters.getUser==='' || this.$store.getters.getUser===null
    // },
    isLogin: function(){
      return this.$store.getters.isLogin
    }
  },
  
};
</script>
