# Shop Scraper

Node version: 14.15.4 LTS

Tools and frameworks:

- Express
- Puppeteer
- BullMQ
- Redis
- Typescript

Table of Contents:

- [Shop Scraper](#shop-scraper)
  - [How to run](#how-to-run)
    - [I am using Docker](#i-am-using-docker)
    - [I don't have Docker](#i-dont-have-docker)
  - [Project](#project)
    - [First ideas](#first-ideas)
    - [The case](#the-case)
    - [The project](#the-project)
    - [The TDD](#the-tdd)
    - [The analysis](#the-analysis)
    - [Building the scrapper](#building-the-scrapper)
    - [Improvements](#improvements)
    - [Problems/Bugs](#problemsbugs)
    - [References](#references)

## How to run

### I am using Docker

**Requires `docker` and `docker-compose` installed**

To run this project in your machine:

- clone this repository in your machine
- open the folder
- run `docker-compose up --build`

If you already have this image built, you can simply run `docker-compose up`.

### I don't have Docker

This project requires an insnce of Redis to run.
The following environment variables are required:

- REDIS_HOST - the host of the Redis instance. Eg.: `REDIS_HOST=localhost`;
- REDIS_PORT - the port of the Redis instance. Eg.: `REDIS_PORT=6379`;

And optionally:

- NODE_ENV - if not set, defaults to `development`;
- PORT - if not set, defaults to `8080`;

To run using Yarn (recommended):

- clone this repository in your machine
- open the folder
- run `yarn install --frozen-lockfile`
- after installing, run `yarn start`;

If you want to use NPM instead:

- clone this repository in your machine
- open the folder
- run `npm install`
- after installing, run `npm start`;

## Project

### First ideas

- Study briefly about crawlers and how they work;
- Make a quick project
- Define a expectation
- Write tests
- Start the project
  
### The case

This is the first crawler that I built, so I decided to read more about to get rid of my superficial idea of what they are. I made researches and separated quick references of what i think that should be done. Also I defined the method that I was going to use to retrieve data from th website.

### The project

I started the project quite delayed due to another tasks and when I started to make the project it was a little more than on day to the due date. I sketched some topic and left the project aside because it was taking long.

### The TDD

I usually start defining the behaviour of the software and to keep in the plan I write tests. Because of this lack of project, I skipped this part.

### The analysis

I defined that the crawler should be simple. Because of this, the best approach was read the DOM using Puppeteer.
I openned the website to analyse how should I capture the elements, and the first things I noticed was that it was using a platform called WooCommerce and it was rendered in server-side (if it was dynamic, I could see if there is any open API in use). After reading about the platform, I dicovered that it uses a shared CSS (woocommercee.css) file with base classes to all clients in the platform.
Checking the website again, most of these clases were in use. Things like "price" and "product_title".
This made easier the process to make selectors for all cases, if not, I would have to find another pattern.

### Building the scrapper

My idea was:

- Get all product names
- Find the endpoint where it describes each product
- Replace the name for each product in the list;
- Fetch, parse and save the data

It worked fine since the beggining. I used Puppeter a couple time to make e2e tests and unit test in React applications, so I didnt have problems to implement it.
Since the first try I knew that I would have to use background tasks. Depending on the load or connection quality, the process to retrieve all data could be long. Also, some browsers tend to ping more than one time if the connection is slow to check if there is any answer, it could make additional calls that were not needed.
After finishing the scraper, I made a simple queue to register and proccess this tasks in background.

### Improvements

I am using only one worker to do all the process, but this could be easily split in more in order to make it faster (at cost of processing load). For example: I am retrieving all products one after other. After fetching the list, I could open one worker for each product and process it parallel.

I am pinging each 5 seconds to see if the proccess finished (front end part), it would be wise to use a websocket instead.

I could use the CSV package available in NPM registry, but did you ever see the implemantion of this? It is non-sense.

I opted to use the functional paradigm because it was simpler, faster and suitable for small projects. If I had more time, I would like to implement OOP here.

Most of crawlers keep running in order to keep the content update. With BullMQ, we can schedule repeating jobs to keep our CSV file updated.

### Problems/Bugs

No serious bugs were found doing this project.
I spent a couple hours trying to define one algorithm to get all variation for a single product. For this, I needed to make a matrix realtig each field, options to all possible value. Happens that if we change one value from one field, the other field could end up without options, it updates every time. My solution was calculate all possibilities considering that we have 2 fields for variations.

There is aproblem related to run Puppeteer in a Docker image. Even following the instruction in the official repository, I had problems related to access level. The solution was to [not run it in a sandbox](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#setting-up-chrome-linux-sandbox);

does not make sense to fetch once

load with delay to avoid to be detected

scheduler

versioning or tagging?

server-side rendering

form variations_form, data-product-variations;

### References

- [Top 10 Web Scraping Techniques - Lime Proxies](https://limeproxies.netlify.app/blog/top-10-web-scraping-techniques), acessed at 19:30 15/01/2021;
- [General Techniques Used for Web Scraping - IGN](https://www.ign.com/wikis/general-techniques-used-for-web-scraping/), acessed at 19:40 15/01/2021;
- [Web Scraping - Wikipedia](https://en.wikipedia.org/wiki/Web_scraping), acessed at 19:45 15/01/2021;
