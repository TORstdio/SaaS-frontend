<template>
    <my-calendar></my-calendar>
</template>

<script lang="ts">
import { IonPage } from '@ionic/vue';
import { defineComponent } from 'vue';
import MyCalendar from '../calendar/MyCalendar.vue';

export default defineComponent({
  name: 'Calendar',
  components: { IonPage, MyCalendar }
})
</script>

<style>

</style>