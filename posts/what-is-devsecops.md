---
title: What is DevSecOps?
description: DevSecOps is becoming a desirable practice in many organizations, but What is DevSecoOps exactly? In this post, a Professional DevSecOps Engineer shares their thoughts.
image: https://source.unsplash.com/jHZ70nRk7Ns/800x600
date: 2020-10-08
tags:
 - devops
 - devsecops
layout: layouts/post.njk
---

## What is a DevSecOps Engineer

<!-- Excerpt Start -->
The DevSecOps Engineer role is a relatively new role that has come into existence during the past decade in I.T. and seems hard to define.

Part of what makes the position challenging to understand is that it is continually changing due to new technologies.

However, a good start at understanding it is to realize that it is a mix of several different roles; software engineer, sysadmin, security engineer, network engineer, and more.

Of the roles, the ones with the most massive influence are software engineer, sysadmin, and security analyst. I think the  Dev piece of DevOps is Software Engineering, the Ops is sysadmin, and Sec is the security analyst.

With that mindset, then the following will make sense.

> A DevSeOps Engineer is responsible for building software that automates the developer experience, sysadmin responsibilities, and incorporates security focus from step one.

This post demonstrates what a DevSecOps engineer does and what DevSecOps culture is and isn't using Github Actions (CI), GoLang, and AWS Elastic Beanstalk (CD).
<!-- Excerpt End -->


## I. CI => Enabling Github Actions

### Setting up basic GoLang web application
In the root of your Github Project create the following.

```yaml

name-of-your-github-project/
.github/
 - workflows/
   - main.yaml
```

By creating the '.github' folder GitHub automatically begins to process `github actions` or in other words, github's version a Continuous Integration Pipeline, which I wrote about in my previous article [what is devops]().

Don't worry each GitHub account that is enabled is allowed a free amount of [2000 minutes of build time.](https://github.com/pricing)

Also, create the following

```yaml
name-of-your-github-project/
.github
main_test.go
main.go
```

Develop a quick web application using [Test Driven Development]()(link to prev. article) by adding the following to `main_test.go`, which will fail whenever you run `go test` because there is no `handlerFunc` within `main.go`

```yaml
package main

import (
  "io/ioutil"
  "net/http"
  "net/http/httptest"
  "testing"
)

func TestHome(t *testing.T) {
  r := httptest.NewRequest(http.MethodGet, "/", nil)
  w := httptest.NewRecorder()
  handlerFunc(w, r)
  resp := w.Result()
  body, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    t.Errorf("ioutil.ReadAll() err = %s; want nil", err)
  }
  have := string(body)
  want := "<h1>Hi from alpine</h1>"
  if have != want {
    t.Errorf("GET / = %s; want %s", have, want)
  }
}
```

and then to satisfy the test add the following to the `main.go` file.


```yaml
package main

import (
  "fmt"
  "log"
  "net/http"
)

func handlerFunc(w http.ResponseWriter, r *http.Request) {
  fmt.Fprint(w, "<h1>Hi from alpine</h1>")
}

func main() {
  http.HandleFunc("/", handlerFunc)
  log.Fatal(http.ListenAndServe(":8080", nil))
}

```

Now, running `go test` results in a `PASS`

### Setting up the first part of the `main.yaml`

```yaml

First, the project is named, and in this case it is the same as the repo, however you can name yours whatever you like. Next, the pattern for running the github actions is defined, for my use case I want it to always run on the `main` branch and for any `pull_requests`. Lastly, I define a few environment variable that will be used later on. Again, feel free to name them whatever you want, but for the `WEB_IMAGE` you will need to do a quick set up for github container registry if you are planning to follow along. Here's an article from the GitHub Team on [how to do so](https://github.blog/2020-09-01-introducing-github-container-registry/)

name: go-devsecops-pipeline
on:
  push:
    tags:
      - v*
    branches:
      - main
  pull_request:

env:
  IMAGE_NAME: hi-web-app
  WEB_IMAGE: ghcr.io/llcranmer/go-devsecops-pipeline/hi-web-app:main
```



### I.a Parts of the (CI) Security Pipeline

Now, that the repo is enabled it is time to start adding in the steps to the `main.yaml` file. Each one of the steps will be related to Security, Quality Assurance, or sys admin/cloud engineering.

#### I.b Linter - QA

Imagine, that your project has several contributors on it and each probably small style differences (in GoLang this is mostly resolved by `go fmt`), however not every programming language has built formatting for itself. Therefore, it may be a good idea to get used to having a Linter within your pipeline. Because the linter will enforce the same style conventions for anyone that decides to contribute to the project. So, it is important that for each branch (PR) that is not the main branch, that the linter is run. In our case since this is a GoLang based project we'll use 'golangci-lint', from [Github Marketplace Actions]. In general, I've selected projects with the highest amount of stars. There should be `linters` available for whichever language you are developing in.

