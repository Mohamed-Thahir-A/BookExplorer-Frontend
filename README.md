This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
##  Architecture Overview
PRODUCT-DATA-EXPLORER/
├── frontend/
├── backend/
└── README.md
             Frontend Architecture
                    frontend/
                        ├── app/
                        │   ├── categories/
                        │   │   ├── [slug]/
                        │   │   │   └── page.tsx
                        │   │   └── page.tsx
                        │   ├── products/
                        │   │   ├── [id]/
                        │   │   │   └── page.tsx
                        │   │   └── page.tsx
                        │   ├── search/
                        │   │   └── page.tsx
                        │   ├── wishlist/
                        │   │   └── page.tsx
                        │   ├── favicon.ico
                        │   ├── globals.css
                        │   ├── layout.tsx
                        │   └── page.tsx
                        ├── components/
                        ├── lib/
                        │   ├── api.ts
                        │   └── searchUtils.ts
                        ├── node_modules/
                        ├── public/
                        ├── types/
                        ├── .env.local
                        ├── .gitignore
                        ├── eslint.config.mjs
                        ├── global.d.ts
                        ├── next-env.d.ts
                        ├── next.config.js
                        ├── package-lock.json
                        ├── package.json
                        ├── postcss.config.js
                        └── postcss.config.mjs

            Backend Architecture
                    backend/
                    ├── .next/
                    ├── dist/
                    ├── node_modules/
                    ├── src/
                    │   ├── controllers/
                    │   │   ├── auth.controller.ts
                    │   │   ├── categories.controller.ts
                    │   │   ├── debug.controller.ts
                    │   │   ├── navigation.controller.ts
                    │   │   ├── products.controller.ts
                    │   │   ├── reviews.controller.ts
                    │   │   ├── view-history.controller.ts
                    │   │   └── wishlist.controller.ts
                    │   ├── dto/
                    │   │   ├── auth.dto.ts
                    │   │   └── wishlist.dto.ts
                    │   ├── entities/
                    │   │   ├── book.entity.ts
                    │   │   ├── category.entity.ts
                    │   │   ├── navigation.entity.ts
                    │   │   ├── product-detail.entity.ts
                    │   │   ├── product.entity.ts
                    │   │   ├── review.entity.ts
                    │   │   ├── scrape-job.entity.ts
                    │   │   ├── user.entity.ts
                    │   │   ├── view-history.entity.ts
                    │   │   └── wishlist.entity.ts
                    │   ├── guards/
                    │   │   └── jwt-auth.guard.ts
                    │   ├── modules/
                    │   │   ├── categories.module.ts
                    │   │   ├── navigation.module.ts
                    │   │   ├── products.module.ts
                    │   │   ├── reviews.module.ts
                    │   │   ├── view-history.module.ts
                    │   │   └── wishlist.module.ts
                    │   ├── services/
                    │   │   ├── auth.service.ts
                    │   │   ├── cache.service.ts
                    │   │   ├── categories.service.ts
                    │   │   ├── navigation.service.ts
                    │   │   ├── product-detail.service.ts
                    │   │   ├── products.service.ts
                    │   │   ├── review.service.ts
                    │   │   ├── scraping.service.ts
                    │   │   ├── view-history.service.ts
                    │   │   └── wishlist.service.ts
                    │   ├── strategies/
                    │   │   └── jwt.strategy.ts
                    │   ├── app.controller.ts
                    │   ├── app.module.ts
                    │   └── main.ts
                    ├── storage/
                    ├── .env
                    ├── .env.example
                    ├── database.sqlite
                    ├── package-lock.json
                    ├── package.json
                    └── tsconfig.json