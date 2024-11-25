# custom-hostname-jldec-net

This is an example of using a Cloudflare worker as an origin for a non-Cloudflare custom (or "vanity") domain.

The feature is available to free and paid accounts under [Cloudflare for Saas](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/).

The worker is deployed and a worker route configured for `*/*` on the Cloudflare-hosted `jldec.net` zone.

```toml
routes = [
  { pattern = "*/*", zone_name = "jldec.net" }
]
```
### Fallback origin
The custom domains feature depends on a "fallback origin" to serve the traffic.

1. In the DNS settings for the zone, add an "originless" AAAA-type DNS record as described [here](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/worker-as-origin/).

2. Create a CNAME target for customer routes pointing to the fallback origin. [docs](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/#2-optional-create-cname-target). This indirection will allow you to change the fallback origin later, without asking customers to update their DNS records.

3. Navigate to `SSL/TLS > Custom Hostnames` and configure the fallback origin in the custom hostnames settings for the zone ().

### Add custom hostnames
These steps are documented [here](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/#per-hostname-setup).

- Click the button to `Add Custom Hostname` and enter the external domain name. This could be hosted on 3rd-party nameservers.

- Expand the new custom hostname entry, and look for the 2 TXT records used to validate the hostname and issue a certificate. Add the 2 TXT records to the customer's DNS zone for the domain.

- Finally, add a route for the custom hostname. This is a CNAME matching the custom hostname, pointing to the cname target created earlier. After this step, the custom hostname should be verified and the certificate issued.

### Test
Point a browser to the custom hostname. You should see the Cloudflare worker response.

