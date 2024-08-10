<template>
    <report />
</template>


<script setup>
definePageMeta({
    middleware: ['auth']
})
import report from '@/components/report.vue'
</script>