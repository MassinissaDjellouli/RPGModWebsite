<template>

  <div class="col-6 m-5">
    <HomeButton/>
  </div>
  <div v-if="!loading.isLoading">
    <h1 class="text-center text-light m-5">
      Confirmez votre email
    </h1>
    <div class="container">
      <div class="row d-flex justify-content-center">
        <div class="col-lg-6 mb-4 row align-content-center">
          <div class="col d-flex justify-content-center">
            <LoginForm v-model="state" :errors="errors" :invalid-fields="invalidFields"/>
          </div>
        </div>
        <div class="col-lg-6 row align-content-center">
          <div class="col ">
            <p class="text-danger mb-2 mx-2 h5 text-center" v-if="hasConfirmationError">
              {{ confirmationError }}</p>
            <p class="text-secondary mb-2 mx-2 h5 text-center">Entrez votre code de confirmation ici</p>
            <InputText placeholder="Code de confirmation" v-model="confirmation" class="col-12"
                       :class="{'p-invalid':hasConfirmationError()}"/>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center mt-5">
      <Button class="col-4 fs-1  p-button-outlined" label="Confirmer" @click="confirmEmail"/>
    </div>
  </div>
  <div v-else class="d-flex justify-content-center">
    <ProgressSpinner style="width:20rem;height:20rem" class="mt-5 col-5 p-progress-spinner-color"
                     strokeWidth="4" fill="var(--test)" animationDuration=".5s"/>
  </div>
</template>
<script setup lang="ts">

import {ref} from "vue";
import {useLoadingStore} from "@/stores/loading";
import {validateLoginFields} from "@/utils/formValidationUtil";
import {confirmEmail as confirmEmailRequest} from "@/utils/apiUtils";
import {isApiError} from "@/models/error";
import type {ITempUser} from "@/models/user";

const loading = useLoadingStore();

const hasErrors = () => {
  return errors.value !== "";
}
const hasConfirmationError = () => {
  return confirmationError.value !== "";
}
const confirmEmail = () => {
  confirmationError.value = "";
  if (confirmation.value === "") {
    confirmationError.value = "Veuillez entrer un code de confirmation";
    return;
  }
  loading.loading = true;
  const result = validateLoginFields(state.value)
  errors.value = result.errors;
  delete result.errors
  invalidFields.value = result;
  if (hasErrors()) {
    loading.setLoading(false);
    return;
  }
  sendConfirm()
}
const sendConfirm = async () => {
  const response = await confirmEmailRequest(confirmation.value, state.value as ITempUser)
  if (isApiError(response)) {
    errors.value = response.err;
  }
  useLoadingStore().setLoading(false);
}
const state = ref({
  username: "",
  password: "",
});
const errors = ref("");
const confirmationError = ref("");
const invalidFields = ref({
  username: false,
  password: false,
});
const confirmation = ref("");
</script>