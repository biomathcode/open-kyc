## OpenKYC
![OpenKYC logo](./public/logo.png)

Build for the Tanstack Start [Hackathon](https://www.convex.dev/hackathons/tanstack)

KYC platform powered by Convex, tanstack start, [react-aria](http://intentui.com/), netlify, cloudflare, better-auth, autumn, gemini. 


![OpenKYC ShowCase](./public/showcase.png)



![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/biomathcode/open-kyc?utm_source=oss&utm_medium=github&utm_campaign=biomathcode%2Fopen-kyc&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)



### Deployment

- `npx convex dev`
- `npx convex deploy`

### Environment Variables

- `CONVEX_DEPLOYMENT`
- `VITE_CONVEX_URL`
- `VITE_CONVEX_SITE_URL`
- `BASE_URL`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `SITE_URL`
- `FIRECRAWL_API_KEY`
- `SENTRY_AUTH_TOKEN`
- `BETTER_AUTH_SECRET`
- `RESEND_API_KEY`
- `GEMINI_API_KEY`
- `AUTUMN_SECRET_KEY`



### Features

- Dashboard
- Verifications
- Analytics
- Workflows
- Customization
- Questionnairs
- Blocklist
  
- Manual Checks 
- Settings


## Convex Workflows

* Background check powered by firecrawl 
* Id verification powered by gemini 

user uploads documents -> status -> complete -> workflow -> extract data -> for Background Check 


## How it works 

user will create custom workflow, workflows include age verification, address verification, etc, 
then for verification users you can create custom session with workflow types, this session can be expired of live forever, one session can only collect information about one individual only. 





## Netflify deploy -> 
[DEMO URL](https://open-kyc.netlify.app)



## Cloudflare  -> 

[DEMO_URL](https://tanstack-start-app.sharma-pratik2016.workers.dev)


---

# 🛠️ Tech Stack

## **Frontend**

| Technology                            | Version        | Purpose                          |
| ------------------------------------- | -------------- | -------------------------------- |
| React                                 | 19.1.1         | Core UI framework                |
| React DOM                             | 19.1.1         | DOM renderer                     |
| TanStack Start                        | 1.132.2        | Full-stack React framework (SSR) |
| TanStack Router                       | 1.132.2        | File-based routing               |
| TanStack React Query                  | 5.90.7         | Data fetching / caching          |
| TanStack React Form                   | 1.23.8         | Form handling                    |
| TanStack Table                        | 8.21.3         | Data tables                      |
| Tailwind CSS v4                       | 4.1.13         | Styling                          |
| shadcn/ui (via tailwind + react-aria) | Latest         | UI components                    |
| React Aria Components                 | 1.13.0         | Accessible UI primitives         |
| Lucide React                          | 0.552.0        | Icons                            |
| Motion                                | 12.23.24       | Animations                       |
| Recharts                              | 3.4.1          | Charts                           |
| React Markdown                        | 10.1.0         | Render Markdown                  |
| Input OTP                             | 1.4.2          | OTP UI input                     |
| QR-Code / React-QR-Code               | 1.5.4 / 2.0.18 | QR generation                    |
| Class Variance Authority              | 0.7.1          | Component variants               |
| Tailwind Merge                        | 3.4.0          | Class merging                    |
| Tailwind Variants                     | 3.1.1          | Variant utilities                |
| Tailwindcss React Aria Components     | 2.0.1          | Theme for RAC                    |
| Culori                                | 4.0.2          | Color utilities                  |
---

## **Backend**

| Technology         | Purpose                          |
| ------------------ | -------------------------------- |
| Convex             | Primary backend (DB + functions) |
| Convex Crons       | Scheduled jobs                   |
| Convex Workflows   | Workflow orchestration           |
| Convex Workpool    | Distributed batch processing     |
| Convex Migrations  | Schema migration toolkit         |
| Convex Better Auth | Authentication                   |
| Better Auth        | Additional auth utilities        |
| Autumn / atmn      | Subscription billing (Stripe)    |
| Firecrawl          | Site crawling                    |
| UUID               | ID generation                    |
| Zod + Zod-to-JSON  | Schema + validation              |

---

## **External APIs**

| Service             | Use Case                 | Cost          |
| ------------------- | ------------------------ | ------------- |
| Firecrawl           | Crawling / SERP scraping | Job-based     |
| Google GenAI        | AI models                | Usage-based   |
| Stripe (via Autumn) | Payments                 | Standard fees |

---

## **Infrastructure**

| Layer           | Technology         |
| --------------- | ------------------ |
| Hosting         | Cloudflare Workers |
| Backend Runtime | Convex Functions   |
| Storage         | Convex Storage     |
| Error Tracking  | Sentry             |

---

## **Development**

| Tool              | Purpose                    |
| ----------------- | -------------------------- |
| pnpm              | Package manager            |
| TypeScript        | Type safety                |
| Vitest            | Testing                    |
| Vite              | Build tool                 |
| Wrangler          | Cloudflare dev/preview     |
| ESLint + Prettier | Code quality               |
| Concurrently      | Run multiple dev processes |

---



### References
- https://github.com/mikecann/port-geo-christmas-lights-cruise/tree/the-video-release
- https://convex-better-auth.netlify.app/framework-guides/tanstack-start
  
- https://github.com/firecrawl/firecrawl/tree/main/examples
- https://github.com/ericciarla/trendFinder
- https://github.com/tanstack/router/tree/main/examples
- https://github.com/get-convex/better-auth/tree/main/examples/tanstack
- https://github.com/abhik-99/Liveness-Detection
- https://modal.com/docs/examples/doc_ocr_jobs


### FAQ

<details>
  <summary><b>Why Open Source?</b></summary>
  <p>
    People keep asking me why open sourced this project because I wanted to use 
    <a href="https://www.coderabbit.ai" target="_blank">Coderabbit</a>
  </p>
</details>