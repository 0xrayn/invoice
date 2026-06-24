# Invoice Management System

A Laravel + React (Inertia.js) web application for managing invoices, products, customers, and companies. It generates PDF invoices via DomPDF and optionally forwards them to customers via WhatsApp or Email through n8n + WAHA.

---

## Screenshots

| Page | Screenshot |
|------|-----------|
| Landing Page (above the fold) | `docs/screenshots/landing-top.png` |
| Landing Page (below the fold) | `docs/screenshots/landing-bottom.png` |
| Dashboard | `docs/screenshots/dashboard.png` |
| Invoice List | `docs/screenshots/invoice-list.png` |
| Product List | `docs/screenshots/product-list.png` |
| Sender Company | `docs/screenshots/company.png` |
| Postman Testing | `docs/screenshots/postman-test.png` |
| n8n Workflow | `docs/screenshots/n8n-workflow.png` |
| Generated PDF | `docs/screenshots/invoice-pdf.png` |

---

## Roles

The system has two roles. Each role has different permissions throughout the application.

**Admin**

- Manages companies (sender profiles) and products.
- Views all invoices created by any Finance user.
- Cannot create, edit, or delete invoices.
- Cannot mark an invoice as printed or sent directly from draft; that action belongs to Finance first.

**Finance**

- Creates and manages customers.
- Creates, edits, and deletes invoices (only while status is `draft`).
- Marks invoices as `printed`, which generates the PDF.
- Marks invoices as `sent`, which generates the PDF and triggers the n8n webhook to forward it via WhatsApp or Email.

---

## Invoice Statuses

```
draft -> printed -> sent -> paid
              \-> cancelled
```

- `draft`: editable by Finance.
- `printed`: PDF generated; stock decremented; no further edits.
- `sent`: PDF generated and forwarded via n8n; stock decremented.
- `paid`: invoice settled.
- `cancelled`: invoice voided.

---

## PDF Generation

PDF is generated server-side using **barryvdh/laravel-dompdf** and stored at `storage/app/public/invoices/<invoice_no>.pdf`. It embeds the company logo and Finance signature as base64 so DomPDF does not need remote file access.

The PDF is created automatically when:
- Finance clicks **Mark as Printed** (`PATCH /invoices/{id}/printed`)
- Finance clicks **Mark as Sent** (`PATCH /invoices/{id}/sent`)

If the PDF already exists on disk for that invoice number, it is reused rather than regenerated.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | PHP 8.x, Laravel 12 |
| Frontend | React, Inertia.js, Tailwind CSS |
| PDF | barryvdh/laravel-dompdf |
| Database | MySQL |
| Automation | n8n (webhook-based) |
| WhatsApp | WAHA (WhatsApp HTTP API) |
| Containerization | Docker Compose |

---

## Prerequisites

- PHP >= 8.2 with extensions: `mbstring`, `xml`, `curl`, `gd`
- Composer
- Node.js >= 18 with npm
- MySQL
- Docker + Docker Compose (for n8n + WAHA)

---

## Installation

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd invoice

composer install
npm install
```

### 2. Environment Setup

```bash
cp env.example .env
php artisan key:generate
```

Open `.env` and configure the following:

```dotenv
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=

# Webhook URL that n8n listens on (leave as-is if using Docker Compose)
N8N_INVOICE_WEBHOOK_URL=http://localhost:5678/webhook/send-invoice

# How n8n sees your Laravel app
# If n8n runs via Docker: use http://host.docker.internal:8000
# If n8n runs natively on host: use http://localhost:8000
N8N_LARAVEL_BASE_URL=http://host.docker.internal:8000
```

### 3. Database

```bash
php artisan migrate
php artisan db:seed    # optional: creates demo data
```

### 4. Storage

```bash
php artisan storage:link
```

### 5. Build Frontend

```bash
npm run build
# or for development with hot reload:
npm run dev
```

### 6. Run the App

```bash
php artisan serve
```

The app is now available at `http://localhost:8000`.

---

## Docker (n8n + WAHA)

The `docker-compose.yml` spins up n8n and WAHA. Laravel itself runs natively on the host.

```bash
docker compose up -d
```

| Service | Port | Purpose |
|---------|------|---------|
| n8n | 5678 | Automation / webhook receiver |
| WAHA | 3000 | WhatsApp HTTP API |

### Import the n8n Workflow

