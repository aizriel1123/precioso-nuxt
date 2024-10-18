<template>
  <div class="client-info">
    <h2>Client Information</h2>
    <div class="info-content">
      <label for="clientID">Client ID:</label>
      <input type="text" id="clientID" v-model="client.id" disabled />

      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" v-model="client.firstName" @input="trackChanges" />

      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" v-model="client.lastName" @input="trackChanges" />

      <label for="dateOfBirth">Date of Birth:</label>
      <input type="date" id="dateOfBirth" v-model="client.dateOfBirth" @input="trackChanges" />

      <label for="gender">Gender:</label>
      <select id="gender" v-model="client.gender" @change="trackChanges">
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <label for="contactInfo">Contact Information:</label>
      <input type="text" id="contactInfo" v-model="client.contactInfo" @input="trackChanges" />
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

    <!-- Static Save and Cancel Buttons -->
    <div class="button-container" v-if="hasChanges">
      <button @click="saveChanges">Save</button>
      <button @click="cancelEdit">Cancel</button>
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
    products: 'Facial Cum, Serum',
    therapist: 'Ben Dover',
    totalCost: '₱1,500',
  },
  {
    time: '2024-10-10 11:00',
    products: 'Massage, Happy Ending',
    therapist: 'Mike Hawk',
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
  height: 100%; /* Full height of the container */
  overflow: hidden; /* Prevent overflow from spilling */
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
  overflow-y: auto; /* Enable vertical scrolling */
  flex: 1; /* Allow this section to take up available space */
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
  max-height: 200px; /* Optional: Limit the height of the transaction section */
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
  position: sticky;
  bottom: 0;
  background-color: white; /* Match background to avoid overlap issues */
  padding: 10px 0;
  display: flex;
  justify-content: center;
  border-top: 1px solid #ccc;
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
</style>
