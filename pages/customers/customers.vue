<script setup>
import { ref, computed, onMounted } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import NavBar from '~/components/Navbar.vue'
import { Calendar } from "@/components/ui/calendar"

import { Calendar as CalendarIcon } from 'lucide-vue' // Using Lucide's Calendar icon


const showDatePicker = ref(false);
const formattedDate = computed(() => {
  return newClient.value.dateOfBirth ? newClient.value.dateOfBirth.toLocaleDateString() : '';
});

const selectDate = (date) => {
  newClient.value.dateOfBirth = date;
  showDatePicker.value = false; // Close the date picker after selection
};


// State management
const clients = ref([])
const selectedClient = ref(null)
const isEditing = ref(false)
const showNewClientDialog = ref(false)
const showSuccessDialog = ref(false)
const showTransactions = ref(false)
const sortOrder = ref('')
const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = 12
const isLoading = ref(true)

// New client template matching Prisma schema
const newClient = ref({
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender_id: '',
  contact_info: ''
})

// Fetch clients from API
const fetchClients = async () => {
  try {
    isLoading.value = true
    const response = await fetch('/api/client/client'); // Updated endpoint
    if (!response.ok) throw new Error('Failed to fetch clients');
    const data = await response.json();
    clients.value = data;
  } catch (error) {
    console.error('Error fetching clients:', error);
  } finally {
    isLoading.value = false;
  }
}

const addNewClient = async () => {
  try {
    // Form validation
    if (!newClient.value.firstName || !newClient.value.lastName) {
      alert('First name and last name are required');
      return;
    }

    // Format date to ISO string at midnight UTC
    const formattedDateOfBirth = newClient.value.dateOfBirth 
      ? new Date(newClient.value.dateOfBirth + 'T00:00:00.000Z').toISOString()
      : null;

    const payload = {
      first_name: newClient.value.firstName.trim(),
      last_name: newClient.value.lastName.trim(),
      dob: formattedDateOfBirth, // This will be an ISO string at midnight UTC
      gender_id: newClient.value.gender_id,
      contact_info: newClient.value.contact_info.trim()
    };

    console.log('Sending payload:', payload); // For debugging

    const response = await fetch('/api/client/client', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to add new client: ${response.statusText}`);
    }

    const newClientData = await response.json();
    clients.value.push(newClientData);
    resetNewClient();
    showNewClientDialog.value = false;
    await fetchClients();
  } catch (error) {
    console.error('Error adding new client:', error);
    alert(error.message || 'Failed to add new client. Please try again.');
  }
};

// Reset new client object
const resetNewClient = () => {
  newClient.value = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender_id: '',
    contact_info: ''
  };
};

// Update client
const saveChanges = async () => {
  try {
    const response = await fetch(`/api/clients/${selectedClient.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: selectedClient.value.first_name,
        lastName: selectedClient.value.last_name,
        dateOfBirth: selectedClient.value.dob,
        gender_id: selectedClient.value.gender_id,
        contact_info: selectedClient.value.contact_info
      })
    })

    if (!response.ok) throw new Error('Failed to update client')
    
    await fetchClients() // Refresh client list
    isEditing.value = false
    showSuccessDialog.value = true
  } catch (error) {
    console.error('Error updating client:', error)
  }
}

// Format transaction history from Prisma schema
const formatTransactionHistory = (transactions) => {
  return transactions.map(transaction => ({
    date: new Date(transaction.date).toLocaleDateString(),
    time: new Date(transaction.date).toLocaleTimeString(),
    assignedTherapist: `${transaction.Therapist.first_name} ${transaction.Therapist.last_name}`,
    totalSale: transaction.Appointment.reduce((total, apt) => total + Number(apt.Service.price), 0),
    modeOfPayment: transaction.ModeOfPayment.mode,
    productsAvailed: transaction.Appointment.map(apt => apt.Service.name).join(', ')
  }))
}

// Computed properties for filtering and sorting
const filteredAndSortedClients = computed(() => {
  if (!clients.value.length) return []
  
  let result = [...clients.value]

  if (searchTerm.value) {
    result = result.filter(client => 
      client.first_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      client.last_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      client.id.toString().includes(searchTerm.value)
    )
  }

  switch (sortOrder.value) {
    case 'id-asc':
      result.sort((a, b) => a.id - b.id)
      break
    case 'id-desc':
      result.sort((a, b) => b.id - a.id)
      break
    case 'name-asc':
      result.sort((a, b) => a.last_name.localeCompare(b.last_name))
      break
    case 'name-desc':
      result.sort((a, b) => b.last_name.localeCompare(a.last_name))
      break
  }

  return result
})

const totalPages = computed(() => 
  Math.ceil(filteredAndSortedClients.value.length / itemsPerPage)
)

const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAndSortedClients.value.slice(start, end)
})

// Navigation methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const selectClient = (client) => {
  selectedClient.value = client
}

const startEditing = () => {
  isEditing.value = true
}

