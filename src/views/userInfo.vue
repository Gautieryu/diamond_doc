<template>
  <!-- 这是用户信息页面 -->
  <!-- v-if="isLogin" -->
  <div class="dev_border" v-if="isLogin">
    <v-form ref="form" v-model="valid" lazy-validation class="user_form">
      <v-container>
        <v-row class="dev_border">
          <v-spacer></v-spacer>
          <v-col cols="8">
            <v-text-field
              v-model="nickname"
              :counter="10"
              :rules="nicknameRules"
              label="昵称"
              required
              class="dev_border"
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

        <v-row class="dev_border">
          <v-spacer></v-spacer>
          <v-col cols="8">
            <v-text-field
              v-model="trueName"
              :counter="7"
              :rules="trueNameRules"
              label="真实姓名"
              class="dev_border"
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

        <v-row class="dev_border">
          <v-spacer></v-spacer>
          <v-col cols="8">
            <v-select
              v-model="select"
              :items="items"
              label="性别"
              data-vv-name="select"
            ></v-select>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

        <v-row class="dev_border">
          <v-spacer></v-spacer>
          <v-col cols="8">
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              label="原密码"
              required
              class="dev_border"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

        <v-row class="dev_border">
          <v-spacer></v-spacer>
          <v-col cols="8">
            <v-text-field
              v-model="newPassword"
              :rules="newPasswordRules"
              label="新密码"
              class="dev_border"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

        <v-row class="dev_border">
            <v-spacer></v-spacer>
            {{errnoMessage}}
            <v-spacer></v-spacer>
        </v-row>

        <v-row class="dev_border">
          <v-spacer></v-spacer>
          <!-- <v-col class="dev_border" cols="2"> -->
          <v-btn :disabled="!valid" color="success" @click="validate">
            {{ button_info }}
          </v-btn>
          <!-- </v-col> -->
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "userInfo",
  data() {
    return {
      show1: false,
      errnoMessage:'',
      form_is: [],
      button_info: "修改个人信息",
      // form
      valid: true,
      nickname: "",
      nicknameRules: [
        (v) => !!v || "请输入昵称",
        (v) =>
          (v && v.length <= 20 && /^[A-Za-z0-9]*$/.test(v)) ||
          "昵称不能多于20个字符,且只能为字母或数字",
      ],
      trueName: "",
      trueNameRules: [
        (v) => !!v || "请输入真实姓名",
        (v) => /^[\u4e00-\u9fa5]{1,}$/.test(v) || "真实姓名只能为汉字",
        (v) => (v && v.length <= 7) || "真实姓名不能长于七个汉字",
      ],
      select: null,
      items: [
        '男',
        '女',
        '保密',
      ],
      password: "",
      passwordRules: [
        (v) => !!v || "请输入密码",
        (v) =>
          (v && v.length <= 15 && v.length >= 6) || "密码必须在6-15个字符之间",
        (v) => /^[A-Za-z0-9]{6,20}$/.test(v) || "密码仅能包含字母、数字",
      ],
      newPassword: "",
      newPasswordRules: [
        (v) => !!v || "请输入新密码",
        (v) =>
          (v && v.length <= 15 && v.length >= 6) || "密码必须在6-15个字符之间",
        (v) => /^[A-Za-z0-9]{6,20}$/.test(v) || "密码仅能包含字母、数字",
      ],
      email: "",
      emailRules: [
        (v) => !!v || "请输入北航邮箱",
        (v) => /^[0-9]*@buaa.edu.cn$/.test(v) || "请输入正确的北航邮箱",
      ],
      validation_message: "",
      validation_messageRules: [(v) => !!v || "验证码错误"],
    };
  },
  mounted() {
    this.getUserInfoFromBackend();
  },
  // watch: {
  //   page_type: function () {
  //     this.page_type_change();
  //   },
  // },
  computed: {
    isLogin: function(){
      return this.$store.getters.isLogin
    }
  },
  methods: {
    getUserInfoFromBackend() {
      let user_email = sessionStorage.getItem('email');
      console.log("getUserInfoFromBackend:" + user_email);
      let data = new FormData();
      let that = this;
      data.append("email", user_email);
      let url = "http://101.43.141.16/diamondBack/user/checkUserInfo/";
      axios
        .post(url, data)
        .then(function (response) {
          console.log(response);
          console.log(response.data.message);
          //查看个人信息成功
          if (response.data.result === 0) {
            console.log("查看个人信息成功!");
            that.nickname=response.data.nickname
            that.sex=response.data.sex
            that.trueName=response.data.trueName
          } else {
            console.log("getUserInfoFromBackend fail, errno:" + response.data.result);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    validate() {
      console.log("validate");
      this.changeUserInfo()
    },
    changeUserInfo() {
      console.log("changeUserInfo");
      let data = new FormData();
      let user_email = sessionStorage.getItem('email')
      let that = this;
      data.append("email", user_email);
      data.append("oldPassword", this.oldPassword);
      data.append("newPassword", this.newPassword);
      data.append("nickname", this.nickname);
      data.append("sex", this.select);
      data.append("trueName", this.trueName);

      let url = "http://101.43.141.16/diamondBack/user/changeUserInfo/";
      axios
        .post(url, data)
        .then(function (response) {
          console.log(response);
          console.log(response.data.message);
          //修改个人信息成功
          if (response.data.result === 0) {
            console.log("修改个人信息成功!");
            console.log("changeUserInfo success" + response.data.message);
          } else {
            console.log("changeUserInfo fail, errno:" + response.data.result);
            that.errnoMessage=response.data.message
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>
<style scoped>
.user_form {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* width: 80vw; */
}

a {
  text-decoration: none;
}

.button_center {
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

/* .dev_border {
  border: 1px solid black;
}
.dev_border_tmp {
  border: 1px solid blue;
} */
</style>
