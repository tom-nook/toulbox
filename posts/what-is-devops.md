---
title: What is DevOps?
description: DevOps has become common practice in many organizations, but What is DevOps exactly? In this post, an Professional DevOps Engineer shares their thoughts.
image: https://source.unsplash.com/jHZ70nRk7Ns/800x600
date: 2020-10-08
tags:
 - azure-devops
layout: layouts/post.njk
---

## What is DevOps Engineer

<!-- Excerpt Start -->
The DevOps Engineer role is a relatively new role that has come into existence during the past decade in I.T. and seems hard to define.

Part of what makes the position challenging to understand is that it is continually changing due to new technologies.

However, a good start at understanding it is to realize that it is a mix of several different roles; software engineer, sysadmin, network engineer, and more.

Of the roles, the two with the most massive influence are software engineering and sysadmin. I think the  Dev piece of DevOps is Software Engineering, and the Ops is sysadmin.

With that mindset, then the following will make sense.

> A DevOps Engineer is responsible for building software that automates the developer experience and sysadmin responsibilities.

This post demonstrates what a DevOps engineer does and what DevOps culture is and isn't using Azure and Azure DevOps.
<!-- Excerpt End -->

### Skillset

Typically a DevOps Engineer has the following experience with technology:

- Containers like Docker
- Container Orchestration like Kubernetes
- Infrastructure as Code like Terraform
- Configuration of Servers through code like Ansible, Puppet, Salt, or Packer
- Proficiency in a programming language like Python or G.O.
- Familiarity with shell scripting awk/bash
- Familiar with Linux and User Management
- Networking
- Software Development
- Familiarity with a cloud host provider like AWS, GCP, Azure, Digital Ocean, etc.

## Not DevOps

To better understand, let's establish what a culture of Not DevOps looks like in an organization.

### Dunder Mifflin Paper Company

Suppose we're at a Fortune 500 company like Dunder Mifflin Paper Company. The leaders decide they want to build a new web application to take paper orders. And you have been hired as a fresh graduate of a Bootcamp or college to make it happen. So you get work, which might look like this.

(1) You write and push code to GitHub -> (2) Code is tested by QA / Security -> (3) Code is Deployed -> (4) Users visit website

Let's look at a technical example to understand the workflow better.

### Azure - Technical Example

We'll use the free Azure App Service to deploy a Python Django Web App.

#### (1) Your code has been written and pushed to GitHub

So go ahead and clone it.

`> git clone https://github.com/Azure-Samples/python-docs-hello-django`

#### (2) Code is tested by QA / Security

Q.A. and Security are typically separate teams, so we'll assume that our app has been tested and is relatively bug-free.

*** N.B.** In advanced use cases of DevOps, QA and Security are automated as well.

#### (3) Code is Deployed

The code needs to run somewhere else other than our local laptop. Otherwise, not very, many people will be able to visit the site. So we'll deploy our code to a server (computer) in the Azure Cloud. Luckily, Azure has made it simple to deploy code to its infrastructure. Don't worry. Everything that we do will be within the **free tier**.

##### 3.a.) Install the Azure CLI

First, find your Operating System and follow the instructions to install the Azure CLI tool.

- [How to Install Azure CLI per O.S.](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)


##### 3.b.) Login

Use your terminal.

`> az login`

##### 3.c.) Deploy the App

Change into the app directory that you cloned earlier and run the Azure web app up command.

`cd dunder-mifflin-paper-company`
`az webapp up --sku F1 --name Dunder-Mifflin-Paper-Company`


#### 5.) User Visits Site

After several minutes you should see something like this.

