<template>
  <div class="therapist-info">
    <h2>Therapist Information</h2>
    <div class="info-content">
      <!-- <label for="therapistID">Therapist ID:</label>
      <input type="text" id="therapistID" v-model="therapist.id" disabled />

      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" v-model="therapist.first_name" @input="trackChanges" />

      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" v-model="therapist.last_name" @input="trackChanges" />

      <label for="schedule">Schedule:</label>
      <input type="text" id="schedule" v-model="therapist.schedule" placeholder="Enter Schedule" @input="trackChanges" />

      <label for="gender">Gender:</label>
      <select id="gender" v-model="therapist.Gender.gender" @change="trackChanges">
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <label for="gender">Status:</label>
      <select id="gender" v-model="therapist.TherapistStatus.status" @change="trackChanges">
        <option value="Busy">Busy</option>
        <option value="Not Busy">Not Busy</option>
        <option value="Available">Available</option>
        <option value="Unavailable">Unavailable</option>
        <option value="Occupied">Occupied</option>
      </select>

      <label for="contactInfo">Contact Information:</label>
      <input type="text" id="contactInfo" v-model="therapist.contactinfo" @input="trackChanges" /> -->
      <form @submit.prevent="updateTherapist" >
          <FormField v-slot="{ componentField }" name="update_id">
            <FormItem>
              <FormLabel>Product ID</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="Therapist ID" 
                  v-bind="componentField" 
                  v-model="therapist.id" 
                  disabled
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="update_first_name">
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Name" v-bind="componentField" v-model="therapist.first_name"  />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="update_last_name">
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Name" v-bind="componentField" v-model="therapist.last_name"  />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="update_schedule">
            <FormItem>
              <FormLabel>Schedule</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Name" v-bind="componentField" v-model="therapist.schedule"  />
              </FormControl>
            </FormItem>
          </FormField>
      </form>
    </div>

    <div class="transactions-section">
      <h3>Recent Transactions</h3>
      <table class="transactions-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Products Availed</th>
            <th>Client Name</th>
            <th>Commission</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(transaction, index) in transactions" :key="index">
            <td>{{ transaction.time }}</td>
            <td>{{ transaction.products }}</td>
            <td>{{ transaction.clientName }}</td>
            <td>{{ transaction.commission }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="button-container" v-if="hasChanges">
      <button @click="saveChanges">Save</button>
      <button @click="cancelEdit">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  therapist: {
    type: Object,
    required: true,
  },
})

const hasChanges = ref(false)

const transactions = ref([
  {
    time: '2024-10-18 15:00',
    products: 'Facial Treatment',
    clientName: 'Jane Doe',
    commission: '₱300',
  },
  {
    time: '2024-10-12 09:00',
    products: 'Body Massage, Aromatherapy',
    clientName: 'Alice Nuxt',
    commission: '₱500',
  },
])

watch(
  () => props.therapist,
  () => {
    hasChanges.value = true
  },
  { deep: true }
)

const saveChanges = () => {
  console.log('Changes saved:', props.therapist)
  hasChanges.value = false
}

const cancelEdit = () => {
  hasChanges.value = false
}

// const updateTherapist = form.handleSubmit(async (values) => {
//     // Add the selectedTherapistId to the body
//     const updatedValues = {
//       ...values,                      // Spread the existing values
//       update_id: selectedTherapistId.value,    // Add selectedProductId to the body
//     };
    
//     try {
//       const response = await $fetch('/api/therapist/therapist', {
//         method: 'PUT',
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedValues), // Stringify the combined object
//       });

//       console.log(response);
//     } catch (error) {
//       console.error('Update Therapist failed:', error);
//     }
//     // filtered.sort((a, b) => a.id - b.id);
//     // Add here fetchTherapist() function when it works

//     closeProductModal();
//   });
</script>

<style scoped>
.therapist-info {
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

.info-content {
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

.transactions-section {
  padding: 20px;
  overflow-y: auto;
  max-height: 200px;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
}

.transactions-table th,
.transactions-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.transactions-table th {
  background-color: #f2f2f2;
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
  margin: 0 5px;
}

button:hover {
  background-color: darkgray;
}
</style>
