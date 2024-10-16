<template>
  <NavBar/>

  <Tabs default-value="sales" class="w-[200px]">
    <TabsList class="grid w-full grid-cols-2">
      <TabsTrigger value="sales">
        Sales
      </TabsTrigger>
      <TabsTrigger value="history">
        History
      </TabsTrigger>
    </TabsList>
  </Tabs>

  <div class="flex-components">

    <Select>
    <SelectTrigger class="w-[180px]">
      <SelectValue placeholder="Daily Sales" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="daily-sales">
          Daily Sales
        </SelectItem>
        <SelectItem value="weekly-sales">
          Weekly Sales
        </SelectItem>
        <SelectItem value="monthly-sales">
          Monthly Sales
        </SelectItem>
        <SelectItem value="annual-sales">
          Annual Sales
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>

  <Input placeholder="Find Report" class="input-report">
      <Search />
    </Input>

    <Button variant="outline" class="flex items-center space-x-2">
      <ArrowDownWideNarrow class="w-4 h-4" />
    </Button>

  <Button variant="ghost">Filter</Button>

  </div>
</template>



<script setup>
import NavBar from '~/components/Navbar.vue';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectGroup, SelectItem, SelectItemText, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue} from '@/components/ui/select';
import { Input } from '@/components/ui/input'
import { CalendarDays, ArrowDownWideNarrow, Search } from 'lucide-vue-next'

</script>