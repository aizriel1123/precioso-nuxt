<template>
    <NavBar/>
    <div class="center-components">
      <h1 class="title">Appointment</h1>
  
      <div class="contain-components">
        
        <!-- Select Client Form -->
        <div class="container-selectclient">
          <form @submit.prevent="submitClientSelection">
            <div class="selectclient-content">
                <FormField v-slot="{ componentField }" name="client-name">
                    <FormLabel>Select Client</FormLabel>
                        <Input type="text" placeholder="Add New Client" v-bind="componentField"/>
                </FormField>
                <Button type="submit" class="button">Create New Client</Button>
             </div>
          </form>
  
          <div class="tabs">
            <Tabs :default-value="'service'" class="w-[400px]">
              <TabsList>
                <TabsTrigger :value="'service'">Service</TabsTrigger>
                <TabsTrigger :value="'product'">Product</TabsTrigger>
                <TabsTrigger :value="'promos'">Promos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
  
          <div class="container-purchasedgoods">
            <form @submit.prevent="submitClientSelection">
                <FormField v-slot="{ componentField }" name="goods-one">
                    <FormItem>
                        <FormLabel>Enter Service</FormLabel>
                        <FormControl>
                            <Input v-bind="componentField" type="text" placeholder="Enter..." />
                        </FormControl>
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="goods-two">
                    <FormItem>
                        <FormControl>
                            <Input v-bind="componentField" type="text" placeholder="Enter..." />
                        </FormControl>
                    </FormItem>
                </FormField>

                <Button type="submit" class="button">Add Service</Button>
            </form>
          </div>
  
          <div class="container-otherdetails">
            <div class="input-group">
              <Select v-bind="componentField" v-model="selectedTherapist">
                <SelectTrigger class="dropdown-trigger">
                  <SelectValue placeholder="Select a Therapist" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="therapist1">Therapist 1</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
  
            <div class="input-group">
              <div class="calendar-container">
                <!-- Warning somewhere here, will fix later -->
                <Popover>
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      :class="cn('w-full justify-start text-left font-normal', 'text-muted-foreground')"
                    >
                      <CalendarIcon class="mr-2 h-4 w-4" />
                      {{ value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date" }}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="calendar-popover">
                    <div class="calendar-wrapper">
                      <Calendar v-model="value" initial-focus />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
  
            <div class="input-group">
              <Select v-bind="componentField" v-model="selectedTime">
                <SelectTrigger class="dropdown-trigger">
                  <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="nine-am">9:00AM</SelectItem>
                    <SelectItem value="ten-am">10:00AM</SelectItem>
                    <SelectItem value="eleven-am">11:00AM</SelectItem>
                    <SelectItem value="twelve-pm">12:00PM</SelectItem>
                    <SelectItem value="one-pm">1:00PM</SelectItem>
                    <SelectItem value="two-pm">2:00PM</SelectItem>
                    <SelectItem value="three-pm">3:00PM</SelectItem>
                    <SelectItem value="four-pm">4:00PM</SelectItem>
                    <SelectItem value="five-pm">5:00PM</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
  
        <!-- Reservation details form -->
        <div class="container-reservationdetails">
          <h2 class="selected-product-title">Appointment Details</h2>
  

        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import NavBar from '~/components/Navbar.vue';
  import { Button } from '@/components/ui/button';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
  import { Input } from '@/components/ui/input';
  import {  FormControl, FormField, FormLabel , FormItem } from '@/components/ui/form';
  import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs';
  import { Calendar as CalendarIcon } from 'lucide-vue-next';
  import { Calendar } from '@/components/ui/calendar';
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
  import { cn } from '@/lib/utils';
  import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
  
  const selectedTime = ref('');
  const selectedTherapist = ref('');
  const value = ref(null);
  const componentField = ref(null);
  
  // Calendar Date
  const df = new DateFormatter('en-US', {
    dateStyle: 'long',
  });
  </script>
  
  <style>
  .title {
    font-size: 48px;
    font-weight: bolder;
  }
  
  .center-components {
    margin-top: 10px;
    margin-left: 2%;
    margin-right: 2%;
    margin-bottom: 10px;
  }
  
  .contain-components {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-top: 10px;
  }
  
  .container-selectclient {
    flex-basis: 40%;
    border: 1px solid #000000;
    border-radius: 8px;
    padding: 16px;
  }
  
  .container-reservationdetails {
    flex-basis: 60%;
    border: 1px solid #000000;
    border-radius: 8px;
    padding: 16px;
  }
  
  .button {
    padding: 8px;
    background-color: #000000;
    color: #ffffff;
  }
  
  .icon-small {
    width: 16px;
    height: 16px;
  }
  
  .selectclient-content {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    margin-bottom: 16px;
    gap: 10px;
}
  
  .selected-product-title {
    font-size: 20px;
    margin-bottom: 16px;
    font-weight: bolder;
  }
  
  .tabs {
    padding-top: 16px;
    padding-bottom: 16px;
  }
  
  .container-purchasedgoods {
    border: 1px solid #d8d8d8;
    border-radius: 8px;
    padding: 16px;
    width: 100%;
    margin-bottom: 16px;
  }
  
  .container-purchasedgoods Input {
    margin-top: 5px;
  }
  
  .container-purchasedgoods Button {
    margin-top: 10px;
  }
  
  .container-otherdetails {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .input-group {
    width: 100%;
  }
  
  .calendar-container {
    position: relative;
    display: inline-block;
    width: 100%;
  }
  
  .calendar-wrapper {
    max-width: 250px;
    max-height: 290px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dropdown-trigger {
    width: 100%;
  }
  </style>