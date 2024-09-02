<template>
<div style="position: relative;">
    <v-btn class="bg-primary text-h6 no-print" style="position: fixed; bottom:2.5rem; right: 10rem; z-index:10000;" @click="printReport()">
        Print Report
    </v-btn>
</div>


<v-container fluid>
    <v-row justify="center" style="width: 100%;">
        <v-card style="width: 100%;" class=" fullwidth-print" variant="flat">
            <v-card-title class="text-h4">
                Report
            </v-card-title>
            <v-container class="my-5">
                <v-row class="my-3" justify="center">
                    <v-col>
                        <v-row justify="center" class="my-5">
                            <p class="text-h5"> Current Inventory Levels per Category </p>
                        </v-row>
                        <v-row justify="center">
                            <div style="height: 25rem; width: 50rem;" class="center-print">
                                <BarChart :chart-data="total_inventory_levels_per_category"/>
                            </div>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row class="my-3">
                    <v-col>
                        <v-row justify="center" class="my-5">
                            <p class="text-h5"> Inventory Sizes per Station </p>
                        </v-row>
                        <v-row justify="center">
                            <div style="height: 25rem; width: 50rem; " class="center-print">
                                <StackedBarChart :chart-data="data"/>
                            </div>
                        </v-row>
                    </v-col>
                </v-row>
                <!-- <v-row class="my-3" justify="center">
                    <p class="text-h5"> Shipment frequency to Distribution Stations </p>
                </v-row>
                <v-row class="my-3">
                    <p class="text-h5"> Shipment Efficiency to Distribution Stations </p>
                </v-row> -->
            </v-container>
        </v-card>
    </v-row>
</v-container>

</template>

<script setup>

import { ref } from 'vue';
import BarChart from './reportElements/BarChartComponent.vue';
import StackedBarChart from './reportElements/StackedBarChartComponent.vue';
import { useNuxtApp } from '#app';
import { doc, collection, onSnapshot} from 'firebase/firestore';

const nuxtApp = useNuxtApp();

const total_inventory_levels_per_category = ref({});
const total_inventory_levels_per_station = ref({});

const getInventoryLevelsPerCategory = () => {
    let inventory_full = 0;
    let inventory_empty = 0;
    let inventory_defect = 0;

    const unsubdistribution = onSnapshot(doc(nuxtApp.$firestore, 'distributionCentres', 'c29ijMVUIyvNeY4wfsXQ'), (doc) => {
        console.log('Current data', doc.data())
        let inventory_full_dist = 0;
        let inventory_empty_dist = 0;
        let inventory_defect_dist = 0;
        doc.data().stockIn.forEach((stock) => {
            if(stock.cylinders[0].status === 'Full'){
                inventory_full_dist += 1;
            } else if (stock.cylinders[0].status === 'Empty'){
                inventory_empty_dist += 1;
            } else {
                inventory_defect_dist += 1;
            }
        })
        inventory_full += inventory_full_dist;
        inventory_empty += inventory_empty_dist;
        inventory_defect += inventory_defect_dist;

        
    })
    const unsubpackaging = onSnapshot(doc(nuxtApp.$firestore, 'packagingPlants', 'ZHGg3FsUOR0q2BGgvrlG'), (doc) => {
        console.log('Current data', doc.data())
        let inventory_full_pack = 0;
        let inventory_empty_pack = 0;
        let inventory_defect_pack = 0;
        doc.data().stockIn.forEach((stock) => {
            console.log(stock)
            if(stock.cylinders[0].status === 'Full'){
                inventory_full_pack += 1;
                console.log('full', inventory_full_pack)
            } else if (stock.cylinders[0].status === 'Empty'){
                inventory_empty_pack += 1;
            } else {
                inventory_defect_pack += 1;
            }
        })
        inventory_full += inventory_full_pack;
        inventory_empty += inventory_empty_pack;
        inventory_defect += inventory_defect_pack;
        console.log(inventory_full, inventory_empty, inventory_defect);

        total_inventory_levels_per_category.value = {
            'Full': inventory_full,
            'Empty': inventory_empty,
            'Defective': inventory_defect
        }
    })
}

const getInventoryLevelsPerStation = () => {
    let inventory_full = 0;
    let inventory_empty = 0;
    let inventory_defect = 0;
    let stations = [];

    const unsubdistribution = onSnapshot(doc(nuxtApp.$firestore, 'distributionCentres', 'c29ijMVUIyvNeY4wfsXQ'), (doc) => {
        console.log('Current data', doc.data())
        let inventory_full_dist = 0;
        let inventory_empty_dist = 0;
        let inventory_defect_dist = 0;
        doc.data().stockIn.forEach((stock) => {
            if(stock.cylinders[0].status === 'Full'){
                inventory_full_dist += 1;
            } else if (stock.cylinders[0].status === 'Empty'){
                inventory_empty_dist += 1;
            } else {
                inventory_defect_dist += 1;
            }
        })
        inventory_full += inventory_full_dist;
        inventory_empty += inventory_empty_dist;
        inventory_defect += inventory_defect_dist;

        
    })
    const unsubpackaging = onSnapshot(doc(nuxtApp.$firestore, 'packagingPlants', 'ZHGg3FsUOR0q2BGgvrlG'), (doc) => {
        console.log('Current data', doc.data())
        let inventory_full_pack = 0;
        let inventory_empty_pack = 0;
        let inventory_defect_pack = 0;
        doc.data().stockIn.forEach((stock) => {
            console.log(stock)
            if(stock.cylinders[0].status === 'Full'){
                inventory_full_pack += 1;
                console.log('full', inventory_full_pack)
            } else if (stock.cylinders[0].status === 'Empty'){
                inventory_empty_pack += 1;
            } else {
                inventory_defect_pack += 1;
            }
        })
        inventory_full += inventory_full_pack;
        inventory_empty += inventory_empty_pack;
        inventory_defect += inventory_defect_pack;
        console.log(inventory_full, inventory_empty, inventory_defect);

        total_inventory_levels_per_category.value = {
            'Full': inventory_full,
            'Empty': inventory_empty,
            'Defective': inventory_defect
        }
    })
}

const data = ref({
  labels: [1,2,3,5,6],
  datasets: [
    {
        label: 'Full',
        data: [1,2,3,5,4],
        backgroundColor: '#0000FF',
      
    },
    {
        label: 'Empty',
        data: [1,2,3,5,4],
        backgroundColor: '#00FF00',
    },
    {
        label: 'Defective',
        data: [1,2,3,5,4],
        backgroundColor: '#FF0000',
    },
  ]
});


const printReport = () => {
    window.print();
}

onMounted(() => {
    total_inventory_levels_per_category.value = getInventoryLevelsPerCategory()
    // total_inventory_levels_per_station.value = getInventoryLevelsPerStation()
})
</script>

<style>
@media print {
  .no-print {
    display: none;
  }

  body {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .v-main{
    width: 100vw;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .v-navigation-drawing{
    display: none;
  }
  .v-container--fluid {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .center-print{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .v-row{
    width: 100%;
  }
}
</style>