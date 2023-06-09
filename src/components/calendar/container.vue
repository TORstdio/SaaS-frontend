<template>
    <ion-page class="bg">
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
                    <div v-for="(date, index) in calendarDates(currentDate)" :key="index" class="cell" :class="{ 'prev-month': isPrevMonth(date), 'next-month': isNextMonth(date) }"  :style="(show_split_pane && device>=768 ? 'width:calc((100vw - 40px - 249px - 10px) / 7)!important;' : 'width:calc((100vw - 40px - 10px) / 7)!important;')">
                        <div class="event">
                            <div style="text-align:center; font-size:14px; font-weight:500; margin-bottom:5px;">
                                <div :style="sameDay(currentDate, date) ? 'background:#3a82f7; color:white!important;' : ''" style="cursor: pointer; border-radius:50%; width:24px; padding:3px; margin:-1px auto;" @click="selectDate(date)">{{new Date(date).getDate()}}</div>
                            </div>

                            <div v-if="!loader">
                                <div v-for="(event, index) in eventsOfDay(date).slice(0,3)" :key="index" style="cursor: pointer;" :style="event.completed ? 'filter:opacity(.8);' : ''">
                                    <div @click="openEvent(event)" v-if="device>=768" class="eventChip event-calendar">
                                        <span style="font-size:10px;">
                                            <div style="border-radius:50%; height:5px; width:5px; background:red; display: inline-block; margin-right: 2px; transform: translateY(-1px);"></div>
                                            {{ event.date.slice(11,16) }}
                                            <strong v-if="event.subject.type=='leads'" style="text-transform:lowercase!important; font-size:12px;">  
                                                {{ event.subject.attributes.name + ' ' + event.subject.attributes.last }}
                                            </strong>
                                            <strong v-else style="text-transform:lowercase!important; font-size:12px;">  
                                                {{ event.subject.legal_name }}
                                            </strong>
                                        </span>
                                    </div>
                                </div>

                                <div @click="selectDate(date)" v-if="device<768 && eventsOfDay(date).length>0" style="border-radius:50%; height:10px; font-size:10px; width:10px; margin:10px auto;" class="event-calendar"></div>

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
                            <div @click="openEvent(event)" class="eventChip event-calendar" :style="'font-size:12px; border-radius:3px; padding: 1px 5px;'" >
                                {{ event.date.slice(11,16) }}
                                <strong v-if="event.subject!=undefined">{{ event.subject.legal_name }}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>

        <!-- creation button -->
         <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button @click="createModal=true" size="small">
                <ion-icon :icon="addOutline"></ion-icon>
            </ion-fab-button>
        </ion-fab>
        
        <!-- creation modal -->
        <ion-modal :is-open="createModal" @didDismiss="createModal = false">
            <create @closeCreateModal="closeCreateModal"/>
        </ion-modal>

        <!-- detail modal -->
        <ion-modal :is-open="detailModal" @didDismiss="detailModal = false">
            <detail v-bind:selected_event="selected_event" @closeDetailModal="closeDetailModal"/>
        </ion-modal>

    </ion-page>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, ref, computed } from 'vue';
import { IonFab, IonFabButton, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonSelect, IonSelectOption, IonModal, IonPopover, IonDatetime, IonInput, IonTextarea, IonSearchbar, IonItem, IonLabel, IonNote } from '@ionic/vue';
import { chevronForwardOutline, chevronBackOutline, calendarOutline, addOutline, arrowBack, ellipsisHorizontalSharp, calendarClearOutline, timeOutline, businessOutline, personOutline } from 'ionicons/icons';
  import create from '../calendar/create.vue';
  import detail from '../calendar/detail.vue';
  export default defineComponent({
    name: 'Calendar',
    components: { IonFab, IonFabButton, detail, create, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonSelect, IonSelectOption, IonModal, IonPopover, IonDatetime, IonInput, IonTextarea, IonSearchbar, IonItem, IonLabel, IonNote },
    data() {
        return {
            detailModal:false,
            createModal: false,
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
        },
        show_split_pane(){
            return this.store.state.snackbar.show_split_pane
        }
    },
    methods: {
      closeCreateModal: function(param:boolean){
        this.createModal = param
      },
      closeDetailModal: function(param:boolean){
        this.selected_event = null
        this.detailModal = param
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
          return this.events.filter((event: Event)=> this.compareDates(event.only_date, new Date(date).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10)))
      },
      compareDates(date1:string, date2:string){
        if(date1 == date2){
            return true
        }else{
            return false
        }
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
        //this.store.dispatch('activity/getActivityTypes')
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

    .prev-month {
        opacity: 0.5;
    }

    .next-month {
        opacity: 0.5;
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

    .eventChip{
        margin-bottom:2px;
        border-radius:3px; 
        padding: 1px 5px; 
        font-size:12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

</style>