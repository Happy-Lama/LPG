<template>
This is the report page
<v-container fluid class="bg-primary">
    <v-card style="width: 100%; height: 100%;">
        <v-card-title class="text-h4">
            Report
        </v-card-title>
        <v-container class="my-5">
            <v-row class="my-3">
                <p class="text-h5"> Current Inventory Levels per Category </p>
                <div>
                    <BarChart :chart-data="dummy_data_inventory.packagingPlants.inventory"/>
                </div>
            </v-row>
            <v-row class="my-3">
                <p class="text-h5"> Inventory Sizes per Station </p>
                <div>
                    <StackedBarChart :chart-data="data"/>
                </div>
            </v-row>
            <v-row class="my-3">
                <p class="text-h5"> Shipment frequency to Distribution Stations </p>
            </v-row>
            <v-row class="my-3">
                <p class="text-h5"> Shipment Efficiency to Distribution Stations </p>
            </v-row>
        </v-container>
    </v-card>
</v-container>

</template>

<script setup>

import { ref } from 'vue';
import BarChart from './reportElements/BarChartComponent.vue';
import StackedBarChart from './reportElements/StackedBarChartComponent.vue';

const total_inventory_levels_per_category = ref({});
const total_inventory_levels_per_station = ref({});


const getInventoryLevelsPerCategory = () => {

}

const getInventoryLevelsPerStation = () => {
    
}

// const data = ref({
//   labels: [1,2,3],
//   datasets: [
//     {
//         label: 'Dataset 1',
//         data: [1,2,3,5,4],
//         backgroundColor: '#0000FF',
      
//     },
//     {
//         label: 'Dataset 2',
//         data: [1,2,3,5,4],
//         backgroundColor: '#00FF00',
//     }
//   ]
// });

// const dummy_data_inventory = ref({
//     distributionCentres: {
//         1: {
//             inventory: {
//                 'Full': 10,
//                 'Empty': 15,
//                 'Defective': 0
//             }
//         },
//         2: {
//             inventory: {
//                 'Full': 90,
//                 'Empty': 15,
//                 'Defective': 15
//             }
//         },
//         3: {
//             inventory: {
//                 'Full': 11,
//                 'Empty': 5,
//                 'Defective': 10
//             }
//         }
//     },
//     packagingPlants: {
//         inventory: {
//             'Full': 10,
//             'Empty': 15,
//             'Defective': 0
//         }
//     }
// })



</script>