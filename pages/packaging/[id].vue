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
                            <v-card class="pa-2 ma-2 bg-primary" variant="flat" style="height: 20rem;">
                                <v-card-title class="text-h5 success">
                                    Incoming
                                </v-card-title>
                                <v-data-table-virtual
                                    :items="shipment_in"
                                    height="300"
                                    item-value="name"
                                    class="bg-primary"
                                ></v-data-table-virtual>
                            </v-card>
                        </v-col>
                        <v-col>
                            <v-card class="pa-2 ma-2 bg-warn" variant="flat" style="height: 20rem;">
                                <v-card-title class="text-h5 info">
                                    Outgoing
                                </v-card-title>
                                <v-data-table-virtual
                                    :items="shipment_out"
                                    height="300"
                                    item-value="name"
                                ></v-data-table-virtual>
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
import { doc, collection, onSnapshot} from 'firebase/firestore';

const route = useRoute();
const nuxtApp = useNuxtApp();

const inventory_full = ref(0);
const inventory_defect = ref(0);
const inventory_empty = ref(0);
const shipment_out = ref([]);
const shipment_in = ref([]);
// console.log(route.params.id)

const unsub = onSnapshot(doc(nuxtApp.$firestore, 'packagingPlants', route.params.id), (doc) => {
    // console.log('Current data', doc.data())
    inventory_full.value = 0;
    inventory_empty.value = 0;
    inventory_defect.value = 0;
    doc.data().stockIn.forEach((stock) => {
        if(stock.cylinders[0].status === 'Full'){
            inventory_full.value += 1;
        } else if (stock.cylinders[0].status === 'Empty'){
            inventory_empty.value += 1;
        } else {
            inventory_defect.value += 1;
        }
    })

    let stockOut = [];
    doc.data().stockOut.forEach((stock) =>{
        stockOut.push(
            {
                shipId: stock.shipId,
                to: stock.to.location,
                from: "Packaging Station",
                cylinders: stock.cylinders.length, 
                createdOn: stock.date
            }
        )
    })

    shipment_out.value = stockOut;
})

const unsubdistribution =  onSnapshot(collection(nuxtApp.$firestore, 'distributionCentres'), (snapshot) => {
    console.log(snapshot)
    let stockIn = [];
    snapshot.docs.forEach((doc) => {
        console.log(doc.data())
        doc.data().stockOut.forEach((stock) => {
            let stockDetails = {
                shipId: stock.shipId, 
                cylinders: stock.cylinder.length, 
                createdOn: stock.date
            }
            if(!stockIn.includes(stockDetails)){
                stockIn.push({
                    shipId: stock.shipId, 
                    cylinders: stock.cylinder.length, 
                    createdOn: stock.date
                });
            }        
        })
        shipment_in.value = stockIn
    })
})
</script>