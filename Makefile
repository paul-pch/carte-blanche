NODE_REQUIRED := 24
NPM_REQUIRED  := 11

NODE_VERSION  := $(shell node -e "process.stdout.write(process.versions.node)" 2>/dev/null)
NPM_VERSION   := $(shell npm --version 2>/dev/null)
NODE_MAJOR    := $(shell echo "$(NODE_VERSION)" | cut -d. -f1)
NPM_MAJOR     := $(shell echo "$(NPM_VERSION)" | cut -d. -f1)

.PHONY: all check install build

all: check install

check:
	@if [ -z "$(NODE_VERSION)" ]; then \
		echo "ERROR: node not found. Install it from https://nodejs.org (LTS >= $(NODE_REQUIRED))"; \
		exit 1; \
	elif [ "$(NODE_MAJOR)" -lt "$(NODE_REQUIRED)" ]; then \
		echo "ERROR: node $(NODE_VERSION) is too old, need >= $(NODE_REQUIRED).x"; \
		exit 1; \
	else \
		echo "OK  node $(NODE_VERSION)"; \
	fi
	@if [ -z "$(NPM_VERSION)" ]; then \
		echo "ERROR: npm not found (should come with node)"; \
		exit 1; \
	elif [ "$(NPM_MAJOR)" -lt "$(NPM_REQUIRED)" ]; then \
		echo "ERROR: npm $(NPM_VERSION) is too old, need >= $(NPM_REQUIRED).x"; \
		exit 1; \
	else \
		echo "OK  npm $(NPM_VERSION)"; \
	fi

install: check
	npm install

update: check
	npx npm-check-updates -u
	npm install

build: check
	eas build -p android --profile preview
