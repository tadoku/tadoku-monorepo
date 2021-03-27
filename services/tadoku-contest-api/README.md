# Tadoku API

[![CircleCI](https://circleci.com/gh/tadoku/api/tree/master.svg?style=svg)](https://circleci.com/gh/tadoku/api/tree/master)
[![Go Report Card](https://goreportcard.com/badge/github.com/tadoku/tadoku-monorepo/services/tadoku-contest-api)](https://goreportcard.com/report/github.com/tadoku/tadoku-monorepo/services/tadoku-contest-api)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=tadoku/api)](https://dependabot.com)

## Getting started

### 1. Setup environment

- Install [`direnv`](https://direnv.net/)
- Copy over the default environment: `$ cp .env{.sample,}`
- Go over the file and make sure the environment variables are correct for your env (eg. database url)
- Make sure to generate a JWT Secret (instructions are inside .env)
- Allow direnv `$ direnv allow`

## Commands

### Build project

```sh
$ make all
```

### Run project without tests
```sh
$ make run
```

### Lint project

```sh
$ make lint
```

### Run tests

```sh
$ make test
```