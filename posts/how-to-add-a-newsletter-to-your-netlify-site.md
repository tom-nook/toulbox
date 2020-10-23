---
title: How to add a newsletter to your Netlify static site
description: How to add a newsletter subscription to your site using only buttondown.email and a Netlify function 
image: https://source.unsplash.com/Mwuod2cm8g4/800x600
date: 2020-10-22
tags:
 - Netlify
 - software-engineering
layout: layouts/post.njk
---

<!-- Excerpt Start -->
In this post, I'll show exactly how to create a newsletter for your site and enable users to sign up via a popup as they read the article. Because creating a newsletter for a static website on Netlify or any platform can be quite challenging since there are no servers involved.
<!-- Excerpt End -->

## What we're creating 

I'll show how to create a popup form that will enable users to sign-up for the Newsletter. It'll activate once the visitor to the site has read a certain amount of the post. In this case, it'll be the **ToulTip Newsletter**, but the code will work for any newsletter.

![](../../img/thetoulbox-subscription-pop-up-box.png)


### 1. Sign Up for buttondown.email

There are several options out there, ranging from managed like [Mailchimp.com](https://mailchimp.com) to fully self-hosted and self-managed [Sendy.co](https://sendy.co). But, what I wanted was one that was in between, reasonably priced, and had excellent customer service. And for me, that choice is [buttondown.email](https://buttondown.email/register), which provides an API endpoint to hit for enrolling new subscribers!

Signing up is easy, and the rate plan works for me. It's free for your first thousand and costs just $5 extra per 1000 added, which is perfect for my use case.

![](../../img/thetoulbox-sign-up-for-buttondown-email.png)

After you have registered your account, navigate to https://buttondown.email/settings, and set up your Newsletter. Don't worry. You can go back and change any of the settings later, so don't feel that you must fill in the fields with precisely the correct copy for your Newsletter. 

![](../../img/thetoulbox-settings-for-buttondown-email-newsletter.png)



Make sure to copy your API key as it will be needed for the next step.

### 2. Create your Subscribe Form 

Netlify is smart enough to know whenever you have created a form by simply adding `netlify` to the form tag. Make sure to include the `netlify-honeypot` section because it prevents spambots from wasting your form submissions, which is a concern as you only get **100 free** form submissions Netlify a month before needing to upgrade to the pro plan. And in general, it is a concern for any site that has forms on it. It is an excellent freebie from Netlify so that you don't have to figure out how to handle it (usually having a captcha). The form name will be the same name shown in the Netlify console, so if you prefer a different name, then that is the piece to change. 

The method section represents the type of HTTP method used whenever the form is submitted via the `subscribe` button. 

There are only two types of ways that can be used with Netlify; POST and GET. 

We'll be using the  POST HTTP method makes the most sense since the form will be using a Netlify function to submit the data to the `buttondown.email` API.

 Lastly, the `action` portion of the form will function as the redirect, which will send the user to the `success.html` page for the site. **HINT** If you don't have a `success.html` page, you can create or redirect it back to the home page. However, I think the user experience should see that they've submitted their data and a second step for them to do (confirm subscription via e-mail).

```html
<div id="popup" class="bottomMenu hide">
 <form name="subscribe" netlify-honeypot="full-name" method="POST" action="/success" netlify>
 <h4>Like what you're reading so far?</h4>
 <p>
 Then subscribe to the ToulTip Newsletter to get advice for
 Software Engineering, DevOps, and the Cloud each Monday.
 </p>
 <p class="honey">
 <input name="path" type="hidden" value="{{ page.url }}">
 <label>Your full name: <input name="full-name"></label>
 </p>
 <p>
 <input type="text" name="name" id="name" placeholder="Your name">
 </p>
 <p>
 <input type="email" name="email" id="email" placeholder="Your email">
 </p>
 <p>
 <button type="submit" class="btn">Subscribe</button>
 </p>
 </form>
</div>
```

### 3. Create your Netlify Submission function

Netlify also makes the creation of AWS Lambda functions incredibly easy. All that needs to be done is (1) create a `functions` folder within the repo and (2) add the following to your `netlify.toml` file. Also, to keep our API keys secret and separate from the codebase, we use `require("dotenv").config`, which will go and obtain the `environment variable` from Netlify. So make sure to install it if it is not already present within your `package.json` file. 

`> npm install dotenv@8.2.0`


```toml
[build]
 functions = "functions"
```

```js
// submission-created.js
require("dotenv").config()
const fetch = require("node-fetch")
const { BUTTONDOWN_API_KEY } = process.env

exports.handler = async event => {
 const payload = JSON.parse(event.body).payload
 console.log('payload: ', payload)
 console.log(`Recieved a submission: ${payload.email}`)

 return fetch("https://api.buttondown.email/v1/subscribers", {
 method: "POST",
 headers: {
 Authorization: `Token ${BUTTONDOWN_API_KEY}`,
 "Content-Type": "application/json",
 },
 body: JSON.stringify({ email: payload.email, name: payload.name }),
 })
 .then(response => response.json())
 .then(data => {
 console.log(`Submitted to Buttondown:\n ${data}`)
 })
 .catch(error => ({ statusCode: 422, body: String(error) }))
}
```

### 4. Add your BUTTONDOWN_API_KEY to Netlify environment variables 

Navigate to `https://app.netlify.com/sites/<YOUR_SITE_NAME>/settings/deploys#environment` to add the API key from step 1.

![thetoulbox-add-environment-variable-to-netlify](../../img/thetoulbox-add-environment-variable-netlify.png)

### 5. Git Push 

Now that all the pieces have been laid out, it is time to push the code so that Netlify will create the `submission-created` lambda and the `subscribe` form. 

#### Form created 

![](../../img/thetoulbox-netlify-view-forms.png)

#### Netlify Function created 

![](../../img/submission-created-js-netlify-function.png)



### 6. Add the popup.js code to your website

To enable the popup we'll be using a CSS animation trick with JS to change the `<div>` that houses the `<form>` from `bottomMenu hide` to `bottomMenu show`. Which is going be two separate CSS classes 

#### CSS 

Add the Following CSS to wherever your CSS is stored for your site. 
```css
.bottomMenu {
 position: fixed;
 bottom: 0;
 left: 0;
 max-height: auto;
 max-width: 300px;
 background: #888;
 border-radius: 4px;
 z-index: 1;
 transition: all 1s;
}
.hide {
 opacity: 0;
 left: -100%;
}
.show {
 opacity: 1;
 left: 0;
}

```

#### <div> tag wrapped around form

Make sure to wrap the `subscribe form` with a `div` tag with the `class="bottomMenu hide"`.

```html
<div id="popup" class="bottomMenu hide">
 <form name="subscribe" netlify-honeypot="full-name" method="POST" action="/success" netlify>
 <h4>Like what you're reading so far?</h4>
 <p>
 Then subscribe to the ToulTip Newsletter to get advice for
 Software Engineering, DevOps, and the Cloud each Monday.
 </p>
 <p class="honey">
 <input name="path" type="hidden" value="{{ page.url }}">
 <label>Your full name: <input name="full-name"></label>
 </p>
 <p>
 <input type="text" name="name" id="name" placeholder="Your name">
 </p>
 <p>
 <input type="email" name="email" id="email" placeholder="Your email">
 </p>
 <p>
 <button type="submit" class="btn">Subscribe</button>
 </p>
 </form>
</div>
```


#### JS function 

The Javascript function gets the <div> element by its `id`, which is named `popup`. You can call it whatever you want. Just make sure to change the code. 

Now, `y` is the variable that is storing the value of the screen's verticle point, so that whenever the user scrolls past 3000 pixels and before 5000 pixels, the box will pop up asking the reader if they'd like to subscribe to the Newsletter. 

The idea behind this is that if the reader is scrolling slowly (reading) the article, then they are interested and might be more likely to subscribe, rather than spamming the reader as soon as the open the post or waiting until the very end of the article to ask with a static box (most readers don't read all the way to the end)

```js
myID = document.getElementById("popup");
var myScrollFunc = function() {
 var y = window.scrollY;
 if (y > 3000 && y < 5000) {
 myID.className = "bottomMenu show"
 } else {
 myID.className = "bottomMenu hide"
 }
};
window.addEventListener("scroll", myScrollFunc);
```

### 7. Test that it all works 

![](../../img/thetoulbox-verified-submissions.png)

![](../../img/thetoulbox-view-submissions-to-form.png)

![](../../img/verify-user-added-to-buttondown-email.png)