```yaml
### Above is still the same
### ADDED THE FOLLOWING
jobs:
  golang_ci:
    if: github.ref != 'refs/heads/main'
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: golangci-lint
        uses: golangci/golangci-lint-action@v2
        with:
          version: v1.29
```

#### I.c Static Security Scan - Sec.

A static security scan checks the source code against a database of known [Common Vulnerability Exploits (CVE's)](), by adding one no the pipeline we'll ensure that any well known public security exploits can be caught before they make it into the main branch. Again, I've selected a language specific one for GoLang, however [snyk]() is another valid choice and can scan several different languages. However, it will require you to set-up an account, generate a token, and is only FREE if you are working on an open source project.

```yaml
### Above is still the same
### ADDED THE FOLLOWING
  static_security_scan:
    if: github.ref != 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source
        uses: actions/checkout@v2
      - name: Run GoSec Security Scanner
        uses: securego/gosec@master
        with:
          args: ./...
```


#### I.d Secrets Check - Sec

Checking in secrets into a GitHub branch or repo happens much more often then it should and can be tedious to clean up from the GitHub Commit History, meaning just because you delete the secret on the next check-in does not mean it is gone from GitHub history at all. Again, let's keep other contributors from being able to make that mistake by scanning for secrets on every commit to branches.

```yaml
### Above is still the same
### ADDED THE FOLLOWING
secrets_check:
  if: github.ref != 'refs/heads/main'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v2
    - uses: max/secret-scan@master
```
#### I.e Unit Tests - QA

Now, we'll run the test(s) that we wrote for the web application just to make sure the behavior of the code is acting as expected.

```yaml
### Above is still the same
### ADDED THE FOLLOWING
test:
  name: Test
  if: github.ref != 'refs/heads/main'
  runs-on: ubuntu-latest
  steps:
    - name : checkout
      uses: actions/checkout@v2

    - uses: actions/setup-go@v2
      with:
        go-version: '1.14'
    - name: run tests
      run: go test -json ./... > test.json

    - name: annotate tests
      if: always()
      uses: guyarb/golang-test-annotations@v0.2.0
      with:
        test-results: test.json
```

#### I.f Build the Docker Image - QA

Now, using Docker may be unfamiliar to some readers, but the gist of it is that Docker makes it easier to share projects and to make sure that the said project will run on anyone's machine. But, with GoLang this isn't really a worry since the binary can be compiled to tens of Operating Systems. However, I want to use Docker in case the web application ever ends up becoming deployed to Kubernetes and for practice. Because I believe each new developer should learn the basics of Docker, especially if they're going to be doing Cloud Engineering / DevOps work.

##### Setting up Docker

First create the Dockerfile


```yaml
name-of-your-github-project/
.github
main_test.go
main.go
Dockerfile
```

**Optional Step** Download Docker for your machine so that you can run Docker Locally.

Add the following to the Dockerfile

```yaml
FROM golang:1.14-alpine
LABEL base.name="goDevSecOpsDocker"
WORKDIR /app
COPY . .
RUN go build -o main .
RUN chmod +x main
EXPOSE 8080
ENTRYPOINT ["./main"]
```

Which, are the instructions that we tell the docker installed upon the GitHub Action how to build our Docker Image for the Web App, so add the following to the `main.yaml`.

You may be prompted in the build logs to enable 'github container registry' for your repo, so go ahead and do that.

```yaml
### Above is still the same
### ADDED THE FOLLOWING
build:
  name: Build, Scan, and Publish Image
  if: github.ref != 'refs/heads/main'
  runs-on: ubuntu-latest
  needs: [golang_ci, static_security_scan, secrets_check, test]
  steps:
    - uses: actions/checkout@v2
    - name: Build App Image
      run: docker build . --tag $IMAGE_NAME
```

### I.g Scan the Docker image - Sec

Anchore is a great free dockerfile/docker image scanning tool. I chose to use it over Snyk, another great tool withe a *free tier because it required users to set up an account with them.

```yaml
### Above is still the same
### ADDED THE FOLLOWING
- uses: anchore/scan-action@v2
id: scan
with:
  image: hi-web-app:latest
  acs-report-enable: true
  fail-build: true
  severity-cutoff: medium
- name: Upload anchore scan SARIF report
uses: github/codeql-action/upload-sarif@v1
with:
  sarif_file: ${{ steps.scan.outputs.sarif }}
- name: Inspect action SARIF report
run: cat ${{ steps.scan.outputs.sarif }}
```

### I.h Store the Docker Image inside of the github container registry for use - QA

First create a personal token as instructed by the [GitHub Team](). Then, add the following:

```yaml
### Above is still the same
### ADDED THE FOLLOWING
- name: Log into GitHub Container Registry
uses: docker/login-action@v1
with:
  registry: ghcr.io
  username: ${{ github.repository_owner }}
  password: ${{ secrets.CR_PAT }}

- name: Push image to GitHub Container Registry
run: |
  IMAGE_ID=ghcr.io/${{ github.repository }}/$IMAGE_NAME
  # Change all uppercase to lowercase
  IMAGE_ID=$(echo $IMAGE_ID | tr '[A-Z]' '[a-z]')
  # Strip git ref prefix from version
  VERSION=$(echo "${{ github.ref }}" | sed -e 's,.*/\(.*\),\1,')
  # Strip "v" prefix from tag name
  [[ "${{ github.ref }}" == "refs/tags/"* ]] && VERSION=$(echo $VERSION | sed -e 's/^v//')
  # Use Docker `latest` tag convention
  [ "$VERSION" == "master" ] && VERSION=latest
  echo IMAGE_ID=$IMAGE_ID
  echo VERSION=$VERSION
  docker tag $IMAGE_NAME $IMAGE_ID:$VERSION
  docker push $IMAGE_ID:$VERSION
```

The reason we are creating an image is because we want other users to be able to simple 'PULL' the image whenever they wish to use the product. Additionally, it makes it easier to deploy to any server that is capable of running Docker such as a Kubernetes cluster, EKS, AKS, GKE, etc.

In our case it will be elastic beanstalk's docker platform. Lastly, it is helpful to have each image saved to the container registry in case, somehow an image is deployed that is broken. In that scenario, we can easily deploy the previous tag to the server in under a minute so that our users/customers ideally do not experience downtime (broken site experience).

## II. CD => The AWS Docker Platform via Elastic Beanstalk

### II. Parts of the (CD) Security Pipeline

#### II.a Zip files for Elastic Beanstalk with the unique tag for versioning - QA

We again rebuild the image for Elastic Beanstalk which has specific requirements such as having a zipped archive with a `Dockerfile` and `main.go`/main file of the programming language.

```yaml
### Above is still the same
### ADDED THE FOLLOWING
deploy:
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v2
    - name: Generate deployment package
      run: zip files.zip main.go Dockerfile

    - name: Get timestamp
      uses: gerred/actions/current-time@master
      id: current-time

    - name: Run string replace
      uses: frabert/replace-string-action@master
      id: format-time
      with:
        pattern: '[:\.]+'
        string: "${{ steps.current-time.outputs.time }}"
        replace-with: '-'
        flags: 'g'
    - name: Deploy to Elastic Beanstalk
      uses: einaregilsson/beanstalk-deploy@v10
      with:
        aws_access_key: ${{secrets.AWS_ACCESS_GO_KEY_ID}}
        aws_secret_key: ${{secrets.AWS_SECRET_ACCESS_GO_KEY}}
        application_name: "godevsecops-docker-platform"
        environment_name: "GodevsecopsDockerPlatform-env"
        region: "us-east-2"
        version_label: "godevsecops-${{ steps.format-time.outputs.replaced }}"
        deployment_package: files.zip
```

#### II.b Deploy the application to elastic beanstalk - SysAdmin

```yaml
### Above is still the same
### ADDED THE FOLLOWING
- name: Deploy to Elastic Beanstalk
uses: einaregilsson/beanstalk-deploy@v10
with:
  aws_access_key: ${{secrets.AWS_ACCESS_GO_KEY_ID}}
  aws_secret_key: ${{secrets.AWS_SECRET_ACCESS_GO_KEY}}
  application_name: "godevsecops-docker-platform"
  environment_name: "GodevsecopsDockerPlatform-env"
  region: "us-east-2"
  version_label: "godevsecops-${{ steps.format-time.outputs.replaced }}"
  deployment_package: files.zip
```


#### II.c Dynamically test the web application - Sec

```yaml
### Above is still the same
### ADDED THE FOLLOWING
dynamic_security_scan:
  if: github.ref == 'refs/heads/main'
  name: OWASP ZAP Dynamic Security Scan
  runs-on: ubuntu-latest
  needs: deploy
  steps:
    - name: ZAP Scan
      uses: zaproxy/action-full-scan@v0.2.0
      with:
        token: ${{ secrets.ZAP_TOKEN }}
        target: 'https://getsaas.co'
        cmd_options: '-a'
```

#### II.d Analyze Results of the Dynamic testing

[llcranmer/go-devsecops-pipeline](https://github.com/llcranmer/go-devsecops-pipeline/issues)

