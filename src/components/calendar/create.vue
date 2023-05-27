<template>
    <ion-content>
        <ion-toolbar class="toolbar-space columnTwo" style="position:fixed;" color="transparent">
            <ion-buttons slot="start" style="padding-left:5px;">
                <ion-button @click="closeModal()">
                    <ion-icon :icon="arrowBack"></ion-icon>
                </ion-button>
            </ion-buttons>
            <ion-buttons slot="end" style="padding-right:15px;">
                <ion-button :disabled="diable_save_button" expand="block" style="text-transform: capitalize; --box-shadow: none;" @click="save()">Guardar</ion-button>
            </ion-buttons>
        </ion-toolbar>
        <ion-list style="margin-top:50px; padding:20px; background:transparent; height: 100%;">
            <ion-title style="margin-bottom:15px;">
                Agendar Actividad
            </ion-title>

            <ion-item color="none">
                <ion-label position="fixed" style="font-size:14px; filter:opacity(.7);">
                    <ion-icon style="margin-right:10px;" :icon="calendarClearOutline"></ion-icon>
                    Fecha
                </ion-label>
                <ion-input id="date-click-trigger" v-model="activity.only_date"></ion-input>
                <ion-popover trigger="date-click-trigger" trigger-action="click">
                    <ion-datetime @ionChange="saveDate($event.detail.value)" presentation="date"></ion-datetime>
                </ion-popover>
            </ion-item>

            <ion-item color="none">
                <ion-label position="fixed" style="font-size:14px; filter:opacity(.7);">
                    <ion-icon style="margin-right:10px;" :icon="timeOutline"></ion-icon>
                    Hora
                </ion-label>
                <ion-input id="hour-click-trigger" v-model="activity.only_time"></ion-input>
                <ion-popover trigger="hour-click-trigger" trigger-action="click">
                    <ion-datetime @ionChange="saveHour($event.detail.value)" presentation="time"></ion-datetime>
                </ion-popover>
            </ion-item>

            <ion-item color="none">
                <ion-label position="fixed" style="font-size:14px; filter:opacity(.7);">
                    <ion-icon style="margin-right:10px;" :icon="businessOutline"></ion-icon>
                    Cliente
                </ion-label>
                <ion-input @click="search_client_active = true, searchClients=''" type="text" v-model="searchClients"></ion-input>
            </ion-item>

            <div class="autocomplete" v-if="search_client_active">
                <ion-progress-bar v-if="isLoadingClients" style="height:2px;" type="indeterminate"></ion-progress-bar>
                <ion-list>
                    <ion-item color="none" v-for="(client, index) in entries.clients" :key="index" @click="activity.subject_id = client.id, search_client_active = false, searchClients=client.legal_name, activity.subject_type = 'Client'">
                        <ion-label>
                            {{ client.legal_name }}
                        </ion-label>
                        <ion-note v-if="index%3 == 0">
                            Lead
                        </ion-note>
                        <ion-note v-else>
                            Cliente
                            <!--span v-if="client.type!=undefined">{{client.type}}</span-->
                        </ion-note>
                    </ion-item>

                    <ion-item color="none" v-if="entries.clients.length==0 && search_client_active && searchClients!=''">
                        <ion-label>
                             
                            <ion-buttons slot="end" style="padding-right:15px;">
                                <span style="margin-right:30px;">No existen resultados relacionados </span>
                                <ion-button style="text-transform: capitalize;" @click="clientModal=true">Crear Cliente</ion-button>
                                <ion-button style="text-transform: capitalize;" @click="leadModal=true">Crear Lead</ion-button>
                            </ion-buttons>
                        </ion-label>
                    </ion-item>

                </ion-list>
            </div>
            <!--ion-item>
                <ion-label position="fixed" style="font-size:14px; filter:opacity(.7);">
                    <ion-icon style="margin-right:10px;"></ion-icon>
                    Actividad
                </ion-label>
                <ion-select v-model="activity.activity_type">
                    <ion-select-option v-for="(type, index) in activityTypes" :key="index">
                            {{type.title}}
                    </ion-select-option>
                </ion-select>
            </ion-item-->
            <ion-item color="none">
                <ion-label position="fixed" style="font-size:14px; filter:opacity(.7);">
                    <ion-icon style="margin-right:10px;"></ion-icon>
                    Nota
                </ion-label>
                <ion-textarea type="text" v-model="activity.description"></ion-textarea>
            </ion-item>
        </ion-list>

        <!-- client modal -->
        <ion-modal :is-open="clientModal" @didDismiss="clientModal = false">
            <createClient v-bind:legal_name="searchClients" @closeCreateClientModal="closeCreateClientModal"/>
        </ion-modal>

        <!-- lead modal -->
        <ion-modal :is-open="leadModal" @didDismiss="leadModal = false">
            <createLead v-bind:name="searchClients" @closeCreateLeadModal="closeCreateLeadModal"/>
        </ion-modal>
    </ion-content>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent } from 'vue';
