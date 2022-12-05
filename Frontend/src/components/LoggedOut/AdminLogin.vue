<template>
  <div v-if="!loading.isLoading">
    <h1 class="text-center text-light mt-1">
      Administrateurs
    </h1>
    <div class="col d-flex justify-content-center">
      <AdminLoginForm v-model="state" :errors="errors" :invalid-fields="invalidFields"/>
    </div>
    <div class="d-flex justify-content-center my-5 pb-5">
      <Button class="col-md-4 col-7 fs-1  p-button-outlined" label="Connexion" @click="logIn"/>
    </div>
  </div>
  <div v-else class="d-flex justify-content-center">
    <ProgressSpinner style="width:20rem;height:20rem" class="mt-5 col-5 p-progress-spinner-color"
                     strokeWidth="4" fill="var(--test)" animationDuration=".5s"/>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import type {ITempUser} from "@/models/user";
import {validateAdminLoginFields} from "@/utils/formValidationUtil";
import {useLoadingStore} from "@/stores/loading";
import {adminLogin} from "@/utils/apiUtils";
import {isApiError} from "@/models/error";
import {useLoggedInStore} from "@/stores/loggedIn";

const loading = useLoadingStore();
const loginStore = useLoggedInStore();
const state = ref({
  username: "",
  password: "",
} as ITempUser);
const errors = ref("");
const invalidFields = ref({
  username: false,
  password: false,
});

const sendLogin = async () => {
  const response = await adminLogin(state.value)
  if (isApiError(response)) {
    useLoadingStore().setLoading(false);
    errors.value = response.err;
    return
  }
  useLoadingStore().setLoading(false);
  window.location.href = "/";
}

const logIn = () => {
  loading.setLoading(true);
  const result = validateAdminLoginFields(state.value)
  errors.value = result.errors;
  delete result.errors
  invalidFields.value = result;
  if (hasErrors()) {
    loading.setLoading(false);
    return;
  }
  sendLogin()
}

const hasErrors = () => {
  return errors.value !== "";
}
</script>
