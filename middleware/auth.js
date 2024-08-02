import { useNuxtApp } from "#app";
import { useUserStore } from "~/store";
import { doc, collection, getDocs } from 'firebase/firestore';

export default defineNuxtRouteMiddleware((to, from) => {
    
    const nuxtApp = useNuxtApp();
    const userStore = useUserStore();

    if(!nuxtApp.$firebaseAuth.currentUser && !userStore.isUserAuthenticated()){
        return navigateTo('/auth/signin')
    } 

    
})