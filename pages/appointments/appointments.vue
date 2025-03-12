<template>
  <NavBar />

  <div class="center-components">
    <h1 class="title">Appointments</h1>

    <!-- Flex container for dropdown, search client and add new booking button -->
    <div class="flex-components">
      <div class="left-side">
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
        <!-- Search input -->
        <Input placeholder="Search Client..." class="input_search" v-model="searchClient"/>
      </div>

      <div class="right-side">
        <!-- Button for adding new appointment -->
        <Button variant="ghost" class="button" @click="isNewAppointmentModalOpen = true">Add New Booking</Button>
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
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Services/Promos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="appointment in filteredAppointments" 
                :key="appointment.id"
                @click="selectAppointment(appointment)">
                <TableCell>{{ appointment.id }}</TableCell>
                <TableCell>{{ appointment.clientname }}</TableCell>
                <TableCell>{{ appointment.therapistname }}</TableCell>
                <TableCell>{{ appointment.date }}</TableCell>
                <TableCell>{{ appointment.time }}</TableCell>
                <TableCell>{{ appointment.servicespromos }}</TableCell>
              </TableRow>
              <!-- Populate empty rows if current row count is less than 10 -->
              <TableRow v-for="index in emptyRows" :key="'empty-' + index" class="empty-row">
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Pagination controls -->
        <div class="pagination-wrapper">
          <Pagination
            :page="currentPage"
            :total="totalPages"
            :sibling-count="1"
            show-edges
            :per-page="itemsPerPage"
          >
          <PaginationList v-slot="{ items }" class="pagination-list">
                <PaginationFirst :disabled="isFirstPage" @click="handlePageChange(1)"/>
                <PaginationPrev :disabled="isFirstPage" @click="handlePageChange(currentPage-1)"/>
                <template v-for="(item, index) in items">
                  <PaginationListItem 
                    v-if="item.type === 'page'"
                    :key="index"
                    :value="item.value"
                    as-child
                  >
                  <Button class="w-9 h-9 p-0" :variant="item.value === page ? 'default' : 'outline'">
                    {{ item.value }}
                  </Button>
                  </PaginationListItem>
                  <PaginationEllipsis v-else :key="item.type" :index="index" />
                </template>
                <PaginationNext :disabled="isLastPage" @click="handlePageChange(currentPage+1)"/>
                <PaginationLast :disabled="isLastPage" @click="handlePageChange(totalPages)"/>
              </PaginationList>
          </Pagination>
        </div>
      </div>

      <!-- Edit Selected Appointment container -->
      <div class="container-selectedappointment">
        <h2 class="selected-appointment-title">Appointment Information</h2>
        <form id="update_appointment_panel">
          <div class="row">
            <FormField v-slot="{ componentField }" name="update_client_name">
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" v-model="selectedClientName" disabled/>
                </FormControl>
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="update_therapist_name">
              <FormItem>
                <FormLabel>Therapist Name</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" v-model="selectedTherapistName" disabled/>
                </FormControl>
              </FormItem>
            </FormField>
          </div>  
          <div class="row">
            <FormField v-slot="{ componentField }" name="update_time">
              <FormItem>
                <FormLabel>Appointment Date</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" v-model="selectedDate" disabled/>
                </FormControl>
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="update_time">
              <FormItem>
                <FormLabel>Appointment Time</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" v-model="selectedTime" disabled/>
                </FormControl>
              </FormItem>
            </FormField>
          </div>
          <FormField v-slot="{ componentField }" name="update_services_promos">
            <FormItem>
              <FormLabel>Services/Promos</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" v-model="servicespromos" disabled/>
              </FormControl>
            </FormItem>
          </FormField>
          <div class="action-buttons">
            <Button variant="ghost" class="button" type="button" @click="isEditModalOpen = true">Edit Appointment</Button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Popup to Add New Appointment -->
  <div v-if="isNewAppointmentModalOpen" class="modal-overlay">
    <div class="modal-content">
      <h2 class="selected-appointment-title">Add New Booking</h2>
      <form @submit.prevent="submitAppointmentForm">
        <div class="row">
          <FormField v-slot="{ componentField }" name="client_name">
            <FormLabel class="label">Select Client</FormLabel>
            <!-- Use a dynamic Select instead of datalist -->
            <Select v-model="newAppointment_Client">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="client in clients"
                  :key="client.id"
                  :value="client.id">
                  {{ client.first_name }} {{ client.last_name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField v-slot="{ componentField }" name="therapist_name">
            <FormLabel class="label">Select Therapist</FormLabel>
            <!-- Use a dynamic Select for therapists -->
            <Select v-model="newAppointment_Therapist">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a therapist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="therapist in therapists"
                  :key="therapist.id"
                  :value="therapist.id">
                  {{ therapist.first_name }} {{ therapist.last_name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <div class="row">
          <FormField v-slot="{ componentField }" name="date">
            <FormLabel class="label">Select Date</FormLabel>
            <Popover>
              <PopoverTrigger as-child>
                <Button variant="outline" :class="cn('w-full justify-start text-left font-normal', 'text-muted-foreground')">
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{ value ? appointmentDate.format(value.toDate(getLocalTimeZone())) : "Pick a date" }}
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
            <FormLabel class="label">Select Time</FormLabel>
            <!-- For time selection, you could continue to use a plain input -->
            <Input type="text" v-model="newAppointment_Time" placeholder="Select Time..." />
          </FormField>
        </div>

        <FormField v-slot="{ componentField }" name="note">
          <FormLabel class="label">Note</FormLabel>
          <textarea class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Add a note for this appointment..."></textarea>
        </FormField>

        <!-- Promos/Services Tabs (kept unchanged) -->
        <hr class="mt-5 pb-2 border-t-2">
        <Tabs default-value="service" class="w-[100%] pt-2" @update:modelValue="tabChanged">
          <TabsList class="grid w-full grid-cols-2 w-[200px]">
            <TabsTrigger value="service">Service</TabsTrigger>
            <TabsTrigger value="promo">Promo</TabsTrigger>
          </TabsList>
          <TabsContent value="service">
            <Card>
              <CardHeader>
                <CardDescription class="text-black">
                  Select services the client wants to avail.
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-2">
                <div v-for="(service, index) in selectedServices" :key="index" class="space-y-1">
                  <Input v-model="selectedServices[index]" placeholder="Enter a service..." />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="promo">
            <Card>
              <CardHeader>
                <CardDescription class="text-black">
                  Select promos the client wants to avail.
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-2">
                <div v-for="(promo, index) in selectedPromos" :key="index" class="space-y-1">
                  <Input v-model="selectedPromos[index]" placeholder="Enter a promo..." />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div class="mt-6 flex justify-end space-x-2">
          <Button type="button" @click="closeNewAppointmentModal">Close</Button>
          <Button v-if="activeTab === 'service'" type="button" @click="addService">Add More Services</Button>
          <Button v-if="activeTab === 'promo'" type="button" @click="addPromo">Add More Promos</Button>
          <Button type="submit">Submit</Button>
        </div>   
      </form>
    </div>
  </div>

  <!-- Popup to edit existing appointment -->
  <div v-if="isEditModalOpen" class="modal-overlay">
    <div class="modal-content">
      <h2 class="selected-appointment-title">Edit Existing Appointment</h2>
      <form @submit.prevent="submitExistingAppointmentForm">
        <div class="row">
          <FormField v-slot="{ componentField }" name="client_name">
            <FormLabel class="label">Select Client</FormLabel>
            <!-- Display client name in a disabled Select -->
            <Select v-model="selectedClientName" disabled>
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="client in clients"
                  :key="client.id"
                  :value="client.first_name + ' ' + client.last_name">
                  {{ client.first_name }} {{ client.last_name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField v-slot="{ componentField }" name="therapist_name">
            <FormLabel class="label">Select Therapist</FormLabel>
            <Select v-model="editAppointment_Therapist">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a therapist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="therapist in therapists"
                  :key="therapist.id"
                  :value="therapist.id">
                  {{ therapist.first_name }} {{ therapist.last_name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>
        <div class="row">
          <FormField v-slot="{ componentField }" name="date">
            <FormLabel class="label">Select Date</FormLabel>
            <Popover>
              <PopoverTrigger as-child>
                <Button variant="outline" :class="cn('w-full justify-start text-left font-normal', 'text-muted-foreground')">
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{ value ? appointmentDate.format(value.toDate(getLocalTimeZone())) : "Pick a date" }} 
                </Button>
              </PopoverTrigger>
              <PopoverContent class="calendar-popover">
                <div class="calendar-wrapper">
                  <Calendar v-model="value" :minDate="today" initial-focus />
                </div>
              </PopoverContent>
            </Popover>
          </FormField>
          <FormField v-slot="{ componentField }" name="time">
            <FormLabel class="label">Select Time</FormLabel>
            <Input type="text" v-model="editAppointment_Time" placeholder="Select Time..." />
          </FormField>
        </div>     
        <FormField v-slot="{ componentField }" name="note">
          <FormLabel class="label">Note</FormLabel>
          <textarea class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Edit note..."></textarea>
        </FormField>
        <hr class="mt-5 pb-2 border-t-2">
        <Tabs default-value="service" class="w-[100%] pt-2" @update:modelValue="tabChanged">
          <TabsList class="grid w-full grid-cols-2 w-[200px]">
            <TabsTrigger value="service">Service</TabsTrigger>
            <TabsTrigger value="promo">Promo</TabsTrigger>
          </TabsList>
          <TabsContent value="service">
            <Card>
              <CardHeader>
                <CardDescription class="text-black">
                  Select services the client wants to avail.
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-2">
                <div v-for="(service, index) in selectedServices" :key="index" class="space-y-1">
                  <Input v-model="selectedServices[index]" placeholder="Enter a service..." />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="promo">
            <Card>
              <CardHeader>
                <CardDescription class="text-black">
                  Select promos the client wants to avail.
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-2">
                <div v-for="(promo, index) in selectedPromos" :key="index" class="space-y-1">
                  <Input v-model="selectedPromos[index]" placeholder="Enter a promo..." />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div class="mt-6 flex justify-end space-x-2">
          <Button type="button" @click="closeEditAppointmentModal">Close</Button>
          <Button v-if="activeTab === 'service'" type="button" @click="addService">Add More Services</Button>
          <Button v-if="activeTab === 'promo'" type="button" @click="addPromo">Add More Promos</Button>
          <Button type="submit">Submit</Button>
        </div>  
      </form>
    </div>
  </div>
</template>


<script setup>
import NavBar from '~/components/Navbar.vue'
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table'
import { Pagination, PaginationEllipsis, PaginationFirst, PaginationLast, PaginationList, PaginationListItem, PaginationNext, PaginationPrev } from '@/components/ui/pagination'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'

// -------- State and Reactive Variables --------
const clients = ref([]);
const therapists = ref([]);

// Filters and Tabs
const activeTab = ref('service')
const selectedFilter = ref('today')

// Modal States
const isEditModalOpen = ref(false)
const isNewAppointmentModalOpen = ref(false)

// Dynamic Lists for Services/Promos
const selectedServices = ref([''])
const selectedPromos = ref([''])

// Search Inputs
const searchClient = ref('')
const searchTherapist = ref('')

// Selected Appointment Details (for the table and editing)
const selectedAppointmentId = ref(null)
const selectedClientName = ref('')
const selectedTherapistName = ref('')
const selectedDate = ref('')
const selectedTime = ref('')
const servicespromos = ref('')

// New Appointment Form Inputs
const newAppointment_Client = ref('')
const newAppointment_Therapist = ref('')
const newAppointment_Time = ref('')
const appointmentDate = new DateFormatter('en-US', { dateStyle: 'long' })

// Edit Appointment Form Inputs
const editAppointment_Therapist = ref('')
const editAppointment_Time = ref('')

// For Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Calendar placeholder value (for both new and edit)
const value = ref(null)

// -------- Fetching Data from the Database --------
const { data: appointments, error, refresh } = await useFetch('/api/appointments')

// -------- Computed Properties --------

//PAGINATION
function handlePageChange(newPage) {
  currentPage.value = newPage;
}

// Options for filter dropdown
const filterOptions = computed(() => [
  { value: 'today', label: 'Today' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'all', label: 'All' }
])

// Filtering logic (make sure your API response matches these field names)
// If the fetched appointments array is not yet ready, return an empty array.
const filteredAppointments = computed(() => {
  const currentDate = new Date()
  if (!appointments.value) return []

  return appointments.value.filter(appointment => {
    // Date filter (assuming appointment.date is in ISO format)
    let passesDateFilter = true
    const appointmentDateObj = new Date(appointment.date)
    switch (selectedFilter.value) {
      case 'today':
        passesDateFilter = appointmentDateObj.toDateString() === currentDate.toDateString()
        break
      case 'thisWeek': {
        const startOfWeek = new Date(currentDate)
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
        const endOfWeek = new Date(currentDate)
        endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()))
        passesDateFilter = appointmentDateObj >= startOfWeek && appointmentDateObj <= endOfWeek
        break
      }
      case 'thisMonth':
        passesDateFilter =
          appointmentDateObj.getFullYear() === currentDate.getFullYear() &&
          appointmentDateObj.getMonth() === currentDate.getMonth()
        break
      default:
        passesDateFilter = true
    }

    // Client and therapist text search filters
    const passesClientSearch =
      !searchClient.value.trim() ||
      appointment.clientname.toLowerCase().includes(searchClient.value.toLowerCase())
    const passesTherapistSearch =
      !searchTherapist.value.trim() ||
      appointment.therapistname.toLowerCase().includes(searchTherapist.value.toLowerCase())

    return passesDateFilter && passesClientSearch && passesTherapistSearch
  })
})

// -------- Functions --------

// When a user clicks on an appointment row, fill in the detail panel for editing.
const selectAppointment = (appointment) => {
  selectedAppointmentId.value = appointment.id
  selectedClientName.value = appointment.clientname
  selectedTherapistName.value = appointment.therapistname
  selectedDate.value = appointment.date
  selectedTime.value = appointment.time
  servicespromos.value = appointment.servicespromos
}

// Pagination function (if you implement slicing on the backend or via computed slicing)
const onPageChange = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) currentPage.value = newPage
}

// Tab change handler
const tabChanged = (value) => {
  activeTab.value = value
}

// Validate form inputs before submission (both for new and edit forms)
const validateForm = () => {
  if (isNewAppointmentModalOpen.value) {
    return (
      newAppointment_Client.value.trim() !== '' &&
      newAppointment_Therapist.value.trim() !== '' &&
      value.value !== null &&
      newAppointment_Time.value.trim() !== '' &&
      (selectedServices.value.some((s) => s.trim() !== '') ||
        selectedPromos.value.some((p) => p.trim() !== ''))
    )
  } else if (isEditModalOpen.value) {
    return (
      editAppointment_Therapist.value.trim() !== '' &&
      editAppointment_Time.value.trim() !== '' &&
      value.value !== null &&
      (selectedServices.value.some((s) => s.trim() !== '') ||
        selectedPromos.value.some((p) => p.trim() !== ''))
    )
  }
  return false
}

// Create a new appointment by posting data to your API
const submitAppointmentForm = async () => {
  if (validateForm()) {
    const newAppointment = {
      client: newAppointment_Client.value,
      therapist: newAppointment_Therapist.value,
      date: value.value, // ensure the date is in the expected format (e.g., ISO string)
      time: newAppointment_Time.value,
      servicespromos: selectedServices.value.join(', ') // adjust as needed
    }
    const { error } = await useFetch('/api/appointments', {
      method: 'POST',
      body: newAppointment
    })
    if (error.value) {
      alert('Failed to book appointment.')
    } else {
      alert('Successfully booked an appointment!')
      // Refresh the appointments list after insertion
      await refresh()
      // Reset form values
      newAppointment_Client.value = ''
      newAppointment_Therapist.value = ''
      newAppointment_Time.value = ''
      value.value = null
      selectedServices.value = ['']
      selectedPromos.value = ['']
      isNewAppointmentModalOpen.value = false
    }
  } else {
    alert('Fill all necessary information first.')
  }
}

// Edit an existing appointment by sending an update to your API
const submitExistingAppointmentForm = async () => {
  if (validateForm()) {
    const updatedAppointment = {
      id: selectedAppointmentId.value,
      therapist: editAppointment_Therapist.value,
      time: editAppointment_Time.value,
      date: value.value,
      servicespromos: selectedServices.value.join(', ')
    }
    const { error } = await useFetch(`/api/appointment/appointment`, {
      method: 'PUT',
      body: updatedAppointment
    })
    if (error.value) {
      alert('Failed to update appointment.')
    } else {
      alert('Successfully edited the appointment!')
      await refresh()
      selectedClientName.value = ''
      editAppointment_Therapist.value = ''
      editAppointment_Time.value = ''
      value.value = null
      selectedServices.value = ['']
      selectedPromos.value = ['']
      isEditModalOpen.value = false
    }
  } else {
    alert('Fill all necessary information first.')
  }
}

// Modal closing functions
const closeEditAppointmentModal = () => {
  selectedServices.value = ['']
  selectedPromos.value = ['']
  isEditModalOpen.value = false
}

const closeNewAppointmentModal = () => {
  selectedServices.value = ['']
  selectedPromos.value = ['']
  isNewAppointmentModalOpen.value = false
}

// Add more service or promo inputs dynamically
const addService = () => {
  selectedServices.value.push('')
}

const addPromo = () => {
  selectedPromos.value.push('')
}


// Fetch clients and therapists from the API on mount
onMounted(async () => {
  const { data: clientsData } = await useFetch('/api/appointment/clients/clients')
  console.log('Clients Data:', clientsData.value)
  clients.value = clientsData.value || []

  const { data: therapistsData } = await useFetch('/api/appointment/therapists/therapists')
  console.log('Therapists Data:', therapistsData.value)
  therapists.value = therapistsData.value || []
})



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
    height: auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 1000px;
    max-width: 90%;
  }

  .modal-action-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

  .row {
    display: flex;
    flex-direction: row;
    padding-bottom:10px
  }

  .label {
    padding-right: 8px;
    padding-left:8px;
    padding-top: 8px;
    width: 280px;
  }

  textarea {
    height:150px;
    padding-bottom: 8px;
  }

</style>