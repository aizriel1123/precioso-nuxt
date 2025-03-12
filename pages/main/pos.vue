<template>
  <div class="min-h-screen bg-background">
    <NavBar />
    <div class="container mx-auto p-4">
      <!-- Top Navigation Bar -->
      <div class="flex justify-between items-center mb-6">
        <!-- Category and Search Section -->
        <div class="flex space-x-3 items-center">
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
          <div class="relative">
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
              <SelectItem
                v-for="res in reservations"
                :key="res.id"
                :value="res.id"
              >
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
                      <span class="font-medium">
                        {{ client.first_name }} {{ client.last_name }}
                      </span>
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
          <Select v-model="selectedTherapist">
              <SelectTrigger>
                <SelectValue placeholder="Therapist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="therapist in therapists"
                  :key="therapist.id"
                  :value="Number(therapist.id)" 
                >
                  {{ therapist.name }}
                </SelectItem>
              </SelectContent>
            </Select>

          <Button variant="default" class="bg-gray-900" @click="handleNewBookingClick">
            Add New Booking
          </Button>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="flex gap-6">
        <!-- Products/Services/Promos Grid -->
        <div class="flex-1">
          <div class="grid grid-cols-4 gap-4">
            <div
              v-for="item in displayedProducts"
              :key="item.id"
              class="bg-white rounded-lg border p-4 shadow-sm"
            >
              <h3 class="font-medium text-gray-900">{{ item.name }}</h3>
              <p class="text-gray-600">₱{{ item.price.toFixed(2) }}</p>
              <div class="flex items-center justify-between mt-4">
                <div class="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    class="h-8 w-8"
                    @click="decreaseQuantity(item)"
                  >
                    <Minus class="h-4 w-4" />
                  </Button>
                  <span class="w-8 text-center">{{ getItemQuantity(item) }}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    class="h-8 w-8"
                    @click="increaseQuantity(item)"
                  >
                    <Plus class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <!-- Pagination -->
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
              <p class="text-gray-600">Therapist Name: {{ selectedTherapistName || 'N/A' }}</p>
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
                <Input 
                  v-model="notesInput" 
                  placeholder="Add notes..." 
                  class="mt-2"
                />
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

    <!-- Confirm Order Dialog -->
    <Dialog :open="showConfirmDialog" @update:open="showConfirmDialog = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Order</DialogTitle>
          <DialogDescription>
            <h3 class="font-bold mb-2">Order Details:</h3>
            <ul class="mb-4">
              <li v-for="item in cart" :key="item.id">
                {{ item.name }} - {{ item.quantity }}x - ₱{{ (item.price * item.quantity).toFixed(2) }}
              </li>
            </ul>
            <p>Subtotal: ₱{{ subtotal.toFixed(2) }}</p>
            <p>Tax: ₱{{ tax.toFixed(2) }}</p>
            <p>Discount: ₱{{ discount.toFixed(2) }}</p>
            <p v-if="notesInput" class="mt-2">Notes: {{ notesInput }}</p>
            <p class="font-bold">Total: ₱{{ total.toFixed(2) }}</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button @click="showConfirmDialog = false">Cancel</Button>
          <Button @click="handleConfirmOrder" class="bg-green-500 text-white">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFetch } from '#app'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Search, Minus, Plus, X } from 'lucide-vue-next'
import NavBar from '~/components/Navbar.vue'
import { Pagination, PaginationEllipsis, PaginationFirst, PaginationLast, PaginationList, PaginationListItem, PaginationNext, PaginationPrev, } from '@/components/ui/pagination'
import { jwtDecode } from "jwt-decode";

const router = useRouter()

// Reactive state
const selectedCategory = ref('products')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 16
const cart = ref([])
const showConfirmDialog = ref(false)
const showSuccessDialog = ref(false)
const selectedReservationId = ref(null)
const paymentMode = ref(null)
const orderId = ref('123456')
const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

const selectedDiscount = ref(null)
const selectedPromoDiscount = ref(null)
const customDiscountValue = ref(null)
const selectedClientName = ref(null)
const selectedTherapist = ref(null)

// Data containers
const currentItems = ref([])
const reservations = ref([])
const therapists = ref([])
const promoDiscounts = ref([])
const clients = ref([])

// Client search state
const searchQueryClient = ref('')
const selectedClient = ref(null)
const isClientSearchOpen = ref(false)

// Add the missing reactive variable for notes
const notesInput = ref('')



const selectedTherapistName = computed(() => {
  const id = Number(selectedTherapist.value)
  const therapist = therapists.value.find(t => t.id === id)
  return therapist ? therapist.name : 'N/A'
})


const filteredProducts = computed(() =>
  currentItems.value.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)
const totalProducts = computed(() => filteredProducts.value.length)
const displayedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})
const filteredClients = computed(() => {
  if (!searchQueryClient.value.trim()) return []
  return clients.value.filter(client =>
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchQueryClient.value.toLowerCase())
  )
})

// Order calculations
const subtotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)
const tax = computed(() => subtotal.value * 0.1)
const discount = computed(() => {
  if (selectedPromoDiscount.value) {
    const promo = promoDiscounts.value.find(p => p.id === selectedPromoDiscount.value)
    return promo ? (subtotal.value * promo.value / 100) : 0
  }
  return customDiscountValue.value ? (subtotal.value * Number(customDiscountValue.value) / 100) : 0
})
const total = computed(() => subtotal.value + tax.value - discount.value)

