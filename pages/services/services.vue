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
              <TableHead v-if="selectedTab === 'service'">Service Type</TableHead>

              <TableHead v-if="selectedTab === 'promo'">Promo ID</TableHead>
              <TableHead v-if="selectedTab === 'promo'">Promo Name</TableHead>
              <TableHead v-if="selectedTab === 'promo'">Price</TableHead> 
              <TableHead v-if="selectedTab === 'promo'">Commission</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow 
              v-for="(item, index) in (selectedTab === 'service' ? services : promos)" 
              :key="item.id" 
              @click="selectGoods(item)"
                >
              <TableCell>{{ item.id }}</TableCell>
              <TableCell>{{ item.name }}</TableCell>
              <TableCell>{{ item.price }}</TableCell>
              <TableCell>{{ item.commission }}</TableCell>
              <TableCell v-if="selectedTab === 'service'">{{ item.type }}</TableCell>
            </TableRow>
              <!-- Empty rows for pagination -->
              <TableRow v-for="index in emptyRows" :key="'empty-' + index" class="empty-row">
                <TableCell>&nbsp;</TableCell>
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
    <!-- Edit Selected Serivce/Promo container -->
    <div class="container-selectedproduct">
        <h2 class="selected-product-title">Edit Selected {{tabTitle}}</h2>

        <form id="update_panel"  >
          
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

        <FormField v-if="selectedTab === 'service'" v-slot="{ componentField }" name="update_servicetype">
        <FormItem>
          <FormLabel>Service Type</FormLabel>
          <FormControl>
            <Input 
              type="text"  
              placeholder="Service Type" 
              v-bind="componentField" 
              v-model="selectedServiceType" 
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
              <Input type="text" placeholder="Enter Name" v-bind="componentField" v-model="selectedServiceName"/>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="new_service_price">
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input type="number" min="0.00" step="0.01" placeholder="Enter Price" v-bind="componentField" v-model="selectedServicePrice"/>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="new_service_commission">
          <FormItem>
            <FormLabel>Commission</FormLabel>
            <FormControl>
              <Input type="number" min="0.00" step="0.01" placeholder="Enter Commission" v-bind="componentField" v-model="selectedServiceCommission"/>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="service_type">
          <FormItem>
            <FormLabel>Service Type</FormLabel>
            <FormControl>
              <Input type="text" min="0.00" step="0.01" placeholder="Enter Service Type" v-bind="componentField" v-model="selectedServiceType"/>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>


        <div class="action-buttons">
          <Button variant="ghost" type="button" class="button" @click="closeEditModal">Cancel</Button>
          <Button variant="ghost" type="submit" class="button">Add Service</Button>
        </div>
      </form>
    </div>

    <div v-if="selectedTab === 'promo'" class="modal-content">
      <h2 class="selected-product-title">Edit Promo</h2>
      <form @submit.prevent="editGoods">

        <FormField v-slot="{ componentField }" name="new_promo_name">
          <FormItem>
            <FormLabel>Promo Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter Name" v-bind="componentField" v-model="selectedPromoName"/>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="new_promo_price">
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input type="number" min="0.00" step="0.01" placeholder="Enter Price" v-bind="componentField" v-model="selectedPromoPrice"/>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="new_promo_commission">
          <FormItem>
            <FormLabel>Commission</FormLabel>
            <FormControl>
              <Input type="number" min="0.00" step="0.01" placeholder="Enter Commission" v-bind="componentField" v-model="selectedPromoCommission"/>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="action-buttons">
          <Button variant="ghost" type="button" class="button" @click="closeEditModal">Cancel</Button>
          <Button variant="ghost" type="submit" class="button">Add Service</Button>
        </div>
      </form>
    </div>
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
              <Input type="text" placeholder="Enter Name" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="new_service_name">
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input type="number" min="0.00" step="0.01" placeholder="Enter Price" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="new_service_commission">
          <FormItem>
            <FormLabel>Commission</FormLabel>
            <FormControl>
              <Input type="number" min="0.00" step="0.01" placeholder="Enter Commission" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="service_type">
          <FormItem>
            <FormLabel>Service Type</FormLabel>
            <FormControl>
              <Input type="text" min="0.00" step="0.01" placeholder="Enter Service Type" v-bind="componentField" />
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
              <Input type="text" placeholder="Enter Name" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="new_service_name">
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input type="number" min="0.00" step="0.01" placeholder="Enter Price" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="new_service_commission">
          <FormItem>
            <FormLabel>Commission</FormLabel>
            <FormControl>
              <Input type="number" min="0.00" step="0.01" placeholder="Enter Commission" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>


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
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Pagination, PaginationEllipsis, PaginationFirst, PaginationLast, PaginationList, PaginationListItem, PaginationNext, PaginationPrev } from '@/components/ui/pagination';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'

