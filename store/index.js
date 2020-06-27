export const state = () => ({
  treeData: {}
})

export const mutations = {
  changeTreeData(state, newValue) {
    state.treeData = newValue
  }
}

export const actions = {
  getTreeData({ commit }) {
    console.log('action')
    return this.$fTAxios
      .get('/users')
      .then((data) => {
        commit('changeTreeData', data)
        return data
      })
      .catch((err) => {
        return err.response
      })
  }
}
