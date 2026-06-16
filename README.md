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

**Routes**

Below are the app routes and their corresponding page files:

- **/**: [src/app/page.tsx](src/app/page.tsx)
- **/login**: [src/app/login/page.tsx](src/app/login/page.tsx)
- **/register**: [src/app/register/page.tsx](src/app/register/page.tsx)
- **/profile**: [src/app/profile/page.tsx](src/app/profile/page.tsx)
- **/cart**: [src/app/(customer)/cart/page.tsx](<src/app/(customer)/cart/page.tsx>)
- **/menu**: [src/app/(customer)/menu/page.tsx](<src/app/(customer)/menu/page.tsx>)
- **/checkout**: [src/app/(customer)/checkout/page.tsx](<src/app/(customer)/checkout/page.tsx>)
- **/orders**: [src/app/(customer)/orders/page.tsx](<src/app/(customer)/orders/page.tsx>)
- **/orders/[id]**: [src/app/(customer)/orders/[id]/page.tsx](<src/app/(customer)/orders/[id]/page.tsx>)
- **/rewards**: [src/app/(customer)/rewards/page.tsx](<src/app/(customer)/rewards/page.tsx>)
- **/dashboard** (customer): [src/app/(customer)/dashboard/page.tsx](<src/app/(customer)/dashboard/page.tsx>)
- **/admin**: [src/app/admin/page.tsx](src/app/admin/page.tsx)
- **/admin/login**: [src/app/admin/login/page.tsx](src/app/admin/login/page.tsx)
- **/admin/dashboard**: [src/app/(admin)/(dashboard)/dashboard/page.tsx](<src/app/(admin)/(dashboard)/dashboard/page.tsx>)
- **/admin/orders**: [src/app/(admin)/(dashboard)/orders/page.tsx](<src/app/(admin)/(dashboard)/orders/page.tsx>)
- **/admin/menu**: [src/app/(admin)/(dashboard)/menu/page.tsx](<src/app/(admin)/(dashboard)/menu/page.tsx>)
- **/admin/payments**: [src/app/(admin)/(dashboard)/payments/page.tsx](<src/app/(admin)/(dashboard)/payments/page.tsx>)
- **/admin/stock**: [src/app/(admin)/(dashboard)/stock/page.tsx](<src/app/(admin)/(dashboard)/stock/page.tsx>)
- **/admin/tables**: [src/app/(admin)/(dashboard)/tables/page.tsx](<src/app/(admin)/(dashboard)/tables/page.tsx>)
- **/admin/vouchers**: [src/app/(admin)/(dashboard)/vouchers/page.tsx](<src/app/(admin)/(dashboard)/vouchers/page.tsx>)
- **/admin/settings**: [src/app/(admin)/(dashboard)/settings/page.tsx](<src/app/(admin)/(dashboard)/settings/page.tsx>)
- **/admin/customers**: [src/app/(admin)/(dashboard)/customers/page.tsx](<src/app/(admin)/(dashboard)/customers/page.tsx>)
- **/admin/categories**: [src/app/(admin)/(dashboard)/categories/page.tsx](<src/app/(admin)/(dashboard)/categories/page.tsx>)
- **/admin/reservations**: [src/app/(admin)/(dashboard)/reservations/page.tsx](<src/app/(admin)/(dashboard)/reservations/page.tsx>)
- **/admin/staff**: [src/app/(admin)/(dashboard)/staff/page.tsx](<src/app/(admin)/(dashboard)/staff/page.tsx>)
- **/admin/rewards**: [src/app/(admin)/(dashboard)/rewards/page.tsx](<src/app/(admin)/(dashboard)/rewards/page.tsx>)
- **/admin/customers**: [src/app/(admin)/(dashboard)/customers/page.tsx](<src/app/(admin)/(dashboard)/customers/page.tsx>)
- **/manager**: [src/app/manager/page.tsx](src/app/manager/page.tsx)
- **/manager/login**: [src/app/manager/login/page.tsx](src/app/manager/login/page.tsx)
- **/manager/dashboard**: [src/app/manager/(dashboard)/dashboard/page.tsx](<src/app/manager/(dashboard)/dashboard/page.tsx>)
- **/manager/orders**: [src/app/manager/(dashboard)/orders/page.tsx](<src/app/manager/(dashboard)/orders/page.tsx>)
- **/manager/reports**: [src/app/manager/(dashboard)/reports/page.tsx](<src/app/manager/(dashboard)/reports/page.tsx>)
- **/manager/payments**: [src/app/manager/(dashboard)/payments/page.tsx](<src/app/manager/(dashboard)/payments/page.tsx>)
- **/manager/table-monitoring**: [src/app/manager/(dashboard)/table-monitoring/page.tsx](<src/app/manager/(dashboard)/table-monitoring/page.tsx>)
- **/manager/staff-monitoring**: [src/app/manager/(dashboard)/staff-monitoring/page.tsx](<src/app/manager/(dashboard)/staff-monitoring/page.tsx>)
- **/manager/stock-monitoring**: [src/app/manager/(dashboard)/stock-monitoring/page.tsx](<src/app/manager/(dashboard)/stock-monitoring/page.tsx>)
- **/manager/customer-loyalty**: [src/app/manager/(dashboard)/customer-loyalty/page.tsx](<src/app/manager/(dashboard)/customer-loyalty/page.tsx>)
- **/cashier/login**: [src/app/(staff)/cashier/login/page.tsx](<src/app/(staff)/cashier/login/page.tsx>)
- **/kitchen/login**: [src/app/(staff)/kitchen/login/page.tsx](<src/app/(staff)/kitchen/login/page.tsx>)
- **/cashier/dashboard**: [src/app/(staff)/cashier/(dashboard)/dashboard/page.tsx](<src/app/(staff)/cashier/(dashboard)/dashboard/page.tsx>)
- **/cashier/orders**: [src/app/(staff)/cashier/(dashboard)/orders/page.tsx](<src/app/(staff)/cashier/(dashboard)/orders/page.tsx>)
- **/cashier/payments**: [src/app/(staff)/cashier/(dashboard)/payments/page.tsx](<src/app/(staff)/cashier/(dashboard)/payments/page.tsx>)
- **/cashier/tables**: [src/app/(staff)/cashier/(dashboard)/tables/page.tsx](<src/app/(staff)/cashier/(dashboard)/tables/page.tsx>)
- **/cashier/rewards**: [src/app/(staff)/cashier/(dashboard)/rewards/page.tsx](<src/app/(staff)/cashier/(dashboard)/rewards/page.tsx>)
- **/cashier/order/new**: [src/app/(staff)/cashier/(dashboard)/order/new/page.tsx](<src/app/(staff)/cashier/(dashboard)/order/new/page.tsx>)
- **/kitchen/dashboard**: [src/app/(staff)/kitchen/(dashboard)/dashboard/page.tsx](<src/app/(staff)/kitchen/(dashboard)/dashboard/page.tsx>)
- **/kitchen/queue**: [src/app/(staff)/kitchen/(dashboard)/queue/page.tsx](<src/app/(staff)/kitchen/(dashboard)/queue/page.tsx>)
- **/kitchen/ready-orders**: [src/app/(staff)/kitchen/(dashboard)/ready-orders/page.tsx](<src/app/(staff)/kitchen/(dashboard)/ready-orders/page.tsx>)
