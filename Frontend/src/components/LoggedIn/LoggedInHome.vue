<template>
  <LoggedInNavBar :sidebar="sidebar"/>
  <Sidebar v-model:visible="sidebar.shown">
    Content
  </Sidebar>

</template>

<script lang="ts" setup>
import {ref} from "vue";

const sidebar = ref({shown: false});
</script>
