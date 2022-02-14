
install: install-server install-ui generate-dotenv generate-tls-certificate hooks

start:
	docker-compose up --build --force-recreate

stop:
	docker-compose stop

clean:
	docker-compose down

test:
	yarn --cwd server test

coverage:
	yarn --cwd server coverage

lint:
	yarn --cwd server lint

dataset:
	docker exec referentiel_server yarn --silent --cwd server cli misc injectDataset

install-server:
	yarn --cwd server install --frozen-lockfile

install-ui:
	yarn --cwd ui install --frozen-lockfile

generate-dotenv:
	echo "Generating JWT secret..."
	grep -sqF 'REFERENTIEL_AUTH_API_JWT_SECRET' server/.env || \
		echo "REFERENTIEL_AUTH_API_JWT_SECRET=$$(tr -dc A-Za-z0-9 </dev/urandom | head -c 13 ; echo '')" >> server/.env

generate-tls-certificate:
	mkdir -p .local/certs
	mkcert -cert-file .local/certs/local-cert.pem -key-file .local/certs/local-key.pem "localhost" "admin.localhost"

hooks:
	git config core.hooksPath misc/git-hooks
	chmod +x misc/git-hooks/*

ci: install-server lint coverage
