<template>
    <!-- <v-card> -->
      <v-layout>
        <v-navigation-drawer
          permanent
          class="no-print"
          style="width: 12rem"
        >
          <v-list-item
            prepend-icon="mdi-account-circle"
            title="User"
            nav
          >
          </v-list-item>
  
          <v-divider></v-divider>
  
          <v-list density="compact" nav>
            <NuxtLink :to="'/' + userStore.getAccessLevel() + '/' + userStore.getStation()"><v-list-item prepend-icon="mdi-home-city" title="Dashboard" value="dashboard"></v-list-item></NuxtLink>
            <NuxtLink :to="'/auth/register/' + userStore.getStation()"><v-list-item prepend-icon="mdi-account-plus" title="Add New User" value="Register"></v-list-item></NuxtLink>
            <v-list-item prepend-icon="mdi-power" title="Logout" value="users" @click="onLogout"></v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main width="100%">
            <slot />
        </v-main>
      </v-layout>
      
    <!-- </v-card> -->
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useNuxtApp } from '#app';
import { onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from '~/store';
import { collection, getDocs } from "firebase/firestore"; 
// import { ref } from 'firebase/database';
// import { getAuth } from 'firebase/auth';
const nuxtApp = useNuxtApp();
const userStore = useUserStore();
const router = useRouter();


const onLogout = () => {
    userStore.updateUser(false, null)
    nuxtApp.$firebaseAuth.signOut()
}

onAuthStateChanged(nuxtApp.$firebaseAuth, user => {
    if(user) return
    router.push('/auth/signin')
})

onMounted(() => {
})
</script>

<style scoped>

a {
    text-decoration: none;
    color: inherit;
}
</style>