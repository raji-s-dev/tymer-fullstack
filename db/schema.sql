--
-- PostgreSQL database dump
--

\restrict z2lO5Xa9nJFNpJtdQvhCWWK6U5CuEbkyA6b8jOpnfGYXZoAang7mcLlnrAkwSVV

-- Dumped from database version 18.1 (Debian 18.1-1.pgdg12+2)
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: task_state; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.task_state AS ENUM (
    'upcoming',
    'pending',
    'active',
    'completed',
    'cooldown',
    'missed',
    'action_required',
    'available'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: countup_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.countup_metadata (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    task_id uuid NOT NULL,
    completed_date date NOT NULL,
    completed_time time without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: ondemand_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ondemand_metadata (
    task_id uuid NOT NULL,
    duration_value integer NOT NULL,
    duration_unit text NOT NULL,
    cooldown_value integer NOT NULL,
    cooldown_unit text NOT NULL,
    last_completed_at timestamp without time zone,
    cooldown_end timestamp without time zone
);


--
-- Name: ondemandinstance_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ondemandinstance_metadata (
    task_id uuid NOT NULL,
    start_date date,
    start_time time without time zone,
    end_time time without time zone,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    parent_task_id uuid
);


--
-- Name: one_time_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.one_time_metadata (
    task_id uuid NOT NULL,
    start_date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL
);


--
-- Name: task_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.task_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    task_id uuid,
    event_type text NOT NULL,
    occurrence_timestamp timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tasks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    task_name text NOT NULL,
    task_details text,
    category text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    state public.task_state DEFAULT 'pending'::public.task_state,
    google_event_id text
);


--
-- Name: user_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_settings (
    user_id uuid NOT NULL,
    dark_mode boolean DEFAULT false,
    notification_enabled boolean DEFAULT true
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    google_id text,
    email text NOT NULL,
    name text,
    picture text,
    created_at timestamp without time zone DEFAULT now(),
    password text,
    otp text,
    is_verified boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now(),
    google_refresh_token text,
    google_calendar_email text,
    google_calendar_id text,
    google_access_token text
);


--
-- Name: countup_metadata countup_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countup_metadata
    ADD CONSTRAINT countup_metadata_pkey PRIMARY KEY (id);


--
-- Name: ondemand_metadata ondemand_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ondemand_metadata
    ADD CONSTRAINT ondemand_metadata_pkey PRIMARY KEY (task_id);


--
-- Name: ondemandinstance_metadata ondemandinstance_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ondemandinstance_metadata
    ADD CONSTRAINT ondemandinstance_metadata_pkey PRIMARY KEY (id);


--
-- Name: one_time_metadata one_time_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.one_time_metadata
    ADD CONSTRAINT one_time_metadata_pkey PRIMARY KEY (task_id);


--
-- Name: task_history task_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_history
    ADD CONSTRAINT task_history_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: users unique_email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- Name: user_settings user_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_pkey PRIMARY KEY (user_id);


--
-- Name: users users_google_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_google_id_key UNIQUE (google_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: countup_metadata countup_metadata_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countup_metadata
    ADD CONSTRAINT countup_metadata_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: ondemandinstance_metadata fk_parent_task; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ondemandinstance_metadata
    ADD CONSTRAINT fk_parent_task FOREIGN KEY (parent_task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: ondemand_metadata ondemand_metadata_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ondemand_metadata
    ADD CONSTRAINT ondemand_metadata_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: ondemandinstance_metadata ondemandinstance_metadata_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ondemandinstance_metadata
    ADD CONSTRAINT ondemandinstance_metadata_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: one_time_metadata one_time_metadata_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.one_time_metadata
    ADD CONSTRAINT one_time_metadata_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: task_history task_history_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_history
    ADD CONSTRAINT task_history_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_settings user_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict z2lO5Xa9nJFNpJtdQvhCWWK6U5CuEbkyA6b8jOpnfGYXZoAang7mcLlnrAkwSVV

