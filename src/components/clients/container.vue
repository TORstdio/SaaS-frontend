<template>
  <ion-page class="bg">
    <ion-content class="table-responsive">
      <div class="table">
        <!-- Table Header -->
        <table>
          <thead>
            <th v-for="(head, index) in headers" :key="index" @click="sort(head, index)" style="filter:opacity(.9);">
              <span>{{head.text}}</span>
              <ion-icon v-if="head.sort==true" :icon="chevronDownOutline"></ion-icon>
              <ion-icon v-else-if="head.sort==false" :icon="chevronUpOutline"></ion-icon>
            </th>
          </thead>
        </table>
        <!-- Loader -->
        <ion-progress-bar v-if="loader" style="height:2px;" type="indeterminate"></ion-progress-bar>
        <!-- Table Body -->
        <div class="table-container">
          <table>
            <tbody>
              <tr v-for="item in items" :key="item.id" style="filter:opacity(.8);">
                <td v-for="(head, index) in headers" :key="index">{{ item[head.value] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Footer -->
        <div class="footer-table">
          <ion-item style="max-width:250px!important; font-size:14px; margin-top:-5px;">
            <ion-label>Elementos por página:</ion-label>
            <ion-select v-model="options.items_per_page">
              <ion-select-option :value="15">15</ion-select-option>
              <ion-select-option v-if="meta.total>=30" :value="30">30</ion-select-option>
              <ion-select-option v-if="meta.total>=50" :value="50">50</ion-select-option>
              <ion-select-option :value="meta.total">{{meta.total}}</ion-select-option>
            </ion-select>
          </ion-item>
         
          
          <ion-buttons slot="end" style="max-width:300px!important;right: 70px; position: absolute; margin-top:-38px;">
            {{meta.from}}-{{meta.to}} de {{meta.total}}
            <ion-button :disabled="options.page==1" @click="options.page=options.page-1">
              <ion-icon :icon="chevronBackOutline"></ion-icon>
            </ion-button>
            <ion-button :disabled="options.page==meta.last_page" @click="options.page=options.page+1">
              <ion-icon :icon="chevronForwardOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </div>
      </div>
    </ion-content>
    
    <ion-fab slot="fixed" vertical="bottom" horizontal="end">
      <ion-fab-button size="small" @click="createModal=true">
        <ion-icon :icon="addOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- client modal -->
    <ion-modal :is-open="createModal" @didDismiss="createModal = false">
        <createClient @closeCreateClientModal="closeCreateClientModal"/>
    </ion-modal>

  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent, IonRow, IonButton, IonButtons, IonSelect, IonSelectOption, IonIcon, IonItem, IonLabel,  } from '@ionic/vue';
import { defineComponent } from 'vue';
import { addOutline, chevronDownOutline, chevronUpOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import createClient from "../clients/create.vue"

export default defineComponent({
  name: 'Sales',
  components: { createClient, IonPage, IonContent, IonRow, IonButton, IonButtons, IonSelect, IonSelectOption, IonIcon, IonItem, IonLabel,  },
  setup() {
    const store = useStore();
    return { addOutline, store, chevronDownOutline, chevronUpOutline, chevronBackOutline, chevronForwardOutline };
  },
  data(){
    return{
      createModal:false,
      headers:[
        {text:'ID', value:'id', sort:undefined as undefined | boolean},
        {text:'Nombre', value:'legal_name', sort:undefined as undefined | boolean},
        {text:'Email', value:'email', sort:undefined as undefined | boolean}
      ],
      options:{
        sort:{} as Object,
        items_per_page:15 as number,
        page:1 as number,
        filters:{} as Object
      },
    }
  },
  created(){
    this.store.dispatch('client/getClients', this.options)
  },
  computed:{
    items(){
      return this.store.state.client.clients
    },
    meta(){
      return this.store.state.client.meta
    },
    loader(){
      return this.store.state.client.loader
    },
  },
  methods:{
    closeCreateClientModal: function(props:object){
      this.createModal = false
    },
    sort(head:any, index:number){
      for(var i=0; i<this.headers.length; i++){
        if(i!=index){
          this.headers[i].sort = undefined
        }
      }
      if(head.sort==undefined){
        this.headers[index].sort = true
      }else if(head.sort){
        this.headers[index].sort = false
      }else{
        this.headers[index].sort = undefined
      }
      this.options.sort = head
    }
  },
  watch:{
    options:{
      handler(){
        this.store.dispatch('client/getClients', this.options)
      }, deep: true
    },
  }
})
</script>

<style>
.table-responsive{

}
.table{
  width:calc(100% - 100px);
  margin: 40px 50px;
}
table{
  width:100%;
  text-align:left;
  border-collapse: collapse;
}
.footer-table{
  width:100%;
  padding: 10px 10px;
  font-size:14px;
  filter:opacity(.9);
}

th {
  border-bottom: 1px solid;
  padding: 8px;
  cursor:pointer;
  font-size:15px!important;
}
th:hover span{
  opacity: 0.8;
}
td {
  border-bottom: 1px solid;
  padding: 8px;
  font-size:14px!important;
  padding:14px;
}
.table-container {
  max-height: calc(100vh - 230px)!important;
  overflow-y: auto;
}
</style>