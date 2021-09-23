install: install-server install-ui

install-server:
	yarn --cwd server install --frozen-lockfile

install-ui:
	yarn --cwd ui install --frozen-lockfile

start:
	docker-compose up --build --force-recreate

start-mongodb:
	docker-compose up -d mongodb

stop:
	docker-compose stop

test:
	yarn --cwd server test

coverage:
	yarn --cwd server coverage

lint:
	yarn --cwd server lint

clean:
	docker-compose down

dataset:
	docker exec referentiel_server yarn --silent --cwd server cli misc injectDataset


ci: install-server lint coverage
