<template>
  <Toolbar>
    <template #start>
      <h1 class="text-light">RPGMod</h1>
    </template>

    <template #end>
      <Button @click="goToDocs()" class="p-button-text mx-4 p-button-lg" v-ripple>Documentation</Button>
      <router-link to="/login" class="text-center text-light mt-1">
        <Button class="p-button-outlined p-button-lg" v-ripple>
          <p class="d-md-inline d-none">Se connecter</p>
          <i class="d-inline d-md-none pi pi-sign-in"/>
        </Button>
      </router-link>


    </template>
  </Toolbar>
</template>
<script lang="ts" setup>
import {goToDocs} from '@/utils/generalUtils';
import {useLoggedInStore} from '@/stores/loggedIn';

const store = useLoggedInStore();
</script>