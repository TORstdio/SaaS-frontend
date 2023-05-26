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
    meta: any
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
        axios.get(apiUrl + "api/v1/activities" + link).then(response => {
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
    createActivity({ commit }: ActionContext<State, RootState>, activity: Activity) {
        const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        return new Promise((resolve, reject) => {
            axios.post(apiUrl + 'api/v1/activities', activity).then(response=>{
                commit('addActivity', activity)
                resolve(true)
            }).catch(error=>{
                store.commit('snackbar/setSnackbar', {
                    message: error.data,
                    color: 'danger',
                    show: true
                });
            })
        })
    },
    deleteActivity({ commit }: ActionContext<State, RootState>, id: any) {
        console.log(id)
        const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        return new Promise((resolve, reject) => {
            axios.delete(apiUrl + 'api/v1/activities/' + id).then(response=>{
                commit('removeActivity', id)
                store.commit('snackbar/setSnackbar', {
                    message: 'La actividad ha sido eliminada con éxito',
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
            })
        })
    },
    modifyActivity({ commit }: ActionContext<State, RootState>, activity: any) {
        const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        return new Promise((resolve, reject) => {
            axios.patch(apiUrl + 'api/v1/activities/' + activity.id, activity).then(response=>{
                commit('replaceActivity', activity)
                store.commit('snackbar/setSnackbar', {
                    message: 'La actividad se ha modificado con éxito',
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
            })
        })
    },
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
    },
    removeActivity(state, data){
        state.activities = state.activities.filter((activity : any)=>activity.id != data)
        //state.meta.total = data.meta.total - 1
    },
    replaceActivity(state, data){
        const index = state.activities.indexOf(state.activities.filter((activity : any)=>activity.id == data.id)[0])
        state.activities[index] = data
    },
};
  
export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}