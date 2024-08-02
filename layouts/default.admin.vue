<template>
    <!-- <v-card> -->
      <v-layout>
        <v-navigation-drawer
          v-model="drawer"
          :rail="rail"
          permanent
          @click="rail = false"
        >
          <v-list-item
            prepend-icon="mdi-account-circle"
            title="Admin"
            nav
          >
            <template v-slot:append>
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                @click.stop="rail = !rail"
              ></v-btn>
            </template>
          </v-list-item>
  
          <v-divider></v-divider>
  
          <v-list density="compact" nav>
            <NuxtLink to="/"><v-list-item prepend-icon="mdi-home-city" title="Home" value="home"></v-list-item></NuxtLink>
            <v-list-item prepend-icon="mdi-power" title="Logout" value="users" @click="onLogout"></v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main>
            <slot />
        </v-main>
      </v-layout>
      
    <!-- </v-card> -->
</template>
<script setup>
import { ref } from 'vue';
import { useNuxtApp } from '#app';
import { onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from '~/store';

// import { getAuth } from 'firebase/auth';
const nuxtApp = useNuxtApp();
const userStore = useUserStore();
const router = useRouter();

const drawer = ref(true);
const rail = ref(true);

const onLogout = () => {
    userStore.updateUser(false, null)
    nuxtApp.$firebaseAuth.signOut()
}

onAuthStateChanged(nuxtApp.$firebaseAuth, user => {
    if(user) return
    router.push('/auth/signin')
})

</script>