<template>

    <ion-content>
        <div class="container login-container">
            <div class="logo">
                <ion-img style="margin-bottom:30px; width:120px;" src="Logo.png" ></ion-img>
            </div>
            <ion-card style="border-radius:10px;" class="card-bg">
                <ion-card-content>
                    <!-- Formulario de inicio de sesión -->
                    <ion-item>
                        <ion-label position="floating" style="font-size:14px;" class="login-text">Usuario</ion-label>
                    <ion-input type="text"></ion-input>
                        </ion-item>
                    <ion-item >
                        <ion-label position="floating" style="font-size:14px;" class="login-text">Contraseña</ion-label>
                        <ion-input type="password"></ion-input>
                    </ion-item>
                    <ion-item lines="none" class="forgot-password">
                        <ion-label class="ion-text-center" style="font-size:12px; color:#3a82f7;">¿Olvidaste tu contraseña?</ion-label>
                    </ion-item>
                    <ion-button expand="block" style="font-size:13px; text-transform: capitalize; --box-shadow: none;">Iniciar sesión</ion-button>
                </ion-card-content>
            </ion-card>
            <div class="social-login">
                <!-- Botones de inicio de sesión con Google y Apple -->
                <ion-button color="transparent" class="custom-social-button login-text" style="text-transform: capitalize; font-size:12px; padding:10px 20px; border-radius:5px;">
                    <ion-icon :icon="logoGoogle" style="margin-right:10px;"></ion-icon>
                    Iniciar sesión con Google
                </ion-button>
                <ion-button color="transparent" class="custom-social-button login-text" style="text-transform: capitalize; font-size:12px; padding:10px 20px; border-radius:5px;">
                    <ion-icon :icon="logoApple" style="margin-right:10px;"></ion-icon>
                    Iniciar sesión con Apple
                </ion-button>
            </div>
            <div class="register">
                <ion-label class="ion-text-center" style="font-size:13px;">¿No tienes un acuenta? <a style="color:#3a82f7;">Registrate</a></ion-label>
            </div>
            <div class="terms">
                <p style="font-size:14px;">© 2023 TORstdio · <a>www.TORstdio.website</a></p>
            </div>
        </div>
    </ion-content>

</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonImg } from '@ionic/vue';
import { logoGoogle, logoApple } from 'ionicons/icons';
import { defineComponent } from 'vue';
export default defineComponent({
  components: { }
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