---
title: Use ahrefs' tool to Boost your Static Site's SEO Performance
description: 
image: https://source.unsplash.com/bzK0qeeoBJo/800x600
date: 2020-09-26
tags:
 - SEO
 - software-engineering
layout: layouts/post.njk
---

<!-- Excerpt Start -->
The [ahrefs.com](https://ahrefs.com/dashboard) Is a popular SEO tool that was only available for pay but now has been made available for free with a smaller feature set. However, even though it is a smaller set, it is still a whopping 100+ checks. 

*[full check list included at end of article for reference](#full-check-list)
<!-- Excerpt End -->

## The Toul Box Scan Results 

That amount of checks can be overwhelming, and more than likely, the ahref scan will show you something you've missed. Here's what mine showed: 

![the-toulbox-ahref-seo-scan](../../img/the-toulbox-ahref-scan-results.png)

I was shocked because I selected the [eleventy-high-performance-blog](https://github.com/google/eleventy-high-performance-blog) for high-performance, but that does not include SEO. 

The template can only do so much. Most of the *issues* in the site report are related to that I control; metadata, title length, alt text for images, image sizes, etc.

I think it is worth trying to see how search engines view your website, so here's how to set it up and run your first few scans. 

### 1. Create a Project 

Head over to [ahrefs.com](https://ahrefs.com) and enter your domain name. 

![enter-domain-name-into-the-bar](../../img/type-in-your-domain-name-the-toulbox.png)

### 2. Import your project 

Add your project I chose to do it manually because I have not registered my site in the Google Search Console. If you have, then go ahead and select it.

![the-toulbox-sign-up-for-ahref-account](../../img/add-project-manually-the-toulbox.png)

### 3. Verify Ownership

Show that you are the site owner in one of four ways. I chose to add a tag to the header portion of my home document because it is the easiest for me. I'd recommend choosing whichever one you're most familiar.

![the-toulbox-verify-domain-ownership](../../img/verify-domain-ownership-of-the-toulbox.png)

### 4. Run a Scan 

Start a scan and wait around 1-5 mins for it to complete. Subsequent runs should only take roughly 1-3 mins since the data is cached. Meaning that only new pages are scanned.

![the-toulbox-sign-up-for-ahref-account](../../img/the-toulbox-starting-site-crawl.png)

### 5. Schedule scans

If you want to make sure that subsequent changes to your site do not impact your SEO then schedule a scan to run once a week or whatever your change frequency is for your site. 

![the-toulbox-sign-up-for-ahref-account](../../img/schedule-daily-crawls-the-toulbox.png)

### 6. Analyze Results and Address them 

Now that you have the results, you can go through and make the suggested changes. If you're like me and had issues with title length and metadata length, then you might find [wordcounter.net](https://github.com/google/eleventy-high-performance-blog) useful as you work. 

![the-toulbox-sign-up-for-ahref-account](../../img/ahref-the-toulbox-dashboard.png)


## Full Check List

Here's the full 100+ checklist that AHREF uses to calculate your site's SEO ranking on the free plan. 

### Internal pages

- 404 page 
- 4XX page 
- 500 page 
- 5XX page 
- HTTPS/HTTP mixed content 
- Timed out 

#### Indexability

- Canonical from HTTP to HTTPS 
- Canonical from HTTPS to HTTP 
- Canonical points to 4XX 
- Canonical points to 5XX 
- Canonical points to redirect 
- Nofollow in HTML and HTTP header 
- Nofollow page 
- Noindex and nofollow page 
- Noindex follow page 
- Noindex in HTML and HTTP header 
- Noindex page 
- Non-canonical page specified as canonical one 

### Links

#### Indexable

- Canonical URL has no incoming internal links 
- HTTP page has internal links to HTTPS 
- HTTPS page has internal links to HTTP 
- Orphan page (has no incoming internal links) 
- Page has links to broken page 
- Page has links to redirect 
- Page has no outgoing links 
- Page has nofollow and dofollow incoming internal links 
- Page has nofollow incoming internal links only 
- Page has nofollow outgoing internal links 
- Page has only one dofollow incoming internal link 
- Redirected page has no incoming internal links 

#### Not indexable

- HTTP page has internal links to HTTPS 
- HTTPS page has internal links to HTTP 
- Orphan page (has no incoming internal links) 
- Page has links to broken page 
- Page has links to redirect 
- Page has no outgoing links 
- Page has nofollow and dofollow incoming internal links 
- Page has nofollow incoming internal links only 
- Page has nofollow outgoing internal links 
- Page has only one dofollow incoming internal link 
- Redirected page has no incoming internal links 

### Redirects

- 302 redirect 
- 3XX redirect 
- Broken redirect 
- HTTP to HTTPS redirect 
- HTTPS to HTTP redirect 
- Meta refresh redirect 
- Redirect chain 
- Redirect loop 

### On page

#### Indexable

- H1 tag missing or empty 
- Low word count 
- Meta description tag missing or empty 
- Meta description too long 
- Meta description too short 
- Multiple H1 tags 
- Multiple meta description tags 
- Multiple title tags 
- Title tag missing or empty 
- Title too long 
- Title too short 

#### Not indexable

- H1 tag missing or empty 
- Low word count 
- Meta description tag missing or empty 
- Meta description too long 
- Meta description too short 
- Multiple H1 tags 
- Multiple meta description tags 
- Multiple title tags 
- Title tag missing or empty 
- Title too long 
- Title too short 

### Social tags

- Open Graph tags incomplete 
- Open Graph tags missing 
- Open Graph URL not matching canonical 
- Twitter card incomplete 
- Twitter card missing 

### Duplicate content

- Duplicate pages without canonical 

### Localization

- Hreflang and HTML lang mismatch 
- Hreflang annotation invalid 
- Hreflang defined but HTML lang missing 
- Hreflang to non-canonical 
- Hreflang to redirect or broken page 
- HTML lang attribute invalid 
- HTML lang attribute missing 
- Missing reciprocal hreflang (no return-tag) 
- More than one page for same language in hreflang 
- Not all pages from hreflang group were crawled 
- Page referenced for more than one language in hreflang 
- Self-reference hreflang annotation missing 
- X-default hreflang annotation missing 

### Performance

- HTML file size too large 
- Not compressed 
- Slow page 

### Images

- HTTPS page links to HTTP image 
- Image broken 
- Image file size too large 
- Image redirects 
- Missing alt text 
- Page has broken image 
- Page has redirected image 

### JavaScript

- HTTPS page links to HTTP JavaScript 
- JavaScript broken 
- JavaScript redirects 
- Page has broken JavaScript 
- Page has redirected JavaScript 

### CSS

- CSS broken 
- CSS file size too large 
- CSS redirects 
- HTTPS page links to HTTP CSS 
- Page has broken CSS 
- Page has redirected CSS 

### External pages

- External 3XX redirect 
- External 4XX 
- External 5XX 
- External time out 

### Other

- 3XX page receives organic traffic 
- 3XX redirect in sitemap 
- 403 page in sitemap 
- 403 page receives organic traffic 
- 4XX page in sitemap 
- 4XX page receives organic traffic 
- 5XX page in sitemap 
- Double slash in URL 
- More than three parameters in URL 
- Noindex page in sitemap 
- Noindex page receives organic traffic 
- Non-canonical page in sitemap 
- Non-canonical page receives organic traffic 
- Page from sitemap timed out


