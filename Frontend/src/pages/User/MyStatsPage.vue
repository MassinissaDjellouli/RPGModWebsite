<template>
  <Toast position="bottom-right" group="br"/>
  <div class="col-6 m-5">
    <HomeButton/>
  </div>
  <div v-if="!loading.isLoading">
    <h1 class="text-center text-light mt-1">Statistiques</h1>
    <h4 class="text-center text-light mt-2" v-if="isEmpty()">Aucune statistique uploadée</h4>
    <DataTable :value="stats" :paginator="true" class="p-datatable mt-5" :rows="10" v-if="!isEmpty()"
               dataKey="id" :rowHover="true"
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport
      RowsPerPageDropdown"
               :rowsPerPageOptions="[10,25,50]"
               currentPageReportTemplate="{first}-{last}/{totalRecords} mondes"
               responsiveLayout="stack" breakpoint="1260px" stripedRows>
      <Column v-for="col of columns" :field="col.field" :header="col.header" :sortable="col.isSortable"/>
      <Column header="Voir toute les données">
        <template #body="{data}">
          <div class="ms-3">
            <router-link :to="'MyStats/' + data.worldId">
              <Button>
                <i class="pi pi-list pt-1"/>
              </Button>
            </router-link>
          </div>
          <ConfirmPopup :acceptLabel="'Oui'" :rejectLabel="'Non'"/>
        </template>
      </Column>
    </DataTable>
  </div>
  <div v-else class="d-flex justify-content-center">
    <ProgressSpinner style="width:20rem;height:20rem" class="mt-5 col-5 p-progress-spinner-color"
                     strokeWidth="4" fill="var(--test)" animationDuration=".5s"/>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {getAllStats} from "@/utils/apiUtils";
import {useLoadingStore} from "@/stores/loading";
import type {IUserStats} from "@/models/userStats";
import {formatDate, getXp} from "@/utils/generalUtils";

const columns = [
  {header: "Id du monde", field: "worldId", isSortable: true},
  {header: "Classe courante", field: "currentClass", isSortable: false},
  {header: "Classe la plus forte", field: "bestClass", isSortable: false},
  {header: "Niveau de la classe", field: "highestLevel", isSortable: true},
  {header: "Xp", field: "xpBeforeNextLevel", isSortable: false},
  {header: "Xp total", field: "totalXp", isSortable: true},
  {header: "Date d'upload", field: "uploadTime", isSortable: true},
]

const loading = useLoadingStore();
const stats = ref([] as IUserStats[]);
const getStats = async () => {
  const statsRes = await getAllStats();
  for (const worldIds of new Set(statsRes.map((stat) => stat.worldId))) {
    const statsForWorld = statsRes.filter((stat) => stat.worldId === worldIds);
    const newStats: any = statsForWorld.filter(
        (stat) => new Date(stat.uploadTime).getTime() == getHighestDate(statsForWorld))[0]
    newStats.xpBeforeNextLevel = getXp(newStats.bestClass, newStats);
    newStats.uploadTime = formatDate(new Date(newStats.uploadTime));
    stats.value.push(newStats);
  }
}
const isEmpty = () => stats.value.length === 0;
const init = async () => {
  loading.setLoading(true);
  await getStats();
  loading.setLoading(false);
}
const getHighestDate = (statsRes: IUserStats[]) => {
  return Math.max(...statsRes.map((stat) => new Date(stat.uploadTime).getTime()))
}
init();
</script>
