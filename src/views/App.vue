<template>
  <ion-split-pane when="md" content-id="main">
    <ion-menu content-id="main" :style="menuStyle" class="border-color">
      <ion-header class="menu-bg">
        <ion-toolbar color="black">
          <div class="logo">
              <ion-img style="margin:10px 20px; width:90px;" src="Logo.png" ></ion-img>
              <span style="font-size:12px; position:absolute; margin-left:120px; margin-top:-21px;">v1.0.1</span>
          </div>
        </ion-toolbar>
      </ion-header>
      <ion-content class="menu-bg">
        <ion-list style="background: transparent; margin-top:10px;">
          <ion-item color="none" lines="none" v-for="(option, index) in menuOptions" :key="index" :router-link="`/${option.route}`" class="menu-element" :class="{ 'menu-item-selected': $route.path === `/${option.route}` }">
            <ion-icon style="margin-right:15px;" :icon="option.icon" slot="start"></ion-icon>
            <ion-label style="font-size:14px;">{{ option.label }}</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
      <ion-item class="menu-bg" style="padding:10px; font-size:13px; cursor: pointer;" @click="logout">
        <ion-icon style="font-size:16px; margin-right:15px;" :icon="power" slot="start"></ion-icon>
        <ion-label style="font-size:14px;">Cerrar Sesión</ion-label>
      </ion-item>
    </ion-menu>

    <div class="ion-page" id="main" :style="pageStyle">
      <ion-header class="header-bg border-color" style="border-bottom:1px solid;">
        <ion-toolbar class="header-bg">
          <div class="toolbar-content">
            <ion-buttons slot="start">
              <ion-menu-button class="hide-desktop"></ion-menu-button>
              <ion-button class="hide-mobile" @click="closeOpenMenu()">
                <ion-icon slot="icon-only" :icon="menu"></ion-icon>
              </ion-button>
            </ion-buttons>

            <ion-searchbar class="search-bar" style="padding:0px!important;" placeholder="Buscar..."></ion-searchbar>

            <ion-chip style="margin-right:10px;" router-link="/account">
              <ion-avatar>
                <img src="https://ionicframework.com/docs/img/demos/avatar.svg" />
              </ion-avatar>
              <ion-label>{{current_user.name}}</ion-label>
            </ion-chip>
          </div>

        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-router-outlet/>
      </ion-content>
    </div>
  </ion-split-pane>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonMenu, IonSplitPane, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonSearchbar, IonRouterOutlet, IonAvatar, IonChip } from '@ionic/vue';
import { defineComponent } from 'vue';
import { menu, power, calendarOutline, cashOutline, peopleOutline, gridOutline } from 'ionicons/icons';
import { useStore } from 'vuex';

export default defineComponent({
  components: { IonContent, IonHeader, IonMenu, IonSplitPane, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonSearchbar, IonRouterOutlet, IonAvatar, IonChip  },
  setup() {
    const store = useStore();
    const device = window.innerWidth
    return { menu, calendarOutline, power, device, cashOutline, peopleOutline, gridOutline, store};
  },
  mounted(){
    this.store.dispatch('user/getCurrentUser')
  },
  data() {
    return {
      menuOptions: [
        { label: 'Dashboard', icon: gridOutline, route: '' },
        { label: 'Clientes', icon: peopleOutline, route: 'clients' },
        { label: 'Calendario', icon: calendarOutline, route: 'calendar' },
        { label: 'Ventas', icon: cashOutline, route: 'sales' },
      ],
      show_split_pane: 'md' as string | boolean,
      divWidth: 'width:calc(100vw - 250px);',
      menuWidth: 'width:250px;',
      showColumn:'one'
    };
  },
  computed:{
    current_user(){
      return this.store.state.user.current_user
    },
    pageStyle() {
      if (this.device >= 768) {
        return this.divWidth ;
      } else {
        return {};
      }
    },
    menuStyle() {
      if (this.device >= 768) {
        return this.menuWidth;
      } else {
        return {};
      }
    },
  },
  methods: {
    logout(){
      this.store.dispatch('user/logout')
    },
    closeOpenMenu() {
      if (!this.show_split_pane) {
        this.menuWidth = 'width:250px;'
        this.divWidth = 'width:calc(100vw - 250px);';
        this.$nextTick(()=>{
          this.show_split_pane = true;
        })
      } else {
        this.menuWidth = 'width:0px;'
        this.divWidth = 'width:200vw;'
        this.$nextTick(()=>{
          this.show_split_pane = false;
        })
      }
    },
  },
});
</script>

<style scoped>
@media (min-width: 768px) {
  .hide-desktop {
    display: none;
  }
}
@media (max-width: 768px) {
  .hide-mobile {
    display: none;
  }
}
.ion-page, ion-menu {
  min-width: 0px;
  transition: width 0.3s ease !important;
}
.header-md::after{
  display: none!important;
}
.sc-ion-searchbar-md-h{ 
  --box-shadow:none!important;
}
ion-searchbar {
  transform:scale(.9);
}
.toolbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.search-bar {
  flex: 1;
  margin: 0 10px;
  --border-radius: 6px !important;
}
.menu-element{
  margin:10px 20px 0px 20px; 
}

</style>
<style>
.menu-element:hover{
  cursor: pointer;
  opacity: 0.9;
}
</style>