import { IonProgressBar, IonDatetime, IonPopover, IonButtons, IonButton, IonTextarea, IonInput, IonContent, IonList, IonIcon, IonSelect, IonSelectOption, IonSearchbar, IonItem, IonLabel, IonNote } from "@ionic/vue";
import { arrowBack, calendarClearOutline, timeOutline, businessOutline } from 'ionicons/icons';
import createClient from "../clients/create.vue"
import createLead from "../leads/create.vue"
import axios from "axios";
    export default defineComponent({
    components: {
        createClient,
        createLead,
        IonSearchbar,
        IonItem,
        IonLabel,
        IonNote,
        IonContent, 
        IonList, 
        IonIcon, 
        IonSelect, 
        IonSelectOption, 
        IonInput,
        IonProgressBar, 
        IonDatetime, 
        IonPopover, 
        IonButtons, 
        IonButton,
        IonTextarea
    },
    data() {
        return {
            clientModal: false,
            leadModal: false,
            diable_save_button:false,
            search_client_active: false,
            searchClients: "",
            companies: [],
            activity:{
                only_date: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10) as string,
                only_time: '00:00' as string,
                description: '' as string,
                type: '' as string,
                subject_type: '' as string,
                subject_id: '' as string,
                date:'' as string
            },
            isLoadingClients: false,
            entries:{
                clients:[] as { legal_name: string, id: string }[]
            }
        };
    },
    setup(){
        const store = useStore();
        const device = window.innerWidth
        return { store, device, arrowBack, calendarClearOutline, timeOutline, businessOutline }
    },
    computed:{
        activityTypes(){
            return this.store.state.catalogs.activities
        }
    },
    watch:{
        searchClients(val){
            if(val!=null){
                //if (this.companyLists.length > 0) return
                if (this.isLoadingClients) return
                this.isLoadingClients = true
                const apiUrl = import.meta.env.VITE_BACKEND_ROUTE;
                axios.get(apiUrl + 'api/v1/clients?filter[razon_social]='+val)
                .then(res => {
                    this.entries.clients = res.data.data
                }).finally(() => (this.isLoadingClients = false))
            }
        },
    },
    methods: {
        closeCreateClientModal: function(prop:any){
            this.clientModal = false
            this.entries.clients.push(prop)
        },
        closeCreateLeadModal: function(prop:any){
            this.leadModal = false
            this.entries.clients.push(prop)
        },
        async save(): Promise<void> {
            this.diable_save_button = true
            this.activity.date = this.activity.only_date + ' ' + this.activity.only_time
            await this.store.dispatch('activity/createActivity', this.activity).then((response:boolean)=>{
                if(response){
                    this.closeModal()
                }else{
                    this.diable_save_button = false
                }
            })
        },
        closeModal(){
            this.activity = {
                only_date: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10) as string,
                only_time: '00:00' as string,
                description: '' as string,
                type: '' as string,
                subject_type: '' as string,
                subject_id: '' as string,
                date: '' as string
            }
            this.diable_save_button = false
            this.$emit("closeCreateModal", false);
        },
        saveDate(value:any){
            this.activity.only_date = value.slice(0,10)
        },
        saveHour(value:any){
            this.activity.only_time = value.slice(11,16)
        },
    },
});
</script>
<style scoped>
.autocomplete{
    max-height: 50vh;
    overflow-y: auto;
    position: absolute;
    z-index: 99;
    right: 20px;
    width: calc(100% - 40px);
}
.autocomplete ion-item:hover{
    filter:opacity(0.6);
    cursor:pointer;
}
</style>