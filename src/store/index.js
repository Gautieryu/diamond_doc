import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import group from './group'
import text from './text'
import file from './file'
import shareuser from './shareuser'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
      user,
      group,
      text,
      file,
      shareuser,
  }
})
