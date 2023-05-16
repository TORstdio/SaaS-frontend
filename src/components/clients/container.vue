<template>
  <ion-page style="display: block;">
    <ion-grid style="padding:0px;">
      <ion-row>
        <Transition name="fade">
        <ion-col :size="device>=768 ? '3' : '12'" v-if="device>=768 || (device<768 && showColumn=='one')" class="columnOne" style="min-height:calc(100vh - 56px)!important;">
          <ion-segment scrollable style="padding: 5px 10px; background:transparent;">
            <ion-chip v-for="(phase, index) in phases" :key="index" @click="changePhase(phase)" style="padding:5px 10px; height:14px; font-size:12px; display: inline-table; width: 100%; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; transition: background-color 1s;" :outline="selected_phase != phase" :color="selected_phase == phase ? 'white' : 'default'"  :class="selected_phase==phase ? 'columnTwo' : ''">
                {{phase}}
            </ion-chip>
          </ion-segment>
          <div class="scroll-container" style="height: calc(100vh - 56px) !important; overflow-y: auto;">
            <ion-list  style="background: transparent; padding-top:0px;">
              <ion-item v-for="(client, index) in clients" :key="index" @click="selectClient(client)" :style="client.id==selected_client.id ? 'background:#26549c!important; transition: background-color .03s; border-radius: 6px;':''" style="padding:5px 0px 5px 0px; border-bottom:solid 1px; margin:0px 10px;" class="border-color menu-element" color="none" lines="none">
                <ion-icon style="margin-right:10px; font-size:12px;" :icon="person"></ion-icon>
                <ion-label>{{client.name}}</ion-label>
              </ion-item>
            </ion-list>
          </div>
          <!-- Contenido de la primera columna -->
        </ion-col>
        </Transition>
        <Transition name="fade">
        <ion-col :size="device>=768 ? '9' : '12'" v-if="device>=768 || (device<768 && showColumn=='two')" class="columnTwo border-color" style="min-height:calc(100vh - 56px)!important; border-left:1px solid;">
          <div style="margin-bottom:10px;" class="hide-desktop">
            <ion-buttons slot="start">
              <ion-button @click="showColumn='one'">
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
import { IonPage, IonButtons, IonList, IonItem, IonSearchbar, IonRow, IonGrid, IonCol, IonIcon, IonButton, IonSegment } from '@ionic/vue';
import { defineComponent, Transition } from 'vue';
import { person, arrowBack } from 'ionicons/icons';

export default defineComponent({
  name: 'Clients',
  components: { IonPage, IonButtons, IonList, IonItem, IonSearchbar, IonRow, IonGrid, IonCol, IonIcon, IonButton, Transition, IonSegment },
  setup() {
    const device = window.innerWidth
    return { person, device, arrowBack };
  },
  data() {
    return {
      showColumn:'one',
      selected_client:{id:0},
      selected_phase: 'Todo'
    };
  },
  computed:{
    phases(){
      return ['Todo', 'En cotización', 'Vendido', 'Sin Actividad', 'Otro']
    },
    clients(){
      var response = [
        {name: "Uno Negocios", id:1, status:'Otro'},
        {name: "Territorium", id:2, status:'En cotización'},
        {name: "Gamavision", id:3, status:'Vendido'},
        {name: "Bignow", id:4, status:'Sin Actividad'},
        {name: "Tacos el Güero", id:5, status:'Vendido'},
        {name: "Dr Mauricio Marcos Fahme", id:6, status:'En cotización'},
        {name: "Teypack", id:7, status:'Sin Actividad'},
        {name: "TPE Cajas", id:8, status:'Vendido'},
        {name: "Cyetpak", id:9, status:'En cotización'},
        {name: "Tacos el Güero", id:10, status:'Otro'},
        {name: "Dr Mauricio Marcos Fahme", id:11, status:''},
        {name: "Teypack", id:12, status:'Otro'},
        {name: "TPE Cajas", id:13, status:'Vendido'},
        {name: "Cyetpak", id:14, status:'En cotización'},
        {name: "Tacos el Güero", id:5, status:'Sin Actividad'},
        {name: "Dr Mauricio Marcos Fahme", id:15, status:'Otro'},
        {name: "Teypack", id:16, status:'Otro'},
        {name: "TPE Cajas", id:17, status:'Sin Actividad'},
        {name: "Cyetpak", id:18, status:'Vendido'},
        {name: "Tacos el Güero", id:19, status:'En Cotizacion'},
        {name: "Dr Mauricio Marcos Fahme", id:20, status:'En Cotizacion'},
        {name: "Teypack", id:21, status:'Otro'},
        {name: "TPE Cajas", id:22, status:'En Cotizacion'},
        {name: "Cyetpak", id:23, status:'En Cotizacion'},
      ]
      if(this.selected_phase!='Todo'){
        return response.filter(item=>item.status == this.selected_phase)
      }else{
        return response
      }
    }
  },
  methods: {
    selectClient(client:Object){
      this.selected_client=client
      if(this.device<768){
        this.showColumn = "two"
      }
    },
    changePhase(phase:string){
      this.selected_phase = phase
    }
  }
});
</script>
<style scoped>
@media (min-width: 768px) {
  .hide-desktop {
    display: none;
  }
}
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