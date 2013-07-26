REPORTER = spec

all:
	@./node_modules/.bin/mocha \
      	--reporter $(REPORTER) \
      	--ui bdd \
      	--bail \
      	test/*.js

test: all

.PHONY: test