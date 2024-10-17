<template>
  <div @click="clearSelection">
    <Navbar />

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

</style>
