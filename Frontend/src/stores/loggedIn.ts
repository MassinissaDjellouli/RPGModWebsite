import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { IUser } from '../models/user';

export const useLoggedInStore = defineStore('loggedIn', {
  state: () => ({
    user:undefined as IUser | undefined,
  }),
  getters: {
    isLoggedIn:(state) => state.user !== undefined,
  },
  actions: {

  }

})

