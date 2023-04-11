<template>
  <div>
    <n-form
      ref="formRef"
      :model="formValue"
      class="grid grid-cols-12 mt-2"
      :rules="rules"
      @submit.prevent="onSubmit"
    >
      <n-form-item class="col-span-12" label="First Name" path="firstName">
        <n-input
          v-model:value="formValue.firstName"
          class="rounded px-2 py-2"
          placeholder="Your First Name"
        />
      </n-form-item>
      <n-form-item class="col-span-12" label="Email" path="email">
        <n-input
          v-model:value="formValue.email"
          class="rounded px-2 py-2"
          placeholder="your@email.com"
        />
      </n-form-item>
      <n-form-item class="col-span-12">
        <button class="w-full px-2 py-2 rounded-full  text-white  bg-green-600 font-bold">
          {{ isLoading ? 'Subscribing...' : 'Subscribe' }}
        </button>
      </n-form-item>
    </n-form>

    <p v-if="success === false">
      Sorry, Something went wrong, please try again by refreshing the page.
    </p>

    <p v-if="success">
      Thanks for subscribing 🙏, Please confirm your
      subscription by clicking on the link sent to your inbox to make sure you get the weekly job posts.
    </p>
  </div>
</template>

<script setup lang="ts">
import { FormInst } from 'naive-ui'
import { ref } from 'vue'

const formValue = ref({
  firstName: '',
  email: ''
})

const formRef = ref<FormInst | null>(null)

const props = defineProps<{
  formId: string
}>()

const rules = {
  email: {
    required: true,
    trigger: 'blur',
    message: 'Please enter a valid email address'
  },
  firstName: {
    required: true,
    trigger: 'blur',
    message: 'Please enter your first name'
  }
}

const success = ref<undefined|boolean>(undefined)
const isLoading = ref(false)

const onSubmit = async (event: Event) => {
  event.preventDefault()

  if (!formValue.value.email || !formValue.value.firstName) {
    return
  }

  isLoading.value = true

  const body = JSON.stringify({
    formId: props.formId,
    firstName: formValue.value.firstName,
    email: formValue.value.email
  })

  try {
    await $fetch('/api/newsletter/weekly-general-subscribe', {
      method: 'POST',
      body
    })

    success.value = true
    isLoading.value = false

    formValue.value = {
      firstName: '',
      email: ''
    }
  } catch {
    success.value = false
    isLoading.value = false
  }
}

</script>