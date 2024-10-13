<template>
  <div @click="clearSelection">
    <Navbar />

    <div class="button-container">
      <router-link to="@/pages/therapist.vue" class="right-button">Therapist ➔</router-link>
    </div>

    <div class="client-info-container">
      <ClientTable 
        class="client-table" 
        @select-client="selectClient" 
        :clients="clients" 
      />
      <ClientInfo 
        v-if="selectedClient" 
        :client="selectedClient" 
        class="client-info" 
      />
      <AddClient 
        v-else 
        class="add-client" 
        @clientAdded="addClient" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
import ClientInfo from '@/components/ClientInfo.vue'
import ClientTable from '@/components/ClientTable.vue'
import AddClient from '@/components/AddClient.vue'

const selectedClient = ref(null)
const clients = ref([]) // Initialize clients list

const selectClient = (client) => {
  selectedClient.value = client
}

const addClient = (newClient) => {
  clients.value.push(newClient) // Add new client to the list
}

const clearSelection = (event) => {
  const isClickInsideTableOrClientInfo = event.target.closest('.client-table') || event.target.closest('.client-info')
  if (!isClickInsideTableOrClientInfo) {
    selectedClient.value = null
  }
}
</script>

<style scoped>
.client-info-container {
  display: flex;
  padding: 20px;
  gap: 20px;
}

.client-table {
  flex: 0 0 70%; /* Takes 70% of space */
}

.add-client {
  flex: 0 0 30%; /* Takes 30% of space */
}

.client-info {
  flex: 0 0 30%; /* Takes 30% of space */
}

@media (max-width: 768px) {
  .client-info-container {
    flex-direction: column;
  }

  .client-table,
  .add-client,
  .client-info {
    width: 100%;
  }
}

.button-container {
  text-align: right;
  margin-right: 20px;
  margin-top: 20px;
  margin-bottom: 5px; 
  font-size: 20px;     
}

.right-button {
  background-color: black; /* Black background */
  color: white;           /* White text */
  padding: 10px 20px;    /* Padding for the button */
         /* Remove default border */
  border-radius: 10px;    /* Slightly rounded corners */
  cursor: pointer;       /* Cursor pointer on hover */
  transition: background-color 0.3s, color 0.3s; /* Smooth transition for hover effect */
  font-weight: bold;
}

.right-button:hover {
  background-color: white; /* Change to white on hover */
  color: black;            /* Change text color to black on hover */
  border: 2px solid black; /* Add a black border on hover */
  border-radius: 10px;      /* Set border radius to 1px on hover */
  font-weight: bold;
}

</style>
