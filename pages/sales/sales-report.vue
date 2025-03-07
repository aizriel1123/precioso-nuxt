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
                    <input
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
                          <Badge variant="outline">
                            {{ transaction.mop }}
                          </Badge>
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
              
              <!-- Pagination -->
              <div class="flex items-center justify-between px-2 py-4">
                <div class="text-sm text-muted-foreground">
                  Showing {{ paginationRange }} of {{ filteredTransactions.length }} transactions
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        @click.prevent="currentPage--"
                        :disabled="currentPage === 1"
                      />
                    </PaginationItem>
                    <PaginationItem v-for="page in totalPages" :key="page">
                      <PaginationLink 
                        href="#" 
                        @click.prevent="currentPage = page"
                        :is-active="currentPage === page"
                      >
                        {{ page }}
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        @click.prevent="currentPage++"
                        :disabled="currentPage === totalPages"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
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
  transactions.value.filter(t => t.type === 'Service').length
)

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
  // Net Profit = Gross Profit - Expenses
  return Object.values(dailyData).map(day => ({
    ...day,
    net_profit: day.gross_profit - day.expenses,
  }));
});

// Define custom colors for the chart:
// Order: revenue, gross_profit, net_profit, expenses
const chartColors = ['#34D399', '#FBBF24', '#60A5FA', '#F87171'];

// Recent Sales – last 5 transactions (sorted by date descending)
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
const filteredTransactions = computed(() => {
  return transactions.value
    .filter(t => {
      const searchMatch = Object.values(t).some(value =>
        String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
      );
      const filterMatch =
        selectedFilter.value === 'all' ||
        (selectedFilter.value === 'service' && t.type === 'Service') ||
        (selectedFilter.value === 'product' && t.type === 'Product') ||
        (selectedFilter.value === 'cash' && t.mop === 'Cash') ||
        (selectedFilter.value === 'card' && t.mop === 'Card');
      return searchMatch && filterMatch;
    })
    .sort((a, b) => {
      const modifier = sortConfig.value.direction === 'asc' ? 1 : -1;
      return a[sortConfig.value.column] > b[sortConfig.value.column] ? modifier : -modifier;
    });
});

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTransactions.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => 
  Math.ceil(filteredTransactions.value.length / itemsPerPage)
);

const paginationRange = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage.value * itemsPerPage, filteredTransactions.value.length);
  return `${start}-${end}`;
});

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
