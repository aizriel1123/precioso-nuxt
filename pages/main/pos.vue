<template>
  <div>
    <NavBar />
    <div class="container mx-auto p-4">
      <div class="flex justify-between mb-4">
        <div class="flex space-x-2">
          <!-- Category selection -->
          <Select v-model="selectedCategory">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="products">Products</SelectItem>
              <SelectItem value="promos">Promos</SelectItem>
            </SelectContent>
          </Select>
          
          <!-- Search input -->
          <Input v-model="searchQuery" placeholder="Search..." />
          
          <!-- Filter selection -->
          <Select v-model="selectedFilter">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in filterOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <!-- Reservation selection and booking button -->
        <div class="flex space-x-2">
          <Select v-model="selectedReservationId" @update:modelValue="handleReservationSelect">
            <SelectTrigger class="w-[180px]"> 
              <SelectValue placeholder="Select Reservation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="reservation in reservations" :key="reservation.id" :value="reservation.id">
                {{ reservation.clientName }}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button @click="goToBookingPage">Add Booking</Button>
        </div>
      </div>

      <!-- Discount buttons -->
      <div class="flex space-x-2 mb-4">
        <Button @click="addDiscount">Add Discount</Button>
        <Button @click="cancelDiscount" variant="outline">Cancel Discount</Button>
      </div>

      <div class="flex">
        <!-- Product grid -->
        <div class="w-3/4 grid grid-cols-4 gap-4">
          <div v-for="product in displayedProducts" :key="product.id" class="border p-4 rounded-lg shadow">
            <h3 class="font-bold">{{ product.name }}</h3>
            <p>₱{{ product.price.toFixed(2) }}</p>
            <div class="flex items-center mt-2 justify-between">
              <Button @click="addToCart(product)" class="bg-navy-blue text-white">Add</Button>
              <div class="flex items-center">
                <Button @click="decreaseQuantity(product)" variant="outline" class="p-1">
                  <Minus class="h-4 w-4" />
                </Button>
                <span class="mx-2">{{ getItemQuantity(product) }}</span>
                <Button @click="increaseQuantity(product)" variant="outline" class="p-1">
                  <Plus class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Checkout summary -->
        <div class="w-1/4 ml-4">
          <div class="border p-4 rounded-lg">
            <h2 class="text-xl font-bold mb-4">Checkout</h2>
            <div class="mt-4">
              <h3 class="font-bold">Order #{{ orderId }}</h3>
              <p class="text-sm text-gray-500">{{ currentDate }}</p>
            </div>
            <div class="mt-4">
              <p>Client Name: {{ selectedReservation?.clientName || 'N/A' }}</p>
              <p>Therapist Name: {{ selectedReservation?.therapistName || 'N/A' }}</p>
            </div>
            <ul class="mt-4 space-y-2">
              <li v-for="item in cart" :key="item.id">
                {{ item.name }} 
                <span class="float-right">{{ item.quantity }}x</span>
              </li>
            </ul>
            <div class="mt-4">
              <Select v-model="paymentMode">
                <SelectTrigger>
                  <SelectValue placeholder="Mode of Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="gcash">Gcash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="mt-4 space-y-2">
              <p>Subtotal: ₱{{ subtotal.toFixed(2) }}</p>
              <p>Tax: ₱{{ tax.toFixed(2) }}</p>
              <p>Discount: ₱{{ discount.toFixed(2) }}</p>
              <p class="font-bold">Total: ₱{{ total.toFixed(2) }}</p>
            </div>
            <div class="mt-4 flex space-x-2">
              <Button @click="cancelOrder" class="w-1/2 bg-red-500 text-white hover:bg-red-600">Cancel Order</Button>
              <Button @click="confirmOrder" class="w-1/2 bg-green-500 text-white hover:bg-green-600">Confirm Order</Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination for products -->
      <div class="mt-4 flex justify-center items-center">
        <Pagination 
          v-slot="{ page }" 
          :total="totalProducts" 
          :sibling-count="1" 
          show-edges 
          :default-page="currentPage"
          :per-page="itemsPerPage"
          @update:page="handlePageChange"
        >
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
              <p class="font-bold">Total: ₱{{ total.toFixed(2) }}</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button @click="showConfirmDialog = false">Cancel</Button>
            <Button @click="handleConfirmOrder" class="bg-green-500 text-white">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- Success Dialog -->
      <Dialog :open="showSuccessDialog" @update:open="showSuccessDialog">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Checkout Successful</DialogTitle>
            <DialogDescription>Your transaction has been placed successfully.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button @click="showSuccessDialog = false">Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- Discount Dialog -->
      <Dialog :open="showDiscountDialog" @update:open="showDiscountDialog = $event">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Discount</DialogTitle>
          </DialogHeader>
          <div class="mb-4">
            <Select v-model="selectedDiscount">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select Discount Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promo">Promo Discount</SelectItem>
                <SelectItem value="custom">Custom Discount</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div v-if="selectedDiscount === 'promo'" class="mb-4">
            <Select v-model="selectedPromoDiscount">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select Promo Discount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="promo in promoDiscounts" :key="promo.id" :value="promo.discountValue">
                  {{ promo.label }} - {{ promo.discountValue }}%
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div v-if="selectedDiscount === 'custom'" class="mb-4">
            <Input v-model="customDiscountValue" type="number" placeholder="Enter Custom Discount (%)" />
          </div>
          <DialogFooter>
            <Button @click="applyDiscount">Apply</Button>
            <Button @click="showDiscountDialog = false">Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { PrismaClient } from '@prisma/client'
