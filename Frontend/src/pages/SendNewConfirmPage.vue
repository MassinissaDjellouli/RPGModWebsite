<template>
  <div class="col-6 m-5">
    <HomeButton/>
  </div>
  <div v-if="!loading.isLoading">
    <div v-if="!sent">
      <h1 class="text-center text-light mt-1">
        Envoyer un nouvel email de confirmation
      </h1>
      <div class="row">
        <h3 class="text-center text-danger">
          {{ errors }}
        </h3>
      </div>
      <div class="d-flex justify-content-center">
        <div class="row mt-3">
          <label class="text-secondary mb-2 mx-2 h5">Adresse email</label>
          <div class="p-inputgroup p-0 m-0 row d-flex justify-content-center">
                        <span class="p-inputgroup-addon col-1 d-flex justify-content-center">
                            <i class="pi pi-at pt-1"></i>
                        </span>
            <InputText placeholder="Adresse email"
                       class="col-xs-11 col-10" v-model="email"
                       :class="{'p-invalid':isInvalid}"/>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center mt-5">
        <Button class="col-md-4 col-7 fs-1  p-button-outlined" label="Envoyer" @click="send"/>
      </div>
    </div>
    <div v-else>
      <h1 class="text-center p-text-primary mt-1">
        Email envoyé!
      </h1>
    </div>
  </div>
  <div v-else class="d-flex justify-content-center">
    <ProgressSpinner style="width:20rem;height:20rem" class="mt-5 col-5 p-progress-spinner-color"
                     strokeWidth="4" fill="var(--test)" animationDuration=".5s"/>
  </div>
</template>
<script setup lang="ts">


const send = async () => {
  loading.setLoading(true);
  isInvalid.value = !isEmailAddress(email.value);
  if (isInvalid.value) {
    errors.value = "L'adresse email n'est pas valide";
    loading.setLoading(false);
    return;
  }
  const response = await sendNewConfirmationEmail(email.value);
  if (isApiError(response)) {
    useLoadingStore().setLoading(false);
    errors.value = response.err;
    return
  }
  useLoadingStore().setLoading(false);
  sent.value = true;
};
import {useLoadingStore} from "@/stores/loading";
import {ref} from "vue";
import {isEmailAddress} from "@/utils/formValidationUtil";
import {sendNewConfirmationEmail} from "@/utils/apiUtils";
import {isApiError} from "@/models/error";

const sent = ref(false);
const isInvalid = ref(false);
const loading = useLoadingStore();
const errors = ref("");
const email = ref("")
</script>