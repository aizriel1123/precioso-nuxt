<script setup>
import { ref, computed } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import NavBar from '~/components/Navbar.vue'

const clients = ref([
  {
    id: '21324134',
    firstName: 'Ahkmed',
    lastName: 'Abdul',
    dateOfBirth: '1-1-2000',
    gender: 'Male',
    email: 'aabul@example.com',
    contactInfo: '0909090990',
    bookingHistory: [
      {
        date: '2024-01-01',
        time: '10:00 AM',
        assignedTherapist: 'John Doe',
        totalSale: 150.00,
        modeOfPayment: 'Credit Card',
        productsAvailed: 'Massage, Facial'
      }
    ]
  },
  {
    id: '21324135',
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '15-5-1995',
    gender: 'Female',
    email: 'sjohnson@example.com',
    contactInfo: '0909090991',
    bookingHistory: [
      {
        date: '2024-01-05',
        time: '2:30 PM',
        assignedTherapist: 'Jane Smith',
        totalSale: 200.00,
        modeOfPayment: 'Cash',
        productsAvailed: 'Deep Tissue Massage'
      }
    ]
  },
  {
    id: '21324136',
    firstName: 'Michael',
    lastName: 'Lee',
    dateOfBirth: '22-3-1990',
    gender: 'Male',
    email: 'mlee@example.com',
    contactInfo: '0909090992',
    bookingHistory: [
      {
        date: '2024-02-10',
        time: '11:00 AM',
        assignedTherapist: 'Emily White',
        totalSale: 120.00,
        modeOfPayment: 'Debit Card',
        productsAvailed: 'Facial'
      },
      {
        date: '2024-02-15',
        time: '4:00 PM',
        assignedTherapist: 'John Doe',
        totalSale: 180.00,
        modeOfPayment: 'Cash',
        productsAvailed: 'Body Scrub'
      }
    ]
  },
  {
    id: '21324137',
    firstName: 'Jessica',
    lastName: 'Miller',
    dateOfBirth: '10-11-1985',
    gender: 'Female',
    email: 'jmiller@example.com',
    contactInfo: '0909090993',
    bookingHistory: [
      {
        date: '2024-03-05',
        time: '1:00 PM',
        assignedTherapist: 'Anna Taylor',
        totalSale: 250.00,
        modeOfPayment: 'Credit Card',
        productsAvailed: 'Full Body Massage'
      }
    ]
  },
  {
    id: '21324138',
    firstName: 'David',
    lastName: 'Garcia',
    dateOfBirth: '8-8-1980',
    gender: 'Male',
    email: 'dgarcia@example.com',
    contactInfo: '0909090994',
    bookingHistory: [
      {
        date: '2024-01-20',
        time: '3:00 PM',
        assignedTherapist: 'Emily White',
        totalSale: 170.00,
        modeOfPayment: 'Credit Card',
        productsAvailed: 'Back Massage'
      },
      {
        date: '2024-02-22',
        time: '10:30 AM',
        assignedTherapist: 'Jane Smith',
        totalSale: 90.00,
        modeOfPayment: 'Cash',
        productsAvailed: 'Manicure'
      }
    ]
  },
  {
    id: '21324139',
    firstName: 'Olivia',
    lastName: 'Hernandez',
    dateOfBirth: '30-6-1993',
    gender: 'Female',
    email: 'ohernandez@example.com',
    contactInfo: '0909090995',
    bookingHistory: [
      {
        date: '2024-03-01',
        time: '12:00 PM',
        assignedTherapist: 'Anna Taylor',
        totalSale: 160.00,
        modeOfPayment: 'Cash',
        productsAvailed: 'Facial, Manicure'
      }
    ]
  },
  {
    id: '21324140',
    firstName: 'James',
    lastName: 'Smith',
    dateOfBirth: '25-12-1988',
    gender: 'Male',
    email: 'jsmith@example.com',
    contactInfo: '0909090996',
    bookingHistory: [
      {
        date: '2024-02-28',
        time: '9:30 AM',
        assignedTherapist: 'Emily White',
        totalSale: 200.00,
        modeOfPayment: 'Debit Card',
        productsAvailed: 'Swedish Massage'
      }
    ]
  },
  {
    id: '21324141',
    firstName: 'Sophia',
    lastName: 'Johnson',
    dateOfBirth: '14-7-1991',
    gender: 'Female',
    email: 'sjohnson92@example.com',
    contactInfo: '0909090997',
    bookingHistory: [
      {
        date: '2024-03-10',
        time: '4:00 PM',
        assignedTherapist: 'Jane Smith',
        totalSale: 210.00,
        modeOfPayment: 'Credit Card',
        productsAvailed: 'Pedicure, Facial'
      }
    ]
  },
  {
    id: '21324142',
    firstName: 'Liam',
    lastName: 'Brown',
    dateOfBirth: '18-2-1992',
    gender: 'Male',
    email: 'lbrown@example.com',
    contactInfo: '0909090998',
    bookingHistory: [
      {
        date: '2024-03-15',
        time: '5:30 PM',
        assignedTherapist: 'Anna Taylor',
        totalSale: 130.00,
        modeOfPayment: 'Cash',
        productsAvailed: 'Deep Tissue Massage'
      }
    ]
  },
  {
    id: '21324143',
    firstName: 'Mia',
    lastName: 'Davis',
    dateOfBirth: '27-9-1989',
    gender: 'Female',
    email: 'mdavis@example.com',
    contactInfo: '0909090999',
    bookingHistory: [
      {
        date: '2024-03-20',
        time: '1:30 PM',
        assignedTherapist: 'Emily White',
        totalSale: 140.00,
        modeOfPayment: 'Credit Card',
        productsAvailed: 'Manicure, Pedicure'
      }
    ]
  },
  {
    id: '21324144',
    firstName: 'Noah',
    lastName: 'Wilson',
    dateOfBirth: '5-10-1987',
    gender: 'Male',
    email: 'nwilson@example.com',
    contactInfo: '0909091000',
    bookingHistory: [
      {
        date: '2024-03-25',
        time: '3:15 PM',
        assignedTherapist: 'John Doe',
        totalSale: 155.00,
        modeOfPayment: 'Debit Card',
        productsAvailed: 'Full Body Massage'
      }
    ]
  }
])

