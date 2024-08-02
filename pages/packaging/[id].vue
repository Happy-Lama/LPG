<template>
    <v-container fluid>
        <v-row align="center" justify="center">
            <v-card style="width: 100%;" class="pa-5 ma-2" variant="flat">
                <v-card-title class="text-h4">
                    Inventory
                </v-card-title>
                <v-container fluid>
                    <v-row>
                        <v-col>
                            <v-card class="pa-2 ma-2 bg-success" variant="flat" style="height: 12rem;">
                                <v-card-title class="text-h5 success">
                                    Full
                                </v-card-title>
                                <v-card-text class="text-h3">
                                    {{ inventory_full }}
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col>
                            <v-card class="pa-2 ma-2 bg-primary" variant="flat" style="height: 12rem;">
                                <v-card-title class="text-h5 info">
                                    Empty
                                </v-card-title>
                                <v-card-text class="text-h3">
                                    {{ inventory_empty }}
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col>
                            <v-card class="pa-2 ma-2 bg-warning" variant="flat" style="height: 12rem;">
                                <v-card-title class="text-h5 error">
                                    Defective
                                </v-card-title>
                                <v-card-text class="text-h3">
                                    {{ inventory_defect }}
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-row>
        <v-row align="center" justify="center">
            <v-card style="width: 100%;" class="pa-5 ma-2" variant="flat">
                <v-card-title class="text-h4">
                    Shipment Tracking
                </v-card-title>
                <v-container fluid>
                    <v-row>
                        <v-col>
                            <v-card class="pa-2 ma-2 bg-primary" variant="flat" style="height: 12rem;">
                                <v-card-title class="text-h5 success">
                                    Incoming
                                </v-card-title>
                            </v-card>
                        </v-col>
                        <v-col>
                            <v-card class="pa-2 ma-2 bg-warn" variant="flat" style="height: 12rem;">
                                <v-card-title class="text-h5 info">
                                    Outgoing
                                </v-card-title>
                            </v-card>
                        </v-col>
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
import { doc, onSnapshot} from 'firebase/firestore';

const route = useRoute();
const nuxtApp = useNuxtApp();

const inventory_full = ref(0);
const inventory_defect = ref(0);
const inventory_empty = ref(0);
// console.log(route.params.id)

const unsub = onSnapshot(doc(nuxtApp.$firestore, 'packagingPlants', route.params.id), (doc) => {
    console.log('Current data', doc.data())
    inventory_full.value = 0;
    inventory_empty.value = 0;
    inventory_defect.value = 0;
    doc.data().stockIn.forEach((stock) => {
        if(stock.cylinder[0].status === 'Full'){
            inventory_full.value += 1;
        } else if (stock.cylinder[0].status === 'Empty'){
            inventory_empty.value += 1;
        } else {
            inventory_defect.value += 1;
        }
    })

    // doc.data().stockOut.forEach((stock))
})

</script>