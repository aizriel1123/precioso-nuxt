<template>
  <div class="min-h-screen bg-background">
    <NavBar />
    <div class="p-6">
      <!-- Date Range Selector -->
      <span class="ml-1">
        <span v-if="direction === 'asc'">↑</span>
        <span v-else-if="direction === 'desc'">↓</span>
        <span v-else class="invisible">↕</span>
      </span>
      <div class="mb-6 flex justify-between items-center">
        <div v-if="isLoading" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <Popover v-model:open="isCalendarOpen">
          <PopoverTrigger as-child>
            <Button variant="outline" class="w-[280px] justify-start text-left font-normal">
              <CalendarIcon class="mr-2 h-4 w-4" />
              {{ formattedDateRange }}
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0 z-50" align="end">
            <div class="flex flex-col gap-2">
              <Calendar
                mode="range"
                v-model:from="tempDateRange.from"
                v-model:to="tempDateRange.to"
                :number-of-months="2"
                class="rounded-md border"
              />
              <div class="flex justify-end gap-2 p-2 border-t">
                <Button variant="outline" size="sm" @click="handleCancel">
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  @click="handleApply"
                  :disabled="!isDateRangeValid"
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <!-- Tabs Navigation -->
      <Tabs defaultValue="overview" class="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Sales Overview</TabsTrigger>
          <TabsTrigger value="history"> Sales History</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <!-- Sales Overview Tab -->
        <TabsContent value="overview">
          <!-- Top Metrics Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card v-for="metric in metrics" :key="metric.title">
              <CardHeader>
                <CardTitle class="text-sm font-medium">{{ metric.title }}</CardTitle>
                <CardDescription class="text-2xl font-bold">{{ metric.value }}</CardDescription>
                <!-- Add trend data from API -->
                <p class="text-xs" :class="metric.trend > 0 ? 'text-green-600' : 'text-red-600'">
                  {{ metric.trend > 0 ? '↑' : '↓' }} {{ Math.abs(metric.trend) }}% From last month
                </p>
              </CardHeader>
            </Card>
          </div>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <!-- Left Column - Chart -->
            <div class="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                </CardHeader>
                <CardContent class="h-[400px]">
                  <AreaChart
                    :data="chartData"
                    :categories="['revenue', 'gross_profit', 'net_profit', 'expenses']"
                    :colors="chartColors"
                    index="date"
                  />
                </CardContent>
              </Card>
            </div>

            <!-- Right Column - Stats -->
            <div class="space-y-4">
              <Card class="mt-4">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="space-y-4">
                    <div v-for="sale in recentSales" :key="sale.id" 
                        class="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg">
                      <div class="flex flex-col">
                        <p class="font-medium">{{ sale.service }}</p>
                        <p class="text-sm text-muted-foreground">{{ sale.client }}</p>
                      </div>
                      <p class="font-medium">{{ sale.amount }}</p>
                    </div>
                  </div>
                </CardContent>
              </Card> 
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="space-y-4">
                    <div v-for="item in topItems" :key="item.title" class="flex justify-between items-center">
                      <div>
                        <p class="font-medium">{{ item.title }}</p>
                        <p class="text-sm text-muted-foreground">{{ item.subtitle }}</p>
                      </div>
                      <div class="text-right">
                        <p class="font-medium">{{ item.value }}</p>
                        <p class="text-xs text-muted-foreground">{{ item.metric }}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          
        </TabsContent>

        <!-- History Tab -->
