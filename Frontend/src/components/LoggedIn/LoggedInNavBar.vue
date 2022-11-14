<template>
    <Toolbar>
        <template #start>
          <h1 class="">{{store.user?.username}}</h1>
        </template>

        <template #end>
          <Button class="p-button-text p-button-outlined p-button-lg">Logout</Button>
        </template>
    </Toolbar>
</template>
<script lang="ts" setup>
import { useLoggedInStore } from '@/stores/loggedIn';
const store = useLoggedInStore();
</script>