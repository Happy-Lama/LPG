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

const nuxtApp = useNuxtApp();
const route = useRoute();

const inventory_full = ref(0);
const inventory_defect = ref(0);
const inventory_empty = ref(0);
const shipment_out = ref([]);
const shipment_in = ref([]);

const unsub = onSnapshot(doc(nuxtApp.$firestore, 'distributionCentres', route.params.id), (doc) => {
    console.log('Current data', doc.data())
    inventory_full.value = 0;
    inventory_empty.value = 0;
    inventory_defect.value = 0;
    if(doc.data().stockIn){
        doc.data().stockIn.forEach((stock) => {
            if(stock.cylinders){
                if(stock.cylinders[0].status === 'Full'){
                    inventory_full.value += 1;
                } else if (stock.cylinders[0].status === 'Empty'){
                    inventory_empty.value += 1;
                } else {
                    inventory_defect.value += 1;
                }
            }
            
        })
    }
    
    let stockOut = [];
    if(doc.data().stockOut){
        doc.data().stockOut.forEach((stock) => {
            if(stock){
                let stockDetails = {
                    shipId: stock.shipId,
                    // from: doc.id,
                    // to: stock.to.location,
                    cylinders: stock.cylinders.length, 
                    createdOn: stock.date
                }
                if(!stockOut.includes(stockDetails)){
                    stockOut.push(stockDetails);
                }
            }        
        })
    }
    
    shipment_out.value = stockOut;
})


const unsubpackaging = onSnapshot(doc(nuxtApp.$firestore, 'packagingPlants', 'ZHGg3FsUOR0q2BGgvrlG'), (doc) => {
    // console.log('Current data', doc.data())
    let stockIn = [];
    doc.data().stockOut.forEach((stock) => {
        if(stock.to.id === route.params.id){
            let stockDetails = {
                shipId: stock.shipId, 
                cylinders: stock.cylinders.length, 
                createdOn: stock.date
            }
            if(!stockIn.includes(stockDetails)){
                stockIn.push(stockDetails);
            }
        }
        
    })
    shipment_in.value = stockIn;
})
</script>