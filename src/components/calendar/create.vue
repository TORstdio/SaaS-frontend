<template>
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
        <ion-list style="margin-top:50px; padding:20px; background:transparent; height: 100%;">
            <ion-title style="margin-bottom:15px;">
                Agendar Actividad
            </ion-title>

            <ion-item>
                <ion-label position="fixed" style="font-size:14px; filter:opacity(.7);">
                    <ion-icon style="margin-right:10px;" :icon="calendarClearOutline"></ion-icon>
                    Fecha
                </ion-label>
                <ion-input id="date-click-trigger" v-bind:v-model="activity.only_date"></ion-input>
                <ion-popover trigger="date-click-trigger" trigger-action="click">
                    <ion-datetime @ionChange="saveDate($event.detail.value)" presentation="date"></ion-datetime>
                </ion-popover>
            </ion-item>

            <ion-item>
                <ion-label position="fixed" style="font-size:14px; filter:opacity(.7);">
                    <ion-icon style="margin-right:10px;" :icon="timeOutline"></ion-icon>
                    Hora
                </ion-label>
                <ion-input id="hour-click-trigger" v-bind:v-model="activity.only_time"></ion-input>
                <ion-popover trigger="hour-click-trigger" trigger-action="click">
                    <ion-datetime @ionChange="saveHour($event.detail.value)" presentation="time"></ion-datetime>
                </ion-popover>
            </ion-item>

            <ion-item>
                <ion-label position="fixed" style="font-size:14px; filter:opacity(.7);">
                    <ion-icon style="margin-right:10px;" :icon="businessOutline"></ion-icon>
                    Cliente
                </ion-label>
                <ion-input @click="search_client_active = true, searchClients=''" type="text" v-model="searchClients" placeholder="Escribe para buscar"></ion-input>
            </ion-item>

            <div class="autocomplete" v-if="search_client_active">
                <ion-progress-bar v-if="isLoadingClients" style="height:2px;" type="indeterminate"></ion-progress-bar>
                <ion-list>
                    <ion-item v-for="(client, index) in entries.clients" :key="index" @click="activity.subject_id = client.id, search_client_active = false, searchClients=client.legal_name">
                        <ion-label>
                            {{ client.legal_name }}
                        </ion-label>
                        <ion-note>
                            perro
                        </ion-note>
                    </ion-item>
                </ion-list>
            </div>

            <ion-item>
                <ion-label position="fixed" style="font-size:14px; filter:opacity(.7);">
                    <ion-icon style="margin-right:10px;"></ion-icon>
                    Actividad
                </ion-label>
                <ion-select v-bind:v-model="activity.activity_id">
                    <ion-select-option v-for="(type, index) in activityTypes" :key="index">
                            {{type.type}}
                    </ion-select-option>
                </ion-select>
            </ion-item>

            <ion-item>
                <ion-label position="floating" style="font-size:14px; filter:opacity(.7);">
                    <ion-icon style="margin-right:10px;"></ion-icon>
                    Descripción
                </ion-label>
                <ion-textarea type="text" v-bind:v-model="activity.description"></ion-textarea>
            </ion-item>

        </ion-list>

    </ion-content>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent } from 'vue';
import { IonInput, IonContent, IonList, IonIcon, IonSelect, IonSelectOption, IonSearchbar, IonItem, IonLabel, IonNote } from "@ionic/vue";
import { chevronForwardOutline, chevronBackOutline, calendarOutline, addOutline, arrowBack, ellipsisHorizontalSharp, calendarClearOutline, timeOutline, businessOutline, personOutline } from 'ionicons/icons';

import axios from "axios";
    export default defineComponent({
    components: {
        IonSearchbar,
        IonItem,
        IonLabel,
        IonNote,
        IonContent, 
        IonList, 
        IonIcon, 
        IonSelect, 
        IonSelectOption, 
        IonInput
    },
    data() {
        return {
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
            },
            isLoadingClients: false,
            entries:{
                clients:[]
            }
        };
    },
    setup(){
        const store = useStore();
        const device = window.innerWidth
        return { store, device, chevronForwardOutline, chevronBackOutline, calendarOutline, addOutline, arrowBack, ellipsisHorizontalSharp, calendarClearOutline, timeOutline, businessOutline, personOutline }
    },
    watch:{
        searchClients(val){
            console.log(val)
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
        save(){
                
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