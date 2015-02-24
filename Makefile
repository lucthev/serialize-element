# Various programs
browserify := ./node_modules/.bin/browserify
jshint := ./node_modules/.bin/jshint
uglifyjs := ./node_modules/.bin/uglifyjs
karma := ./node_modules/.bin/karma

# Build options
src := src/serialize.js
all := $(shell $(browserify) --list $(src))

dist/serialize.js: $(all)
	@mkdir -p dist
	$(browserify) -s Serialize $(src) | $(uglifyjs) -m -o $@

lint:
	$(jshint) src test

clean:
	rm -rf dist

test: lint dist/serialize.js
	$(karma) start test/karma.conf.js

publish: dist/serialize.js
	npm publish

.PHONY: clean lint test publish
