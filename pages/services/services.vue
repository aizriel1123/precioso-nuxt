<template>
  <NavBar />
  <div class="center-components">
    <!-- title will depend on tab chosen -->
    <h1 class="title">{{ tabTitle }}</h1>

    <!-- Flex container for dropdown, input, filter and buttons -->
    <div class="flex-components">
      <div class="left-side">
        <Tabs 
          v-model="selectedTab"
          :options="['service', 'promo']"
          class="w-[200px]"
        >
          <TabsList class="grid w-full grid-cols-2 w-[200px]">
            <TabsTrigger value="service">Service</TabsTrigger>
            <TabsTrigger value="promo">Promo</TabsTrigger>
          </TabsList>
        </Tabs>

        <Input :placeholder="inputPlaceholder" class="input_search" v-model="searchQuery"/>
      </div>

      <div class="right-side">
        <!-- Buttons for adding new service and promo -->
        <Button variant="ghost" class="button" @click="openServiceModal">Add New Service</Button>
        <Button variant="ghost" class="button" @click="openPromoModal">Add New Promo</Button>
      </div>
    </div>

    <!-- Table for displaying products -->
    <div class="table-product-container">
      <div class="container-table">
        <div class="table-content">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead v-if="selectedTab === 'service'">Service ID</TableHead>
                <TableHead v-if="selectedTab === 'service'">Service Name</TableHead>
                <TableHead v-if="selectedTab === 'service'">Price</TableHead>
                <TableHead v-if="selectedTab === 'service'">Commission</TableHead>

                <TableHead v-if="selectedTab === 'promo'">Promo ID</TableHead>
                <TableHead v-if="selectedTab === 'promo'">Promo Name</TableHead>
                <TableHead v-if="selectedTab === 'promo'">Price</TableHead> 
                <TableHead v-if="selectedTab === 'promo'">Commission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="(item) in filteredItems" 
                :key="item.id" 
                @click="selectGoods(item)"
              >
                <TableCell>{{ item.id }}</TableCell>
                <TableCell>{{ item.name || item.promo }}</TableCell>
                <TableCell>{{ item.price }}</TableCell>
                <TableCell>{{ item.commission }}</TableCell>
              </TableRow>
              <!-- Empty rows for pagination -->
              <TableRow v-for="index in emptyRows" :key="'empty-' + index" class="empty-row">
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableBody>
          </Table>  
          <div class="pagination-wrapper">
            <Pagination
              v-slot="{ page }"
              :total="totalPages"
              :sibling-count="1"
              show-edges
              :default-page="currentPage"
              @change="onPageChange"
            >
              <PaginationList v-slot="{ items }" class="pagination-list">
                <PaginationFirst @click="onPageChange(1)" />
                <PaginationPrev @click="onPageChange(currentPage - 1)" />
                <template v-for="(item, index) in items">
                  <PaginationListItem 
                    v-if="item.type === 'page'"
                    :key="index"
                    :value="item.value"
                    as-child
                  >
                    <Button
                      class="pagination-button"
                      :variant="item.value === currentPage ? 'default' : 'outline'"
                      @click="onPageChange(item.value)"
                    >
                      {{ item.value }}
                    </Button>
                  </PaginationListItem>
                  <PaginationEllipsis v-else :key="item.type" :index="index" />
                </template>
                <PaginationNext @click="onPageChange(currentPage + 1)" />
                <PaginationLast @click="onPageChange(totalPages)" />
              </PaginationList>
            </Pagination>
          </div>
        </div>
      </div>

      <!-- Edit Selected Service/Promo container -->
      <div class="container-selectedproduct">
        <h2 class="selected-product-title">Edit Selected {{ tabTitle }}</h2>
        <form id="update_panel">
          <FormField v-if="selectedTab === 'service'" v-slot="{ componentField }" name="update_serviceid">
            <FormItem>
              <FormLabel>Service ID</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="Service ID" 
                  v-bind="componentField" 
                  v-model="selectedServiceId" 
                  disabled
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-if="selectedTab === 'service'" v-slot="{ componentField }" name="update_servicename">
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input 
                  type="text"  
                  placeholder="Service Name" 
                  v-bind="componentField" 
                  v-model="selectedServiceName" 
                  disabled
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-if="selectedTab === 'service'" v-slot="{ componentField }" name="update_serviceprice">
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="Price" 
                  v-bind="componentField" 
                  v-model="selectedServicePrice" 
                  disabled
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-if="selectedTab === 'service'" v-slot="{ componentField }" name="update_servicecommission">
            <FormItem>
              <FormLabel>Commission</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="Commission" 
                  v-bind="componentField" 
                  v-model="selectedServiceCommission" 
                  disabled
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-else-if="selectedTab === 'promo'" v-slot="{ componentField }" name="update_promoid">
            <FormItem>
              <FormLabel>Promo ID</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="Promo ID" 
                  v-bind="componentField" 
                  v-model="selectedPromoId" 
                  disabled
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-if="selectedTab === 'promo'" v-slot="{ componentField }" name="update_promoname">
            <FormItem>
              <FormLabel>Promo Name</FormLabel>
              <FormControl>
                <Input 
                  type="text"  
                  placeholder="Promo Name" 
                  v-bind="componentField" 
                  v-model="selectedPromoName" 
                  disabled
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-if="selectedTab === 'promo'" v-slot="{ componentField }" name="update_promoprice">
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="Price" 
                  v-bind="componentField" 
                  v-model="selectedPromoPrice" 
                  disabled
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-if="selectedTab === 'promo'" v-slot="{ componentField }" name="update_promocommission">
            <FormItem>
              <FormLabel>Commission</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="Commission" 
                  v-bind="componentField" 
                  v-model="selectedPromoCommission" 
                  disabled
                />
              </FormControl>
            </FormItem>
          </FormField>

          <div class="action-buttons">
            <Button variant="ghost" class="button" type="button" @click="openEditModal">Edit Data</Button>
            <Button variant="ghost" class="button" type="button" @click="deleteItem">Delete</Button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Popup to edit service -->
