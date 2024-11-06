<!--New POS UI-->

<template>
  <div class="container mx-auto py-8 px-4">
    <NavBar/>
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
          <Input v-model="searchQuery" placeholder="Search..." />
          <Button variant="outline">
            <Search class="h-4 w-4 mr-2" />
            Search
          </Button>

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
          <Button @click="applyFilters">
            <Filter class="h-4 w-4" />
            Apply Filters
          </Button>
        </div>
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

      <div class="flex space-x-2 mb-4">
        <Button @click="addDiscount">Add Discount</Button>
        <Button @click="cancelDiscount" variant="outline">Cancel Discount</Button>
      </div>

      <div class="flex">
        <div class="w-3/4 grid grid-cols-4 gap-4">
          <div v-for="product in displayedProducts" :key="product.id" class="border p-4 rounded-lg shadow">
            <h3 class="font-bold">{{ product.name }}</h3>
            <p>₱{{ parseFloat(product.cost || product.price)}}</p>
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

        <!-- Reservation, Client, and Therapist Selection -->
        <div class="flex space-x-3 items-center">
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

          <!-- Client Select -->
          <Select v-model="selectedClientName" class="w-[180px]">
            <SelectTrigger>
              <SelectValue placeholder="Client Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client1">Client 1</SelectItem>
              <SelectItem value="client2">Client 2</SelectItem>
            </SelectContent>
          </Select>

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

          <Button variant="default" class="bg-gray-900">
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
            <ul class="mt-4 space-y-2">
              <li v-for="item in cart" :key="item.id">
                {{ item.name }}
                <span class="float-right">
                  {{ item.quantity }}x
                </span>
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
            <div class="mt-4 flex space-x-2">
              <Button @click="cancelOrder" class="w-1/2 bg-red-500 text-white hover:bg-red-600">Cancel Order</Button>
              <Button @click="confirmOrder" class="w-1/2 bg-green-500 text-white hover:bg-green-600">Confirm
                Order</Button>
            </div>
          </div>
        </div>
      </div>

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
                <SelectItem v-for="promo in promoDiscounts" :key="promo.id" :value="promo.id">
                  {{ promo.name }} - {{ promo.value }}%
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div v-else-if="selectedDiscount === 'custom'" class="mb-4">
            <Input v-model="customDiscountValue" type="number" placeholder="Enter discount percentage" />
          </div>
          <DialogFooter>
            <Button @click="cancelDiscountDialog">Cancel</Button>
            <Button @click="applyDiscount" class="bg-green-500 text-white">Apply Discount</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
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
const product_types = ref([]);
const selectedDiscount = ref(null)
const selectedPromoDiscount = ref(null)
const customDiscountValue = ref(null)
const selectedFilter = ref(null)
const selectedClientName = ref(null)
const selectedTherapist = ref(null)



const promoDiscounts = [
  { id: 1, name: 'Summer Sale', value: 10 },
  { id: 2, name: 'Loyalty Discount', value: 15 },
  { id: 3, name: 'First-Time Customer', value: 20 },
]

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

//-------------------------------------------TEST CODE---------------------------------------------
let dropDownItems = {
  services: [],
  products: [],
  promos: [],
}

async function fetchItems() {
  try {
    const response = await $fetch('/api/pos/product', {
      method: 'GET',
      headers: { "Content-Type": "application/json" },
    });

    dropDownItems = response
    // console.log(response)
  } catch (error) {
    console.error('Failed to fetch items:');
  }
}

// THis thing needs to be async para ma load yung data ng dropDownItems
// If wala, the var will be empty
await fetchItems()
//------------------------------------------TEST CODE----------------------------------------------

const filteredProducts = computed(() => {
  let filtered = dropDownItems[selectedCategory.value].filter(product =>
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


const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage)
})

const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price ? parseFloat(item.price) : parseFloat(item.cost)) * item.quantity, 0)
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


async function fetchProducts() {
  try {
    const response = await $fetch('/api/inventory/product', {
      method: 'GET',

    });
    product_types.value = response;
    console.log(response)
    return response
  } catch (error) {
    console.error('Get Product Type failed:');
    return {}
  }
}
fetchProducts();
</script>

<style scoped>
.bg-navy-blue {
  background-color: #1e2a3b;
}

/* Dropdown select trigger */
.dropdown-trigger {
  width: 200px;
}
</style>
