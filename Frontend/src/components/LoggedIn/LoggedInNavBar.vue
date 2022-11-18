<template>
  <Toolbar>
    <template #start>
      <Button icon="pi pi-bars" class="ps-1 p-button-outlined" @click="showSideBar"/>
    </template>

    <template #end>
      <Button @click="goToDocs()" class="p-button-text mx-4 p-button-lg" v-ripple>Documentation</Button>
      <Button class="p-button-outlined p-button-lg p-button-danger" @click="deconnexion">Déconnexion</Button>
    </template>
  </Toolbar>
</template>
<script lang="ts" setup>
const props = defineProps(["sidebar"])
import {useLoggedInStore} from '@/stores/loggedIn';
import {goToDocs} from '@/utils/generalUtils';

const showSideBar = () => {
  props.sidebar.shown = true;
}
const store = useLoggedInStore();
const deconnexion = () => {
  store.logout();
  window.location.href = "/";
}
</script>