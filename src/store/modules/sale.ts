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

interface Sale{
    sale: object
}

interface State {
    sales: Array<object>
    loader: boolean
    meta: object
}

const state: State = {
    sales: [],
    loader: false,
    meta: {},
};

const getters: GetterTree<State, RootState> = {};

const actions: ActionTree<State, RootState> = {
    getSales({ commit, state }: ActionContext<State, RootState>, options: Options) {
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

        axios.get(apiUrl + "api/v1/sales" + link).then(response => {
            commit('setSales', response.data)
        }).catch(error=>{
            
        })
    },
    postSales({ commit }: ActionContext<State, RootState>, sale: Sale) {
        const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        axios.post(apiUrl + 'api/v1/sales', sale).then(response=>{
            commit('addSale', sale)
        })
    }
};

const mutations: MutationTree<State> = {
    setSales(state, data) {
        state.sales = data.data;
        state.meta = data.meta
        state.loader = false;
    },
    addSale(state, data){
        state.sales.push(data)
    }
};
  
export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}