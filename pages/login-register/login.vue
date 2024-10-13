<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = toTypedSchema(z.object({
  username: z.string().min(8).max(50),
  password: z.string().min(8),
}))

const form = useForm({ validationSchema: formSchema })
const router = useRouter()

// Edit this part later for checking of database
const onSubmit = form.handleSubmit((values) => {
  /*  Proceeds to sales-report tab. Change this later to dashboard for owner and pos for therapist
  To test, fill in username and password first*/
  router.push('/inventory/inventory')
})

</script>

<template>
  <div class="form-container">
    <form @submit.prevent="onSubmit" class="form" noValidate>
      <FormField v-slot="{ componentField }" name="username">
        <div class="logo-container">
          <img class="logo-img" src="/src/images/logo_precioso.png" alt="precioso logo">
        </div>
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Enter username" v-bind="componentField" class="w-full" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input type="password" placeholder="Enter password" v-bind="componentField" class="w-full" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" class="submit-btn">Submit</Button>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #E9DB5D;
}

.form {
  max-width: 400px;
  height: 400px;
  width: 100%;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.logo-img {
  width: 200px;
  height: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}

.submit-btn {
  margin-top: 20px; 
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 4px;
  width: 100%;
}

.submit-btn[type="submit"]:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>