<template>
  <div>
    <v-btn text @click="Logout"> 注销 </v-btn>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "LogoutButton",

  components: {},

  data() {
    return {};
  },

  methods: {
    Logout() {
      //接口

      let data = new FormData();
      let user_email = sessionStorage.getItem("email");
      console.log("logout:" + user_email);
      let that = this;
      data.append("email", user_email);
      let url = "http://101.43.141.16/diamondBack/user/logout/";
      axios
        .post(url, data)
        .then(function (response) {
          console.log(response);
          console.log(response.data.message);
          //向后端发送注销请求成功后，在这儿清除前端用户账号信息
          if (response.data.result === 0) {
            that.$store.dispatch("clearUserInfo");
            sessionStorage.removeItem("email");
            sessionStorage.removeItem("nickname");
            console.log(that.$store.getters.getUser);
          } else {
            console.log("logout fail, errno:" + response.data.result);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>