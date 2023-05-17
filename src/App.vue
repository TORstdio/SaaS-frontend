<template>
  <ion-app>
    <Login v-if="authenticated=='false'" />
    <App v-if="authenticated=='true'" />
  </ion-app>
</template>

<script lang="ts">
  import { IonApp } from '@ionic/vue';
  import Login from "../src/views/Login.vue";
  import App from "../src/views/App.vue";
  import { defineComponent, ref, onMounted } from "vue";
  import axios from 'axios';


  export default defineComponent({
    name: 'clienTOR',
    components: { 
      Login:Login,
      App:App ,
      IonApp
    },
    setup(){
      const authenticated = ref('');
      onMounted(async () => {
        try {
          await axios.get(import.meta.env.VITE_BACKEND_ROUTE + "api/v1/user/current");
          authenticated.value = 'true';
        } catch (error) {
          localStorage.removeItem("token")
          authenticated.value = 'false';
        }
      });
      return {
        authenticated,
      };
    }
  })
</script>
