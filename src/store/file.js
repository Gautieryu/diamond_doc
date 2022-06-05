const key = 'file'
const file = {
    state() {
        return {
            file: ""
        }
    },
    getters: {
        getfile: state=>state.file
    },
    mutations: {
        fileStorage (state, value) {
            state.file = value
        },
    },
    actions: {
        saveFile({ commit }, data) {
            commit('fileStorage', data)
        },
    }
};

export default file
