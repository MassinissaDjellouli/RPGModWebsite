<template>
  <div class="col-6 m-5">
    <HomeButton/>
  </div>
  <div v-if="!loading.isLoading">
    <Toast position="bottom-right" group="br"/>
    <h4 class="text-center text-danger" v-if="emptyErrors()">
      {{ errors }}
    </h4>
    <h1 class="text-center text-light mt-1">Supprmier une version du mod</h1>
    <div class="d-flex justify-content-center">
      <div class="p-inputgroup p-0 m-0 d-flex justify-content-center">
                        <span class="p-inputgroup-addon col-1 d-flex justify-content-center">
                            <i class="pi pi-filter pt-1"></i>
                        </span>
        <Dropdown v-model="selectedVersion" :options="minecraftVersions" class=" col-11 "
                  placeholder="Filtrer par version" @change="onChange"/>
      </div>
    </div>
    <h4 class="text-center text-light mt-2" v-if="isEmpty()">Aucune version du mod n'est disponible pour cette version
      de Minecraft</h4>
    <DataTable :value="versions" :paginator="true" class="p-datatable mt-5" :rows="10" v-if="!isEmpty()"
               dataKey="id" :rowHover="true"
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport
      RowsPerPageDropdown"
               :rowsPerPageOptions="[10,25,50]"
               currentPageReportTemplate="{first}-{last}/{totalRecords} versions"
               responsiveLayout="scroll">
      <Column v-for="col of columns" :field="col.field" :header="col.header" sortable="true"/>
      <Column header="Supprimer">
        <template #body="{data}">
          <div class="ms-3">
            <Button class=" p-button-danger" @click="onRemove($event,data)"><i class="pi pi-trash pt-1"></i></Button>
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
import {useLoadingStore} from "@/stores/loading";
import {ref} from "vue";
import type {IModVersions} from "@/models/modVersions";
import {getMinecraftVersions} from "@/utils/requestHandlerUtil";
import {deleteModVer, getModVersions} from "@/utils/apiUtils";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import {isApiError} from "@/models/error";

const errors = ref("");
const emptyErrors = () => {
  return errors.value === "";
};
const confirm = useConfirm()
const toast = useToast();
const onRemove = (event: any, data: IModVersions) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Voulez vous supprimer cette version?',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      toast.add({severity: 'warn', summary: 'Suppression', detail: 'Suppression en cours', group: "br", life: 5000});
      const response = await deleteModVer(data.version);
      if (isApiError(response)) {
        errors.value = response.err;
        toast.add({severity: 'danger', summary: 'Suppression', detail: 'Suppression échoué', group: "br", life: 5000});
        return;
      }
      await getVersions();
      toast.add({severity: 'success', summary: 'Suppression', detail: 'Suppression terminée', group: "br", life: 5000});
    }
  });
}
const columns = [
  {header: "Version", field: "version"},
  {header: "Version de Minecraft", field: "minecraftVersion"},
  {header: "Version de Forge", field: "forgeVersion"},
  {header: "Date de sortie", field: "uploadDate"},
  {header: "Téléchargements", field: "downloadCount"},
]
const allVers = "Aucun filtre"
const loading = useLoadingStore();
const versions = ref([] as IModVersions[]);
const minecraftVersions = ref([] as string[]);
const selectedVersion = ref(allVers);
const getMCVersions = async () => {
  minecraftVersions.value = await getMinecraftVersions();
  minecraftVersions.value.unshift(allVers);
}
const getVersions = async () => {
  versions.value = await getModVersions();
}
const isEmpty = () => versions.value.length === 0;
const init = async () => {
  loading.setLoading(true);
  await getMCVersions();
  await getVersions();
  loading.setLoading(false);
}
const onChange = async () => {
  loading.setLoading(true);
  if (selectedVersion.value === allVers) {
    await getVersions();
  } else {
    versions.value = await getModVersions(selectedVersion.value);
  }
  loading.setLoading(false);
}

init();
</script>