```yaml
(Azure) toul@Touls-MacBook-Pro dunder-mifflin-paper-company % az webapp up
The webapp 'Dunder-Mifflin-Paper-Company' doesn't exist
Creating Resource group 'touldeguiacranmer_rg_Linux_centralus' ...
Resource group creation complete
Creating AppServicePlan 'touldeguiacranmer_asp_Linux_centralus_0' ...
Creating webapp 'Dunder-Mifflin-Paper-Company' ...
Configuring default logging for the app, if not already enabled
Creating zip with contents of dir /Users/toul/code/python/dunder-mifflin-paper-company ...
Getting scm site credentials for zip deployment
Starting zip deployment. This operation can take a while to complete ...
Deployment endpoint responded with status code 202
You can launch the app at http://dunder-mifflin-paper-company.azurewebsites.net
{
 "URL": "http://dunder-mifflin-paper-company.azurewebsites.net",
 "appserviceplan": "touldeguiacranmer_asp_Linux_centralus_0",
 "location": "centralus",
 "name": "Dunder-Mifflin-Paper-Company",
 "os": "Linux",
 "resourcegroup": "touldeguiacranmer_rg_Linux_centralus",
 "runtime_version": "python|3.7",
 "runtime_version_detected": "-",
 "sku": "FREE",
 "src_path": "//Users//toul//code//python//dunder-mifflin-paper-company"
}
```

As shown, the URL to visit the site is `https://dunder-mifflin-paper-company.azurewebsites.net`, which will load a "Hello" in the web browser.


#### End of Developer and Operations Workflow

The workflow piece is probably easier to identify as the coding portion + pushing to GitHub. Whereas, the Operations workflow is slightly trickier since we used Azure to handle a majority of it. Under the hood, Azure Handled the following things for us:

- Configuration of Server
 - Machine Image
 - Set up Dependencies (Python version, Operating system, etc.)
 - Defined and put into a Resource Group
 - Opened port 443 for connections
 - Defined and put Security Group
 - Created and attached an SSL security certificate for HTTPS connections
- Logging
 - Set up for us

Which is sufficient for this use case of learning or a small project.

## Another Iteration of Developer and Operations Workflow

#### 1.) Single Change at a Time

Whoot, we've gotten started on the project for the Dunder Mifflin Paper Company. Still, one of the bosses notices that the Web App only says "Hello World" and has no other features. So they want it to speak at the bare minimum, "Dunder Mifflin Paper Company -- Online Orders Coming Soon!". So they add it as a work item for us to do.

##### 1.a) Integrate a change

So, we make the change, which is simple.

```python
# python-docs-hello-Django/django_hello/hello/views.py
from django.http import HttpResponse
from django.shortcuts import render

def hello(request):
 return HttpResponse("Dunder Mifflin Paper Company-- Online Orders Coming Soon!")
```

and push the code to the GitHub

##### 1.b) Redeploy Code

`> az webapp up`

#### 2.) Multiple Changes at a Time

Dunder Mifflin realizes that they need more than just one person to get the features they want. The leaders decide to hire another I.T. person.

Now, you, who started the project, need to figure out how to deploy changes. You'll have the new person make P.R.'s on the repo, and whenever the merge to the Main branch happens, you'll pull the changes and run the deployment.

Hence, now you're doing both Development and Operations for the team; technically, you were before, but now you have someone other than yourself that you're deploying code. You're starting to become a DevOps Engineer.

A few months pass by, and progress is slow, so Dunder Mifflin Paper Company decides to hire 10 I.T. Workers from all around the world for 24/7 development time.

Uh-oh. Now, your job is to monitor the code base for merges to the Main branch continuously. You decide to set up a chat and tell other Developers to message you whenever they merge to the Main branch. You're soon receiving pings at all times at night and day since now you support two different timezones.

You fall behind.


#### 3.) It Breaks and Causes Customer Outage

Messy code is deployed to production and has a few bugs. Now you need to Revert to a previous version of the code--so you do, and then redeploy the code.

But, the entire process takes several hours due to unforeseeable technical difficulties. Customers aren't happy and choose to buy their paper from **Michael Scott Online Paper Company**. The bosses aren't content to lose customers and money.

