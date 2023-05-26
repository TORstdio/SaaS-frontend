<template>
  <ion-app>
    <Login v-if="authenticated=='false'" />
    <App v-if="authenticated=='true'"/>
    <ion-toast :is-open="snackbar.show" :message="snackbar.message" :duration="3000" :color="snackbar.color" style="text-align: center;"></ion-toast>
  </ion-app>
</template>

<script lang="ts">
  import { IonApp, IonToast } from '@ionic/vue';
  import Login from "../src/views/Login.vue";
  import App from "../src/views/App.vue";
  import { defineComponent, ref, onMounted } from "vue";
  import axios from 'axios';
  import { useStore } from 'vuex';
  import { Storage } from '@ionic/storage';

  export default defineComponent({
    name: 'clienTOR',
    components: { 
      Login:Login,
      App:App,
      IonApp, IonToast
    },
    computed:{
      snackbar(){
        return this.store.state.snackbar.info
      },
    },
    setup(){
      const store = useStore();
      const authenticated = ref('');
      onMounted(async () => {
        try {
          await axios.get(import.meta.env.VITE_BACKEND_ROUTE + "api/v1/user/current");
          authenticated.value = 'true';
        } catch (error) {

          const ionicStorage = new Storage();
          ionicStorage.create().then(()=>{
            ionicStorage.remove('token')
          })

          authenticated.value = 'false';
        }
      });
      return {
        authenticated, store
      };
    }
  })
</script>
