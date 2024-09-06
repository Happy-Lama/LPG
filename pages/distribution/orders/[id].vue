<template>
    <v-container fluid>
        <v-row align="center" justify="center">
            <v-card style="width: 100%;" class="pa-5 ma-2" variant="flat">
                <v-card-title class="text-h4">
                    Pending Orders
                </v-card-title>
                <v-container fluid>
                    <v-row>
                        <v-data-table-virtual
                            :items="ordersData"
                            height="100%"
                            item-value="name"
                        ></v-data-table-virtual>
                    </v-row>
                </v-container>
            </v-card>
        </v-row>
    </v-container>
</template>

<script setup>
definePageMeta({
    middleware: ['auth']
})

import { useNuxtApp } from '#app';
import { doc, collection, onSnapshot} from 'firebase/firestore';

const nuxtApp = useNuxtApp();
const route = useRoute();

const ordersData = ref([]);

const unsub = onSnapshot(doc(nuxtApp.$firestore, 'distributionCentres', route.params.id), (doc) => {
    let orders = []
    if(doc.data().orders){
        doc.data().orders.forEach((order) => {
            if(order.orderStatus){
                if(order.orderStatus === 'Pending'){
                    let order_modified = {}
                    Object.keys(order).forEach((key) => {
                        if(key !== 'items'){
                            order_modified[key] = order[key]
                        }
                    })
                    orders.push(order_modified)
                }
            }
        })
    }
    
    
    ordersData.value = orders;
})

</script>