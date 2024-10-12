<template>
  <div class="client-table">
    <h2 class="table-title">Client List</h2>

    <!-- Search and Filter Container -->
    <div class="search-filter-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by name"
        class="search-bar"
        @input="filterClients"
      />

      <div class="filter-container">
        <select v-model="selectedFilter" @change="applyFilter" class="filter-dropdown">
          <option value="All">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="DOB_Asc">DOB Ascending</option>
          <option value="DOB_Desc">DOB Descending</option>
          <option value="Name_Asc">Sort by Name</option>
        </select>
      </div>
    </div>

    <!-- Client Table Container -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Client ID</th>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Contact Information</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in filteredClients" :key="client.id" @click="selectClient(client)">
            <td>{{ client.id }}</td>
            <td>{{ client.lastName }}</td>
            <td>{{ client.firstName }}</td>
            <td>{{ client.dateOfBirth }}</td>
            <td>{{ client.gender }}</td>
            <td>{{ client.contactInfo }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const clients = ref([
  // Sample client data
  { id: 1, lastName: 'Doe', firstName: 'John', dateOfBirth: '1990-01-01', gender: 'Male', contactInfo: '123-456-7890' },
  { id: 2, lastName: 'Smith', firstName: 'Jane', dateOfBirth: '1992-05-10', gender: 'Female', contactInfo: '987-654-3210' },
  { id: 3, lastName: 'Johnson', firstName: 'Alice', dateOfBirth: '1988-08-15', gender: 'Female', contactInfo: '456-789-0123' },
  { id: 4, lastName: 'Taylor', firstName: 'Chris', dateOfBirth: '1995-12-22', gender: 'Other', contactInfo: '555-123-4567' },
  { id: 1, lastName: 'Doe', firstName: 'John', dateOfBirth: '1990-01-01', gender: 'Male', contactInfo: '123-456-7890' },
  { id: 2, lastName: 'Smith', firstName: 'Jane', dateOfBirth: '1992-05-10', gender: 'Female', contactInfo: '987-654-3210' },
  { id: 3, lastName: 'Johnson', firstName: 'Alice', dateOfBirth: '1988-08-15', gender: 'Female', contactInfo: '456-789-0123' },
  { id: 4, lastName: 'Taylor', firstName: 'Chris', dateOfBirth: '1995-12-22', gender: 'Other', contactInfo: '555-123-4567' },
  { id: 1, lastName: 'Doe', firstName: 'John', dateOfBirth: '1990-01-01', gender: 'Male', contactInfo: '123-456-7890' },
  { id: 2, lastName: 'Smith', firstName: 'Jane', dateOfBirth: '1992-05-10', gender: 'Female', contactInfo: '987-654-3210' },
  { id: 3, lastName: 'Johnson', firstName: 'Alice', dateOfBirth: '1988-08-15', gender: 'Female', contactInfo: '456-789-0123' },
  { id: 4, lastName: 'Taylor', firstName: 'Chris', dateOfBirth: '1995-12-22', gender: 'Other', contactInfo: '555-123-4567' },
  { id: 1, lastName: 'Doe', firstName: 'John', dateOfBirth: '1990-01-01', gender: 'Male', contactInfo: '123-456-7890' },
  { id: 2, lastName: 'Smith', firstName: 'Jane', dateOfBirth: '1992-05-10', gender: 'Female', contactInfo: '987-654-3210' },
  { id: 3, lastName: 'Johnson', firstName: 'Alice', dateOfBirth: '1988-08-15', gender: 'Female', contactInfo: '456-789-0123' },
  { id: 4, lastName: 'Taylor', firstName: 'Chris', dateOfBirth: '1995-12-22', gender: 'Other', contactInfo: '555-123-4567' },
  
  
])

// States for search and filter
const searchQuery = ref('')
const selectedFilter = ref('All')

// Computed property for filtered clients
const filteredClients = computed(() => {
  let result = clients.value

  // Filter by search query
  if (searchQuery.value) {
    result = result.filter(client =>
      client.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Apply selected filter for gender and sorting
  switch (selectedFilter.value) {
    case 'Male':
      result = result.filter(client => client.gender === 'Male')
      break
    case 'Female':
      result = result.filter(client => client.gender === 'Female')
      break
    case 'Other':
      result = result.filter(client => client.gender === 'Other')
      break
    case 'DOB_Asc':
      result.sort((a, b) => new Date(a.dateOfBirth) - new Date(b.dateOfBirth))
      break
    case 'DOB_Desc':
      result.sort((a, b) => new Date(b.dateOfBirth) - new Date(a.dateOfBirth))
      break
    case 'Name_Asc':
      result.sort((a, b) => {
        if (a.lastName < b.lastName) return -1
        if (a.lastName > b.lastName) return 1
        return 0
      })
      break
  }

  return result
})

// Event to select a client and pass to parent
const emit = defineEmits(['selectClient'])
const selectClient = (client) => {
  emit('selectClient', client)
}
</script>

<style scoped>
.client-table {
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  padding: 10px;
}

.table-title {
  font-size: 24px; /* Set a larger font size */
  font-weight: bold; /* Make the font bold */
  margin: 0 0 10px; /* Add some margin below the title */
  text-align: center; /* Center align the title */
}

.search-filter-container {
  display: flex; /* Use flexbox for side-by-side layout */
  gap: 10px; /* Space between the input and select elements */
  margin-bottom: 10px; /* Add some space below the search/filter container */
}

.search-bar {
  border: 2px solid black;
  border-radius: 10px;
  flex: 1; /* Allow the search bar to grow */
  padding: 8px;
}

.filter-dropdown {
  border: 2px solid black;
  border-radius: 10px;
  padding: 8px;
}

.table-container {
  max-height: 700px; /* Set a maximum height for the container */
  overflow-y: auto; /* Enable vertical scrolling */
  border: 1px solid #ddd; /* Optional: add a border for better visibility */
  margin-top: 10px; /* Add some space above the table container */
}

table {
  width: 100%; /* Make the table take the full width */
  border-collapse: collapse; /* Collapse table borders */
}

th, td {
  padding: 12px; /* Add some padding */
  text-align: center; /* Align text to the center */
  border-bottom: 1px solid #ddd; /* Add bottom border for rows */
}

th {
  background-color: #f2f2f2; /* Optional: add a background color for the header */
}

tr:hover {
  background-color: #f5f5f5; /* Highlight row on hover */
  cursor: pointer; /* Change cursor on hover */
}
</style>
