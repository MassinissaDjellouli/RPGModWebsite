<template>
  <div class="row m-5" v-if="!loading.isLoading">
    <h1 class="text-center text-light mt-5 mb-4">Inscription</h1>
    <h2 class="text-center text-danger mb-4" v-if="hasErrors()">{{ errors }}</h2>
    <div class="d-flex justify-content-center">
      <div class="container">
        <div class="row mt-3">
          <label class="text-secondary mb-2 h5">Nom d'utilisateur</label>
          <div class="p-inputgroup p-0 m-0 row">
                        <span class="p-inputgroup-addon col-1 d-flex justify-content-center">
                            <i class="pi pi-user pt-1"></i>
                        </span>
            <InputText placeholder="Nom d'utilisateur" :class="{'p-invalid':state.fieldErrors.username}"
                       v-model="state.username" class="col-xs-11 col-10"/>
          </div>
        </div>
        <div class="row mt-3 ">
          <label class="text-secondary mb-2 h5">Adresse email</label>
          <div class="p-inputgroup  p-0 m-0 row">
                        <span class="p-inputgroup-addon col-1 d-flex justify-content-center">
                            <i class="pi pi-at pt-1"></i>
                        </span>
            <InputText placeholder="Adresse email" v-model="state.email" type="email" class=" col-xs-11 col-10"
                       :class="{'p-invalid':state.fieldErrors.email}"/>
          </div>
        </div>
        <div class="row mt-3 ">
          <label class="text-secondary mb-2 h5">Mot de passe</label>
          <div class="p-inputgroup row p-0 m-0">
                        <span class="p-inputgroup-addon col-1 d-flex justify-content-center">
                            <i class="pi pi-key pt-1"></i>
                        </span>
            <Password class="col-xs-11 col-10 custom-pwd ps-0" v-model="state.password"
                      :class="{'p-invalid':state.fieldErrors.password}">
              <template #header>
                <h6>Pick a password</h6>
              </template>
              <template #footer>
                <Divider/>
                <p class="mt-2">Requirements:</p>
                <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                  <li>Minimum 8 characters</li>
                </ul>
                <Divider/>
                <p class="mt-2">Suggestions</p>
                <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                  <li>At least one lowercase</li>
                  <li>At least one uppercase</li>
                  <li>At least one numeric</li>
                </ul>
              </template>
            </Password>
          </div>
        </div>
        <div class="row mt-3 ">
          <label class="text-secondary mb-2 h5">Valider le mot de passe</label>
          <div class="p-inputgroup p-0 m-0 row">
                        <span class="p-inputgroup-addon col-1 d-flex justify-content-center ">
                            <i class="pi pi-key pt-1"></i>
                        </span>
            <InputText id="pwdConfirm" type="password" v-model="state.pwdConfirm"
                       :class="{'p-invalid':state.fieldErrors.pwdConfirm}" class="col-xs-11 col-10"/>
          </div>
        </div>
        <div class="d-flex justify-content-center mt-4">
          <Button class="col-6 fs-1  p-button-outlined" label="Envoyer" @click="submit"/>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="d-flex justify-content-center">
    <ProgressSpinner style="width:20rem;height:20rem" class="mt-5 col-5 p-progress-spinner-color"
                     strokeWidth="4" fill="var(--test)" animationDuration=".5s"/>
  </div>
</template>
<script lang="ts" setup>
const loading = useLoadingStore();
import {reactive, ref} from "vue";
import {validateInscriptionFields} from "@/utils/formValidationUtil";
import {useLoadingStore} from "@/stores/loading";
import {inscription} from "@/utils/apiUtils";
import {isApiError} from "@/models/error";

const state = reactive({
  username: '',
  email: '',
  password: '',
  pwdConfirm: '',
  fieldErrors: {
    username: false,
    email: false,
    password: false,
    pwdConfirm: false
  }
})
const hasErrors = () => {
  return errors.value !== "";
}
const submit = () => {
  loading.loading = true;
  const result = validateInscriptionFields(state)
  errors.value = result.errors;
  delete result.errors
  state.fieldErrors = result;
  if (hasErrors()) {
    loading.setLoading(false);
    return;
  }
  sendInscription()
}
const sendInscription = async () => {
  const response = await inscription({username: state.username, email: state.email, password: state.password})
  if (isApiError(response)) {
    errors.value = response.err;
    useLoadingStore().setLoading(false);
    return;
  }
  useLoadingStore().setLoading(false);
  window.location.href = "/confirmEmail";
}
const errors = ref("");
</script>

