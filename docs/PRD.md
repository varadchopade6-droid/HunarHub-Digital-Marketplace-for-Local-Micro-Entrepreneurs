# HunarHub Product Requirements Document

## Problem and objective

Local micro-entrepreneurs often rely on word of mouth and lack a simple digital place to show their work. HunarHub makes nearby skills and handmade goods discoverable while keeping transactions understandable and locally arranged.

## Users and user stories

- A customer can find approved entrepreneurs by skill, location, search term, and price range; inspect services, products, prices, and feedback; then request work or order a product.
- An entrepreneur can publish a profile, services, and products after registering, control availability, respond to work, and see actual completed earnings.
- An administrator can approve entrepreneur accounts, maintain categories/skills, monitor marketplace records, resolve complaints, and see stored-data analytics.

## Acceptance criteria

Authentication is JWT-based and passwords are hashed. Public discovery shows only approved entrepreneurs and their available offerings. A customer may review only their own completed order or request. Ownership and role checks protect all management routes. Product stock cannot fall below zero, and order/request statuses cannot skip transitions.

## Out of scope

Native apps, payment processing, international shipping, delivery logistics, wallets, AI recommendations, and training/certification are future possibilities, not current requirements.
