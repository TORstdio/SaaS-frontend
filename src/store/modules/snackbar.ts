import { Module } from 'vuex';

interface SnackbarState {
  info: {
    color: string;
    show: boolean;
    message: string;
  },
  show_split_pane: boolean
}
interface SnackbarModule extends Module<SnackbarState, any> {
  mutations: {
    setSnackbar(state: SnackbarState, data: SnackbarState['info']): void;
    setSplitPane(state: SnackbarState, data: SnackbarState['show_split_pane']): void;
  }
}

const snackbar: SnackbarModule = {
  namespaced: true,

  state: {
    info: {
      color: '',
      show: false,
      message: ''
    },
    show_split_pane: true
  },

  mutations: {
    setSnackbar(state, data) {
      state.info = data;
    },
    setSplitPane(state, data) {
      state.show_split_pane = data;
    }
  }
};

export default snackbar;