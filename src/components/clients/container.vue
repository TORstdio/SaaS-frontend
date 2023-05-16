<template>
  <ion-page style="display: block;">
    <ion-grid style="padding:0px;">
      <ion-row>
        <Transition name="fade">
        <ion-col :size="device>=768 ? '3' : '12'" v-if="device>=768 || (device<768 && showColumn=='one')" class="columnOne" style="min-height:calc(100vh - 56px)!important;">
          <ion-list  style="background: transparent; margin-top:10px;">
            <ion-item v-for="(client, index) in clients" :key="index" @click="selectClient(client)" style="padding:5px 0px 5px 0px; border-bottom:solid 1px;" class="border-color" color="none" lines="none">
              <ion-icon style="margin-right:10px; font-size:12px;" :icon="person"></ion-icon>
              <ion-label>{{client.name}}</ion-label>
            </ion-item>
          </ion-list>
          <!-- Contenido de la primera columna -->
        </ion-col>
        </Transition>
        <Transition name="fade">
        <ion-col :size="device>=768 ? '9' : '12'" v-if="device>=768 || (device<768 && showColumn=='two')" class="columnTwo border-color" style="min-height:calc(100vh - 56px)!important; border-left:1px solid;">
          <div style="margin-bottom:10px;">
            <ion-buttons slot="start">
              <ion-button class="hide-desktop" @click="showColumn='one'">
                <ion-icon style="font-size:20px;" slot="icon-only" :icon="arrowBack"></ion-icon>
              </ion-button>
            </ion-buttons>
          </div>

          {{selected_client}}
          <!-- Contenido de la segunda columna -->
        </ion-col>
        </Transition>
      </ion-row>
    </ion-grid>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonButtons, IonList, IonItem, IonSearchbar, IonRow, IonGrid, IonCol, IonIcon, IonButton } from '@ionic/vue';
import { defineComponent, Transition } from 'vue';
import { person, arrowBack } from 'ionicons/icons';

export default defineComponent({
  name: 'Clients',
  components: { IonPage, IonButtons, IonList, IonItem, IonSearchbar, IonRow, IonGrid, IonCol, IonIcon, IonButton, Transition },
  setup() {
    const device = window.innerWidth
    return { person, device, arrowBack };
  },
  data() {
    return {
      showColumn:'one',
      selected_client:{}
    };
  },
  computed:{
    clients(){
      return [
        {name: "Uno Negocios", id:1},
        {name: "Territorium", id:2},
        {name: "Gamavision", id:3},
        {name: "Bignow", id:4},
        {name: "Tacos el Güero", id:5},
        {name: "Dr Mauricio Marcos Fahme", id:6},
        {name: "Teypack", id:7},
        {name: "TPE Cajas", id:8},
        {name: "Cyetpak", id:9},
      ]
    }
  },
  methods: {
    selectClient(client:Object){
      this.selected_client=client
      if(this.device<768){
        this.showColumn = "two"
      }
    }
  }
});
</script>
<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
  }
</style>