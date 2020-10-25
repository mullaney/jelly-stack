<!--
  "title": "A New Way to Generate HTML",
  "author": "Kevin Kelly",
  "description": "Why Jelly Stack? Some reasons why I made it and why you might want to use it",
  "image": "https://jelly-stack.netlify.app/images/jelly-sml.1603593891077.png",
  "published": "October 16, 2020"
-->

Over the years I've made a lot of websites, some with complicated backends with APIs, others using off the shelf php software like Wordpress and still others that just consist of simple HTML and CSS. One drawback of using libraries and complicated backends for sites is that the code has to be maintained and sometimes upgraded over the years. You might go months or even years before returning to a code base.

One site I created back in 2000 was [cage-match.com](http://cage-match.com/). The site was made with php, without the benefit of any real framework. I built my own template engine based on the kinds of things I had seen with php message boards or Word Press. I put a lot of effort into the site, but at a certain point, it was **done**. It did everything I needed it to, and I gave it over to an admin who maintained the site by adding regular content. It worked wonderfully, until it didn't.

Over time, the version of PHP that was used on the server was updated, and eventually some function that I was using would become deprecated. And the site would break. Then I would need to come in and fix the site, having not looked at the code for a long time. It was not fun. But each time I fixed it and it worked for another few years until the next PHP upgrade broke the site.

Some sites I created using platforms like Tumblr. Tumblr was great in it's heyday, and it included a lot of tools to customize your site. But then things started to change, Tumblr was sold off, the audience began to leave and yet my content was stuck there. I would have loved to migrate that content to another platform, but there was no convenient method that I knew of to do that. Other platforms have similar issues. They might be wonderfully customizable, and convenient. They might take care of all the upgrades you would ever need, but your content is stuck with them, more or less.

So, it got me thinking recently about the JAM stack and static site generators. What if there was a super simple static site generator. You wrote your content in markdown. You could make custom CSS files. You could keep all your content in a github repo under version control. And you could deploy fast and easy using a service like github pages or netlify. You could publish a site for free. The files would be simple HTML and CSS (possibly with a little JavaScript).

The sites would never expire. If you had a blog where you published content over months or years, you could take a long break from the project secure with the knowledge that your site would never need upgrading it. Afterall it was just HTML and CSS. Browsers would always be able to load the files. And that's what the Jelly Stack aims to be. Jelly doesn't stand for anything. It's just a fun cheap imitation of jam.

I will be improving on the Jelly Stack over time. And when I think it has enough features and the code is polished enough, I will start publicizing it to see if others might want to use it. My basic feature set would imitate the basic feature set of a WordPress site: pages, posts and tags.
