const key = 'group'
const group = {
    state() {
        return {
            group: ""
        }
    },
    getters: {
        getGroup: state=>state.group
    },
    mutations: {
        groupStorage (state, value) {
            state.group = value
        },
    },
    actions: {
        saveGroup({ commit }, data) {
            commit('groupStorage', data)
        },
    }
};

export default group