<TabsContent value="history">
  <Card>
    <CardHeader>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CardTitle>Sales History</CardTitle>
        <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div class="relative w-full">
            <Input
              v-model="searchQuery"
              placeholder="Search transactions..."
              class="pl-10 pr-4 py-2 w-full rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <MagnifyingGlassIcon class="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          <Select v-model="selectedFilter">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Filter by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filters</SelectLabel>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="promo">Promos</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="cash">Cash Payments</SelectItem>
                <SelectItem value="card">Card Payments</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="rounded-md border">
        <Table>
          <TableHeader class="bg-muted/50">
            <TableRow>
              <TableHead class="w-[100px] cursor-pointer" @click="sortBy('date')">
                Date
                <SortIndicator :direction="sortConfig.column === 'date' ? sortConfig.direction : null" />
              </TableHead>
              <TableHead class="min-w-[150px]">Service/Product</TableHead>
              <TableHead class="min-w-[120px]">Client</TableHead>
              <TableHead class="min-w-[120px]">Therapist</TableHead>
              <TableHead class="w-[100px]">Type</TableHead>
              <TableHead class="w-[100px] cursor-pointer" @click="sortBy('sales')">
                Sales
                <SortIndicator :direction="sortConfig.column === 'sales' ? sortConfig.direction : null" />
              </TableHead>
              <TableHead class="w-[100px]">MOP</TableHead>
              <TableHead class="w-[130px]">Commission</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="filteredTransactions.length">
              <TableRow
                v-for="transaction in paginatedTransactions"
                :key="transaction.id"
                class="hover:bg-muted/50"
              >
                <TableCell class="font-medium">{{ formatDate(transaction.date) }}</TableCell>
                <TableCell>{{ transaction.service }}</TableCell>
                <TableCell>{{ transaction.client }}</TableCell>
                <TableCell>{{ transaction.therapist }}</TableCell>
                <TableCell>
                  <Badge :variant="transaction.type === 'Service' ? 'default' : 'secondary'">
                    {{ transaction.type }}
                  </Badge>
                </TableCell>
                <TableCell>{{ formatCurrency(transaction.sales) }}</TableCell>
                <TableCell>
                  <Badge variant="outline">{{ transaction.mop }}</Badge>
                </TableCell>
                <TableCell>{{ formatCurrency(transaction.commission) }}</TableCell>
              </TableRow>
            </template>
            <template v-else>
              <TableRow>
                <TableCell colspan="8" class="h-24 text-center text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </div>

      <!-- Sales History Pagination-->
      <div class="pagination-wrapper mt-4 flex justify-center items-center">
        <Pagination
    :page="currentPage"
    :total="totalPages"
    :sibling-count="1"
    show-edges
    :per-page="itemsPerPage"
    @update:page="handlePageChange"
  >
    <PaginationList v-slot="{ items, page }" class="flex items-center gap-1">
      <PaginationFirst />
      <PaginationPrev />
      <template v-for="(item, index) in items" :key="index">
        <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
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
    </CardContent>
  </Card>
