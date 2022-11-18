<template>
  <LoggedOutNavBar/>
  <div>
    <h1 class="text-center text-light mt-4">Bienvenue sur la page d'accueil!</h1>
    <div class="row d-flex justify-content-center">
      <p class="text-center text-light mt-4 col-md-9 col-lg-7 col-xl-5">Inscrivez vous pour pouvoir uploader vos
        statistique et les
        consulter, laisser des commentaires (si j'ai le temps d'implémenter ça) et plus (Pas garantie)</p>
    </div>
    <h4 class="text-center text-light mt-4">Inscrivez vous:</h4>
    <div class="d-flex justify-content-center row">
      <router-link to="/inscription" class="text-light no-line col-md-2 col-6 p-0  mt-3 ">
        <Button l class="p-button-lg p-button-raised p-4 col-12">
          Vous inscrire
        </Button>
      </router-link>
      <div class="col-12 d-flex justify-content-center row">
        <router-link to="/login" class="text-center text-light mt-1 col-1">Déja inscrit?</router-link>
      </div>
      <Card class="col-xl-4 col-8 mt-5">
        <template #header>
        </template>
        <template #title>
          RPGMod
        </template>
        <template #content>
          <div class="row">
            <div class="col-lg-6">
              <p class="text-light">
                RPGMod est une mod de style RPG pour Minecraft,
                il est en cours de développement pour un projet scolaire.
                Le code est open source et disponible sur GitHub.
                L'inspiration principale du mod est le
                <a href="https://hypixel.net/categories/skyblock.194/">skyblock Hypixel.</a>
              </p>
            </div>
            <div class="col-6 d-flex  justify-content-end">
              <img class="w60 d-lg-inline d-none" src="../../assets/githubLogo.png" alt="Github"></div>
          </div>
        </template>
        <template #footer>
          <div class="row justify-content-between">
            <router-link to="/modVersions" class="p-0 d-lg-inline d-none col-2 col-lg-4">
              <Button class="p-button-secondary col-12">Télécharger le mod
                <i class="pi pi-cloud-download d-lg-none d-inline"></i>
              </Button>
            </router-link>
            <Button @click="goToDocs()" label="Voir la documentation" class="col-lg-7 col-9 p-button-outlined"/>
          </div>
        </template>
      </Card>
    </div>
  </div>
  <footer class="footer mt-5">
    <div class="row justify-content-center text-center dark">
      <p class="text-light mt-1"> Massinissa Djellouli 2022.
        <a href="https://github.com/MassinissaDjellouli/" class="text-light">Github</a>
      </p>
    </div>
  </footer>
</template>
<script lang="ts" setup>
import {goToDocs} from '@/utils/generalUtils';</script>