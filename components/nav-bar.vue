<template>
  <nav
    class="bg-black shadow-sm "
  >
    <div class="container flex-wrap items-center justify-between px-4 py-4 mx-auto lg:px-12 md:flex md:py-6">
      <nuxt-link to="/">
        <img class="h-6 md:h-8" src="/assets/images/logo.svg" alt="Remote Dev Jobs Logo">
      </nuxt-link>
      <ul class="flex max-w-full gap-3 overflow-x-auto md:gap-5 lg:text-lg whitespace-nowrap lg:gap-10">
        <li>
          <nuxt-link
            class="text-gray-300 no-underline transition-colors hover:text-gray-50"
            to="/"
          >
            Home
          </nuxt-link>
        </li>

        <li>
          <nuxt-link
            class="text-gray-300 no-underline transition-colors hover:text-gray-50"
            to="/jobs"
          >
            Jobs
          </nuxt-link>
        </li>

        <li>
          <nuxt-link
            class="text-gray-300 no-underline transition-colors hover:text-gray-50"
            to="/jobs/worldwide"
          >
            Work from anywhere
          </nuxt-link>
        </li>

        <li>
          <nuxt-link
            class="text-gray-300 no-underline transition-colors hover:text-gray-50"
            to="/jobs/4-day-week"
          >
            4 day week
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