// Fetch data on component mount
onMounted(() => {
  fetchClients()
})
</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <NavBar/>
    <div class="flex justify-between items-center mt-8 mb-8">
      <h1 class="text-2xl font-bold">All Clients</h1>
      <div class="flex gap-4">
        <Input 
          v-model="searchTerm"
          placeholder="Search clients..." 
          class="w-64" 
        />
        <Select v-model="sortOrder">
          <SelectTrigger class="w-48">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id-asc">ID: Ascending</SelectItem>
            <SelectItem value="id-desc">ID: Descending</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
        <Button @click="showNewClientDialog = true">Add New Client</Button>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- Clients Table -->
      <div class="col-span-2">
        <div class="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client ID</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Contact Information</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="client in paginatedClients" 
                :key="client.id"
                :class="{ 'bg-amber-100': selectedClient?.id === client.id }"
                @click="selectClient(client)"
                class="cursor-pointer hover:bg-gray-100"
              >
                <TableCell>{{ client.id }}</TableCell>
                <TableCell>{{ client.last_name }}</TableCell>
                <TableCell>{{ client.first_name }}</TableCell>
                <TableCell>{{ new Date(client.dob).toLocaleDateString() }}</TableCell>
                <TableCell>{{ client.Gender?.gender }}</TableCell>
                <TableCell>{{ client.contact_info }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <!-- Pagination -->
          <div class="flex items-center justify-between px-4 py-4 border-t">
            <div class="text-sm text-gray-500">
              Page {{ currentPage }} of {{ totalPages }}
            </div>
            <div class="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                @click="previousPage"
                :disabled="currentPage === 1"
              >
                Previous
              </Button>
              <Button 
                variant="outline"
                size="sm"
                @click="nextPage"
                :disabled="currentPage === totalPages"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Client Info Panel -->
      <div v-if="selectedClient" class="border rounded-lg p-6 bg-white shadow">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Client Info</h2>
          <Button @click="startEditing" v-if="!isEditing">Edit</Button>
        </div>

        <!-- Client Details -->
        <div class="space-y-4">
          <div v-if="!isEditing">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="font-medium">First Name</p>
                <p>{{ selectedClient.firstName }}</p>
              </div>
              <div>
                <p class="font-medium">Last Name</p>
                <p>{{ selectedClient.lastName }}</p>
              </div>
              <div>
                <p class="font-medium">Birthdate</p>
                <p>{{ selectedClient.dateOfBirth }}</p>
              </div>
              <div>
                <p class="font-medium">Gender</p>
                <p>{{ selectedClient.gender }}</p>
              </div>
              <div>
                <p class="font-medium">Email</p>
                <p>{{ selectedClient.email }}</p>
              </div>
              <div>
                <p class="font-medium">Contact Information</p>
                <p>{{ selectedClient.contactInfo }}</p>
              </div>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="font-medium">First Name</label>
                <Input v-model="selectedClient.firstName" />
              </div>
              <div>
                <label class="font-medium">Last Name</label>
                <Input v-model="selectedClient.lastName" />
              </div>
              <div>
                <label class="font-medium">Birthdate</label>
                <Input v-model="selectedClient.dateOfBirth" />
              </div>
              <div>
                <label class="font-medium">Gender</label>
                <Input v-model="selectedClient.gender" />
              </div>
              <div>
                <label class="font-medium">Contact Information</label>
                <Input v-model="selectedClient.contactInfo" />
              </div>
            </div>

            <div class="flex justify-end gap-4">
              <Button @click="isEditing = false" variant="outline">Cancel</Button>
              <Button @click="saveChanges">Save changes</Button>
            </div>
          </div>

          <div class="mt-6">
            <Button @click="showTransactions = true" class="w-full">
              View Booking History
            </Button>
          </div>
        </div>
      </div>
    </div>
    <!-- New Client Dialog -->
    <Dialog :open="showNewClientDialog" @update:open="showNewClientDialog = false">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Client</DialogTitle>
      </DialogHeader>
      <form @submit.prevent="addNewClient" class="space-y-4">
        <Input 
          v-model.trim="newClient.firstName" 
          placeholder="First Name" 
          required
        />
        <Input 
          v-model.trim="newClient.lastName" 
          placeholder="Last Name" 
          required
        />
        <Input 
          v-model="newClient.dateOfBirth" 
          placeholder="Date of Birth" 
          type="date"
        />
        <Select v-model="newClient.gender_id">
          <SelectTrigger>
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Input 
          v-model.trim="newClient.contact_info" 
          placeholder="Contact Information"
        />
        <div class="flex justify-end gap-2 mt-4">
          <Button 
            type="button" 
            variant="outline" 
            @click="showNewClientDialog = false"
          >
            Cancel
          </Button>
          <Button type="submit">Add Client</Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>


    <!-- Booking History Dialog -->
    <Dialog :open="showTransactions" @update:open="showTransactions = false">
      <DialogContent class="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Booking History - {{ selectedClient?.firstName }} {{ selectedClient?.lastName }}</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Assigned Therapist</TableHead>
              <TableHead>Total Sale</TableHead>
              <TableHead>Mode of Payment</TableHead>
              <TableHead>Products Availed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(transaction, index) in selectedClient?.bookingHistory" :key="index">
              <TableCell>{{ transaction.date }}</TableCell>
              <TableCell>{{ transaction.time }}</TableCell>
              <TableCell>{{ transaction.assignedTherapist }}</TableCell>
              <TableCell>${{ transaction.totalSale.toFixed(2) }}</TableCell>
              <TableCell>{{ transaction.modeOfPayment }}</TableCell>
              <TableCell>{{ transaction.productsAvailed }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  </div>
</template>