<div v-if="isEditModalOpen" class="modal-overlay">
  <div v-if="selectedTab === 'service'" class="modal-content">
    <h2 class="selected-product-title">Edit Service</h2>
    <form @submit.prevent="editGoods">
      <FormField v-slot="{ componentField }" name="new_service_name">
        <FormItem>
          <FormLabel>Service Name</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Enter Name" v-bind="componentField" v-model="selectedServiceName" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
  
      <FormField v-slot="{ componentField }" name="new_service_price">
        <FormItem>
          <FormLabel>Price</FormLabel>
          <FormControl>
            <Input type="number" min="0.00" step="0.01" placeholder="Enter Price" v-bind="componentField" v-model="selectedServicePrice" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
  
      <!-- Commission as a select dropdown -->
      <FormField v-slot="{ componentField }" name="new_service_commission">
        <FormItem>
          <FormLabel>Commission</FormLabel>
          <FormControl>
            <Select v-model="editServiceCommission">
              <SelectTrigger>
                <SelectValue placeholder="Select Commission Rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="rate in commissionRates" :key="rate.id" :value="rate.id">
                    {{ rate.rate }}%
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
  
      <div class="action-buttons">
        <Button variant="ghost" type="button" class="button" @click="closeEditModal">Cancel</Button>
        <Button variant="ghost" type="submit" class="button">Save Changes</Button>
      </div>
    </form>
  </div>
  <!-- Promo edit section remains unchanged if not relevant -->
