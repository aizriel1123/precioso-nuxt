<template>
  <div>
    <NavBar />
    <div class="container mx-auto p-4">
      <div class="flex justify-between mb-4">
        <div class="flex space-x-2">
          <Select v-model="selectedCategory">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="products">Products</SelectItem>
              <SelectItem value="promos">Promos</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Welcome" />
          <Button variant="outline">
            <Search class="h-4 w-4 mr-2" />
          </Button>
          <Button>Filter</Button>
        </div>
        <div class="flex space-x-2">
          <Select>
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Select Reservation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reservation1">Reservation 1</SelectItem>
              <SelectItem value="reservation2">Reservation 2</SelectItem>
            </SelectContent>
          </Select>
          <Button>Select</Button>
          <Button>Add Booking</Button>
        </div>
      </div>

      <div class="flex">
        <div class="w-3/4 grid grid-cols-4 gap-4">
          <div v-for="product in displayedProducts" :key="product.name" class="border p-4 rounded-lg shadow">
            <h3 class="font-bold">{{ product.name }}</h3>
            <p>₱{{ product.price.toFixed(2) }}</p>
            <div class="flex items-center mt-2 justify-between">
              <Button class="bg-navy-blue text-white">Add</Button>
              <div class="flex items-center">
                <Button variant="outline" class="p-1">
                  <Minus class="h-4 w-4" />
                </Button>
                <span class="mx-2">01</span>
                <Button variant="outline" class="p-1">
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
              <h3 class="font-bold">Order #123456</h3>
              <p class="text-sm text-gray-500">January 1, 2025</p>
            </div>
            <div class="mt-4">
              <p>Client Name:</p>
              <p>Therapist Name:</p>
            </div>
            <ul class="mt-4 space-y-2">
              <li>Vitamin C Serum <span class="float-right">1x</span></li>
              <li>Lemon Soap <span class="float-right">1x</span></li>
              <li>3-in-1 Cream <span class="float-right">1x</span></li>
            </ul>
            <div class="mt-4">
              <Select>
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
              <p>Client Name</p>
              <p>Subtotal</p>
              <p>Tax</p>
              <p>Discount</p>
              <p class="font-bold">Total</p>
            </div>
            <div class="mt-4 flex space-x-2">
              <Button class="w-1/2 bg-red-500 text-white hover:bg-red-600">Cancel Order</Button>
              <Button class="w-1/2 bg-green-500 text-white hover:bg-green-600">Confirm Order</Button>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 flex justify-between items-center">
        <div>
    Page {{ currentPage }} of {{ totalPages }}
  </div>
  <div class="flex">  <Button 
      class="bg-navy-blue text-white mr-4" 
      @click="prevPage" 
      :disabled="currentPage <= 1"
    >
      Previous Page
    </Button>
    <Button 
      class="bg-navy-blue text-white" 
      @click="nextPage" 
      :disabled="currentPage >= totalPages"
    >
      Next Page
    </Button>
  </div>

      </div>
    </div>
  </div>

</template>

<script setup>
import NavBar from '~/components/Navbar.vue'

import { ref, computed } from 'vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Minus, Plus } from 'lucide-vue-next'

// Updated sample products for different categories with more items
const allProducts = {
  services: [
    { name: 'Facial Treatment', price: 500 },
    { name: 'Massage Therapy', price: 700 },
    { name: 'Hair Styling', price: 300 },
    { name: 'Manicure', price: 200 },
    { name: 'Pedicure', price: 250 },
    { name: 'Waxing', price: 350 },
    { name: 'Skin Consultation', price: 150 },
    { name: 'Makeup Application', price: 400 },
    { name: 'Body Scrub', price: 450 },
    { name: 'Aromatherapy', price: 550 },
    { name: 'Hot Stone Massage', price: 800 },
    { name: 'Reflexology', price: 300 },
  ],
  products: [
    { name: 'Vitamin C Serum', price: 250 },
    { name: '3-in-1 Cream', price: 250 },
    { name: 'Green Toner', price: 250 },
    { name: 'ABC Serum', price: 250 },
    { name: 'Moisturizing Lotion', price: 200 },
    { name: 'Sunscreen SPF 50', price: 300 },
    { name: 'Cleansing Gel', price: 180 },
    { name: 'Night Cream', price: 280 },
    { name: 'Eye Cream', price: 220 },
    { name: 'Face Mask', price: 150 },
    { name: 'Body Lotion', price: 270 },
    { name: 'Lip Balm', price: 100 },
  ],
  promos: [
    { name: 'Summer Package', price: 800 },
    { name: 'Couple Spa Day', price: 1200 },
    { name: 'Beauty Box Set', price: 500 },
    { name: 'Skincare Starter Kit', price: 600 },
    { name: 'Hair Care Bundle', price: 450 },
    { name: 'Nail Polish Set', price: 300 },
    { name: 'Mask Collection', price: 350 },
    { name: 'Anti-Aging Package', price: 900 },
    { name: 'Wellness Package', price: 1000 },
    { name: 'Bridal Beauty Set', price: 1500 },
    { name: 'Men\'s Grooming Kit', price: 550 },
    { name: 'Teen Skincare Bundle', price: 400 },
  ],
};

const selectedCategory = ref('products');
const products = ref(allProducts);
const currentPage = ref(1);
const itemsPerPage = 8;

const filteredProducts = computed(() => {
  return products.value[selectedCategory.value];
});

const displayedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage);
});

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

// Watch for category changes to reset pagination
watch(selectedCategory, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
.bg-navy-blue {
  background-color: #1e2a3b;
}
</style>