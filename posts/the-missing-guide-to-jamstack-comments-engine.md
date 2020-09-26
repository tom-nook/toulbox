---
title: The Missing Guide to jamstack-comments-engine
description: Step by step guide to enabling comments on thetoulbox
date: 2020-09-19
tags:
 - web-dev
layout: layouts/post.njk
---

If you've searched for how to add comments to a static website or netlify website, chances are you found Phil Hawksworth's [jamstack-comments-engine repo](https://github.com/philhawksworth/jamstack-comments-engine)

And if you're reading this post then you are like me and are lost on how to use it to configure it for your static site.

I struggled for a few days to figure it out, so you don't have to. 

## Installing Project Dependencies 

From the root of your project directory use npm install to get the correct version of the dependencies for the project. 

`> npm install dotenv@8.2.0`
`> npm install gravatar@1.8.1`
`> npm install netlify-plugin-form-submissions@0.1.1`
`> npm install request@2.88.2`

## Environment Variables 

There are two environment variables that are needed `NETLIFY_AUTH_TOKEN` and `SLACK_WEBHOOK_URL`
 
### NETLIFY_AUTH_TOKEN

Is the same as setting up a [personal token](https://app.netlify.com/user/applications), name it whatever you want, and copy the value to a notepad/pages/word document.

![netlify-personal-access-token](../../img/netlify-personal-access-token.png)

### SLACK_WEBHOOK_URL

Now, head over to Slack and follow the directions for first [creating an app](https://slack.com/help/articles/115005265063-Incoming-webhooks-for-Slack) and then set up an incoming webhook. 

![how-to-create-incoming-webhook-for-slack](../../img/create-incoming-webhook-for-slack.png)

Go ahead and save the webhook url in the same doc as your netlify auth token.

#### Add ENV variables to Netlify 

Navigate to `https://app.netlify.com/sites/thetoulbox/settings/deploys#environment`, don't forget to swap out `thetoulbox` for your site name. 

Add, both the environment variables like so

![](../../img/add-environment-variables-to-netlify.png)

**DON'T** worry about adding the `AWS_LAMBDA_JS_RUNTIME` variable as it is not important. It was one of my tweaks for trying to get the comments to work and proved uneccessary.

## Project set up 

Have the following structure to your repo, it is fine to create the files without nothing in them and the same for the folders. 

```yaml
thetoulbox/ # repo. name
    - functions/
        - comment-section/
            - comment-action.js
        - comment-handler/
            - comment-handler.js
    - data/ 
        - comment.js 
    - _includes/
        - js 
            - validate.js
        - layouts 
            - base.njk
        - comment-form.njk
        - comments.njk
    - filters/ 
        - dates.js
    stub.md
    netlify.toml
```

#### Fill in comment-action.js

```javascript
'use strict';
var request = require("request");
// populate environment variables locally.
require('dotenv').config();
const {
  NETLIFY_AUTH_TOKEN
} = process.env;
// UPDATE: Add your websites URL here
const URL = "https://thetoulbox.com/";
/*
  delete this submission via the api
*/
function purgeComment(id) {
  var url = `https://api.netlify.com/api/v1/submissions/${id}?access_token=${NETLIFY_AUTH_TOKEN}`;
  request.delete(url, function(err, response, body){
    if(err){
      return console.log(err);
    } else {
      return console.log("Comment deleted from queue.");
    }
  });
}
/*
  Handle the lambda invocation
*/
exports.handler = function(event, context, callback) {
  // parse the payload
  console.log('Event: ', event.body)
  var body = event.body.split("payload=")[1];
  console.log('body: ', body);
  var payload = JSON.parse(unescape(body));
  console.log('payload: ', payload);
  var method = payload.actions[0].name;
  var id = payload.actions[0].value;

  if(method == "delete") {
    purgeComment(id);
    callback(null, {
      statusCode: 200,
      body: "Comment deleted"
    });
  } else if (method == "approve"){

    // get the comment data from the queue
    var url = `https://api.netlify.com/api/v1/submissions/${id}?access_token=${NETLIFY_AUTH_TOKEN}`;
    request(url, function(err, response, body){
      if(!err && response.statusCode === 200){
        var data = JSON.parse(body).data;
        // now we have the data, let's massage it and post it to the approved form
        var payload = {
          'form-name' : "approved-comments",
          'path': data.path,
          'received': new Date().toString(),
          'email': data.email,
          'name': data.name,
          'comment': data.comment
        };
        var approvedURL = URL;
        console.log("Posting to", approvedURL);
        console.log(payload);
        // post the comment to the approved lost
        request.post({'url':approvedURL, 'formData': payload }, function(err, httpResponse, body) {
          var msg;
          if (err) {
            msg = 'Post to approved comments failed:' + err;
            console.log(msg);
          } else {
            msg = 'Post to approved comments list successful.';
            console.log(msg);
            purgeComment(id);
          }
          var msg = "Comment registered. Site deploying to include it.";
          callback(null, {
            statusCode: 200,
            body: msg
          })
          return console.log(msg);
        });
      }
    });
  }
};

```

#### Fill in comment-handler.js 

```javascript
'use strict';
var request = require("request");

// populate environment variables locally.
require('dotenv').config()

// UPDATE: Add your websites URL here
const URL = "https://thetoulbox.com/";

/*
  Our serverless function handler
*/
exports.handler = function(event, context, callback) {

  // get the arguments from the notification
  var body = JSON.parse(event.body);

  // prepare call to the Slack API
  var slackURL = process.env.SLACK_WEBHOOK_URL
  var slackPayload = {
    "text": "New comment on " + URL,
	  "attachments": [
      {
        "fallback": "New comment on the comment example site",
        "color": "#444",
        "author_name": body.data.email,
        "title": body.data.path,
        "title_link": URL + body.data.path,
        "text": body.data.comment
      },
      {
        "fallback": "Manage comments on " + URL,
        "callback_id": "comment-action",
        "actions": [
          {
            "type": "button",
            "text": "Approve comment",
            "name": "approve",
            "value": body.id
          },
          {
            "type": "button",
            "style": "danger",
            "text": "Delete comment",
            "name": "delete",
            "value": body.id
          }
        ]
      }]
    };

    // post the notification to Slack
    request.post({url:slackURL, json: slackPayload}, function(err, httpResponse, body) {
      var msg;
      if (err) {
        msg = 'Post to Slack failed:' + err;
      } else {
        msg = 'Post to Slack successful!  Server responded with:' + body;
      }
      callback(null, {
        statusCode: 200,
        body: msg
      })
      return console.log(msg);
    });
}
```

#### Fill in netlify.toml

Tell netlify where to look for the lambda functions and add in the `netlify-plugin-form-submissions` plugin configuration

```toml
[build]
  functions = "functions"
# Config for the Netlify Build Plugin: netlify-plugin-form-submissions
[[plugins]]
  package = "netlify-plugin-form-submissions"
  [plugins.inputs]
    formNames = "approved-comments"
    dataDirectory = "_data"  
```

#### Fill in the local stub.md file 

This is a subtle gotcha, you'll need the following `stub.md` file so that a hidden approval-form is created for your site. 

```
<form name="approved-comments" netlify netlify-honeypot="full-name">
  <input type="text" name="full-name">
  <input type="text" name="path">
  <input type="text" name="received">
  <input type="text" name="name" id="name">
  <input type="email" name="email" id="email">
  <textarea name="comment" id="comment"></textarea>
</form>
```

#### Fill in comments.js 

```javascript 
// massage the approved comments data into the shape we'd like
// embelish the data with gravatars
const gravatar = require('gravatar');
const submissions = require('./approved-comments_submissions.json');
module.exports = () => {
  let comments = {};
  for(var i = 0; i < submissions.length; i++) {
      let entry = submissions[i]
      let comment = {
          name: entry.data.name,
          avatar: gravatar.url(entry.data.email, {s: '100', r: 'x', d: 'retro'}, true),
          comment: entry.data.comment.trim(),
          date: entry.data.received
      };
  // Add it to an existing array or create a new one in the comments object
  if(comments[entry.data.path]){
      comments[entry.data.path].push(comment);
    } else {
      comments[entry.data.path] = [comment];
    }
  }
  return comments;
};
```

#### Fill in validate.js 

```javascript 

// Mark a form element which needs a value.
function flagIfEmpty(input){
    if(input.value.length < 1) {
      input.classList.add("needs-content");
    }
  }
  
  
  // Add a submit handler to any forms.
  // Don't allow null submissions of required fields
  (function(){
    var forms = document.querySelectorAll('form');
    if(forms.length == 0){ return;}
  
    // do this for all forms on the page
    for (let f = 0; f < forms.length; f++) {
      forms[f].addEventListener('submit', function(event) {
        event.preventDefault();
        let form = event.target;
  
        // reset any flags
        var flags = form.querySelectorAll('.needs-content');
        for (let f = 0; f < flags.length; f++) {
          flags[f].classList.remove('needs-content');
        }
  
        // flag any fields which are missing input
        let inputs = form.querySelectorAll('input');
        for (let i = 0; i < inputs.length; i++) {
          flagIfEmpty(inputs[i]);
        }
        let text = form.querySelectorAll('textarea');
        for (let t = 0; t < text.length; t++) {
          flagIfEmpty(text[t]);
        }
  
        // abort if there are flagged fields (other than the honeypot)
        // otherwise we can submit.
        flags = form.querySelectorAll('.needs-content');
        if(flags.length > 1) {
          return false;
        } else {
          form.submit();
        }
      }, false);
    }
  })();
```

#### Fill in dates.js 

```javascript 
/*
  A date formatter filter for Nunjucks
*/
module.exports = function(date) {
    var month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    var ordinal = {
      1 : "st",
      2 : "nd",
      3 : "rd",
      21 : "st",
      22 : "nd",
      23 : "rd",
      31 : "st"
    };
    var d = new Date(date);
    return month[d.getMonth()] + " " + d.getDate() + (ordinal[d.getDate()] || "th") + " " +d.getUTCFullYear();
  }
```

#### Add to .eleventy.js 

```javascript 
const markdownIt = require("markdown-it");
const md = new markdownIt({
  html: true
});
// Add a dateDisplay filter  
  eleventyConfig.addFilter("dateDisplay", require("./filters/dates.js") );
  eleventyConfig.addFilter("markdown", (content) => {
    return md.render(content);
  });

```

#### Add to Base.njk 

Add [from line 87](https://github.com/llcranmer/toulbox/blob/7fa74e6d9d1391ea68b01dac82de484d9b75b033/_includes/layouts/base.njk#L87) to [line 98](https://github.com/llcranmer/toulbox/blob/7fa74e6d9d1391ea68b01dac82de484d9b75b033/_includes/layouts/base.njk#L98)


#### Add to comments.njk

Copy the whole [file](https://github.com/llcranmer/toulbox/blob/main/_includes/comments.njk)

#### Add to comment-form.njk

Copy the whole [file](https://github.com/llcranmer/toulbox/blob/main/_includes/comment-form.njk)
 
## Last tweaks 

Wow, that was a lot, don't worry we're almost through, at this point you can git push to your project and it should set up the `forms` plus the `functions`. 


### Create Netlify Deploy Hook 

![netlify-deploy-hook](../../img/build-hook.png)

### Configure Settings > Forms > Notifications 

#### handler form

![handler-form-notification](../../img/handler-form-notification.png)

#### build hook form

![build-hook-form](../../img/build-hook-form.png)

### Add Slack Interactivity 

![slack-interactivity-api](../../img/slack-interactivity-api.png)



In this guide I'll show the exact steps that were followed to enable moderated comments for thetoulbox.com.

dependencies 
    - package.json

configuration
    - netlify.toml

- functions
    - lambdas
    - other funcs

- stub files 
    - *.json
    - *.md

setting up slack
    - creating an app

setting up forms
    - hooks as triggers 

setting up environment variables
    - get netlify token
    - get slack webhook
    - set slack request url 
    - https://api.slack.com/apps/A01AYFTCWMU/interactive-messages
    - https://api.slack.com/apps/A01AYFTCWMU/incoming-webhooks?