import { createStore } from 'vuex';
import userModule from './modules/user';
import snackbarModule from './modules/snackbar';
import clientModule from './modules/client';

export default createStore({
  modules: {
    user: userModule,
    snackbar: snackbarModule,
    client: clientModule
  }
});