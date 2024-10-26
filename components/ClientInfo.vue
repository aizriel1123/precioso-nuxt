<template>
  <div class="client-info">
    <h2>Client Information</h2>
    <div class="info-content">
      <form @submit.prevent="addNewClient" class="form" noValidate>
        <FormField v-slot="{ componentField }" name="first_name">
          <FormItem>
            <FormLabel>First Name:</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                placeholder="Enter First Name" 
                v-bind="componentField" 
                v-model="client.firstName" 
              />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="last_name">
          <FormItem>
            <FormLabel>Last Name:</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                placeholder="Enter Last Name" 
                v-bind="componentField" 
                v-model="client.lastName" 
              />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="date_of_birth">
          <FormItem>
            <FormLabel>Date of Birth:</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                placeholder="Enter Date of Birth" 
                v-bind="componentField" 
                v-model="client.dateOfBirth" 
                class="thin-input" 
              />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="gender">
          <FormItem>
            <FormLabel>Gender:</FormLabel>
            <FormControl>
              <Select 
                v-bind="componentField" 
                v-model="client.gender" 
                class="custom-select"
              >
                <SelectTrigger class="dropdown-trigger">
                  <SelectValue 
                    class="select-placeholder" 
                    placeholder="Select an option" 
                  />
                </SelectTrigger>
                <SelectContent class="select-content">
                  <SelectGroup>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="contact_information">
          <FormItem>
            <FormLabel>Contact Information:</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                placeholder="Enter Contact Information" 
                v-bind="componentField" 
                v-model="client.contactInfo" 
              />
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
            <th>Therapist Name</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(transaction, index) in transactions" :key="index">
            <td>{{ transaction.time }}</td>
            <td>{{ transaction.products }}</td>
            <td>{{ transaction.therapist }}</td>
            <td>{{ transaction.totalCost }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="button-container" v-if="hasChanges">
          <button type="submit">Save</button>
          <button type="button" @click="cancelEdit">Cancel</button>
    </div>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  client: {
    type: Object,
    required: true,
  },
})

const hasChanges = ref(false)

const transactions = ref([
  {
    time: '2024-10-18 14:30',
    products: 'Facial Cream, Serum',
    therapist: 'John Postgre',
    totalCost: '₱1,500',
  },
  {
    time: '2024-10-10 11:00',
    products: 'Massage, Body Scrub',
    therapist: 'John Nuxt',
    totalCost: '₱2,000',
  },
])

watch(
  () => props.client,
  () => {
    hasChanges.value = true
  },
  { deep: true }
)

const saveChanges = () => {
  console.log('Changes saved:', props.client)
  hasChanges.value = false
}

const cancelEdit = () => {
  hasChanges.value = false
}
</script>

<style scoped>
.client-info {
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
}

h2 {
  text-align: center;
  font-size: 20px;
  margin-top: 10px;
}

.info-content {
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
  flex: 1;
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
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

button {
  padding: 10px 15px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  background-color: black;
  color: white;
  cursor: pointer;
}

.dropdown-trigger {
  border: 1px solid rgb(206, 206, 206); 
  border-radius: 4px;
  padding: 8px;
  background-color: white; 
}

.select-placeholder {
  color: black; 
  opacity: 1; 
}


.select-content, .select-item {
  color: black;
}

.dropdown-trigger:focus {
  outline: 1px solid gray;
}

.thin-input {
  width: 150px;    
  padding: 4px 6px; 
  border: 1px solid rgb(206, 206, 206); 
  border-radius: 4px;
  background-color: white;
}


.thin-input::placeholder {
  color: black;
  font-size: 14px;
}


.thin-input:focus {
  outline: 2px solid black;
}
</style>
