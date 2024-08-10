<template>
    <Bar
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
    />
</template>

<script setup> 

import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { Bar } from "vue-chartjs";
import { ref, watch } from 'vue';

Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps(['chartData'])
const chartData = ref({
    labels: [ 'Full', 'Empty', 'Defective' ],
    datasets: [ { data: props.chartData == null ? [] : props.chartData, backgroundColor: [
            'rgba(255, 99, 132)', // Installed - Red with opacity
            'rgba(54, 162, 235)',  // Overloaded - Blue with opacity
            'rgba(255, 206, 86)'   // Offline - Yellow with opacity
        ], labels: null } ]
})

const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    }
})

watch(() => props.chartData, (newVal) => {
    chartData.value = {
        ...chartData.value,
        datasets: [ { data: props.chartData} ]
    }
})

</script>