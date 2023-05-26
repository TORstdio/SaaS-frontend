import axios from 'axios'
import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex'
import store from '@/store';

interface RootState {
    snackbar: {
        setSnackbar: (info: {
            message: string
            color: string
            show: boolean
        }) => void
    }
}

interface Sort {
    sort: boolean | undefined,
    value: string
}

interface Filters {
    search_value: string
}

interface Options {
    sort: Sort,
    items_per_page: number,
    page: number,
    filters: Filters
}

interface Client{
    client: object
}

interface State {
    clients: Array<object>
    loader: boolean
    meta: object
}

const state: State = {
    clients: [],
    loader: false,
    meta: {}
};

const getters: GetterTree<State, RootState> = {};

const actions: ActionTree<State, RootState> = {
    getClients({ commit, state }: ActionContext<State, RootState>, options: Options) {
        var link = ''
        link = "?page=" + options.page + "&itemsPerPage=" + options.items_per_page
        if(options.sort.sort==true){
            link = "&sort=" + options.sort.value
        }else if(options.sort.sort==false){
            link = "&sort=-" + options.sort.value
        }
        if(options.filters.search_value!=undefined){
            link = '&' + link + 'filter[name]=' + options.filters.search_value
        }
        state.loader = true
        const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        axios.get(apiUrl + "api/v1/clients" + link).then(response => {
            commit('setClients', response.data)
        }).catch(error=>{
            
        })
    },
    createClient({ commit }: ActionContext<State, RootState>, client: Client) {
        const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        const client_to_save = Object.fromEntries(
            Object.entries(client).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
        );
        return new Promise((resolve, reject) => {
            axios.post(apiUrl + 'api/v1/clients', client_to_save).then(response=>{
                commit('addClient', client)
                store.commit('snackbar/setSnackbar', {
                    message: 'Cambio realizado con éxito',
                    color: 'success',
                    show: true
                });
                resolve(true)
            }).catch(error=>{
                store.commit('snackbar/setSnackbar', {
                    message: error.data,
                    color: 'danger',
                    show: true
                });
                resolve(false)
            })
        })
    },
    modifyClient({ commit }: ActionContext<State, RootState>, items_to_modify: any) {
        const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        axios.patch(apiUrl + 'api/v1/clients/' + items_to_modify.id, items_to_modify).then(response=>{
            store.commit('snackbar/setSnackbar', {
                message: 'Cambio realizado con éxito',
                color: 'success',
                show: true
            });
        }).catch(error=>{
            store.commit('snackbar/setSnackbar', {
                message: 'Hubo un error al realizar el cambio, por favor intenta de nuevo',
                color: 'danger',
                show: true
            });
        })
    },
};

const mutations: MutationTree<State> = {
    setClients(state, data) {
        state.clients = state.clients.concat(data.data);
        state.meta = data.meta
        state.loader = false;
    },
    addClient(state, data){
        state.clients.push(data)
    }
};
  
export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}