<template>
    <ion-content v-if="event_detail!=undefined">
        <ion-toolbar class="toolbar-space columnTwo" style="position:fixed;" color="transparent">
            <ion-buttons slot="start" style="padding-left:5px;">
                <ion-button @click="closeModal()">
                    <ion-icon :icon="arrowBack"></ion-icon>
                </ion-button>
                </ion-buttons>
                <ion-buttons slot="end" style="padding-right:15px;">
                    <ion-button :disabled="!event_detail.completed" expand="block" style="text-transform: capitalize; --box-shadow: none;" @click="finishActivity()">Terminar</ion-button>
                    <ion-button id="open-action-sheet">
                        <ion-icon :icon="ellipsisHorizontalSharp"></ion-icon>
                    </ion-button>
                </ion-buttons>
        </ion-toolbar>
        <ion-list style="margin-top:50px; padding:20px; background:transparent;">

            <ion-title v-if="event_detail.subject.type=='leads'">  
                {{ event_detail.subject.attributes.name + ' ' + event_detail.subject.attributes.last }}
            </ion-title>
            <ion-title v-else>  
                {{ event_detail.subject.legal_name }}
            </ion-title>

            <ion-title style="font-size:15px; filter:opacity(.6);margin: 10px 0px 5px 0px;">
                {{dateFormat(event_detail.only_date)}}
            </ion-title>
            <ion-title style="font-size:15px; filter:opacity(.6);">
                {{hourFormat(event_detail.only_time)}}
            </ion-title>

            <ion-title style="font-size:15px; margin:20px 0px;">
                Tipo de Actividad:
                <div :style="'font-size: 12px; border-radius: 4px; margin-left:10px; display: inline-block; padding: 4px 10px; font-weight: 600;'" class="event-calendar">
                    {{event_detail.type}}
                </div>
            </ion-title>

            <div class="columnTwo" style="padding:15px 20px; border-radius:4px;">
                <span style="font-size:12px; filter:opacity(.8);">Descripción</span>
                <br/>
                {{event_detail.description}}
            </div>
            <!--ion-title style="font-size:15px; margin:20px 0px;">
                Agente:
                <span style="filter:opacity(.8);">{{event_detail.user.name + ' ' + event_detail.user.last}}</span>
            </ion-title>
            <ion-title style="font-size:15px; margin:10px 0px;">
                Creación:
                <span style="filter:opacity(.8);">{{dateFormat(new Date(event_detail.created_at).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10))}}</span>
            </ion-title-->
        </ion-list>

        <ion-action-sheet trigger="open-action-sheet" header="Acciones" :buttons="actionSheetButtons"></ion-action-sheet>

        <ion-alert :is-open="showAlert" header="Deseas eliminar esta actividad?" :buttons="alertButtons"></ion-alert>

        <!-- edit modal -->
        <ion-modal :is-open="editModal" @didDismiss="editModal = false">
            <edit v-if="edited_item!=undefined" v-bind:activity="edited_item" @closeEditModal="closeEditModal"/>
        </ion-modal>

    </ion-content>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent } from 'vue';
import { IonActionSheet, IonContent, IonToolbar, IonButtons, IonButton, IonIcon, IonList, IonTitle } from "@ionic/vue";
import { arrowBack, ellipsisHorizontalSharp } from 'ionicons/icons';
import edit from "../calendar/edit.vue"
import axios from "axios";

    export default defineComponent({
    components: {
        edit, IonActionSheet, IonContent, IonToolbar, IonButtons, IonButton, IonIcon, IonList, IonTitle
    },
    props:{
        selected_event: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            event_detail:undefined as any,
            edited_item:undefined as any,
            editModal:false,
            showAlert:false,
            actionSheetButtons:[
                {
                    text: 'Editar',
                    data: {
                        action: 'edit',
                    },
                    handler: this.edit,
                },
                {
                    text: 'Eliminar',
                    role: 'destructive',
                    data: {
                        action: 'delete',
                    },
                    handler: this.showAlertNow,
                },
            ],
            alertButtons:[
                {
                    text: 'Cancelar',
                    role: 'cancel',
                },
                {
                    text: 'Eliminar',
                    role: 'confirm',
                    handler: this.delete,
                },
            ]
        };
    },
    created(){
        this.event_detail = this.selected_event
    },
    setup(){
        const store = useStore();
        const device = window.innerWidth
        return { store, device, arrowBack, ellipsisHorizontalSharp }
    },
    methods: {
        showAlertNow(){
            this.showAlert = true
        },
        delete(){
            this.store.dispatch('activity/deleteActivity', this.event_detail.id).then(()=>{
                this.closeModal()
            })
        },
        edit(){
            this.edited_item = [this.event_detail].map((id:any)=>{
                return{
                    ...id,
                    subject_id:id.subject.id,
                    subject_type:'Client'
                }
            })[0]
            this.editModal = true
        },
        finishActivity(){

        },
        closeEditModal: function(param:boolean){
            this.editModal = false
            this.event_detail = param
        },
        closeModal(){
            this.$emit("closeDetailModal", false);
        },
        dateFormat(date:string){
            // Creamos el objeto fecha instanciándolo con la clase Date
            const fecha = new Date(date.slice(0,10) + ' 00:00:00');
            // Creamos array con los días de la semana
            const dias_semana = ['Domingo', 'Lunes', 'martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            //Creamos constante para el dia de hoy
            const hoy = new Date(new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10))
            //sacamos diferencia
            const difference = (Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()) - Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()))/(1000*60*60*24)
            // Creamos array con los meses del año
            const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
            // Construimos el formato de salida
            if(fecha.getUTCFullYear()!=new Date().getUTCFullYear()){
                return dias_semana[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()];
            }else{
                return dias_semana[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getUTCFullYear();
            }
        },
        hourFormat(hour:string){
            if(parseInt(hour.slice(0,2))>12){
                return (parseInt(hour.slice(0,2))-12) + hour.slice(2,5) + ' P.M.'
            }else{
                return hour + ' A.M.'
            }
        },
    },
});
</script>
<style scoped>
@media (min-width: 768px) {
    .action-sheet-button-inner.sc-ion-action-sheet-md {
        justify-content: center;
    }
    .action-sheet-title.sc-ion-action-sheet-md{
        text-align: center;
    }
}
</style>