<template>

    <div class="container login-container">
        <div class="anuncio" v-if="showAnuncio">
            Se envio un correo a la cuenta asociada para recuperar tu contraseña.
        </div>
        
        <div class="logo">
            <ion-img style="margin-bottom:30px; width:120px;" src="Logo.png" ></ion-img>
        </div>
        <ion-card style="border-radius:10px;" class="card-bg">
            <ion-card-content>
                <!-- Formulario de inicio de sesión -->
                <ion-item>
                    <ion-label position="floating" style="font-size:14px;" class="login-text">Email</ion-label>
                    <ion-input type="text" v-model="user.email"></ion-input>
                </ion-item>
                <ion-item v-if="!racoveryPassword">
                    <ion-label position="floating" style="font-size:14px;" class="login-text">Contraseña</ion-label>
                    <ion-input type="password" v-model="user.password"></ion-input>
                </ion-item>
                <ion-item v-if="!racoveryPassword" lines="none" class="forgot-password">
                    <ion-label class="ion-text-center" @click="racoveryPassword=true" style="font-size:12px; color:#3a82f7; cursor:pointer!important;">¿Olvidaste tu contraseña?</ion-label>
                </ion-item>
                <ion-button v-if="racoveryPassword" @click="racoverPassword()" expand="block" style="font-size:13px; text-transform: capitalize; --box-shadow: none; margin-top:20px;">Recuperar Contraseña</ion-button>
                <ion-button v-else @click="login()" expand="block" style="font-size:13px; text-transform: capitalize; --box-shadow: none;">Iniciar sesión</ion-button>
            </ion-card-content>
        </ion-card>
        <div class="social-login">
            <!-- Botones de inicio de sesión con Google y Apple -->
            <ion-button color="transparent" class="custom-social-button login-text" style="text-transform: capitalize; font-size:12px; padding:10px 20px; border-radius:5px;" :disabled="true">
                <ion-icon :icon="logoGoogle" style="margin-right:10px;"></ion-icon>
                Iniciar sesión con Google
            </ion-button>
            <ion-button color="transparent" class="custom-social-button login-text" style="text-transform: capitalize; font-size:12px; padding:10px 20px; border-radius:5px;" :disabled="true">
                <ion-icon :icon="logoApple" style="margin-right:10px;"></ion-icon>
                Iniciar sesión con Apple
            </ion-button>
        </div>
        <div class="register">
            <ion-label class="ion-text-center" style="font-size:13px;">¿Aún no tienes una cuenta? <a style="color:#3a82f7;" href="https://torstdio.website/landing/" target="_blank">Solicitala</a></ion-label>
        </div>
        <div class="terms">
            <p style="font-size:14px;">© 2023 TORstdio · <a href="https://torstdio.website/" target="_blank">www.TORstdio.website</a></p>
        </div>
    </div>

</template>

<script lang="ts">
import { IonContent, IonImg, IonLabel, IonButton, IonIcon, IonCard, IonCardContent, IonItem, IonInput } from '@ionic/vue';
import { logoGoogle, logoApple } from 'ionicons/icons';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
    components: { IonContent, IonImg, IonLabel, IonButton, IonIcon, IonCard, IonCardContent, IonItem, IonInput},
    setup(){
        const store = useStore();
        return { logoGoogle, logoApple, store }
    },
    data(){
        return{
            showAnuncio:false,
            racoveryPassword:false,
            user:{
                email: '' as string,
                password: '' as string
            }
        }
    },
    methods: {
        async login(): Promise<void> {
            await this.store.dispatch('user/login', this.user).then((response:boolean)=>{
                if(response){
                    location.reload();
                }
            })
        },
        racoverPassword(){

            this.racoveryPassword = false
            this.showAnuncio = true
            setTimeout(()=>{
                this.showAnuncio = false
            }, 3000);
            
        }
    },
})

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
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

.terms {
  position: fixed;
  bottom: 1rem;
  text-align: center;
  width: 100%;
}
.anuncio {
    background:#3a82f7;
    position: fixed;
    top: 1rem;
    text-align: center;
    padding:5px 15px;
    border-radius: 6px;
    font-size:13px;
    font-weight:500;
}

@media(max-width: 500px){
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