import { fail, redirect, type Action, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib";

export const load = (async ({ cookies }) => {
    return {}
}) satisfies PageServerLoad;

export const actions: Actions = {
    login: async ({ request, params, cookies}) => {
        let data = await request.formData()
        let username  = data.get("username")?.toString()??""
        let password = data.get("password")?.toString()??""

        if (!username || !password) {
            return fail(400, { login_fail: "Missing Information"})
        }

        let user = await prisma.user.findUnique({where: { username: username }})

        if (user) {

            if (user.password == password){
                cookies.set("id", user.id, {secure: false, path: "/"})
                throw redirect(307, "/")
            } else {
                return fail(401, {login_fail: "Wrong Password!"})
            }
        } else {
            let clicker_id = (await prisma.clicker.create({data: {name: username+"'s bakery"}})).id
            user = await prisma.user.create({data: {username: username, password: password, clickerId: clicker_id}})
            cookies.set("id", user.id, { secure: false, path: "/"})
            throw redirect(307, "/")
        }

        
    },
}
