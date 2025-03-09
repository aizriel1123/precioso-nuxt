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
        <Button variant="ghost" class="button" @click="isNewAppointmentModalOpen=true">Add New Booking</Button>
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
              <!-- Populate empty rows if current row count is les than 10 -->
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
      <h2 class="selected-appointment-title">Appointment Information</h2>
      
      <form id="update_appointment_panel">
        <div class="row">
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
        </div>  

        <div class="row">
        <FormField v-slot="{ componentField }" name="update_time">
          <FormItem>
            <FormLabel>Appointment Date</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Select Date" v-bind="componentField" v-model="selectedDate" disabled/>
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
      </div>

        <FormField v-slot="{ componentField }" name="note">
          <FormLabel class="label">Note</FormLabel>
          <textarea class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" disabled></textarea>
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
          <Button variant="ghost" class="button" type="button" @click="isEditModalOpen=true">Edit Appointment</Button>
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
            <input list="clients" v-model=newAppointment_Client class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Search Client..." />
            <datalist id="clients">
              <option value="Alice Johnson"></option>
              <option value="Bob Brown"></option>
              <option value="Charlie Davis"></option>
              <option value="Dana Evans"></option>
              <option value="Eli Fox"></option>
              <option value="Fiona Green"></option>
              <option value="George Harris"></option>
              <option value="Holly Irwin"></option>
              <option value="Ian James"></option>
              <option value="Jill Kelly"></option>

            </datalist>
          </FormField>

          <FormField v-slot="{ componentField }" name="therapist_name">
              <FormLabel class="label">Select Therapist</FormLabel>
              <input list="therapists" v-model=newAppointment_Therapist class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Search therapist..." />
              <datalist id="therapists">
                <option value="Anna Lee"></option>
                <option value="Ben Wong"></option>
                <option value="Chris Taylor"></option>
              </datalist>
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
            <input list="time" v-model=newAppointment_Time class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Select Time..."  />
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

        <FormField v-slot="{ componentField }" name="note">
            <FormLabel class="label">Note</FormLabel>
            <textarea class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Add a note for this appointment..."></textarea>
          </FormField>

            <!-- Promos/Services -->
              <hr class="mt-5 pb-2 border-t-2">
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
            <input list="clients" v-model="selectedClientName" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Search Client..." disabled/>
          </FormField>

          <FormField v-slot="{ componentField }" name="therapist_name">
            <FormLabel class="label">Select Therapist</FormLabel>
            <input list="therapists" v-model="editAppointment_Therapist" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Search therapist..." />
            <datalist id="therapists">
              <option value="Anna Lee"></option>
              <option value="Ben Wong"></option>
              <option value="Chris Taylor"></option>
            </datalist>
          </FormField>
        </div>

        <div class="row">
          <FormField v-slot="{ componentField }" name="date">
          <FormLabel class="label">Select Date</FormLabel>
              <Popover>
                <PopoverTrigger as-child>
                  <Button variant="outline" :class="cn('w-full justify-start text-left font-normal', 'text-muted-foreground')">
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{ value ? appointmentDate.format(value.toDate(getLocalTimeZone())) : "Pick a date"}} 
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
            <input list="time" v-model="editAppointment_Time" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Select Time..." />
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

        <FormField v-slot="{ componentField }" name="note">
          <FormLabel class="label">Note</FormLabel>
          <textarea class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Edit note..."></textarea>
        </FormField>
        
        <hr class="mt-5 pb-2 border-t-2">
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
import NavBar from '~/components/Navbar.vue';
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Select, SelectContent,  SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Pagination, PaginationEllipsis, PaginationFirst, PaginationLast, PaginationList, PaginationListItem, PaginationNext, PaginationPrev } from '@/components/ui/pagination';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { DateFormatter, getLocalTimeZone, maxDate, minDate } from '@internationalized/date'
  
  //default values when page is opened
  const activeTab = ref('service')
  const selectedFilter = ref('today')

  //For pop ups
  const isEditModalOpen = ref(false)
  const isNewAppointmentModalOpen = ref(false);

  //array for selected service/promo
  const selectedServices = ref([''])
  const selectedPromos = ref([''])

  // Search inputs
  const searchClient = ref('');
  const searchTherapist = ref('');

  //ID, Name and type of chosen row from table
  const selectedAppointmentId = ref(null); 
  const selectedClientName = ref('');
  const selectedTherapistName = ref('');
  const selectedDate = ref('');
  const selectedTime = ref('');
  const servicespromos=ref('')

  //User input in adding new appointment
  const newAppointment_Client = ref('')
  const newAppointment_Therapist = ref('')
  const appointmentDate = new DateFormatter('en-US', {
    dateStyle: 'long',
  })
  const newAppointment_Time=ref('');

  //User input in editing existing appointment
  const editAppointment_Therapist = ref('')
  const editAppointment_Time=ref('');

  //For pagination
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  //Placeholder for calendar value
  const value = ref(null)

  
  //Sample data
  const appointments = ref([
  {
    id: 1,
    clientname: "Alice Johnson",
    therapistname: "Anna Lee",
    date: "December 20, 2024",
    time: "11:00AM",
    servicespromos: "Massage Therapy",
  },
  {
    id: 2,
    clientname: "Bob Brown",
    therapistname: "Anna Lee",
    date: "December 11, 2024",
    time: "10:00AM",
    servicespromos: "Acupuncture",
  },
  {
    id: 3,
    clientname: "Charlie Davis",
    therapistname: "Ben Wong",
    date: "November 21, 2024",
    time: "9:00AM",
    servicespromos: "Physical Therapy",
  },
  {
    id: 4,
    clientname: "Dana Evans",
    therapistname: "Anna Lee",
    date: "November 29, 2024",
    time: "1:00PM",
    servicespromos: "Chiropractic Care",
  },
  {
    id: 5,
    clientname: "Eli Fox",
    therapistname: "Ben Wong",
    date: "November 23, 2024",
    time: "5:00PM",
    servicespromos: "Massage Therapy",
  },
  {
    id: 6,
    clientname: "Fiona Green",
    therapistname: "Chris Taylor",
    date: "November 20, 2024",
    time: "6:00PM",
    servicespromos: "Reflexology",
  },
  {
    id: 7,
    clientname: "George Harris",
    therapistname: "Chris Taylor",
    date: "November 18, 2024",
    time: "12:00PM",
    servicespromos: "Reiki",
  },
  {
    id: 8,
    clientname: "Holly Irwin",
    therapistname: "Chris Taylor",
    date: "November 20, 2024",
    time: "7:30PM",
    servicespromos: "Hot Stone Massage",
  },
  {
    id: 9,
    clientname: "Ian James",
    therapistname: "Ben Wong",
    date: "November 7, 2024",
    time: "1:00PM",
    servicespromos: "Massage Therapy",
  },
  {
    id: 10,
    clientname: "Jill Kelly",
    therapistname: "Ben Wong",
    date: "November 7, 2024",
    time: "1:00PM",
    servicespromos: "Acupuncture",
  },
]);

  //choosing an appointment from table
  const selectAppointment = (appointment) => {
    selectedAppointmentId.value = appointment.id;
    selectedClientName.value = appointment.clientname;
    selectedTherapistName.value = appointment.therapistname;
    selectedDate.value = appointment.date;
    selectedTime.value = appointment.time;
    servicespromos.value = appointment.servicespromos;
  };

  //Options for filter
  const filterOptions = computed(() => {
  return [
      { value: 'today', label: 'Today' },
      { value: 'thisWeek', label: 'This Week' },
      { value: 'thisMonth', label: 'This Month' },
      { value: 'all', label: 'All' }
        ];
  });

  //Convert to format that js can use (for comparison)
  function parseDate(dateString) {
    const [month, day, year] = dateString.split(' ');
    return new Date(`${year}-${month}-${day}`);
  }

  //Filter logic
  const filteredAppointments = computed(() => {
  const currentDate = new Date();
  return appointments.value.filter(appointment => {
    
    // Apply date filter
    let passesDateFilter = true;
    switch (selectedFilter.value) {
      case 'today':
        passesDateFilter = parseDate(appointment.date).toDateString() === currentDate.toDateString();
        break;
      case 'thisWeek':
        const weekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
        const weekEnd = new Date(currentDate.setDate(currentDate.getDate() + (6 - currentDate.getDay())));
        passesDateFilter = parseDate(appointment.date) >= weekStart && parseDate(appointment.date) <= weekEnd;
        break;
      case 'thisMonth':
        passesDateFilter = parseDate(appointment.date).getFullYear() === currentDate.getFullYear()
          && parseDate(appointment.date).getMonth() === currentDate.getMonth();
        break;
    }

// Apply client search
const passesClientSearch = !searchClient.value.trim() || appointment.clientname.toLowerCase().includes(searchClient.value.toLowerCase());

// Apply therapist search
const passesTherapistSearch = !searchTherapist.value.trim() || appointment.therapistname.toLowerCase().includes(searchTherapist.value.toLowerCase());

return passesDateFilter && passesClientSearch && passesTherapistSearch;
});
});

  //For Pagination (not working yet)
  const onPageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages.value) currentPage.value = newPage;
  };
  
  //Checks what tab is opened
  const tabChanged = (value) => {
  activeTab.value = value;
}

  //Make sure all inputs are filled up before exiting popup
  const validateForm = () => {

    if(isNewAppointmentModalOpen.value === true){
      return (
        newAppointment_Client.value.trim() !== '' &&
        newAppointment_Therapist.value.trim() !== '' &&
        value.value !== null &&
        newAppointment_Time.value.trim() !== '' &&
        (selectedServices.value.some(service => service.trim() !== '') || selectedPromos.value.some(promo => promo.trim() !== ''))
      )
      }
      else if (isEditModalOpen.value === true){
        return (
        editAppointment_Therapist.value.trim() !== '' &&
        editAppointment_Time.value.trim() !== '' &&
        value.value !== null &&
        (selectedServices.value.some(service => service.trim() !== '') || selectedPromos.value.some(promo => promo.trim() !== ''))
      )
      }
    }

  // Function for form submission (NEW)
  const submitAppointmentForm = () => {
    if (validateForm()) {
      //Add db logic    

      //Reset values
      newAppointment_Client.value = '';
      newAppointment_Therapist.value = '';
      newAppointment_Time.value = '';
      value.value='';
      selectedServices.value = [''];
      selectedPromos.value=['']
      
      alert('Successfully booked an appointment!');

      // Close modal after submission
      isNewAppointmentModalOpen.value = false
    } else {  
      alert('Fill all necessary information first.');
    }
  }

  // Function for form submission (EXISTING)
  const submitExistingAppointmentForm = () => {
    if (validateForm()) {
      //Add db logic    

      //Reset values
      selectedClientName.value = '';
      editAppointment_Therapist.value = '';
      editAppointment_Time.value = '';
      value.value='';
      selectedServices.value = [''];
      selectedPromos.value=['']

      alert('Successfully edited the appointment!');

      // Close modal after submission
      isEditModalOpen = false
    } else {  
      alert('Fill all necessary information first.');
    }

  };

  const closeEditAppointmentModal = () => {
    selectedServices.value = [''];
    selectedPromos.value=['']
    isEditModalOpen.value=false
  }

  const closeNewAppointmentModal = () => {
    selectedServices.value = [''];
    selectedPromos.value=['']
    isNewAppointmentModalOpen.value=false
  }

// Function to add a new service input
function addService() {
  selectedServices.value.push('')
}

// Function to add a new promo input
function addPromo() {
  selectedPromos.value.push('')
}
  
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