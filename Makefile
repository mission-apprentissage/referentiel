
install: install-server install-ui generate-dotenv hooks

start:
	sudo ../start-app.sh

stop:
	sudo ../stop-app.sh

clean:
	docker-compose down

test:

coverage:
	corepack enable
	corepack prepare yarn@4.8.1 --activate
	yarn --cwd server coverage

lint:
	corepack enable
	corepack prepare yarn@4.8.1 --activate
	yarn --cwd server lint

benchmark:
	docker-compose --project-directory misc/benchmarks up -d
	docker-compose --project-directory misc/benchmarks run k6 run /scripts/stress.js

dataset:
	docker exec referentiel_server yarn --silent --cwd server cli misc injectDataset

install-server:
	corepack enable
	corepack prepare yarn@4.8.1 --activate
	yarn --cwd server install

install-ui:
	corepack enable
	corepack prepare yarn@4.8.1 --activate
	yarn --cwd ui install

generate-dotenv:
	echo "Generating JWT secret..."
	grep -sqF 'REFERENTIEL_AUTH_API_JWT_SECRET' server/.env || \
		echo "REFERENTIEL_AUTH_API_JWT_SECRET=$$(perl -pe 'binmode(STDIN, ":bytes"); tr/A-Za-z0-9//dc;' < /dev/urandom | head -c 13; echo '')" >> server/.env

hooks:
	git config core.hooksPath misc/git-hooks
	chmod +x misc/git-hooks/*

ci: install-server lint coverage
