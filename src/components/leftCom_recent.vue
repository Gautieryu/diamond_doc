<template>
  <div class="grey lighten-3">
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
              最近浏览的文本
            </v-sheet>
          </v-col>
          
        </v-row>
      </v-container>
  </div>
</template>

<script>

export default {

  components: {
  },

  data: () => ({
    LeftButtons: ["最近浏览的文档", "收藏的文档", "创建的文档"],
    LeftButtonsLinks: {
      1: "recently",
      2: "collect",
      3: "create",
    },
  }),

  methods: {
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
