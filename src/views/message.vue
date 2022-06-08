<template>
  <div>
      
    <div style="height: 60px; border-bottom: 1px solid black;">
        <a @click="renewMessage()" style="float:left;font-size: 16px;margin: 20px 20px; ">刷新消息</a>
      <span style="line-height: 60px;margin-left: 32%;font-size: 30px;">消息通知</span>
      <a @click="clearMessage()" style="float:right;font-size: 16px;margin: 20px 20px; ">清空消息</a>
    </div>
    <div class="clear"></div>
    <p v-if="titles.length==0">暂无消息通知</p>
    <ul>           
                  <li v-for="v of titles.length" :key="v" @mouseover="indoc(v)" @mouseout="outdoc">
                    <a @click="lookMessage(contents[v-1])">{{titles[v-1]}}</a>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {{times[v-1]}}
                    <span v-show="inDoc==v" >
        
                      <button @click="delMessage(times[v-1])"><i class="el-icon-delete"></i></button>
                    </span>
                  </li>
    </ul>

        <DelMes :visible.sync="isDelMes"></DelMes>
        <ClearMes :visible.sync="isClearMes"></ClearMes>
  
  </div>
</template>

<script>
import qs from "qs";


import DelMes from '../components/MessageChild/DelMes.vue';
import ClearMes from '../components/MessageChild/ClearMes.vue';


export default {

  components: {
    DelMes,
    ClearMes,
},

  data() {
    return {
      form: {
        email: "",
        time: "",
      },

      titles:[],
      contents:[],
      times:[],
      inDoc: 0,

      
      isDelMes: false,
      isClearMes:false,
      
    }
  },

  methods: {

    getInfo: function(){
        this.form.email=this.$store.getters.getUser;
      var that=this;
      this.$axios.post("message/checkMessages/",qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.titles=res.data.titles;
          that.contents=res.data.contents;
          that.times=res.data.times;
        }
      }).catch(
        err=>{console.log(err);}
      )
    },

    indoc: function(i){
      this.inDoc=i;
    },
    outdoc: function(){
      this.inDoc=false;
    },

    
    delMessage: function(timee){
      this.isDelMes=true;
      this.form.time=timee;
      this.form.email=this.$store.getters.getUser;
    },
    delmessage: function(){
      var that=this;
      this.$axios.post('message/deleteMessage/',qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.$message.success('成功删除消息');
          that.getInfo();
        }
      }).catch(err=>{
        console.log(err);
      })
    },

    clearMessage: function(timee){
      this.isClearMes=true;
      this.form.email=this.$store.getters.getUser;
    },
    clearmessage: function(){
      var that=this;
      this.$axios.post('message/deleteMessages/',qs.stringify(this.form))
      .then(res=>{
        if(res.data.result==0)
        {
          that.$message.success('成功清空消息');
          that.getInfo();
        }
      }).catch(err=>{
        console.log(err);
      })
    },

    lookMessage: function(content){
        this.$alert(content, '消息内容', {
          confirmButtonText: '确定',
          callback:null,
        });
    },

    renewMessage: function(){
        this.getInfo();
        this.$message(刷新成功);
    }
    

  },

  created() {
    this.form.email=this.$store.getters.getUser;

    //this.form.email="19375162@buaa.edu.cn"
    this.getInfo();
  }
};
</script>

<style>
  
  .clear{clear:both;}
</style>