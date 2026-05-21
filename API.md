# Hunar Hub - API Documentation

## Base URL
```
Production: https://yourdomain.com/api/v1
Development: http://localhost:3000/api/v1
```

## Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Products
- `GET /products` - List all products with pagination
- `GET /products/[slug]` - Get product details
- `POST /products` - Create new product (Entrepreneur only)
- `PUT /products/[slug]` - Update product (Entrepreneur only)
- `DELETE /products/[slug]` - Delete product (Entrepreneur only)

### Artisans
- `GET /artisans` - List all artisans
- `GET /artisans/[id]` - Get artisan details
- `PUT /artisans/[id]` - Update profile (Authenticated user)

### Services
- `GET /services` - List all services
- `GET /services/[slug]` - Get service details
- `POST /services` - Create service (Entrepreneur only)

### Orders
- `GET /orders` - Get user's orders
- `POST /orders` - Create new order
- `PUT /orders/[id]` - Update order status (Admin only)

### Users
- `GET /users` - Get user profile
- `PUT /users` - Update profile
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Admin
- `GET /admin/dashboard` - Dashboard analytics
- `GET /admin/users` - List all users
- `GET /admin/products` - List all products
- `GET /admin/orders` - List all orders

## Response Format

### Success Response
```json
{
  "status": "success",
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "status": "error",
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting
- Anonymous users: 100 requests/hour
- Authenticated users: 1000 requests/hour

## Pagination
```
?page=1&limit=20&sort=-createdAt&search=query
```

## Search
Full-text search across products and services:
```
GET /search?q=keyword&category=pottery&priceMin=0&priceMax=10000
```
