import { postResolver } from "./post"
import { authResolver } from "./auth"

export const Mutation = {
    ...postResolver,
    ...authResolver,
}