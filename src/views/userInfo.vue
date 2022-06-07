<template>
  <div>
    userInfo2
    <v-icon @click="test">
      mdi-eye
    </v-icon>
  </div>
</template>

<script>
import HelloWorld from "../components/HelloWorld";

export default {
  name: "userInfo",

  components: {
    HelloWorld,
  },
  methods: {
    test(){
      let a=sessionStorage.getItem('email')
      let b=this.$store.getters.getUser
      console.log('a:'+a)
      console.log('b:'+b)
    }
  }
};
</script>

<style scoped>
.main {
  background-image: url(../assets/helloImage.webp);
}
</style>