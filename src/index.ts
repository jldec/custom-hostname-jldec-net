export default {
  async fetch(request, env, ctx): Promise<Response> {
    return new Response('Hello From jldec.net')
  },
} satisfies ExportedHandler<Env>
