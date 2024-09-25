<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const formSchema = toTypedSchema(z.object({
  username: z.string().min(8).max(50),
  password: z.string().min(8),
}))

const form = useForm({ validationSchema: formSchema })
const router = useRouter()
const onSubmit = form.handleSubmit((values) => console.log('Form submitted!', values))

const handleSignUp = () => {
  router.push('register')
}

</script>

<template>
  <div class="form-container">
    <form @submit.prevent="onSubmit" class="form" noValidate>
      <FormField v-slot="{ componentField }" name="username">
        <img src="/src/images/logo_precioso.png">
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

      <div class="button-group">
        <Button type="submit">Submit</Button>
        <Button class="sign-up-button" @click="handleSignUp">Sign Up</Button>
      </div>
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
  width: 100%;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.FormField {
  margin-bottom: 15px;
}

.FormControl,
.Button[type="submit"] {
  width: 100%;
}

.FormControl {
  padding: 8px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
}

.FormMessage {
  margin-top: 5px;
  font-size: 0.8em;
  color: #ff5252;
}

.Button[type="submit"] {
  margin-top: 15px;
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
}

.Button[type="submit"]:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}

.sign-up-button {
  background: transparent;
  border: none;
  color: rgb(53, 53, 53);
  cursor: pointer;
  padding: 10px 20px;
  font-weight: bold;
  transition: all 0.3s ease;
  text-align: center;
}

.sign-up-button:hover {
  transform: translateY(-1px);
}


</style>