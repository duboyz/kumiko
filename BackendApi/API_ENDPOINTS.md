# API Endpoints - Feature-Grouped Organization

This document outlines the feature-grouped API endpoint structure, organized by business functionality rather than technical concerns.

## 🎯 Endpoint Organization Strategy

### ✅ Feature-First Grouping
Endpoints are grouped by **business features** and **user workflows**:

```
/api/auth/*          # Authentication & account management
/api/users/*         # User profile & preferences  
/api/search/*        # Location & business search
/api/orders/*        # Order management (future)
/api/payments/*      # Payment processing (future)
```

### ❌ Technical Grouping (Avoid)
```
/api/get/*           # ❌ Groups by HTTP method
/api/post/*          # ❌ Groups by HTTP method  
/api/v1/entities/*   # ❌ Groups by data model
```

## 🔐 Authentication Endpoints

**Base Route:** `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/login` | Authenticate user | ❌ |
| `POST` | `/api/auth/register` | Create new account | ❌ |
| `POST` | `/api/auth/logout` | Logout user | ✅ |
| `GET` | `/api/auth/me` | Get current user info | ✅ |

### Examples

```bash
# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123",
  "clientType": "Web"
}

# Register  
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "clientType": "Web"
}

# Get current user
GET /api/auth/me
Authorization: Bearer <token>
```

## 👤 User Management Endpoints

**Base Route:** `/api/users`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `PUT` | `/api/users/profile` | Update user profile | ✅ |

### Future Endpoints (Planned)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/users/profile` | Get user profile | ✅ |
| `DELETE` | `/api/users/account` | Delete account | ✅ |
| `POST` | `/api/users/change-password` | Change password | ✅ |
| `GET` | `/api/users/preferences` | Get preferences | ✅ |
| `PUT` | `/api/users/preferences` | Update preferences | ✅ |

### Examples

```bash
# Update profile
PUT /api/users/profile
Authorization: Bearer <token>
{
  "firstName": "John",
  "lastName": "Smith"
}
```

## 🔍 Search Endpoints

**Base Route:** `/api/search`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/search/addresses` | Search addresses | ✅ |
| `POST` | `/api/search/businesses` | Search businesses | ✅ |

### Future Endpoints (Planned)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/search/nearby` | Search nearby places | ✅ |
| `GET` | `/api/search/autocomplete` | Address autocomplete | ✅ |
| `POST` | `/api/search/geocode` | Geocode addresses | ✅ |
| `POST` | `/api/search/reverse-geocode` | Reverse geocode | ✅ |

### Examples

```bash
# Search addresses
POST /api/search/addresses
Authorization: Bearer <token>
{
  "query": "123 Main St, City",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "radius": 5000
}

# Search businesses
POST /api/search/businesses
Authorization: Bearer <token>
{
  "query": "restaurants near me",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "radius": 1000
}
```

## 🏗️ Feature Grouping Benefits

### 1. **Intuitive Organization**
- Developers can easily find related endpoints
- API consumers understand the logical grouping
- Documentation is naturally organized

### 2. **Scalability**
- New features get their own route group
- Related functionality stays together
- Easy to version entire feature sets

### 3. **Team Organization**
- Teams can own entire feature areas
- Reduced merge conflicts
- Clear ownership boundaries

### 4. **Security & Middleware**
- Apply feature-specific middleware
- Consistent auth requirements per feature
- Feature-level rate limiting

## 📁 Controller Organization

Each feature group has one main controller:

```
Features/
├── Auth/
│   ├── AuthController.cs          # All auth endpoints
│   ├── Login/                     # Login business logic
│   ├── Register/                  # Register business logic
│   ├── Logout/                    # Logout business logic
│   └── Me/                        # Get user business logic
├── User/
│   ├── UserController.cs          # All user management endpoints
│   └── UpdateUser/                # Update user business logic
└── AddressSearch/
    ├── AddressSearchController.cs # All search endpoints
    ├── SearchAddress/             # Address search business logic
    └── SearchBusiness/            # Business search business logic
```

## 🎨 Naming Conventions

### Route Naming
- **Base routes**: Use plural nouns (`/api/users`, `/api/orders`)
- **Actions**: Use clear verbs or nouns (`/login`, `/profile`, `/addresses`)
- **Consistency**: Same pattern across all features

### HTTP Methods
- `GET`: Retrieve data
- `POST`: Create new resources or complex queries
- `PUT`: Update entire resources
- `PATCH`: Partial updates
- `DELETE`: Remove resources

### Examples of Good Route Design

```bash
# ✅ Good: Feature-grouped, clear actions
POST /api/auth/login
GET  /api/auth/me
PUT  /api/users/profile
POST /api/search/addresses

# ❌ Bad: Technical grouping, unclear actions
POST /api/authenticate
GET  /api/getCurrentUser  
PUT  /api/updateUser
POST /api/doAddressSearch
```

## 🔄 Migration Strategy

### Phase 1: Create New Feature Controllers ✅
- `AuthController` - Groups all auth endpoints
- `UserController` - Groups all user endpoints  
- `AddressSearchController` - Groups all search endpoints

### Phase 2: Deprecate Old Controllers
- Keep old controllers for backward compatibility
- Add deprecation warnings
- Update documentation

### Phase 3: Remove Old Controllers
- Remove individual feature controllers
- Clean up unused code
- Update client applications

## 🚀 Adding New Feature Groups

When adding a new feature (e.g., Orders):

1. **Create feature directory**:
   ```
   Features/Orders/
   ├── OrdersController.cs
   ├── CreateOrder/
   ├── GetOrder/
   ├── UpdateOrder/
   └── CancelOrder/
   ```

2. **Define route group**:
   ```csharp
   [Route("api/orders")]
   public class OrdersController : BaseController
   ```

3. **Add related endpoints**:
   ```csharp
   [HttpPost] // POST /api/orders
   [HttpGet("{id}")] // GET /api/orders/{id}
   [HttpPut("{id}")] // PUT /api/orders/{id}
   [HttpDelete("{id}")] // DELETE /api/orders/{id}
   ```

4. **Update documentation**:
   - Add to this file
   - Update Swagger descriptions
   - Create examples

This feature-grouped approach creates a clean, scalable API structure that grows naturally with your application!
