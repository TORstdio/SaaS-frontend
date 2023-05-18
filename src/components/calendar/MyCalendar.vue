<template>
    <ion-page>
        <!-- header -->
        <div class="toolbar-container">
            <ion-buttons slot="start" v-if="calendarMode">
                <ion-button @click="showPrevMonth">
                    <ion-icon :icon="chevronBackOutline"></ion-icon>
                </ion-button>
                <ion-title v-if="showCalendar">{{monthYear}}</ion-title>
                <ion-button @click="showNextMonth">
                    <ion-icon :icon="chevronForwardOutline"></ion-icon>
                </ion-button>
            </ion-buttons>
            <ion-title v-else>{{dateFormat(new Date(selectedDate).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10))}}</ion-title>
            <ion-buttons slot="end" v-if="selectedDate!=undefined">
                <ion-button @click="calendarMode=!calendarMode">
                    <ion-icon style="color:#de3636; font-size:25px;" :icon="calendarOutline"></ion-icon>
                </ion-button>
            </ion-buttons>
        </div>

        <!-- body -->
        <ion-content>
            <!-- calendar -->
            <div class="calendar" v-if="calendarMode">
                <div class="days">
                    <div class="day" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
                </div>
                <div v-if="showCalendar" class="cells">
                    <div v-for="(date, index) in calendarDates(currentDate)" :key="index" class="cell" :class="{ 'prev-month': isPrevMonth(date), 'next-month': isNextMonth(date) }">
                        <div class="event">
                            <div style="text-align:center; font-size:14px; font-weight:500; margin-bottom:5px;">
                                <div :style="sameDay(currentDate, date) ? 'background:#3a82f7; color:white!important;' : ''" style="cursor: pointer; border-radius:50%; width:24px; padding:3px; margin:-1px auto;" @click="selectDate(date)">{{new Date(date).getDate()}}</div>
                            </div>

                            <div v-if="!loader">
                                <div v-for="(event, index) in eventsOfDay(date).slice(0,3)" :key="index" style="cursor: pointer;">
                                    <div @click="openEvent(event)" v-if="device>=768" class="eventChip" :style="'font-size:12px; background:' + event.activity_type.color + '; border-radius:3px; padding: 1px 5px; color:white!important;'">
                                        {{ event.date.slice(11,16) }}
                                        <strong style="text-transform:lowercase!important;">{{ event.company.attributes.name.slice(0,15) }}<span v-if="event.company.attributes.name.length>15">...</span></strong>
                                    </div>
                                </div>

                                <div v-if="device<768 && eventsOfDay(date).length>0" style="border-radius:50%; height:10px; font-size:10px; width:10px; margin:10px auto;" class="event-calendar"></div>

                                <div @click="selectDate(date)" v-if="eventsOfDay(date).length>3 && device>=768" style="font-size:11px; font-weight:400; cursor: pointer; filter:opacity(0.5);">
                                    {{eventsOfDay(date).length-3}} más
                                </div>

                                <div @click="selectDate(date)" v-if="eventsOfDay(date).length>0 && device<768" style="font-size:11px; text-align:center; font-weight:400; cursor: pointer; filter:opacity(0.5);">
                                    {{eventsOfDay(date).length}} Act
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- day -->
            <div v-else style="padding:20px;">
                <div v-for="hour in hours" :key="hour" style="display: flex;">
                    <div style="width:35px; filter:opacity(.7); font-size:10px; border-right:solid 1px; margin-right:-5px; min-height:30px;" class="border-calendar">
                        <div style="transform:translateY(-5px);">{{hour + ':00'}}</div>
                    </div>
                    <div style="width:calc(100% - 35px); padding:5px 0px 5px 15px; border-top:1px solid;" class="border-calendar">
                        <div v-for="(event, index) in eventsOfHour(hour)" :key="index">
                            <div @click="openEvent(event)" class="eventChip" :style="'font-size:12px; background:' + event.activity_type.color + '; border-radius:3px; padding: 1px 5px; color:white!important;'">
                                {{ event.date.slice(11,16) }}
                                <strong >{{ event.company.attributes.name }}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>

        <!-- creation button -->
        <ion-buttons slot="end">
            <ion-button @click="isModalOpen=true" style="background:#de3636; border-radius:50%; height:40px; position:fixed; bottom:20px; right:20px;">
                <ion-icon style="color:white; font-size:25px;" :icon="addOutline"></ion-icon>
            </ion-button>
        </ion-buttons>
        
        <!-- creation modal -->
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

                    <ion-title style="margin-bottom:15px;">
                        Agendar Actividad
                    </ion-title>

                    <ion-item>
                        <ion-label position="fixed" style="font-size:14px; filter:opacity(.7);">
                            <ion-icon style="margin-right:10px;" :icon="calendarClearOutline"></ion-icon>
                            Fecha
                        </ion-label>
                        <ion-input id="date-click-trigger" v-bind:v-model="activity.date"></ion-input>
                        <ion-popover trigger="date-click-trigger" trigger-action="click">
                            <ion-datetime @ionChange="saveDate($event.detail.value)" presentation="date"></ion-datetime>
                        </ion-popover>
                    </ion-item>

                    <ion-item>
                        <ion-label position="fixed" style="font-size:14px; filter:opacity(.7);">
                            <ion-icon style="margin-right:10px;" :icon="timeOutline"></ion-icon>
                            Hora
                        </ion-label>
                        <ion-input id="hour-click-trigger" v-bind:v-model="activity.hour"></ion-input>
                        <ion-popover trigger="hour-click-trigger" trigger-action="click">
                            <ion-datetime @ionChange="saveHour($event.detail.value)" presentation="time"></ion-datetime>
                        </ion-popover>
                    </ion-item>

                    <ion-item>
                        <ion-label position="fixed" style="font-size:14px; filter:opacity(.7);">
                            <ion-icon style="margin-right:10px;" :icon="businessOutline"></ion-icon>
                            Cliente
                        </ion-label>
                        <ion-input type="text" v-bind:v-model="activity.client_id"></ion-input>
                    </ion-item>

                    <ion-item>
                        <ion-label position="fixed" style="font-size:14px; filter:opacity(.7);">
                            <ion-icon style="margin-right:10px;" :icon="personOutline"></ion-icon>
                            Contacto
                        </ion-label>
                        <ion-input type="text" v-bind:v-model="activity.contact_id"></ion-input>
                    </ion-item>

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
        </ion-modal>

        <!-- detail modal -->
        <ion-modal :is-open="detailModal" @didDismiss="detailModal = false">
            <ion-content>
                <ion-toolbar class="toolbar-space columnTwo" style="position:fixed;" color="transparent">
                    <ion-buttons slot="start" style="padding-left:5px;">
                        <ion-button @click="detailModal = false">
                            <ion-icon :icon="arrowBack"></ion-icon>
                        </ion-button>
                        </ion-buttons>
                        <ion-buttons slot="end" style="padding-right:15px;">
                            <ion-button :disabled="!selected_event.completed" expand="block" style="text-transform: capitalize; --box-shadow: none;" @click="finishActivity()">Terminar</ion-button>
                            <ion-button>
                                <ion-icon :icon="ellipsisHorizontalSharp"></ion-icon>
                            </ion-button>
                        </ion-buttons>
                </ion-toolbar>

                <ion-list style="margin-top:50px; padding:20px; background:transparent;">
                    <ion-title>
                        {{selected_event.company.attributes.name}} | {{selected_event.contact.name + ' ' + selected_event.contact.last}}
                    </ion-title>
                    <ion-title style="font-size:15px; filter:opacity(.6);margin: 10px 0px 5px 0px;">
                        {{dateFormat(selected_event.date.slice(0,10))}}
                    </ion-title>
                    <ion-title style="font-size:15px; filter:opacity(.6);">
                        {{hourFormat(selected_event.date.slice(11,16))}}
                    </ion-title>

                    <ion-title style="font-size:15px; margin:20px 0px;">
                        Tipo de Actividad:
                        <div :style="'background:' + selected_event.activity_type.color + '; font-size: 12px; border-radius: 4px; margin-left:10px; display: inline-block; padding: 4px 10px; font-weight: 600;'">
                            {{selected_event.activity_type.name}}
                        </div>
                    </ion-title>

                    <div class="columnTwo" style="padding:15px 20px; border-radius:4px;">
                        <span style="font-size:12px; filter:opacity(.8);">Descripción</span>
                        <br/>
                        {{selected_event.description}}
                    </div>

                    <ion-title style="font-size:15px; margin:20px 0px;">
                        Agente:
                        <span style="filter:opacity(.8);">{{selected_event.user.name + ' ' + selected_event.user.last}}</span>
                    </ion-title>
                    <ion-title style="font-size:15px; margin:10px 0px;">
                        Creación:
                        <span style="filter:opacity(.8);">{{dateFormat(new Date(selected_event.created_at).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10))}}</span>
                    </ion-title>

                </ion-list>

            </ion-content>
        </ion-modal>

    </ion-page>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, ref, computed } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonSelect, IonSelectOption, IonModal, IonPopover, IonDatetime, IonInput, IonTextarea } from '@ionic/vue';
