<template>
  <ion-grid style="padding:0px;">
    <ion-row>
      <ion-col :size="device>=768 ? 3 : 12" v-if="device>=768 || (device<768 && showColumn=='one')" class="columnOne" style="min-height:calc(100vh - 56px)!important;">
        
        <!-- Contenido de la primera columna -->
      </ion-col>
      <ion-col :size="device>=768 ? 9 : 12" v-if="device>=768 || (device<768 && showColumn=='two')" class="columnTwo border-color" style="min-height:calc(100vh - 56px)!important; border-left:1px solid;">
        
        <!-- Contenido de la segunda columna -->
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonMenu, IonSplitPane, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonSearchbar } from '@ionic/vue';
import { defineComponent } from 'vue';
import { menu, addCircleOutline, personOutline, settingsOutline, power } from 'ionicons/icons';

export default defineComponent({
  components: { IonContent, IonHeader, IonMenu, IonSplitPane, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonSearchbar },
  setup() {
    const device = window.innerWidth
    return { menu, addCircleOutline, personOutline, settingsOutline, power, device };
  },
  data() {
    return {
      showColumn:'one'
    };
  },
  computed:{
    
  },
  methods: {
  
  }
});
</script>