</div>



  <!-- Popup to Add New Service -->
  <div v-if="isServiceModalOpen" class="modal-overlay">
    <div class="modal-content">
      <h2 class="selected-product-title">Add New Service</h2>
      <form @submit.prevent="addNewService">
        <FormField v-slot="{ componentField }" name="new_service_name">
          <FormItem>
            <FormLabel>Service Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter Name" v-bind="componentField" v-model="newServiceName" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="new_service_price">
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input type="number" min="0.00" step="0.01" placeholder="Enter Price" v-bind="componentField" v-model="newServicePrice" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="new_service_commission">
          <FormItem>
            <FormLabel>Commission</FormLabel>
            <FormControl>
              <Select v-model="newServiceCommission">
                <SelectTrigger>
                  <SelectValue placeholder="Select Commission Rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem 
                      v-for="rate in commissionRates" 
                      :key="rate.id" 
                      :value="rate.id">
                      {{ rate.rate }}%
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>


        <div class="action-buttons">
          <Button variant="ghost" type="button" class="button" @click="closeServiceModal">Cancel</Button>
          <Button variant="ghost" type="submit" class="button">Add Service</Button>
        </div>
      </form>
    </div>
  </div>

  <!-- Popup to Add New Promo -->
  <div v-if="isPromoModalOpen" class="modal-overlay">
    <div class="modal-content">
      <h2 class="selected-product-title">Add New Promo</h2>
      <form @submit.prevent="addNewPromo">
        <FormField v-slot="{ componentField }" name="new_promo_name">
          <FormItem>
            <FormLabel>Promo Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter Name" v-bind="componentField" v-model="newPromoName" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="new_promo_price">
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input type="number" min="0.00" step="0.01" placeholder="Enter Price" v-bind="componentField" v-model="newPromoPrice" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Commission Rate Select -->
        <div>
    <Select v-model="newPromoCommission">
      <SelectTrigger>
        <SelectValue placeholder="Select Commission Rate" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem 
            v-for="rate in commissionRates" 
            :key="rate.id" 
            :value="rate.id">
            {{ rate.rate }}%
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>

        <div class="action-buttons">
          <Button variant="ghost" type="button" class="button" @click="closePromoModal">Cancel</Button>
          <Button variant="ghost" type="submit" class="button">Add Promo</Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import NavBar from '~/components/Navbar.vue';
import { ref, computed, onMounted, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Pagination, PaginationEllipsis, PaginationFirst, PaginationLast, PaginationList, PaginationListItem, PaginationNext, PaginationPrev } from '@/components/ui/pagination';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// --- Popup states, selection, and form data ---
const isEditModalOpen = ref(false);
const isServiceModalOpen = ref(false);
const isPromoModalOpen = ref(false);

const selectedServiceId = ref('');
const selectedServiceName = ref('');
const selectedServicePrice = ref(0);
const selectedServiceCommission = ref(0);

const selectedPromoId = ref('');
const selectedPromoName = ref('');
const selectedPromoPrice = ref(0);
const selectedPromoCommission = ref(0);

const newServiceName = ref('');
const newServicePrice = ref('');
const newServiceCommission = ref('');

const newPromoName = ref('');
const newPromoPrice = ref('');
const newPromoCommission = ref('');

// API data
const services = ref([]);
const promos = ref([]);
const commissionRates = ref([]);
const isLoading = ref(false);
const error = ref(null);

// --- Pagination & Filtering Setup ---
const itemsPerPage = ref(10);
const currentPage = ref(1);
const selectedTab = ref('service');
const searchQuery = ref('');

// Compute filteredData (for simplicity, using raw arrays here)
const filteredData = computed(() => {
  let items = selectedTab.value === 'service' ? services.value : promos.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    items = items.filter(item => {
      if (selectedTab.value === 'service') {
        return (
          item.name.toLowerCase().includes(query) ||
          item.id.toString().includes(query)
        );
      } else {
        return (
          (item.promo || '').toLowerCase().includes(query) ||
          item.id.toString().includes(query)
        );
      }
    });
  }
  return items;
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage.value) || 1;
});

const filteredItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredData.value.slice(start, start + itemsPerPage.value);
});

