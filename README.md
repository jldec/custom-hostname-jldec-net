# custom-hostname-jldec-net

This is an example of using a [Cloudflare Worker](https://developers.cloudflare.com/workers) as an origin for a non-Cloudflare custom (or "vanity") domain.

The feature is available to free and paid accounts under [Cloudflare for Saas](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/).

### Deploy the worker
This configures a worker route for `*/*` on the Cloudflare-hosted `jldec.net` zone. Change `wrangler.toml` to use a different domain.

```sh
git clone https://github.com/jldec/custom-hostname-jldec-net.git
cd custom-hostname-jldec-net
pnpm install
pnpm ship
```

#### src/index.ts
```ts
export default {
  async fetch(request, env, ctx): Promise<Response> {
    const headers = Object.fromEntries(request.headers.entries())
    return Response.json(headers)
  },
} satisfies ExportedHandler<Env>
```

#### wrangler.toml
```toml
#:schema node_modules/wrangler/config-schema.json
name = "custom-hostname-jldec-net"
main = "src/index.ts"
compatibility_date = "2024-11-12"
compatibility_flags = ["nodejs_compat"]

routes = [
  { pattern = "*/*", zone_name = "jldec.net" }
]

[observability]
enabled = true
```

### Fallback origin
Custom domains need a "fallback origin" to serve the traffic.

1. In the DNS settings for the zone, add an "originless" AAAA-type DNS record as described [here](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/worker-as-origin/).
![Screenshot 2024-11-25 at 16 05 23](https://github.com/user-attachments/assets/98b3cfde-3f23-4bfc-8365-713b75bdb7c4)

2. Create a CNAME target for customer routes pointing to the fallback origin as described in the [docs](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/#2-optional-create-cname-target). This indirection will allow you to change the fallback origin later, without asking customers to update their DNS records.
![Screenshot 2024-11-25 at 17 53 39](https://github.com/user-attachments/assets/f19fc75b-f94c-4f04-bfa4-c6deed10dd67)

4. Navigate to `SSL/TLS > Custom Hostnames` and configure the fallback origin in the custom hostnames settings for the zone.
![Screenshot 2024-11-25 at 16 09 23](https://github.com/user-attachments/assets/55db20cd-27ad-4a00-a0de-adb818747781)

### Add custom hostnames
These steps are documented [here](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/#per-hostname-setup).

- Click the button to `Add Custom Hostname` and enter the external domain name. This could be hosted on 3rd-party nameservers.
![Screenshot 2024-11-25 at 16 19 10](https://github.com/user-attachments/assets/36f28e30-3aa9-4485-9f44-af37470415ad)

- Expand the new custom hostname entry, and look for the 2 TXT records used to validate the hostname and issue a certificate. Add the 2 TXT records to the customer's DNS zone for the domain.
![Screenshot 2024-11-25 at 16 20 23](https://github.com/user-attachments/assets/0b572ef4-4713-4980-8486-943b3f58d2db)

- Finally, add a route for the custom hostname. This is a CNAME matching the custom hostname, pointing to the cname target created earlier.
![Screenshot 2024-11-25 at 16 48 00](https://github.com/user-attachments/assets/60864735-d9d1-4aab-a799-6f8ce08c263d)

Back in your own SaaS zone, the custom hostname should be verified and the certificate issued.
![Screenshot 2024-11-25 at 16 49 09](https://github.com/user-attachments/assets/3ac39ef7-adee-4f44-8c63-06f74d4910f6)

### Test
Point your browser to the custom hostname. You should see the Cloudflare worker response.
![Screenshot 2024-11-25 at 16 57 52](https://github.com/user-attachments/assets/2f106ecd-52f1-49a7-8d20-b1fd4d1b9b7e)

### PS

- Take extra care when configuring CNAMES through the dashboard. If there's are routing errors, it will take a while for the routes to recover, even after fixing the errors.

- Custom hostnames can be configured through the API. See this [blog post](https://blog.cloudflare.com/waf-for-saas/) for an example, or look for API URLs in the Custom Hostnames dashboard.
![Screenshot 2024-11-25 at 18 51 00](https://github.com/user-attachments/assets/291bbe40-b8d0-40e5-8fbf-861741da6ca3)



