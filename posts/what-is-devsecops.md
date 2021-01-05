---
title: What is DevSecOps?
description: DevSecOps is becoming a desirable practice in many organizations, but What is DevSecoOps exactly? In this post, a Professional DevSecOps Engineer shares their thoughts.
image: https://source.unsplash.com/jHZ70nRk7Ns/800x600
date: 2020-10-08
tags:
 - DevOps
 - DevSecOps
layout: layouts/post.njk
---

## What is a DevSecOps Engineer

<!-- Excerpt Start -->

This post shows how to build a fully automated and free DevSecOps Pipeline powered GitHub Actions for GoLang. So, anyone starting a project can make it with security in mind from day 1. The DevSecOps pipeline similar to the previous post [What is DevOps?](https://thetoulbox.com/posts/what-is-devops/), but it will be more technical in that it will **not** rely on any CLI to do everything automagically. But don't worry I'll go over each step and explain what is being done and **why**.
<!-- Excerpt End -->


## I. Continuous Integration (CI)

GitHub Actions is a new offering from GitHub that turns any repository into a CI Pipeline with minimal effort. Additionally, it has a generous marketplace of [Actions](https://github.com/marketplace) that make building out a `*.yaml` pipeline file a breeze. I am using GitHub Actions for this pipeline because GitHub is one of the most popular places to store code, especially for open source projects, and it is my hope that readers can apply what they learn from this post to build their own secure pipeline. Therefore, making projects a tiny bit more security focused for both Open Source and personal (you never know who is using your public code snippets).

Let's get started.

### Enabling GitHub Actions

In the root of your GitHub Project, create the following folder structure and files:

```yaml

name-of-your-github-project/
.github/
 - workflows/
   - main.yaml
```

By creating the  `workflows` folder within the `.github` folder, GitHub automatically begins to process `GitHub actions` or, in other words, Github's version a Continuous Integration Pipeline, which I wrote about in my previous article [What is devops](https://thetoulbox.com/posts/what-is-devops/), so please do read it if Continuous Integration is new to you before going further.

Don't worry. Each GitHub account that is enabled is allowed a free amount of [2000 minutes of build time.](https://github.com/pricing)

Also, create the following.

```yaml

name-of-your-github-project/
.github
## Add the below
main_test.go
main.go

```

Develop a quick web application using [Test Driven Development](https://thetoulbox.com/posts/a-beginners-guide-to-test-driven-development-when-stuck/) by adding the following to `main_test.go`, which will fail whenever you run `go test` because there is no `handlerFunc` within `main.go`

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

And then, to satisfy the test add the following to the `main.go` file.


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

Now, running `go test` results in a `PASS.`

### Setting up the first part of the `main.yaml`

First, give the project a  name via the `name:` field, and in this case, it is the same as the repo. However, you can name yours, whatever you like. Next, the pattern for running GitHub actions is defined. I want it to always run on the `main` branch and for any `pull_requests` for my use case. Lastly, I describe a few environment variables for use later on. Again, feel free to name them whatever you want, but for the `WEB_IMAGE`, you will need to do a quick setup for the GitHub container registry. Here's an article from the GitHub Team on [how to do so](https://github.blog/2020-09-01-introducing-github-container-registry/)

```yaml
name: go-devsecops-pipeline # TODO: Update this value with your own
on:
  push:
    tags:
      - v*
    branches:
      - main
  pull_request:

env:
  IMAGE_NAME: hi-web-app # TODO: Update this value with your own
  WEB_IMAGE: ghcr.io/llcranmer/go-devsecops-pipeline/hi-web-app:main # TODO: Update this value with your own
```

### I.a Parts of the (CI) Security Pipeline

Now that the repo is enabled, it is time to start adding in the steps to the `main.yaml` file. Each of the steps will relate to Security, Quality Assurance, or sysadmin/cloud engineering.

#### I.b Linter - QA

- [GolangCI-lint](https://github.com/marketplace/actions/run-golangci-lint)

Imagine that your project has several contributors to it. Each probably has small style differences (in GoLang, this is mostly resolved by `go fmt`), however not every programming language has built formatting for itself. Therefore, it may be a good idea to get used to having a Linter within your pipeline because the linter will enforce the same style conventions for anyone that decides to contribute to the project.

So, It is vital that for each branch (P.R.) that is **not** the `main` branch, the linter is run. In our case, since this is a GoLang based project, we'll use `golangci-lint`. In general, I've selected projects with the highest amount of stars. There should be `linters` available for whichever language you are developing in.

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

- [GoSec](https://github.com/securego/gosec)

A static security scan checks the source code against a database of known [Common Vulnerability Exploits (CVE's)](https://cve.mitre.org/). By adding one to the pipeline, we'll ensure that we can catch public security exploits before merging into main. Again, I've selected a language-specific one for GoLang. However, [Snyk](https://github.com/marketplace/actions/snyk) is another good choice and can scan several different languages. But, it will require you to set up an account, generate a token, and it is only FREE if you are working on an open-source project. Hence, the choice to not go with it for this project.

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

- [Secret Scan](https://github.com/marketplace/actions/secret-scan)

Checking in secrets into a GitHub branch or repo happens much more often than it should. It can be tedious to clean up from the GitHub Commit History, meaning just because you delete the secret on the next check-in does not mean it is gone from GitHub history at all. Again, let's keep other contributors from making that mistake by scanning for secrets on every commit to branches.

Another, perhaps more significant alternative that requires creating an account and possibly may cost money is [GitGuardian Shield Action](https://github.com/marketplace/actions/gitguardian-shield-action).

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

- [Golang Test Annotation](https://github.com/marketplace/actions/golang-test-annotations)

Now, we'll run the test(s) that we wrote for the web application to make sure the behavior of the code is acting as expected, and make it a little nicer, in that whenever a test fails, it'll generate a readable test case failure for the user, due to using the action.

It is important to have tests run for each branch so that when it comes to Pull Request (PR) review time, other developers can quickly see that test(s) are being added and that they are passing.

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

Docker may be unfamiliar to some readers, but the gist of it is that Docker makes it easier to share projects and make sure that the said project will run on anyone's machine. Meaning, other devs and other servers in the cloud, so it is incredibly useful. However, with GoLang, this isn't a worry since the binary executable is compilable to tens of Operating Systems.

But, I want to use Docker if the web application ever becomes deployed to Kubernetes or to swap out the Cloud Service Provider from AWS.

Also, I believe each new developer should learn the basics of Docker, especially if they're going to be doing Cloud Engineering / DevOps work.

- [How to set up Docker and tutorial](https://docs.docker.com/get-started/)

It is not strictly necessary to have Docker set up on your local machine as we can use the Docker on the GitHub machine to build and test the Docker image via the pipeline we are building. Yet, many developers prefer to have copies of the software running on their machine, so do whichever works for you (me I prefer to keep it all in the cloud).

##### Setting up Docker

First, create the Dockerfile.

```yaml
name-of-your-GitHub-project/
.github
main_test.go
main.go
Dockerfile # Added file
```

Add the following to the Dockerfile.

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

Which are the instructions that we tell the Docker installed upon the GitHub Action how to build our Docker Image for the Web App, so add the following to the `main.yaml`.

You may be prompted to build logs to enable 'GitHub container registry' for your repo, so go ahead and do that if you see that in the logs.

Also, note the `needs` section, which takes in an array of values: the previous steps. Essentially, we only want to build the image if the Q.A./Basic Security checks have based, otherwise we will not bother with running this step. It is ideal because it will (a) save build minutes and (b) make sure nothing that doesn't pass the basic Q.A. and security checks is built and stored in the container registry, saving on memory usage for the project. Each user gets around 500 MB to 2 GB of Docker Image storage (Free vs PRO plan). So, don't want to waste memory on poor quality images.

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

- [Anchore Docker Image Scanner](https://github.com/marketplace/actions/anchore-container-scan)

Anchore is an excellent Dockerfile/Docker image scanning tool with a free tier that doesn't require the user to create an account. It is important to have a tool like Anchore in the pipeline because it scans the Operating System (OS) that the Dockerfile builds for vulnerabilities (CVE's).

For this project we have based the web application off of the `golang:1.14-Alpine` mini OS because it is small and includes only the bare minimal to run, which means there is less likelihood of it being exploitable.

In general the more software is included the larger the attack surface is, so it is a common practice to go through the Operating System and strip out unnecessary packages/softaware to reduce the attack surface.

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

### I.h Store the Docker Image inside of the GitHub container registry for use - QA

First, create a [personal token](https://github.com/settings/tokens) with the permissions to *delete:packages*, *read:packages*, *repo*, *write:packages* and name it **CR_PAT**.

Once, it has been created add to your secrets for the repository by going to this link `https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_GITHUB_PROJECT>/settings/secrets/actions` for example it is `https://github.com/llcranmer/go-devsecops-pipeline/settings/secrets/actions` for this project.

 Then, add the following:

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

We are creating an image because we want other developers to be able to `PULL` the image whenever they wish to contribute.

Additionally, it makes it easier to deploy to any server capable of running Docker, such as a Kubernetes cluster, EKS, AKS, GKE, etc.

In our case, it will be [Elastic Beanstalk's Docker Platform](https://docs.aws.amazon.com/elasticbeanstalk/latest/platforms/platforms-supported.html#platforms-supported.docker). Lastly, it is helpful to have each image saved to the container registry in case somehow a broken image is deployed. In that scenario, we can quickly deploy the previous tag to the server in under a minute so that our users/customers ideally do not experience downtime (broken site experience).

## II. Continuous Deployment (CD) to The AWS Docker Platform by Elastic Beanstalk

### II. Parts of the (CD) Security Pipeline

#### II.a Zip files for Elastic Beanstalk with the unique tag for versioning - Q.A.

We create a *.zip* archive for Elastic Beanstalk, which has specific requirements such as having the `Dockerfile` and `main.go`/main file of the programming language within the **.zip**.

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
```

#### II.b Deploy the application to elastic beanstalk - SysAdmin

- [Beanstalk Deploy](https://github.com/marketplace/actions/beanstalk-deploy)

It is important if you are following along to go ahead and provision the Elastic Beanstalk environment beforehand. Please, use this video as reference: [Golang on AWS Elastic Beanstalk in 5 minutes](https://www.youtube.com/watch?v=OgSRDwyhMTM).

As in the case of much of things that are automated the first iteration is usually done manually, hence the need to do it by hand the first time.

Once, the environment is up and running then we can add the code snippet below to the `main.yaml` to automate all future deployments.

To do so requires you to create a new IAM USER with the `AWSElasticBeanstalkFullAccess` that has `programmatic access` to the AWS account, which will generate an **AWS_ACCESS_KEY_ID** and **AWS_SECRET_ACCESS_KEY**, make sure to download the *.csv that contains them for later use.

Next, add the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to your GitHub repository secrets.

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

