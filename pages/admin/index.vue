<template>
    <v-container fluid>
        <v-row align="center" justify="center">
            <v-card style="width: 100%;" class="pa-5 ma-2" variant="flat">
                <v-card-title class="text-h4">
                    Current Inventory
                </v-card-title>
                <v-container fluid>
                    <v-row>
                        <v-col>
                            <v-card class="pa-2 ma-2 bg-success" variant="flat" style="height: 12rem;">
                                <v-card-title class="text-h5 success">
                                    Full
                                </v-card-title>
                                <v-card-text class="text-h3">
                                    {{ inventory_full_dist + inventory_full_pack }}
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col>
                            <v-card class="pa-2 ma-2 bg-primary" variant="flat" style="height: 12rem;">
                                <v-card-title class="text-h5 info">
                                    Empty
                                </v-card-title>
                                <v-card-text class="text-h3">
                                    {{ inventory_empty_dist + inventory_empty_pack }}
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col>
                            <v-card class="pa-2 ma-2 bg-warning" variant="flat" style="height: 12rem;">
                                <v-card-title class="text-h5 error">
                                    Defective
                                </v-card-title>
                                <v-card-text class="text-h3">
                                    {{ inventory_defect_dist + inventory_defect_pack }}
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
                <v-data-table-virtual
                    :items="shipments_packaging.concat(shipments_distribution)"
                    height="150"
                    item-value="name"
                ></v-data-table-virtual>
            </v-card>
        </v-row>
        <v-row align="center" justify="center">
            <v-card style="width: 100%;" class="pa-5 ma-2" variant="flat">
                <v-card-title class="text-h4">
                    Reports
                </v-card-title>
                <v-container fluid>
                    <nuxt-link to='/admin/report'>
                        <v-btn class="bg-primary">Generate Report</v-btn>
                    </nuxt-link>
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

const inventory_full_dist = ref(0);
const inventory_defect_dist = ref(0);
const inventory_empty_dist = ref(0);

const inventory_full_pack = ref(0);
const inventory_defect_pack = ref(0);
const inventory_empty_pack = ref(0);

const shipments_distribution = ref([]);
const shipments_packaging = ref([]);

const unsubdistinv =  onSnapshot(collection(nuxtApp.$firestore, 'distributionCentres'), (snapshot) => {
    inventory_full_dist.value = 0;
    inventory_empty_dist.value = 0;
    inventory_defect_dist.value = 0;
    let shipments_dist = []

    snapshot.docs.forEach((doc) => {
        
        if(doc.data().stockIn){
            doc.data().stockIn.forEach((stock) => {
                if(stock.cylinders){
                    stock.cylinders.forEach((cylinder) => {
                        if(cylinder.status === 'Full'){
                            inventory_full_dist.value += 1
                        }
                        else if(cylinder.status === 'Empty'){
                            inventory_empty_dist.value += 1
                        }
                        else if(cylinder.status === 'Defective'){
                            inventory_defect_dist.value += 1
                        }
                        
                    })

                }
                
            })
        }

        if(doc.data().stockOut){
            doc.data().stockOut.forEach((stock) => {
                if(stock && stock.to){
                    let stockDetails = {
                        shipId: stock.shipId,
                        from: doc.id,
                        to: stock.to.location,
                        cylinders: stock.cylinders.length, 
                        createdOn: stock.date
                    }
                    if(!shipments_dist.includes(stockDetails)){
                        shipments_dist.push(stockDetails);
                    } 
                }
                       
            })
        }
        
    })
    shipments_distribution.value = shipments_dist
})

const unsubpackaging = onSnapshot(collection(nuxtApp.$firestore, 'packagingPlants'), (snapshot) => {
    inventory_full_pack.value = 0;
    inventory_empty_pack.value = 0;
    inventory_defect_pack.value = 0;
    let shipments_pack = [];

    snapshot.docs.forEach((doc) => {
        
        if(doc.data().stockIn){
            doc.data().stockIn.forEach((stock) => {
                if(stock.cylinders){
                    stock.cylinders.forEach((cylinder) => {
                        if(cylinder.status === 'Full'){
                            inventory_full_pack.value += 1
                        }
                        else if(cylinder.status === 'Empty'){
                            inventory_empty_pack.value += 1
                        }
                        else if(cylinder.status === 'Defective'){
                            inventory_defect_pack.value += 1
                        }
                        
                    })

                }
                
            })
        }
        
        if(doc.data().stockOut){
            doc.data().stockOut.forEach((stock) =>{
                if(stock && stock.to){
                    shipments_pack.push(
                        {
                            shipId: stock.shipId,
                            to: stock.to.location,
                            from: "Packaging Station",
                            cylinders: stock.cylinders.length, 
                            createdOn: stock.date
                        }
                    )
                }
                
            })
        }

        
    })
    
    shipments_packaging.value = shipments_pack;
})

</script>