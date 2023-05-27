<template>
  <ion-page class="bg">
    <div class="container">
        <ion-avatar ><!--@click="selectImage"-->
          <img src="https://ionicframework.com/docs/img/demos/avatar.svg" />
        </ion-avatar>
        <ion-card style="border-radius:10px; width:90%;" class="card-bg">
            <ion-card-content>
                <!-- Formulario de inicio de sesión -->
                <ion-item style="--background: transparent!important;">
                  <ion-label position="floating" style="font-size:14px;" class="login-text">Nombre</ion-label>
                  <ion-input type="text" v-model.trim="current_user.name"></ion-input>
                </ion-item>
                <ion-item style="--background: transparent!important;">
                  <ion-label position="floating" style="font-size:14px;" class="login-text">Email</ion-label>
                  <ion-input type="text" v-model.trim="current_user.email"></ion-input>
                </ion-item>

                <ion-item v-if="modifyPassword" style="--background: transparent!important;">
                    <ion-label position="floating" style="font-size:14px;" class="login-text">Contraseña</ion-label>
                    <ion-input type="password" v-model.trim="password"></ion-input>
                </ion-item>


                <ion-item lines="none" class="forgot-password" @click="modifyPassword=!modifyPassword" style="cursor: pointer;">
                    <ion-label class="ion-text-center" style="font-size:12px; color:#3a82f7;">Cambiar Contraseña</ion-label>
                </ion-item>
            </ion-card-content>
        </ion-card>
        <div class="actions">
          <ion-button @click="save()" expand="block" style="font-size:13px; text-transform: capitalize; --box-shadow: none; margin-bottom:15px;">Guardar Cambios</ion-button>

          <ion-button @click="logout()" expand="block" style="text-transform: capitalize; --box-shadow: none; margin-bottom:15px; --background: transparent;">
            <ion-icon style="font-size:12px; margin-right:10px;" :icon="power" slot="start"></ion-icon>
            <ion-label style="font-size:12px;">Cerrar Sesión</ion-label>
          </ion-button>

        </div>
    </div>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonLabel, IonButton, IonIcon, IonCard, IonCardContent, IonItem, IonInput } from '@ionic/vue';
import { power } from 'ionicons/icons';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

  export default defineComponent({
    name: 'Account',
    components: { IonPage, IonLabel, IonButton, IonIcon, IonCard, IonCardContent, IonItem, IonInput},
    setup(){
      const store = useStore();
      //let selectedImage: File | null = null;
      return { store, power }
    },
    data(){return{
      password:'',
      modifyPassword:false,
    }},
    computed:{
      current_user(){
        return this.store.state.user.current_user
      },
    },
    methods: {
      save(){

      },
      logout(){
        this.store.dispatch('user/logout')
      },
    }
})

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
}

</style>