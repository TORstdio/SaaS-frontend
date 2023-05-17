import axios from 'axios'
import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex'

interface RootState {
    snackbar: {
        setSnackbar: (info: {
            message: string
            color: string
            show: boolean
        }) => void
    }
}

interface Filter {
    search_value: string
}

interface Client{
    client: object
}

interface State {
    clients: Array
    loader: boolean
    meta: object
    links: object
}

const state: State = {
    clients: [],
    loader: false,
    meta: {},
    links: {}
};

const getters: GetterTree<State, RootState> = {};

const actions: ActionTree<State, RootState> = {
    getClients({ commit, state }: ActionContext<State, RootState>, filters: Filter) {
        var link = '?'
        if(filters.search_value!=undefined){
            link = link + 'filter[name]=' + filters.search_value
        }
        state.loader = true
        const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        axios.get(apiUrl + "api/v1/clients" + link).then(response => {
            commit('setClients', response.data)
        }).catch(error=>{
            
        })
    },
    postClients({ commit }: ActionContext<State, RootState>, client: Client) {
        const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        axios.post(apiUrl + 'api/v1/clients', client).then(response=>{
            commit('addClient', client)
        })
    }
};

const mutations: MutationTree<State> = {
    setClients(state, data) {
        state.clients = data.data;
        state.links = data.links
        state.meta = data.meta;
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