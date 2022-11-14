<template>
    <LoggedInHome v-if="store.isLoggedIn"/>
    <LoggedOutHome v-if="!store.isLoggedIn"/>
</template>
<script lang="ts" setup>
  import { useLoggedInStore } from '@/stores/loggedIn';
  const store = useLoggedInStore();
</script>
