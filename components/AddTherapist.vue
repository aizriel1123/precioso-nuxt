<template>
  <div class="add-therapist-form">
    <h2>Add New Therapist</h2>
    <div class="form-content">
      <label for="therapistID">Therapist ID:</label>
      <input type="text" id="therapistID" v-model="newTherapist.id" placeholder="Enter Therapist ID" />

      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" v-model="newTherapist.firstName" placeholder="Enter First Name" />

      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" v-model="newTherapist.lastName" placeholder="Enter Last Name" />

      <label for="schedule">Schedule:</label>
      <input 
        type="text" 
        id="schedule" 
        v-model="newTherapist.schedule" 
        placeholder="Enter Schedule" 
      />

      <label for="gender">Gender:</label>
      <select id="gender" v-model="newTherapist.gender">
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <label for="email">Email:</label>
      <input type="email" id="email" v-model="newTherapist.email" placeholder="Enter Email Address" />

      <label for="contactInfo">Contact Information:</label>
      <input type="text" id="contactInfo" v-model="newTherapist.contactInfo" placeholder="Enter Contact Info" />
    </div>

    <div class="button-container">
      <button @click="saveNewTherapist">Add Therapist</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'

const newTherapist = ref({
  id: '',
  firstName: '',
  lastName: '',
  schedule: '',
  gender: '',
  email: '',
  contactInfo: ''
})

const form = useForm()

const saveNewTherapist = form.handleSubmit(async (values) => {
  try {
    const response = await $fetch('/api/inventory/product', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: values,
    });
  } catch (error) {
    console.error('Add Therapist failed:', error);
  }
  closeProductModal();
});
</script>

<style scoped>
.add-therapist-form {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

h2 {
  text-align: center;
  font-size: 20px;
}

.form-content {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 10px;
}

input,
select {
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: black;
  color: white;
  cursor: pointer;
}
</style>
