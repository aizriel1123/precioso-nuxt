<template>
  <NavBar />

  <div class="center-components">
    <h1 class="title">Appointments</h1>

    <!-- Flex container for dropdown, input, filter and buttons -->
    <div class="flex-components">
      <div class="left-side">
        <!-- Search input -->
        <h2>{{ dateToday }}</h2>
        <Input placeholder="Search Client..." class="input_search" v-model="searchQuery"/>
        <Select v-model="selectedFilter">
        <SelectTrigger class="w-[auto]">
          <SelectValue placeholder="Select filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="option in filterOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>
      </div>

      <div class="right-side">
        <!-- Buttons for adding new appointment -->
        <Button variant="ghost" class="button" @click="openAppointmentModal">Add New Booking</Button>
      </div>
    </div>

    <!-- Table for displaying appointments -->
    <div class="table-appointment-container">
      <div class="container-table">
        <div class="table-content">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Appointment ID</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Therapist Name</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Services/Promos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="appointment in filteredAppointments" 
                :key="appointment.id"
                @click="selectAppointment(appointment)">
              <!-- I changed product.stock to StockinProduct and product.CommissionRate to product.commission-->
                <TableCell>{{ appointment.id }}</TableCell>
                <TableCell>{{ appointment.clientname }}</TableCell>
                <TableCell>{{ appointment.therapistname }}</TableCell>
                <TableCell>{{ appointment.time }}</TableCell>
                <TableCell>{{ appointment.servicespromos }}</TableCell>
              </TableRow>
              <!-- Populate empty rows if current row count is les than 10 -->
              <TableRow v-for="index in emptyRows" :key="'empty-' + index" class="empty-row">
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Pagination controls (might delete this part) -->
        <div class="pagination-wrapper">
          <Pagination
            v-slot="{ page }"
            :total="totalPages"
            :sibling-count="1"
            show-edges
            :default-page="currentPage"
            @change="onPageChange"
          >
            <PaginationList v-slot="{ items }" class="pagination-list">
              <PaginationFirst @click="onPageChange(1)" />
              <PaginationPrev @click="onPageChange(currentPage - 1)" />
              <template v-for="(item, index) in items">
                <PaginationListItem
                  v-if="item.type === 'page'"
                  :key="index"
                  :value="item.value"
                  as-child
                >
                  <Button
                    class="pagination-button"
                    :variant="item.value === currentPage ? 'default' : 'outline'"
                    @click="onPageChange(item.value)"
                  >
                    {{ item.value }}
                  </Button>
                </PaginationListItem>
                <PaginationEllipsis v-else :key="item.type" :index="index" />
              </template>
              <PaginationNext @click="onPageChange(currentPage + 1)" />
              <PaginationLast @click="onPageChange(totalPages)" />
            </PaginationList>
          </Pagination>
        </div>
      </div>

      <!-- Edit Selected Appointment container -->
      <div class="container-selectedappointment">
      <h2 class="selected-appointment-title">Edit Selected Appointment</h2>
      
      <form id="update_appointment_panel">
        <FormField v-slot="{ componentField }" name="update_id">
          <FormItem>
            <FormLabel>Appointment ID</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Appointment ID" v-bind="componentField" v-model="selectedAppointmentId" disabled/>
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="update_client_name">
          <FormItem>
            <FormLabel>Client Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter Client Name" v-bind="componentField" v-model="selectedClientName" disabled/>
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="update_therapist_name">
          <FormItem>
            <FormLabel>Therapist Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter Therapist Name" v-bind="componentField" v-model="selectedTherapistName" disabled/>
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="update_time">
          <FormItem>
            <FormLabel>Appointment Time</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Select Time" v-bind="componentField" v-model="selectedTime" disabled/>
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="update_services_promos">
          <FormItem>
            <FormLabel>Services/Promos</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter Services/Promos" v-bind="componentField" v-model="servicespromos" disabled/>
            </FormControl>
          </FormItem>
        </FormField>

        <div class="action-buttons">
          <Button variant="ghost" class="button" type="button" @click="openEditModal">Edit Appointment</Button>
        </div>
      </form>
    </div>
  </div>
