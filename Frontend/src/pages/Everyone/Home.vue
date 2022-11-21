<template>
  <LoggedInHome v-if="store.isLoggedIn && store.userType === 'user'"/>
  <AdminHome v-if="store.isLoggedIn && store.userType === 'admin'"/>
  <LoggedOutHome v-if="!store.isLoggedIn"/>
</template>
<script lang="ts" setup>
import {useLoggedInStore} from '@/stores/loggedIn';

const store = useLoggedInStore();
</script>
