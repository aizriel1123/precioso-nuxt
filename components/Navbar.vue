<template>
    <nav class="navbar">
      <div class="logo">
        <img src="/src/images/logo_precioso.png" alt="precioso logo" />
      </div>
  
      <!-- Added random paths for now, edit this part later -->
      <div class="nav-buttons">
        <Button variant="ghost" @click="goToRoute('/main/pos/')">Counter</Button>
        <Button variant="ghost" @click="goToRoute('/sales/sales-report')">Sales</Button>
        <Button variant="ghost" @click="goToRoute('/inventory/inventory')">Inventory</Button>
        <Button variant="ghost" @click="goToRoute('/expenses/expenses')">Expenses</Button>
        <Button variant="ghost" @click="goToRoute('/services/services')">Services</Button>
        <Button variant="ghost" @click="goToRoute('/customers/customers')">Client</Button>
        <Button variant="ghost" @click="goToRoute('/therapists/beautician')">Therapist</Button>
        <Button variant="ghost" @click="goToRoute('/suppliers/suppliers')">Suppliers</Button>
        <Button variant="ghost" @click="goToRoute('/appointments/appointments')">Appointments</Button>
      </div>

      <div class="avatar">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Avatar>
              <AvatarFallback>ME</AvatarFallback> 
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-56 dropdown-content ">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="goToRoute('/login-register/login')">
              <LogOut class="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  </template>
  
<script setup>
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar' // can add AvatarImage later
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-vue-next'
import { onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'

const router = useRouter()
onBeforeMount(async () => {
  console.log(localStorage.getItem('token'))
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const decoded = jwtDecode(token)
      console.log(decoded)
      // If the user type is 1 and we're not already on /main/pos, redirect there
      console.log("THIS FAR IS WHERE U ARE")
      console.log("THIS IS MY TYPE ID")
      console.log(decoded.typeId)
      if (decoded.typeId === 0) {
        router.push('/main/pos')
        return
      }
    } catch (error) {
      console.error('Error decoding token:', error)
      router.push('/main/pos')
      return
    }
  } else {
    // If no token is found, redirect as well
    router.push('/login-register/login')
    console.log("AAAAAAAAA")
    return
  }
});
const goToRoute = (route) => {
  router.push(route) // Go to the specified route
}


</script>

<style>
.navbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 20px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logo img {
  min-width: 200px;
  max-width: 50px;
}

.nav-buttons {
  display: flex;
  gap: 16px;
  margin: 10px 0; 
}

.searchbar-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%; 
}

.searchbar {
  flex-grow: 1;
  padding: 0 20px;
}

.searchbar input {
  width: 100%;
}

.avatar {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.dropdown-content{
  margin-right: 10px;
}

/* Media queries */
@media (min-width: 1025px) {
  .navbar {
    flex-direction: row; 
    justify-content: space-between;
  }

  .nav-buttons {
    flex-direction: row; 
    margin: 0; 
  }

  .searchbar-avatar {
    margin-left: 20px; 
  }
}
</style>
  