//Declare popups
const isEditModalOpen = ref(false)
const isServiceModalOpen = ref(false)
const isPromoModalOpen = ref(false)

//Selected item from tabl
const selectedServiceName = ref('');
const selectedServiceId = ref('');
const selectedServicePrice = ref(0);
const selectedServiceCommission = ref(0);
const selectedServiceType = ref('');

const selectedPromoId = ref('');
const selectedPromoName = ref('');
const selectedPromoPrice = ref(0);
const selectedPromoCommission = ref(0);


//Change H1 depending on tab chosen
const selectedTab = ref('service')
const tabTitles = {
  service: 'Services',
  promo: 'Promos'
}
const tabTitle = computed(() => tabTitles[selectedTab.value])

//Change placeholder in input depending on tab chosen
const inputPlaceholders = {
  service: 'Search services...',
  promo: 'Searcn promos...'
}
const inputPlaceholder = computed(() => inputPlaceholders[selectedTab.value])



//Edit Service/Promo
const openEditModal = () => {
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const editGoods = () => {
  // Add logic for editng service/promo in db  
  closeEditModal()
}

//Add Service Popup
const openServiceModal = () => {
  isServiceModalOpen.value = true
}

const closeServiceModal = () => {
  isServiceModalOpen.value = false
}

const addNewService = () => {
  // Add logic for adding service to db  
  closeServiceModal()
}

//Add Promo Popup
const openPromoModal = () => {
  isPromoModalOpen.value = true
}

const closePromoModal = () => {
  isPromoModalOpen.value = false
}

const addNewPromo = () => {
  // Add logic for adding service to db  
  closePromoModal()
}

const searchQuery = ref('')

// Display data depending on tab
const selectGoods = (item) => {

  if (selectedTab.value === 'service') {
    selectedServiceId.value = item.id;
    selectedServiceName.value = item.name;
    selectedServicePrice.value = item.price;
    selectedServiceCommission.value = item.commission;
    selectedServiceType.value = item.type;
  } else {
    selectedPromoId.value = item.id;
    selectedPromoName.value = item.name;
    selectedPromoPrice.value = item.price;
    selectedPromoCommission.value = item.commission;
  }
};

//Sample data
const services = [
  { id: 1, name: "Swedish Massage", price: 250, commission: 20, type: "Massage" },
  { id: 2, name: "Hot Stone Massage", price: 500, commission: 50, type: "Massage" },
  { id: 3, name: "Deep Tissue Massage", price: 300, commission: 30, type: "Massage" },
  { id: 4, name: "Facial Treatment", price: 300, commission: 30, type: "Facial" },
  { id: 5, name: "Aromatherapy Massage", price: 200, commission: 15, type: "Massage" },
  { id: 6, name: "Manicure & Pedicure", price: 150, commission: 15, type: "Nail Care" },
  { id: 7, name: "Body Scrub", price: 150, commission: 15, type: "Body Treatment" }

];

const promos = [
  { id: 1, name: "Summer Glow Package", price: 1200, commission: 120 },
  { id: 2, name: "Relaxation Duo", price: 1500, commission: 150 },
  { id: 3, name: "Skin Rejuvenation", price: 1100, commission: 110 },
  { id: 4, name: "Couples Therapy", price: 3500, commission: 350 },
  { id: 5, name: "Pamper Package", price: 1300, commission: 130 },
];
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