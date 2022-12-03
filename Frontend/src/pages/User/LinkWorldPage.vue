<template>

  <div class="col-6 m-5">
    <HomeButton/>
  </div>
  <div v-if="!worldLinked">

    <h1 class="text-center text-danger">
      {{ requestError }}
    </h1>
    <div v-if="!loading.isLoading">
      <h1 class="text-center text-light mt-5">
        Liez un monde minecraft
      </h1>
      <div class="row">
        <div class="row  d-flex justify-content-center mt-3">
          <p class="text-light text-center col-10  col-md-8 col-xl-3">Vous pouvez décider de lier un de vos mondes
            minecraft afin
            d'automatiquement sauvegarder
            les statistiques
            générées par le mod!
          </p>
        </div>
        <div class="row  d-flex justify-content-center">
          <h5 class="p-text-primary text-center col-10  col-md-8 col-xl-6">
            <br/><br/> Pour le lier, allez dans votre monde minecraft, puis appuyez sur la touche N
            (touche par défaut) ou la touche que vous avez configurée pour ouvrir le menu "Lier son compte"
          </h5>
        </div>
      </div>
      <div class="container">
        <div class="row d-flex justify-content-center">
          <div class="col-lg-6 row align-content-center">
            <div class="col ">
              <p class="text-danger mb-2 mx-2 h5 text-center" v-if="hasCodeError">
                {{ codeError }}</p>
              <p class="text-secondary mb-2 mx-2 h5 text-center">Entrez votre code de monde ici</p>
              <InputText placeholder="Code de monde" v-model="code" class="col-12"
                         :class="{'p-invalid':hasCodeError()}"/>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center mt-5">
        <Button class="col-4 fs-1  p-button-outlined" label="Confirmer" @click="linkWorld"/>
      </div>
    </div>
    <div v-else class="d-flex justify-content-center">
      <ProgressSpinner style="width:20rem;height:20rem" class="mt-5 col-5 p-progress-spinner-color"
                       strokeWidth="4" fill="var(--test)" animationDuration=".5s"/>
    </div>
  </div>
  <div v-else>
    <h1 class="text-center p-text-primary">
      Votre compte est maintenant lié à ce monde minecraft!
    </h1>
    <h4 class="text-center p-text-primary">
      Vous pouvez maintenant quitter cette page
    </h4>
  </div>
</template>
<script setup lang="ts">

import {ref} from "vue";
import {useLoadingStore} from "@/stores/loading";
import {linkMinecraftWorld} from "@/utils/apiUtils";
import {isApiError} from "@/models/error";

const loading = useLoadingStore();

const hasErrors = () => {
  return errors.value !== "";
}
const hasCodeError = () => {
  return codeError.value !== "";
}
const linkWorld = () => {
  codeError.value = "";
  if (code.value === "") {
    codeError.value = "Veuillez entrer un code";
    return;
  }
  loading.setLoading(true);
  if (hasErrors()) {
    loading.setLoading(false);
    return;
  }
  link()
}
const link = async () => {
  const response = await linkMinecraftWorld(code.value.trim())
  useLoadingStore().setLoading(false);
  if (isApiError(response)) {
    requestError.value = response.err;
    return
  }
  worldLinked.value = true;
}
const errors = ref("");
const codeError = ref("");
const requestError = ref("");
const worldLinked = ref(false);
const code = ref("");
</script>