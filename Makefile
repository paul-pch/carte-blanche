# ─── Version requirements ────────────────────────────────────────────────────
NODE_REQUIRED  := 24
NPM_REQUIRED   := 11
JAVA_REQUIRED  := 17
ANDROID_API    := 35
BUILD_TOOLS    := 35.0.0

# ─── Detected versions ───────────────────────────────────────────────────────
NODE_VERSION   := $(shell node -e "process.stdout.write(process.versions.node)" 2>/dev/null)
NPM_VERSION    := $(shell npm --version 2>/dev/null)
NODE_MAJOR     := $(shell echo "$(NODE_VERSION)" | cut -d. -f1)
NPM_MAJOR      := $(shell echo "$(NPM_VERSION)" | cut -d. -f1)
JAVA_VERSION   := $(shell java -version 2>&1 | head -1 | sed 's/.*version "\([0-9]*\).*/\1/')
EAS_VERSION    := $(shell eas --version 2>/dev/null)
SDKMANAGER     := $(ANDROID_HOME)/cmdline-tools/latest/bin/sdkmanager

.PHONY: all check check-node check-java check-android check-eas install setup build build-preview build-production update

# ─── Default ─────────────────────────────────────────────────────────────────
all: check install

# ─── Checks ──────────────────────────────────────────────────────────────────
check: check-node check-java check-android check-eas

check-node:
	@if [ -z "$(NODE_VERSION)" ]; then \
		echo "ERROR: node not found. Install it from https://nodejs.org (LTS >= $(NODE_REQUIRED))"; \
		exit 1; \
	elif [ "$(NODE_MAJOR)" -lt "$(NODE_REQUIRED)" ]; then \
		echo "ERROR: node $(NODE_VERSION) too old, need >= $(NODE_REQUIRED).x"; \
		exit 1; \
	else \
		echo "OK   node $(NODE_VERSION)"; \
	fi
	@if [ -z "$(NPM_VERSION)" ]; then \
		echo "ERROR: npm not found (should come with node)"; \
		exit 1; \
	elif [ "$(NPM_MAJOR)" -lt "$(NPM_REQUIRED)" ]; then \
		echo "ERROR: npm $(NPM_VERSION) too old, need >= $(NPM_REQUIRED).x"; \
		exit 1; \
	else \
		echo "OK   npm $(NPM_VERSION)"; \
	fi

check-java:
	@if [ -z "$(JAVA_VERSION)" ]; then \
		echo "ERROR: Java not found. Run: make setup-java"; \
		exit 1; \
	elif [ "$(JAVA_VERSION)" -lt "$(JAVA_REQUIRED)" ]; then \
		echo "ERROR: Java $(JAVA_VERSION) too old, need >= $(JAVA_REQUIRED). Run: make setup-java"; \
		exit 1; \
	else \
		echo "OK   java $(JAVA_VERSION)"; \
	fi

check-android:
	@if [ -z "$(ANDROID_HOME)" ]; then \
		echo "ERROR: ANDROID_HOME is not set. Run: make setup-android"; \
		exit 1; \
	else \
		echo "OK   ANDROID_HOME=$(ANDROID_HOME)"; \
	fi
	@if [ ! -f "$(SDKMANAGER)" ]; then \
		echo "ERROR: sdkmanager not found at $(SDKMANAGER). Run: make setup-android"; \
		exit 1; \
	else \
		echo "OK   sdkmanager found"; \
	fi
	@if [ ! -d "$(ANDROID_HOME)/platforms/android-$(ANDROID_API)" ]; then \
		echo "ERROR: Android API $(ANDROID_API) not installed. Run: make setup-android"; \
		exit 1; \
	else \
		echo "OK   android-$(ANDROID_API)"; \
	fi
	@if [ ! -d "$(ANDROID_HOME)/build-tools/$(BUILD_TOOLS)" ]; then \
		echo "ERROR: build-tools $(BUILD_TOOLS) not installed. Run: make setup-android"; \
		exit 1; \
	else \
		echo "OK   build-tools $(BUILD_TOOLS)"; \
	fi

check-eas:
	@if [ -z "$(EAS_VERSION)" ]; then \
		echo "ERROR: eas-cli not found. Run: npm install -g eas-cli"; \
		exit 1; \
	else \
		echo "OK   eas-cli $(EAS_VERSION)"; \
	fi

# ─── Setup ───────────────────────────────────────────────────────────────────

## Install Java 17 via apt (requires sudo)
setup-java:
	sudo apt-get update && sudo apt-get install -y openjdk-17-jdk
	@echo ""
	@echo "Add to your ~/.bashrc or ~/.zshrc:"
	@echo '  export JAVA_HOME=$$(dirname $$(dirname $$(readlink -f $$(which java))))'

## Download Android cmdline-tools and install required SDK packages
setup-android:
	@if [ -z "$(ANDROID_HOME)" ]; then \
		echo "ERROR: Set ANDROID_HOME first, e.g.:"; \
		echo '  export ANDROID_HOME=$$HOME/android-sdk'; \
		echo "  Add it to your ~/.bashrc or ~/.zshrc then re-run."; \
		exit 1; \
	fi
	mkdir -p $(ANDROID_HOME)/cmdline-tools
	@if [ ! -f "$(SDKMANAGER)" ]; then \
		echo "Downloading Android cmdline-tools..."; \
		curl -o /tmp/cmdline-tools.zip \
			"https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"; \
		unzip -q /tmp/cmdline-tools.zip -d /tmp/cmdline-tools-tmp; \
		mv /tmp/cmdline-tools-tmp/cmdline-tools $(ANDROID_HOME)/cmdline-tools/latest; \
		rm -rf /tmp/cmdline-tools.zip /tmp/cmdline-tools-tmp; \
		echo "cmdline-tools installed."; \
	fi
	@echo "Installing SDK packages (accepting licenses)..."
	yes | $(SDKMANAGER) --licenses > /dev/null 2>&1 || true
	$(SDKMANAGER) \
		"platform-tools" \
		"platforms;android-$(ANDROID_API)" \
		"build-tools;$(BUILD_TOOLS)"
	@echo ""
	@echo "Add to your ~/.bashrc or ~/.zshrc:"
	@echo '  export ANDROID_HOME=$$HOME/android-sdk'
	@echo '  export PATH=$$PATH:$$ANDROID_HOME/platform-tools:$$ANDROID_HOME/cmdline-tools/latest/bin'

## Install eas-cli globally
setup-eas:
	npm install -g eas-cli

## Run all setup steps
setup: setup-java setup-android setup-eas

# ─── Install dependencies ────────────────────────────────────────────────────
install: check-node
	npm install

# ─── Build (local, via EAS CLI) ──────────────────────────────────────────────

build/:
	mkdir -p build

## APK de preview (distribution interne, signé automatiquement)
build: check build/
	eas build --local -p android --profile preview --output ./build/preview.apk

## APK de développement (avec expo-dev-client)
build-dev: check build/
	eas build --local -p android --profile development --output ./build/development.apk

## AAB de production (pour le Play Store)
build-production: check build/
	eas build --local -p android --profile production --output ./build/production.aab

# ─── Misc ────────────────────────────────────────────────────────────────────
update: check-node
	npx npm-check-updates -u
	npm install
