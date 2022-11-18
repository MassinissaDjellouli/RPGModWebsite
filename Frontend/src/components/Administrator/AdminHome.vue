<template>
  <Button class="p-button-outlined p-button-lg p-button-danger" @click="deconnexion">Déconnexion</Button>
  <h1 class="text-center p-text-primary mt-5">Bienvenue {{ username }}</h1>
</template>

<script lang="ts" setup>
import {useLoggedInStore} from "@/stores/loggedIn";

const store = useLoggedInStore();
const username = store.getUser.username
const deconnexion = () => {
  store.logout();
  window.location.href = "/";
}
</script>
