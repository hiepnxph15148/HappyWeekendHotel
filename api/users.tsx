import instance from "./instance";
import { UserType } from "../types/user";

export const remove = (_id:number) => {
    const url = `users/${_id}/delete`;
    return instance.delete(url)
}

export const signup = (user :UserType) => {
    return instance.post('/signup', user)
}
