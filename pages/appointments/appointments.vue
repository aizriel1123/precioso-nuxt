<template>
  <NavBar/>
    <div class="center_components">
      <h1>Appointment</h1>
  
      <div class="contain_components">
        
        <!-- Select Client Form -->
        <div class="container_form" >
          <h2>Booking Details</h2>
          <form @submit.prevent="submitAppointmentForm">

            <!-- First row -->
            <!-- Client Input -->
            <div class="container_flex">
              <div class="input-container">
                <FormField v-slot="{ componentField }" name="client_name">
                  <FormLabel>Select client</FormLabel>
                  <input list="clients" v-model="selectedClient" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Search Client..." />
                  <datalist id="clients">
                    <option value="Client A"></option>
                    <option value="Client B"></option>
                    <option value="Client C"></option>
                  </datalist>
                </FormField>
              </div>

              <!-- Therapist Input -->
              <div class="input-container">
                <FormField v-slot="{ componentField }" name="therapist_name">
                  <FormLabel>Select Therapist</FormLabel>
                  <input list="therapists" v-model="selectedTherapist" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Search therapist..." />
                  <datalist id="therapists">
                    <option value="Therapist A"></option>
                    <option value="Therapist B"></option>
                    <option value="Therapist C"></option>
                  </datalist>
                </FormField>
              </div>

              <!-- Calendar Input -->
              <div class="calendar-container">
                <FormField v-slot="{ componentField }" name="date">
                  <FormLabel>Select Date</FormLabel>
                  <Popover>
                    <PopoverTrigger as-child>
                      <Button
                        variant="outline"
                        :class="cn('w-full justify-start text-left font-normal', 'text-muted-foreground')">
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {{ value ? selectedDate.format(value.toDate(getLocalTimeZone())) : "Pick a date" }}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="calendar-popover">
                      <div class="calendar-wrapper">
                        <Calendar v-model="value" initial-focus />
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormField>
              </div>

              <!-- Time Input -->
              <div class="input-container">
                <FormField v-slot="{ componentField }" name="time">
                  <FormLabel>Select Time</FormLabel>
                  <input list="time" v-model="selectedTime" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Select Time..." />
                  <datalist id="time">
                    <option value="9:00AM"></option>
                  <option value="9:30AM"></option>
                  <option value="10:00AM"></option>
                  <option value="10:30AM"></option>
                  <option value="11:00AM"></option>
                  <option value="11:30AM"></option>
                  <option value="12:00PM"></option>
                  <option value="12:30PM"></option>
                  <option value="1:00PM"></option>
                  <option value="1:30PM"></option>
                  <option value="2:00PM"></option>
                  <option value="2:30PM"></option>
                  <option value="3:00PM"></option>
                  <option value="3:30PM"></option>
                  <option value="4:00PM"></option>
                  <option value="4:30PM"></option>
                  <option value="5:00PM"></option>
                  <option value="5:30PM"></option>
                  </datalist>
                </FormField>
              </div>
            </div>

            <!-- Service/Promo container -->
             <hr class="pt-2 pb-2">
             <Tabs default-value="service" class="w-[100%] pt-2" @update:modelValue="tabChanged">
              <TabsList class="grid w-full grid-cols-2 w-[200px]">
                <TabsTrigger value="service">Service</TabsTrigger>
                <TabsTrigger value="promo">Promo</TabsTrigger>
              </TabsList>

              <!-- Service Tab -->
              <TabsContent value="service">
                <Card>
                  <CardHeader>
                    <CardDescription class="text-black">
                      Select services the client wants to avail.
                    </CardDescription>
                  </CardHeader>
                  <CardContent class="space-y-2">
                    <!-- Loop through selectedServices to add input -->
                    <div v-for="(service, index) in selectedServices" :key="index" class="space-y-1">
                      <input 
                        v-model="selectedServices[index]" 
                        list="services" 
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                        placeholder="Enter a service..."
                      />
                      <!-- Autocomplete options -->
                      <datalist id="services">
                        <option value="Service A"></option>
                        <option value="Service B"></option>
                        <option value="Service C"></option>
                      </datalist>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <!-- Promo Tab -->
              <TabsContent value="promo">
                <Card>
                  <CardHeader>
                    <CardDescription class="text-black">
                      Select promos the client wants to avail.
                    </CardDescription>
                  </CardHeader>
                  <CardContent class="space-y-2">

                    <!-- Loop through selectedPromos to add input -->
                    <div v-for="(promo, index) in selectedPromos" :key="index" class="space-y-1">
                      <input 
                        v-model="selectedPromos[index]" 
                        list="promos" 
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                        placeholder="Enter a promo..."
                      />
                      <!-- Autocomplete options -->
                      <datalist id="promos">
                        <option value="Promo A"></option>
                        <option value="Promo B"></option>
                        <option value="Promo C"></option>
                      </datalist>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              </Tabs>
          </form>
          <div class="mt-6 flex justify-end space-x-2">
            <Button v-if="activeTab === 'service'" @click="addService">Add More Services</Button>
            <Button v-if="activeTab === 'promo'" @click="addPromo">Add More Promos</Button>
            <Button  @click="openAppointmentModal">Submit Appointment</Button>
          </div>        
        </div>
      </div>
    </div>

   <!-- Popup to confirm booking details -->
   <div v-if="isAppointmentModalOpen" class="modal-overlay">
    <div class="modal-content">
      <h2 class="selected-product-title">Confirm Booking Details</h2>
      <p id="bold">Please check booking details below:</p>
      <p>Client Name: {{ selectedClient }}</p>
      <p>Therapist Name: {{ selectedTherapist }}</p>
      <p>Appointment Schedule: {{ value ? selectedDate.format(value.toDate(getLocalTimeZone())) : "No date selected" }}, {{ selectedTime }}</p>
      <p>Services: {{ formattedServices }}</p>
      <p>Promos: {{ formattedPromos }}</p>
      <p id="bold">Go back to edit details, or click done to set appointment.</p>

      <div class="mt-6 flex justify-end space-x-2">
      <Button @click="closeAppointmentModal">Go Back</Button>
      <Button @click="submitAppointmentForm">Done</Button>
      </div>
    </div>
  </div>

  </template>
  
  <script setup>
  import { ref } from 'vue'
  import NavBar from '~/components/Navbar.vue'
  import { Button } from '@/components/ui/button'
  import { FormField, FormLabel } from '@/components/ui/form'
  import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs'
  import { Calendar as CalendarIcon } from 'lucide-vue-next'
  import { Calendar } from '@/components/ui/calendar'
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
  import { cn } from '@/lib/utils'
  import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
  
  //User input
  const selectedClient = ref('')
  const selectedTherapist = ref('')
  const selectedDate = new DateFormatter('en-US', {
    dateStyle: 'long',
  });
  const selectedTime = ref('')

  //array for selected service/promo
  const selectedServices = ref([''])
  const selectedPromos = ref([''])

  //chosen tab
  const activeTab = ref('service')
  
  //Checks what tab is opened
  const tabChanged = (value) => {
  activeTab.value = value;
}

  //Make sure all inputs are filled up before showing popup
  const validateForm = () => {
      return (
        selectedClient.value.trim() !== '' &&
        selectedTherapist.value.trim() !== '' &&
        selectedDate.value !== null &&
        selectedTime.value.trim() !== '' &&
        (selectedServices.value.some(service => service.trim() !== '') || selectedPromos.value.some(promo => promo.trim() !== ''))
      );
    };

