
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY! });






// Scrape a website
const scrapeResponse = await firecrawl.scrape('https://firecrawl.dev', {
    formats: ['markdown', 'html'],
});

console.log(scrapeResponse)

// Crawl a website
const crawlResponse = await firecrawl.crawl('https://firecrawl.dev', {
    limit: 100,
    scrapeOptions: {
        formats: ['markdown', 'html'],
    }
});

console.log(crawlResponse)

// Scrape a website:
const scrapeResult = await firecrawl.scrape('firecrawl.dev', { formats: ['markdown', 'html'] });

console.log(scrapeResult)

const { id } = await firecrawl.startCrawl('https://docs.firecrawl.dev', { limit: 10 });
console.log(id);

const job = await firecrawl.crawl('https://docs.firecrawl.dev', { limit: 5, pollInterval: 1, timeout: 120 });
console.log(job.status);


const res = await firecrawl.map('https://firecrawl.dev', { limit: 10 });
console.log(res.links);

