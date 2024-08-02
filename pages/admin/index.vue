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
                <v-container fluid>
                    <v-table >
                        <thead class="text-h6">
                        <tr>
                            <th class="text-left">
                            Shipment ID
                            </th>
                            <th class="text-left">
                            From
                            </th>
                            <th class="text-left">
                            To
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                            <!-- display list of retrieved shipments -->
                        </tbody>
                    </v-table>
                </v-container>
            </v-card>
        </v-row>
        <v-row align="center" justify="center">
            <v-card style="width: 100%;" class="pa-5 ma-2" variant="flat">
                <v-card-title class="text-h4">
                    Reports
                </v-card-title>
                <v-container fluid>
                    <v-btn class="bg-primary">Generate Report</v-btn>
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

const nuxtApp = useNuxtApp();

const inventory_full_dist = ref(0);
const inventory_defect_dist = ref(0);
const inventory_empty_dist = ref(0);

const inventory_full_pack = ref(0);
const inventory_defect_pack = ref(0);
const inventory_empty_pack = ref(0);

const unsubdistribution = onSnapshot(doc(nuxtApp.$firestore, 'distributionCentres', 'c29ijMVUIyvNeY4wfsXQ'), (doc) => {
    console.log('Current data', doc.data())
    inventory_full_dist.value = 0;
    inventory_empty_dist.value = 0;
    inventory_defect_dist.value = 0;
    doc.data().stockIn.forEach((stock) => {
        if(stock.cylinder[0].status === 'Full'){
            inventory_full_dist.value += 1;
        } else if (stock.cylinder[0].status === 'Empty'){
            inventory_empty_dist.value += 1;
        } else {
            inventory_defect_dist.value += 1;
        }
    })

    // doc.data().stockOut.forEach((stock))
})

const unsubpackaging = onSnapshot(doc(nuxtApp.$firestore, 'packagingPlants', 'ZHGg3FsUOR0q2BGgvrlG'), (doc) => {
    console.log('Current data', doc.data())
    inventory_full_pack.value = 0;
    inventory_empty_pack.value = 0;
    inventory_defect_pack.value = 0;
    doc.data().stockIn.forEach((stock) => {
        if(stock.cylinder[0].status === 'Full'){
            inventory_full_pack.value += 1;
        } else if (stock.cylinder[0].status === 'Empty'){
            inventory_empty_pack.value += 1;
        } else {
            inventory_defect_pack.value += 1;
        }
    })

    // doc.data().stockOut.forEach((stock))
})
</script>