</TabsContent>

         <!-- Expenses Tab -->
         <TabsContent value="expenses">
          <Card>
            <CardHeader class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Expenses</CardTitle>
              <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <!-- Period Selector -->
                <Select v-model="selectedPeriodExpense">
                  <SelectTrigger class="w-[180px]">
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

                <!-- Search Input -->
                <Input
                  placeholder="Search by description..."
                  v-model="expenseSearchQuery"
                  class="input_search"
                />

                <!-- Button to open expense modal -->
                <Button variant="ghost" @click="expenseModalOpen = true">Add New Expense</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div class="table-product-container">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Expense ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow
                      v-for="(expense, index) in paginatedExpenses"
                      :key="`${expense.id}-${index}`"
                    >
                      <TableCell>{{ expense.id }}</TableCell>
                      <TableCell>{{ expense.date }}</TableCell>
                      <TableCell>{{ expense.cost }}</TableCell>
                      <TableCell>{{ expense.description }}</TableCell>
                    </TableRow>
                    <!-- If there are fewer than 10 rows, pad with empty rows -->
                    <TableRow
                      v-for="index in emptyRowsExpenses"
                      :key="'empty-' + index"
                      class="empty-row"
                    >
                      <TableCell>&nbsp;</TableCell>
                      <TableCell>&nbsp;</TableCell>
                      <TableCell>&nbsp;</TableCell>
                      <TableCell>&nbsp;</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <!-- Pagination controls -->
                <div class="pagination-wrapper mt-4 flex justify-center items-center">
                  <Pagination
                    v-slot="{ page }"
                    :total="totalPagesExpenses"
                    :sibling-count="1"
                    show-edges
                    :default-page="currentPageExpenses"
                    :per-page="itemsPerPageExpenses"
                    @update:page="handlePageChangeExpenses"
                  >
                    <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                      <PaginationFirst />
                      <PaginationPrev />
                      <template v-for="(item, index) in items">
                        <PaginationListItem
                          v-if="item.type === 'page'"
                          :key="index"
                          :value="item.value"
                          as-child
                        >
                          <Button
                            class="w-9 h-9 p-0"
                            :variant="item.value === page ? 'default' : 'outline'"
                          >
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
            </CardContent>
          </Card>

          <!-- Modal for adding a new expense -->
          <div
            v-if="expenseModalOpen"
            class="modal-overlay fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <div class="modal-content bg-white p-4 rounded-md shadow-md w-full max-w-md">
              <h2 class="selected-product-title text-xl font-bold mb-4">Add New Expense</h2>
              <form @submit.prevent="submitExpenseForm">
                <!-- Date Picker Field -->
                <FormField v-slot="{ componentField }" name="date">
                  <FormLabel class="label">Select Date</FormLabel>
                  <Popover>
                    <PopoverTrigger as-child>
                      <Button
                        variant="outline"
                        class="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {{ expenseDate ? dateFormatter.format(expenseDate) : "Pick a date" }}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="calendar-popover">
                      <div class="calendar-wrapper">
                        <Calendar v-model="expenseDate" initial-focus />
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormField>

                <!-- Cost Field -->
                <FormField v-slot="{ componentField }" name="cost">
                  <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input
                        v-model="expenseCost"
                        type="number"
                        min="0"
                        placeholder="Enter cost"
                      />
                    </FormControl>
                  </FormItem>
                </FormField>

                <!-- Description Field -->
                <FormField v-slot="{ componentField }" name="description">
                  <FormLabel class="label">Description</FormLabel>
                  <textarea
                    v-model="expenseDescription"
                    placeholder="Enter description"
                    class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  ></textarea>
                </FormField>

                <div class="action-buttons mt-4 flex justify-end gap-2">
                  <Button variant="ghost" type="button" @click="expenseModalOpen = false">
                    Cancel
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-vue-next'
import NavBar from '~/components/Navbar.vue'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AreaChart } from '@/components/ui/chart-area'

// Reactive state
const isLoading = ref(false)
const searchQuery = ref('')
const selectedFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = 10
const sortConfig = ref({ column: 'date', direction: 'desc' })
const isCalendarOpen = ref(false)
const tempDateRange = ref({ from: null, to: null })
const dateRange = ref({ from: null, to: null })

// Data placeholder – our API call returns transactions only.
const transactions = ref([])

// ------------------------
// Fetch Data from API
// ------------------------
const fetchData = async () => {
  isLoading.value = true;
  try {
    // Fetch transactions from the API endpoint.
    const response = await $fetch('/api/sales/sales_Report', {
      headers: { "Content-Type": "application/json" },
    });
    transactions.value = response;
  } catch (error) {
    console.error('Error fetching transactions:', error);
  } finally {
    isLoading.value = false;
  }
}

// ------------------------
// Sales Overview Computations
// ------------------------

// For demonstration, assume:
const expenseRate = 0.2;      // 20% of sales as expenses
const grossProfitRate = 0.6;  // 60% of sales as gross profit

// Total Revenue, Average Sales, and Appointments (count of Service-type transactions)
const totalRevenue = computed(() =>
  transactions.value.reduce((sum, t) => sum + t.sales, 0)
)
const averageSales = computed(() =>
  transactions.value.length > 0 ? totalRevenue.value / transactions.value.length : 0
)
const totalAppointments = computed(() =>
  transactions.value.length
)

const expensesReport = ref([
  { id: 1, date: '2025-01-09', cost: 200, description: 'Massage Therapy' },
  { id: 2, date: '2025-01-09', cost: 200, description: 'Other expense' },
])

// For filtering and searching expenses
const expenseSearchQuery = ref('')
const selectedPeriodExpense = ref('past-24-hours')
// For the Add Expense modal
const expenseCost = ref('')
const expenseDescription = ref('')
const expenseModalOpen = ref(false)
const expenseDate = ref(null)

