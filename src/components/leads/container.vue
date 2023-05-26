<template>
    <ion-page class="bg">
        <!--vue-horizontal v-if="device >= 768" style="margin:20px; margin-bottom:0px;">
            <div v-for="(phase, index) in phases" v-bind:key="index">
                <ion-item lines="none" style="width:250px; border-bottom:2px solid; margin:5px;" class="border-color item-card-bg" >
                    <ion-label>{{phase.title}}</ion-label>
                    <ion-badge slot="end">{{phase.length}}</ion-badge>
                </ion-item>

                <draggable :options="delay_draggable" :list="items" group="people" @end="handleDragEnd" id="scroll" :class="'phase_id: ' + phase.id" :scroll-sensitivity="scroll_sensitivity">
                    <template #item="{element}">
                        <ion-item style="margin:10px;" class="item-card-bg">
                            <ion-avatar slot="start">
                                <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                            </ion-avatar>
                            <ion-label>{{element.name}}</ion-label>
                        </ion-item>
                    </template>
                </draggable>

            </div>
            <ion-button v-if="permissions('addFunnelPhase')" @click="createPhaseModal=true" style="background:#de3636; border-radius:50%; height:40px;">
                <ion-icon style="color:white; font-size:25px;" :icon="addOutline"></ion-icon>
            </ion-button>
        </vue-horizontal-->
        <div>

        </div>
    </ion-page>
</template>

<script lang="ts">
import { IonBadge, IonContent, IonLabel, IonItem, IonAvatar } from '@ionic/vue';
import { addOutline } from 'ionicons/icons';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import draggable from 'vuedraggable';
//import VueHorizontal from "vue-horizontal";

export default defineComponent({
    components: { 
        draggable,
        //VueHorizontal,
        IonBadge, IonContent, IonLabel, IonItem, IonAvatar
    },
    setup(){
        const store = useStore();
        const device = window.innerWidth
        var delay_draggable = {}
        var scroll_sensitivity = 200
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            delay_draggable = {delay:500}
            scroll_sensitivity = 500
        }
        return { store, device, addOutline, delay_draggable, scroll_sensitivity }
    },
    data(){
        return{
            createPhaseModal:false,
            items:[
                {id:1, name:'Joel', phase:'Fase 1'}, 
                {id:2, name:'Alan', phase:'Fase 1'},
                {id:3, name:'Joel', phase:'Fase 1'}, 
                {id:4, name:'Alan', phase:'Fase 1'},
                {id:5, name:'Joel', phase:'Fase 1'}, 
                {id:6, name:'Alan', phase:'Fase 1'},
                {id:7, name:'Joel', phase:'Fase 1'}, 
                {id:8, name:'Alan', phase:'Fase 1'},
                {id:9, name:'Joel', phase:'Fase 1'}, 
                {id:10, name:'Alan', phase:'Fase 1'},
                {id:11, name:'Joel', phase:'Fase 1'}, 
                {id:12, name:'Alan', phase:'Fase 1'},
                {id:13, name:'Joel', phase:'Fase 1'}, 
                {id:14, name:'Alan', phase:'Fase 1'},
                {id:15, name:'Joel', phase:'Fase 1'}, 
                {id:16, name:'Alan', phase:'Fase 1'},
                {id:17, name:'Joel', phase:'Fase 1'}, 
                {id:18, name:'Alan', phase:'Fase 1'}
            ],
            phases:[
                {id: 1, title:'Fase 1', length: 1},
                {id: 2, title:'Fase 2', length: 21},
                {id: 3, title:'Fase 3', length: 18},
                {id: 4, title:'Fase 4', length: 3},
                {id: 5, title:'Fase 5', length: 5},
                {id: 6, title:'Fase 6', length: 37},
            ]
        }
    },
    created(){
        
    },
    computed:{
        
    },
    methods: {
        handleDragEnd(evt:any) {
            let funnel_phase_id = evt.from.className
            let new_funnel_phase_id = evt.to.className
            let element_id = evt.item._underlying_vm_.id
            if(funnel_phase_id!=new_funnel_phase_id){
                this.store.dispatch('client/modifyClient', {id:element_id, phase_id:new_funnel_phase_id})
            }
        },
        permissions(permission:string){
            return true
        },
        itemsPerPhase(phase:object){
            interface Item {
                phase: string;
            }
            //return this.items.filter((item:Item)=>item.phase == phase.title)
        }
    },
})

</script>

<style scoped>
    #scroll{
        overflow-y:scroll!important;
        max-height:70vh!important;
        min-height:70vh!important;
        -overflow-scrolling:touch!important;
        -webkit-overflow-scrolling:touch!important;
    }
</style>