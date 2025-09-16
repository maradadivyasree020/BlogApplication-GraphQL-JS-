import { postResolver } from "./post"
import { authResolver } from "./auth"
import { profileResolver } from "./profile"

export const Mutation = {
    ...postResolver,
    ...authResolver,
    ...profileResolver,
}