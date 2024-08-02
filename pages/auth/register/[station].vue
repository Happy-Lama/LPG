<template>
    <v-container class="pa-12" fluid>
      <v-row justify="center" align="center" class="">
          <v-col >
              <v-card class="mx-auto px-6 py-8" max-width="960" variant="flat">
                  <v-container>
                      <v-row>
                          <v-col>
                              <span class="text-h3 pa-5">Add New User</span>
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
                                  type="email"
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
                                  Add User
                                  </v-btn>
                                  <br>
  
                                  <!-- <v-checkbox label="Remember Me" v-model="rememberMe"></v-checkbox> -->
                              </v-form>
                              
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
    middleware: ['auth'],
})

import { ref } from 'vue';
import { useNuxtApp } from '#app';
import { useUserStore } from '~/store';
import { doc, arrayUnion, updateDoc } from "firebase/firestore";

const router = useRouter();
const nuxtApp = useNuxtApp();
const userStore = useUserStore();

const form =  ref(false);
const email = ref(null);
const loading = ref(false);
const updateAuthorizedUsers = (collection) => {
    const docRef = doc(nuxtApp.$firestore, collection, userStore.getStation());
    updateDoc(docRef, {
        authorizedUsers: arrayUnion(email.value)
    }).then(
        (response) => {
            console.log(response);
            alert("User added successfully");
            loading.value = false
        }
    ).catch((error) => {
        console.error(error)
        alert(error)
        loading.value = false
    });
}

const onSubmit = () => {
    loading.value = true
    const accessLevel = userStore.getAccessLevel();
    if(accessLevel === 'distribution'){
        updateAuthorizedUsers('distributionCentres')
    }
    if(accessLevel === 'packaging'){
        updateAuthorizedUsers('packagingPlants')
    }
    
}
const required = (v) => {
        return !!v || 'Field is required'
    }
</script>