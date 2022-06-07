const key = 'user'
const user = {
    state() {
        return {
            user: "",
        }
    },
    getters: {
        getUser: state=>state.user,
    },
    mutations: {
        userStorage (state, value) {
            state.user = value
            localStorage.setItem(key, JSON.stringify(value))
        },
        removeStorage (state) {
            state.user = null
            localStorage.removeItem(key)
        },

    },
    actions: {
        saveUserInfo({ commit }, data) {
            commit('userStorage', data)
        },
        clearUserInfo({ commit }) {
            commit('removeStorage');
        },
    }
};

export default user
