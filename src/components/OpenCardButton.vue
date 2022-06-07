<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on"> 登录 </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5 card_title show_border">
          <v-spacer></v-spacer>
          {{ cardName }}
          <v-spacer></v-spacer>
        </v-card-title>
        <UserInfoForm
          :page_type="cardType"
          @to_login_card="to_login_card"
          @login_success="login_success"
        ></UserInfoForm>
        <!-- @user_info='store_user_info'  -->

        <v-card-actions>
          <!-- <v-spacer></v-spacer> -->
          <!-- <v-row> -->
            <!-- <v-col> -->
              <v-btn color="green darken-1" text @click="cardButtonLeft">
                {{ leftButtonText }}
              </v-btn>
            <!-- </v-col> -->
            <v-spacer></v-spacer>
            <!-- <v-col> -->
              <v-btn color="green darken-1" text @click="cardButtonRight">
                {{ rightButtonText }}
              </v-btn>
            <!-- </v-col> -->
          <!-- </v-row> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import UserInfoForm from "./UserInfoForm.vue";

export default {
  name: "OpenCardButton",

  components: {
    UserInfoForm,
  },
  data() {
    return {
      dialog: false,
      cardType: "login",
      cardName: "登录",
      leftButtonText: "注册",
      rightButtonText: "找回密码",
    };
  },
  methods: {
    cardButtonLeft() {
      if (this.cardType === "login") {
        //点击注册
        this.cardName = "注册";
        this.leftButtonText = "登录";
        this.rightButtonText = "找回密码";
        this.cardType = "register";
        console.log(this.cardType);
      } else if (this.cardType === "register") {
        //点击登录
        this.cardName = "登录";
        this.leftButtonText = "注册";
        this.rightButtonText = "找回密码";
        this.cardType = "login";
        console.log(this.cardType);
      } else {
        //点击注册
        this.cardName = "注册";
        this.leftButtonText = "登录";
        this.rightButtonText = "找回密码";
        this.cardType = "register";
        console.log(this.cardType);
      }
      // this.dialog=false
    },
    cardButtonRight() {
      if (this.cardType === "login") {
        //点击找回密码
        this.cardName = "找回密码";
        this.rightButtonText = "登录";
        this.leftButtonText = "注册";
        this.cardType = "findPassword";
        console.log(this.cardType);
      } else if (this.cardType === "register") {
        //点击找回密码
        this.cardName = "找回密码";
        this.rightButtonText = "登录";
        this.leftButtonText = "注册";
        this.cardType = "findPassword";
        console.log(this.cardType);
      } else {
        //点击登录
        this.cardName = "登录";
        this.rightButtonText = "找回密码";
        this.leftButtonText = "注册";
        this.cardType = "login";
        console.log(this.cardType);
      }
      // this.dialog=false
    },
    to_login_card() {
      this.cardName = "登录";
      this.cardType = "login";
      this.rightButtonText = "找回密码";
      this.leftButtonText = "注册";
      console.log(this.cardType);
    },
    login_success(){
      this.dialog=false
      console.log('flag1')
    }
  },
};
</script>

<style scoped>
.card_title{
  text-align: center;
}
/* .show_border{
  border: 1px solid black;
} */
</style>
