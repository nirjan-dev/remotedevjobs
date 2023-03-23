<template>
  <n-button class="button-link" v-bind="$props">
    <slot />
  </n-button>
</template>

<script setup lang="ts">

</script>

<style scoped>
.button-link ::v-deep(.n-button__content a) {
    @apply h-full w-full inline-flex px-4 py-4;
}

.button-link {
    @apply px-0 py-0;
}
</style>
