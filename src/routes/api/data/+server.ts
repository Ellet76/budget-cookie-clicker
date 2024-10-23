import type { RequestHandler } from './$types';
import { error, redirect } from  '@sveltejs/kit'

export let _controllers: ReadableStreamDefaultController[] = []

export const GET: RequestHandler = async ({cookies}) => {
    try {
        let id = cookies.get("id")?.toString()!

        if (!id) {
            throw redirect(307, "/login")
        }
        
        const stream = new ReadableStream({
            start(controller) {

                _controllers.push(controller)
            }, 
            cancel(){}
        })
        return new Response(stream, {
            headers:  {
                "content-type": "text/event-stream"
            },
    })

    
    } catch {
        throw error(404, "not found");
    }
};