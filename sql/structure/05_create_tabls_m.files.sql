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
-- Name: files; Type: TABLE; Schema: m; Owner: postgres
--

drop table m.files cascade;

CREATE TABLE m.files (
	idfile bigint NOT NULL,
	md5 varchar(32),
	path varchar(250),
	filename varchar(250),
	note text,
	mimetype varchar(20),
	"type" varchar(20),
	"size" int,
	dt timestamp
);

ALTER TABLE m.files OWNER TO postgres;


CREATE SEQUENCE m.files_idfile_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE m.files_idfile_seq OWNER TO postgres;
ALTER SEQUENCE m.files_idfile_seq OWNED BY m.files.idfile;
ALTER TABLE ONLY m.files ALTER COLUMN idfile SET DEFAULT nextval('m.files_idfile_seq'::regclass);
SELECT pg_catalog.setval('m.files_idfile_seq', 1, false);
ALTER TABLE ONLY m.files ADD CONSTRAINT files_pkey PRIMARY KEY (idfile);

--
-- GRANTS:
--

REVOKE ALL ON TABLE m.files FROM PUBLIC;
REVOKE ALL ON TABLE m.files FROM postgres;
REVOKE ALL ON TABLE m.files FROM site;
GRANT ALL ON TABLE m.files TO postgres;
GRANT ALL ON TABLE m.files TO site;

REVOKE ALL ON SEQUENCE m.files_idfile_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE m.files_idfile_seq FROM postgres;
REVOKE ALL ON SEQUENCE m.files_idfile_seq FROM site;
GRANT ALL ON SEQUENCE m.files_idfile_seq TO postgres;
GRANT ALL ON SEQUENCE m.files_idfile_seq TO site;



