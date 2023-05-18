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
    date: string
}

interface Options {
    sort: Sort,
    items_per_page: number,
    page: number,
    filters: Filters
}

interface Activity{
    activity: object
}

interface State {
    activities: Array<object>
    types: Array<object>
    loader: boolean
    meta: object
}

const state: State = {
    activities: [],
    loader: false,
    meta: {},
    types:[]
};

const getters: GetterTree<State, RootState> = {};

const actions: ActionTree<State, RootState> = {
    getActivities({ commit, state }: ActionContext<State, RootState>, options: Options) {
        var link = ''
        if(options.page!=undefined){
            link = "?page=" + options.page
        }
        if(options.items_per_page!=undefined){
            link = link + "&itemsPerPage=" + options.items_per_page
        }
        if(options.sort.sort==true){
            link = "&sort=" + options.sort.value
        }else if(options.sort.sort==false){
            link = "&sort=-" + options.sort.value
        }
        if(options.filters!=undefined){
            if(options.filters.date!=undefined){
                link = link + '?filter[date_between]=' + options.filters.date
            }
        }
        state.loader = true
        const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        axios.get(apiUrl + "api/v2/calendars" + link).then(response => {
            console.log(response)
            commit('setActivities', response.data)
        }).catch(error=>{
            
        })
    },
    getActivityTypes({ commit, state }: ActionContext<State, RootState>) {
        const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        axios.get(apiUrl + "api/v1/activity/all").then(response => {
            commit('setActivityTypes', response.data)
        }).catch(error=>{
            
        })
    },
    postAnctivity({ commit }: ActionContext<State, RootState>, activity: Activity) {
        const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        axios.post(apiUrl + 'api/v1/activity', activity).then(response=>{
            commit('addActivity', activity)
        })
    }
};

const mutations: MutationTree<State> = {
    setActivities(state, data) {
        state.activities = data.data;
        state.meta = data.meta
        state.loader = false;
    },
    addActivity(state, data){
        state.activities.push(data)
    },
    setActivityTypes(state, data){
        state.types = data
    }
};
  
export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}