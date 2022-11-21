<template>
  <Toast/>
  <div class="col-6 m-5">
    <HomeButton/>
  </div>
  <h1 class="text-center my-5 text-light">
    Ajouter une version
  </h1>
  <h4 class="text-center text-danger" v-if="emptyErrors()">
    {{ errors }}
  </h4>
  <div class="row d-flex justify-content-center">
    <InputText placeholder="Version du mod" type="text" @input="$emit('update:modelValue', state)"
               :class="{'p-invalid':fieldErrors.version}"
               class="col-xs-11 col-10 mt-3" v-model="state.version"/>
    <Dropdown v-model="selectedVersion" :options="minecraftVersions" class=" col-10 mt-3"
              :class="{'p-invalid':fieldErrors.gameVersion}"
              placeholder="Version de Minecraft"/>
    <InputText placeholder="Version de Forge" type="text" @input="$emit('update:modelValue', state)"
               :class="{'p-invalid':fieldErrors.forgeVersion}"
               class="col-xs-11 col-10 mt-3" v-model="state.forgeVersion"/>
    <div class="col-10 mt-3" v-if="!hasFile()">

      <FileUpload :name="filesName" @uploader="uploader"
                  :auto="true" :custom-upload="true" :multiple="false"
                  accept=".jar"
                  :maxFileSize="10000000">
        <template #content>
          <ul v-if="uploadedFiles && uploadedFiles[0]">
            <li v-for="file of uploadedFiles[0]" :key="file">{{ file.name }} - {{ formatSize(file.size) }} bytes</li>
          </ul>
        </template>
        <template #empty>
          <p>Déposez un fichier ici pour l'uploader</p>
        </template>
      </FileUpload>
    </div>
    <div class="d-flex justify-content-center row" v-else>
      <h1 class="text-center p-text-primary mt-4 col-12">
        Fichier ajouté avec succès!
      </h1>
      <Button label="Supprimer le fichier" class="mt-3 col-xl-2 col-md-3 col-6 p-button-danger" @click="removeFile()"/>
    </div>
    <div class="d-flex justify-content-center mt-4">
      <Button class="col-6 fs-1  p-button-outlined" label="Envoyer" @click="sendNewVer"/>
    </div>
  </div>

</template>

<script setup lang="ts">
import {useToast} from "primevue/usetoast";
import {reactive, ref} from "vue";
import {uploadMod} from "@/utils/apiUtils";
import {useLoadingStore} from "@/stores/loading";
import {getMinecraftVersions} from "@/utils/requestHandlerUtil";
import {isApiError} from "@/models/error";
import type {INewModVersion} from "@/models/modVersions";

const state = reactive<INewModVersion>({
  version: '',
  minecraftVersion: '',
  forgeVersion: '',
  uploadDate: new Date(),
  downloadCount: 0,
  file: []
})

const fieldErrors = ref({
  version: false,
  gameVersion: false,
  forgeVersion: false,
})
//https://www.primefaces.org/primevue/fileupload
const formatSize = (bytes: number) => {
  if (bytes === 0) {
    return '0 B';
  }

  let k = 1000
  const dm = 3
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
const removeFile = () => {
  state.file = []
}
const sendNewVer = async () => {
  if (validate()) return
  toast.add({severity: 'info', summary: "Ajout d'une version", detail: 'Ajout de la version en cours', life: 5000});
  // const bytes2 = new Uint8Array(bytes.split(',').map((byte) => parseInt(byte)));
  // var blob = new Blob([bytes2], {type: "application/java-archive"});
  // var link = document.createElement('a');
  // link.href = window.URL.createObjectURL(blob);
  // var fileName = "test.jar";
  // link.download = fileName;
  // link.click();
  const toUpload: INewModVersion = {
    version: state.version,
    minecraftVersion: selectedVersion.value,
    forgeVersion: state.forgeVersion,
    uploadDate: new Date(),
    downloadCount: 0,
    file: state.file
  }
  const response = await uploadMod({modVersion: toUpload});
  console.log(response)
  if (isApiError(response)) {
    errors.value = response.err;
    toast.add({
      severity: 'error',
      summary: "Ajout d'une version",
      detail: "la version n'a pas pu etre ajoutée",
      life: 5000
    });
    return;
  }
  toast.add({severity: 'success', summary: "Ajout d'une version", detail: 'Version ajoutée avec succès', life: 5000});
}
const hasFile = () => {
  return state.file.length > 0
}
const uploader = async (event: any) => {
  try {
    const bytes = new Uint8Array(await event.files[0].arrayBuffer()).toString();
    state.file = bytes.split(',').map((byte) => parseInt(byte));
    toast.add({severity: 'success', summary: "Téléversement", detail: 'Fichier téléversé avec succès', life: 5000});
  } catch {
    toast.add({severity: 'danger', summary: "Téléversement", detail: 'Le téléversement a échoué', life: 5000});
  }
}
const emptyErrors = () => {
  return errors.value != ""
}
const errors = ref("")
const loading = useLoadingStore();
const minecraftVersions = ref([] as string[]);
const noVersSelected = "Aucune version selectionnée";
const selectedVersion = ref(noVersSelected);
const getMCVersions = async () => {
  minecraftVersions.value = await getMinecraftVersions();
  minecraftVersions.value.unshift(noVersSelected);
}
const init = async () => {
  loading.setLoading(true);
  await getMCVersions();
  loading.setLoading(false);
}
const validate = () => {
  fieldErrors.value.version = false;
  fieldErrors.value.gameVersion = false;
  fieldErrors.value.forgeVersion = false;
  errors.value = ""
  if (state.version == "") {
    fieldErrors.value.version = true;
    errors.value = "Veuillez entrer une version"
    return true;
  }
  if (selectedVersion.value == noVersSelected) {
    fieldErrors.value.gameVersion = true;
    errors.value = "Veuillez entrer une version de Minecraft"
    return true;
  }
  if (state.forgeVersion == "") {
    fieldErrors.value.forgeVersion = true;
    errors.value = "Veuillez entrer une version de Forge"
    return true;
  }
  if (!hasFile()) {
    errors.value = "Veuillez ajouter un fichier"
    return true;
  }
  return false;
}
const filesName = "ModFile";
const toast = useToast();
const uploadedFiles = ref([]);
init();
</script>
