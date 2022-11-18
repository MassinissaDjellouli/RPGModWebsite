import {useCookies} from "vue3-cookies"
import {defineStore} from 'pinia'
import type {IUser} from '../models/user';
import {getUser} from '@/utils/apiUtils';
import type {IAPIError} from '../models/error';
import {isApiError} from '../models/error';

const cookies = useCookies().cookies
export const useLoggedInStore = defineStore('loggedIn', {
    state: () => ({
        user: undefined as IUser | undefined,
    }),
    getters: {
        isLoggedIn: (state) => {
            return state.user !== undefined
        },
        getUser: (state) => state.user as IUser,
        userType: () => cookies.get('userType'),
        token: () => cookies.get('token'),
    },
    actions: {
        async login(token: string): Promise<void | IAPIError> {
            const result = await getUser(token);
            if (isApiError(result)) {
                return result;
            }
            this.user = result;
            cookies.set('token', token)
            cookies.set('userType', "user")
        },
        async loginAdmin(token: string): Promise<void | IAPIError> {
            const result = await getUser(token);
            if (isApiError(result)) {
                return result;
            }
            this.user = result;
            cookies.set('token', token)
            cookies.set('userType', "admin")
        },
        async logout(): Promise<void | IAPIError> {
            cookies.remove('token')
            cookies.remove('userType')
        },
    }

})

