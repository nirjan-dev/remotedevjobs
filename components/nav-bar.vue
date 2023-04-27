<template>
  <nav
    class="shadow-sm bg-black
  "
  >
    <div class="container  md:flex items-center justify-between flex-wrap py-4 md:py-6 px-12 mx-auto">
      <img class="h-6 md:h-8" src="/assets/images/logo.svg" alt="Remote Dev Jobs Logo">
      <ul class="flex">
        <li>
          <nuxt-link
            class="text-lg mr-6 lg:mr-20 text-gray-300 transition-colors no-underline hover:text-gray-50"
            to="/"
          >
            Home
          </nuxt-link>
        </li>

        <li>
          <nuxt-link
            class="text-lg  text-gray-300 transition-colors no-underline hover:text-gray-50"
            to="/jobs"
          >
            Jobs
          </nuxt-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
