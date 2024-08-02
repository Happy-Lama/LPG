import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {

    const authenticated = ref(false);
    const user = ref(null);
    const accessLevel = ref(null);
    const station = ref(null);
    const isUserAuthenticated = () => {
        return authenticated.value;
    }

    const updateUser = (state, userObject, accessLevelInfo, stationInfo) => {
        authenticated.value = state;
        user.value = userObject;
        station.value = stationInfo;
        accessLevel.value = accessLevelInfo;
    }
    
    const getUser = () => {
        return user.value;
    }

    const getStation =() => {
        return station.value;
    }

    const getAccessLevel = () => {
        return accessLevel.value;
    }
    return { isUserAuthenticated, updateUser, getUser, getStation, getAccessLevel }
})