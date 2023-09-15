export const state = () => ({
  user: {},
  countries: {},
  treeData: {},
  currentPersonData: {},
  headerState: 'expand', // collapse
})

export const getters = {
  getHeaderState(state) {
    return state.headerState
  },
}

export const mutations = {
  setUser(state, newValue) {
    state.user = newValue
  },
  setCountries(state, newValue) {
    state.countries = newValue
  },
  setTreeData(state, newValue) {
    state.treeData = newValue
  },
  setCurrentPersonData(state, newValue) {
    state.currentPersonData = newValue
  },
  setHeaderState(state, newValue) {
    state.headerState = newValue
  },
}

export const actions = {
  login({ commit }, payload) {
    return $fetch
      .post('/api/User/login', payload)
      .then((data) => {
        commit('setCountries', data)
        return data
      })
      .catch((err) => {
        return err
      })
  },
  getCountries({ commit }) {
    return $fetch
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
    return $fetch
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
    return $fetch
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
    return $fetch
      .post('/api/individual', personData)
      .then((data) => {
        return data
      })
      .catch((err) => {
        return err
      })
  },
  editPersonData({ commit }, personData) {
    return $fetch
      .put('/api/individual', personData)
      .then((data) => {
        return data
      })
      .catch((err) => {
        return err
      })
  },
  deletePersonData({ commit }, id) {
    return $fetch
      .delete(`/api/individual/${id}`)
      .then((data) => {
        return data
      })
      .catch((err) => {
        return err
      })
  },
  getCurrentUser({ commit }) {
    return $fetch
      .get(`/api/User/current-user`)
      .then((data) => {
        return data
      })
      .catch((err) => {
        return err
      })
  },
  toggleHeader({ commit }, headerState) {
    commit('setHeaderState', headerState)
  },
}
