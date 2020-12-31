---
title: How to build a desktop app to interact for AWS Lambda and Azure DevOps
description: Use GoLang + Wails to build a desktop app for managing AWS Lambda and Azure DevOps
image: https://source.unsplash.com/jHZ70nRk7Ns/800x600
date: 2020-12-14
tags:
  - azure-devops
layout: layouts/post.njk
---

<!-- Excerpt Start -->

In this post I cover how to build a desktop app using [GoLang](), [Wails](), and [Svelte]() to interact with AWS Lambda and Azure DevOps from your local machine. It is meant as a fun side project so we're going to keep things as simple as possible.

<!-- Excerpt End -->

## Rough Outline of the Project

For the AWS cloud interaction we will assume that the user has the AWS CLI installed on their local machine w/the appropriate access level. The same goes for the AZURE CLI tool. To keep things simple the Go Code is going to be using shell/terminal commands to call the AZURE and AWS CLI tools, in a desktop GUI. So, we will not be using the aws-sdk-go or azure-sdk-go.

## Prerequisite

- [How to Install Wails]()
- [How to Install Svelte]()
- [How to install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-mac.html)
- [How to Sign Up for an AWS Account]()
- [How to Sign Up for an Azure Account]()

## Part I. Setting up the Project

### I.a Wails setup

First, after following [How to Install Wails](),
set up wails for your machine:

```json
> toul@M1 src % wails setup
 _       __      _ __
| |     / /___ _(_) /____
| | /| / / __ `/ / / ___/
| |/ |/ / /_/ / / (__  )  v1.8.1
|__/|__/\__,_/_/_/____/   https://wails.app
The lightweight framework for web-like apps

What is your name (Toul):
What is your email address (toul@hey.com):

Wails config saved to: /Users/toul/.wails/wails.json
Feel free to customise these settings.

Detected Platform: OSX
Checking for prerequisites...
Program 'clang' found: /usr/bin/clang
Program 'npm' found: /usr/local/bin/npm

🚀 Ready for take off!
Create your first project by running 'wails init'.
```

### I.b Wails Init

Now, create project

```json
> toul@M1 src % wails init test
Wails v1.9.1 - Initialising project

The name of the project (My Project): test
Project Name: test
The output binary name (test): test
Output binary Name: test
Project directory name (test):
Project Directory: test
Please select a template (* means unsupported on current platform):
  1: Angular - Angular 8 template (Requires node 10.8+)
  2: React JS - Create React App v4 template
  3: Svelte - A basic Svelte template
  4: Vanilla - A Vanilla HTML/JS template
  5: Vue3 Full - Vue 3, Vuex, Vue-router, and Webpack4
  6: Vue2/Webpack Basic - A basic Vue2/WebPack4 template
  7: Vuetify1.5/Webpack Basic - A basic Vuetify1.5/Webpack4 template
  8: Vuetify2/Webpack Basic - A basic Vuetify2/Webpack4 template
Please choose an option [1]: 3
Template: Svelte
✓ Generating project...
✓ Building project (this may take a while)...
Project 'test' built in directory 'test'!
```

### I.c Wails serve

Run, wails serve to start the bridge between GoLang (Backend) and the Frontend (Svelte)

```json
toul@M1 test % wails serve
Wails v1.9.1 - Serving Application

✓ Ensuring Dependencies are up to date...
✓ Packing + Compiling project...
Awesome! Project 'test' built!
Serving Application: /Users/toul/code/go/src/test/build/test
test - Debug Build
------------------
INFO[0000] [App] Starting
INFO[0000] [Events] Starting
INFO[0000] [IPC] Starting
INFO[0000] [Bind] Starting
INFO[0000] [Bind] Binding Go Functions/Methods
INFO[0000] [Bind] Bound Function: main.basic()
INFO[0000] [Bridge] Bridge mode started.
INFO[0000] [Bridge] The frontend will connect automatically.
INFO[0000] [Events] Listening
>>>>> To connect, you will need to run 'npm run dev' in the 'frontend' directory <<<<<
INFO[0043] [Bridge] Connection from frontend accepted [[::1]:51000].
INFO[0043] [BridgeSession] Connected to frontend.
DEBU[0043] [BridgeSession] Session [::1]:51000 - writePump start
DEBU[0043] [Events] Got Event                            data="[[::1]:51000]" name="wails:bridge:session:started"
DEBU[0043] [Events] Got Event                            data="[]" name="wails:ready"
DEBU[0043] [BridgeSession] Got message: "{\"type\":\"event\",\"payload\":{\"name\":\"wails:loaded\",\"data\":\"[]\"}}"
DEBU[0043] [IPC] Message received                        payload="&{wails:loaded []}" type=event
DEBU[0043] [IPC] Processing message                      1D=0xc000010038
DEBU[0043] [IPC] Processing event                        data="[]" name="wails:loaded"
DEBU[0043] [IPC] Finished processing event               name="wails:loaded"
DEBU[0043] [IPC] Finished processing message             1D=0xc000010038
DEBU[0043] [Events] Got Event                            data="[]" name="wails:loaded"
DEBU[0045] [BridgeSession] Got message: "{\"type\":\"call\",\"callbackID\":\"main.basic-1344109600\",\"payload\":{\"bindingName\":\"main.basic\",\"data\":\"[]\"}}"
DEBU[0045] [IPC] Message received                        payload="&{main.basic []}" type=call
DEBU[0045] [IPC] Processing message                      1D=0xc00040c038
DEBU[0045] [IPC] Processing call                         1D=0xc00040c038 bindingName=main.basic data="[]"
DEBU[0045] [IPC] Finished processing message             1D=0xc00040c038
DEBU[0045] [Bind] Wanting to call main.basic
DEBU[0045] [main.basic] Unmarshalled Args: []
DEBU[0045] [main.basic] Converted Args: []
DEBU[0045] [main.basic] results = [World!]

```

### I.d npm run dev

Change into the frontend

```json
toul@M1 frontend % npm run dev

> test@ dev /Users/toul/code/go/src/test/frontend
> rollup -c -w
...
  Your application is ready~! 🚀

  - Local:      http://localhost:5000
  - Network:    Add `--host` to expose

────────────────── LOGS ──────────────────

  [10:26:11] 200 ─ 9.79ms ─ /
  [10:26:11] 200 ─ 1.21ms ─ /build/bundle.css
  [10:26:11] 200 ─ 4.48ms ─ /build/bundle.js
  [10:26:11] 200 ─ 1.41ms ─ /favicon.png
  [10:26:11] 404 ─ 0.24ms ─ /apple-touch-icon-precomposed.png
  [10:26:11] 404 ─ 0.22ms ─ /apple-touch-icon.png
bundles src/main.js → public/build/bundle.js...
```

## Part II. Building the AWS Lambda Interaction

In this part we'll build a CRUD interface for uploading GoLang Lambdas to AWS Cloud.

### II.a Create an AWS GoLang Lambda

We'll follow the documentation [AWS GoLang Lambda Documentation](https://docs.aws.amazon.com/lambda/latest/dg/golang-package.html) and add a shim for a wrapper around the `AWS CLI tool` so that our Go code can call the AWS CLI tool rather than using the aws-sdk. This is the path of least resistance as the aws cli already handles the management of user credentials and interaction with the AWS Service API's.

```json
> go get github.com/aws/aws-lambda-go/lambda
```

The trick is to use GO to run the AWS CLI through the GO code.
