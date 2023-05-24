<template>
  <ion-page style="display: block;" class="bg">
    <ion-grid style="padding:0px;">
      <ion-row>
        <Transition name="fade">
        <ion-col :size="device>=768 ? '3' : '12'" v-if="device>=768 || (device<768 && showColumn=='one')" class="columnOne" style="min-height:calc(100vh - 56px)!important;">
          <ion-segment scrollable style="padding: 5px 10px; background:transparent;">
            <ion-chip v-for="(phase, index) in phases" :key="index" @click="changePhase(phase)" style="padding:5px 10px; height:14px; font-size:12px; display: inline-table; width: 100%; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; transition: background-color 1s;" :outline="selected_phase != phase" :color="selected_phase == phase ? 'white' : 'default'"  :class="selected_phase==phase ? 'columnTwo' : ''">
                {{phase}}
            </ion-chip>
          </ion-segment>
          <ion-content class="scroll-container" style="height: calc(100vh - 56px) !important; overflow-y: auto;">
            <ion-list  style="background: transparent; padding-top:0px;">
              
              <ion-item @click="isModalOpen=true" style="padding:5px 0px 5px 0px; cursor: pointer;" class="add-client-button" color="none" lines="none">
                <ion-icon style="margin-right:10px; font-size:12px;" :icon="addOutline"></ion-icon>
                <ion-label>Agregar Cliente</ion-label>
              </ion-item>

              <ion-item v-for="(client, index) in clientsList" :key="index" @click="selectClient(client)" :style="selected_client!=undefined && client.id==selected_client.id ? 'background:#26549c!important; transition: background-color .03s; border-radius: 6px;':''" style="padding:5px 0px 5px 0px; border-bottom:solid 1px; margin:0px 10px;" class="border-color menu-element" color="none" lines="none">
                <ion-icon style="margin-right:10px; font-size:12px;" :icon="person"></ion-icon>
                <ion-label>{{client.legal_name}}</ion-label>
              </ion-item>
            </ion-list>
            <ion-infinite-scroll @ionInfinite="ionInfinite($event)">
              <ion-infinite-scroll-content></ion-infinite-scroll-content>
            </ion-infinite-scroll>
          </ion-content>
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

          <div v-if="selected_client!=null">
            {{selected_client}}
          </div>
          <div v-else style="background-image:url('/icon.svg'); height:calc(100vh - 56px)!important; background-repeat:no-repeat; background-position: center;" class="logo">

          </div>
          <!-- Contenido de la segunda columna -->
        </ion-col>
        </Transition>
      </ion-row>
    </ion-grid>
    <ion-modal :is-open="isModalOpen" @didDismiss="isModalOpen = false">
      <ion-content>
        <ion-toolbar class="toolbar-space columnTwo" style="position:fixed;" color="transparent">
            <ion-buttons slot="start" style="padding-left:5px;">
              <ion-button @click="isModalOpen = false">
                  <ion-icon :icon="arrowBack"></ion-icon>
              </ion-button>
            </ion-buttons>
            <ion-buttons slot="end" style="padding-right:15px;">
              <ion-button expand="block" style="text-transform: capitalize; --box-shadow: none;" @click="save()">Guardar</ion-button>
            </ion-buttons>
        </ion-toolbar>

        <ion-list style="margin-top:50px; padding:20px; background:transparent;">
          
          <ion-item>
            <ion-label position="floating" style="font-size:14px;" class="login-text">Nombre</ion-label>
            <ion-input type="text" v-bind:v-model="client.legal_name"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating" style="font-size:14px;" class="login-text">Email</ion-label>
            <ion-input type="text" v-bind:v-model="client.email"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" style="font-size:14px;" class="login-text">Teléfono</ion-label>
            <ion-input type="text" v-bind:v-model="client.phone"></ion-input>
          </ion-item>

        </ion-list>

        <div @click="showFiscal=!showFiscal" style="text-align:center; font-size:12px; font-weight:500; cursor: pointer;">
          <div style="margin-bottom:5px;">Datos Fiscales</div>
          <ion-icon v-if="!showFiscal" :icon="chevronDownOutline"></ion-icon>
          <ion-icon v-else :icon="chevronUpOutline"></ion-icon>
        </div>

        <ion-list v-if="showFiscal" style="padding:20px; background:transparent;">

          <ion-item>
            <ion-label position="floating" style="font-size:14px;" class="login-text">Razon Social</ion-label>
            <ion-input type="text" v-bind:v-model="client.legal_name"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating" style="font-size:14px;" class="login-text">RFC</ion-label>
            <ion-input type="text" v-bind:v-model="client.tax_id"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" style="font-size:14px;" class="login-text">Régimen Fiscal</ion-label>
            <ion-select v-bind:v-model="client.tax_system">
              <ion-select-option v-for="(system, index) in tax_systems" :key="index" :value="system.id">{{system.name}}</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label position="floating" style="font-size:14px;" class="login-text">C.P.</ion-label>
            <ion-input type="text" v-bind:v-model="client.zip"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" style="font-size:14px;" class="login-text">Calle</ion-label>
            <ion-input type="text" v-bind:v-model="client.street"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" style="font-size:14px;" class="login-text"># Exterior</ion-label>
            <ion-input type="text" v-bind:v-model="client.exterior"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" style="font-size:14px;" class="login-text"># Interior</ion-label>
            <ion-input type="text" v-bind:v-model="client.interior"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" style="font-size:14px;" class="login-text">Colonia</ion-label>
            <ion-input type="text" v-bind:v-model="client.neighborhood"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" style="font-size:14px;" class="login-text">Ciudad</ion-label>
            <ion-input type="text" v-bind:v-model="client.city"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" style="font-size:14px;" class="login-text">Monicipio</ion-label>
            <ion-input type="text" v-bind:v-model="client.municipality"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" style="font-size:14px;" class="login-text">Estado</ion-label>
            <ion-input type="text" v-bind:v-model="client.state"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" style="font-size:14px;" class="login-text">País</ion-label>
            <ion-input type="text" v-bind:v-model="client.country"></ion-input>
          </ion-item>
            
        </ion-list>

      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonButtons, IonList, IonItem, IonSearchbar, IonRow, IonGrid, IonCol, IonIcon, IonButton, IonSegment, IonModal, IonInput, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue';
