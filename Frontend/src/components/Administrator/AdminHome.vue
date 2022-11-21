<template>
  <div class="row d-flex justify-content-end m-4">
    <Button class="p-button-outlined p-button-lg p-button-danger col-md-3 col-12" @click="deconnexion">Déconnexion
    </Button>
  </div>
  <h1 class="text-center p-text-primary mt-5">Bienvenue {{ username }}</h1>
  <div class="row d-flex justify-content-center">
    <Card class="col-lg-4 col-10 m-5">
      <template #title>
        Ajouter ou enlever une version du mod
      </template>
      <template #content>
        <div class="row">
          <div class="col-lg-12">
            <p><strong>Ajouter:</strong></p>
            <p class="text-light">
              Remplir le formulaire et ajouter le fichier du mod. Le fichier doit être un .jar et le nom de la version
              doit être unique.
            </p>
            <p><strong>Enlever:</strong></p>
            <p class="text-light">
              Attention! Enlever une version du mod supprimera aussi les statistiques associées à cette version.
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="row justify-content-between">
          <router-link to="/addVersion" class="p-0 col-12 mt-2 col-lg-6">
            <Button class="p-button-secondary col-12">Ajouter une version</Button>
          </router-link>
          <router-link to="/RemoveVersion" class="p-0 col-12 mt-2 col-lg-5">
            <Button label="Enlever une version" class="col-12 p-button-outlined p-button-danger"/>
          </router-link>
        </div>
      </template>
    </Card>
    <Card class="col-lg-5 col-10 m-5">
      <template #footer>
        <p>ajouter liens vers autres pages</p>
      </template>
    </Card>

  </div>
</template>

<script lang="ts" setup>
import {useLoggedInStore} from "@/stores/loggedIn";

const store = useLoggedInStore();
const username = store.getUser.username
const deconnexion = async () => {
  await store.logout();
  window.location.href = "/";
}
</script>