import { chevronForwardOutline, chevronBackOutline, calendarOutline, addOutline, arrowBack, ellipsisHorizontalSharp, calendarClearOutline, timeOutline, businessOutline, personOutline } from 'ionicons/icons';
 export default defineComponent({
    name: 'Calendar',
    components: { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonSelect, IonSelectOption, IonModal, IonPopover, IonDatetime, IonInput, IonTextarea },
    data() {
        return {
            detailModal:false,
            activity:{
                date: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10) as string,
                client_id: '' as string,
                contact_id: '' as string,
                hour: '00:00' as string,
                note: '' as string,
                description: '' as string,
                activity_id: '' as string,
            },
            isModalOpen: false,
            showCalendar: true,
            currentDate: new Date() as any,
            selectedDate: null as any,
            selected_event: null as any,
            calendarMode: true as boolean,
            daysOfWeek: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            monthYear: new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
            options:{
                sort:{} as Object,
                items_per_page:15 as Number | undefined,
                page:1 as Number | undefined,
                filters:{} as Object | undefined
            },
            hours:['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24',]
        };
    },
    mounted(){
        if(this.showCalendar){
            var firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10)
            var lastDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0 ).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10)
            this.options= {
                filters:{
                    date: [firstDayOfMonth, lastDayOfMonth]
                },
                sort:{
                    sort:undefined
                },
                items_per_page:undefined,
                page:undefined
            }
        }
    },
    watch:{
        options:{
            handler(){
                this.store.dispatch('activity/getActivities', this.options)
            }, deep: true
        },
    },
    computed:{
        activityTypes(){
            return this.store.state.activity.types
        },
        events(){
            return this.store.state.activity.activities
        },
        loader(){
            return this.store.state.activity.loader
        }
    },
    methods: {
        finishActivity(){

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
        openEvent(event:object){
            this.detailModal = true
            this.selected_event = event
        },
        sameDay(currentDate:string, date:Date){
            if(new Date(currentDate).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10) == new Date(date).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10)){
                return true
            }else{
                return false
            }
        },
        eventsOfHour(hour:string){
            interface Event {
                date: string;
            }
            return this.eventsOfDay(this.selectedDate).filter((event: Event)=>event.date.slice(11,13) == hour)
        },
        eventsOfDay(date:Date){
            interface Event {
                only_date: string;
            }
            return this.events.filter((event: Event)=>event.only_date==new Date(date).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10),)
        },
        save(){
            
        },
        saveDate(value:any){
            this.activity.date = value.slice(0,10)
        },
        saveHour(value:any){
            console.log(value.slice(11,17))
            this.activity.hour = value.slice(11,16)
        },

        calendarDates(currentDate: string) {
            var currentDate2 = new Date(currentDate)
            var firstDayOfMonth = new Date(currentDate2.getFullYear(), currentDate2.getMonth(), 1);
            var lastDayOfMonth = new Date(currentDate2.getFullYear(), currentDate2.getMonth() + 1, 0 );
            var daysInMonth = lastDayOfMonth.getDate();
            var startingDay = firstDayOfMonth.getDay();
            var dates = [];
            for (var i = startingDay; i >= 1; i--) {
                dates.push(new Date(currentDate2.getFullYear(),currentDate2.getMonth() - 1,daysInMonth - i));
            }
            for (var i = 1; i <= daysInMonth; i++) {
                dates.push(new Date(currentDate2.getFullYear(), currentDate2.getMonth(), i));
            }
            var remainingCells = 42 - dates.length;
            for (var i = 1; i <= remainingCells; i++) {
                dates.push(new Date(currentDate2.getFullYear(),currentDate2.getMonth() + 1, i));
            }
            return dates;
        },

        showPrevMonth() {
            this.showCalendar = false
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.monthYear = new Date(this.currentDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
            this.$nextTick(() => {
                this.showCalendar = true
            })
        },
        showNextMonth() {
            this.showCalendar = false
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.monthYear = new Date(this.currentDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
            this.$nextTick(() => {
                this.showCalendar = true
            })
        },
        selectDate(date:Date) {
            this.selectedDate = date;
            this.calendarMode = false
        },
        isPrevMonth(date:Date) {
            const currentMonth = this.currentDate.getMonth();
            const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            return new Date(date).getMonth() === prevMonth;
        },
        isNextMonth(date:Date) {
            const currentMonth = this.currentDate.getMonth();
            const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            return new Date(date).getMonth() === nextMonth;
        },
    },
    setup(){
        const store = useStore();
        const device = window.innerWidth
        return { store, device, chevronForwardOutline, chevronBackOutline, calendarOutline, addOutline, arrowBack, ellipsisHorizontalSharp, calendarClearOutline, timeOutline, businessOutline, personOutline }
    },
    created(){
        this.store.dispatch('activity/getActivityTypes')
    }
});
</script>

<style scoped>
    .toolbar-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding:0px 30px;
        margin-top:15px;
    }
    .calendar {
        width: 100%;
        margin: 0 auto;
        padding:40px 20px;
    }
    @media (max-width: 768px) {
        .calendar {
            width: 100%;
            margin: 0 auto;
            padding:30px 0px;
        }
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .days {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #82828220;
    }

    .day {
        width: 100%;
        text-align: center;
    }

    .cells {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
    }

    .cell {
        height: 110px;
        border-bottom: 1px solid #82828220;
        padding: 5px;
    }

    .prev-month {
        opacity: 0.5;
    }

    .next-month {
        opacity: 0.5;
    }

    .eventChip{
        margin-bottom:2px;
    }

</style>