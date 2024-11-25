export default {
  async fetch(request, env, ctx): Promise<Response> {
    const headers = Object.fromEntries(request.headers.entries())
    return Response.json(headers)
  },
} satisfies ExportedHandler<Env>
