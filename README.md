# lp-auth

## Environment Variables
```
PRIVATE_KEY=/path/to/privkey.pem
PUBLIC_KEY=/path/to/pubkey.pem
HOST=https://example.com
TOKEN_TTL_SECONDS=86400
LOGLEVEL=DEBUG
LP_ACCOUNT=61840567
NODE_ENV=PRODUCTION
```

## API
### Get service details
#### Request
`GET /admin`

    curl -i -H 'Accept: application/json' http://localhost:3333/admin

#### Response
    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 36
    ETag: W/"24-P6FoSoluNnEEb67WjarN/p/Ysxk"
    Date: Thu, 02 Mar 2023 19:28:37 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5
    
    {"name":"lp_auth","version":"0.5.0"}

### Get OID Configuration
#### Request
`GET /.well-known/openid-configuration`

    curl -i -H 'Accept: application/json' http://localhost:3333/.well-known/openid-configuration

#### Response
    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 595
    ETag: W/"253-L26vCIgUbXMBdXnuE9sEVZHHy7o"
    Date: Fri, 10 Mar 2023 15:33:22 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5
    
    {"issuer":"https://example.com","authorization_endpoint":"https://example.com/auth/code","token_endpoint":"https://example.com/auth/code/token","scopes_supported":["openid"],"response_types_supported":["code","id_token","code id_token","token id_token"],"acr_values_supported":["loa1"],"claim_types_supported":["normal"],"claims_supported":["iss","iat","exp","sub","given_name","family_name","email","gender","preferred_username","phone_number","lp_sdes"],"service_documentation":"https://github.com/donmanguno/lp_auth","ui_locales_supported":["en-US"]}

### Get Full Configuration
#### Request
`GET /auth/config`

    curl -i -H 'Accept: application/json' https://example.com/auth/config

#### Response
    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: application/json; charset=utf-8
    Content-Length: 1975
    ETag: W/"7b7-MDZ+nCXcg2ejicGAOtNTxLTXi0o"
    Date: Fri, 10 Mar 2023 15:35:03 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5
    
    {"LE Settings":{"implicit":{"JWT issuer (iss)":"https://example.com","Authentication Endpoint":"https://example.com/auth/token","JWT Public Key":"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA73U7Jmf//QZi/JiTSNWrXSa98et+JRFm1nkF5dYArJ33ehYRdnu83wM6/zSdgUfTFNjNY6k+TvHTr2iaV69gLMDlI+Nyp7oxiBC7uRjapAYad2Hkmp9y54gvM9I0yfzdLHf6vVSU+M37qUD1UdoPe16SBZLynBvQ3mndijOqTgMhxHSEcmcO2Bv3UDJauSmKDhEalfDvF6t/libv8yobC6QjLDVw3JrHazh/bvU6gBBuOSJqCN95RsAPo4nNZQvEefG+a5JHHh00NfqOZLmauHezgDLyC/g3lOCX9W1ui3Xn6hyv84hafKkloZn3efqmUo+GtCWouRJ/6ZN5roF9DQIDAQAB","JS Method Name":"lpGetAuthenticationToken","JS Context":"window"},"code":{"JWT issuer (iss)":"https://example.com","Authentication Endpoint":"https://example.com/auth/code","Token Endpoint":"https://example.com/auth/code/token","Client ID":"[Site ID]","Client Secret":"Secret","JWT Public Key":"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA73U7Jmf//QZi/JiTSNWrXSa98et+JRFm1nkF5dYArJ33ehYRdnu83wM6/zSdgUfTFNjNY6k+TvHTr2iaV69gLMDlI+Nyp7oxiBC7uRjapAYad2Hkmp9y54gvM9I0yfzdLHf6vVSU+M37qUD1UdoPe16SBZLynBvQ3mndijOqTgMhxHSEcmcO2Bv3UDJauSmKDhEalfDvF6t/libv8yobC6QjLDVw3JrHazh/bvU6gBBuOSJqCN95RsAPo4nNZQvEefG+a5JHHh00NfqOZLmauHezgDLyC/g3lOCX9W1ui3Xn6hyv84hafKkloZn3efqmUo+GtCWouRJ/6ZN5roF9DQIDAQAB","JS Method Name":"lpGetAuthenticationCode","JS Context":"window"}},"oidConfig":{"issuer":"https://example.com","authorization_endpoint":"https://example.com/auth/code","token_endpoint":"https://example.com/auth/code/token","scopes_supported":["openid"],"response_types_supported":["code","id_token","code id_token","token id_token"],"acr_values_supported":["loa1"],"claim_types_supported":["normal"],"claims_supported":["iss","iat","exp","sub","given_name","family_name","email","gender","preferred_username","phone_number","lp_sdes"],"service_documentation":"https://github.com/donmanguno/lp_auth","ui_locales_supported":["en-US"]}}

