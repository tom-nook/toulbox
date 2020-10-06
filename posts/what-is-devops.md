---
title: What is DevOps?
description: DevOps has become common practice in many organizations but What is DevOps exactly? In this post an Industry DevOps Engineer shares their thoughts.
image: https://source.unsplash.com/jHZ70nRk7Ns/800x600
date: 2020-09-26
tags:
 - azure-devops
layout: layouts/post.njk
---

## What is DevOps Engineer

<!-- Excerpt Start -->
I started in a Developer and Operations (DevOps) role upon graduation, which is not the typical trajectory. Because at the time I was the least experienced member on the team as the rest of the team had 4-5+ years of industry experience on average. 
<!-- Excerpt End -->
After, being in DevOps for a couple of years the path to becoming a DevOps Engineer seems to be; be a software engineer for a year or two and be interested in learning about automation of processes. 

However, I was able to get into DevOps by focusing on it while in undergrad and seeking out internships specifically for it. 

As a DevOps Engineer, here is what DevOps means to me.

> "DevOps is the culture of automating as much as the work flow of Development and Operations as possible"

## Not DevOps 

To better understand let's establish what a culture on Not DevOps looks like in an organization. 

Suppose, we're at a fortune 500 company like Dunder Mifflin Paper Company and the leaders decide they want to build a new web application to take paper orders.

Here's what the workflow might look like

### High-Level Overvew 

(1) Developer write and push code to SVN -> (2) Code is tested by QA / Security -> (3) Code is Deployed -> (4) Users visit website 

### Azure - Technical Example 

We'll use the free Azure App Service to deploy a Python Django Web App

#### 1.) Devs Write code -> Example App

For the dev's write code we'll save time and use a premade example clonable here:

`> git clone https://github.com/Azure-Samples/python-docs-hello-django`

#### 2.) Code is tested by QA / Security -> Assume done for example

QA/Security are typically separate teams so we'll assume that our app has been tested and is relatively bug free. 

#### 3.) Code is Deployed -> Deploying the Code with Azure CLI

The code needs to run somewhere else other than our local laptop. So we'll deploy our code to a server (computer) in the Azure Cloud.  Luckily, Azure has made it simple to deploy code to their infrastructure. 

##### 3.a.) Install the Azure CLI 

- [How to Install Azure CLI per OS](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)


##### 3.b.) Login 

`> az login`

##### 3.c.) Deploy the App

`> az webapp up --sku F1 --name Dunder-Mifflin-Paper-Company`

#### 5.) User Visits Site

`https://dunder-mifflin-paper-company.azurewebsites.net`


#### 6.) Single Change at a Time

Now, our Developers and Operations are satisfied at Dunder Mifflin Paper Company, but one of the bosses notices that the Web App only says "Hello World" and has no other features. So they want it to say at the bare minimum "Dunder Mifflin Paper Company -- Online Orders Coming Soon!"

##### 6.a) Integrate a change

So, we make a change...

```python 
# python-docs-hello-Django/django_hello/hello/views.py
from django.http import HttpResponse
from django.shortcuts import render

def hello(request):
    return HttpResponse("Dunder Mifflin Paper Company-- Online Orders Coming Soon!")

```

and push the code to the SVN. 



##### 6.b) Redeploy Code

`> az webapp up`


#### 7.) Multiple Changes at a Time

Dunder Mifflin realizes that they need more than just an intern to get the features they want so they hire other interns.

Now, the original intern who started the project needs to figure out how to deploy changes. They think that they'll have the other interns make PR's on the Repo and whenever the merge to the Main branch happens then they'll take the time to Deploy the app for them.

Hence, the original intern is now doing both Development and Operations for the team. They are the beginnings of a DevOps Engineer. 

#### 8.) It Breaks and Causes Customer Outage 

Uh-Oh the Code being deployed to production has a few bugs and now the Original intern needs to Revert to a previous version of the code--so they do, and then they redeploy the code. 

However, the entire process takes several hours due to unforeseeable technical difficulties. The Customers aren't happy and choose to buy their paper from **Michael Scott Online Paper Company** and the bosses really aren't happy to lose customers and money.

The sort-of DevOps Engineer says 

> "Hey, let's try full DevOps to automate the continuous integration and continuous deployment of the code so that there's not a human element aka me"


## DevOps Example

To better understand DevOps we'll set-up a Continuous Integration / Continuous Deployment (CI/CD), which is the automation of the (1) Developer write and push code to SVN -> (2) Code is tested by QA / Security -> (3) Code is Deployed.

### CI

Points (1) and (2)

### CD 


Points (3) 

To get an understanding of DevOps we'll use Azure DevOps so head on over for a free account.

Prerequsite: Setting up Azure DevOps Account

1.) [free account](https://go.microsoft.com/fwlink/?LinkId=2014881&campaign=acom~azure~devops~services~main~hero&githubsi=true&clcid=0x409)

2.) click sign in with github if you have a github account.

3.) click Authorize Microsoft-corp

4.) Enter Access code

5.) Sign in with github

6.) click continue with **Get started with Azure DevOps**

7.) Set Up an Example Project

### DevOps Example - Workflow Automation 

#### What is the DevOps tools?

### DevOps Example - Operations Automation

#### What is the DevOps tools?




What is devops and how it works?

What is DevOps Engineer

DevOps vs Agile 

## Images 

![azure-devops-backlog-move-to-doing](../../img/azure-devops-backlog-move-to-doing.png)
![azure-devops-backlog-move-to-done](../../img/azure-devops-backlog-move-to-done.png)
![azure-devops-check-velocity](../../img/azure-devops-check-velocity.png)
![azure-devops-clone-repo](../../img/azure-devops-clone-repo.png)
![azure-devops-create-backlog](../../img/azure-devops-create-backlog.png)
![azure-devops-create-child-task](../../img/azure-devops-create-child-task.png)
![azure-devops-create-epic](../../img/azure-devops-create-epic.png)
![azure-devops-pipeline-see-build](../../img/azure-devops-pipeline-see-build.png)
![azure-devops-pipeline-select-commit-and-run](../../img/azure-devops-pipeline-select-commit-and-run.png)
![azure-devops-pipeline-select-default-yaml](../../img/azure-devops-pipeline-select-default-yaml.png)
![azure-devops-pipeline-select-django-linux-app](../../img/azure-devops-pipeline-select-django-linux-app.png)
![azure-devops-pipeline-select-subscription](../../img/azure-devops-pipeline-select-subscription.png)
![azure-devops-pipeline-successful-build](../../img/azure-devops-pipeline-successful-build.png)
![azure-devops-see-pipelines](../../img/azure-devops-see-pipelines.png)