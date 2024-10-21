<template>
  <NavBar />

  <div class="center-components">
    <h1 class="title">Inventory</h1>

    <!-- Flex container for dropdown, input, filter and buttons -->
    <div class="flex-components">
      <div class="left-side">
        <!-- Dropdown for selecting product type -->
        <!-- This is for the table by the way -->
        <Select v-model="selectedType">
          <SelectTrigger class="dropdown-trigger">
            <SelectValue placeholder="Select Item to Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
            <!-- Dynamically create SelectItem for each product -->
              <SelectItem  value="all">All</SelectItem>
              <SelectItem 
                v-for="productType in product_types" 
                :key="productType.type" 
                :value="productType.type"
              >
                {{ productType.type }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <!-- Search input -->
        <Input placeholder="Search Product Name..." class="input_search" v-model="searchQuery"/>
        <Select v-model="selectedFilter">
        <SelectTrigger class="w-[auto]">
          <SelectValue placeholder="Select filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="option in filterOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>
      </div>

      <div class="right-side">
        <!-- Buttons for adding new product/supplier and enable editing in form 'edit selected product' -->
        <Button variant="ghost" class="button" @click="openTypeModal">Add New Type</Button>
        <Button variant="ghost" class="button" @click="openProductModal">Add New Product</Button>
        <Button variant="ghost" class="button" @click="openSupplierModal">Add New Supplier</Button>
      </div>
    </div>

    <!-- Table for displaying products -->
    <div class="table-product-container">
      <div class="container-table">
        <div class="table-content">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>Supplier Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="product in paginatedProducts" 
                :key="product.id" 
                @click="selectProduct(product)"
              >
              <!-- I changed product.stock to StockinProduct and product.CommissionRate to product.commission-->
                <TableCell>{{ product.id }}</TableCell>
                <TableCell>{{ product.name }}</TableCell>
                <TableCell>{{ product.ProductType }}</TableCell>
                <TableCell>{{ product.cost }}</TableCell>
                <TableCell>{{ product.StockinProduct }}</TableCell>
                <TableCell>{{ getStockStatus(product) }}</TableCell>
                <TableCell>{{ product.commission }}%</TableCell>
                <TableCell>{{ product.supplierName }}</TableCell>
              </TableRow>
              <!-- Populate empty rows if current row count is les than 10 -->
              <TableRow v-for="index in emptyRows" :key="'empty-' + index" class="empty-row">
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Pagination controls (might delete this part) -->
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

      <!-- Edit Selected Product container -->
      <div class="container-selectedproduct">
        <h2 class="selected-product-title">Edit Selected Product</h2>

        <form id="update_product_panel"  >
          <FormField v-slot="{ componentField }" name="update_id">
            <FormItem>
              <FormLabel>Product ID</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="Product ID" 
                  v-bind="componentField" 
                  v-model="selectedProductId" 
                  disabled
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="update_product_name">
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Name" v-bind="componentField" v-model="selectedProductName"  />
              </FormControl>
            </FormItem>
          </FormField>

          <!-- Remember this 1 -->
          <FormField v-slot="{ componentField }" name="update_product_type">
            <FormItem>
              <FormLabel>Product Type</FormLabel>
              <FormControl>
                <Select v-bind="componentField" v-model="selectedProductType" >
                  <SelectTrigger class="dropdown-trigger" >
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <!-- Dynamically create SelectItem for each product -->
                      <SelectItem 
                        v-for="productType in product_types" 
                        :key="productType.type" 
                        :value="productType.type"
                      >
                        
                        {{ productType.type }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="update_product_cost">
            <FormItem>
              <FormLabel>Product Cost</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="Enter Cost" v-bind="componentField" v-model="selectedCost"/>
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="update_product_stock">
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="Enter Stock-in Value" v-bind="componentField" v-model="selectedStock"/>
              </FormControl>
            </FormItem>
          </FormField>

          <!-- Remember this 2 -->
          <FormField v-slot="{ componentField }" name="update_product_supplier_name">
          <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="dropdown-trigger">
                    <SelectValue placeholder="Supplier Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                    <!-- Dynamically create SelectItem for each supplier -->
                      <SelectItem 
                        v-for="supplier in supplier_names" 
                        :key="supplier.supplier_name" 
                        :value="supplier.supplier_name"
                      >
                        {{ supplier.supplier_name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
        </FormField>

          <FormField v-slot="{ componentField }" name="update_product_warning_level">
            <FormItem>
              <FormLabel>Warning Level</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="Enter Warning Level" v-bind="componentField" v-model="selectedCritical" />
              </FormControl>
            </FormItem>
          </FormField>
          
          <FormField v-slot="{ componentField }" name="update_product_commission_rate">
            <FormItem>
              <FormLabel>Commission Rate</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="Enter Commission Rate" v-bind="componentField" v-model="selectedCommissionRate"/>
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

    <!-- Popup to Add New Product Tyoe -->
    <div v-if="isEditModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h2 class="selected-product-title">Edit Existing Product</h2>

        <form @submit.prevent="editExistingProduct">
          <FormField v-slot="{ componentField }" name="edited_product_name">
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter Product Name" v-bind="componentField" v-model="selectedProductName" />
                </FormControl>
              </FormItem>
          </FormField>

          <!-- Dynamic Drop Down For Product Type -->
          <FormField v-slot="{ componentField }" name="edited_product_type">
            <FormItem>
              <FormLabel>Product Type</FormLabel>
              <FormControl>
                <Select v-bind="componentField" v-model="selectedProductType" >
                  <SelectTrigger class="dropdown-trigger" >
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <!-- Dynamically create SelectItem for each product -->
                      <SelectItem 
                        v-for="productType in product_types" 
                        :key="productType.type" 
                        :value="productType.type"
                      >
                        
                        {{ productType.type }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="edited_product_cost">
              <FormItem>
                <FormLabel>Product Cost</FormLabel>
                <FormControl>
                  <Input type="number" min = "0" placeholder="Enter Product Cost" v-bind="componentField" v-model="selectedCost"/>
                </FormControl>
                <FormMessage />
              </FormItem>
          </FormField>
          
          <FormField v-slot="{ componentField }" name="edited_stock_level">
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="Enter Stock" v-bind="componentField" v-model="selectedStock"/>
                </FormControl>
              </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="supplier_name">
            <FormItem>
                <FormLabel>Supplier Name</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger class="dropdown-trigger">
                      <SelectValue placeholder="Supplier Name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                      <!-- Dynamically create SelectItem for each supplier -->
                        <SelectItem 
                          v-for="supplier in supplier_names" 
                          :key="supplier.supplier_name" 
                          :value="supplier.supplier_name"
                        >
                          {{ supplier.supplier_name }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="edited_warning_level">
              <FormItem>
                <FormLabel>Warning Level</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="Enter Warning Level" v-bind="componentField" v-model="selectedCritical"/>
                </FormControl>
              </FormItem>
            </FormField>

          <FormField v-slot="{ componentField }" name="edited_commission_rate">
              <FormItem>
                <FormLabel>Commission Rate</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="Enter Commision Rate" v-bind="componentField" v-model="selectedCommissionRate"/>
                </FormControl>
              </FormItem>
          </FormField>

          <div class="modal-action-buttons">
            <Button variant="ghost" type="button" @click="isEditModalOpen = false">Cancel</Button>
            <Button variant="ghost" type="submit" >Edit Product</Button>
          </div>
        </form>
      </div>
    </div>


  <!-- Popup to Add New Product Tyoe -->
  <div v-if="isTypeModalOpen" class="modal-overlay">
    <div class="modal-content">
      <h2 class="selected-product-title">Add New Type</h2>
      <form @submit.prevent="addNewType">
        <FormField v-slot="{ componentField }" name="new_type">
          <FormItem>
            <FormLabel>New Type</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter Type" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <div class="action-buttons">
          <Button variant="ghost" type="button" class="button" @click="isTypeModalOpen = false">Cancel</Button>
          <Button variant="ghost" type="submit" class="button">Add Type</Button>
        </div>
      </form>
    </div>
  </div>

  <!-- Popup to Add New Supplier -->
  <div v-if="isSupplierModalOpen" class="modal-overlay">
    <div class="modal-content">
      <h2 class="selected-product-title">Add New Supplier</h2>

      <form @submit.prevent="addNewSupplier">
        <!-- <FormField v-slot="{ componentField }" name="supplier_id">
          <FormItem>
            <FormLabel>Supplier ID</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField> -->

        <FormField v-slot="{ componentField }" name="new_supplier_name">
          <FormItem>
            <FormLabel>Supplier Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter Supplier Name" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="supplier_address">
          <FormItem>
            <FormLabel>Supplier Address</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter Supplier Address" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="contact_number">
          <FormItem>
            <FormLabel>Contact Number</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter Contact Number" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>

        <div class="action-buttons">
          <Button variant="ghost" type="button" @click="isSupplierModalOpen = false">Cancel</Button>
          <Button variant="ghost" type="submit" class="button">Add Supplier</Button>
        </div>
      </form>
    </div>
  </div>

  <!-- Popup to Add New Product -->
  <div v-if="isProductModalOpen" class="modal-overlay">
    <div class="modal-content">
      <h2 class="selected-product-title">Add New Product</h2>

      <form @submit.prevent="addNewProduct">
        <!-- <FormField v-slot="{ componentField }" name="product-id">
          <FormItem>
            <FormLabel>Product ID</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField> -->

        <FormField v-slot="{ componentField }" name="new_product_name">
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Product Name" v-bind="componentField" />
              </FormControl>
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="product_type">
          <FormItem>
              <FormLabel>Product Type</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="dropdown-trigger">
                    <SelectValue placeholder="Product Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                    <!-- Dynamically create SelectItem for each product -->
                      <SelectItem 
                        v-for="productType in product_types" 
                        :key="productType.type" 
                        :value="productType.type"
                      >
                        
                        {{ productType.type }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="new_product_cost">
            <FormItem>
              <FormLabel>Product Cost</FormLabel>
              <FormControl>
                <Input type="number" min = "0" placeholder="Enter Product Cost" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
        </FormField>
        
        <FormField v-slot="{ componentField }" name="new_stock_level">
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="Enter Stock" v-bind="componentField" />
              </FormControl>
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="supplier_name">
          <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="dropdown-trigger">
                    <SelectValue placeholder="Supplier Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                    <!-- Dynamically create SelectItem for each supplier -->
                      <SelectItem 
                        v-for="supplier in supplier_names" 
                        :key="supplier.supplier_name" 
                        :value="supplier.supplier_name"
                      >
                        {{ supplier.supplier_name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="warning_level">
            <FormItem>
              <FormLabel>Warning Level</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="Enter Warning Level" v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>

        <FormField v-slot="{ componentField }" name="new_commission_rate">
            <FormItem>
              <FormLabel>Commission Rate</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="Enter Commision Rate" v-bind="componentField" />
              </FormControl>
            </FormItem>
        </FormField>

        <div class="modal-action-buttons">
          <Button variant="ghost" @click="closeModal">Cancel</Button>
          <Button variant="ghost" type="submit">Add Product</Button>
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
import { ArrowDownWideNarrow } from 'lucide-vue-next';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
// SAMPLE FORM (NOTE: BOTBOT RA NI)
import { useForm } from 'vee-validate'
  const form = useForm()
  let products = ref([]);
  // Fetch product details of selected item
  // Set up For the search filtering 
  const searchQuery = ref('');
  const selectedFilter = ref(null)
  //ID, Name and type of chosen row from table
  const selectedProductId = ref(null); 
  const selectedProductName = ref('');
  const selectedProductType = ref('');
  const selectedCost = ref('');
  const selectedStock = ref('');
  const selectedCritical = ref('');
  const selectedCommissionRate = ref('');
  const selectedType = ref('all'); //default
  //Variable for Drop Down Variables
  const supplier_names = ref([]);
  const product_types = ref([]);
  //For pagination (may delete later)
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  //Keep track whether input is editable or not
  const isEditable = ref(false);

  //For pop ups
  const isEditModalOpen = ref(false)
  const isTypeModalOpen = ref(false);
  const isProductModalOpen = ref(false);
  const isSupplierModalOpen = ref(false);
  // Set up the filter options
  const filterOptions = [
  { value: 'id-asc', label: 'Product ID: Ascending' },
  { value: 'id-desc', label: 'Product ID: Descending' },
  { value: 'name-asc', label: 'Product Name: A to Z' },
  { value: 'name-desc', label: 'Product Name: Z to A' },

  ];

  // Filter Function
  const filteredProducts = computed(() => {
    // Initialize the filtered products array with all products
    let filtered = products.value;

    // Filter based on the selected product type
    if (selectedType.value && selectedType.value !== 'all') {
      filtered = filtered.filter(product => 
        product.ProductType.toLowerCase() === selectedType.value.toLowerCase()
      );
    }

    // Filter based on the search query
    if (searchQuery.value) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }

    // Sort the filtered products based on the selected filter
    if (selectedFilter.value === 'id-asc') {
      filtered.sort((a, b) => a.id - b.id);
    } else if (selectedFilter.value === 'id-desc') {
      filtered.sort((a, b) => b.id - a.id);
    } else if (selectedFilter.value === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedFilter.value === 'name-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (selectedFilter.value === 'supplier-asc') {
      filtered.sort((a, b) => a.supplierName.localeCompare(b.supplierName));
    } else if (selectedFilter.value === 'supplier-desc') {
      filtered.sort((a, b) => b.supplierName.localeCompare(a.supplierName));
    }

    return filtered;
  });

  // Open new page 
  const onPageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages.value) currentPage.value = newPage;
  };

    //Open popup for editing existing products
    const openEditModal = () => {

    //Take data from the right container

    isEditModalOpen.value = true;
  };

  //Close popup
  const closeEditModal = () => {
    isEditModalOpen.value = false;
  };

  //Open popup for adding new products
  const openProductModal = () => {
    isProductModalOpen.value = true;
  };

  //Close popup
  const closeProductModal = () => {
    isProductModalOpen.value = false;
  };

  //Open popup for adding new supplier
  const openSupplierModal = () => {
    isSupplierModalOpen.value = true;
  };

  //Close popup
  const closeSupplierModal = () => {
    isSupplierModalOpen.value = false;
  };
  //Open popup for adding new products
  const openTypeModal = () => {
    isTypeModalOpen.value = true;
  };
  //Close popup
    const closeTypeModal = () => {
    isTypeModalOpen.value = false;
  };

  // Add New Product
  const addNewProduct = form.handleSubmit(async (values) => {
    try {
      const response = await $fetch('/api/inventory/product', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: values,
      });
    } catch (error) {
      console.error('Add Product failed:', error);
    }
    fetchProductDetails()
    closeProductModal();
  });
  // Add New Product Type addNewProductType ?
  const addNewType = form.handleSubmit(async (values) => {
    try {
      const response = await $fetch('/api/inventory/product_type', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: values,
      });
    } catch (error) {
      console.error('Add Supplier failed:', error);
    }
    fetchProducts();
    closeTypeModal()
  });
  // Add New Supplier
  const addNewSupplier = form.handleSubmit(async (values) => {
    try {
      const response = await $fetch('/api/inventory/supplier', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: values,
      });
    } catch (error) {
      console.error('Add Supplier failed:', error);
    }
    fetchSuppliers();
    fetchProductDetails();
    closeSupplierModal();
  });
  
  // NEEDS A LOT OF FIXING IDK WHAT THE HELL IS HAPPENING HERE NGL
  // Define the function to handle the form submission
  const editExistingProduct = form.handleSubmit(async (values) => {
    // Add the selectedProductId to the body
    const updatedValues = {
      // ...values,                      // Spread the existing values
      update_id: selectedProductId.value,    // Add selectedProductId to the body
      update_product_name: values.edited_product_name || selectedProductName.value, 
      update_product_type: values.edited_product_type || selectedProductType.value,
      update_product_cost: values.edited_product_cost || selectedCost.value,
      update_product_stock: values.edited_product_stock || selectedStock.value,
      update_product_supplier_name: values.edited_product_supplier_name,
      update_product_warning_level: values.edited_product_warning_level || selectedCritical.value,
      update_product_commission_rate: values.edited_product_commission_rate || selectedCommissionRate.value,
    };

    let missingFields = [];

    // Check if any field is still blank after checking both sources (values and v-models)
    if (!updatedValues.update_product_name) missingFields.push("Product Name");
    if (!updatedValues.update_product_type) missingFields.push("Product Type");
    if (!updatedValues.update_product_cost) missingFields.push("Product Cost");
    if (!updatedValues.update_product_stock) missingFields.push("Product Stock");
    if (!updatedValues.update_product_warning_level) missingFields.push("Product Warning Level");
    if (!updatedValues.update_product_commission_rate) missingFields.push("Product Commission Rate");

    // If any required fields are missing, prompt the user and do not send the request
    if (missingFields.length > 0) {
      alert(`Missing data for: ${missingFields.join(", ")}`);
      return;  // Stop the function here to prevent sending the request
    }

    console.log("BRO WHAT THE HECK");
    try {
      const response = await $fetch('/api/inventory/product', {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedValues), // Stringify the combined object
      });

      console.log("This is the response");
      console.log(response);
    } catch (error) {
      console.error('Update Product failed:', error);
    }

    fetchProductDetails();
    closeProductModal();
    resetSelected();
  });

  // Fill up supplier names dropdown
  async function fetchSuppliers() {
    try {
      const response = await $fetch('/api/inventory/supplier', {
        method: 'GET',
        headers: { "Content-Type": "application/json" },
      });
      supplier_names.value = response;
      console.log(response)
      return response
    } catch (error) {
      console.error('Get Supplier failed:', error);
      return {}
    }
  }
  fetchSuppliers();
  // Fill up product type dropdown
  async function fetchProducts() {
    try {
      const response = await $fetch('/api/inventory/product', {
        method: 'GET',
        
      });
      product_types.value = response;
      console.log(response)
      return response
    } catch (error) {
      console.error('Get Product Type failed:', error);
      return {}
    }
  }
  fetchProducts();
  // To fetch product details
  async function fetchProductDetails() {
    try {
      const response = await $fetch('/api/inventory/populate', {
        method: 'GET',
        headers: { "Content-Type": "application/json" },
      });
      products.value = response;
      // console.log("This is to confirm that there actually is a products data")
      // console.log(response)
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }
  fetchProductDetails()

  // Get Status For Table
  function getStockStatus(product) {
      return product.StockinProduct < product.critical_level 
        ? "Critical - Restock Needed" 
        : "Normal";
     }
	// Paginate the filtered products
	const paginatedProducts = computed(() => {
	  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
	  // Use filteredProducts for pagination, not products directly
	  return filteredProducts.value.slice(startIndex, startIndex + itemsPerPage.value);
	});
  const emptyRows = computed(() => Math.max(0, itemsPerPage.value - paginatedProducts.value.length));
  const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value));
  const selectProduct = (product) => {
    selectedProductId.value = product.id;
    selectedProductName.value = product.name;
    selectedProductType.value = product.type;
    selectedCost.value = product.cost
    selectedStock.value = product.StockinProduct
    selectedCritical.value = product.critical_level
    selectedCommissionRate.value = product.commission
    console.log("New Select")
    console.log(selectedProductId.value)
    console.log(selectedProductName.value)
    console.log(selectedProductType.value)
    console.log(selectedCost.value)
    console.log(selectedStock.value)
    console.log(selectedCritical.value)
    console.log(selectedCommissionRate.value)
  };
  function resetSelected() {
    // Reset selected values
    selectedProductId.value = "";
    selectedProductName.value = "";
    selectedProductType.value = "";
    selectedCost.value = "";
    selectedStock.value = "";
    selectedCritical.value = "";
    selectedCommissionRate.value = "";
  }
  
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
    width: 250px;
    padding: 8px;
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