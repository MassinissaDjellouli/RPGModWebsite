<template>
    <Toolbar>
        <template #start>
          <h1 class="text-light">RPGMod</h1>
        </template>

        <template #end>
          <Button @click="goToDocs()" class="p-button-text p-button-text mx-4 p-button-lg" v-ripple>Documentation</Button>
            <Button class="p-button-text p-button-outlined p-button-lg" v-ripple>Se connecter</Button>
        </template>
    </Toolbar>
</template>
<script lang="ts" setup>
    import { goToDocs } from '@/utils/generalUtils';
import { useLoggedInStore } from '@/stores/loggedIn';
const store = useLoggedInStore();
</script>