<template>
    <ion-page>
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
            <ion-title v-else>Próximos Evetos</ion-title>
            <ion-buttons slot="end">
                <ion-button @click="calendarMode=!calendarMode">
                    <ion-icon style="color:#de3636; font-size:25px;" :icon="calendarOutline"></ion-icon>
                </ion-button>
            </ion-buttons>
        </div>
        <ion-content>
        <div class="calendar" v-if="calendarMode">
            <div class="days">
            <div class="day" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
            </div>
            <div v-if="showCalendar" class="cells">
            <div v-for="date in calendarDates(currentDate)" :key="date" class="cell" :class="{ 'prev-month': isPrevMonth(date), 'next-month': isNextMonth(date) }" @click="selectDate(date)">
                <div class="event">
                    <div style="text-align:center; font-size:12px; font-weight:500; margin-bottom:5px;">{{date.getDate()}}</div>
                    <div v-if="device>=768" class="eventChip" style="font-size:12px; background:#de3636; border-radius:3px; padding: 0px 5px; color:white!important;">
                        {{ getEventStartTime(date) }}
                        <strong>{{ getEventTitle(date) }}</strong>
                    </div>
                    <div v-if="hasEvent(date) && device<768" style="background:#de3636; border-radius:50%; height:5px; width:5px; margin:10px auto;"></div>
                </div>
            </div>
            </div>
        </div>
        <div v-else>
            perro
        </div>
        </ion-content>
        <ion-buttons slot="end">
            <ion-button @click="isModalOpen=true" style="background:#de3636; border-radius:50%; height:40px; position:fixed; bottom:20px; right:20px;">
                <ion-icon style="color:white; font-size:25px;" :icon="addOutline"></ion-icon>
            </ion-button>
        </ion-buttons>
        
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

                    <ion-item>
                        <ion-label position="fixed">Fecha</ion-label>
                        <ion-input id="click-trigger" v-model.trim="activity.date"></ion-input>
                        <ion-popover trigger="click-trigger" trigger-action="click">
                            <ion-datetime @ionChange="saveDate($event.detail.value)" presentation="date"></ion-datetime>
                        </ion-popover>
                    </ion-item>

                    <ion-item>
                        <ion-label position="floating" style="font-size:14px;" class="login-text">Cliente</ion-label>
                        <ion-input type="text" v-model.trim="activity.legal_name"></ion-input>
                    </ion-item>

                    <ion-item>
                        <ion-label position="floating" style="font-size:14px;" class="login-text">Contacto</ion-label>
                        <ion-input type="text" v-model.trim="activity.legal_name"></ion-input>
                    </ion-item>

                    <ion-item>
                        <ion-label position="floating" style="font-size:14px;" class="login-text">Hora</ion-label>
                        <ion-datetime presentation="time" v-model.trim="activity.hour"></ion-datetime>
                    </ion-item>

                </ion-list>

            </ion-content>
        </ion-modal>

    </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonSelect, IonSelectOption, IonModal, IonPopover, IonDatetime, IonInput } from '@ionic/vue';
import { chevronForwardOutline, chevronBackOutline, calendarOutline, addOutline, arrowBack } from 'ionicons/icons';
 export default defineComponent({
    name: 'Calendar',
    components: { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonSelect, IonSelectOption, IonModal, IonPopover, IonDatetime, IonInput },
    data() {
        return {
            activity:{
                date: new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10),
                client_id: '',
                contact_id: '',
                hour: '00:00',
                note: ''
            },
            isModalOpen: false,
            showCalendar: true,
            currentDate: new Date(),
            selectedDate: null,
            calendarMode: true,
            events: [
                {
                title: 'Evento 1',
                start: new Date(2023, 4, 17, 9, 0), // Fecha y hora de inicio
                end: new Date(2023, 4, 18, 18, 0), // Fecha y hora de finalización
                },
                {
                title: 'Evento 2',
                start: new Date(2023, 4, 20, 10, 0),
                end: new Date(2023, 4, 20, 12, 0),
                },
                {
                title: 'Evento 3',
                start: new Date(2023, 4, 25, 0, 0),
                end: new Date(2023, 4, 28, 23, 59),
                },
            ],
            daysOfWeek: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            monthYear: new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
        };
    },
    methods: {
        save(){
            
        },
        saveDate(value:string){
            console.log(value)
            this.activity.date = value.slice(0,10)
        },
        calendarDates(currentDate) {
            var firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            var lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0 );
            var daysInMonth = lastDayOfMonth.getDate();
            var startingDay = firstDayOfMonth.getDay();
            var dates = [];
            for (var i = startingDay; i >= 1; i--) {
                dates.push(new Date(currentDate.getFullYear(),currentDate.getMonth() - 1,daysInMonth - i));
            }
            for (var i = 1; i <= daysInMonth; i++) {
                dates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
            }
            var remainingCells = 42 - dates.length;
            for (var i = 1; i <= remainingCells; i++) {
                dates.push(new Date(currentDate.getFullYear(),currentDate.getMonth() + 1, i));
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
        selectDate(date:any) {
            this.selectedDate = date;
        },
        isPrevMonth(date) {
            const currentMonth = this.currentDate.getMonth();
            const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            return date.getMonth() === prevMonth;
        },
        isNextMonth(date) {
            const currentMonth = this.currentDate.getMonth();
            const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            return date.getMonth() === nextMonth;
        },
        hasEvent(date) {
            return this.events.some((event) =>
                this.isEventInRange(event, date, date)
            );
        },
        getEventStartTime(date) {
            const event = this.events.find((event) =>
                this.isEventInRange(event, date, date)
            );
            if (event) {
                const startTime = event.start.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                });
                return startTime
            }
            return '';
        },
        getEventTime(date) {
            const event = this.events.find((event) =>
                this.isEventInRange(event, date, date)
            );
            if (event) {
                const startTime = event.start.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                });
                const endTime = event.end.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                });
                return startTime + '-' + endTime;
            }
            return '';
        },
        getEventTitle(date) {
            const event = this.events.find((event) =>
                this.isEventInRange(event, date, date)
            );
            return event ? event.title : '';
        },
        isEventInRange(event, startDate, endDate) {
            return (
                event.start <= endDate &&
                event.end >= startDate &&
                (event.start <= startDate || event.end >= endDate)
            );
        },
    },
    setup(){
        const device = window.innerWidth
        return { device, chevronForwardOutline, chevronBackOutline, calendarOutline, addOutline, arrowBack }
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
        height: 100px;
        border-bottom: 1px solid #82828220;
        padding: 5px;
        cursor: pointer;
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