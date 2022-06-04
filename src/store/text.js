const key = 'text'
const text = {
    state() {
        return {
            text: ""
        }
    },
    getters: {
        gettext: state=>state.text
    },
    mutations: {
        textStorage (state, value) {
            state.text = value
        },
    },
    actions: {
        saveText({ commit }, data) {
            commit('textStorage', data)
        },
    }
};

export default text
