#!/bin/bash

# Provide the Spring Cloud Contract Docker version
SC_CONTRACT_DOCKER_VERSION="2.0.1.RELEASE"
# Spring Cloud Contract Stub Runner properties
STUBRUNNER_PORT="8083"
# Stub coordinates 'groupId:artifactId:version:classifier:port'
STUBRUNNER_IDS="org.ecmr:e-cmr:1.0-SNAPSHOT:stubs:9876"

# Run the docker with Stub Runner Boot
docker run  --rm -e "STUBRUNNER_IDS=${STUBRUNNER_IDS}" \
    -e "STUBRUNNER_STUBS_MODE=REMOTE" \
    -v "${HOME}/.m2/:/root/.m2:ro" \
    -e STUBRUNNER_STUBS_MODE=LOCAL \
    -p "${STUBRUNNER_PORT}:${STUBRUNNER_PORT}" \
    -p "9876:9876" springcloud/spring-cloud-contract-stub-runner:"${SC_CONTRACT_DOCKER_VERSION}"