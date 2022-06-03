<template>
    <div>
        创建个人文档
        
        <div>文件名</div>
        
        <el-input v-model="name_input" placeholder="请输入文件名"></el-input>
        
        <div>模板选择</div>
    
        <el-select v-model="moban_value" placeholder="模板选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>

        <div>
            <el-button @click="createFile()">确认创建文档</el-button>
        </div>
        

    </div>


  
      
    
</template>

<script>

export default {
  name: "createFile",

  components: {

    },

    data() {
    return {
      name_input: '',
      moban_value: '',
      options: [{
          value: '选项1',
          label: '空模板'
        }, {
          value: '选项2',
          label: 'cnm'
        }],
    }
  },

  methods:{
      createFile(){
          this.$alert('创建文本成功！', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            });
          }
        });
      },
  },

  
};
</script>