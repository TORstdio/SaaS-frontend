import { createStore } from 'vuex';
import userModule from './modules/user';
import snackbarModule from './modules/snackbar';
import clientModule from './modules/client';
import saleModule from './modules/sale';
import activityModule from './modules/activity';
export default createStore({
  modules: {
    user: userModule,
    snackbar: snackbarModule,
    client: clientModule,
    sale: saleModule,
    activity:activityModule
  }
});