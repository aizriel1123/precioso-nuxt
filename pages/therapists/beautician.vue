<script setup>
import { ref, computed, onMounted } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import NavBar from '~/components/Navbar.vue'

// State management
const therapists = ref([])
const selectedTherapist = ref(null)
const isEditing = ref(false)
const showNewTherapistDialog = ref(false)
const showSuccessDialog = ref(false)
const showTransactions = ref(false)
const sortOrder = ref('')
const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = 12
const isLoading = ref(true)

// New therapist template matching Prisma schema
const newTherapist = ref({
  first_name: '',
  last_name: '',
  dob: '',
  contactinfo: '',
  schedule: '',
  gender_id: '',
  status_id: ''
})

// Fetch therapists from API
const fetchTherapists = async () => {
  try {
    isLoading.value = true
    const response = await fetch('/api/therapist/therapist')
    if (!response.ok) throw new Error('Failed to fetch therapists')
    const data = await response.json()
    therapists.value = data
  } catch (error) {
    console.error('Error fetching therapists:', error)
  } finally {
    isLoading.value = false
  }
}

const addNewTherapist = async () => {
  try {
    if (!newTherapist.value.first_name || !newTherapist.value.last_name) {
      alert('First name and last name are required')
      return
    }

    const formattedDateOfBirth = newTherapist.value.dob 
      ? new Date(newTherapist.value.dob + 'T00:00:00.000Z').toISOString()
      : null

    const payload = {
      first_name: newTherapist.value.first_name.trim(),
      last_name: newTherapist.value.last_name.trim(),
      dob: formattedDateOfBirth,
      contactinfo: newTherapist.value.contactinfo.trim(),
      schedule: newTherapist.value.schedule.trim(),
      gender_id: newTherapist.value.gender_id,
      status_id: newTherapist.value.status_id
    }

    const response = await fetch('/api/therapist/therapist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) throw new Error('Failed to add new therapist')
    await fetchTherapists()
    showNewTherapistDialog.value = false
    resetNewTherapist()
  } catch (error) {
    console.error('Error adding new therapist:', error)
    alert(error.message || 'Failed to add new therapist. Please try again.')
  }
}

// Reset new therapist object
const resetNewTherapist = () => {
  newTherapist.value = {
    first_name: '',
    last_name: '',
    dob: '',
    contactinfo: '',
    schedule: '',
    gender_id: '',
    status_id: ''
  }
}

// Delete therapist
const deleteTherapist = async () => {
  if (!selectedTherapist.value) return
  
  try {
    const response = await fetch(`/api/therapist/therapist/${selectedTherapist.value.id}`, {
      method: 'DELETE'
    })

    if (!response.ok) throw new Error('Failed to delete therapist')
    
    await fetchTherapists()
    selectedTherapist.value = null
    showSuccessDialog.value = true
  } catch (error) {
    console.error('Error deleting therapist:', error)
    alert('Failed to delete therapist. Please try again.')
  }
}

// Update therapist
const saveChanges = async () => {
  try {
    const response = await fetch(`/api/therapist/therapist/${selectedTherapist.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: selectedTherapist.value.first_name,
        last_name: selectedTherapist.value.last_name,
        dob: selectedTherapist.value.dob,
        contactinfo: selectedTherapist.value.contactinfo,
        schedule: selectedTherapist.value.schedule,
        gender_id: selectedTherapist.value.gender_id,
        status_id: selectedTherapist.value.status_id
      })
    })

    if (!response.ok) throw new Error('Failed to update therapist')
    
    await fetchTherapists()
    isEditing.value = false
    showSuccessDialog.value = true
  } catch (error) {
    console.error('Error updating therapist:', error)
    alert('Failed to update therapist. Please try again.')
  }
}

// Format transaction history from Prisma schema
const formatTransactionHistory = (transactions) => {
  return transactions.map(transaction => ({
    date: new Date(transaction.date).toLocaleDateString(),
    time: new Date(transaction.date).toLocaleTimeString(),
    client: `${transaction.Client.first_name} ${transaction.Client.last_name}`,
    totalSale: transaction.Appointment.reduce((total, apt) => total + Number(apt.Service.price), 0),
    modeOfPayment: transaction.ModeOfPayment.mode,
    servicesProvided: transaction.Appointment.map(apt => apt.Service.name).join(', ')
  }))
}

// Computed properties for filtering and sorting
const filteredAndSortedTherapists = computed(() => {
  if (!therapists.value.length) return []
  
  let result = [...therapists.value]

  if (searchTerm.value) {
    result = result.filter(therapist => 
      therapist.first_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      therapist.last_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      therapist.id.toString().includes(searchTerm.value)
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
  Math.ceil(filteredAndSortedTherapists.value.length / itemsPerPage)
)

const paginatedTherapists = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAndSortedTherapists.value.slice(start, end)
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

const selectTherapist = (therapist) => {
  selectedTherapist.value = therapist
}

const startEditing = () => {
  isEditing.value = true
}

// Fetch data on component mount
onMounted(() => {
  fetchTherapists()
})
</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <NavBar/>
    <div class="flex justify-between items-center mt-8 mb-8">
      <h1 class="text-2xl font-bold">All Therapists</h1>
      <div class="flex gap-4">
        <Input 
          v-model="searchTerm"
          placeholder="Search therapists..." 
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
        <Button @click="showNewTherapistDialog = true">Add New Therapist</Button>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- Therapists Table -->
      <div class="col-span-2">
        <div class="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Therapist ID</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact Information</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="therapist in paginatedTherapists" 
                :key="therapist.id"
                :class="{ 'bg-amber-100': selectedTherapist?.id === therapist.id }"
                @click="selectTherapist(therapist)"
                class="cursor-pointer hover:bg-gray-100"
              >
                <TableCell>{{ therapist.id }}</TableCell>
                <TableCell>{{ therapist.last_name }}</TableCell>
                <TableCell>{{ therapist.first_name }}</TableCell>
                <TableCell>{{ therapist.schedule }}</TableCell>
                <TableCell>{{ therapist.TherapistStatus?.status }}</TableCell>
                <TableCell>{{ therapist.contactinfo }}</TableCell>
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

      <!-- Therapist Info Panel -->
      <div v-if="selectedTherapist" class="border rounded-lg p-6 bg-white shadow">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Therapist Info</h2>
          <div class="flex gap-2">
            <Button @click="startEditing" v-if="!isEditing">Edit</Button>
            <Button 
              variant="destructive" 
              @click="deleteTherapist"
              v-if="!isEditing"
            >
              Delete Therapist
            </Button>
          </div>
        </div>

        <!-- Therapist Details -->
        <div class="space-y-4">
          <div v-if="!isEditing">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="font-medium">First Name</p>
                <p>{{ selectedTherapist.first_name }}</p>
              </div>
              <div>
                <p class="font-medium">Last Name</p>
                <p>{{ selectedTherapist.last_name }}</p>
              </div>
              <div>
                <p class="font-medium">Schedule</p>
                <p>{{ selectedTherapist.schedule }}</p>
              </div>
              <div>
                <p class="font-medium">Status</p>
                <p>{{ selectedTherapist.TherapistStatus?.status }}</p>
              </div>
              <div>
                <p class="font-medium">Gender</p>
                <p>{{ selectedTherapist.Gender?.gender }}</p>
              </div>
              <div>
                <p class="font-medium">Contact Information</p>
                <p>{{ selectedTherapist.contactinfo }}</p>
              </div>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="font-medium">First Name</label>
                <Input v-model="selectedTherapist.first_name" />
              </div>
              <div>
                <label class="font-medium">Last Name</label>
                <Input v-model="selectedTherapist.last_name" />
              </div>
              <div>
                <label class="font-medium">Schedule</label>
                <Input v-model="selectedTherapist.schedule" />
              </div>
              <div>
                <label class="font-medium">Status</label>
                <Select v-model="selectedTherapist.status_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem :value="1">Available</SelectItem>
                    <SelectItem :value="2">Unavailable</SelectItem>
                    <SelectItem :value="3">Occupied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label class="font-medium">Gender</label>
                <Select v-model="selectedTherapist.gender_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem :value="1">Male</SelectItem>
                    <SelectItem :value="2">Female</SelectItem>
                    <SelectItem :value="3">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label class="font-medium">Contact Information</label>
                <Input v-model="selectedTherapist.contactinfo" />
              </div>
            </div>

            <div class="flex justify-end gap-4">
              <Button @click="isEditing = false" variant="outline">Cancel</Button>
              <Button @click="saveChanges">Save changes</Button>
            </div>
          </div>

          <div class="mt-4">
            <Button 
              @click="showTransactions = true" 
              variant="outline"
              class="w-full"
            >
              View Booking History
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- New Therapist Dialog -->
    <Dialog :open="showNewTherapistDialog" @update:open="showNewTherapistDialog = false">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Therapist</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="font-medium">First Name</label>
              <Input v-model="newTherapist.first_name" />
            </div>
            <div>
              <label class="font-medium">Last Name</label>
              <Input v-model="newTherapist.last_name" />
            </div>
          </div>
          <div>
            <label class="font-medium">Date of Birth</label>
            <Input type="date" v-model="newTherapist.dob" />
          </div>
          <div>
            <label class="font-medium">Schedule</label>
            <Input v-model="newTherapist.schedule" />
          </div>
          <div>
            <label class="font-medium">Contact Information</label>
            <Input v-model="newTherapist.contactinfo" />
          </div>
          <div>
            <label class="font-medium">Gender</label>
            <Select v-model="newTherapist.gender_id">
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="1">Male</SelectItem>
                <SelectItem :value="2">Female</SelectItem>
                <SelectItem :value="3">N/A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div class="flex justify-end gap-4">
          <Button @click="showNewTherapistDialog = false" variant="outline">Cancel</Button>
          <Button @click="addNewTherapist">Add Therapist</Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Transaction History Dialog -->
    <Dialog :open="showTransactions" @update:open="showTransactions = false">
      <DialogContent class="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            Booking History for {{ selectedTherapist?.first_name }} {{ selectedTherapist?.last_name }}
          </DialogTitle>
        </DialogHeader>
        <div class="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="transaction in formatTransactionHistory(selectedTherapist?.Transaction || [])" :key="transaction.date">
                <TableCell>{{ transaction.date }}</TableCell>
                <TableCell>{{ transaction.time }}</TableCell>
                <TableCell>{{ transaction.client }}</TableCell>
                <TableCell>{{ transaction.servicesProvided }}</TableCell>
                <TableCell>{{ transaction.modeOfPayment }}</TableCell>
                <TableCell>₱{{ transaction.totalSale.toFixed(2) }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Success Dialog -->
    <Dialog :open="showSuccessDialog" @update:open="showSuccessDialog = false">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Success</DialogTitle>
        </DialogHeader>
        <p>Operation completed successfully!</p>
        <div class="flex justify-end mt-4">
          <Button @click="showSuccessDialog = false">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
}
</style>
