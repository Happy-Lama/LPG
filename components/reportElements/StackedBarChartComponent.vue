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
    labels: props.chartData.labels,
    datasets: props.chartData.datasets
})

const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true
        }
    }
})

watch(() => props.chartData, (newVal) => {
    chartData.value = {
        labels: newVal.labels,
        datasets: newVal.datasets
    };
})

</script>