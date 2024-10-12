<template>
    <div class="add-client-form">
      <h2>Add New Client</h2>
      <div class="form-content">
        <label for="clientID">Client ID:</label>
        <input type="text" id="clientID" v-model="newClient.id" placeholder="Enter Client ID" />
  
        <label for="firstName">First Name:</label>
        <input type="text" id="firstName" v-model="newClient.firstName" placeholder="Enter First Name" />
  
        <label for="lastName">Last Name:</label>
        <input type="text" id="lastName" v-model="newClient.lastName" placeholder="Enter Last Name" />
  
        <label for="dateOfBirth">Date of Birth:</label>
        <input type="date" id="dateOfBirth" v-model="newClient.dateOfBirth" />
  
        <label for="gender">Gender:</label>
        <select id="gender" v-model="newClient.gender">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
  
        <label for="contactInfo">Contact Information:</label>
        <input type="text" id="contactInfo" v-model="newClient.contactInfo" placeholder="Enter Contact Info" />
      </div>
  
      <div class="button-container">
        <button @click="saveNewClient">Add Client</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const newClient = ref({
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    contactInfo: ''
  })
  
  const saveNewClient = () => {
    console.log('New client added:', newClient.value)
    // Add logic to save the new client here
    Object.assign(newClient.value, {
      id: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      contactInfo: ''
    })
  }
  </script>
  
  <style scoped>
  .add-client-form {
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
  
  .form-content {
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
  }
  </style>
  