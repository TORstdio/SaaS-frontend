<template>
  <ion-page class="bg">
      <ion-row>
        <ion-col v-if="device >= 768 || show==''" :size="device >= 768 ? '3' : '12'" class="border-calendar" style="border-right:1px solid; min-height:100vh; padding:0px;">
          <ion-item color="none">
            <ion-buttons slot="start" style="padding-left:5px;">
              <ion-button @click="closeModal()">
                <ion-icon :icon="arrowBack"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-item>
          <ion-list style="background: transparent; margin-top:10px;">
            <ion-item color="none" lines="none" style="margin-top:5px;" v-for="(option, index) in menuOptions" :key="index" @click="show=option.component" class="menu-element" :class="{ 'menu-item-selected': show === option.component }">
              <ion-icon style="margin-right:15px;" :icon="option.icon" slot="start"></ion-icon>
              <ion-label style="font-size:14px;">{{ option.label }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-col>

        <ion-col :size="device >= 768 ? '9' : '12'" style="min-height:100vh; padding:0px;">
          <ion-toolbar v-if="device < 768">
            <ion-buttons slot="start" style="padding-left:5px;">
              <ion-button @click="show=''">
                <ion-icon :icon="arrowBack"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
          <account v-if="show=='account'"/>
          <catalogs v-if="show=='catalogs'"/>
        </ion-col>

      </ion-row>
  </ion-page>
</template>

<script lang="ts">
import { IonGrid, IonRow, IonCol, IonPage, IonLabel, IonButton, IonIcon, IonCard, IonCardContent, IonItem, IonInput } from '@ionic/vue';
import { personOutline, arrowBack, appsOutline } from 'ionicons/icons';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import account from '../settings/account/container.vue'
import catalogs from '../settings/catalogs/container.vue'

  export default defineComponent({
    name: 'Settings',
    components: { catalogs, account, IonGrid, IonRow, IonCol, IonPage, IonLabel, IonButton, IonIcon, IonCard, IonCardContent, IonItem, IonInput},
    setup(){
      const device = window.innerWidth
      const store = useStore();
      return { store, personOutline, arrowBack, device }
    },
    data(){
        return{
          show:'',
          menuOptions: [
            { label: 'Mi Cuenta', icon: personOutline, component: 'account' },
            { label: 'Catálogos', icon: appsOutline, component: 'catalogs' },
          ],
        }
    },
    computed:{
        
    },
    created(){
      if(this.device >= 768){
        this.show = 'account'
      }
    },
    methods: {
        closeModal(){
          this.$emit("closeSettingsModal", false);
        }
    }
})

</script>
