<template>
  <div>
    <NavBar />
    <div class="container mx-auto p-4">
      <div class="flex justify-between mb-4">
        <div class="flex space-x-2">
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


const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage)
})

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

function applyFilters() {
  // This function can be expanded to apply more complex filters
  currentPage.value = 1 // Reset to first page when applying filters
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

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function addDiscount() {
  showDiscountDialog.value = true
}

function cancelDiscountDialog() {
  showDiscountDialog.value = false
  selectedDiscount.value = null
  selectedPromoDiscount.value = null
  customDiscountValue.value = null
}

function applyDiscount() {
  showDiscountDialog.value = false
  // The discount will be automatically applied through the computed property
}

function cancelDiscount() {
  selectedPromoDiscount.value = null
  customDiscountValue.value = null
}

watch(selectedCategory, () => {
  currentPage.value = 1
  searchQuery.value = ''
})

watch(searchQuery, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.bg-navy-blue {
  background-color: #1e2a3b;
}
</style>