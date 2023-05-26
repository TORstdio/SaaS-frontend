<template>
    <ion-page class="bg">
        
    </ion-page>
</template>

<script lang="ts">
import { IonPage } from '@ionic/vue';
import {  } from 'ionicons/icons';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

  export default defineComponent({
    name: 'Catalogs',
    components: { IonPage },
    setup(){
      const store = useStore();
      return { store }
    },
    data(){
        return{
        
        }
    },
    computed:{
      
    },
    methods: {
      
    }
})

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
}
</style>