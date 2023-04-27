<template>
  <nav
    class="shadow-sm
  "
  >
    <div class="container flex items-center justify-between flex-wrap  py-4 px-12 max-w-5xl mx-auto">
      <img class="h-8" src="/assets/images/logo.svg" alt="Remote Dev Jobs Logo">
      <n-menu :options="menuOptions" :mode="'horizontal'" />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { MenuOption } from 'naive-ui'
import MyNuxtLink from '~~/components/my-nuxt-link.vue'
const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        MyNuxtLink,
        {
          to: '/'
        },
        'Home'
      ),
    key: 'home'
  },
  {
    label: () =>
      h(
        MyNuxtLink,
        {
          to: '/jobs'
        },
        'Jobs'
      ),
    key: 'jobs'
  }
]
</script>

<style scoped>

</style>
