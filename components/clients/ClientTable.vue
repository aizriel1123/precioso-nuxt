// File: components/clients/ClientTable.vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFetch } from '#app'

// State management
const clients = ref([])
const isLoading = ref(true)
const error = ref(null)

// Fetch clients
const fetchClients = async () => {
  isLoading.value = true
  try {
    const { data, error: fetchError } = await useFetch('/api/clients')
    if (fetchError.value) throw new Error(fetchError.value.message)
    clients.value = data.value
  } catch (err) {
    error.value = err.message
    console.error('Error fetching clients:', err)
  } finally {
    isLoading.value = false
  }
}

// Add new client
const addNewClient = async (clientData) => {
  try {
    const { data, error: fetchError } = await useFetch('/api/clients', {
      method: 'POST',
      body: clientData
    })
    if (fetchError.value) throw new Error(fetchError.value.message)
    await fetchClients() // Refresh client list
    return data.value
  } catch (err) {
    console.error('Error creating client:', err)
    throw err
  }
}

// Update client
const updateClient = async (id, clientData) => {
  try {
    const { data, error: fetchError } = await useFetch(`server/api/clients/${id}`, {
      method: 'PUT',
      body: clientData
    })
    if (fetchError.value) throw new Error(fetchError.value.message)
    await fetchClients() // Refresh client list
    return data.value
  } catch (err) {
    console.error('Error updating client:', err)
    throw err
  }
}

// Initialize component
onMounted(() => {
  fetchClients()
})
</script>