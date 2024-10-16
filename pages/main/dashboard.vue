<template>
    <div>
      <NavBar />
      <div class="container mx-auto p-6">
        <h1 class="text-2xl font-bold mb-6">Salon Dashboard</h1>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Select v-model="activeChart">
                <SelectTrigger aria-label="Sales, Expenses, and Foot Traffic">
                    Sales, Expenses, and Foot Traffic
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="expenses">Expenses</SelectItem>
                    <SelectItem value="footTraffic">Foot Traffic</SelectItem>
                </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="mb-4">
                <h2 class="text-3xl font-bold">{{ activeChartData.total }}</h2>
                <p class="text-gray-500 text-sm">{{ activeChartData.label }}</p>
              </div>
              <Select v-model="selectedView" class="w-40 mb-4">
                <SelectTrigger>
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Bar :data="activeChartData.chartData" :options="chartOptions" class="h-64" />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div class="flex justify-between items-center mb-4 mt-4">
                <h3 class="font-semibold">Today's Bookings</h3>
                <Button @click="openAddBooking">Add Booking</Button>
              </div>
              <div v-for="booking in todaysBookings" :key="booking.id" class="bg-gray-100 p-4 rounded-lg mb-2">
                <p class="font-semibold">{{ booking.clientName }}</p>
                <p class="text-sm text-gray-500">{{ booking.service }} - {{ booking.time }}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent>
            <h3 class="font-semibold mb-2 mt-2">Most Recent Transaction</h3>
            <div class="bg-gray-100 p-4 rounded-lg flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p class="font-semibold">Abdul A.</p>
                  <p class="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                </div>
              </div>
              <div>
                <p class="font-semibold">₱1,000.00</p>
                <p class="text-sm text-gray-500">4:15pm</p>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-white border rounded-lg p-4 text-center">
                <p class="text-3xl font-bold">750</p>
                <p class="text-gray-500">Orders</p>
              </div>
              <div class="bg-white border rounded-lg p-4 text-center">
                <p class="text-3xl font-bold">125</p>
                <p class="text-gray-500">Clients</p>
              </div>
              <div class="bg-white border rounded-lg p-4 text-center">
                <p class="text-3xl font-bold">234</p>
                <p class="text-gray-500">Sold</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </template>

<script setup>
import { ref, computed } from 'vue'
import NavBar from '~/components/Navbar.vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const selectedView = ref('daily')
const activeChart = ref('sales')

const salesData = {
  daily: {
    total: '₱10,000.00',
    label: 'Daily Sales (Today)',
    chartData: {
      labels: ['9AM', '11AM', '1PM', '3PM', '5PM', '7PM', '9PM'],
      datasets: [{
        label: 'Sales',
        data: [1000, 1500, 2200, 2000, 2500, 2200, 1800],
        backgroundColor: '#F97316'
      }]
    }
  },
  weekly: {
    total: '₱70,000.00',
    label: 'Weekly Sales (This Week)',
    chartData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Sales',
        data: [10000, 12000, 15000, 13000, 16000, 14000, 12000],
        backgroundColor: '#F97316'
      }]
    }
  },
  monthly: {
    total: '₱300,000.00',
    label: 'Monthly Sales (This Month)',
    chartData: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Sales',
        data: [70000, 80000, 75000, 85000],
        backgroundColor: '#F97316'
      }]
    }
  }
}

const expensesData = {
  daily: {
    total: '₱5,000.00',
    label: 'Daily Expenses (Today)',
    chartData: {
      labels: ['9AM', '11AM', '1PM', '3PM', '5PM', '7PM', '9PM'],
      datasets: [{
        label: 'Expenses',
        data: [500, 800, 1200, 1500, 900, 600, 300],
        backgroundColor: '#EF4444'
      }]
    }
  },
  weekly: {
    total: '₱50,000.00',
    label: 'Weekly Expenses',
    chartData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Expenses',
        data: [8000, 7500, 9000, 8500, 7000, 6000, 5000],
        backgroundColor: '#EF4444'
      }]
    }
  },
  monthly: {
    total: '₱200,000.00',
    label: 'Monthly Expenses',
    chartData: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Expenses',
        data: [45000, 50000, 42000, 48000],
        backgroundColor: '#EF4444'
      }]
    }
  }
}

const footTrafficData = {
  daily: {
    total: '150',
    label: 'Daily Foot Traffic',
    chartData: {
      labels: ['9AM', '11AM', '1PM', '3PM', '5PM', '7PM', '9PM'],
      datasets: [{
        label: 'Foot Traffic',
        data: [10, 25, 35, 30, 40, 35, 20],
        backgroundColor: '#3B82F6'
      }]
    }
  },
  weekly: {
    total: '1,000',
    label: 'Weekly Foot Traffic',
    chartData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Foot Traffic',
        data: [150, 200, 250, 300, 280, 220, 180],
        backgroundColor: '#3B82F6'
      }]
    }
  },
  monthly: {
    total: '4,500',
    label: 'Monthly Foot Traffic',
    chartData: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Foot Traffic',
        data: [900, 1100, 950, 1200],
        backgroundColor: '#3B82F6'
      }]
    }
  }
}

const activeChartData = computed(() => {
  if (activeChart.value === 'sales') {
    return salesData[selectedView.value]
  } else if (activeChart.value === 'expenses') {
    return expensesData[selectedView.value]
  } else {
    return footTrafficData[selectedView.value]
  }
})

const chartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: '#E5E7EB'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: { display: false }
  }
}

const setActiveChart = (chart) => {
  activeChart.value = chart
  if (chart === 'expenses') {
    selectedView.value = 'weekly'
  } else if (chart === 'footTraffic') {
    selectedView.value = 'daily'
  }
}

const todaysBookings = ref([
  { id: 1, clientName: 'Jane Doe', service: 'Haircut', time: '2:00 PM' },
  { id: 2, clientName: 'John Smith', service: 'Color Treatment', time: '3:30 PM' },
  { id: 3, clientName: 'Alice Johnson', service: 'Manicure', time: '5:00 PM' },
])

const openAddBooking = () => {
  // Implement the logic to open a modal for adding a new booking
  console.log('Open add booking modal')
}
</script>