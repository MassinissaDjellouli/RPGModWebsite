<template>
    <LoggedOutNavBar/>
    <div >
        <h1 class="text-center text-light mt-4">Bienvenue sur la page d'accueil!</h1>
        <h4 class="text-center text-light mt-4">Inscrivez vous:</h4>
        <div class="d-flex justify-content-center row">
                <Button label="Vous inscrire" class="p-button-lg p-button-raised col-2 mt-3 p-4 "></Button>
            <a class="text-center text-light mt-1">Déja inscrit?</a>
            <Card class="col-4 mt-5">
                <template #header>
                </template>
                <template #title>
                    RPGMod
                </template>
                <template #content>
                    description
                </template>
                <template #footer>
                    <div class="row justify-content-between">
                        <Button label="Télécharger le mod" class="p-button-danger col-4" />
                        <Button @click="goToDocs()" label="Voir la documentation" class="col-4 p-button-outlined"/>
                    </div>
                </template>
            </Card>
    </div>

    </div>
</template>
<script lang="ts" setup>
    import { useLoggedInStore } from '@/stores/loggedIn';
    import { goToDocs } from '@/utils/generalUtils';
  const store = useLoggedInStore();
</script>