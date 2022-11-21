<template>
  <div v-if="!loading.isLoading">

    <h1 class="text-center text-light mt-1">
      Utilisateurs
    </h1>
    <div class="row justify-content-center d-flex pb-5">
      <router-link to="/confirmEmail" class="text-center text-light mt-1 col-lg-2 col-sm-4 col-md-3 col-6">Email à
        confirmer?
      </router-link>
    </div>
    <div class="col d-flex justify-content-center">
      <LoginForm v-model="state" :errors="errors" :invalid-fields="invalidFields"/>
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
import type {ITempUser, ITempUserEmail, ITempUserUsername} from "@/models/user";
import {isEmailAddress, validateLoginFields} from "@/utils/formValidationUtil";
import {useLoadingStore} from "@/stores/loading";
import {login} from "@/utils/apiUtils";
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
  const currentState: ITempUserUsername = state.value as ITempUserUsername;
  const isEmail = isEmailAddress(currentState.username);
  if (isEmail) {
    state.value = {
      email: currentState.username,
      password: currentState.password,
    } as ITempUserEmail;
  }
  const response = await login(state.value)
  if (isApiError(response)) {
    useLoadingStore().setLoading(false);
    errors.value = response.err;
    return
  }
  await loginStore.login(response);
  useLoadingStore().setLoading(false);
  window.location.href = "/";
}

const logIn = () => {
  loading.setLoading(true);
  const result = validateLoginFields(state.value)
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