### Implicit Flow
#### Request
`POST /auth/token`

    curl -i -H 'Accept: application/json' https://example.com/auth/token -d '{"payload": {"sub": "Mark","lp_sdes":[{"type":"ctmrinfo","info":{"ctype":"vip"}}]},"ttl": 864000}'

#### Response
    HTTP/1.1 200 OK
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Content-Type: text/html; charset=utf-8
    Content-Length: 510
    ETag: W/"1fe-ZBQZ4IulaX+5WaR5EhQeThLl96A"
    Date: Fri, 10 Mar 2023 15:54:15 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5
    
    eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2I3ODctNDUtMjUtNDUtNTIubmdyb2suaW8iLCJpYXQiOjE2Nzg0NjM2NTUsImV4cCI6MTY3ODU1MDA1NSwic3ViIjoiYmFwc2g2Z2I4aWUifQ.4sbPss7IuG1EjJIO7zZ9mb6CuadyI8kwepdpQqM-GzoQtSXNnSftOT8yNzQtDld0sDCh_cTBHKAc3qNUd8YiOy3Ow_QkVEE2IV-b371IXHCIqug0XinUQdyhqaqjLbrfwm5hNvL9dw0AS7diw_ffM7aY6DVTb4BFxUkSN_XNN_OZMiFUHCZ0MiDNN7K4NVwhQdOVoyQyoNGhu2sOeTnsvknDdaqYnzJ4Sjj_ZvOevzWSYWFJeJJC2e-gsfWH2j4n8CdpZbtKGYwE-R6UeOmMKSit9WJj7CIKrqCnzSUCFT2lrrvme5Q1-sZFgbOpk8dS97iwGg-_FPbqYY37r6Mttw

#### Request
`GET /auth/token`

    curl -i -g 'https://example.com/auth/token?response_type=id_token&client_id=85085921&scope=openid&redirect_uri=https%3A%2F%2Flpcdn.lpsnmedia.net%2Fle_unified_window%2Findex.html&state={%22lpUnifiedWindowConfig%22%3A{%22accountId%22%3A%2285085921%22%2C%22env%22%3A%22prod%22%2C%22clickedChannel%22%3A%22-lpuw-authMessaging%22%2C%22external%22%3Atrue%2C%22supportBlockCCPattern%22%3Afalse%2C%22scp%22%3A%22uw%22%2C%22secureStorageType%22%3A%22indexedDB%22%2C%22engConf%22%3A{%22async%22%3Atrue%2C%22scid%22%3A%2240%22%2C%22cid%22%3A1898429830%2C%22eid%22%3A3499384930%2C%22lang%22%3A%22en-US%22%2C%22svid%22%3A%22E2OWEzNWMzNjY2YWFmZjEw%22%2C%22ssid%22%3A%22SIvtml9YQreu5l90_X0z5A%22%2C%22lewid%22%3A2440110930%2C%22connector%22%3A{%22id%22%3A4056284238%2C%22deleted%22%3Afalse%2C%22name%22%3A%22ngrok.io%22%2C%22type%22%3A2%2C%22configuration%22%3A{%22jwtValidationType%22%3A%22PUBLIC_JWT_KEY%22%2C%22jwtPublicKey%22%3A%22MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA73U7Jmf%2F%2FQZi%2FJiTSNWrXSa98et%2BJRFm1nkF5dYArJ33ehYRdnu83wM6%2FzSdgUfTFNjNY6k%2BTvHTr2iaV69gLMDlI%2BNyp7oxiBC7uRjapAYad2Hkmp9y54gvM9I0yfzdLHf6vVSU%2BM37qUD1UdoPe16SBZLynBvQ3mndijOqTgMhxHSEcmcO2Bv3UDJauSmKDhEalfDvF6t%2Flibv8yobC6QjLDVw3JrHazh%2FbvU6gBBuOSJqCN95RsAPo4nNZQvEefG%2Ba5JHHh00NfqOZLmauHezgDLyC%2Fg3lOCX9W1ui3Xn6hyv84hafKkloZn3efqmUo%2BGtCWouRJ%2F6ZN5roF9DQIDAQAB%22%2C%22jsMethodName%22%3A%22lpGetAuthenticationCode%22%2C%22authorizationEndpoint%22%3A%22https%3A%2F%2Fexample.com%2Fauth%2Fcode%22%2C%22tokenEndpoint%22%3A%22https%3A%2F%2Fexample.com%2Fauth%2Fcode%2Ftoken%22%2C%22clientId%22%3A%2285085921%22%2C%22rfcCompliance%22%3Atrue%2C%22issuerDisplayName%22%3A%22ngrok.io%22%2C%22issuer%22%3A%22https%3A%2F%2Fexample.com%22}}%2C%22allowUnauthMsg%22%3Afalse%2C%22availabilityPolicy%22%3A0%2C%22skill%22%3A%22Human%20Skill%22%2C%22skillId%22%3A1901976830}}}&parentWindowOrigin=https%3A%2F%2Forigin.example.com'

