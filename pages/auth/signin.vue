<template>
  <v-container class="pa-12" fluid>
    <v-row justify="center" align="center" class="">
        <v-col >
            <v-card class="mx-auto px-6 py-8 elevation-3" max-width="960">
                <v-container>
                    <v-row>
                        <v-col>
                            <span class="text-h3 pa-5">Login Form</span>
                            <p class="text-error pa-5" >
                                {{ authErrorMessage }}
                            </p>
                            <v-form
                                v-model="form"
                                @submit.prevent="onSubmit"
                                class="pa-5"
                            >
                                <v-text-field
                                v-model="email"
                                :readonly="loading"
                                :rules="[required]"
                                class="mb-2"
                                label="Email"
                                clearable
                                ></v-text-field>

                                <v-text-field
                                v-model="password"
                                :readonly="loading"
                                :rules="[required]"
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                clearable
                                ></v-text-field>

                                <br>

                                <v-btn
                                :disabled="!form"
                                :loading="loading"
                                color="primary"
                                size="large"
                                type="submit"
                                variant="elevated"
                                block
                                >
                                Sign In
                                </v-btn>
                                <br>

                                <!-- <v-checkbox label="Remember Me" v-model="rememberMe"></v-checkbox> -->
                            </v-form>
                            
                        </v-col>
                        <v-col>
                            <img width="100%" height="100%" src="/public/flat-design-oxygen-tank-illustration.png"/>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-col>
    </v-row>
  </v-container>
</template>


<script setup>

definePageMeta({
    layout: '',
    middleware: [],
})

import { ref } from 'vue';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNuxtApp } from '#app';
import { useUserStore } from '~/store';
import { doc, collection, getDocs } from 'firebase/firestore';

const router = useRouter();
const nuxtApp = useNuxtApp();
const userStore = useUserStore();

const form =  ref(false);
const email = ref(null);
const password =  ref(null);
const loading = ref(false);
// const rememberMe = ref(false);
const authErrorMessage = ref(null)

const onSubmit = () => {

    loading.value = true

    signInWithEmailAndPassword(nuxtApp.$firebaseAuth, email.value, password.value)
    .then((userCredential) => {
    // Signed in 
        const user = userCredential.user;
        console.log(user)
        // userStore.updateUser(true, user)
        const docRef = collection(nuxtApp.$firestore, 'admins');
        getDocs(docRef).then((docSnap) => {
            docSnap.forEach((doc) => {
                console.log(doc.id, doc.data());
                console.log(Object.keys(doc.data().packagingStations));
                if(doc.data().HQ.includes(nuxtApp.$firebaseAuth.currentUser.email)){
                    userStore.updateUser(true, user, 'admin', '')
                    router.push('/admin');
                }
                if(Object.keys(doc.data().distributionCentres).includes(nuxtApp.$firebaseAuth.currentUser.email)){
                    userStore.updateUser(true, user, 'distribution', doc.data().distributionCentres[nuxtApp.$firebaseAuth.currentUser.email])
                    router.push(`/distribution/${doc.data().distributionCentres[nuxtApp.$firebaseAuth.currentUser.email]}`)
                }
                if((Object.keys(doc.data().packagingStations)).includes(nuxtApp.$firebaseAuth.currentUser.email)){
                    userStore.updateUser(true, user, 'packaging', doc.data().packagingStations[nuxtApp.$firebaseAuth.currentUser.email])
                    router.push(`/packaging/${doc.data().packagingStations[nuxtApp.$firebaseAuth.currentUser.email]}`)
                }
            })
        }).catch((error) => {
            console.log("error", error)
            console.log("document doesnt exist");
        })
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        authErrorMessage.value = "Incorrect email or password";
        loading.value = false;

    });
}
const required = (v) => {
        return !!v || 'Field is required'
      }

      



</script>