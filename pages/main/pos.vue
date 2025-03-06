<!--New POS UI-->

<template>
 <div class="min-h-screen bg-background">
  <NavBar />
    <div class="container mx-auto p-4">
      <!-- Top Navigation Bar -->
      <div class="flex justify-between items-center mb-6">
        <!-- Category and Search Section -->
        <div class="flex space-x-3 items-center">
          <!-- Category Select -->
          <Select v-model="selectedCategory" class="w-[180px]">
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="products">Products</SelectItem>
              <SelectItem value="promos">Promos</SelectItem>
            </SelectContent>
          </Select>

          <!-- Search Input -->
          <div class="relative mr=3">
            <Input v-model="searchQuery" placeholder="Search" class="pl-8 w-[200px]" />
            <Search class="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <!-- Reservation, Client, and Therapist Selection -->
        <div class="relative flex space-x-5 items-center">
          <Select v-model="selectedReservationId" class="w-[180px]">
            <SelectTrigger>
              <SelectValue placeholder="Select Reservation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="res in reservations" :key="res.id" :value="res.id">
                {{ res.clientName }}
              </SelectItem>
            </SelectContent>
          </Select>

          <!-- Client Search Section -->
          <div class="relative w-[600px]">
            <div class="relative">
              <Input
                v-model="searchQueryClient"
                placeholder="Search client..."
                class="pr-8"
                @focus="isClientSearchOpen = true"
                @blur="setTimeout(() => { isClientSearchOpen = false }, 150)"
              />
              <div class="absolute right-2 top-1/2 -translate-y-1/2">
                <Button
                  v-if="selectedClient"
                  variant="ghost"
                  size="icon"
                  class="h-5 w-5"
                  @click="clearClientSelection"
                >
                  <X class="h-4 w-4" />
                </Button>
                <Search v-else class="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div
              v-if="isClientSearchOpen && filteredClients.length > 0"
              class="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg"
            >
              <ScrollArea class="h-[200px]">
                <div class="p-1">
                  <div
                    v-for="client in filteredClients"
                    :key="client.id"
                    class="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent"
                    @mousedown.prevent="selectClient(client)"
                  >
                    <div>
                      <span class="font-medium">{{ client.first_name }} {{ client.last_name }}</span>
                      <span class="ml-2 text-xs text-gray-500">
                        {{ client.contact_info }}
                      </span>
                    </div>
                    <span class="text-xs text-gray-500">
                      {{ formatDate(client.dob) }}
                    </span>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>

          <!-- Therapist Select -->
          <Select v-model="selectedTherapist" class="w-[180px]">
            <SelectTrigger>
              <SelectValue placeholder="Therapist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="therapist1">Therapist 1</SelectItem>
              <SelectItem value="therapist2">Therapist 2</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="default" class="bg-gray-900" @click="handleNewBookingClick">
            Add New Booking
          </Button>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="flex gap-6">
        <!-- Products Grid -->
        <div class="flex-1">
          <div class="grid grid-cols-4 gap-4">
            <div v-for="product in displayedProducts" :key="product.id" class="bg-white rounded-lg border p-4 shadow-sm">
              <h3 class="font-medium text-gray-900">{{ product.name }}</h3>
              <p class="text-gray-600">₱{{ product.price.toFixed(2) }}</p>
              <div class="flex items-center justify-between mt-4">
                <div class="flex items-center space-x-2">
                  <Button variant="outline" size="icon" class="h-8 w-8" @click="decreaseQuantity(product)">
                    <Minus class="h-4 w-4" />
                  </Button>
                  <span class="w-8 text-center">{{ getItemQuantity(product) }}</span>
                  <Button variant="outline" size="icon" class="h-8 w-8" @click="increaseQuantity(product)">
                    <Plus class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination (9 items per page) -->
          <!-- Pagination from Old POS -->
          <div class="mt-4 flex justify-center items-center">
            <Pagination v-slot="{ page }" :total="totalProducts" :sibling-count="1" show-edges :default-page="currentPage"
              :per-page="itemsPerPage" @update:page="handlePageChange">
              <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                <PaginationFirst />
                <PaginationPrev />
                <template v-for="(item, index) in items">
                  <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                    <Button class="w-9 h-9 p-0" :variant="item.value === page ? 'default' : 'outline'">
                      {{ item.value }}
                    </Button>
                  </PaginationListItem>
                  <PaginationEllipsis v-else :key="item.type" :index="index" />
                </template>
                <PaginationNext />
                <PaginationLast />
              </PaginationList>
            </Pagination>
          </div>
        </div>

        <!-- Checkout Panel -->
        <div class="w-[400px]">
          <div class="bg-white rounded-lg border p-6">
            <h2 class="text-xl font-semibold mb-4">Checkout</h2>
            <div class="mb-6">
              <h3 class="font-semibold">Order #{{ orderId }}</h3>
              <p class="text-sm text-gray-500">{{ currentDate }}</p>
            </div>

            <!-- Display selected Client and Therapist -->
            <div class="space-y-4 mb-6">
              <p class="text-gray-600">Client Name: {{ selectedClientName || 'N/A' }}</p>
              <p class="text-gray-600">Therapist Name: {{ selectedTherapist || 'N/A' }}</p>
            </div>

            <!-- Payment Mode & Discount -->
            <div class="space-y-4 mb-6">
              <Select v-model="paymentMode">
                <SelectTrigger>
                  <SelectValue placeholder="Mode of Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="gcash">Gcash</SelectItem>
                </SelectContent>
              </Select>

              <div class="relative">
                <Select v-model="selectedDiscount">
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Discount</SelectItem>
                    <SelectItem v-for="promo in promoDiscounts" :key="promo.id" :value="promo.id">
                      {{ promo.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <!-- Discount Remove Button
                  <Button variant="outline" size="sm" class="absolute right-0 top-0" @click="removeDiscount">
                  Remove Discount
                </Button> 
                
                -->
              
              </div>
            </div>

            <!-- Order Summary and Confirm Order -->
            <div class="border-t pt-4 space-y-2 mb-6">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>₱{{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Tax</span>
                <span>₱{{ tax.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Discount</span>
                <span>₱{{ discount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between font-semibold">
                <span>Total</span>
                <span>₱{{ total.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Confirm Order Button and Popup Trigger -->
            <div class="flex space-x-2">
              <Button variant="destructive" class="flex-1" @click="cancelOrder">
                Cancel Order
              </Button>
              <Button variant="default" class="flex-1 bg-green-600 hover:bg-green-700" @click="confirmOrder">
                Confirm Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialogs (Confirm, Success, Discount) -->
    <Dialog :open="showConfirmDialog" @update:open="showConfirmDialog = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Order</DialogTitle>
          <DialogDescription>
            <h3 class="font-bold mb-2">Order Details:</h3>
            <ul class="mb-4">
              <li v-for="item in cart" :key="item.id">{{ item.name }} - {{ item.quantity }}x - ₱{{ (item.price * item.quantity).toFixed(2) }}</li>
            </ul>
            <p>Subtotal: ₱{{ subtotal.toFixed(2) }}</p>
            <p>Tax: ₱{{ tax.toFixed(2) }}</p>
            <p>Discount: ₱{{ discount.toFixed(2) }}</p>
            <p class="font-bold">Total: ₱{{ total.toFixed(2) }}</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button @click="showConfirmDialog = false">Cancel</Button>
          <Button @click="handleConfirmOrder" class="bg-green-500 text-white">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Search, Minus, Plus, Filter } from 'lucide-vue-next'
import NavBar from '~/components/Navbar.vue'
import { Pagination, PaginationEllipsis, PaginationFirst, PaginationLast, PaginationList, PaginationListItem, PaginationNext, PaginationPrev, } from '@/components/ui/pagination'
import { jwtDecode } from "jwt-decode";

const selectedCategory = ref('products')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 16
const cart = ref([])
const showConfirmDialog = ref(false)
const showSuccessDialog = ref(false)
const showDiscountDialog = ref(false)
const selectedReservationId = ref(null)
const paymentMode = ref(null)
const orderId = ref('123456')
const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

const selectedDiscount = ref(null)
const selectedPromoDiscount = ref(null)
const customDiscountValue = ref(null)
const selectedFilter = ref(null)
const selectedClientName = ref(null)
const router = useRouter()
const selectedTherapist = ref(null);


const promoDiscounts = [
  { id: 1, name: 'Summer Sale', value: 10 },
  { id: 2, name: 'Loyalty Discount', value: 15 },
  { id: 3, name: 'First-Time Customer', value: 20 },
]

const allProducts = {
  services: [
    { id: 's1', name: 'Facial Treatment', price: 500 },
    { id: 's2', name: 'Massage Therapy', price: 700 },
    { id: 's3', name: 'Hair Styling', price: 300 },
    { id: 's4', name: 'Manicure', price: 200 },
    { id: 's5', name: 'Pedicure', price: 250 },
    { id: 's6', name: 'Waxing', price: 350 },
    { id: 's7', name: 'Skin Consultation', price: 150 },
    { id: 's8', name: 'Makeup Application', price: 400 },
    { id: 's9', name: 'Body Scrub', price: 450 },
    { id: 's10', name: 'Aromatherapy', price: 550 },
    { id: 's11', name: 'Hot Stone Massage', price: 800 },
    { id: 's12', name: 'Reflexology', price: 300 },
  ],
  products: [
    { id: 'p1', name: 'Vitamin C Serum', price: 250 },
    { id: 'p2', name: '3-in-1 Cream', price: 250 },
    { id: 'p3', name: 'Green Toner', price: 250 },
    { id: 'p4', name: 'ABC Serum', price: 250 },
    { id: 'p5', name: 'Moisturizing Lotion', price: 200 },
    { id: 'p6', name: 'Sunscreen SPF 50', price: 300 },
    { id: 'p7', name: 'Cleansing Gel', price: 180 },
    { id: 'p8', name: 'Night Cream', price: 280 },
    { id: 'p9', name: 'Eye Cream', price: 220 },
    { id: 'p10', name: 'Face Mask', price: 150 },
    { id: 'p11', name: 'Body Lotion', price: 270 },
    { id: 'p12', name: 'Lip Balm', price: 100 },
  ],
  promos: [
    { id: 'pr1', name: 'Summer Package', price: 800 },
    { id: 'pr2', name: 'Couple Spa Day', price: 1200 },
    { id: 'pr3', name: 'Beauty Box Set', price: 500 },
    { id: 'pr4', name: 'Skincare Starter Kit', price: 600 },
    { id: 'pr5', name: 'Hair Care Bundle', price: 450 },
    { id: 'pr6', name: 'Nail Polish Set', price: 300 },
    { id: 'pr7', name: 'Mask Collection', price: 350 },
    { id: 'pr8', name: 'Anti-Aging Package', price: 900 },
    { id: 'pr9', name: 'Wellness Package', price: 1000 },
    { id: 'pr10', name: 'Bridal Beauty Set', price: 1500 },
    { id: 'pr11', name: 'Men\'s Grooming Kit', price: 550 },
    { id: 'pr12', name: 'Teen Skincare Bundle', price: 400 },
  ],
}

const reservations = [
  { id: 'r1', clientName: 'John Doe', therapistName: 'Jane Smith' },
  { id: 'r2', clientName: 'Alice Johnson', therapistName: 'Bob Williams' },
  { id: 'r3', clientName: 'Emma Davis', therapistName: 'Michael Brown' },
]

const filterOptions = [
  { value: 'price_low_high', label: 'Price: Low to High' },
  { value: 'price_high_low', label: 'Price: High to Low' },
  { value: 'name_a_z', label: 'Name: A to Z' },
  { value: 'name_z_a', label: 'Name: Z to A' },
]

const filteredProducts = computed(() => {
  let filtered = allProducts[selectedCategory.value].filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

  if (selectedFilter.value) {
    switch (selectedFilter.value) {
      case 'price_low_high':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_high_low':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name_a_z':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name_z_a':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
    }
  }

  return filtered
})

const fetchClients = async () => {
  const { data, error, refresh } = await useFetch('/api/client/client', { key: 'clients' })
  if (!error.value && data.value?.success) {
    clients.value = data.value.clients
  }
}

// Client Search Functionality
const searchQueryClient = ref('')
const selectedClient = ref(null)
const isClientSearchOpen = ref(false)
const clients = computed(() => clientsData.value?.clients || [])
const { data: clientsData, refresh: refreshClients } = useFetch('/api/client/client')


const filteredClients = computed(() => {
  if (!searchQueryClient.value.trim()) return []
  return clients.value.filter(client =>
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchQueryClient.value.toLowerCase())
  )
})





// Ensure fetchClients is called when a new client is added
const addNewClient = async (clientData) => {
  const { data, error } = await useFetch('/api/counter.post', {
    method: 'POST',
    body: clientData,
  })

  if (!error.value && data.value?.success) {
    await fetchClients() // Refetch clients list to include the new client
  }
}


// Select Client
const selectClient = (client) => {
  selectedClient.value = client
  selectedClientName.value = `${client.first_name} ${client.last_name}`
  isClientSearchOpen.value = false
}

// Clear Selection
const clearClientSelection = () => {
  selectedClient.value = null
  selectedClientName.value = null
  searchQueryClient.value = ''
}


const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const tax = computed(() => subtotal.value * 0.1)

const discount = computed(() => {
  if (selectedPromoDiscount.value) {
    const promo = promoDiscounts.find(p => p.id === selectedPromoDiscount.value)
    return promo ? (subtotal.value * promo.value / 100) : 0
  }
  return customDiscountValue.value ? (subtotal.value * Number(customDiscountValue.value) / 100) : 0
})

const total = computed(() => subtotal.value + tax.value - discount.value)

const selectedReservation = computed(() => 
  reservations.find(r => r.id === selectedReservationId.value)
)

function addToCart(product) {
  const existingItem = cart.value.find(item => item.id === product.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.value.push({ ...product, quantity: 1 })
  }
}

function removeFromCart(productId) {
  const index = cart.value.findIndex(item => item.id === productId)
  if (index !== -1) {
    if (cart.value[index].quantity > 1) {
      cart.value[index].quantity--
    } else {
      cart.value.splice(index, 1)
    }
  }
}

function getItemQuantity(product) {
  const item = cart.value.find(item => item.id === product.id)
  return item ? item.quantity : 0
}

function increaseQuantity(product) {
  addToCart(product)
}

function decreaseQuantity(product) {
  removeFromCart(product.id)
}

function confirmOrder() {
  if (cart.value.length > 0) {
    showConfirmDialog.value = true
  } else {
    alert('Your cart is empty. Please add items before confirming the order.')
  }
}

function handleConfirmOrder() {
  showConfirmDialog.value = false
  showSuccessDialog.value = true
  // Here you would typically send the order to a backend
  cart.value = [] // Clear the cart
  selectedReservationId.value = null
  paymentMode.value = null
  selectedPromoDiscount.value = null
  customDiscountValue.value = null
}

function cancelOrder() {
  cart.value = []
  selectedReservationId.value = null
  paymentMode.value = null
  selectedPromoDiscount.value = null
  customDiscountValue.value = null
}

function goToBookingPage() {
  // Implement navigation to booking page
  console.log('Navigating to booking page...')
}

function handleReservationSelect(reservationId) {
  selectedReservationId.value = reservationId
}


const totalProducts = computed(() => filteredProducts.value.length)

const displayedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

// Navigation to appointments page
const goToAppointments = () => {
  router.push('/appointments/appointments')
}

// Update the button click handler in the template
const handleNewBookingClick = () => {
  goToAppointments()
}

function handlePageChange(newPage) {
  currentPage.value = newPage
}


watch(selectedCategory, () => {
  currentPage.value = 1
  searchQuery.value = ''
})

watch(searchQuery, () => {
  currentPage.value = 1
})

watch(clientsData, (newVal) => {
  console.log("Fetched Clients:", newVal)
})


// Fetch clients on component mount
onMounted(async () => {
  try {
    const response = await fetch('/api/client/client')
    clients.value = await response.json()
  } catch (error) {
    console.error('Error fetching clients:', error)
    // Handle error appropriately
  }
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Fetch data when page loads
onMounted(fetchClients)

</script>

<style scoped>
.bg-navy-blue {
  background-color: #1e2a3b;
}
</style>