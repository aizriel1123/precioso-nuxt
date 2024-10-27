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
    <div class="center-components">
        <h1 class="title">Sales</h1>
      <!-- Flex container for dropdown, input, filter and buttons -->
      <div class="flex-components">
        <div class="left-side">
          <!-- Dropdown for selecting sales -->
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
          <Input placeholder="Find Report by Goods/Client/Therapist" v-model="searchQuery" class="input-search" />
        </div>
      </div>

      <div class="table-product-container">
      <div class="container-table">
        <div class="table-content">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
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
                :key="report.time" 
              >
                <TableCell>{{ report.time }}</TableCell>
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
                  <TableHead>Date</TableHead>
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
                <TableHead>Goods Availed</TableHead>
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
                v-for="(report,index) in paginatedReports" 
                :key="`${report.date}-${index}`"  
              >
                <TableCell>{{ report.date }}</TableCell>
                <TableCell>{{ report['goods-availed'] }}</TableCell>
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
          <h2>Sales Chart</h2>

          <div class="chart-container">
            <template v-if="DisplayChart">
              <AreaChart :data="chartData" index="day" :categories="['Revenue']" />
            </template>
            <template v-else>
              <p>Cannot Display Sales Chart for Daily Transactions</p>
            </template>
          </div>

          <h3> Summary </h3>
          <div class="summary-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Total Revenue</TableHead>
                  <TableCell>₱ {{ totalRevenue }}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Total Bookings</TableHead>
                  <TableCell>{{ totalBookings }}</TableCell>
                </TableRow>  
                <TableRow>
                  <TableHead>Top Product</TableHead>
                  <TableCell>{{ topProduct }}</TableCell>
                </TableRow> 
                <TableRow>
                  <TableHead>Top Service</TableHead>
                  <TableCell>{{ topService }}</TableCell>
                </TableRow> 
              </TableHeader>
            </Table>
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
{ date: '2024-10-9', 'goods-availed': 'Massage Therapy', 'client-name': 'Mary Joy', 'therapist-name': 'Abdul Khan', type: 'Service', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2024-10-9', 'goods-availed': 'Massage Therapy', 'client-name': 'Mary Joy', 'therapist-name': 'Abdul Khan', type: 'Service', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2024-10-9', 'goods-availed': 'Massage Therapy', 'client-name': 'Mary Joy', 'therapist-name': 'Abdul Khan', type: 'Service', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2024-10-19', 'goods-availed': 'Serum', 'client-name': 'Maddie Lim', 'therapist-name': 'Merry Sy', type: 'Product', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2024-10-19', 'goods-availed': 'Cleansing Gel', 'client-name': 'Maddie Lim', 'therapist-name': 'Merry Sy', type: 'Product', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2024-9-30', 'goods-availed': 'Serum', 'client-name': 'Tina Go', 'therapist-name': 'Kenny Lao', type: 'Product', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2024-10-1', 'goods-availed': 'Toner', 'client-name': 'Andy Lim', 'therapist-name': 'Kenny Lao', type: 'Product', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2024-9-18', 'goods-availed': 'Manicure', 'client-name': 'Cora Tan', 'therapist-name': 'Merry Sy', type: 'Service', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2024-9-17', 'goods-availed': 'Cleansing Gel', 'client-name': 'Eva Yan', 'therapist-name': 'Bob Uy', type: 'Product', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2024-10-14', 'goods-availed': 'Serum, Cleansing Gel', 'client-name': 'Mary Joy', 'therapist-name': 'Abdul Khan', type: 'Product', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2024-10-14', 'goods-availed': 'Serum', 'client-name': 'Mary Joy', 'therapist-name': 'Abdul Khan', type: 'Product', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2024-10-14', 'goods-availed': 'Serum', 'client-name': 'Mary Joy', 'therapist-name': 'Abdul Khan', type: 'Product', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2024-10-15', 'goods-availed': 'Serum, Cleansing Gel', 'client-name': 'Mary Joy', 'therapist-name': 'Abdul Khan', type: 'Product', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2022-10-11', 'goods-availed': 'Skin Consultation', 'client-name': 'Maddie Lim', 'therapist-name': 'Merry Sy', type: 'Service', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2022-10-12', 'goods-availed': 'Skin Consultation', 'client-name': 'Tina Go', 'therapist-name': 'Kenny Lao', type: 'Service', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2022-10-1', 'goods-availed': 'Moisturizing Lotion', 'client-name': 'Andy Lim', 'therapist-name': 'Kenny Lao', type: 'Product', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2023-3-20', 'goods-availed': 'Serum', 'client-name': 'Cora Tan', 'therapist-name': 'Merry Sy', type: 'Product', sales: 500, mop: 'Cash', commission: 15 },
{ date: '2023-6-30', 'goods-availed': 'Moisturizing Lotion', 'client-name': 'Eva Yan', 'therapist-name': 'Bob Uy', type: 'Product', sales: 500, mop: 'Cash', commission: 15 }
]);

//Defauls values for inputs/selects
const searchQuery = ref('');
const selectedPeriod = ref('past-24-hours');

//Filter by time period
const filteredReports = computed(() => {
  const now = new Date(); // Current date and time

  // Calculat start date based on selected period
  let startDate;
  if (selectedPeriod.value === 'past-24-hours') {
    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Subtract 24 hours
  } else if (selectedPeriod.value === 'past-7-days') {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Subtract 7 days
  } else if (selectedPeriod.value === 'past-30-days') {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Subtract 30 days
  }

  // Filter reports based on date
  let reports = salesReport.value;
  if (startDate) {
    reports = reports.filter(report => new Date(report.date) >= startDate);
  }

  // Filter reports based on the search query
  return reports.filter(report =>
    ['goods-availed', 'client-name', 'therapist-name']
      .some(key => report[key].toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});


//For pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

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

//Chart
const DisplayChart = computed(() => {
  return selectedPeriod.value !== 'past-24-hours';
});

const chartData = computed(() => {
  const dailyData = {};

  filteredReports.value.forEach((report) => {
    const reportDate = new Date(report.date);
    const day = reportDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Initialize the day if not yet present
    if (!dailyData[day]) {
      dailyData[day] = {
        day: day,
        Revenue: 0,
      };
    }

    // Add to the revenue and booking count for this day
    dailyData[day].Revenue += report.sales;
  });

  // Convert the object to an array for the chart component
  return Object.values(dailyData);

});





//Summary Table
//Total Revenue
const totalRevenue = computed(() => {
  return filteredReports.value.reduce((acc, report) => acc + report.sales, 0);
});

//Total Bookings
const totalBookings = computed(() => {
  return filteredReports.value.length;
});

//Top Product
const topProduct = computed(() => {
  const productCount = {};
  filteredReports.value.forEach((report) => {
    if (report.type === 'Product') {
      productCount[report['goods-availed']] = (productCount[report['goods-availed']] || 0) + 1;
    }
  });
  return Object.keys(productCount).reduce((a, b) => (productCount[a] > productCount[b] ? a : b), '');
});

//Top Service
const topService = computed(() => {
  const serviceCount = {};
  filteredReports.value.forEach((report) => {
    if (report.type === 'Service') {
      serviceCount[report['goods-availed']] = (serviceCount[report['goods-availed']] || 0) + 1;
    }
  });
  return Object.keys(serviceCount).reduce((a, b) => (serviceCount[a] > serviceCount[b] ? a : b), '');
});
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
  width: 400px;
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

/* Pagination
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

/* Pagination
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
  height: 400px;
  width: 100%;
  margin-left: -20px;
}
</style>