// Function to add a new service input
function addService() {
  // Push empty string to create a new input field
  selectedServices.value.push('')
}

// Function to add a new promo input
function addPromo() {
  // Push empty string to create a new input field
  selectedPromos.value.push('')
}

//For popup, value is false so that it will not appear yet.
const isAppointmentModalOpen = ref(false)

// Function to open the appointment modal
const openAppointmentModal = () => {
    if (validateForm()) {
      isAppointmentModalOpen.value = true
    } else {
      alert("Please fill in all required fields before submitting.")
    }
  };

// Function to close the appointment modal
const closeAppointmentModal = () => {
  isAppointmentModalOpen.value = false
};

// Function for form submission
const submitAppointmentForm = () => {
  //Add logic for adding to db
  selectedClient.value = ''
  selectedTherapist.value = ''
  selectedDate.value = null
  selectedTime.value = ''
  selectedServices.value = ['']
  selectedPromos.value = ['']
  closeAppointmentModal() // Close modal after submission

};

//Display availed services in 1 line
const formattedServices = computed(() => {
  const services = selectedServices.value.map(s => s.trim()).filter(Boolean)
    return services.length > 0 ? services.join(', ') : 'None'; //If no service, display none
});

//Display availed promos in 1 line
const formattedPromos = computed(() => {
  const promos = selectedPromos.value.map(p => p.trim()).filter(Boolean)
    return promos.length > 0 ? promos.join(', ') : 'None'; //If no service, display none
  });


</script>
  
 <style>

  h1 {
    font-size: 48px;
    font-weight: bolder;
    padding-bottom: 20px;
  }

  h2 {
    font-size: 20px;
    margin-bottom: 16px;
    font-weight: bolder;
  }
  
  p, li {
  display: flex;
  height: 2.5rem;
  width: 100%;
  background-color: #ffffff;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  }

  #bold {
    font-weight: bold;
  }

  .center_components {
    margin-top: 10px;
    margin-left: 2%;
    margin-right: 2%;
    margin-bottom: 10px;
  }
  
  .container_form {
    flex-basis: 40%;
    border: 1px solid #000000;
    border-radius: 8px;
    padding:16px;
    width: 100%;
    max-width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }

  .container_flex {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

  .button {
    padding: 8px;
    background-color: #000000;
    color: #ffffff;
  }
  
  .selected-product-title {
    font-size: 20px;
    margin-bottom: 16px;
    font-weight: bolder;
  }
  
  .tabs {
    padding-top: 16px;
    padding-bottom: 16px;
  }
  
  .calendar-container, 
  .input-container {
  flex: 1;
  max-width: 100%;
}

.calendar-wrapper {
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-container input {
  width: 100%; 
}
  </style>