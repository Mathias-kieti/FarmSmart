# FarmSmart Backend

Spring Boot API designed from the current FarmSmart frontend routes.

## Structure

```text
src/main/java/com/farmsmart/backend
|-- auth          # Firebase token filter and current-user context
|-- common        # API response wrapper and error handling
|-- config        # CORS and Firebase Admin configuration
|-- controller    # HTTP endpoints used by the React app
|-- domain        # Core FarmSmart models
|-- dto           # Request payloads and validation
|-- repository    # Current in-memory data layer
`-- service       # Business logic per frontend feature
```

The repositories are intentionally in-memory for the first backend pass. When you are ready for persistence, replace the repository classes with JPA repositories and keep most controllers/services the same.

## Run Locally

Install Java 17+ and Maven, then run:

```bash
cd Backend
mvn spring-boot:run
```

The API starts on:

```text
http://localhost:4000
```

By default, auth runs in local development mode so the backend starts before Firebase Admin is configured:

```yaml
farmsmart:
  auth:
    mode: off
```

For Firebase mode, set `FARMSMART_AUTH_MODE=firebase` and set `GOOGLE_APPLICATION_CREDENTIALS` to your Firebase service account JSON path.

## Frontend API Map

| Frontend screen | Backend endpoints |
| --- | --- |
| Login / Signup | Firebase Auth stays in the frontend |
| Profile | `GET /api/profile/me`, `PATCH /api/profile/me` |
| Marketplace | `GET /api/listings?county=Nyeri&status=Active` |
| Sell Produce | `POST /api/listings`, `PATCH /api/listings/{id}/status`, `DELETE /api/listings/{id}` |
| Market Prices | `GET /api/markets/prices?county=Nyeri` |
| Crop Advisor | `GET /api/advisor/recommendations?county=Nyeri` |
| Farm Plan | `GET /api/farm-plan?county=Nyeri` |
| Groups | `GET /api/groups`, `GET /api/groups/mine`, `POST /api/groups`, `POST /api/groups/{id}/join` |
| Learn | `GET /api/learn` |

Protected endpoints expect:

```http
Authorization: Bearer <firebase-id-token>
```

All successful feature responses use:

```json
{
  "data": {}
}
```
