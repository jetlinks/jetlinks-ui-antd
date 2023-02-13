#!/usr/bin/env bash
docker build -t registry.cn-hangzhou.aliyuncs.com/sky-devops/jetlinks-ui:2.0.0-SNAPSHOT .
docker push registry.cn-hangzhou.aliyuncs.com/sky-devops/jetlinks-ui:2.0.0-SNAPSHOT
