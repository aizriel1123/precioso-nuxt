<template>
  <div @click="clearSelection">
    <Navbar />

    <div class="therapist-info-container">
      <TherapistTable class="therapist-table" @select-therapist="selectTherapist" :therapists="therapists" />
      <TherapistInfo v-if="selectedTherapist" :therapist="selectedTherapist" class="therapist-info" />
      <AddTherapist v-else class="add-therapist" @therapistAdded="addNewTherapist" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
import TherapistInfo from '@/components/TherapistInfo.vue'
import TherapistTable from '@/components/TherapistTable.vue'
import AddTherapist from '@/components/AddTherapist.vue'
import { useForm } from 'vee-validate'
const form = useForm()

const selectedTherapist = ref(null)
const therapists = ref([]) // Initialize therapists list

const selectTherapist = (therapist) => {
  selectedTherapist.value = therapist
}

// const addTherapist = (newTherapist) => {
//   therapists.value.push(newTherapist) // Add new therapist to the list
// }

const addNewTherapist = form.handleSubmit(async (values) => {
  try {
    const response = await $fetch('/api/therapist/therapist', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: values,
    });
  } catch (error) {
    console.error('Add Therapist failed:', error);
  }
  closeProductModal();
});

const clearSelection = (event) => {
  const isClickInsideTableOrTherapistInfo = event.target.closest('.therapist-table') || event.target.closest('.therapist-info')
  if (!isClickInsideTableOrTherapistInfo) {
    selectedTherapist.value = null
  }
}
</script>

<style scoped>
.therapist-info-container {
  display: flex;
  padding: 20px;
  gap: 20px;
}

.therapist-table {
  flex: 0 0 70%; /* Takes 70% of space */
}

.add-therapist {
  flex: 0 0 30%; /* Takes 30% of space */
}

.therapist-info {
  flex: 0 0 30%; /* Takes 30% of space */
}

@media (max-width: 768px) {
  .therapist-info-container {
    flex-direction: column;
  }

  .therapist-table,
  .add-therapist,
  .therapist-info {
    width: 100%;
  }
}
</style>
