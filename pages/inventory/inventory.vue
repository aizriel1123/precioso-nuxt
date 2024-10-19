<template>
  <NavBar />

  <div class="center-components">
    <h1 class="title">Inventory</h1>

    <!-- Flex container for dropdown, input, filter and buttons -->
    <div class="flex-components">
      <div class="left-side">
        <!-- Dropdown for selecting product type -->
        <Select v-model="selectedType">
          <SelectTrigger class="dropdown-trigger">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="products">Products</SelectItem>
              <SelectItem value="promos">Promos</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <!-- Search input -->
        <Input placeholder="Search Product Name..." class="input-search" v-model="searchQuery"/>
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
                <TableHead>Warning Level</TableHead>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
              v-for="product in paginatedProducts" 
                :key="product.id" 
                @click="selectProduct(product)"
              >
                <TableCell>{{ product.id }}</TableCell>
                <TableCell>{{ product.name }}</TableCell>
                <TableCell>{{ product.type }}</TableCell>
                <TableCell>{{ product.cost }}</TableCell>
                <TableCell>{{ product.stock }}</TableCell>
                <TableCell>{{ product.warningLevel }}</TableCell>
                <TableCell>{{ product.supplierName }}</TableCell>
                <TableCell>{{ product.commissionRate }}%</TableCell>
                <TableCell>{{ product.status }}</TableCell>
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
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Pagination controls (might delete this part) -->
        <div class="pagination-wrapper">
          <div class="mt-4 flex justify-center items-center">
      <Pagination 
        v-slot="{ page }" 
        :total="totalPages" 
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
        </div>
      </div>

      <!-- Edit Selected Product container -->
      <div class="container-selectedproduct">
        <h2 class="selected-product-title">Edit Selected Product</h2>

        <form @submit.prevent="onSubmit" class="form" noValidate>
          <FormField v-slot="{ componentField }" name="product-id">
            <FormItem>
              <FormLabel>Product ID</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="Product ID" v-bind="componentField" v-model="selectedProductId" disabled/>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="product-name">
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Product Name" v-bind="componentField" v-model="selectedProductName"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="type">
          <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                  <Select v-bind="componentField" :value="selectedProductType" >
                      <SelectTrigger class="dropdown-trigger2">
                          <SelectValue :placeholder="selectedProductType ? selectedProductType : 'Select an option'" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectGroup>
                              <SelectItem value="services">Services</SelectItem>
                              <SelectItem value="products">Products</SelectItem>
                              <SelectItem value="promos">Promos</SelectItem>
                          </SelectGroup>
                      </SelectContent>
                  </Select>
              </FormControl>
              <FormMessage />
          </FormItem>
      </FormField>

            <FormField v-slot="{ componentField }" name="cost">
              <FormItem>
                <FormLabel>Cost</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="Enter Stock-in Value" v-bind="componentField" v-model="selectedCost"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

          <FormField v-slot="{ componentField }" name="stock-in">
            <FormItem>
              <FormLabel>Stock-in</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="Enter Stock-in Value" v-bind="componentField" v-model="selectedStockIn"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="warning-level">
            <FormItem>
              <FormLabel>Warning Level</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="Enter Warning Level" v-bind="componentField" v-model="selectedWarningLevel"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="supplier-name">
            <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Supplier Name" v-bind="componentField" class="w-full input-suppliername" v-model="selectedSupplierName"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="commission-rate">
            <FormItem>
              <FormLabel>Commission Rate</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="Enter Warning Level" v-bind="componentField" v-model="selectedCommissionRate"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="action-buttons">
            <Button variant="ghost" type="button" class="cancel-button" @click="onCancel">Cancel</Button>
            <Button variant="ghost" type="submit" class="button">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Popup to Add New Supplier -->
  <div v-if="isSupplierModalOpen" class="modal-overlay">
    <div class="modal-content">
      <h2 class="selected-product-title">Add New Supplier</h2>

      <form @submit.prevent="addNewSupplier">
        <FormField v-slot="{ componentField }" name="supplier_id">
          <FormItem>
            <FormLabel>Supplier ID</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" disabled/>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="new_supplier_name">
          <FormItem>
            <FormLabel>Supplier Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter Supplier Name" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="supplier_address">
          <FormItem>
            <FormLabel>Supplier Address</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter Supplier Address" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="contact_number">
          <FormItem>
            <FormLabel>Contact Number</FormLabel>
            <FormControl>
              <Input type="tel" pattern="09[0-9]{9}" placeholder="Enter Contact Number (09xxxxxxxxx)" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="action-buttons">
          <Button variant="ghost" type="button" class="button" @click="isSupplierModalOpen = false">Cancel</Button>
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
        <FormField v-slot="{ componentField }" name="product-id">
          <FormItem>
            <FormLabel>Product ID</FormLabel>
            <FormControl>
              <Input type="number" v-bind="componentField" disabled />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="new-product-name">
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Product Name" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="category">
            <FormItem>
              <FormLabel>Product Type</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="dropdown-trigger2">
                    <SelectValue placeholder="Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="products">Products</SelectItem>
                      <SelectItem value="promos">Promos</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="new-cost">
            <FormItem>
              <FormLabel>Cost</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="Enter Cost" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="new-stock-level">
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="Enter Stock" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="new-warning-level">
            <FormItem>
              <FormLabel>Warning Level</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="Enter Warning Level" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
        </FormField>

        <!-- Sample suppliers only, will change later -->
        <FormField v-slot="{ componentField }" name="supplier-name">
            <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="dropdown-trigger2">
                    <SelectValue placeholder="Select an option" id="supplier"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Supplier1">Supplier 1</SelectItem>
                      <SelectItem value="Supplier2">Supplier 2</SelectItem>
                      <SelectItem value="Supplier3">Supplier 3</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="new-commission-rate">
            <FormItem>
              <FormLabel>Commission Rate</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="Enter Commision Rate" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
        </FormField>

        <div class="modal-action-buttons">
          <Button variant="ghost" type="button" class="button" @click="isProductModalOpen=false">Cancel</Button>
          <Button variant="ghost" type="submit" class="button">Add Product</Button>
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
  // SAMPLE FORM (NOTE: BOTBOT RA NI)
  import { useForm } from 'vee-validate'
  const form = useForm()

  //Sample data
  const products = ref([
    { id: 1, name: 'Product A', type: 'Products', cost: 10.0, stock: 50, warningLevel: 20, supplierName: 'ABC',  commissionRate: 10, status: 'Available' },
    { id: 2, name: 'Product B', type: 'Promos', cost: 20.0, stock: 30, warningLevel: 30, supplierName: 'BCD',  status: 'Available', commissionRate: 15 },
    { id: 3, name: 'Product C', type: 'Services', cost: 15.0, stock: 20, warningLevel: 30, supplierName: 'BCD', status: 'Available', commissionRate: 12 },
    { id: 4, name: 'Product D', type: 'Products', cost: 25.0, stock: 15, warningLevel: 30, supplierName: 'BCD', status: 'Out of Stock', commissionRate: 20 },
    { id: 5, name: 'Product E', type: 'Promos', cost: 30.0, stock: 10, warningLevel: 20, supplierName: 'ABC', status: 'Available', commissionRate: 25 },
    { id: 6, name: 'Product F', type: 'Products', cost: 12.0, stock: 5, warningLevel: 30, supplierName: 'ABC', status: 'Available', commissionRate: 18 },
    { id: 7, name: 'Product G', type: 'Promos', cost: 22.0, stock: 2, warningLevel: 30, supplierName: 'ABC',  status: 'Out of Stock', commissionRate: 30 },
    { id: 8, name: 'Product H', type: 'Promos', cost: 17.0, stock: 0, warningLevel: 20, supplierName: 'ABC', status: 'Out of Stock', commissionRate: 20 },
    { id: 9, name: 'Product I', type: 'Services', cost: 11.0, stock: 8, warningLevel: 30, supplierName: 'BCD',  status: 'Available', commissionRate: 10 },
    { id: 10, name: 'Product J', type: 'Products', cost: 14.0, stock: 3,warningLevel: 30, supplierName: 'ABC',  status: 'Available', commissionRate: 12 },
    { id: 11, name: 'Product K', type: 'Services', cost: 19.0, stock: 4, warningLevel: 20, supplierName: 'ABC', status: 'Available', commissionRate: 15 },
    { id: 12, name: 'Product L', type: 'Services', cost: 19.0, stock: 4,  warningLevel: 30, supplierName: 'ABC',status: 'Available', commissionRate: 15 },
    { id: 13, name: 'Product M', type: 'Services', cost: 19.0, stock: 4,  warningLevel: 30, supplierName: 'ABC',status: 'Available', commissionRate: 15 },
    { id: 14, name: 'Product N', type: 'Services', cost: 19.0, stock: 4, warningLevel: 20, supplierName: 'EFG', status: 'Available', commissionRate: 15 },
    { id: 15, name: 'Product O', type: 'Services', cost: 19.0, stock: 4,  warningLevel: 30, supplierName: 'ABC',status: 'Available', commissionRate: 15 },
    { id: 16, name: 'Product P', type: 'Services', cost: 19.0, stock: 4,  warningLevel: 30, supplierName: 'ABC',status: 'Available', commissionRate: 15 },
    { id: 17, name: 'Product Q', type: 'Services', cost: 19.0, stock: 4,  warningLevel: 30, supplierName: 'EFG',status: 'Available', commissionRate: 15 },
    { id: 18, name: 'Product R', type: 'Services', cost: 19.0, stock: 4, warningLevel: 30, supplierName: 'BCD', status: 'Available', commissionRate: 15 },
    { id: 19, name: 'Product S', type: 'Services', cost: 19.0, stock: 4, warningLevel: 30, supplierName: 'ABC', status: 'Available', commissionRate: 15 },
    { id: 20, name: 'Product T', type: 'Services', cost: 19.0, stock: 4, warningLevel: 30, supplierName: 'BCD', status: 'Available', commissionRate: 15 },
    { id: 21, name: 'Product U', type: 'Services', cost: 19.0, stock: 4, warningLevel: 30, supplierName: 'ABC', status: 'Available', commissionRate: 15 }

  ]);

  const selectProduct = (product) => {
    selectedProductId.value = product.id
    selectedProductName.value = product.name
    selectedProductType.value = product.type
    selectedCost.value = product.cost
    selectedStockIn.value = product.stock
    selectedWarningLevel.value=product.warningLevel
    selectedSupplierName.value = product.supplierName
    selectedCommissionRate.value=product.commissionRate
  };

  //ID, Name and type of chosen row from table
  const selectedProductId = ref(null); 
  const selectedProductName = ref('')
  const selectedProductType = ref('')
  const selectedCost = ref(0)
  const selectedStockIn = ref('')
  const selectedWarningLevel = ref(0)
  const selectedSupplierName = ref('')
  const selectedCommissionRate  =ref(0)

  //Default values
  const selectedType = ref('all');
  const selectedFilter = ref(null)
  const searchQuery = ref('');

  //For pagination
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  //For pop ups
  const isProductModalOpen = ref(false);
  const isSupplierModalOpen = ref(false);

  const filteredAndSortedProducts = computed(() => {
    let filtered = products.value;
    if (selectedType.value !== 'all') {
        filtered = filtered.filter(product => product.type.toLowerCase() === selectedType.value);
    }

    // Filter products based on the search query
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

  //Pagination
  const emptyRows = computed(() => Math.max(0, itemsPerPage.value - paginatedProducts.value.length));
  const totalPages = computed(() => Math.ceil(filteredAndSortedProducts.value.length / itemsPerPage));
  const paginatedProducts = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    return filteredAndSortedProducts.value.slice(startIndex, startIndex + itemsPerPage.value);
  });
  function handlePageChange(newPage) {
  currentPage.value = newPage
}

  //Dropdown menu for filtering
  const filterOptions = [
  { value: 'id-asc', label: 'Product ID: Ascending' },
  { value: 'id-desc', label: 'Product ID: Descending' },
  { value: 'name-asc', label: 'Product Name: A to Z' },
  { value: 'name-desc', label: 'Product Name: Z to A' },
  { value: 'supplier-asc', label: 'Supplier Name: A to Z' },
  { value: 'supplier-desc', label: 'Supplier Name: Z to A' },

  ];

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

  const addNewProduct = form.handleSubmit(async (values) => {
    try {
      const response = await $fetch('/api/inventory/product', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: values,
      });
    } catch (error) {
      console.error('Add Supplier failed:', error);
    }
    closeProductModal();
  });


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
    closeSupplierModal();
  });

  const onCancel = () => {
  if (selectedProductId.value) {
    selectedProductId.value=''
    selectedProductName.value = ''
    selectedProductType.value = ''
    selectedCost.value=''
    selectedStockIn.value=''
    selectedSupplierName.value = ''
    selectedWarningLevel.value = ''
    selectedCommissionRate.value=''
  } 
};

// Method to save changes (submit form)
const onSubmit = () => {
  const productIndex = products.value.findIndex(p => p.id === selectedProductId.value);
  if (productIndex !== -1) {
    products.value[productIndex].name = selectedProductName.value;
    products.value[productIndex].type = selectedProductType.value;
    alert('Product details saved successfully!');
  } else {
    alert('Product not found.');
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
    flex-basis: 75%; 
    border: 1px solid #000000;
    border-radius: 8px;
    padding: 16px;
  }

  /* Edit Selected Product container */
  .container-selectedproduct {
    flex-basis: 25%;
    border: 1px solid #000000;
    border-radius: 8px;
    padding: 16px;

  }

  /* Dropdown select trigger */
  .dropdown-trigger {
    width: 100px;
  }

  .dropdown-trigger2 {
    width: 100%;
  }

  /* Search input */
  .input-search {
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