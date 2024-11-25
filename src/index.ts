export default {
  async fetch(request, env, ctx): Promise<Response> {
    const headers = Object.fromEntries(request.headers.entries())
    return Response.json({
      zone: 'jldec.net',
      url: request.url,
      time: new Date().toISOString(),
      headers,
      cf: request.cf
    })
  }
} satisfies ExportedHandler<Env>
