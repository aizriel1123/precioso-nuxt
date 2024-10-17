<template>
  <div class="therapist-info">
    <h2>Therapist Information</h2>
    <div class="info-content">
      <label for="therapistID">Therapist ID:</label>
      <input type="text" id="therapistID" v-model="therapist.id" disabled />

      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" v-model="therapist.firstName" @input="trackChanges" />

      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" v-model="therapist.lastName" @input="trackChanges" />

      <label for="birthdate">Date of Birth:</label>
      <input type="date" id="birthdate" v-model="therapist.birthdate" @input="trackChanges" />

      <label for="gender">Gender:</label>
      <select id="gender" v-model="therapist.gender" @change="trackChanges">
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <label for="email">Email:</label>
        <input type="email" id="email" v-model="therapist.email" @input="trackChanges" />

      <label for="contactInfo">Contact Information:</label>
      <input type="text" id="contactInfo" v-model="therapist.contactInfo" @input="trackChanges" />
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

// Watch for changes to the therapist object
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
</script>

<style scoped>
.therapist-info {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  width: 100%; /* Take full width of the container */
  height: 100%; /* Match the height of parent container */
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
  margin: 0 5px;
}

button:hover {
  background-color: darkgray;
}
</style>
