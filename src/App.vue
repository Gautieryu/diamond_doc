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

        <v-btn v-for="v in 4" :key="v" text @click="changePage(v)">
          <!-- {{ v }} -->
          <!-- {{PageLink[v]}} -->
          {{ PageName[v - 1] }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-responsive max-width="260">
          <v-text-field
            dense
            flat
            hide-details
            rounded
            solo-inverted
          ></v-text-field>
        </v-responsive>
      </v-container>
    </v-app-bar>

    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-sheet rounded="lg">
              <v-list color="transparent">
                <v-list-item v-for="v in 3" :key="v" link @click="LeftClick(v)">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ n }}
                      {{ LeftButtons[v - 1] }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item link color="grey lighten-4">
                  <v-list-item-content>
                    <v-list-item-title @click="ToTrash()">
                      回收站
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col cols="10">
            <v-sheet min-height="70vh" rounded="lg">
              <router-view></router-view>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    PageLink: {
      1: "userInfo",
      2: "WorkSpace",
      3: "Group",
      4: "VimWord",
    },
    PageName: ["个人信息", "工作台", "团队", "编辑"],
    LeftButtons: ["最近浏览的文档", "收藏的文档", "创建的文档"],
    LeftButtonsLinks: {
      1: "recently",
      2: "collect",
      3: "create",
    },
  }),
  methods: {
    changePage(key) {
      let toLink = this.PageLink[key];
      this.$router.push(toLink);
    },
    LeftClick(key) {
      console.log("LeftClick" + key);
      let toLink = this.LeftButtonsLinks[key];
      this.$router.push(toLink);
    },
    ToTrash() {
      this.$router.push("trash");
    },
  },
};
</script>
