.PHONY: help install dev build test clean docker-up docker-down prisma-reset

.DEFAULT_GOAL := help

help:
	@echo "JournAI Makefile Commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

install:
	cd client && npm install
	cd server && npm install
	npm install

dev:
	make -j2 dev-client dev-server

dev-client:
	cd client && npm run dev

dev-server:
	cd server && npm run dev

build:
	cd client && npm run build
	cd server && npm run build

test:
	cd client && npm test

lint:
	cd client && npm run lint:fix
	cd server && npm run lint:fix

format:
	cd client && npm run format

clean:
	rm -rf client/node_modules client/.next
	rm -rf server/node_modules server/dist
	rm -rf node_modules

prisma-studio:
	cd server && npm run prisma:studio

prisma-reset:
	cd server && npm run prisma:reset

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-dev:
	chmod +x start-dev.sh && ./start-dev.sh

setup: install
	@echo "Run 'make dev' to start development"
