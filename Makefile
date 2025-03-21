
install: install-server install-ui generate-dotenv hooks

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

benchmark:
	docker-compose --project-directory misc/benchmarks up -d
	docker-compose --project-directory misc/benchmarks run k6 run /scripts/stress.js

dataset:
	docker exec referentiel_server yarn --silent --cwd server cli misc injectDataset

install-server:
	yarn --cwd server install

install-ui:
	yarn --cwd ui install

generate-dotenv:
	echo "Generating JWT secret..."
	grep -sqF 'REFERENTIEL_AUTH_API_JWT_SECRET' server/.env || \
		echo "REFERENTIEL_AUTH_API_JWT_SECRET=$$(perl -pe 'binmode(STDIN, ":bytes"); tr/A-Za-z0-9//dc;' < /dev/urandom | head -c 13; echo '')" >> server/.env

hooks:
	git config core.hooksPath misc/git-hooks
	chmod +x misc/git-hooks/*

ci: install-server lint coverage
