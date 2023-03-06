<template>
  <div>
    <h1 class="text-8xl text-black text-center">
      List of jobs
    </h1>

    <table class="table">
      <thead class="table-header-group">
        <tr>
          <th>Job title</th>
          <th>Company</th>
          <th>Location</th>
          <th>Salary</th>
          <th>Posted At</th>
          <th>Duration</th>
          <th>Experience Level</th>
          <th>Role</th>
          <th>Benefits</th>
          <th>Tech</th>
          <th>Description</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="job in jobs" :key="job.id" class="table-row border-b-2 px-2 py-2">
          <td>{{ job.title }}</td>
          <td>{{ job.company.name }}</td>
          <td>{{ job.locations.map(location => location.name).join(", ") }}</td>
          <td>{{ job.salary }}</td>
          <td>{{ new Date(job.postedAt).toLocaleString() }}</td>
          <td>{{ job.Duration.name }}</td>
          <td>{{ job.ExperienceLevel.name }}</td>
          <td>{{ job.Role.name }}</td>
          <td>{{ job.benefits.map(benefit => benefit.name).join(", ") }}</td>
          <td>{{ job.tech.map(tech => tech.name).join(", ") }}</td>
          <td v-html="job.description" />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">

const { data: jobs } = useFetch('/api/jobs')

</script>

<style scoped>

</style>
