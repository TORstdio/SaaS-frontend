<template>
    <div class="container">
        <ion-avatar @click="selectImage">
          <img src="https://ionicframework.com/docs/img/demos/avatar.svg" />
        </ion-avatar>
        <ion-card style="border-radius:10px;" class="card-bg">
            <ion-card-content>
                <!-- Formulario de inicio de sesión -->
                <ion-item>
                  <ion-label position="floating" style="font-size:14px;" class="login-text">Nombre</ion-label>
                  <ion-input type="text" v-model.trim="current_user.name"></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="floating" style="font-size:14px;" class="login-text">Email</ion-label>
                  <ion-input type="text" v-model.trim="current_user.email"></ion-input>
                </ion-item>

                <ion-item v-if="modifyPassword">
                    <ion-label position="floating" style="font-size:14px;" class="login-text">Contraseña</ion-label>
                    <ion-input type="password" v-model.trim="password"></ion-input>
                </ion-item>


                <ion-item lines="none" class="forgot-password" @click="modifyPassword=!modifyPassword" style="cursor: pointer;">
                    <ion-label class="ion-text-center" style="font-size:12px; color:#3a82f7;">Cambiar Contraseña</ion-label>
                </ion-item>
            </ion-card-content>
        </ion-card>
        <div class="logout">
          <ion-button @click="login()" expand="block" style="font-size:13px; text-transform: capitalize; --box-shadow: none; margin-bottom:15px;">Guardar Cambios</ion-button>
          <ion-label class="ion-text-center" style="font-size:12px; color:#3a82f7; cursor: pointer;" @click="logout">Cerrar sesión</ion-label>
        </div>
    </div>

</template>

<script lang="ts">
import { IonContent, IonImg, IonLabel, IonButton, IonIcon, IonCard, IonCardContent, IonItem, IonInput } from '@ionic/vue';
import { logoGoogle, logoApple } from 'ionicons/icons';
import { defineComponent } from 'vue';

export default defineComponent({
    components: { IonContent, IonImg, IonLabel, IonButton, IonIcon, IonCard, IonCardContent, IonItem, IonInput},
    setup(){
      let selectedImage: File | null = null;
      return { logoGoogle, logoApple }
    },
    data(){return{
      password:'',
      modifyPassword:false,
      selectedImage:''
    }},
    computed:{
      current_user(): object {
        return this.$store.state.user.current_user
      },
    },
    methods: {
      logout(){
        this.$store.dispatch('user/logout')
      },
      async selectImage() {
        const imagePicker = await Filesystem.getUri({
          directory: Directory.Pictures,
          allowMultiple: false,
          filePickerHandlerStyle: FilePickerHandlerStyle.Picker,
          promptLabelHeader: 'Seleccionar imagen',
          promptLabelCancelButton: 'Cancelar',
          promptLabelCaptureButton: 'Capturar foto',
          promptLabelAlbumButton: 'Elegir de la galería',
        });

        if (imagePicker && imagePicker.uri) {
          const file = await Filesystem.readFile({
            path: imagePicker.uri,
          });
          this.selectedImage = file;
          //this.currentUser.profile_photo_url = URL.createObjectURL(file);
        }
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
  height: calc(100vh - 100px);
}

.logo {
  margin-bottom: 1rem;
}

ion-card {
  max-width: 600px;
  width: 90%;
  box-shadow: none;
}

.forgot-password {
  --ion-item-padding-end: 0;
}

.social-login,
.register {
  margin-top: 1rem;
}

.logout {
  position: fixed;
  bottom: 1rem;
  text-align: center;
  width: 30%;
}

@media(max-width: 500px){
  .logout {
  width:90%;
}
    ion-card {
        max-width: 100vw!important;
        width: 90vw!important;
        box-shadow: none;
    }
    .social-login ion-button{
        margin:auto;
        display: block;
        margin-bottom:10px;
    }
}
</style>