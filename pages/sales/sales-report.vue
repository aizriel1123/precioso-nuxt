<template>
  <NavBar/>
    <div class="center-components">
        <h1 class="title">Sales</h1>
      <!-- Flex container for dropdown, input, filter and buttons -->
      <div class="flex-components">
        <div class="left-side">
          <!-- Dropdown for selecting sales -->
          <Select v-model="selectedReport">
            <SelectTrigger class="dropdown-trigger">
              <SelectValue placeholder="Select Report" value="individual-sales"/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="individual-sales">Individual Sales</SelectItem>
                <SelectItem value="total-sales">Total Sales</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select v-model="selectedPeriod">
            <SelectTrigger class="dropdown-trigger">
              <SelectValue placeholder="Past 24 hours" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="past-24-hours">Past 24 hours</SelectItem>
                <SelectItem value="past-7-days">Past 7 days</SelectItem>
                <SelectItem value="past-30-days">Past 30 days</SelectItem>
                <SelectItem value="all-transactions">All Transactions</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <!-- Search input -->
          <Input placeholder="Find Report" class="input-search" />
        </div>
      </div>

      <div class="table-product-container">
      <div class="container-table">
        <div class="table-content">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Products Availed</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Therapist Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>MOP</TableHead>
                <TableHead>Commission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow 
                v-for="report in paginatedReports" 
                :key="report.date" 
              >
                <TableCell>{{ report.date }}</TableCell>
                <TableCell>{{ report['products-availed'] }}</TableCell>
                <TableCell>{{ report['client-name'] }}</TableCell>
                <TableCell>{{ report['therapist-name'] }}</TableCell>
                <TableCell>{{ report.type }}</TableCell>
                <TableCell>{{ report.sales }}</TableCell>
                <TableCell>{{ report.mop }}</TableCell>
                <TableCell>{{ report.commission }}%</TableCell>
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

        <!-- Pagination controls -->
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
      <div class="container-selectedtransaction">
        <div v-if="selectedReport === 'individual-sales'">
          <h2>Transaction Information</h2>

          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableCell>10/16/2024</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Products Availed</TableHead>
                  <TableCell>Vitamin C Serum</TableCell>
                </TableRow>  
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableCell>Mary Joy</TableCell>
                </TableRow> 
                <TableRow>
                  <TableHead>Therapist Name</TableHead>
                  <TableCell>Abdul Khan</TableCell>
                </TableRow> 
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableCell>Product</TableCell>
                </TableRow> 
                <TableRow>
                  <TableHead>Total Sale</TableHead>
                  <TableCell>250.00</TableCell>
                </TableRow> 
                <TableRow>
                  <TableHead>Mode of Payment</TableHead>
                  <TableCell>Cash</TableCell>
                </TableRow> 
                <TableRow>
                  <TableHead>Commission Re.</TableHead>
                  <TableCell>10%</TableCell>
                </TableRow> 
              </TableHeader>
            </Table>
        </div>

        <div v-else-if="selectedReport === 'total-sales'" class="container-total-sales">
          <h2>Sales Chart</h2>

          <div class="chart-container">
            <AreaChart :data="data" index="name" :categories="['Revenue', 'Bookings']" />
          </div>

          <h3> Summary </h3>
          <div class="summary-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Total Revenue</TableHead>
                  <TableCell>100000</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Total Bookings</TableHead>
                  <TableCell>245</TableCell>
                </TableRow>  
                <TableRow>
                  <TableHead>Top Product</TableHead>
                  <TableCell>Green Toner</TableCell>
                </TableRow> 
                <TableRow>
                  <TableHead>Top Service</TableHead>
                  <TableCell>Carbon Peel</TableCell>
                </TableRow> 
              </TableHeader>
            </Table>
          </div>

        </div>
      </div>
    </div>
    </div>
</template>

<script setup>
import NavBar from '~/components/Navbar.vue';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import { Input } from '@/components/ui/input'
import { AreaChart } from '@/components/ui/chart-area'


