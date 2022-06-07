const key = 'shareuser'
const shareuser = {
    state() {
        return {
            shareuser:"",
        }
    },
    getters: {
        getShareUser: state=>state.shareuser,
    },
    mutations: {
        shareuserStorage (state, value) {
            state.shareuser = value
            localStorage.setItem(key, JSON.stringify(value))
        },
        removeshareuserStorage (state) {
            state.shareuser = null
            localStorage.removeItem(key)
        },

    },
    actions: {
        saveShareUserInfo({ commit }, data) {
            commit('shareuserStorage', data)
        },
        clearShareUserInfo({ commit }) {
            commit('removeshareuserStorage');
        }
    }
};

export default shareuser
