<template>
  <n-skeleton v-for="i in number" :key="i" :height="243" :sharp="false" class="mb-8" />
</template>

<script setup lang="ts">
defineProps<{
    number: number
}>()
</script>

<style scoped>

</style>
