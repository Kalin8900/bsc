CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE EXTENSION IF NOT EXISTS postgis_topology;

create schema production;


create table production.user (
    uuid uuid primary key default uuid_generate_v4(),
    first_name varchar not null,
    last_name varchar not null,
    email varchar not null unique,
    phone varchar(12) not null unique,
    created_at timestamp default now(),
    check(email like '%_@__%.__%'),
    check(first_name ~ '^[^0-9]*$'),
    check(last_name ~ '^[^0-9]*$')
);

-- create table production.device(
--     id serial primary key,
--     uuid uuid not null default uuid_generate_v4(),
--     refresh_token_hash varchar,
--     is_verified boolean default false,
--     user_id int references production.user(id) on delete cascade
-- );

create table production.role(
    id serial primary key,
    name varchar not null unique
);

create table production.auth(
    user_uuid uuid primary key references production.user(uuid) on delete cascade,
    password_hash varchar not null,
    is_phone_verified boolean default false,
    is_email_verified boolean default false,
    created_at timestamp default now(),
    role_id int not null default 0 references production.role(id)
);

insert into
    production.role(name)
values
    ('user'),
    ('admin');

create table production.event(
    uuid uuid primary key default uuid_generate_v4(),
    name varchar not null,
    description text,
    location geometry not null,
    created_at timestamp default now(),
    start_date timestamp,
    user_uuid uuid not null references production.user(uuid) on delete cascade
);

-- create table production.event_content(
--     id serial primary key,
--     uuid uuid not null default uuid_generate_v4(),
--     event_id int not null references production.event(id) on delete cascade,
--     content text not null,
--     created_at timestamp default now()
-- );

-- create or replace function production.insert_event_content() 
-- returns trigger as $$ begin
-- insert into
--     production.event_content(event_id, content)
-- values
--     (new.id, '');

-- return new;

-- end $$ language 'plpgsql';

-- drop trigger if exists insert_event_content_trigger on production.event;

-- create trigger insert_event_content_trigger 
-- after insert
--     on production.event for each row execute procedure production.insert_event_content();

create table production.category(
    uuid uuid primary key default uuid_generate_v4(),
    name varchar not null unique,
    description text,
    image_url text
);

-- create table production.subcategory(
--     id serial primary key,
--     uuid uuid not null default uuid_generate_v4(),
--     name varchar not null unique,
--     description text,
--     image_url text,
--     category_id int references production.category(id) on delete cascade
-- );
