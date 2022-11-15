import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { IUser } from '../models/user';
import { getUser } from '@/utils/apiUtils';
import type { IAPIError } from '../models/error';
import { isApiError } from '../models/error';

export const useLoggedInStore = defineStore('loggedIn', {
  state: () => ({
    user:undefined as IUser | undefined,
  }),
  getters: {
    isLoggedIn:(state) => state.user !== undefined,
  },
  actions: {
    async login(token:string):Promise<void | IAPIError>{
      const result = await getUser(token);
      if( isApiError(result) ){
        return result;
      }
      this.user = result;
      this.$cookies.set('token', token)
    }
  }

})