import { defineComponent, Transition } from 'vue';
import { person, arrowBack, addOutline, chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import axios from "axios";
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Clients',
  components: { IonPage, IonButtons, IonList, IonItem, IonSearchbar, IonRow, IonGrid, IonCol, IonIcon, IonButton, Transition, IonSegment, IonModal, IonInput, IonInfiniteScroll, IonInfiniteScrollContent },
  setup() {
    const store = useStore();
    const device = window.innerWidth
    return { store, person, device, arrowBack, addOutline, chevronDownOutline, chevronUpOutline };
  },
  mounted(){
    this.store.dispatch('client/getClients', this.options)
  },
  watch:{
    options:{
      handler(){
        this.store.dispatch('client/getClients', this.options)
      }, deep: true
    },
  },
  data() {
    return {
      options:{
        sort:{} as Object,
        items_per_page:15,
        page:1 as Number,
        filters:{} as Object
      },
      showFiscal:false as Boolean,
      client:{
        //name:'' as string,
        legal_name:'' as string,
        tax_id:'' as string,
        tax_system:'' as string,
        zip:'' as string,
        street:'' as string,
        exterior:'' as string,
        interior:'' as string,
        neighborhood:'' as string,
        city:'' as string,
        municipality:'' as string,
        state:'' as string,
        country:'MEX' as string,
        email:'' as string,
        phone:'' as string,
        provider_id:'' as string,
      },
      isModalOpen:false as Boolean,
      showColumn:'one' as string,
      selected_client: null as any,
      selected_phase: 'Todo' as string
    };
  },
  computed:{
    clientsList(){
      return this.store.state.client.clients
    },
    meta(){
      return this.store.state.sale.meta
    },
    loader(){
      return this.store.state.sale.loader
    },
    tax_systems(){
      return [
        {id:'601', name:'601 | General de Ley Personas Morales'},
        {id:'603', name:'603 | Personas Morales con Fines no Lucrativos'},
        {id:'605', name:'605 | Sueldos y Salarios e Ingresos Asimilados a Salarios'},
        {id:'606', name:'606 | Arrendamiento'},
        {id:'607', name:'607 | Régimen de Enajenación o Adquisición de Bienes'},
        {id:'608', name:'608 | Demás ingresos'},
        {id:'609', name:'609 | Consolidación'},
        {id:'610', name:'610 | Residentes en el Extranjero sin Establecimiento Permanente en México'},
        {id:'611', name:'611 | Ingresos por Dividendos (socios y accionistas)'},
        {id:'612', name:'612 | Personas Físicas con Actividades Empresariales y Profesionales'},
        {id:'614', name:'614 | Ingresos por intereses'},
        {id:'615', name:'615 | Régimen de los ingresos por obtención de premios'},
        {id:'616', name:'616 | Sin obligaciones fiscales'},
        {id:'620', name:'620 | Sociedades Cooperativas de Producción que optan por diferir sus ingresos'},
        {id:'621', name:'621 | Incorporación Fiscal'},
        {id:'622', name:'622 | Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras'},
        {id:'623', name:'623 | Opcional para Grupos de Sociedades'},
        {id:'624', name:'624 | Coordinados'},
        {id:'625', name:'625 | Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas'},
        {id:'626', name:'626 | Régimen Simplificado de Confianza'},
        {id:'628', name:'628 | Hidrocarburos'},
        {id:'629', name:'629 | De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales'},
        {id:'630', name:'630 | Enajenación de acciones en bolsa de valores'},
      ]
    },
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
    ionInfinite(ev:any){
      this.options.items_per_page = this.options.items_per_page + 15
      ev.target.complete()
    },
    save(){
      const client = Object.fromEntries(
        Object.entries(this.client).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );
      this.store.dispatch('client/postClient', client)
    },
    selectClient(client:object){
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