// Metrics Card Data
const metrics = computed(() => ({
  revenue: {
    title: 'Total Revenue',
    value: formatCurrency(totalRevenue.value),
    trend: 0 // TODO: Calculate trend compared to previous period
  },
  appointments: {
    title: 'Total Transactions',
    value: totalAppointments.value.toString(),
    trend: 0 // TODO: Calculate trend compared to previous period
  },
  averageSales: {
    title: 'Average Sales',
    value: formatCurrency(averageSales.value),
    trend: 0 // TODO: Calculate trend compared to previous period
  }
}));

// Chart Data – Group transactions by date and calculate metrics
const chartData = computed(() => {
  const dailyData = transactions.value.reduce((acc, transaction) => {
    const date = format(new Date(transaction.date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = {
        date,
        revenue: 0,
        expenses: 0,
        gross_profit: 0,
      }
    }
    acc[date].revenue += transaction.sales;
    acc[date].expenses += transaction.sales * expenseRate;
    acc[date].gross_profit += transaction.sales * grossProfitRate;
    return acc;
  }, {});
  
  // Convert the dailyData object to an array, calculate net profit, and sort by date
  return Object.values(dailyData)
    .map(day => ({
      ...day,
      net_profit: day.gross_profit - day.expenses,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort in ascending order
});


// Define custom colors for the chart:
// Order: revenue, gross_profit, net_profit, expenses
const chartColors = ['#34D399', '#FBBF24', '#60A5FA', '#F87171'];

// Recent Sales c– last 5 transactions (sorted by date descending)
const recentSales = computed(() =>
  transactions.value
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(t => ({
      id: t.id,
      date: format(new Date(t.date), 'MMM dd, yyyy'),
      type: t.type,
      client: t.client,
      amount: formatCurrency(t.sales),
      mop: t.mop
    }))
);

// Top Performing – Compute top service and top product
const getTopService = () => {
  const serviceMap = transactions.value
    .filter(t => t.type === 'Service')
    .reduce((acc, t) => {
      acc[t.service] = acc[t.service] || { name: t.service, count: 0, revenue: 0 };
      acc[t.service].count++;
      acc[t.service].revenue += t.sales;
      return acc;
    }, {});
  const topService = Object.values(serviceMap).sort((a, b) => b.revenue - a.revenue)[0];
  return topService || { name: 'N/A', revenue: 0, count: 0 };
}
const getTopProduct = () => {
  const productMap = transactions.value
    .filter(t => t.type === 'Product')
    .reduce((acc, t) => {
      acc[t.service] = acc[t.service] || { name: t.service, quantity: 0, revenue: 0 };
      acc[t.service].quantity += 1; // each transaction counts as one sale
      acc[t.service].revenue += t.sales;
      return acc;
    }, {});
  const topProduct = Object.values(productMap).sort((a, b) => b.revenue - a.revenue)[0];
  return topProduct || { name: 'N/A', revenue: 0, quantity: 0 };
}

const topItems = computed(() => [
  {
    title: 'Top Service',
    subtitle: getTopService().name,
    value: formatCurrency(getTopService().revenue),
    metric: `${getTopService().count} appointments`
  },
  {
    title: 'Top Product',
    subtitle: getTopProduct().name,
    value: formatCurrency(getTopProduct().revenue),
    metric: `${getTopProduct().quantity} sold`
  }
]);

// Foot Traffic – count of service transactions
const footTraffic = computed(() =>
  transactions.value.filter(t => t.type === 'Service').length
);

// ------------------------
// Transaction Filtering and Pagination
// ------------------------
// Computed property: Filter and sort transactions
const filteredTransactions = computed(() => {
  let filtered = transactions.value;
  if (searchQuery.value) {
    filtered = filtered.filter((t) => {
      return Object.values(t).some(value =>
        String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });
  }
  if (selectedFilter.value !== 'all') {
    filtered = filtered.filter((t) => t.type.toLowerCase() === selectedFilter.value);
  }
  // Sort transactions based on sortConfig
  filtered.sort((a, b) => {
    const modifier = sortConfig.value.direction === 'asc' ? 1 : -1;
    return a[sortConfig.value.column] > b[sortConfig.value.column] ? modifier : -modifier;
  });
  return filtered;
});

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTransactions.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => 
  Math.ceil(filteredTransactions.value.length / itemsPerPage)
);

function handlePageChange(newPage) {
  currentPage.value = newPage;
}



// Filter expenses by time period and search query
const filteredExpenses = computed(() => {
  const now = new Date()
  let startDate
  if (selectedPeriodExpense.value === 'past-24-hours') {
    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  } else if (selectedPeriodExpense.value === 'past-7-days') {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  } else if (selectedPeriodExpense.value === 'past-30-days') {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
  let expenses = expensesReport.value
  if (startDate && selectedPeriodExpense.value !== 'all-transactions') {
    expenses = expenses.filter(expense => new Date(expense.date) >= startDate)
  }
  if (expenseSearchQuery.value) {
    expenses = expenses.filter(expense =>
      expense.description.toLowerCase().includes(expenseSearchQuery.value.toLowerCase())
    )
  }
  return expenses
})

// Pagination for expenses
const currentPageExpenses = ref(1)
const itemsPerPageExpenses = ref(10)
const paginatedExpenses = computed(() => {
  const startIndex = (currentPageExpenses.value - 1) * itemsPerPageExpenses.value
  return filteredExpenses.value.slice(startIndex, startIndex + itemsPerPageExpenses.value)
})
const emptyRowsExpenses = computed(() =>
  Math.max(0, itemsPerPageExpenses.value - paginatedExpenses.value.length)
)
const totalPagesExpenses = computed(() =>
  Math.ceil(filteredExpenses.value.length / itemsPerPageExpenses.value)
)




function handlePageChangeExpenses(newPage) {
  currentPageExpenses.value = newPage
}

// Expense form validation and submission
const validateExpenseForm = () => {
  return (
    expenseDate.value !== null &&
    (expenseCost.value !== '' && !isNaN(expenseCost.value)) &&
    expenseDescription.value.trim() !== ''
  )
}

const submitExpenseForm = () => {
  if (validateExpenseForm()) {
    // (Replace this with your DB logic as needed)
    expensesReport.value.push({
      id: expensesReport.value.length + 1,
      date: expenseDate.value.toISOString().split('T')[0],
      cost: expenseCost.value,
      description: expenseDescription.value,
    })
    // Reset form fields
    expenseDate.value = null
    expenseCost.value = ''
    expenseDescription.value = ''
    alert('Successfully added an expense!')
    expenseModalOpen.value = false
  } else {
    alert('Fill all necessary information first.')
  }
}


// ------------------------
// Date Handling & Formatters
// ------------------------
const formattedDateRange = computed(() => {
  if (!dateRange.value.from) return 'Select date range';
  if (!dateRange.value.to) return format(dateRange.value.from, 'MMM dd, yyyy');
  return `${format(dateRange.value.from, 'MMM dd, yyyy')} - ${format(dateRange.value.to, 'MMM dd, yyyy')}`;
});

const isDateRangeValid = computed(() => 
  tempDateRange.value.from && tempDateRange.value.to
);

const formatCurrency = (value) => 
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);

const formatDate = (dateString) => 
  format(new Date(dateString), 'MMM dd, yyyy');

// ------------------------
// Event Handlers
// ------------------------
const handleApply = async () => {
  if (isDateRangeValid.value) {
    dateRange.value = { ...tempDateRange.value };
    isCalendarOpen.value = false;
    await fetchData();
  }
};

const handleCancel = () => {
  tempDateRange.value = { ...dateRange.value };
  isCalendarOpen.value = false;
};

const sortBy = (column) => {
  if (sortConfig.value.column === column) {
    sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortConfig.value.column = column;
    sortConfig.value.direction = 'asc';
  }
};

// ------------------------
// Lifecycle & Watchers
// ------------------------
onMounted(fetchData);

watch([searchQuery, selectedFilter], () => {
  currentPage.value = 1;
});
watch(dateRange, fetchData, { deep: true });
watch(isCalendarOpen, (newVal) => {
  if (newVal) tempDateRange.value = { ...dateRange.value };
});

// Props
defineProps({
  direction: {
    type: String,
    default: null
  }
});



</script>
