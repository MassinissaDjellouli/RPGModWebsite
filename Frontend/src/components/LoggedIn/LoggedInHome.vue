<template>
  <LoggedInNavBar :sidebar="sidebar"/>
  <Sidebar v-model:visible="sidebar.shown" class="row">
    <h1 class="col-12 text-light text-center">
      RPGMod
    </h1>
    <router-link to="/modVersions" class=" text-light no-line">
      <Button class="col-12 text-light mt-4 p-button-text">
        Télécharger le mod
      </Button>
    </router-link>
    <Button class="col-12 text-light mt-4 p-button-text" @click="goToDocs">
      Voir la documentation
    </Button>
    <router-link to="/" class=" text-light no-line">
      <Button class="col-12 text-light mt-4 p-button-text">
        Statistiques des joueurs
      </Button>
    </router-link>
    <router-link to="/" class=" text-light no-line">
      <Button class="col-12 text-light mt-4 p-button-text">
        Mes statistiques
      </Button>
    </router-link>
    <router-link to="/LinkWorld" class=" text-light no-line">
      <Button class="col-12 text-light mt-4 p-button-text">
        Lier un monde Minecraft
      </Button>
    </router-link>

  </Sidebar>
  <h1 class="text-center p-text-primary mt-5">Bienvenue {{ username }}</h1>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {goToDocs} from "@/utils/generalUtils";
import {useLoggedInStore} from "@/stores/loggedIn";

const store = useLoggedInStore();
const username = store.getUser.username
const sidebar = ref({shown: false});
</script>