import NavBar from '~/components/Navbar.vue'

const prisma = new PrismaClient()

// Reactive variables for managing UI state and data
const selectedCategory = ref('products')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 8
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

const promoDiscounts = [
  { id: 1, name: 'Summer Sale', value: 10 },
  { id: 2, name: 'Loyalty Discount', value: 15 },
  { id: 3, name: 'First-Time Customer', value: 20 },
]

const allProducts = ref({
  services: [],
  products: [],
  promos: [],
})

const reservations = ref([])

// Filter options for product sorting
const filterOptions = [
  { value: 'price_low_high', label: 'Price: Low to High' },
  { value: 'price_high_low', label: 'Price: High to Low' },
  { value: 'name_a_z', label: 'Name: A to Z' },
  { value: 'name_z_a', label: 'Name: Z to A' },
]

// Fetching data from the database using Prisma
const fetchData = async () => {
  try {
    allProducts.value.services = await prisma.service.findMany() // Fetch all services
    allProducts.value.products = await prisma.product.findMany() // Fetch all products
    allProducts.value.promos = await prisma.promo.findMany() // Fetch all promotions
    reservations.value = await prisma.reservation.findMany() // Fetch all reservations
  } catch (error) {
    console.error("Error fetching data from Prisma:", error) // Log any errors during data fetching
  }
}

// Fetch data when the component is mounted
onMounted(() => {
  fetchData()
})

// Computed properties for filtering and calculating totals
const filteredProducts = computed(() => {
  let filtered = allProducts.value[selectedCategory.value].filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) // Filter products by search query
  )

  if (selectedFilter.value) {
    // Sort filtered products based on the selected filter
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

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage) // Calculate total number of pages for pagination
})

const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0) // Calculate the subtotal of items in the cart
})

const tax = computed(() => subtotal.value * 0.1) // Calculate tax (10% of subtotal)

const discount = computed(() => {
  if (selectedPromoDiscount.value) {
    const promo = promoDiscounts.find(p => p.id === selectedPromoDiscount.value) // Find the selected promo discount
    return promo ? (subtotal.value * promo.value / 100) : 0 // Calculate discount based on selected promo
  }
  return customDiscountValue.value ? (subtotal.value * Number(customDiscountValue.value) / 100) : 0 // Calculate discount based on custom value
})

