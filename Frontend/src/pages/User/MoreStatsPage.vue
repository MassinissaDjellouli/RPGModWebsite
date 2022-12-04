<template>
  <Toast position="bottom-right" group="br"/>
  <div class="col-6 m-5">
    <HomeButton/>
  </div>
  <div v-if="!loading.isLoading">
    <h1 class="text-center text-light mt-1">Détails</h1>
    <h5 class="text-center text-light mt-1">ID du monde : {{ worldId }}</h5>
    <router-link to="/MyStats" class="text-light no-line h4">
      <i class="text-light pi pi-chevron-left pt-1 ms-5 "/> Retour
    </router-link>
    <h4 class="text-center text-light mt-2" v-if="isEmpty()">Aucune statistique uploadée</h4>
    <div v-else class="justify-content-center d-flex">
      <Button class="mt-5" label="Télécharger les données" icon="pi pi-download" @click="downloadStats"/>
    </div>
    <DataTable :value="stats" :paginator="true" class="p-datatable mt-5" :rows="10" v-if="!isEmpty()"
               dataKey="id" :rowHover="true"
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport
      RowsPerPageDropdown"
               :rowsPerPageOptions="[10,25,50]"
               currentPageReportTemplate="{first}-{last}/{totalRecords} statistiques"
               responsiveLayout="scroll">
      <Column v-for="col of columns" :field="col.field" :header="col.header" :sortable="col.isSortable"/>
    </DataTable>
  </div>
  <div v-else class="d-flex justify-content-center">
    <ProgressSpinner style="width:20rem;height:20rem" class="mt-5 col-5 p-progress-spinner-color"
                     strokeWidth="4" fill="var(--test)" animationDuration=".5s"/>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {getAllStatsByID} from "@/utils/apiUtils";
import {useLoadingStore} from "@/stores/loading";
import type {IUserStats} from "@/models/userStats";
import {formatDate, formatDateForFile, getXp} from "@/utils/generalUtils";
import {useRoute} from "vue-router";

const columns = [
  {header: "Classe courante", field: "currentClass", isSortable: false},
  {header: "Blocs minés", field: "blocksMined", isSortable: true},
  {header: "Bois coupé", field: "blocksForaged", isSortable: true},
  {header: "Mobs Tués", field: "mobsKilled", isSortable: true},
  {header: "Classe la plus forte", field: "bestClass", isSortable: false},
  {header: "Niveau de minage", field: "miningLevel", isSortable: true},
  {header: "Xp de combat", field: "xpBeforeNextMiningLevel", isSortable: false},
  {header: "Xp total de combat", field: "totalMiningXp", isSortable: true},
  {header: "Niveau de combat", field: "combatLevel", isSortable: true},
  {header: "Xp de minage", field: "xpBeforeNextCombatLevel", isSortable: false},
  {header: "Xp total de minage", field: "totalCombatXp", isSortable: true},
  {header: "Niveau de buchage", field: "foragingLevel", isSortable: true},
  {header: "Xp de buchage", field: "xpBeforeNextForagingLevel", isSortable: false},
  {header: "Xp total de buchage", field: "totalForagingXp", isSortable: true},
  {header: "Xp total", field: "totalXp", isSortable: true},
  {header: "Date d'upload", field: "uploadTime", isSortable: true},
]
const worldId = useRoute().params.id as string
const loading = useLoadingStore();
const stats = ref([] as IUserStats[]);
const getStats = async () => {
  const statsRes = await getAllStatsByID(worldId);
  console.log(statsRes)
  for (const stat of statsRes) {
    const newStats: any = stat;
    newStats.xpBeforeNextMiningLevel = getXp("Mineur", newStats);
    newStats.xpBeforeNextCombatLevel = getXp("Soldat", newStats);
    newStats.xpBeforeNextForagingLevel = getXp("Bucheron", newStats);
    newStats.uploadTime = formatDate(new Date(newStats.uploadTime));
    stats.value.push(newStats);
  }
  console.log(stats.value);
}

const isEmpty = () => stats.value.length === 0;
const init = async () => {
  loading.setLoading(true);
  await getStats();
  loading.setLoading(false);
}
const downloadStats = () => {
  console.log(stats.value)
  const basicData = {
    basicData: {
      worldId: stats.value[0].worldId,
      username: stats.value[0].username,
    }
  }
  const statsToDownload = stats.value.map((stat: any) => {
    const newStat = {...stat}
    delete newStat._id;
    delete newStat.worldId;
    delete newStat.username;
    return {...newStat};
  })

  const data = JSON.stringify(
      {
        ...basicData,
        stats: statsToDownload
      });
  const blob = new Blob([data], {type: "text/json"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${basicData.basicData.username}_${basicData.basicData.worldId}_${formatDateForFile(new Date())
  }.json`
  link.href = url;
  link.click();
}
init();
</script>
