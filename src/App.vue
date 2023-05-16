<template>
  <ion-app>
    <appcontainer />
    <!--login v-if="!dialog && !token"/-->
  </ion-app>
</template>

<script lang="ts">
  import { IonApp, IonRouterOutlet } from '@ionic/vue';
  import Login from "../src/views/Login.vue";
  import App from "../src/views/App.vue";
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: { 
      login:Login,
      appcontainer:App  
    },
  })
</script>
