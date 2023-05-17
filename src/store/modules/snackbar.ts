import { Module } from 'vuex';

interface SnackbarState {
  info: {
    color: string;
    show: boolean;
    message: string;
  }
}

interface SnackbarModule extends Module<SnackbarState, any> {
  mutations: {
    setSnackbar(state: SnackbarState, data: SnackbarState['info']): void;
  }
}

const snackbar: SnackbarModule = {
  namespaced: true,

  state: {
    info: {
      color: '',
      show: false,
      message: ''
    }
  },

  mutations: {
    setSnackbar(state, data) {
      state.info = data;
    }
  }
};

export default snackbar;