<template>
  <div class="dev_border">
    <v-form ref="form" v-model="valid" lazy-validation class="user_form">
      <v-container>
        <v-row class="dev_border">
          <v-spacer></v-spacer>
          <v-col cols="8">
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="邮箱"
              required
              class="dev_border"
              v-if="form_is[0]"
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

        <!-- <v-row class="dev_border">
          <v-spacer></v-spacer>
          <v-col cols="8">
            
          </v-col>
          <v-spacer></v-spacer>
        </v-row> -->

        <v-row class="dev_border">
          <v-spacer></v-spacer>
          <v-col cols="5">
            <v-text-field
              v-model="validation_message"
              :rules="validation_messageRules"
              label="验证码"
              required
              v-if="form_is[1]"
              class="dev_border"
            ></v-text-field>
          </v-col>
          <v-col cols="3" class="dev_border" :align-self="center">
            <v-spacer></v-spacer>
            <!-- <div class="dev_border_tmp"> -->
            <v-btn
              :disabled="send"
              color="success"
              @click="send_verify_code"
              class="verify_btn_class"
              v-if="form_is[1]"
              small
            >
              发送验证码
            </v-btn>
            <!-- </div> -->
            <v-spacer></v-spacer>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

        <v-row class="dev_border">
          <v-spacer></v-spacer>
          <v-col cols="8">
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              label="密码"
              required
              class="dev_border"
              v-if="form_is[2]"
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
              label="再次输入密码"
              required
              class="dev_border"
              v-if="form_is[3]"
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
              v-model="name"
              :counter="10"
              :rules="nameRules"
              label="昵称"
              required
              class="dev_border"
              v-if="form_is[4]"
            ></v-text-field>
          </v-col>
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
  name: "UserInfoForm",
  props: {
    page_type: {
      type: String,
      default: "no",
    },
  },
  data() {
    return {
      center: "center",
      // watchPage: 'no',
      show1: false,
      // 0邮箱 1验证码 2密码 3再次输入密码 4昵称
      register_forms: [1, 1, 1, 1, 1],
      login_forms: [1, 0, 1, 0, 0],
      find_password_forms: [1, 1, 1, 1, 0],
      form_is: [],
      button_info: "",
      link_show: [1, 1, 1],
      // 收集到的信息
      user_info: {
        prefix: "",
        name: "",
        password: "",
        email: "",
      },
      // form
      valid: true,
      send: false,
      name: "",
      nameRules: [
        (v) => !!v || "请输入昵称",
        (v) =>
          (v && v.length <= 20 && /^[A-Za-z0-9]*$/.test(v)) ||
          "昵称不能多于20个字符,且只能为字母或数字",
      ],
      password: "",
      passwordRules: [
        (v) => !!v || "请输入密码",
        (v) =>
          (v && v.length <= 15 && v.length >= 6) || "密码必须在6-15个字符之间",
        (v) => /^[A-Za-z0-9]{6,20}$/.test(v) || "密码仅能包含字母、数字",
      ],
      newPassword: "",
      // newPasswordRules: [
      //   (v) => !!v || "请输入密码",
      //   (v) =>
      //     (v && v.length <= 15 && v.length >= 6) || "密码必须在6-15个字符之间",
      //   (v) => /^[A-Za-z0-9]{6,20}$/.test(v) || "密码仅能包含字母、数字",
      // ],
      email: "",
      emailRules: [
        (v) => !!v || "请输入北航邮箱",
        (v) => /^[0-9]*@buaa.edu.cn$/.test(v) || "请输入正确的北航邮箱",
      ],
      validation_message: "",
      validation_messageRules: [(v) => !!v || "验证码错误"],
      prefix: null,
      items: ["前缀 1", "前缀 2", "前缀 3", "前缀 4"],
    };
  },
  mounted() {
    console.log("in:" + this.page_type);
    this.page_type_change();
  },
  watch: {
    page_type: function () {
      this.page_type_change();
    },
  },
  computed: {
    comPasswd() {
      return this.center;
    },
    newPasswordRules() {
      let rules = [
        (v) => !!v || "请输入密码",
        (v) =>
          (v && v.length <= 15 && v.length >= 6) || "密码必须在6-15个字符之间",
        (v) => /^[A-Za-z0-9]{6,20}$/.test(v) || "密码仅能包含字母、数字",
      ];
      if (this.password != this.newPassword) {
        let rule = (v) => "两次输入的密码必须一致";
        rules.push(rule);
      }
      return rules;
    },
  },
  methods: {
    page_type_change() {
      if (this.page_type === "login") {
        this.form_is = this.login_forms;
        this.button_info = "登录";
        this.link_show[1] = 0;
        console.log("flag1");
      } else if (this.page_type === "findPassword") {
        this.form_is = this.find_password_forms;
        this.button_info = "找回密码";
        this.link_show[2] = 0;
      } else {
        this.form_is = this.register_forms;
        this.button_info = "注册";
        this.link_show[0] = 0;
      }
    },
    validate() {
      console.log("this.button_info:" + this.button_info);
      if (this.button_info === "登录") {
        this.login();
      } else if (this.button_info === "注册") {
        this.register();
      } else {
        this.findPassword();
      }
    },
    login() {
      console.log("login:" + this.email);
      let data = new FormData();
      let user_email=this.email
      let that=this
      data.append("email", this.email);
      data.append("password", this.password);
      let url = "http://101.43.141.16/diamondBack/user/login/";
      axios
        .post(url, data)
        .then(function (response) {
          console.log(response);
          console.log(response.data.message);
          //登录成功
          if(response.data.result===0){
            sessionStorage.setItem('nickname',response.data.nickname)
            sessionStorage.setItem('email',user_email)
            that.$store.dispatch('saveUserInfo',user_email)
            console.log('登录成功! nickname:'+response.data.nickname)
            that.$emit('login_success','login!')
          }else{
            console.log('login fail, errno:'+response.data.result)
          }
          
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    register() {
      console.log("register:" + this.email);
      let data = new FormData();
      let that=this
      data.append("nickname", this.name);
      data.append("password", this.password);
      data.append("email", this.email);
      data.append("code", this.validation_message);
      //diamondBack/user/register/ [name='register']
      let url = "http://101.43.141.16/diamondBack/user/register/";
      axios
        .post(url, data)
        .then(function (response) {
          console.log(response);
          console.log(response.data.message);
          //注册成功
          if(response.data.result===0){
            that.$emit('to_login_card','register')
            console.log('注册成功!')
          }else{//失败
            console.log('register fail, errno:'+response.data.result)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    findPassword() {
      console.log("findPassword:" + this.email);
      let data = new FormData();
      let that=this
      data.append("email", this.email);
      data.append("code", this.validation_message);
      data.append("password", this.password);
      
      let url = "http://101.43.141.16/diamondBack/user/changePassword/";
      axios
        .post(url, data)
        .then(function (response) {
          console.log(response);
          console.log(response.data.message);
          //找回密码成功
          if(response.data.result===0){
            that.$emit('to_login_card','findPassword')
            console.log('找回密码成功!')
          }else{//失败
            console.log('findPassword fail, errno:'+response.data.result)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    send_verify_code() {
      console.log("send_verify_code:" + this.email);
      let data = new FormData();
      data.append("email", this.email);
      
      if(this.page_type==='register'){//注册时发送验证码
        var url = "http://101.43.141.16/diamondBack/user/registerEmail/";
      }
      else {//找回密码
        var url = "http://101.43.141.16/diamondBack/user/changePasswordEmail/";
      }
      
      axios
        .post(url, data)
        .then(function (response) {
          console.log(response);
          console.log(response.data.message);
          //验证码成功
          if(response.data.result===0){
            console.log('验证码成功!')
          }else{//失败
            console.log('send_verify_code fail, errno:'+response.data.result)
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