// State management
const selectedClient = ref(null)
const isEditing = ref(false)
const showNewClientDialog = ref(false)
const showSuccessDialog = ref(false)
const showTransactions = ref(false)
const sortOrder = ref('')
const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = 12

// New client template
const newClient = ref({
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  email: '',
  contactInfo: '',
  bookingHistory: []
})

// Computed properties for filtering and sorting
const filteredAndSortedClients = computed(() => {
  let result = [...clients.value]

  // Apply search filter
  if (searchTerm.value) {
    result = result.filter(client => 
      client.firstName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      client.id.includes(searchTerm.value)
    )
  }

  // Apply sorting
  switch (sortOrder.value) {
    case 'id-asc':
      result.sort((a, b) => a.id.localeCompare(b.id))
      break
    case 'id-desc':
      result.sort((a, b) => b.id.localeCompare(a.id))
      break
    case 'name-asc':
      result.sort((a, b) => a.lastName.localeCompare(b.lastName))
      break
    case 'name-desc':
      result.sort((a, b) => b.lastName.localeCompare(a.lastName))
      break
  }

  return result
})

// Pagination
const totalPages = computed(() => 
  Math.ceil(filteredAndSortedClients.value.length / itemsPerPage)
)

const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAndSortedClients.value.slice(start, end)
})

// Methods
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

const addNewClient = () => {
  const newId = Math.max(...clients.value.map(c => parseInt(c.id))) + 1
  const clientToAdd = {
    ...newClient.value,
    id: newId.toString(),
    bookingHistory: []
  }
  clients.value.push(clientToAdd)
  showNewClientDialog.value = false
  newClient.value = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    contactInfo: '',
    bookingHistory: []
  }
}

const selectClient = (client) => {
  selectedClient.value = client
}

const startEditing = () => {
  isEditing.value = true
}

const saveChanges = () => {
  const index = clients.value.findIndex(c => c.id === selectedClient.value.id)
  if (index !== -1) {
    clients.value[index] = { ...selectedClient.value }
  }
  isEditing.value = false
  showSuccessDialog.value = true
}
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
                <TableCell>{{ client.lastName }}</TableCell>
                <TableCell>{{ client.firstName }}</TableCell>
                <TableCell>{{ client.dateOfBirth }}</TableCell>
                <TableCell>{{ client.gender }}</TableCell>
                <TableCell>{{ client.contactInfo }}</TableCell>
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
                <label class="font-medium">Email</label>
                <Input v-model="selectedClient.email" />
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
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="font-medium">First Name</label>
            <Input v-model="newClient.firstName" />
          </div>
          <div>
            <label class="font-medium">Last Name</label>
            <Input v-model="newClient.lastName" />
          </div>
          <div>
            <label class="font-medium">Birthdate</label>
            <Input v-model="newClient.dateOfBirth" />
          </div>
          <div>
            <label class="font-medium">Gender</label>
            <Input v-model="newClient.gender" />
          </div>
          <div>
            <label class="font-medium">Email</label>
            <Input v-model="newClient.email" />
          </div>
          <div>
            <label class="font-medium">Contact Information</label>
            <Input v-model="newClient.contactInfo" />
          </div>
        </div>
        <div class="flex justify-end gap-4 mt-4">
          <Button @click="showNewClientDialog = false" variant="outline">Cancel</Button>
          <Button @click="addNewClient">Add Client</Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Success Dialog -->
    <Dialog :open="showSuccessDialog" @update:open="showSuccessDialog = false">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Client Information Successfully Updated</DialogTitle>
        </DialogHeader>
        <p>All changes to the client's information have been saved and are now up-to-date.</p>
        <div class="flex justify-end">
          <Button @click="showSuccessDialog = false">Done</Button>
        </div>
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