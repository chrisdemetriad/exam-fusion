## ExamFusion

A dynamic platform with a clean, user-friendly interface, designed to empower users in their learning journey by offering interactive tests for accountants, such as ACCA, CIMA, AAT, ACA, with comprehensive progress tracking and personalised analytics.  It provides detailed visual insights such as score trends, time analysis, and provider-based performance summaries.

Based on `Next.js`, the tech stack is mainly `zustand` for state management, `Recharts` for D3 charts, `nodemailer` to send emails via SMTP, `NextAuth` to handle authentication, `biome` for linting. Data is coming from a `MongoDB` using a `REST API` written with [fastify](https://fastify.dev/).

The app is serverless and it is [deployed](https://exam-fusion.vercel.app/) on Vercel.