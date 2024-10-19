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
        <Button variant="ghost" class="button" @click="isEditable = !isEditable">
          {{ isEditable ? "Cancel Edit" : "Edit" }}
        </Button>
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

        <form @submit.prevent="onSubmit" class="form" noValidate>
          <FormField v-slot="{ componentField }" name="product-id">
            <FormItem>
              <FormLabel>Product ID</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="Product ID" 
                  v-bind="componentField" 
                  :value="selectedProductId" 
                  disabled 
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="product-name">
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  placeholder="Enter Product Name" 
                  v-bind="componentField" 
                  :value="selectedProductName" 
                  :disabled="!isEditable" 
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="stock-in">
            <FormItem>
              <FormLabel>Stock-in</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="Enter Stock-in Value" v-bind="componentField" :disabled="!isEditable"/>
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="warning-level">
            <FormItem>
              <FormLabel>Warning Level</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="Enter Warning Level" v-bind="componentField" :disabled="!isEditable"/>
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="category">
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select v-bind="componentField" :value="selectedProductType">
                  <SelectTrigger class="dropdown-trigger" :disabled="!isEditable">
                    <SelectValue placeholder="Select an option" />
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
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="supplier_name">
            <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Supplier Name" v-bind="componentField" class="w-full input-suppliername" :disabled="!isEditable"/>
              </FormControl>
            </FormItem>
          </FormField>

          <div class="action-buttons">
            <Button variant="ghost" type="button" class="cancel-button">Cancel</Button>
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

  //ID, Name and type of chosen row from table
  const selectedProductId = ref(null); 
  const selectedProductName = ref('');
  const selectedProductType = ref('');
  
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
  const isProductModalOpen = ref(false);
  const isSupplierModalOpen = ref(false);

  // // Filter products based on the selected option in dropdown
  // const filteredProducts = computed(() => {
  //   return products.value.filter(product => product.type.toLowerCase() === selectedType.value);
  // });

  // //Pagination not working
  // const paginatedProducts = computed(() => {
  //   const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  //   return filteredProducts.value.slice(startIndex, startIndex + itemsPerPage.value);
  // });
  // const emptyRows = computed(() => Math.max(0, itemsPerPage.value - paginatedProducts.value.length));
  // const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value));
  // Open new page 
  const onPageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages.value) currentPage.value = newPage;
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
    fetchProductDetails()
    closeProductModal();
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
      console.log("This is to confirm that there actually is a products data")
      console.log(response)
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }
  fetchProductDetails()
  // Load Tables
  // Filter products based on the selected option in the dropdown
	const filteredProducts = computed(() => {
	  // Check if selectedType has a value to filter, otherwise return all products
	  if (selectedType.value && selectedType.value != "all") {
		return products.value.filter(product => 
		  product.ProductType.toLowerCase() === selectedType.value.toLowerCase()
		);
	  }
	  // Return all products if no filter is selected
	  return products.value;
	});
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