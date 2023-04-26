CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create schema test;

create table test.user (
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

-- create table test.device(
--     id serial primary key,
--     uuid uuid not null default uuid_generate_v4(),
--     refresh_token_hash varchar,
--     is_verified boolean default false,
--     user_id int references test.user(id) on delete cascade
-- );

create table test.role(
    id serial primary key,
    name varchar not null unique
);

create table test.auth(
    user_uuid uuid primary key references test.user(uuid) on delete cascade,
    password_hash varchar not null,
    is_phone_verified boolean default false,
    is_email_verified boolean default false,
    created_at timestamp default now(),
    role_id int not null default 0 references test.role(id)
);

insert into
    test.role(name)
values
    ('user'),
    ('admin');

create table test.event(
    uuid uuid primary key default uuid_generate_v4(),
    name varchar not null,
    description text,
    location geometry not null,
    created_at timestamp default now(),
    start_date timestamp,
    user_uuid uuid not null references test.user(uuid) on delete cascade
);

-- create table test.event_content(
--     id serial primary key,
--     uuid uuid not null default uuid_generate_v4(),
--     event_id int not null references test.event(id) on delete cascade,
--     content text not null,
--     created_at timestamp default now()
-- );

-- create or replace function test.insert_event_content() 
-- returns trigger as $$ begin
-- insert into
--     test.event_content(event_id, content)
-- values
--     (new.id, '');

-- return new;

-- end $$ language 'plpgsql';

-- drop trigger if exists insert_event_content_trigger on test.event;

-- create trigger insert_event_content_trigger 
-- after insert
--     on test.event for each row execute procedure test.insert_event_content();

create table test.category(
    uuid uuid primary key default uuid_generate_v4(),
    name varchar not null unique,
    description text,
    image_url text
);

-- create table test.subcategory(
--     id serial primary key,
--     uuid uuid not null default uuid_generate_v4(),
--     name varchar not null unique,
--     description text,
--     image_url text,
--     category_id int references test.category(id) on delete cascade
-- );
