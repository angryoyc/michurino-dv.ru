#!./!applay_sql_2_local_db_MICHURINO.sh -W

--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET search_path = m, pg_catalog;
SET default_tablespace = '';
SET default_with_oids = false;

--
-- Name: users; Type: TABLE; Schema: m; Owner: postgres
--

drop table m.users cascade;

CREATE TABLE m.users (
	iduser bigint NOT NULL,
	username varchar(50),
	md5pass varchar(32),
	id bigint,
	enabled boolean,
	dt timestamp,
	provider varchar(20),
	rights int
);

ALTER TABLE m.users OWNER TO postgres;


CREATE SEQUENCE m.users_iduser_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE m.users_iduser_seq OWNER TO postgres;
ALTER SEQUENCE m.users_iduser_seq OWNED BY m.users.iduser;
ALTER TABLE ONLY m.users ALTER COLUMN iduser SET DEFAULT nextval('m.users_iduser_seq'::regclass);
SELECT pg_catalog.setval('m.users_iduser_seq', 1, false);
ALTER TABLE ONLY m.users ADD CONSTRAINT user_pkey PRIMARY KEY (iduser);

--
-- GRANTS:
--

REVOKE ALL ON TABLE m.users FROM PUBLIC;
REVOKE ALL ON TABLE m.users FROM postgres;
REVOKE ALL ON TABLE m.users FROM site;
GRANT ALL ON TABLE m.users TO postgres;
GRANT ALL ON TABLE m.users TO site;

REVOKE ALL ON SEQUENCE m.users_iduser_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE m.users_iduser_seq FROM postgres;
REVOKE ALL ON SEQUENCE m.users_iduser_seq FROM site;
GRANT ALL ON SEQUENCE m.users_iduser_seq TO postgres;
GRANT ALL ON SEQUENCE m.users_iduser_seq TO site;

insert into m.users (username, md5pass, enabled, dt, rights, provider) values ('admin', 'f6fdffe48c908deb0f4c3bd36c032e72', true, now(), 15, 'mc') returning iduser;
insert into m.users (username, md5pass, enabled, dt, rights, provider) values ('serg', 'e0e581846e613fb1beadc89c885ba0fa', true, now(), 15, 'mc') returning iduser;

update m.users set id=iduser where iduser=(select iduser from m.users where username='admin');
select * from m.users;