1. Open n8n at `http://localhost:5678`.
2. Go to **Workflows** and click **Import from File**.
3. Select `n8n-send-invoice-workflow.json` from the project root.
4. Activate the workflow.

The workflow listens on `POST /webhook/send-invoice` and:
- Downloads the PDF from the URL provided by Laravel.
- Checks if the customer has a WhatsApp number; if yes, sends via WAHA.
- Checks if the customer has an email; if yes, sends via email.

### WAHA Setup

1. Open WAHA at `http://localhost:3000`.
2. Start a session and scan the QR code with your WhatsApp.

---

## Testing with Postman

### Authentication

All API endpoints require a Laravel session cookie (standard web auth). Use the login endpoint first.

**Login**

```
POST http://localhost:8000/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password"
}
```

Copy the session cookie from the response and attach it to all subsequent requests.

### Mark Invoice as Printed (generates PDF)

```
PATCH http://localhost:8000/invoices/{id}/printed
Cookie: <your-session-cookie>
X-XSRF-TOKEN: <csrf-token>
```

Response:

```json
{
  "success": true,
  "pdf_url": "http://localhost:8000/storage/invoices/INV-001.pdf"
}
```

Open the `pdf_url` in a browser to verify the generated PDF.

### Mark Invoice as Sent (generates PDF + triggers n8n)

```
PATCH http://localhost:8000/invoices/{id}/sent
Cookie: <your-session-cookie>
X-XSRF-TOKEN: <csrf-token>
```

Response:

```json
{
  "success": true,
  "message": "Invoice ditandai sent & dikirim ke n8n"
}
```

If n8n is not running, the invoice status still updates to `sent` and an error is logged to `storage/logs/laravel.log`. The failure is non-blocking by design.

### Postman Tips

- Fetch the CSRF token first by calling `GET /sanctum/csrf-cookie`, then include `X-XSRF-TOKEN` in subsequent requests.
- Set `Accept: application/json` so Laravel returns JSON instead of redirecting.
- You can use Postman's **Cookie Jar** to carry the session automatically across requests.

---

## Key API Routes

| Method | URI | Role | Description |
|--------|-----|------|-------------|
| GET | `/invoices` | Admin, Finance | List all invoices |
| GET | `/invoices/create` | Finance | Invoice creation form |
| POST | `/invoices` | Finance | Store new invoice |
| GET | `/invoices/{id}` | Admin, Finance | Invoice detail |
| GET | `/invoices/{id}/edit` | Finance | Edit form |
| PATCH | `/invoices/{id}` | Finance | Update invoice |
| DELETE | `/invoices/{id}` | Finance | Delete invoice (draft only) |
| PATCH | `/invoices/{id}/printed` | Finance | Mark printed, generate PDF |
| PATCH | `/invoices/{id}/sent` | Finance | Mark sent, generate PDF, trigger n8n |
| GET | `/invoices/{id}/print` | Admin, Finance | Print preview page |
| GET | `/companies` | Admin | Company list |
| GET | `/products` | Admin | Product list |
| GET | `/customers` | Finance | Customer list |

---

## Deployment

### Production Environment

Update `.env`:

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
```

### Optimize

```bash
composer install --optimize-autoloader --no-dev
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Web Server

Point the document root to the `public/` directory. Example Nginx config:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/invoice/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_name;
    }
}
```

### Queue Worker (required for notifications)

```bash
php artisan queue:work --daemon
```

Use a process manager like Supervisor to keep it running.

---

## Project Structure

```
app/
  Http/Controllers/
    InvoiceController.php    # Invoice CRUD + PDF generation + n8n trigger
    CompanyController.php    # Company management (Admin only)
    ProductController.php    # Product management (Admin only)
    CustomerController.php   # Customer management (Finance only)
  Models/
    Invoice.php
    User.php                 # Roles: admin | finance
    Company.php
    Product.php
    Customer.php
  Notifications/             # Laravel notifications for in-app + email alerts
resources/
  js/pages/
    Invoices/                # Invoice list, create, edit, show, print
    Products/
    Customers/
    Company/
    dashboard.jsx
    LandingPage.jsx
  views/pdf/
    invoice.blade.php        # Blade template rendered by DomPDF
routes/
  invoice.php                # All application routes
docker-compose.yml           # n8n + WAHA services
n8n-send-invoice-workflow.json
```
