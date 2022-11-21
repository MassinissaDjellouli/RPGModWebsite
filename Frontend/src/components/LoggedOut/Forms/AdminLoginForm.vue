<template>
  <div class="d-flex justify-content-center">
    <div class="container">
      <div class="row">
        <h3 class="text-center text-danger">
          {{ errors }}
        </h3>
      </div>
      <div class="row mt-3 ">
        <label class="text-secondary mb-2 mx-2 h5">Nom d'utilisateur</label>
        <div class="p-inputgroup p-0 m-0 row  d-flex justify-content-center">
                        <span class="p-inputgroup-addon col-1 d-flex justify-content-center">
                            <i class="pi pi-user pt-1"></i>
                        </span>
          <InputText placeholder="Nom d'utilisateur" type="text" @input="$emit('update:modelValue', state)"
                     class="col-xs-11 col-10" v-model="state.username"
                     :class="{'p-invalid':props.invalidFields.username}"/>
        </div>
      </div>
      <div class="row mt-3 ">
        <label class="text-secondary mb-2 mx-2 h5">Mot de passe</label>
        <div class="p-inputgroup row p-0 m-0  d-flex justify-content-center">
                        <span class="p-inputgroup-addon col-1 d-flex justify-content-center">
                            <i class="pi pi-key pt-1"></i>
                        </span>
          <InputText placeholder="Mot de passe" type="password" class=" col-xs-11 col-10"
                     @input="$emit('update:modelValue', state)" v-model="state.password"
                     :class="{'p-invalid':props.invalidFields.password}"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {reactive} from "vue";

const props = defineProps(["errors", "invalidFields"])
const state = reactive({
  username: '',
  password: '',
});
</script>