const emptyRows = computed(() => {
  return Math.max(0, itemsPerPage.value - filteredItems.value.length);
});

const onPageChange = (page) => {
  if (page < 1) {
    currentPage.value = 1;
  } else if (page > totalPages.value) {
    currentPage.value = totalPages.value;
  } else {
    currentPage.value = page;
  }
};

watch(searchQuery, () => {
  currentPage.value = 1;
});

// --- Data Fetching Functions ---
const fetchData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    if (selectedTab.value === 'service') {
      const response = await fetch('/api/services/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      services.value = data.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        commission: service.CommissionRate ? service.CommissionRate.rate : 0
      }));
    } else {
      const response = await fetch('/api/promos/promos');
      if (!response.ok) throw new Error('Failed to fetch promos');
      const data = await response.json();
      promos.value = data.map(promo => ({
        id: promo.id,
        promo: promo.promo,
        price: promo.price,
        commission: promo.CommissionRate ? promo.CommissionRate.rate : 0
      }));
    }
  } catch (err) {
    error.value = err.message;
    console.error('Error fetching data:', err);
  } finally {
    isLoading.value = false;
  }
};

const fetchCommissionRates = async () => {
  try {
    const { data, error } = await useFetch('/api/commissionrates');
    if (error.value) {
      console.error("Error fetching commission rates:", error.value);
    } else {
      commissionRates.value = data.value;
      console.log("Commission rates:", commissionRates.value);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};

watch(selectedTab, () => {
  fetchData();
  currentPage.value = 1;
});

onMounted(() => {
  fetchData();
  fetchCommissionRates();
});

// --- Selection and Edit Functions ---
const selectGoods = (item) => {
  if (selectedTab.value === 'service') {
    selectedServiceId.value = item.id;
    selectedServiceName.value = item.name;
    selectedServicePrice.value = item.price;
    selectedServiceCommission.value = item.commission;
    editServiceCommission.value = item.commission_rate_id;
  } else {
    selectedPromoId.value = item.id;
    selectedPromoName.value = item.promo;
    selectedPromoPrice.value = item.price;
    selectedPromoCommission.value = item.commission;
  }
};

const openEditModal = () => {
  if (
    (selectedTab.value === 'service' && selectedServiceId.value) || 
    (selectedTab.value === 'promo' && selectedPromoId.value)
  ) {
    isEditModalOpen.value = true;
  }
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

const editGoods = async () => {
  try {
    if (selectedTab.value === 'service') {
      const response = await fetch(`/api/services/services`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedServiceName.value,
          price: selectedServicePrice.value,
          commission: editServiceCommission.value  // Use the updated ref
        }),
      });
      if (!response.ok) throw new Error('Failed to update service');
    } else {
      const response = await fetch(`/api/promos/promos`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedPromoName.value,
          price: selectedPromoPrice.value,
          commission: selectedPromoCommission.value
        }),
      });
      if (!response.ok) throw new Error('Failed to update promo');
    }
    await fetchData();
    closeEditModal();
  } catch (err) {
    console.error('Error updating item:', err);
  }
};



const deleteItem = async () => {
  if (!confirm('Are you sure you want to delete this item?')) return;
  try {
    if (selectedTab.value === 'service' && selectedServiceId.value) {
      const response = await fetch('/api/services/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedServiceId.value }),
      });
      if (!response.ok) throw new Error('Failed to delete service');
      selectedServiceId.value = '';
      selectedServiceName.value = '';
      selectedServicePrice.value = 0;
      selectedServiceCommission.value = 0;
    } else if (selectedTab.value === 'promo' && selectedPromoId.value) {
      const response = await fetch('/api/promos/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedPromoId.value }),
      });
      if (!response.ok) throw new Error('Failed to delete promo');
      selectedPromoId.value = '';
      selectedPromoName.value = '';
      selectedPromoPrice.value = 0;
      selectedPromoCommission.value = 0;
    }
    await fetchData();
  } catch (err) {
    console.error('Error deleting item:', err);
  }
};

