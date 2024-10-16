<template>
    <div class="therapist-table">
      <h2 class="table-title">Therapist List</h2>
  
      <!-- Search and Filter Container -->
      <div class="search-filter-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by name"
          class="search-bar"
          @input="filterTherapists"
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
  
      <!-- Therapist Table Container -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Birthdate</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Contact Information</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="therapist in filteredTherapists" :key="therapist.id" @click="selectTherapist(therapist)">
              <td>{{ therapist.firstName }}</td>
              <td>{{ therapist.lastName }}</td>
              <td>{{ therapist.birthdate }}</td>
              <td>{{ therapist.gender }}</td>
              <td>{{ therapist.email }}</td>
              <td>{{ therapist.contactInfo }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  // Sample Therapist Data
  const therapists = ref([
    { id: 1, firstName: 'Anna', lastName: 'Lee', birthdate: '1987-06-14', gender: 'Female', email: 'anna.lee@example.com', contactInfo: '0917-123-4567' },
    { id: 2, firstName: 'Ben', lastName: 'Wong', birthdate: '1990-10-09', gender: 'Male', email: 'ben.wong@example.com', contactInfo: '0918-456-7890' },
    { id: 3, firstName: 'Chris', lastName: 'Taylor', birthdate: '1992-03-05', gender: 'Other', email: 'chris.taylor@example.com', contactInfo: '0922-333-4444' }
  ])
  
  const searchQuery = ref('')
  const selectedFilter = ref('All')
  
  // Computed Property for Filtered Therapists
  const filteredTherapists = computed(() => {
    let result = therapists.value
  
    if (searchQuery.value) {
      result = result.filter(therapist =>
        therapist.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        therapist.lastName.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }
  
    switch (selectedFilter.value) {
      case 'Male':
        result = result.filter(therapist => therapist.gender === 'Male')
        break
      case 'Female':
        result = result.filter(therapist => therapist.gender === 'Female')
        break
      case 'Other':
        result = result.filter(therapist => therapist.gender === 'Other')
        break
      case 'DOB_Asc':
        result.sort((a, b) => new Date(a.birthdate) - new Date(b.birthdate))
        break
      case 'DOB_Desc':
        result.sort((a, b) => new Date(b.birthdate) - new Date(a.birthdate))
        break
      case 'Name_Asc':
        result.sort((a, b) => a.lastName.localeCompare(b.lastName))
        break
    }
  
    return result
  })
  
  // Emit the selected therapist to parent component
  const emit = defineEmits(['selectTherapist'])
  const selectTherapist = (therapist) => {
    emit('selectTherapist', therapist)
  }
  </script>
  
  <style scoped>
  .therapist-table {
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
    padding: 10px;
  }
  
  .table-title {
    font-size: 24px;
    font-weight: bold;
    margin: 0 0 10px;
    text-align: center;
  }
  
  .search-filter-container {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .search-bar {
    border: 2px solid black;
    border-radius: 10px;
    flex: 1;
    padding: 8px;
  }
  
  .filter-dropdown {
    border: 2px solid black;
    border-radius: 10px;
    padding: 8px;
  }
  
  .table-container {
    max-height: 700px;
    overflow-y: auto;
    border: 1px solid #ddd;
    margin-top: 10px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 12px;
    text-align: center;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  tr:hover {
    background-color: #f5f5f5;
    cursor: pointer;
  }
  </style>
  