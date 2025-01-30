<template>
  <NavBar/>
    <div class="center-components">
        <h1 class="title">Expenses</h1>
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
          <Input placeholder="Search by description..." v-model="searchQuery" class="input_search" />
        </div>

        <div class="right-side">
          <!-- Buttons for adding new product/supplier and enable editing in form 'edit selected product' -->
          <Button variant="ghost" class="button" @click="isNewExpenseModalOpen=true">Add New Expense</Button>
        </div>
      </div>

          <div class="table-product-container">
            <div class="container-table">
              <div class="table-content">
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
                      v-for="(expenses,index) in paginatedReports" 
                      :key="`${expenses.id}-${index}`"  
                    >
                      <TableCell>{{ expenses.id }}</TableCell>
                      <TableCell>{{ expenses.date }}</TableCell>
                      <TableCell>{{ expenses.cost }}</TableCell>
                      <TableCell>{{ expenses.description }}</TableCell>
                    </TableRow>
                    <!-- Populate empty rows if current row count is les than 10 -->
                    <TableRow v-for="index in emptyRows" :key="'empty-' + index" class="empty-row">
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

            <div v-if="isNewExpenseModalOpen" class="modal-overlay">
            <div class="modal-content">
              <h2 class="selected-product-title">Add New Expense</h2>

              <form @submit.prevent="submitExpenseForm">
                <FormField v-slot="{ componentField }" name="date">
                <FormLabel class="label">Select Date</FormLabel>
                    <Popover>
                      <PopoverTrigger as-child>
                        <Button variant="outline" :class="cn('w-full justify-start text-left font-normal', 'text-muted-foreground')">
                          <CalendarIcon class="mr-2 h-4 w-4" />
                          {{ value ? datePurchased.format(value.toDate(getLocalTimeZone())) : "Pick a date" }}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent class="calendar-popover">
                        <div class="calendar-wrapper">
                          <Calendar v-model="value" initial-focus />
                        </div>
                      </PopoverContent>
                    </Popover>
                </FormField>

                <FormField v-slot="{ componentField }" name="cost">
                  <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input v-model=cost type="number" min="0" placeholder="Enter cost" />
                    </FormControl>
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="description">
                  <FormLabel class="label">Description</FormLabel>
                  <textarea v-model=description placeholder="Enter description" class="w-flex h-100 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-h-[500px]"></textarea>
                </FormField>

                <div class="action-buttons">
                  <Button variant="ghost" type="button" @click="isNewExpenseModalOpen = false">Cancel</Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </div>
          </div>
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
import { ref, computed } from 'vue'
import { cn } from '@/lib/utils'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { Calendar } from '@/components/ui/calendar'
import { DateFormatter, getLocalTimeZone, maxDate, minDate } from '@internationalized/date'

//Sample data for Individual Sales
const expensesReport = ref([
{ id:1, date: '2025-1-9', cost: 200, description: 'Massage Therapy'},
{ id:1, date: '2025-1-9', cost: 200, description: 'dsadasd'},

]);

const cost=ref('')
const description=ref('')

//For Popup
const isNewExpenseModalOpen = ref(false)

//Placeholder for calendar value
const value = ref(null)

const datePurchased = new DateFormatter('en-US', {
  dateStyle: 'long',
});

//Defauls values for inputs/selects
const searchQuery = ref('');
const selectedPeriod = ref('past-24-hours');

//Filter by time period
const filteredExpenses = computed(() => {
const now = new Date(); // Current date and time
let startDate;

if (selectedPeriod.value === 'past-24-hours') {
  startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Subtract 24 hours
} else if (selectedPeriod.value === 'past-7-days') {
  startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Subtract 7 days
} else if (selectedPeriod.value === 'past-30-days') {
  startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Subtract 30 days
}

// Filter by date range
let expenses = expensesReport.value;
if (startDate) {
  expenses = expenses.filter(expense => new Date(expense.date) >= startDate);
}

// Filter by search query
if (searchQuery.value) {
  expenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
}

return expenses;
});

const validateForm = () => {
  return (
    value.value !== null &&
    (cost.value !== '' && !isNaN(cost.value) ) &&
    description.value.trim() !== ''
  )
};


const submitExpenseForm = () => {
  if (validateForm()) {
    // Add db logic here

    // Reset values
    value.value = null; // Reset the date value
    cost.value = '';
    description.value = '';

    alert('Successfully added an expense!');
    // Close modal after submission
    isNewExpenseModalOpen.value = false;
  } else {  
    alert('Fill all necessary information first.');
  }
};

//For pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Pagination
const paginatedReports = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return filteredExpenses.value.slice(startIndex, startIndex + itemsPerPage.value);
});

const emptyRows = computed(() => Math.max(0, itemsPerPage.value - paginatedReports.value.length));
const totalPages = computed(() => Math.ceil(filteredExpenses.value.length / itemsPerPage));

function handlePageChange(newPage) {
  currentPage.value = newPage
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
    flex-basis: 100%; 
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