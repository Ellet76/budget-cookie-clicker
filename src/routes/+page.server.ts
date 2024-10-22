import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib'

export const load = (async ({cookies}) => {
    let id = cookies.get("id")

    if (!id) {
        throw redirect(307, "/login")
    }

    let user = await prisma.user.findUnique({where: { id: id } })

    if (!user) {
        cookies.delete("id", { path: "/" })
        throw redirect(307, "/login")
    }

    return { user };
}) satisfies PageServerLoad;