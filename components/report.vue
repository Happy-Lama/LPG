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
                <v-row class="my-3">
                    <v-col>
                        <v-row justify="center" class="my-5">
                            <p class="text-h5"> Orders per Distribution Centre </p>
                        </v-row>
                        <v-row justify="center">
                            <div style="height: 25rem; width: 50rem; " class="center-print">
                                <StackedBarChart :chart-data="ordersData"/>
                            </div>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row class="my-3">
                    <v-col>
                        <v-row justify="center" class="my-5">
                            <p class="text-h5"> Demand per Distribution Centre </p>
                        </v-row>
                        <v-row justify="center">
                            <div style="height: 25rem; width: 50rem; " class="center-print">
                                <StackedBarChart :chart-data="demandData"/>
                            </div>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row class="my-3">
                    <v-col>
                        <v-row justify="center" class="my-5">
                            <p class="text-h5"> Profit Performance </p>
                        </v-row>
                        <v-row justify="center">
                            <div style="height: 25rem; width: 50rem; " class="center-print">
                                <StackedBarChart :chart-data="profitData"/>
                            </div>
                        </v-row>
                    </v-col>
                </v-row>
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
const inventory_packaging_ref = ref({})
const inventory_distribution_ref = ref({})
const orders_ref = ref({})
const profit_ref = ref({})
const demand_ref = ref({})

const getInventoryLevelsPerCategory = () => {
    let inventory_full = 0;
    let inventory_empty = 0;
    let inventory_defect = 0;
    
    const unsubdist=  onSnapshot(collection(nuxtApp.$firestore, 'distributionCentres'), (snapshot) => {
        snapshot.docs.forEach((doc) => {
            let inventory_full_dist = 0;
            let inventory_empty_dist = 0;
            let inventory_defect_dist = 0;
            if(doc.data().stockIn){
                doc.data().stockIn.forEach((stock) => {
                    if(stock.cylinders){
                        stock.cylinders.forEach((cylinder) => {
                            if(cylinder.status === 'Full'){
                                inventory_full_dist += 1
                            }
                            else if(cylinder.status === 'Empty'){
                                inventory_empty_dist += 1
                            }
                            else if(cylinder.status === 'Defective'){
                                inventory_defect_dist += 1
                            }
                            
                        })

                    }
                    
                })
            }
            inventory_full += inventory_full_dist;
            inventory_empty += inventory_empty_dist;
            inventory_defect += inventory_defect_dist;
        })
    })

    const unsubpack=  onSnapshot(collection(nuxtApp.$firestore, 'packagingPlants'), (snapshot) => {
        snapshot.docs.forEach((doc) => {
            let inventory_full_dist = 0;
            let inventory_empty_dist = 0;
            let inventory_defect_dist = 0;
            if(doc.data().stockIn){
                doc.data().stockIn.forEach((stock) => {
                    if(stock.cylinders){
                        stock.cylinders.forEach((cylinder) => {
                            if(cylinder.status === 'Full'){
                                inventory_full_dist += 1
                            }
                            else if(cylinder.status === 'Empty'){
                                inventory_empty_dist += 1
                            }
                            else if(cylinder.status === 'Defective'){
                                inventory_defect_dist += 1
                            }
                            
                        })

                    }
                    
                })
            }
            inventory_full += inventory_full_dist;
            inventory_empty += inventory_empty_dist;
            inventory_defect += inventory_defect_dist;

            

            
        })
        console.log(inventory_full, inventory_empty, inventory_defect);
        total_inventory_levels_per_category.value = {
            'Full': inventory_full,
            'Empty': inventory_empty,
            'Defective': inventory_defect
        
        }
    })
}

const getInventoryLevelsPerStation = () => {

    const unsubdist=  onSnapshot(collection(nuxtApp.$firestore, 'distributionCentres'), (snapshot) => {
        let inventory_distribution = {}
        let orders = {}
        let profits = {}
        let demand = {}

        snapshot.docs.forEach((doc) => {
            let currentStock = {
                'Full': 0,
                'Empty': 0,
                'Defective': 0
            }
            if(doc.data().stockIn){
                doc.data().stockIn.forEach((stock) => {
                    if(stock.cylinders){
                        stock.cylinders.forEach((cylinder) => {
                            if(cylinder.status === 'Full'){
                                currentStock['Full'] += 1
                            }
                            else if(cylinder.status === 'Empty'){
                                currentStock['Empty'] += 1
                            }
                            else if(cylinder.status === 'Defective'){
                                currentStock['Defective'] += 1
                            }
                            
                        })

                    }
                    
                })
            }

            if(doc.data().orders){
                orders[doc.id] = doc.data().orders.length
            }

            if(doc.data().profit){
                profits[doc.id] = {
                    projected: doc.data().profit,
                    made: 0,
                }

            }

            if(doc.data().demand_estimate && doc.data().orders){
                demand[doc.id] = {
                    projected: doc.data().demand_estimate,
                    actual: doc.data().orders.length,
                }

            }

            inventory_distribution[`${doc.id}`] = currentStock
        })
        // console.log(inventory_distribution)
        console.log("Orders: ", orders)
        orders_ref.value = orders
        profit_ref.value = profits
        demand_ref.value = demand
        inventory_distribution_ref.value = inventory_distribution
    })

    const unsubpack=  onSnapshot(collection(nuxtApp.$firestore, 'packagingPlants'), (snapshot) => {
        let inventory_packaging = {}
        snapshot.docs.forEach((doc) => {
            let currentStock = {
                'Full': 0,
                'Empty': 0,
                'Defective': 0
            }
            if(doc.data().stockIn){
                doc.data().stockIn.forEach((stock) => {
                    if(stock.cylinders){
                        stock.cylinders.forEach((cylinder) => {
                            if(cylinder.status === 'Full'){
                                currentStock['Full'] += 1
                            }
                            else if(cylinder.status === 'Empty'){
                                currentStock['Empty'] += 1
                            }
                            else if(cylinder.status === 'Defective'){
                                currentStock['Defective'] += 1
                            }
                            
                        })

                    }
                    
                })
            }
            inventory_packaging[`${doc.id}`] = currentStock
        })
        console.log(inventory_packaging)
        inventory_packaging_ref.value = inventory_packaging
    })
}

