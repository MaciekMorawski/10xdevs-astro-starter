-- Migration: Initial Schema Creation
-- Description: Creates the initial database schema for the Flashcards AI application
-- Tables: users, flashcards, tags, flashcard_tags, error_reports
-- Author: GitHub Copilot
-- Date: 2025-04-29

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_role as enum ('user', 'admin');
create type error_status as enum ('open', 'in_progress', 'resolved', 'rejected');

-- Create users table
create table users (
    id uuid primary key default uuid_generate_v4(),
    role user_role not null default 'user',
    email text not null unique,
    username text not null unique,
    password_hash text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on users table
alter table users enable row level security;

-- RLS Policies for users table
create policy "Users can view their own profile"
    on users for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on users for update
    using (auth.uid() = id);

-- Create flashcards table
create table flashcards (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references users(id) on delete cascade,
    front_text varchar(500) not null,
    back_text varchar(1000) not null,
    language_code varchar(10) not null,
    source_url text,
    raw_text text not null,
    generation_session_id uuid not null,
    next_review_at timestamptz not null,
    interval integer not null,
    ease_factor numeric(5,2) not null,
    repetition_count integer not null default 0,
    last_edited_at timestamptz not null default now(),
    accepted boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on flashcards table
alter table flashcards enable row level security;

-- Create unique index to prevent duplicate flashcards per user
create unique index flashcards_user_front_text_idx on flashcards(user_id, front_text);

-- Create index for review scheduling
create index flashcards_next_review_at_idx on flashcards(next_review_at);

-- RLS Policies for flashcards
create policy "Users can view their own flashcards"
    on flashcards for select
    using (auth.uid() = user_id);

create policy "Users can create their own flashcards"
    on flashcards for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own flashcards"
    on flashcards for update
    using (auth.uid() = user_id);

create policy "Users can delete their own flashcards"
    on flashcards for delete
    using (auth.uid() = user_id);

-- Create tags table
create table tags (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    slug text not null unique,
    description text,
    color varchar(20),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on tags table
alter table tags enable row level security;

-- Create index for tag slugs
create index tags_slug_idx on tags(slug);

-- RLS Policies for tags
create policy "Tags are viewable by all authenticated users"
    on tags for select
    to authenticated
    using (true);

create policy "Only admins can manage tags"
    on tags for all
    to authenticated
    using (exists (
        select 1 from users
        where users.id = auth.uid()
        and users.role = 'admin'
    ));

-- Create flashcard_tags junction table
create table flashcard_tags (
    flashcard_id uuid not null references flashcards(id) on delete cascade,
    tag_id uuid not null references tags(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (flashcard_id, tag_id)
);

-- Enable RLS on flashcard_tags table
alter table flashcard_tags enable row level security;

-- Create index for tag lookups
create index flashcard_tags_tag_id_idx on flashcard_tags(tag_id);

-- RLS Policies for flashcard_tags
create policy "Users can view tags for their flashcards"
    on flashcard_tags for select
    using (exists (
        select 1 from flashcards
        where flashcards.id = flashcard_tags.flashcard_id
        and flashcards.user_id = auth.uid()
    ));

create policy "Users can add tags to their flashcards"
    on flashcard_tags for insert
    with check (exists (
        select 1 from flashcards
        where flashcards.id = flashcard_tags.flashcard_id
        and flashcards.user_id = auth.uid()
    ));

create policy "Users can remove tags from their flashcards"
    on flashcard_tags for delete
    using (exists (
        select 1 from flashcards
        where flashcards.id = flashcard_tags.flashcard_id
        and flashcards.user_id = auth.uid()
    ));

-- Create error_reports table
create table error_reports (
    id uuid primary key default uuid_generate_v4(),
    flashcard_id uuid not null references flashcards(id) on delete cascade,
    user_id uuid not null references users(id) on delete cascade,
    status error_status not null default 'open',
    comment varchar(500),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    resolved_at timestamptz
);

-- Enable RLS on error_reports table
alter table error_reports enable row level security;

-- RLS Policies for error_reports
create policy "Users can view their own error reports"
    on error_reports for select
    using (auth.uid() = user_id);

create policy "Users can create error reports"
    on error_reports for insert
    with check (auth.uid() = user_id);

create policy "Admins can view all error reports"
    on error_reports for select
    to authenticated
    using (exists (
        select 1 from users
        where users.id = auth.uid()
        and users.role = 'admin'
    ));

create policy "Admins can update error reports"
    on error_reports for update
    to authenticated
    using (exists (
        select 1 from users
        where users.id = auth.uid()
        and users.role = 'admin'
    ));

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at columns
create trigger update_users_updated_at
    before update on users
    for each row
    execute function update_updated_at_column();

create trigger update_flashcards_updated_at
    before update on flashcards
    for each row
    execute function update_updated_at_column();

create trigger update_tags_updated_at
    before update on tags
    for each row
    execute function update_updated_at_column();

create trigger update_error_reports_updated_at
    before update on error_reports
    for each row
    execute function update_updated_at_column();