const total = computed(() => subtotal.value + tax.value - discount.value) // Calculate the total amount after applying tax and discounts

const selectedReservation = computed(() => 
  reservations.value.find(r => r.id === selectedReservationId.value) // Get the selected reservation by ID
)

const totalProducts = computed(() => filteredProducts.value.length) // Get the total number of filtered products

const displayedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end) // Return products for the current page based on pagination
})

// Methods for cart management and order processing
function addToCart(product) {
  // Add a product to the cart, increasing quantity if already exists
  const existingItem = cart.value.find(item => item.id === product.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.value.push({ ...product, quantity: 1 }) // Add new product with quantity 1
  }
}

function removeFromCart(productId) {
  // Remove a product from the cart, reducing quantity or removing if it reaches zero
  const index = cart.value.findIndex(item => item.id === productId)
  if (index !== -1) {
    if (cart.value[index].quantity > 1) {
      cart.value[index].quantity--
    } else {
      cart.value.splice(index, 1) // Remove item from cart
    }
  }
}

function getItemQuantity(product) {
  // Get the quantity of a specific product in the cart
  const item = cart.value.find(item => item.id === product.id)
  return item ? item.quantity : 0
}

function increaseQuantity(product) {
  // Increase the quantity of a product in the cart
  addToCart(product)
}

function decreaseQuantity(product) {
  // Decrease the quantity of a product in the cart
  removeFromCart(product.id)
}

function confirmOrder() {
  // Show confirmation dialog if there are items in the cart
  if (cart.value.length > 0) {
    showConfirmDialog.value = true
  } else {
    alert('Your cart is empty. Please add items before confirming the order.')
  }
}

function handleConfirmOrder() {
  // Handle order confirmation logic
  showConfirmDialog.value = false
  showSuccessDialog.value = true
  // Here you would typically send the order to a backend
  cart.value = [] // Clear the cart after confirmation
  selectedReservationId.value = null
  paymentMode.value = null
  selectedPromoDiscount.value = null
  customDiscountValue.value = null
}

function cancelOrder() {
  // Cancel the current order and clear cart and related data
  cart.value = []
  selectedReservationId.value = null
  paymentMode.value = null
  selectedPromoDiscount.value = null
  customDiscountValue.value = null
}

function goToBookingPage() {
  // Placeholder function to implement navigation to booking page
  console.log('Navigating to booking page...')
}

function handleReservationSelect(reservationId) {
  // Set the selected reservation ID
  selectedReservationId.value = reservationId
}

function applyFilters() {
  // Reset pagination when filters are applied
  currentPage.value = 1 // Reset to first page when applying filters
}

function handlePageChange(newPage) {
  // Change the current page for pagination
  currentPage.value = newPage
}

// Discount management functions
function addDiscount() {
  // Open the discount dialog
  showDiscountDialog.value = true
}

function cancelDiscountDialog() {
  // Close the discount dialog and reset selected values
  showDiscountDialog.value = false
  selectedDiscount.value = null
  selectedPromoDiscount.value = null
  customDiscountValue.value = null
}

function applyDiscount() {
  // Close the discount dialog (discount is automatically applied through computed property)
  showDiscountDialog.value = false
}

function cancelDiscount() {
  // Reset selected discount values when discount is canceled
  selectedPromoDiscount.value = null
  customDiscountValue.value = null
}

// Watchers to react to changes in selectedCategory and searchQuery
watch(selectedCategory, () => {
  currentPage.value = 1 // Reset to first page when category changes
  searchQuery.value = '' // Clear search query when category changes
})

watch(searchQuery, () => {
  currentPage.value = 1 // Reset to first page when search query changes
})
</script>

<style scoped>
.bg-navy-blue {
  background-color: #1e2a3b; /* Background color for navy blue theme */
}
</style>
