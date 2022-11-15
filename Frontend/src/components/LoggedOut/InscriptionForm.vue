<template>
    <div class="row m-5">
        <div class="col-6">
            <HomeButton />
        </div>
        <h1 class="text-center text-light mt-5 mb-4">Inscription</h1>
        <div class="d-flex justify-content-center">
            <div class="container">
                <div class="row mt-3">
                    <label class="text-secondary mb-2 h5">Nom d'utilisateur</label>
                    <div class="p-inputgroup p-0 m-0 row">
                        <span class="p-inputgroup-addon col-1 d-flex justify-content-center">
                            <i class="pi pi-user pt-1"></i>
                        </span>
                        <InputText placeholder="Nom d'utilisateur" v-model="username" class="col-xs-11 col-10" />
                    </div>
                </div>
                <div class="row mt-3 ">
                    <label class="text-secondary mb-2 h5">Adresse email</label>
                    <div class="p-inputgroup  p-0 m-0 row">
                        <span class="p-inputgroup-addon col-1 d-flex justify-content-center">
                            <i class="pi pi-at pt-1"></i>
                        </span>
                        <InputText placeholder="Adresse email" v-model="email" type="email" class=" col-xs-11 col-10" />
                    </div>
                </div>
                <div class="row mt-3 ">
                    <label class="text-secondary mb-2 h5">Mot de passe</label>
                    <div class="p-inputgroup row p-0 m-0">
                        <span class="p-inputgroup-addon col-1 d-flex justify-content-center">
                            <i class="pi pi-key pt-1"></i>
                        </span>
                        <Password class="col-xs-11 col-10 custom-pwd ps-0" :class="{ 'p-invalid': false }" v-model="pwd">
                            <template #header>
                                <h6>Pick a password</h6>
                            </template>
                            <template #footer>
                                <Divider />
                                <p class="mt-2">Requirements:</p>
                                <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                                    <li>Minimum 8 characters</li>
                                </ul>
                                <Divider />
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
                        <span class="p-inputgroup-addon col-1 d-flex justify-content-center">
                            <i class="pi pi-key pt-1"></i>
                        </span>
                        <InputText id="pwdConfirm" type="password" v-model="pwdConfirm" class="col-xs-11 col-10" />
                    </div>
                </div>
                <div class="d-flex justify-content-center mt-4">
                    <Button class="col-6 fs-1  p-button-outlined" label="Envoyer"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useLoggedInStore } from '@/stores/loggedIn';
</script>
<script lang="ts">
import { ref } from 'vue';

const username = ref("");
const email = ref("");
const pwd = ref("");
const pwdConfirm = ref("");
</script>