**Strums — Project README**

- **What:** Strums is a small web app that stores lesson metadata and chord patterns and serves video links hosted on Cloudinary. The backend uses PostgreSQL for structured data and Cloudinary for media.

**Quick Start**

- **Backend:**
  - Install dependencies and start the server:

```bash
cd backend
npm install
node server.js
```

- **Frontend / assets:**
  - Tailwind watch (development):

```bash
npm run dev   # from project root
```

- Serve the static site locally:

```bash
npm run serve  # from project root
```

**Environment**

- The backend reads configuration from `backend/.env`. Important variables:
  - **JWT_SECRET:** signing secret used for JSON Web Tokens (admin auth).
  - **PORT:** HTTP port the backend listens on (default `5000`).
  - **DATABASE_URL** (or `POSTGRES_URL`): Postgres connection string, e.g. `postgresql://user:pass@host:5432/dbname`.
  - **CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET:** Cloudinary credentials used by upload endpoints.
  - **ADMIN_USERNAME, ADMIN_PASSWORD:** admin credentials used by the admin login endpoint.

Edit `backend/.env` to set these values for your environment. Do NOT commit secrets to source control.

**Database / Data**

- Current data is stored in PostgreSQL (connection from `DATABASE_URL` in `backend/.env`).
- To inspect the DB using `psql`:

```bash
psql "${DATABASE_URL}"
\dt
SELECT count(*) FROM lessons;
SELECT count(*) FROM chord_patterns;
\q
```

**APIs (summary)**

- `PUT /api/lessons/:id` — update lesson by `id` (admin)
- `PUT /api/chord-library/:id` — update chord by `id` (admin)
- `DELETE /api/chord-library/:id` — delete chord by `id` (admin)

All admin endpoints require a JWT obtained from `POST /api/admin/login`.

- Run the schema migration in the backend migrations folder when upgrading older environments.
- The project has been migrated to PostgreSQL and Mongoose-related model files and the one-off migration script were removed to keep the codebase tidy.

#
