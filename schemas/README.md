# schemas

Runtime validation schemas live here.

Planned usage:

- request body validation for Route Handlers
- parsing query params or feedback payloads
- shared DTO validation between API and services

Guidelines:

- Keep schemas framework-agnostic when possible
- Use this layer to validate input and output contracts
- Avoid database access in this directory
