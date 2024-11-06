<!--Suppliers Page-->

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import NavBar from '~/components/Navbar.vue'

// State management
const suppliers = ref([])
const selectedSupplier = ref(null)
const isEditing = ref(false)
const showNewSupplierDialog = ref(false)
const showSuccessDialog = ref(false)
const showProducts = ref(false)
const sortOrder = ref('')
const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = 12
const isLoading = ref(true)

// New supplier template
const newSupplier = ref({
  first_name: '',
  last_name: '',
  dob: '',
  address: '',
  product: '',
  email: '',
  contact_information: ''
})

// Fetch suppliers from API
const fetchSuppliers = async () => {
  try {
    isLoading.value = true
    const response = await fetch('/api/supplier/all')
    if (!response.ok) throw new Error('Failed to fetch suppliers')
    const data = await response.json()
    suppliers.value = data
  } catch (error) {
    console.error('Error fetching suppliers:', error)
  } finally {
    isLoading.value = false
  }
}

const addNewSupplier = async () => {
  try {
    if (!newSupplier.value.first_name || !newSupplier.value.last_name) {
      alert('First name and last name are required')
      return
    }

    const formattedDateOfBirth = newSupplier.value.dob 
      ? new Date(newSupplier.value.dob + 'T00:00:00.000Z').toISOString()
      : null

    const payload = {
      first_name: newSupplier.value.first_name.trim(),
      last_name: newSupplier.value.last_name.trim(),
      dob: formattedDateOfBirth,
      address: newSupplier.value.address.trim(),
      product: newSupplier.value.product.trim(),
      email: newSupplier.value.email.trim(),
      contact_information: newSupplier.value.contact_information.trim()
    }

    const response = await fetch('/api/supplier/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) throw new Error('Supplier added successfully!')
    await fetchSuppliers()
    showNewSupplierDialog.value = false
    resetNewSupplier()
    alert('Supplier added successfully!');
  } catch (error) {
    console.error('Error adding new supplier:', error)
    alert(error.message || 'Failed to add new supplier. Please try again.')
  }
}

// Reset new supplier object
const resetNewSupplier = () => {
  newSupplier.value = {
    first_name: '',
    last_name: '',
    dob: '',
    address: '',
    product: '',
    email: '',
    contact_information: ''
  }
}

// Delete supplier
const deleteSupplier = async () => {
  if (!selectedSupplier.value) return
  
  try {
    const response = await fetch(`/api/supplier/${selectedSupplier.value.id}`, {
      method: 'DELETE'
    })

    if (!response.ok) throw new Error('Failed to delete supplier')
    
    await fetchSuppliers()
    selectedSupplier.value = null
    alert('Supplier deleted successfully!');
    showSuccessDialog.value = true
  } catch (error) {
    console.error('Error deleting supplier:', error)
    alert('Failed to delete supplier. Please try again.')
  }
}

// Update supplier
const saveChanges = async () => {
  try {
    const response = await fetch(`/api/supplier/${selectedSupplier.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: selectedSupplier.value.first_name,
        last_name: selectedSupplier.value.last_name,
        dob: selectedSupplier.value.dob,
        address: selectedSupplier.value.address,
        product: selectedSupplier.value.product,
        email: selectedSupplier.value.email,
        contact_information: selectedSupplier.value.contact_information
      })
    })

    if (!response.ok) throw new Error('Failed to update supplier')
    
    await fetchSuppliers()
    isEditing.value = false
    alert('Supplier updated successfully!');
    showSuccessDialog.value = true
  } catch (error) {
    console.error('Error updating supplier:', error)
    alert('Failed to update supplier. Please try again.')
  }
}

// Computed properties for filtering and sorting
const filteredAndSortedSuppliers = computed(() => {
  if (!suppliers.value.length) return []
  
  let result = [...suppliers.value]

  if (searchTerm.value) {
    result = result.filter(supplier => 
      supplier.first_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      supplier.last_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      supplier.id.toString().includes(searchTerm.value)
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
  Math.ceil(filteredAndSortedSuppliers.value.length / itemsPerPage)
)

const paginatedSuppliers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAndSortedSuppliers.value.slice(start, end)
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

const selectSupplier = (supplier) => {
  selectedSupplier.value = supplier
}

const startEditing = () => {
  isEditing.value = true
}

// Fetch data on component mount
onMounted(() => {
  fetchSuppliers()
})
</script>

<template>
  
  <NavBar/>
  <div class="center-components">
    <h1 class="text-2xl font-bold">All Suppliers</h1>
    <div class="flex-components">
      <Input 
        v-model="searchTerm"
        placeholder="Find supplier" 
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
      <Button @click="showNewSupplierDialog = true">Add New Supplier</Button>
      <Button variant="destructive" @click="deleteSupplier" v-if="selectedSupplier">Delete Supplier</Button>
    </div>
  </div>

  <div class="grid grid-cols-3 gap-6">
    <!-- Suppliers Table -->
    <div class="col-span-2">
      <div class="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier ID</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Product</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow 
              v-for="supplier in paginatedSuppliers" 
              :key="supplier.id"
              :class="{ 'bg-amber-100': selectedSupplier?.id === supplier.id }"
              @click="selectSupplier(supplier)"
              class="cursor-pointer hover:bg-gray-100"
            >
              <TableCell>{{ supplier.id }}</TableCell>
              <TableCell>{{ supplier.last_name }}</TableCell>
              <TableCell>{{ supplier.first_name }}</TableCell>
              <TableCell>{{ supplier.dob }}</TableCell>
              <TableCell>{{ supplier.address }}</TableCell>
              <TableCell>{{ supplier.product }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-4 py-4 border-t">
          <div class="text-sm text-gray-500">
            Page {{ currentPage }} of {{ totalPages }}
          </div>
          <Button variant="secondary">Next Page</Button>
        </div>
      </div>
    </div>

    <!-- Supplier Info Panel -->
    <div v-if="selectedSupplier" class="border rounded-lg p-6 bg-white shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Supplier Info</h2>
        <Button @click="startEditing" v-if="!isEditing">Edit</Button>
      </div>

      <!-- Supplier Details -->
      <div class="space-y-4">
        <p class="text-lg font-semibold mb-2">{{ selectedSupplier.first_name }} {{ selectedSupplier.last_name }}</p>
        <p class="text-gray-600 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>

        <div class="space-y-4">
          <h3 class="font-semibold">Full Information</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="font-medium">First Name</p>
              <Input v-if="isEditing" v-model="selectedSupplier.first_name" />
              <p v-else>{{ selectedSupplier.first_name }}</p>
            </div>
            <div>
              <p class="font-medium">Last Name</p>
              <Input v-if="isEditing" v-model="selectedSupplier.last_name" />
              <p v-else>{{ selectedSupplier.last_name }}</p>
            </div>
            <div>
              <p class="font-medium">Birthdate</p>
              <Input v-if="isEditing" type="date" v-model="selectedSupplier.dob" />
              <p v-else>{{ selectedSupplier.dob }}</p>
            </div>
            <div>
              <p class="font-medium">Email</p>
              <Input v-if="isEditing" v-model="selectedSupplier.email" />
              <p v-else>{{ selectedSupplier.email }}</p>
            </div>
            <div>
              <p class="font-medium">Contact Information</p>
              <Input v-if="isEditing" v-model="selectedSupplier.contact_information" />
              <p v-else>{{ selectedSupplier.contact_information }}</p>
            </div>
          </div>

          <div v-if="isEditing" class="flex justify-end gap-4 mt-4">
            <Button @click="isEditing = false" variant="outline">Cancel</Button>
            <Button @click="saveChanges">Save changes</Button>
          </div>
        </div>

        <div class="mt-4">
          <Button 
            @click="showProducts = true" 
            variant="outline"
            class="w-full"
          >
            Supplier Product List
          </Button>
        </div>
      </div>
    </div>
  </div>

  <!-- New Supplier Dialog -->
  <Dialog :open="showNewSupplierDialog" @update:open="showNewSupplierDialog = false">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add New Supplier</DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="font-medium">First Name</label>
            <Input v-model="newSupplier.first_name" />
          </div>
          <div>
            <label class="font-medium">Last Name</label>
            <Input v-model="newSupplier.last_name" />
          </div>
        </div>
        <div>
          <label class="font-medium">Date of Birth</label>
          <Input type="date" v-model="newSupplier.dob" />
        </div>
        <div>
          <label class="font-medium">Address</label>
          <Input v-model="newSupplier.address" />
        </div>
        <div>
          <label class="font-medium">Product</label>
          <Input v-model="newSupplier.product" />
        </div>
        <div>
          <label class="font-medium">Email</label>
          <Input v-model="newSupplier.email" />
        </div>
        <div>
          <label class="font-medium">Contact Information</label>
          <Input v-model="newSupplier.contact_information" />
        </div>
      </div>
      <div class="flex justify-end gap-4">
        <Button @click="showNewSupplierDialog = false" variant="outline">Cancel</Button>
        <Button @click="addNewSupplier">Add Supplier</Button>
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
  
</template>

<style scoped>
.container {
  max-width: 1400px;
}
</style>