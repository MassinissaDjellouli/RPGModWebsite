import {defineStore} from "pinia";

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        loading: false,
    }),
    getters: {
        isLoading: (state) => state.loading,
    },
    actions: {
        setLoading(loading:boolean){
            this.loading = loading;
        }
    }
})