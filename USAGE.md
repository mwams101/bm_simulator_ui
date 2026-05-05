# BankSim Data Migration Platform — Usage Guide

A mock banking data migration simulator. This guide covers everything implemented to date: admin configuration, the full migration pipeline (including reporting), and supporting management pages.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Prerequisites & Setup](#prerequisites--setup)
3. [Navigation](#navigation)
4. [Admin Configuration (Do This First)](#admin-configuration-do-this-first)
   - [Users](#users)
   - [Destination Schemas & Schema Fields](#destination-schemas--schema-fields)
   - [Mapping Templates](#mapping-templates)
5. [Running a Migration — End to End](#running-a-migration--end-to-end)
   - [Step 1 — Create a Migration Job](#step-1--create-a-migration-job)
   - [Step 2 — Upload a Source File](#step-2--upload-a-source-file)
   - [Step 3 — Configure Field Mappings](#step-3--configure-field-mappings)
   - [Step 4 — Start Mapping](#step-4--start-mapping)
   - [Step 5 — Start Validation](#step-5--start-validation)
   - [Step 6 — Review & Execute](#step-6--review--execute)
   - [Step 7 — Generate Reports](#step-7--generate-reports)
6. [Post-Migration Pages](#post-migration-pages)
   - [Migrated Customers](#migrated-customers)
   - [Migrated Accounts](#migrated-accounts)
   - [Notifications](#notifications)
   - [Audit Logs](#audit-logs)
7. [Sample Data Walkthrough](#sample-data-walkthrough)
8. [Pipeline Status Reference](#pipeline-status-reference)
9. [Transformation Rules Reference](#transformation-rules-reference)
10. [Field Routing Reference](#field-routing-reference)

---

## System Overview

The platform simulates a bank-to-bank data migration. It takes source data (CSV / Excel), transforms it according to configurable field mapping rules, validates it against a destination schema, writes the result to new customer and account records, and finally generates a structured report of the outcome.

```
Upload File → Map Fields → Validate → Preview → Execute → Report
   PENDING  →  MAPPING  → VALIDATING → PREVIEWING → EXECUTING → COMPLETED
```

All data is pseudonymised and for simulation purposes only.

---

## Prerequisites & Setup

### Backend (FastAPI)

```bash
cd bm_simulator
pip install -r requirements.txt
uvicorn main:app --reload
```

The API runs at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### Frontend (React + Vite)

```bash
cd bm-simulator-frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### First Login

The backend must have at least one admin user seeded in the database. Log in at `/login` with your admin credentials. All pages require authentication — you will be redirected to `/login` on any 401/403 response.

---

## Navigation

The header contains all top-level navigation links:

| Link | Route | Purpose |
|------|-------|---------|
| Dashboard | `/` | System overview and recent activity |
| Users | `/users` | Manage system users |
| Schemas | `/schemas` | Destination schema definitions |
| Schema-fields | `/schema-fields` | Fields within a schema |
| Mapping-templates | `/mapping-templates` | Reusable mapping configurations |
| Migration Jobs | `/migration-jobs` | Run and manage migrations |
| Customers | `/customers` | View/manage migrated customers |
| Accounts | `/accounts` | View/manage migrated accounts |
| Notifications | `/notifications` | System alerts |
| Audit Logs | `/audit-logs` | Full action history |

---

## Admin Configuration (Do This First)

Before running any migration, set up the reference data that jobs depend on.

### Users

**Route:** `/users`

Create and manage system users. Each user has a role of **Migration Operator** (USER) or **Administrator** (ADMIN). Only admins can access all API endpoints.

- Click **Add New User** to create a user
- The action menu (⋮) on each row supports **Edit** (username, email, role, optional new password) and **Delete**
- You cannot delete your own account

### Destination Schemas & Schema Fields

**Routes:** `/schemas` and `/schema-fields`

A destination schema defines the structure of the data you are migrating *into*. The validation service checks each transformed record against these field definitions.

**Create a schema:**
1. Go to `/schemas` → **Create New Schema**
2. Give it a name (e.g. `Standard_Retail_v1`) and description
3. Save

**Add fields to the schema:**
1. Go to `/schema-fields` → **Add Schema Field**
2. Select your schema from the dropdown
3. For each field define:
   - **Name** — must match the destination field name used in your field mapping (e.g. `first_name`)
   - **Data Type** — `string`, `integer`, `float`, `boolean`, `date`, `email`
   - **Required** — triggers a MISSING_FIELD error if empty
   - **Unique** — triggers duplicate detection across the batch
   - **Max Length** — triggers a WARNING if exceeded
   - **Validation Rule** — optional regex (e.g. `\d{9}` for a 9-digit account number)
   - **Default Value** — shown as the suggested fix in validation results
   - **Field Order** — display/processing order

> **Tip for the sample data:** Create fields named exactly `email` (type: email, required: true, unique: true) and `account_number` (type: integer, required: true, unique: true). These are the key uniqueness checks the validation and execution services use.

### Mapping Templates

**Route:** `/mapping-templates`

A mapping template is a reusable named configuration that you attach to a field mapping inside a migration job. It acts as a label — the actual field-to-field rules live in the field mapping details.

1. Click **Create New Template**
2. Give it a name (e.g. `Retail_Customer_Template`) and description
3. Set **Active** to on
4. Save

---

## Running a Migration — End to End

### Step 1 — Create a Migration Job

**Route:** `/migration-jobs` → **New Migration Job**

| Field | Description |
|-------|-------------|
| Job Name | Unique name for this run (e.g. `Retail_Q2_2026`) |
| Destination Schema | Schema to validate transformed data against (optional at creation, **required before validation**) |

The job is created in **PENDING** status.

---

### Step 2 — Upload a Source File

1. Click the job name to open the **Job Detail** page
2. Go to the **Setup** tab
3. In the **Source Files** section, drag a file onto the drop zone or click to browse
4. Accepted formats: **CSV**, **XLSX**, **XLS**
5. The file is saved to `uploads/<job_id>/` on the server and registered in the database

> Use the sample file at `sample_data/migration_sample.csv` included in this repo.

---

### Step 3 — Configure Field Mappings

Still in the **Setup** tab:

**Add a Field Mapping:**
1. Click **Add Mapping** in the Field Mappings section
2. Select a **Mapping Template**
3. Set **Mapping Rules** JSON (global options):
   ```json
   {
     "skip_empty_rows": true,
     "encoding": "utf-8",
     "customer_fields": ["first_name","last_name","date_of_birth","email","phone_masked","address_line_1","address_line_2","city","state","postal_code","country","customer_type","customer_status"],
     "account_fields": ["account_number","account_type","balance","currency","account_open_date","account_status"]
   }
   ```
4. Save — the mapping appears in the table; click its row to select it

**Add Field Mapping Details:**

After selecting a field mapping, the **Field Mapping Details** sub-section appears. You have two ways to add details:

**Option A — Quick Map (recommended for identity mappings):**
1. Click **Quick Map** in the Field Mapping Details header
2. Paste a comma-separated list of all column names from your source file:
   ```
   first_name, last_name, date_of_birth, email, phone_masked, address_line_1, address_line_2, city, state, postal_code, country, customer_type, customer_status, account_number, account_type, balance, currency, account_open_date, account_status
   ```
3. Click **Apply** — one identity detail (`source = destination`, rule = `none`) is created for each column in one batch

**Option B — Manual (one at a time):**

Add one detail per source column using the form. Use this when you need a non-identity mapping (different destination name or transformation rule):

| Source Field | Destination Field | Order | Transformation |
|---|---|---|---|
| `first_name` | `first_name` | 1 | `none` |
| `last_name` | `last_name` | 2 | `none` |
| `date_of_birth` | `date_of_birth` | 3 | `none` |
| `email` | `email` | 4 | `lowercase` |
| `phone_masked` | `phone_masked` | 5 | `none` |
| `address_line_1` | `address_line_1` | 6 | `none` |
| `address_line_2` | `address_line_2` | 7 | `none` |
| `city` | `city` | 8 | `none` |
| `state` | `state` | 9 | `none` |
| `postal_code` | `postal_code` | 10 | `none` |
| `country` | `country` | 11 | `none` |
| `customer_type` | `customer_type` | 12 | `lowercase` |
| `customer_status` | `customer_status` | 13 | `lowercase` |
| `account_number` | `account_number` | 14 | `none` |
| `account_type` | `account_type` | 15 | `lowercase` |
| `balance` | `balance` | 16 | `none` |
| `currency` | `currency` | 17 | `uppercase` |
| `account_open_date` | `account_open_date` | 18 | `none` |
| `account_status` | `account_status` | 19 | `lowercase` |

> The `customer_fields` and `account_fields` arrays in `mapping_rules` tell the execution service which destination fields belong to `NewBankCustomer` vs `NewBankAccount`. If omitted, the service falls back to built-in defaults that match the table above.

---

### Step 4 — Start Mapping

1. At the bottom of the **Setup** tab, click **Start Mapping**
2. The service reads the uploaded file row-by-row, applies your field mapping details, and creates a `MigrationRecord` for each row
3. Status advances: **PENDING → MAPPING → VALIDATING**
4. Switch to the **Records** tab to see the created records with source and transformed data side by side (click the expand arrow on any row)

---

### Step 5 — Start Validation

1. Go to the **Validation** tab
2. Click **Start Validation** (amber button, only visible in VALIDATING status)
3. The service checks each transformed record against your destination schema fields:
   - Missing required fields → **ERROR**
   - Wrong data type → **ERROR**
   - Duplicate unique-field values → **ERROR** + duplicate detection entry
   - Max length exceeded → **WARNING**
   - Regex validation rule failed → **WARNING**
4. Status advances: **VALIDATING → PREVIEWING**
5. The Validation Results and Duplicate Detections tables populate
6. For each duplicate detection, set a **Resolution**: Skip, Merge, or Manual Review

> Records with any ERROR are marked FAILED and will not be committed during execution. WARNING records still pass.

---

### Step 6 — Review & Execute

1. Go to the **Records** tab
2. Review the transformed data — expand any row to compare source vs transformed
3. When satisfied, click **Execute Migration** (emerald button, only visible in PREVIEWING status)
4. The service commits each SUCCESS record to `NewBankCustomer` and `NewBankAccount` tables:
   - Duplicate customers (same email under same job) are skipped, not errored
   - Duplicate accounts (same account_number globally) are also skipped
5. Status advances: **PREVIEWING → EXECUTING → COMPLETED**
6. An execution summary appears showing **Committed / Skipped / Failed** counts

---

### Step 7 — Generate Reports

1. Go to the **Reports** tab (available on any job, but generation requires COMPLETED or FAILED status)
2. Select a report type from the dropdown:

| Type | Content |
|------|---------|
| **Summary** | Job info, record counts, validation totals, duplicate group count |
| **Detailed** | Everything in Summary, plus up to 100 failed record entries with error messages |
| **Validation** | Same as Detailed — focused on validation and failure detail |

3. Click **Generate** — the backend writes a JSON file to `reports/<job_id>/` on the server and registers a `MigrationReport` row; a Notification and Audit Log entry are also created automatically
4. The new report appears in the **Generated Reports** list below
5. Click **View** on any report to expand an inline structured viewer showing:
   - Job metadata (name, status, start/end times)
   - Record count stats (total, successful, failed)
   - Validation breakdown (errors, warnings, counts by type)
   - Duplicate group count
   - Failed records list (Detailed/Validation types only)
6. Click **View** again to collapse. Click the delete icon to remove the report row (the file on disk is retained)

---

## Post-Migration Pages

### Migrated Customers

**Route:** `/customers`

All `NewBankCustomer` records created by migrations. Supports:
- **Search** by name, email, city, or status
- **View** — opens a detail modal showing all personal info and the customer's linked accounts with balances
- **Edit** — update contact info, address, and status
- **Delete** — removes the customer record

### Migrated Accounts

**Route:** `/accounts`

All `NewBankAccount` records. Supports:
- **Search** by account number, type, status, or currency
- **Edit** — update balance and status only (account number and type are immutable after creation)
- **Delete** — removes the account record
- **Add Account** — manually link a new account to an existing customer

### Notifications

**Route:** `/notifications`

System notifications generated around migration events (including automatic report-ready alerts). Supports:
- **Mark as Sent** — click the ✓ icon on any PENDING notification to set status to SENT with a timestamp
- **Delete** — removes the notification
- Pending count is shown as a badge in the page header

### Audit Logs

**Route:** `/audit-logs`

Read-only chronological log of all system actions (newest first). Each entry shows the action type, description, user, linked job, and IP address. Click the expand arrow to view raw request/response data. Entries can be deleted individually.

---

## Sample Data Walkthrough

The file `sample_data/migration_sample.csv` contains 10 mock bank customers with linked accounts. Column names match the default field routing used by the execution service, so minimal configuration is needed.

**What's in the file:**

| Column Group | Columns |
|---|---|
| Customer identity | `first_name`, `last_name`, `date_of_birth`, `email`, `phone_masked` |
| Customer address | `address_line_1`, `address_line_2`, `city`, `state`, `postal_code`, `country` |
| Customer meta | `customer_type` (individual/business), `customer_status` (active) |
| Account | `account_number`, `account_type`, `balance`, `currency`, `account_open_date`, `account_status` |

**Quick-start steps:**
1. Create a Destination Schema (e.g. `Retail_v1`) with fields for `email` (unique, required) and `account_number` (unique, required)
2. Create a Mapping Template (e.g. `Retail_Template`)
3. Create a Migration Job — select your schema
4. Upload `migration_sample.csv`
5. Add a Field Mapping using your template with the `customer_fields` / `account_fields` mapping_rules JSON shown in Step 3
6. Use **Quick Map** to create all 19 identity field mapping details in one step
7. Click **Start Mapping** → **Start Validation** → **Execute Migration**
8. Check `/customers` and `/accounts` — 10 customers and 10 accounts should appear
9. Go to the **Reports** tab and generate a Summary report to capture the outcome

---

## Pipeline Status Reference

| Status | Meaning | Next Action |
|--------|---------|-------------|
| `pending` | Job created, awaiting setup | Upload file, configure mappings, click **Start Mapping** |
| `mapping` | Mapping service is running | Wait — auto-advances |
| `validating` | Records created, awaiting validation | Click **Start Validation** in the Validation tab |
| `previewing` | Validation complete, ready to commit | Review records, click **Execute Migration** in the Records tab |
| `executing` | Execution service is running | Wait — auto-advances |
| `completed` | All records committed | Generate a report in the Reports tab |
| `failed` | Service error | Check the error message shown in the job header card; a report can still be generated |

---

## Transformation Rules Reference

Set in the **Transformation** column of Field Mapping Details:

| Rule | Effect | Example |
|------|--------|---------|
| `none` | Pass value through unchanged | `James` → `James` |
| `uppercase` | Convert to uppercase | `usd` → `USD` |
| `lowercase` | Convert to lowercase | `INDIVIDUAL` → `individual` |
| `strip` | Remove leading/trailing whitespace | ` Lagos ` → `Lagos` |
| `date_format:FORMAT` | Parse and reformat a date | `date_format:%d/%m/%Y` converts `01/06/2018` → ISO |

---

## Field Routing Reference

The execution service uses `mapping_rules.customer_fields` and `mapping_rules.account_fields` to split a flat transformed row into a customer record and an account record. If these keys are absent from `mapping_rules`, the following defaults apply:

**Default customer fields:**
`first_name`, `last_name`, `date_of_birth`, `email`, `phone_masked`, `address_line_1`, `address_line_2`, `city`, `state`, `postal_code`, `country`, `customer_type`, `customer_status`

**Default account fields:**
`account_number`, `account_type`, `balance`, `currency`, `account_open_date`, `account_status`

> The destination field name must match the key used in `transformed_data` exactly (case-sensitive). Enum values for `customer_type` (`individual`, `business`), `customer_status` (`active`, `inactive`, `suspended`), `account_type` (`savings`, `checking`, `credit`, `loan`), and `account_status` (`active`, `closed`, `frozen`) must be lowercase.
