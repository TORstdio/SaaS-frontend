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
        <ion-list style="margin-top:50px; padding:20px; background:transparent;">
            <ion-title>
                Crear Cliente
            </ion-title>

            <ion-list style="padding:20px; background:transparent;">
          
                <ion-item color="none">
                    <ion-label position="floating" style="font-size:14px;" class="login-text">Nombre</ion-label>
                    <ion-input type="text" v-model="client.legal_name"></ion-input>
                </ion-item>

                <ion-item color="none">
                    <ion-label position="floating" style="font-size:14px;" class="login-text">Email</ion-label>
                    <ion-input type="text" v-model="client.email"></ion-input>
                </ion-item>
                <ion-item color="none">
                    <ion-label position="floating" style="font-size:14px;" class="login-text">Teléfono</ion-label>
                    <ion-input type="text" v-model="client.phone"></ion-input>
                </ion-item>

            </ion-list>

            <div @click="showFiscal=!showFiscal" style="text-align:center; font-size:12px; font-weight:500; cursor: pointer;">
            <div style="margin-bottom:5px;">Datos Fiscales</div>
            <ion-icon v-if="!showFiscal" :icon="chevronDownOutline"></ion-icon>
            <ion-icon v-else :icon="chevronUpOutline"></ion-icon>
            </div>

            <ion-list v-if="showFiscal" style="padding:20px; background:transparent;">
                <ion-item color="none">
                    <ion-label position="floating" style="font-size:14px;" class="login-text">Razon Social</ion-label>
                    <ion-input type="text" v-model="client.legal_name"></ion-input>
                </ion-item>
                <ion-item color="none">
                    <ion-label position="floating" style="font-size:14px;" class="login-text">RFC</ion-label>
                    <ion-input type="text" v-model="client.tax_id"></ion-input>
                </ion-item>
                <ion-item color="none">
                    <ion-label position="floating" style="font-size:14px;" class="login-text">Régimen Fiscal</ion-label>
                    <ion-select v-model="client.tax_system">
                    <ion-select-option v-for="(system, index) in tax_systems" :key="index" :value="system.id">{{system.name}}</ion-select-option>
                    </ion-select>
                </ion-item>
                <ion-item color="none">
                    <ion-label position="floating" style="font-size:14px;" class="login-text">C.P.</ion-label>
                    <ion-input type="text" v-model="client.zip"></ion-input>
                </ion-item>
                <ion-item color="none">
                    <ion-label position="floating" style="font-size:14px;" class="login-text">Calle</ion-label>
                    <ion-input type="text" v-model="client.street"></ion-input>
                </ion-item>
                <ion-item color="none">
                    <ion-label position="floating" style="font-size:14px;" class="login-text"># Exterior</ion-label>
                    <ion-input type="text" v-model="client.exterior"></ion-input>
                </ion-item>
                <ion-item color="none">
                    <ion-label position="floating" style="font-size:14px;" class="login-text"># Interior</ion-label>
                    <ion-input type="text" v-model="client.interior"></ion-input>
                </ion-item>
                <ion-item color="none">
                    <ion-label position="floating" style="font-size:14px;" class="login-text">Colonia</ion-label>
                    <ion-input type="text" v-model="client.neighborhood"></ion-input>
                </ion-item>
                <ion-item color="none">
                    <ion-label position="floating" style="font-size:14px;" class="login-text">Ciudad</ion-label>
                    <ion-input type="text" v-model="client.city"></ion-input>
                </ion-item>
                <ion-item color="none">
                    <ion-label position="floating" style="font-size:14px;" class="login-text">Municipio</ion-label>
                    <ion-input type="text" v-model="client.municipality"></ion-input>
                </ion-item>
                <ion-item color="none">
                    <ion-label position="floating" style="font-size:14px;" class="login-text">Estado</ion-label>
                    <ion-input type="text" v-model="client.state"></ion-input>
                </ion-item>
                <ion-item color="none">
                    <ion-label position="floating" style="font-size:14px;" class="login-text">País</ion-label>
                    <ion-input type="text" v-model="client.country"></ion-input>
                </ion-item>
            </ion-list>
        </ion-list>
        
    </ion-content>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent } from 'vue';
import { IonContent, IonToolbar, IonButtons, IonButton, IonIcon, IonList, IonTitle, IonLabel, IonInput, IonSelect, IonSelectOption } from "@ionic/vue";
import { arrowBack, businessOutline, chevronUpOutline, chevronDownOutline } from 'ionicons/icons';
import axios from "axios";
    export default defineComponent({
    components: {
        IonContent, IonToolbar, IonButtons, IonButton, IonIcon, IonList, IonTitle, IonLabel, IonInput, IonSelect, IonSelectOption
    },
    data() {
        return {
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
            showFiscal:false as Boolean,
            diable_save_button:false,
        };
    },
    setup(){
        const store = useStore();
        const device = window.innerWidth
        return { store, device, arrowBack, businessOutline, chevronUpOutline, chevronDownOutline }
    },
    computed:{
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
    },
    methods: {
        async save(): Promise<void> {
            this.diable_save_button = true
            await this.store.dispatch('client/createClient', this.client).then((response:boolean)=>{
                if(response){
                    console.log('1')
                    this.closeModal()
                }else{
                    this.diable_save_button = false
                }
            })
        },
        closeModal(){
            const client = this.client
            this.client = {
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
            this.diable_save_button = false
            this.$emit("closeCreateClientModal", client);
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