//Sample data for Individual Sales
const salesReport = ref([
{ date: '2023-10-11', 'products-availed': 100, 'client-name': 'Mary Joy', 'therapist-name': 'Abdul Khan', type: 'Individual Sales', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2023-10-11', 'products-availed': 100, 'client-name': 'Maddie Lim', 'therapist-name': 'Merry Sy', type: 'Individual Sales', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2023-10-11', 'products-availed': 100, 'client-name': 'Tina Go', 'therapist-name': 'Kenny Lao', type: 'Individual Sales', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2023-10-11', 'products-availed': 100, 'client-name': 'Andy Lim', 'therapist-name': 'Kenny Lao', type: 'Individual Sales', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2023-10-11', 'products-availed': 100, 'client-name': 'Cora Tan', 'therapist-name': 'Merry Sy', type: 'Individual Sales', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2023-10-11', 'products-availed': 100, 'client-name': 'Eva Yan', 'therapist-name': 'Bob Uy', type: 'Individual Sales', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2023-10-11', 'products-availed': 100, 'client-name': 'Mary Joy', 'therapist-name': 'Abdul Khan', type: 'Individual Sales', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2023-10-11', 'products-availed': 100, 'client-name': 'Maddie Lim', 'therapist-name': 'Merry Sy', type: 'Individual Sales', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2023-10-11', 'products-availed': 100, 'client-name': 'Tina Go', 'therapist-name': 'Kenny Lao', type: 'Individual Sales', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2023-10-11', 'products-availed': 100, 'client-name': 'Andy Lim', 'therapist-name': 'Kenny Lao', type: 'Individual Sales', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2023-10-11', 'products-availed': 100, 'client-name': 'Cora Tan', 'therapist-name': 'Merry Sy', type: 'Individual Sales', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2023-10-11', 'products-availed': 100, 'client-name': 'Eva Yan', 'therapist-name': 'Bob Uy', type: 'Individual Sales', sales: 500, mop: 'Cash', commission: 15 }

]);

//Sample data for Total Sales
const data = [
  { name: 'Jan', Revenue: Math.floor(Math.random() * 2000) + 500},
  { name: 'Feb', Revenue: Math.floor(Math.random() * 2000) + 500},
  { name: 'Mar', Revenue: Math.floor(Math.random() * 2000) + 500},
  { name: 'Apr', Revenue: Math.floor(Math.random() * 2000) + 500},
  { name: 'May', Revenue: Math.floor(Math.random() * 2000) + 500},
  { name: 'Jun', Revenue: Math.floor(Math.random() * 2000) + 500},
  { name: 'Jul', Revenue: Math.floor(Math.random() * 2000) + 500},
]

//Defauls values for inputs/selects
const selectedReport = ref('individual-sales');
const searchTerm = ref('');
const selectedPeriod = ref('past-24-hours');

//For pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Filter products based on the selected option in dropdown
const filteredReports = computed(() => {
  return salesReport.value.filter(report => 
    report.type.toLowerCase() && 
    JSON.stringify(report).toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Pagination
const paginatedReports = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return filteredReports.value.slice(startIndex, startIndex + itemsPerPage.value);
});

const emptyRows = computed(() => Math.max(0, itemsPerPage.value - paginatedReports.value.length));
const totalPages = computed(() => Math.ceil(filteredReports.value.length / itemsPerPage));

function handlePageChange(newPage) {
  currentPage.value = newPage
}

</script>

<style>

h1 {
  font-size: 48px;
  font-weight: bolder;
}

h2 {
  font-size: 20px;
  margin-bottom: 16px;
  font-weight: bolder;
}

h3 {
  font-size: 18px;
  font-weight: bold;
}

.center-components {
  margin-top: 10px;
  margin-left: 2%;
  margin-right: 2%;
  margin-bottom: 30px;
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
.container-selectedtransaction {
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

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px; /* Adjust this value based on your chart size */
  width: 100%;
  margin-left: -20px;
}

</style>