// Cart operations
function addToCart(product) {
  // Create a unique identifier combining the category and the product id
  const uniqueId = `${selectedCategory.value}-${product.id}`;
  
  // Look for an existing cart item using the composite key
  const existingItem = cart.value.find(item => item.uniqueId === uniqueId);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    // Add the current category and price snapshot to the item
    cart.value.push({ 
      ...product, 
      quantity: 1, 
      uniqueId, 
      category: selectedCategory.value, 
      // Ensure the price is captured from the API response:
      price: product.price 
    });
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

async function handleConfirmOrder() {
  showConfirmDialog.value = false;
  
  // Validate before submitting
  if (!selectedClient.value?.id) {
    alert("Please select a client before confirming the order");
    return;
  }
  
  if (!selectedTherapist.value) {
    alert("Please select a therapist before confirming the order");
    return;
  }
  
  if (!paymentMode.value) {
    alert("Please select a payment mode before confirming the order");
    return;
  }
  
  try {
    // Build payload from your selections.
    // Depending on the selectedCategory, put the cart items into the correct array.
    const payload = {
      clientId: selectedClient.value.id,
  therapistId: Number(selectedTherapist.value),
  paymentMode: paymentMode.value,
  notes: notesInput.value || "Transaction created from POS",
  products: cart.value
    .filter(item => item.category === 'products')
    .map(item => ({
      id: Number(item.id),
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) // Product price from the Product model
    })),
  services: cart.value
    .filter(item => item.category === 'services')
    .map(item => ({
      id: Number(item.id),
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) // Service price from the Service model
    })),
  promos: cart.value
    .filter(item => item.category === 'promos')
    .map(item => ({
      id: Number(item.id),
      statusId: 1,
      price: Number(item.price) // Promo price from the Promo model
    }))
};

    console.log("Submitting payload:", payload);

    const { data, error } = await useFetch('/api/pos/counter', {
      method: 'POST',
      body: payload
    });

    console.log("Response:", data.value, error.value);

    if (error.value) {
      console.error("Error creating transaction:", error.value);
      alert(`Failed to create transaction: ${error.value.message || 'Unknown error'}`);
      return;
    }

    if (!data.value?.success) {
      alert(`Transaction failed: ${data.value?.error || 'Unknown error'}`);
      return;
    }

    // Reset cart and selections on success
    cart.value = [];
    selectedReservationId.value = null;
    paymentMode.value = null;
    selectedDiscount.value = null;
    notesInput.value = '';
    selectedClient.value = null;
    selectedClientName.value = null;
    
    alert("Transaction completed successfully!");
  } catch (err) {
    console.error("Transaction error:", err);
    alert(`An error occurred: ${err.message || 'Unknown error'}`);
  }
}

function getItemQuantity(product) {
  const uniqueId = `${selectedCategory.value}-${product.id}`;
  const item = cart.value.find(item => item.uniqueId === uniqueId);
  return item ? item.quantity : 0;
}

function cancelOrder() {
  cart.value = []
  selectedReservationId.value = null
  paymentMode.value = null
  selectedPromoDiscount.value = null
  customDiscountValue.value = null
}
function handlePageChange(newPage) {
  currentPage.value = newPage
}
function handleNewBookingClick() {
  router.push('/counter/pos')
}
function selectClient(client) {
  selectedClient.value = client
  selectedClientName.value = `${client.first_name} ${client.last_name}`
  isClientSearchOpen.value = false
}
function clearClientSelection() {
  selectedClient.value = null
  selectedClientName.value = null
  searchQueryClient.value = ''
}
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Data fetching functions
const fetchClients = async () => {
  try {
    const response = await fetch('/api/client/client')
    clients.value = await response.json()
  } catch (error) {
    console.error('Error fetching clients:', error)
  }
}
const fetchReservations = async () => {
  try {
    // Use /api/transactions as defined in your GET endpoint
    const { data } = await useFetch('/api/reservations/reservations')
    reservations.value = data.value?.map(res => ({
      id: res.id,
      clientName: `${res.Client.first_name} ${res.Client.last_name}`,
      therapistName: res.Therapist?.first_name
    })) || []
  } catch (error) {
    console.error('Error fetching reservations:', error)
  }
}




const fetchTherapists = async () => {
  try {
    const { data } = await useFetch('/api/pos/therapists/therapists')
    therapists.value = data.value || []
  } catch (error) {
    console.error('Error fetching therapists:', error)
  }
}

const fetchPromos = async () => {
  try {
    // Use /api/promos as defined in your GET endpoint
    const { data } = await useFetch('/api/promos/promos')
    promoDiscounts.value = data.value?.map(promo => ({
      id: promo.id,
      name: promo.name,
      value: promo.price
    })) || []
  } catch (error) {
    console.error('Error fetching promos:', error)
  }
}
const fetchItems = async () => {
  try {
    const endpointMap = {
      services: '/api/pos/services/services',
      products: '/api/pos/products/products',
      promos: '/api/pos/promos/promos',
    };
    const { data } = await useFetch(endpointMap[selectedCategory.value]);
    // The endpoints return objects with { id, name, price } already
    currentItems.value = data.value || [];
  } catch (error) {
    console.error('Error fetching items:', error);
  }
};


// Optional: Fetch all data at once
const fetchAllData = async () => {
  await Promise.all([
    fetchClients(),
    fetchReservations(),
    fetchTherapists(),
    fetchPromos(),
    fetchItems()
  ])
}
// Watch for changes in category to re-fetch items
watch(selectedCategory, async () => {
  currentPage.value = 1
  searchQuery.value = ''
  await fetchItems()
})
watch(searchQuery, () => {
  currentPage.value = 1
})

// At the end of your <script setup>:
fetchAllData()

</script>

<style scoped>
.bg-navy-blue {
  background-color: #1e2a3b;
}
</style>
