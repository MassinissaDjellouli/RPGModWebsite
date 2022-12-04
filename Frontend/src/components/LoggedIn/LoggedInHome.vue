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
    <router-link to="/MyStats" class=" text-light no-line">
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
  <div class="row d-flex justify-content-center p-5">
    <Card class="m-5">
      <template #title>
        Que faire?
      </template>
      <template #content>
        <div class="row">
          <div class="col-lg-12">
            <p><strong>Télécharger le mod</strong></p>
            <p class="text-light">
              Vous pouvez télécharger n'importe quelle version du mod en cliquant sur le bouton "Télécharger le mod".
            </p>
            <p><strong>Lier un monde minecraft avec ce compte</strong></p>
            <p class="text-light">
              Vous pouvez lier un monde Minecraft avec votre compte pour pouvoir voir les statistiques de ce monde. Des
              données de ce monde seront envoyées automatiquement quand vous allez jouer dessus une fois le compte lié.
              Vous pouvez les consulter en cliquant sur le bouton "Mes statistiques".
            </p>
            <p><strong>Voir mes statistiques</strong></p>
            <p class="text-light">
              Vous pouvez voir vos statistiques en cliquant sur le bouton "Mes statistiques". Vous pouvez les consulter
              pour chaque monde lié et les télécharger au format json.
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="row justify-content-between">
          <router-link to="/modVersions" class="p-0 col-12 mt-2 col-lg-4">
            <Button class="p-button col-12">Télécharger le mod</Button>
          </router-link>
          <router-link to="/LinkWorld" class="p-0 col-12 mt-2 col-lg-4">
            <Button label="Lier un monde" class="col-12 p-button-outlined"/>
          </router-link>
          <router-link to="/MyStats" class="p-0 col-12 mt-2 col-lg-3">
            <Button label="Mes statistiques" class="col-12 p-button-secondary"/>
          </router-link>
        </div>
      </template>
    </Card>

  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {goToDocs} from "@/utils/generalUtils";
import {useLoggedInStore} from "@/stores/loggedIn";

const store = useLoggedInStore();
const username = store.getUser.username
const sidebar = ref({shown: false});
</script>
