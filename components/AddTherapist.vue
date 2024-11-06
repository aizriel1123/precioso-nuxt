<template>
  <div class="add-therapist-form">
    <h2>Add New Therapist</h2>
    <!-- 
    
      <label for="therapistID">Therapist ID:</label>
      <input type="text" id="therapistID" v-model="newTherapist.id" placeholder="Enter Therapist ID" />

      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" v-model="newTherapist.firstName" placeholder="Enter First Name" />

      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" v-model="newTherapist.lastName" placeholder="Enter Last Name" />

      <label for="schedule">Schedule:</label>
      <input 
        type="text" 
        id="schedule" 
        v-model="newTherapist.schedule" 
        placeholder="Enter Schedule" 
      />

      <label for="gender">Gender:</label>
      <select id="gender" v-model="newTherapist.gender">
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <label for="email">Email:</label>
      <input type="email" id="email" v-model="newTherapist.email" placeholder="Enter Email Address" />

      <label for="contactInfo">Contact Information:</label>
      <input type="text" id="contactInfo" v-model="newTherapist.contactInfo" placeholder="Enter Contact Info" />
    </div> 
    
    -->
    
    <form @submit.prevent="addNewTherapist" class="form" noValidate>
      <FormField v-slot="{ componentField }" name="first_name">
        <FormItem>
          <FormLabel>First Name:</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Enter First Name" v-bind="componentField" v-model="newTherapist.firstName"/>
          </FormControl>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="last_name">
        <FormItem>
          <FormLabel>Last Name:</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Enter Last Name" v-bind="componentField" v-model="newTherapist.lastName"/>
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
              v-model="newTherapist.dateOfBirth" 
              class="thin-input" 
            />
          </FormControl>
        </FormItem>
      </FormField>


      <FormField v-slot="{ componentField }" name="gender">
        <FormItem>
          <FormLabel>Gender:</FormLabel>
          <FormControl>
            <Select v-bind="componentField" v-model="newTherapist.gender" class="custom-select">
              <SelectTrigger class="dropdown-trigger">
                <SelectValue class="select-placeholder" placeholder="Select an option" />
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

      <FormField v-slot="{ componentField }" name="therapist_status">
        <FormItem>
          <FormLabel>Status:</FormLabel>
          <FormControl>
            <Select v-bind="componentField" v-model="newTherapist.therapistStatus" class="custom-select">
              <SelectTrigger class="dropdown-trigger">
                <SelectValue class="select-placeholder" placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent class="select-content">
                <SelectGroup>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Unavailable">Unavailable</SelectItem>
                  <SelectItem value="Busy">Busy</SelectItem>
                  <SelectItem value="Not Busy">Not Busy</SelectItem>
                  <SelectItem value="Occupied">Occupied</SelectItem>
                  <!-- Delete the last 3 options when you can -->
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      </FormField>


      <FormField v-slot="{ componentField }" name="schedule">
        <FormItem>
          <FormLabel>Schedule:</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Enter Schedule" v-bind="componentField" v-model="newTherapist.schedule"/>
          </FormControl>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="contact_information">
        <FormItem>
          <FormLabel>Contact Information:</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Enter Contact Information" v-bind="componentField" v-model="newTherapist.contactInfo"/>
          </FormControl>
        </FormItem>
      </FormField>

      <div class="action-buttons">
      <Button variant="ghost" type="submit">Add Therapist</Button>

      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'

const newTherapist = ref({
  id: '',
  firstName: '',
  lastName: '',
  schedule: '',
  gender: '',
  email: '',
  contactInfo: ''
})

const form = useForm()



const addNewTherapist = form.handleSubmit(async (values) => {
  try {
    const response = await $fetch('/api/therapist/therapist', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    location.reload();
  } catch (error) {
    console.error('Add Therapist failed:', error);
  }
});
</script>

<style scoped>
.add-therapist-form {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

.action-buttons {
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
