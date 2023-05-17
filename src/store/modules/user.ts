import axios from 'axios'
import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex'
import store from '@/store';
import { Storage } from '@ionic/storage';

interface User {
    name: string;
    last_name: string;
    phone: string;
    email: string;
    profile_photo_url: string;
    profile_photo_path: string;
    id: number;
    password: string
}

interface State {
    current_user: User
    loader: boolean
    metaa: object
    image_loader:boolean
    users: Array<object>
}

interface RootState {
    snackbar: {
        setSnackbar: (info: {
            message: string
            color: string
            show: boolean
        }) => void
    }
}

const state: State = {
    current_user: {
        name: '',
        last_name: '',
        phone: '',
        email: '',
        profile_photo_url: '',
        profile_photo_path: '',
        id: 0,
        password: ''
      },
    loader: false,
    metaa: {},
    image_loader:false,
    users: []
};

const getters: GetterTree<State, RootState> = {};

const actions: ActionTree<State, RootState> = {
    logout() {
        /*const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        axios.post(apiUrl + "api/v1/logout").then(response => {*/
            const ionicStorage = new Storage();
            ionicStorage.create().then(()=>{
                ionicStorage.remove('token').then(()=>{
                    location.reload();
                })
            })
        //})
    },
    login({ state }: ActionContext<State, RootState>, user) {
        console.log(user)
        state.loader = true
        const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        return new Promise((resolve, reject) => {
            axios.post(apiUrl + "api/v1/user/login", {email:user.email, password:user.password}).then((response: { data: { access_token: string } }) => {
                var token = response.data.access_token
                /*console.log(token)
                if(user.remember){
                    localStorage.setItem("remember_user", JSON.stringify(user));
                }else{
                    localStorage.removeItem("remember_user")
                }
                localStorage.setItem("token", response.data.token);*/
                const ionicStorage = new Storage();
                ionicStorage.create().then(()=>{
                    ionicStorage.set('token', token).then(()=>{
                        resolve(true)
                    })
                })
            }).catch(error=>{
                store.commit('snackbar/setSnackbar', {
                    message: error.response.data.error,
                    color: 'error',
                    show: true
                });
                state.loader = false
                resolve(false)
            })
        })
    },
    getCurrentUser({ commit }: ActionContext<State, RootState>) {
        const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        axios.get(apiUrl + "api/v1/user/current").then(response => {
            commit('setCurrentUser', response.data.data)
        })
    },
    uploadProfilePicture({ state }: ActionContext<State, RootState>, profile_picture) {
        state.image_loader = true
        const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        return new Promise((resolve, reject) => {
            axios.post(apiUrl + "api/v1/upload-profile-picture", profile_picture).then((response: { data: { path: string } }) => {
                resolve(response.data.path)
            }).catch(error=>{
                store.commit('snackbar/setSnackbar', {
                    message: error.response.data.error,
                    color: 'error',
                    show: true
                });
                state.image_loader = false
                resolve(false)
            })
        })
    },
    modifyUser({ state }: ActionContext<State, RootState>, edited_user: User) {
        state.loader = true
        const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        return new Promise((resolve, reject) => {
            axios.patch(apiUrl + "api/v1/users/" + edited_user.id, edited_user).then(response => {
                store.commit('snackbar/setSnackbar', {
                    message: response.data.message,
                    color: 'success',
                    show: true
                });
                state.loader = false
                if (state.current_user.id == edited_user.id) {
                    state.current_user = { ...state.current_user, ...edited_user }; // Fusionar los objetos a[aIndex] y b, manteniendo la propiedad gato de a[aIndex]
                }
                if(state.users.length>0){
                    const usersIndex = state.users.findIndex((item) => item.id === edited_user.id); // Buscar el índice del objeto con id 1 en a
                    if (usersIndex !== -1) {
                        state.users[usersIndex] = { ...state.users[usersIndex], ...edited_user }; // Fusionar los objetos a[aIndex] y b, manteniendo la propiedad gato de a[aIndex]
                    }
                }
                resolve(true)
            }).catch(error=>{
                store.commit('snackbar/setSnackbar', {
                    message: error.message,
                    color: 'error',
                    show: true
                });
                state.loader = false
                resolve(false)
            })
        })
    },
    modifyPassword({ state }: ActionContext<State, RootState>, user) {
        const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
        return new Promise((resolve, reject) => {
            axios.patch(apiUrl + "api/v1/password", user).then(response => {
                store.commit('snackbar/setSnackbar', {
                    message: response.data.message,
                    color: 'success',
                    show: true
                });
                resolve(true)
            }).catch(error=>{
                store.commit('snackbar/setSnackbar', {
                    message: error.message,
                    color: 'error',
                    show: true
                });
                state.loader = false
                resolve(false)
            })
        })
    },
};

const mutations: MutationTree<State> = {
    setCurrentUser(state, data) {
        state.current_user = data;
    },
};
  
export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}