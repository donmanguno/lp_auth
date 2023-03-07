# lp-auth

## Get service details

### Request
`GET /admin`

    curl -i -H 'Accept: application/json' http://localhost:3333/admin

### Response
    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 36
    ETag: W/"24-P6FoSoluNnEEb67WjarN/p/Ysxk"
    Date: Thu, 02 Mar 2023 19:28:37 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5
    
    {"name":"lp_auth","version":"0.2.0"}
```
PRIVATE_KEY=/path/to/privkey.pem
PUBLIC_KEY=/path/to/pubkey.pem
HOST=https://example.com
TOKEN_TTL_SECONDS=86400
```