You get yelled at by the bosses. The other developers say it was *not* their fault because they do *business logic*. You are in charge of the **Operation** of production and ** Developer's workflow**. The other developers argue they could've got their *hotfix* out faster if you hadn't made the process so complicated (remember that chat option?).

Understandably, you're irate. You think to yourself,

> *How are am I supposed to make sure no messy code makes it to production? And if it does that, it is simple to revert to a previous working version? How am I suppose to handle so many requests to merge to the Main branch? How am I supposed to test that the code doesn't have bugs?*

So, you go online and learn about DevOps and convince the bosses to spend yet more money on the project, in the form of DevOps training. After attending training, you know about the following big ideas:

### Continuous Integration (CI)

Rather than having your chatbox blown up day and night, you learn about this idea of having a service listen (poll) the GitHub Repository for changes. In particular, whenever a change concerns the *Main branch*, it takes **action**. It runs the test suite to test that the code doesn't have any bugs. And if it passes, it allows the Developers to merge to the Main branch **without your approval.

### Continuous Deployment (CD)

Rather than pulling the code and running `az webapp up` from your terminal, it is done automatically upon a successful merge to the Main branch. It then deploys to the Dev Environment, and if that goes well, it gets deployed to production. Else it fails, and the Developers are issued a bug to go and fix the code.

## DevOps Example

Now that we've seen what DevOps doesn't look like, let's see what it could like at an org. Because you've had a good experience thus far with Azure, you decide to check out Azure DevOps, an all-in-one package.

**Prerequisite:** Setting up Azure DevOps Account

1.) [Sign up for a free account](https://go.microsoft.com/fwlink/?LinkId=2014881&campaign=acom~azure~devops~services~main~hero&githubsi=true&clcid=0x409)

2.) click sign in with GitHub if you have a GitHub account.

3.) click Authorize Microsoft-corp

4.) Enter Access code

5.) Sign in with Github

6.) click continue with **Get started with Azure DevOps**

7.) Set Up an Example Project

### DevOps Example - CI


#### 1.) Import Repo

First, it is necessary to let Azure DevOps know about your Repository, connecting the two by using the import feature.
![azure-devops-clone-repo](../../img/azure-devops-clone-repo.png)

#### 2.) Go to pipelines

Now that it has been imported, set up a *pipeline service* to listen to the repo.

##### 2.a Select the Django Linux Web App

![azure-devops-pipeline-select-django-linux-app](../../img/azure-devops-pipeline-select-django-linux-app.png)

##### 2.b Select your subscription (it's FREE)

![azure-devops-pipeline-select-subscription](../../img/azure-devops-pipeline-select-subscription.png)

##### 2.c Select the Default YAML template

![azure-devops-pipeline-select-default-yaml](../../img/azure-devops-pipeline-select-default-yaml.png)

#### 3.) Run the pipeline

Run the pipeline one time to complete the process of setting it up.

![azure-devops-pipeline-select-commit-and-run](../../img/azure-devops-pipeline-select-commit-and-run.png)

### DevOps Example - CD

Again like with the az CLI tool, all of the deployment is done for you, but the difference is now any merge to the Main branch will trigger a deployment, regardless of *who* does it.

However, it is handy to be aware of the following pages for debugging and ensuring that it is functional.

#### 1.) View Pipelines

To see all of the pipelines in your organization.

![azure-devops-see-pipelines](../../img/azure-devops-see-pipelines.png)

#### 2.) View Status

To view the status of a build and deployment.
Vital, use here is for the logs whenever either one of the two fails.

![azure-devops-pipeline-see-build](../../img/azure-devops-pipeline-see-build.png)

#### 3.) Build is successful

What we want our pipeline to look like, if it is green, then it means that none of the new code has broken anything at the code level (syntax/compilation). But unless there is QA integrated into the pipeline or tests, it will not tell us if the code's behavior is broke from the proposed new changes.

![azure-devops-pipeline-successful-build](../../img/azure-devops-pipeline-successful-build.png)

### DevOps Example - Agile / SCRUM Operations

