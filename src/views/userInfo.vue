<template>
  <div>
    userInfo
    <!-- <img :src="require('../assets/diamond.jpg')" alt="diamond" /> -->
    <!-- <v-img
      :src="require('../assets/helloImage.webp')"
      class="my-3"
      contain
      height="100"
    /> -->
  </div>
</template>

<script>
import HelloWorld from "../components/HelloWorld";

export default {
  name: "userInfo",

  components: {
    HelloWorld,
  },
};
</script>

<style scoped>
.main {
  background-image: url(../assets/helloImage.webp);
}
</style>