</div>

  <!-- Popup to Add New Appointment -->
  <div v-if="isAppointmentModalOpen" class="modal-overlay">
    <div class="modal-content">
      <h2 class="selected-appointment-title">Add New Booking</h2>

      <form @submit.prevent="submitAppointmentForm">
        <FormField v-slot="{ componentField }" name="client_name">
          <FormLabel>Select client</FormLabel>
          <input list="clients" v-model="selectedClient" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Search Client..." />
          <datalist id="clients">
            <option value="Client A"></option>
            <option value="Client B"></option>
            <option value="Client C"></option>
          </datalist>
        </FormField>

        <FormField v-slot="{ componentField }" name="therapist_name">
            <FormLabel>Select Therapist</FormLabel>
            <input list="therapists" v-model="selectedTherapist" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Search therapist..." />
            <datalist id="therapists">
              <option value="Therapist A"></option>
              <option value="Therapist B"></option>
              <option value="Therapist C"></option>
            </datalist>
        </FormField>

        <FormField v-slot="{ componentField }" name="date">
        <FormLabel>Select Date</FormLabel>
            <Popover>
              <PopoverTrigger as-child>
                <Button variant="outline" :class="cn('w-full justify-start text-left font-normal', 'text-muted-foreground')">
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

        <FormField v-slot="{ componentField }" name="time">
          <FormLabel>Select Time</FormLabel>
          <input list="time" v-model="selectedTimeofAppointment" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Select Time..." />
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

            <!-- Promos/Services -->
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
            <div class="mt-6 flex justify-end space-x-2">
            <Button @click="isAppointmentModalOpen = false">Close</Button>
            <Button v-if="activeTab === 'service'" @click="addService">Add More Services</Button>
            <Button v-if="activeTab === 'promo'" @click="addPromo">Add More Promos</Button>
            <Button  @click="submitAppointmentForm">Submit</Button>
          </div>   
      </form>
    </div>

    
  </div>

  <!-- Popup to edit existing appointment -->
  <div v-if="isEditModalOpen" class="modal-overlay">
    <div class="modal-content">
      <h2 class="selected-appointment-title">Edit Existing Appointment</h2>

      <form @submit.prevent="submitExistingAppointmentForm">
        <FormField v-slot="{ componentField }" name="client_name">
                  <FormLabel>Select client</FormLabel>
                  <input list="clients" v-model="selectedClientName" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Search Client..." disabled/>
                </FormField>

        <FormField v-slot="{ componentField }" name="therapist_name">
                  <FormLabel>Select Therapist</FormLabel>
                  <input list="therapists" v-model="selectedTherapist" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Search therapist..." />
                  <datalist id="therapists">
                    <option value="Therapist A"></option>
                    <option value="Therapist B"></option>
                    <option value="Therapist C"></option>
                  </datalist>
        </FormField>

        <FormField v-slot="{ componentField }" name="date">
        <FormLabel>Select Date</FormLabel>
            <Popover>
              <PopoverTrigger as-child>
                <Button variant="outline" :class="cn('w-full justify-start text-left font-normal', 'text-muted-foreground')">
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

        <FormField v-slot="{ componentField }" name="time">
                  <FormLabel>Select Time</FormLabel>
                  <input list="time" v-model="selectedTimeofAppointment" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Select Time..." />
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
            <div class="mt-6 flex justify-end space-x-2">
            <Button @click="isEditModalOpen = false">Close</Button>
            <Button v-if="activeTab === 'service'" @click="addService">Add More Services</Button>
            <Button v-if="activeTab === 'promo'" @click="addPromo">Add More Promos</Button>
            <Button  @click="submitAppointmentForm">Submit</Button>
          </div>   
      </form>
    </div>

    
  </div>
</template>

<script setup>
import NavBar from '~/components/Navbar.vue';
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Pagination, PaginationEllipsis, PaginationFirst, PaginationLast, PaginationList, PaginationListItem, PaginationNext, PaginationPrev } from '@/components/ui/pagination';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { useForm } from 'vee-validate'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
  