The code is automatically flowing from local Developers' computers to the computers in the cloud. Productivity is through the roof. But there are too many work items to be kept track of, and some are dependent on other things. Deadlines start to fail since hotfixes are happening more and more.

Since you've been responsible for increasing productivity, management asks if you can sort out the problem of keeping up with work and deadlines. You go back to the internet and research ways to be more efficient and learn about SCRUM / Agile. You realize that SCRUM is a way of organizing work derived from the Agile method and is part of the DevOps mindset.

#### SCRUM Powered by Fibonacci Numbers

The Fibonacci number sequence is the way of generating a series of numbers by following a pattern. The pattern is to sum the current number with the previous to develop the next.

Example:
0, 1, 1, 2, 3, 5, 8, 13, 21 and so on.

The idea is to measure work using the above numbers rather than to think about the time in hours. The reasoning behind it is that humans are imperfect at estimating how long something will take but aren't so bad at measuring how big a task is. Typically the measurement units are mapped to some physical equivalent--t-shirt sizes being popular.

**Effort Chart**
1 - XS
2 - SM
3 - MED
5 - LG
8 - XL
13 - XXL
21 - XXL

But it can be anything.

1 - Chihuahua
2 - Dachund
3 - Shnauzer
5 - Labrador
8 - Pitbull
13 - Rottweiler
21 - Great Dane


Thankfully, Azure DevOps has built-in features to make the process scalable for a team, so we'll use it to demonstrate.

#### 1.) Create a backlog (a to-do list)

A backlog is a collection of all the work items assigned to your team from the people who want you to build them something.

So,  create one.

![azure-devops-create-backlog](../../img/azure-devops-create-backlog.png)

#### 2.) Create  Epic(s) - Big Work Item(s)

An Epic is a big task of size 13 or 21. One of the work items assigned to the team is to build an online store, which is a big ask. So it becomes an Epic.

![azure-devops-create-epic](../../img/azure-devops-create-epic.png)

#### 3.) Create child tasks - Break Down the Big Work Item(s)

Child tasks are subtasks associated with the Epic. And can vary in measurement but typically are smaller than 5. Some examples of what might make sense for an online store:

- display items
	- size: 1
- display item prices
	- size: 1
- create item database and records
	- size: 3
- create storage for item pics
	- size: 1
- create cart
	- size: 5

![azure-devops-create-child-task](../../img/azure-devops-create-child-task.png)


#### 4.) Backlog to track work

As work happens, a task board shows who is committed to doing and what has been done.

![azure-devops-backlog-move-to-doing](../../img/azure-devops-backlog-move-to-doing.png)
![azure-devops-backlog-move-to-done](../../img/azure-devops-backlog-move-to-done.png)

#### 5.) Daily Stand-Up

Each day the team will meet for no more than 15 mins to discuss what they did yesterday, what they're doing today, and if there are any blockers. It is to ensure that the team can help each other out and identify any dependencies on work.

#### 6.) Sprint and Increments to  Measure Velocity

The sum of all the effort points from the done column over the period it took to do them is the velocity. The measurement of time is usually done by having Sprints with increments. A sprint is a lengthier period than an increment. For example, Sprint 1 is from January to March, and within it has 2-week increments; 6 increments to be exact.

So, during the start of each increment, the team will go through setting out the 'to-do' list, then committing to doing them, and then moving to Done. At the end of each increment, the velocity is measured.

##### Example:
The team has 200 pts of effort in the Done column from increment 1, and increment 1 is ten days (business days). Therefore, the velocity is

200 pts / 10 days => 20 pts / day.

#### 7.) Weekly Reflection

Now, before the next week begins, a discussion happens around what went well and what didn't go well so that the velocity can increase.

![azure-devops-check-velocity](../../img/azure-devops-check-velocity.png)

### Conclusion

I hope that both the questions of *What is DevOps?* and *What a DevOps Engineer is?*, has become more apparent. Please, leave me a comment if any point is unclear.




