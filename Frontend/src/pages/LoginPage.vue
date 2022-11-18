<template>
  <div class="col-6 m-5">
    <HomeButton/>
  </div>
  <h1 class="text-center text-light mt-1">
    Connectez-vous
  </h1>
  <TabView class="p-5">
    <TabPanel header="Utilisateur" class="m-5">
      <UserLogin/>
    </TabPanel>
    <TabPanel header="Administrateur">
      <AdminLogin/>
    </TabPanel>
  </TabView>

</template>
<script setup lang="ts">
import {useLoadingStore} from "@/stores/loading";

const loading = useLoadingStore();
</script>