const form = useForm()

  // Set up For the search filtering 
  const searchQuery = ref('');
  const selectedFilter = ref(null)
  //ID, Name and type of chosen row from table
  const selectedAppointmentId = ref(null); 
  const selectedClientName = ref('');
  const selectedTherapistName = ref('');
  const selectedTime = ref('');
  const servicespromos=ref('')

  //For pagination
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  //For pop ups
  const isEditModalOpen = ref(false)
  const isAppointmentModalOpen = ref(false);

  //Date today
  const date = new Date();
  let day = date.getDate();
  let year = date.getFullYear();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dateToday = `${months[date.getMonth()]} ${day},${year}`;

  //Sample data
  const appointments = ref([
  {
    id: 1,
    clientname: "Alice Johnson",
    therapistname: "Dr. Smith",
    time: "11:00AM",
    servicespromos: "Massage Therapy",
  },
  {
    id: 2,
    clientname: "Bob Brown",
    therapistname: "Dr. Adams",
    time: "10:00AM",
    servicespromos: "Acupuncture",
  },
  {
    id: 3,
    clientname: "Charlie Davis",
    therapistname: "Dr. Lee",
    time: "9:00AM",
    servicespromos: "Physical Therapy",
  },
  {
    id: 4,
    clientname: "Dana Evans",
    therapistname: "Dr. Thompson",
    time: "1:00PM",
    servicespromos: "Chiropractic Care",
  },
  {
    id: 5,
    clientname: "Eli Fox",
    therapistname: "Dr. Young",
    time: "5:00PM",
    servicespromos: "Massage Therapy",
  },
  {
    id: 6,
    clientname: "Fiona Green",
    therapistname: "Dr. White",
    time: "6:00PM",
    servicespromos: "Reflexology",
  },
  {
    id: 7,
    clientname: "George Harris",
    therapistname: "Dr. Clark",
    time: "12:00PM",
    servicespromos: "Reiki",
  },
  {
    id: 8,
    clientname: "Holly Irwin",
    therapistname: "Dr. Walker",
    time: "7:30PM",
    servicespromos: "Hot Stone Massage",
  },
  {
    id: 9,
    clientname: "Ian James",
    therapistname: "Dr. King",
    time: "1:00PM",
    servicespromos: "Massage Therapy",
  },
  {
    id: 10,
    clientname: "Jill Kelly",
    therapistname: "Dr. Harris",
    time: "1:00PM",
    servicespromos: "Acupuncture",
  },
]);

  //choosing an appointment from table
  const selectAppointment = (appointment) => {
    selectedAppointmentId.value = appointment.id;
    selectedClientName.value = appointment.clientname;
    selectedTherapistName.value = appointment.therapistname;
    selectedTime.value = appointment.time;
    servicespromos.value = appointment.servicespromos;
  };
  
  // Set up the filter options
  const filterOptions = [
  { value: 'time-asc', label: 'Time: Ascending' },
  { value: 'time-desc', label: 'Time: Descending' },
  { value: 'client-asc', label: 'Client Name: A to Z' },
  { value: 'client-desc', label: 'Client Name: Z to A' },
  { value: 'therapist-asc', label: 'Therapist Name: A to Z' },
  { value: 'therapist-desc', label: 'Therapist Name: Z to A' },
];

  // Filter Function
  const filteredAppointments = computed(() => {
  // Initialize the filtered appointments array with all appointments
  let filtered = appointments.value;

  // Filter based on the search query
  if (searchQuery.value) {
    filtered = filtered.filter(appointment =>
      appointment.clientname.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Sort the filtered appointments based on the selected filter
  if (selectedFilter.value === 'time-asc') {
    filtered.sort((a, b) => new Date(a.time) - new Date(b.time));
  } else if (selectedFilter.value === 'time-desc') {
    filtered.sort((a, b) => new Date(b.time) - new Date(a.time));
  } else if (selectedFilter.value === 'client-asc') {
    filtered.sort((a, b) => a.clientname.localeCompare(b.clientname));
  } else if (selectedFilter.value === 'client-desc') {
    filtered.sort((a, b) => b.clientname.localeCompare(a.clientname));
  } else if (selectedFilter.value === 'therapist-asc') {
    filtered.sort((a, b) => a.therapistname.localeCompare(b.therapistname));
  } else if (selectedFilter.value === 'therapist-desc') {
    filtered.sort((a, b) => b.therapistname.localeCompare(a.therapistname));
  }
  return filtered;
});


  const onPageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages.value) currentPage.value = newPage;
  };

    //Open popup for editing existing products
    const openEditModal = () => {
    isEditModalOpen.value = true;
  };

  //User input in adding new appointment
  const selectedClient = ref('')
  const selectedTherapist = ref('')
  const selectedDate = new DateFormatter('en-US', {
    dateStyle: 'long',
  })
  const selectedTimeofAppointment=ref('');

  //array for selected service/promo
  const selectedServices = ref([''])
  const selectedPromos = ref([''])

  //chosen tab
  const activeTab = ref('service')
  
  //Checks what tab is opened
  const tabChanged = (value) => {
  activeTab.value = value;
}

  //Make sure all inputs are filled up before exiting popup
  const validateForm = () => {
      return (
        selectedClient.value.trim() !== '' &&
        selectedTherapist.value.trim() !== '' &&
        selectedDate.value !== null &&
        selectedTimeofAppointment.value.trim() !== '' &&
        (selectedServices.value.some(service => service.trim() !== '') || selectedPromos.value.some(promo => promo.trim() !== ''))
      );
    };