// --- Popup Functions for Adding New Items ---
const openServiceModal = () => {
  newServiceName.value = '';
  newServicePrice.value = '';
  newServiceCommission.value = '';
  isServiceModalOpen.value = true;
};

const closeServiceModal = () => {
  isServiceModalOpen.value = false;
};

const addNewService = async () => {
  if (!newServiceName.value || !newServicePrice.value || !newServiceCommission.value) {
    alert('Please fill in all fields');
    return;
  }
  try {
    const response = await fetch('/api/services/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newServiceName.value,
        price: newServicePrice.value,
        commission: newServiceCommission.value
      }),
    });
    if (!response.ok) throw new Error('Failed to add service');
    await fetchData();
    closeServiceModal();
  } catch (err) {
    console.error('Error adding service:', err);
  }
};

const openPromoModal = () => {
  newPromoName.value = '';
  newPromoPrice.value = '';
  newPromoCommission.value = '';
  isPromoModalOpen.value = true;
};

const closePromoModal = () => {
  isPromoModalOpen.value = false;
};

const addNewPromo = async () => {
  if (!newPromoName.value || !newPromoPrice.value || !newPromoCommission.value) {
    alert('Please fill in all fields');
    return;
  }
  try {
    const response = await fetch('/api/promos/promos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newPromoName.value,
        price: newPromoPrice.value,
        commission: newPromoCommission.value
      }),
    });
    if (!response.ok) throw new Error('Failed to add promo');
    await fetchData();
    closePromoModal();
  } catch (err) {
    console.error('Error adding promo:', err);
  }
};
</script>


  <style scoped>

    .title {
      font-size: 48px;
      font-weight: bolder;
    }


  .center-components {
    margin-top: 10px;
    margin-left: 2%;
    margin-right: 2%;
    margin-bottom: 50px;
  }

    /* Flexbox for dropdown, input, filter, and other buttons */
    .flex-components {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      margin-top: 10px;
      width: 100%; 
    }

    /* Left side of table (dropdown, input and filter) */
    .left-side {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-start;
      width: 66.66%;
    }

    /* Right side of table (buttons) */
    .right-side {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-end;
      width: 33.33%;

    }

    /* Table div and Edit Selected Product div */
    .table-product-container {
      display: flex;
      justify-content: space-between;
      gap: 20px;
    }

    /* Table container */
    .container-table {
      flex-basis: 66.66%; 
      border: 1px solid #000000;
      border-radius: 8px;
      padding: 16px;
    }

    /* Edit Selected Product container */
    .container-selectedproduct {
      flex-basis: 33.33%;
      border: 1px solid #000000;
      border-radius: 8px;
      padding: 16px;

    }

    /* Dropdown select trigger */
    .dropdown-trigger {
      width: 200px;
    }

    /* Search input */
    .input_search {
      width: 350px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    /* All black buttons  */
    .button {
      display: flex;
      align-items: center;
      padding: 8px;
      margin: 2px;
      background-color: #000000;
      color: #ffffff;
    }

    .icon-small {
      width: 16px;
      height: 16px;
    }


    .table-content {
      flex-grow: 1;
    }

    /* Pagination (might remove)  */
    .pagination-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 20px; 
    }

    /* Pagination (might remove)  */
    .pagination-list {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }

    /* Pagination (might remove)  */
    .pagination-button {
      width: 40px;
      height: 40px;
    }

    /* Specifically for H2s */
    .selected-product-title {
      font-size: 20px;
      margin-bottom: 16px;
      font-weight: bolder;
    }

    /* Cancel and Save Changes button */
    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 20px;
    }

    .cancel-button {
      color: #ffffff;
      background-color: #dc2626;
    }


    /* Popups */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      width: 400px;
      max-width: 90%;
    }

    .modal-action-buttons {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }

  </style>