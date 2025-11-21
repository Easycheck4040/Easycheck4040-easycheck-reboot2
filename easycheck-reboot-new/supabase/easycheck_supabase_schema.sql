-- ============================================================
-- EASYCHECK — SCHEMA COMPLETO (OPÇÃO A)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================
-- companies
-- =====================
create table if not exists public.companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  vat_id text,
  created_at timestamptz default now()
);

-- Settings per company
create table if not exists public.company_settings (
  company_id uuid primary key references public.companies(id) on delete cascade,
  preferred_language text default 'pt',
  timezone text default 'Europe/Luxembourg',
  smtp_host text,
  smtp_port int,
  smtp_user text,
  smtp_from text,
  created_at timestamptz default now()
);

-- =====================
-- user_companies
-- =====================
create table if not exists public.user_companies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  company_id uuid not null references public.companies(id) on delete cascade,
  role text not null check (role in ('owner','manager','staff')),
  created_at timestamptz default now()
);

create index if not exists idx_user_companies_user on public.user_companies(user_id);
create index if not exists idx_user_companies_company on public.user_companies(company_id);

-- =====================
-- employees
-- =====================
create table if not exists public.employees (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null check (role in ('manager','staff')),
  is_active boolean default true,
  created_at timestamptz default now()
);
create index if not exists idx_employees_company on public.employees(company_id);

-- =====================
-- clients
-- =====================
create table if not exists public.clients (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  vat_id text,
  created_at timestamptz default now()
);
create index if not exists idx_clients_company on public.clients(company_id);

-- =====================
-- invoices
-- =====================
create table if not exists public.invoices (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  client_id uuid references public.clients(id),
  invoice_number text,
  issue_date date not null default current_date,
  due_date date,
  currency text default 'EUR',
  net_amount numeric(12,2) not null default 0,
  vat_rate numeric(5,2) not null default 0,
  vat_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  description text,
  status text not null default 'sent' check (status in ('draft','sent','paid','overdue','cancelled')),
  ocr_original_path text, -- storage path for scanned invoice
  created_at timestamptz default now()
);
create index if not exists idx_invoices_company on public.invoices(company_id);
create index if not exists idx_invoices_client on public.invoices(client_id);

-- Invoice items (optional)
create table if not exists public.invoice_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text,
  quantity numeric(12,2) default 1,
  unit_price numeric(12,2) default 0,
  total numeric(12,2) default 0
);
create index if not exists idx_invoice_items_invoice on public.invoice_items(invoice_id);

-- Auto-generate invoice_number per company: INV-1, INV-2, ...
create or replace function public.generate_invoice_number()
returns trigger as $$
declare last_number int;
begin
  select coalesce(max(cast(regexp_replace(invoice_number, '[^0-9]', '', 'g') as int)), 0)
  into last_number
  from public.invoices
  where company_id = new.company_id;

  new.invoice_number := 'INV-' || (last_number + 1);
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_invoice_number on public.invoices;
create trigger trg_invoice_number
before insert on public.invoices
for each row execute function public.generate_invoice_number();

-- =====================
-- emails_outbox (logs)
-- =====================
create table if not exists public.emails_outbox (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  to_address text not null,
  subject text not null,
  body text not null,
  sent_at timestamptz,
  status text not null default 'queued' check (status in ('queued','sent','failed')),
  error text
);
create index if not exists idx_emails_outbox_company on public.emails_outbox(company_id);

-- =====================
-- tasks (admin automation)
-- =====================
create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pending' check (status in ('pending','done','cancelled')),
  created_at timestamptz default now()
);
create index if not exists idx_tasks_company on public.tasks(company_id);

-- =====================
-- tickets (client support)
-- =====================
create table if not exists public.tickets (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  customer_email text,
  subject text,
  body text,
  status text not null default 'open' check (status in ('open','pending','closed')),
  created_at timestamptz default now()
);
create index if not exists idx_tickets_company on public.tickets(company_id);

-- =====================
-- public customer chat
-- =====================
create table if not exists public.customer_conversations (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  customer_email text,
  lang text default 'auto',
  created_at timestamptz default now()
);

create table if not exists public.customer_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.customer_conversations(id) on delete cascade,
  role text not null check (role in ('customer','assistant')),
  content text not null,
  meta jsonb,
  created_at timestamptz default now()
);

-- ============================================================
-- RLS
-- ============================================================
alter table public.companies enable row level security;
alter table public.company_settings enable row level security;
alter table public.user_companies enable row level security;
alter table public.employees enable row level security;
alter table public.clients enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.emails_outbox enable row level security;
alter table public.tasks enable row level security;
alter table public.tickets enable row level security;
alter table public.customer_conversations enable row level security;
alter table public.customer_messages enable row level security;

-- Helper: is member of a company
create or replace function public.is_company_member(cid uuid)
returns boolean as $$
  select exists (
    select 1 from public.user_companies uc
    where uc.company_id = cid and uc.user_id = auth.uid()
  );
$$ language sql stable;

-- companies
drop policy if exists "companies by membership" on public.companies;
create policy "companies by membership" on public.companies
for select using (public.is_company_member(id));

-- company_settings
drop policy if exists "company_settings by membership" on public.company_settings;
create policy "company_settings by membership" on public.company_settings
for all using (public.is_company_member(company_id))
with check (public.is_company_member(company_id));

-- user_companies
drop policy if exists "user_companies self" on public.user_companies;
create policy "user_companies self" on public.user_companies
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

-- employees
drop policy if exists "employees by company" on public.employees;
create policy "employees by company" on public.employees
for all using (public.is_company_member(company_id))
with check (public.is_company_member(company_id));

-- clients
drop policy if exists "clients by company" on public.clients;
create policy "clients by company" on public.clients
for all using (public.is_company_member(company_id))
with check (public.is_company_member(company_id));

-- invoices
drop policy if exists "invoices by company" on public.invoices;
create policy "invoices by company" on public.invoices
for all using (public.is_company_member(company_id))
with check (public.is_company_member(company_id));

-- invoice_items
drop policy if exists "invoice_items by invoice company" on public.invoice_items;
create policy "invoice_items by invoice company" on public.invoice_items
for all using (
  exists (
    select 1 from public.invoices i
    where i.id = invoice_id and public.is_company_member(i.company_id)
  )
)
with check (
  exists (
    select 1 from public.invoices i
    where i.id = invoice_id and public.is_company_member(i.company_id)
  )
);

-- emails_outbox
drop policy if exists "emails_outbox by company" on public.emails_outbox;
create policy "emails_outbox by company" on public.emails_outbox
for all using (public.is_company_member(company_id))
with check (public.is_company_member(company_id));

-- tasks
drop policy if exists "tasks by company" on public.tasks;
create policy "tasks by company" on public.tasks
for all using (public.is_company_member(company_id))
with check (public.is_company_member(company_id));

-- tickets
drop policy if exists "tickets by company" on public.tickets;
create policy "tickets by company" on public.tickets
for all using (public.is_company_member(company_id))
with check (public.is_company_member(company_id));

-- customer_conversations/messages are written by API (service_role), no anon policies by default.