// Function for form submission
const submitAppointmentForm = () => {
  if (validateForm()) {
    //Add db logic
    closeAppointmentModal() // Close modal after submission
  } else {
    alert('Please fill out all required fields');
  }

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
  //Open popup for adding new supplier
  const openAppointmentModal = () => {
    isAppointmentModalOpen.value = true;
  };

  //Close popup
  const closeAppointmentModal = () => {
    isAppointmentModalOpen.value = false;
  };
  
</script>


<style scoped>

  .title {
    font-size: 48px;
    font-weight: bolder;
  }

  h2 {
    margin-top: 10px;
    margin-right:20px;
  }


.center-components {
  margin-top: 10px;
  margin-left: 2%;
  margin-right: 2%;
  margin-bottom: 50px;
}

  /* Flexbox for dropdown, input, filter, and other buttons */
  .flex-components {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    margin-top: 10px;
    width: 100%; 
  }

  /* Left side of table (dropdown, input and filter) */
  .left-side {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-start;
    width: 66.66%;
  }

  /* Right side of table (buttons) */
  .right-side {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-end;
    width: 33.33%;

  }

  /* Table div and Edit Selected Product div */
  .table-appointment-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  /* Table container */
  .container-table {
    flex-basis: 66.66%; 
    border: 1px solid #000000;
    border-radius: 8px;
    padding: 16px;
  }

  /* Edit Selected Product container */
  .container-selectedappointment {
    flex-basis: 33.33%;
    border: 1px solid #000000;
    border-radius: 8px;
    padding: 16px;

  }

  /* Dropdown select trigger */
  .dropdown-trigger {
    width: 200px;
  }

  /* Search input */
  .input_search {
    width: 250px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  /* All black buttons  */
  .button {
    display: flex;
    align-items: center;
    padding: 8px;
    margin: 2px;
    background-color: #000000;
    color: #ffffff;
  }

  .icon-small {
    width: 16px;
    height: 16px;
  }


  .table-content {
    flex-grow: 1;
  }

  /* Pagination (might remove)  */
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 20px; 
  }

  /* Pagination (might remove)  */
  .pagination-list {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  /* Pagination (might remove)  */
  .pagination-button {
    width: 40px;
    height: 40px;
  }

  /* Specifically for H2s */
  .selected-appointment-title {
    font-size: 20px;
    margin-bottom: 16px;
    font-weight: bolder;
  }

  /* Cancel and Save Changes button */
  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 20px;
  }

  .cancel-button {
    color: #ffffff;
    background-color: #dc2626;
  }


  /* Popups */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    max-width: 90%;
  }

  .modal-action-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

</style>