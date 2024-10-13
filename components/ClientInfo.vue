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

    <!-- Conditionally show Save and Cancel buttons -->
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

// Watch for changes to the client object
watch(
  () => props.client,
  () => {
    hasChanges.value = true
  },
  { deep: true } // This allows tracking nested changes
)

const saveChanges = () => {
  console.log('Changes saved:', props.client)
  hasChanges.value = false // Reset the flag after saving
}

const cancelEdit = () => {
  hasChanges.value = false // Reset the flag
}
</script>

<style scoped>
.client-info {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  width: 100%; /* Take full width of the container */
  height: 100%; /* Match the height of AddClient */
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
  margin: 0 5px; /* Add space between buttons */
}
</style>
