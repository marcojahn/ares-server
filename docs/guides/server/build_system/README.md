# Build

## Remote

- Travis-CI will be used to run integration and unit tests after every commit
- Travis-CI will be covering the following branches
    - development
    - release
    - hotfix
- Travis-CI will cover the following things
    - are all tests passed
    - are all dependecies (dev and production) up to date

## Local

- local builds will automatically trigger the following targets
    - unit tests
    - coverage
    - JSHint

            grunt build:production

- unit tests can be started manually using a Grunt target

        grunt run:tests

## Continuous delivery

Using Travis-CI a successfull build will be automatically deployed to RedHat OpenShift (release branch)

## Code Climate

The Code Climate service will be used with Travis-CI to cover the following metrics

- code coverage
- code quality
    - complexity reports
    - code smells
    - quality trends

## Github project badges

The github project site will present badges of used services

- Dependencies (both dev and production)
- Build status
- Code Climate
    - Coverage
    - Code Climate (1.0 - 5.0)
    - Trend