const data = ref({
  labels: [],
  datasets: [
    {
        label: 'Full',
        data: [],
        backgroundColor: '#439AFF',
      
    },
    {
        label: 'Empty',
        data: [],
        backgroundColor: '#9AFF43',
    },
    {
        label: 'Defective',
        data: [],
        backgroundColor: '#FF439A',
    },
  ]
});

const ordersData = ref({
  labels: [],
  datasets: [
    {
        label: 'Number of Orders',
        data: [],
        backgroundColor: '#683AFF',
      
    },
  ]
});

const profitData = ref({
  labels: [],
  datasets: [
    {
        label: 'Projected',
        data: [],
        backgroundColor: '#FF3A68',
      
    },
    {
        label: 'Actual',
        data: [],
        backgroundColor: '#3AFF68',
      
    },
  ]
});

const demandData = ref({
  labels: [],
  datasets: [
    {
        label: 'Projected',
        data: [],
        backgroundColor: '#19FFAA',
      
    },
    {
        label: 'Actual',
        data: [],
        backgroundColor: '#AA19FF',
      
    },
  ]
});

const printReport = () => {
    window.print();
}

onMounted(() => {
    getInventoryLevelsPerCategory()
    getInventoryLevelsPerStation()

})

watch(inventory_packaging_ref, (newValue) => {
    let invStattionData = JSON.parse(JSON.stringify(data.value))

    Object.keys(newValue).forEach((packagingStation) => {
        invStattionData.labels.push(`${packagingStation}`)
        invStattionData.datasets[0].data.push(newValue[`${packagingStation}`]['Full'])
        invStattionData.datasets[1].data.push(newValue[`${packagingStation}`]['Empty'])
        invStattionData.datasets[2].data.push(newValue[`${packagingStation}`]['Defective'])
    })
    data.value = invStattionData
})

watch(inventory_distribution_ref, (newValue) => {
    let invStattionData = JSON.parse(JSON.stringify(data.value))

    Object.keys(newValue).forEach((distributionCentre) => {
        invStattionData.labels.push(`${distributionCentre}`)
        invStattionData.datasets[0].data.push(newValue[`${distributionCentre}`]['Full'])
        invStattionData.datasets[1].data.push(newValue[`${distributionCentre}`]['Empty'])
        invStattionData.datasets[2].data.push(newValue[`${distributionCentre}`]['Defective'])
    })

    data.value = invStattionData
})

watch(orders_ref, (newValue) => {
    let ordersDataStation = JSON.parse(JSON.stringify(ordersData.value))

    Object.keys(newValue).forEach((distributionCentre) => {
        ordersDataStation.labels.push(`${distributionCentre}`)
        ordersDataStation.datasets[0].data.push(newValue[`${distributionCentre}`])
    })

    ordersData.value = ordersDataStation
})

watch(profit_ref, (newValue) => {
    let profitDataStation = JSON.parse(JSON.stringify(profitData.value))

    Object.keys(newValue).forEach((distributionCentre) => {
        profitDataStation.labels.push(`${distributionCentre}`)
        profitDataStation.datasets[0].data.push(newValue[`${distributionCentre}`]['projected'])
        profitDataStation.datasets[1].data.push(newValue[`${distributionCentre}`]['made'])
    })

    profitData.value = profitDataStation
})

watch(demand_ref, (newValue) => {
    let demandDataStation = JSON.parse(JSON.stringify(demandData.value))

    Object.keys(newValue).forEach((distributionCentre) => {
        demandDataStation.labels.push(`${distributionCentre}`)
        demandDataStation.datasets[0].data.push(newValue[`${distributionCentre}`]['projected'])
        demandDataStation.datasets[1].data.push(newValue[`${distributionCentre}`]['actual'])
    })

    demandData.value = demandDataStation
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