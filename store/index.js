export const state = () => ({
  countries: {},
  treeData: {},
  currentPersonData: {}
})

export const mutations = {
  setCountries(state, newValue) {
    state.countries = newValue
  },
  setTreeData(state, newValue) {
    state.treeData = newValue
  },
  setCurrentPersonData(state, newValue) {
    state.currentPersonData = newValue
  }
}

export const actions = {
  getCountries({ commit }) {
    return this.$fTAxios
      .get('/api/configuration/countries')
      .then((data) => {
        commit('setCountries', data)
        return data
      })
      .catch((err) => {
        return err
      })
  },
  getTreeData({ commit }) {
    return this.$fTAxios
      .get('/api/individual/familytree')
      .then((data) => {
        commit('setTreeData', data)
        return data
      })
      .catch((err) => {
        return err
      })
  },
  getPersonData({ commit }, id) {
    return this.$fTAxios
      .get(`/api/individual/${id}`)
      .then((data) => {
        commit('setCurrentPersonData', data)
        return data
      })
      .catch((err) => {
        return err
      })
  },
  addPersonData({ commit }, personData) {
    return this.$fTAxios
      .post('/api/individual', personData)
      .then((data) => {
        return data
      })
      .catch((err) => {
        return err
      })
  },
  deletePersonData({ commit }, id) {
    return this.$fTAxios
      .delete(`/api/individual/${id}`)
      .then((data) => {
        return data
      })
      .catch((err) => {
        return err
      })
  }
}
