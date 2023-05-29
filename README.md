# Prerequisites

## Generating Local SSL Certificate

In the main directory run:

```bash
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj "/CN=localhost" -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

## Localhost Testing

Modify your `/etc/hosts` file by replacing the `localhost` domain for `127.0.0.1` by your own domain. ex:

```
127.0.0.1 your-domain.com
```

You might need to clear your DNS cache for this test to work.
Clear the DNS from your mac:

```
sudo dscacheutil -flushcache
```

Clear the DNS cache from your chrome browser:
Navigate to `chrome://net-internals/#dns` and click on "Clear host cache".

# Running the Application

1. Run `yarn install`.
2. Replace the values in `APPLE_STRATEGY_VALUES` in `src/index.js`. (don't forget to download your .p8 file and have it in the main folder)
3. Run `node src/index.js`.
4. Navigate to https://your-domain.com:3000 and test the apple auth.
