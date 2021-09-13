location / {

    limit_req zone=flood burst=100 nodelay;

    proxy_pass          http://ui:3000;
    proxy_redirect      off;
    proxy_cache         off;
    proxy_set_header    Host $host;
    proxy_set_header    X-Real-IP $remote_addr;
    proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header    X-Forwarded-Host $server_name;
    proxy_set_header    X-Forwarded-Proto $scheme;

    set $CSP "default-src 'self';";
    set $CSP "connect-src 'self' https://*.ingest.sentry.io;base-uri;";
    set $CSP "block-all-mixed-content;";
    set $CSP "font-src 'self' https: data:;";
    set $CSP "frame-ancestors 'self';";
    set $CSP "img-src 'self' data:;";
    set $CSP "object-src 'none';";
    set $CSP "script-src 'self' 'sha256-yt+SNVxRkIi6H6yb7ndFuZM1esMX9esg3UpRHaTsyVk=';";# create-react-app iframe error
    set $CSP "script-src-attr 'none';";
    set $CSP "style-src 'self' https: 'unsafe-inline';";
    set $CSP "upgrade-insecure-requests;";
    add_header Content-Security-Policy $CSP always;
}
