export const strict = false;

export const state = () => ({
  defaultPageSize: 10,
  userInfo: {}
});

export const mutations = {
  setUserInfo (state, data) {
    state.userInfo = data
  },
  clearUserInfo () {
    state.userInfo = {}
  }
};

export const actions = {
  async getUserInfo({commit, state}) {
    const result = await this.$axios.$get(`/user/info`);
    commit('setUserInfo', result);
  },
};