#### Response
    HTTP/1.1 302 Found
    X-Powered-By: Express
    Access-Control-Allow-Origin: *
    Location: https://lpcdn.lpsnmedia.net/le_unified_window/index.html?state=%7B%22lpUnifiedWindowConfig%22%3A%7B%22accountId%22%3A%2285085921%22%2C%22env%22%3A%22prod%22%2C%22clickedChannel%22%3A%22-lpuw-authMessaging%22%2C%22external%22%3Atrue%2C%22supportBlockCCPattern%22%3Afalse%2C%22scp%22%3A%22uw%22%2C%22secureStorageType%22%3A%22indexedDB%22%2C%22engConf%22%3A%7B%22async%22%3Atrue%2C%22scid%22%3A%2240%22%2C%22cid%22%3A1898429830%2C%22eid%22%3A3499384930%2C%22lang%22%3A%22en-US%22%2C%22svid%22%3A%22E2OWEzNWMzNjY2YWFmZjEw%22%2C%22ssid%22%3A%22SIvtml9YQreu5l90_X0z5A%22%2C%22lewid%22%3A2440110930%2C%22connector%22%3A%7B%22id%22%3A4056284238%2C%22deleted%22%3Afalse%2C%22name%22%3A%22ngrok.io%22%2C%22type%22%3A2%2C%22configuration%22%3A%7B%22jwtValidationType%22%3A%22PUBLIC_JWT_KEY%22%2C%22jwtPublicKey%22%3A%22MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA73U7Jmf%2F%2FQZi%2FJiTSNWrXSa98et%2BJRFm1nkF5dYArJ33ehYRdnu83wM6%2FzSdgUfTFNjNY6k%2BTvHTr2iaV69gLMDlI%2BNyp7oxiBC7uRjapAYad2Hkmp9y54gvM9I0yfzdLHf6vVSU%2BM37qUD1UdoPe16SBZLynBvQ3mndijOqTgMhxHSEcmcO2Bv3UDJauSmKDhEalfDvF6t%2Flibv8yobC6QjLDVw3JrHazh%2FbvU6gBBuOSJqCN95RsAPo4nNZQvEefG%2Ba5JHHh00NfqOZLmauHezgDLyC%2Fg3lOCX9W1ui3Xn6hyv84hafKkloZn3efqmUo%2BGtCWouRJ%2F6ZN5roF9DQIDAQAB%22%2C%22jsMethodName%22%3A%22lpGetAuthenticationCode%22%2C%22authorizationEndpoint%22%3A%22https%3A%2F%2Fexample.com%2Fauth%2Fcode%22%2C%22tokenEndpoint%22%3A%22https%3A%2F%2Fexample.com%2Fauth%2Fcode%2Ftoken%22%2C%22clientId%22%3A%2285085921%22%2C%22rfcCompliance%22%3Atrue%2C%22issuerDisplayName%22%3A%22ngrok.io%22%2C%22issuer%22%3A%22https%3A%2F%2Fexample.com%22%7D%7D%2C%22allowUnauthMsg%22%3Afalse%2C%22availabilityPolicy%22%3A0%2C%22skill%22%3A%22Human+Skill%22%2C%22skillId%22%3A1901976830%7D%7D%7D&token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJFMk9XRXpOV016TmpZMllXRm1aakV3IiwiaXNzIjoiaHR0cHM6Ly9iNzg3LTQ1LTI1LTQ1LTUyLm5ncm9rLmlvIiwiaWF0IjoxNjc4NDY5MzMwLCJleHAiOjE2Nzg1NTU3MzB9.K9jsHDnylTQOb-j_0wtC_uUfEnviVxaLA56VmznbJRXB8c1oq8BfSaqoJOwk46_5L4IzyMolmFQ_IJ0bkP0FjTwAOfq_A9qwhIO17iQOcxf4ml9yoUVlsouTsL1wGQ85OEruinXgPceWdZL1Bxks0iBAK8Oq2-OEh6CfNgYXn-1hPVkkpZ5IVPCNsjpNDayY4U3PTH1Y7lTBYsN_rmFJRckZdT6-N0dF8uxxgwvnWINJXq6xQ8BTd6cppX56Kwb_rYMeJQnLkEw5Fe57tIpKEZUegjPO2SPXuIqLAKcQU1h2YmslhjoQmkQpJYwgAyzbdrxbNs3kLpxOzucucr2vWw
    Vary: Accept
    Content-Type: text/plain; charset=utf-8
    Content-Length: 2331
    Date: Fri, 10 Mar 2023 17:28:50 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5
    
    Found. Redirecting to https://lpcdn.lpsnmedia.net/le_unified_window/index.html?state=%7B%22lpUnifiedWindowConfig%22%3A%7B%22accountId%22%3A%2285085921%22%2C%22env%22%3A%22prod%22%2C%22clickedChannel%22%3A%22-lpuw-authMessaging%22%2C%22external%22%3Atrue%2C%22supportBlockCCPattern%22%3Afalse%2C%22scp%22%3A%22uw%22%2C%22secureStorageType%22%3A%22indexedDB%22%2C%22engConf%22%3A%7B%22async%22%3Atrue%2C%22scid%22%3A%2240%22%2C%22cid%22%3A1898429830%2C%22eid%22%3A3499384930%2C%22lang%22%3A%22en-US%22%2C%22svid%22%3A%22E2OWEzNWMzNjY2YWFmZjEw%22%2C%22ssid%22%3A%22SIvtml9YQreu5l90_X0z5A%22%2C%22lewid%22%3A2440110930%2C%22connector%22%3A%7B%22id%22%3A4056284238%2C%22deleted%22%3Afalse%2C%22name%22%3A%22ngrok.io%22%2C%22type%22%3A2%2C%22configuration%22%3A%7B%22jwtValidationType%22%3A%22PUBLIC_JWT_KEY%22%2C%22jwtPublicKey%22%3A%22MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA73U7Jmf%2F%2FQZi%2FJiTSNWrXSa98et%2BJRFm1nkF5dYArJ33ehYRdnu83wM6%2FzSdgUfTFNjNY6k%2BTvHTr2iaV69gLMDlI%2BNyp7oxiBC7uRjapAYad2Hkmp9y54gvM9I0yfzdLHf6vVSU%2BM37qUD1UdoPe16SBZLynBvQ3mndijOqTgMhxHSEcmcO2Bv3UDJauSmKDhEalfDvF6t%2Flibv8yobC6QjLDVw3JrHazh%2FbvU6gBBuOSJqCN95RsAPo4nNZQvEefG%2Ba5JHHh00NfqOZLmauHezgDLyC%2Fg3lOCX9W1ui3Xn6hyv84hafKkloZn3efqmUo%2BGtCWouRJ%2F6ZN5roF9DQIDAQAB%22%2C%22jsMethodName%22%3A%22lpGetAuthenticationCode%22%2C%22authorizationEndpoint%22%3A%22https%3A%2F%2Fexample.com%2Fauth%2Fcode%22%2C%22tokenEndpoint%22%3A%22https%3A%2F%2Fexample.com%2Fauth%2Fcode%2Ftoken%22%2C%22clientId%22%3A%2285085921%22%2C%22rfcCompliance%22%3Atrue%2C%22issuerDisplayName%22%3A%22ngrok.io%22%2C%22issuer%22%3A%22https%3A%2F%2Fexample.com%22%7D%7D%2C%22allowUnauthMsg%22%3Afalse%2C%22availabilityPolicy%22%3A0%2C%22skill%22%3A%22Human+Skill%22%2C%22skillId%22%3A1901976830%7D%7D%7D&token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJFMk9XRXpOV016TmpZMllXRm1aakV3IiwiaXNzIjoiaHR0cHM6Ly9iNzg3LTQ1LTI1LTQ1LTUyLm5ncm9rLmlvIiwiaWF0IjoxNjc4NDY5MzMwLCJleHAiOjE2Nzg1NTU3MzB9.K9jsHDnylTQOb-j_0wtC_uUfEnviVxaLA56VmznbJRXB8c1oq8BfSaqoJOwk46_5L4IzyMolmFQ_IJ0bkP0FjTwAOfq_A9qwhIO17iQOcxf4ml9yoUVlsouTsL1wGQ85OEruinXgPceWdZL1Bxks0iBAK8Oq2-OEh6CfNgYXn-1hPVkkpZ5IVPCNsjpNDayY4U3PTH1Y7lTBYsN_rmFJRckZdT6-N0dF8uxxgwvnWINJXq6xQ8BTd6cppX56Kwb_rYMeJQnLkEw5Fe57tIpKEZUegjPO2SPXuIqLAKcQU1h2YmslhjoQmkQpJYwgAyzbdrxbNs3kLpxOzucucr2vWw%
