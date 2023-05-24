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
        console.log(options)
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
    postClients({ commit }: ActionContext<State, RootState>, client: Client) {
        const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        axios.post(apiUrl + 'api/v1/clients', client).then(response=>{
            commit('addClient', client)
        })
    }
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