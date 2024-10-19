<template>
  <nav class="navbar">
    <div class="logo">
      <img src="/src/images/logo_precioso.png" alt="precioso logo" />
    </div>

    <!-- Added random paths for now, edit this part later -->
    <div class="nav-buttons">
      <Button variant="ghost" @click="goToRoute('/main/dashboard')">Dashboard</Button>
      <Button variant="ghost" @click="goToRoute('/main/pos/')">Counter</Button>
      <Button variant="ghost" @click="goToRoute('/inventory/inventory')">Inventory</Button>
      <Button variant="ghost" @click="goToRoute('/sales/sales-report')">Sales</Button>
      <Button variant="ghost" @click="goToRoute('/customers/client')">Client</Button>
      <Button variant="ghost" @click="goToRoute('/therapists/therapist')">Therapist</Button>
      <Button variant="ghost" @click="goToRoute('/appointments/appointments')">Appointment</Button>

    </div>

    <div class="searchbar-avatar">
    <div class="searchbar">
      <Input placeholder="Search..." />
    </div>

    <!-- Warning somewhere here, will fix later -->
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
  </div>
</nav>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar' // can add AvatarImage later
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LogOut, Settings } from 'lucide-vue-next'

const router = useRouter()

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