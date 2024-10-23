import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib'
import { _controllers } from './api/data/+server';


export const load = (async ({cookies}) => {
    let id = cookies.get("id")

    if (!id) {
        throw redirect(307, "/login")
    }

    let user = await prisma.user.findUnique({where: { id: id }, include: {clicker:true}})

    if (!user) {
        cookies.delete("id", { path: "/" })
        throw redirect(307, "/login")
    }

    let clicker = user.clicker

    let clicks = user.clicker?.clicks!

    return { user, clicker, clicks};
}) satisfies PageServerLoad;

export const actions : Actions = {
    logout: async ({request, cookies}) => {
        cookies.delete("id", { path: "/" })
        throw redirect(307, "/login")
    },
    change_clicker: async ({request, cookies}) => {
        let data = await request.formData()
        let clicker_id = data.get("id")?.toString()
        
        let user_id = cookies.get("id")
        if (clicker_id){
            await prisma.user.update({where: {id: user_id}, data: {clickerId: clicker_id}})
        }

    },
    click: async ({request, cookies}) => {
        let data = await request.formData()
        let id = data.get("id")?.toString()!
        let clicker = await prisma.clicker.findUnique({where: {id:id}})
        
        let clicks = clicker?.clicks!
        clicks++

        await prisma.clicker.update({where: {id:id}, data: {clicks:clicks}})
        console.log(clicks)


        const encoder = new TextEncoder();
        const encoded = encoder.encode("data: " + JSON.stringify(clicks) + "\n\n");

        for (let controller of _controllers) {
            try {
                controller.enqueue(encoded)
            } catch (e) {
            }
        }
    }
}