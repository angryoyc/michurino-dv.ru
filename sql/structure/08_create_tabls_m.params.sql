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
-- Name: params; Type: TABLE; Schema: m; Owner: postgres
--

drop table m.params cascade;

CREATE TABLE m.params (
	idparam bigint NOT NULL,
	param varchar(20),
	val varchar(200)
);

ALTER TABLE m.params OWNER TO postgres;


CREATE SEQUENCE m.params_idparam_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE m.params_idparam_seq OWNER TO postgres;
ALTER SEQUENCE m.params_idparam_seq OWNED BY m.params.idparam;
ALTER TABLE ONLY m.params ALTER COLUMN idparam SET DEFAULT nextval('m.params_idparam_seq'::regclass);
SELECT pg_catalog.setval('m.params_idparam_seq', 1, false);
ALTER TABLE ONLY m.params ADD CONSTRAINT params_pkey PRIMARY KEY (idparam);

--
-- GRANTS:
--

REVOKE ALL ON TABLE m.params FROM PUBLIC;
REVOKE ALL ON TABLE m.params FROM postgres;
REVOKE ALL ON TABLE m.params FROM site;
GRANT ALL ON TABLE m.params TO postgres;
GRANT ALL ON TABLE m.params TO site;

REVOKE ALL ON SEQUENCE m.params_idparam_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE m.params_idparam_seq FROM postgres;
REVOKE ALL ON SEQUENCE m.params_idparam_seq FROM site;
GRANT ALL ON SEQUENCE m.params_idparam_seq TO postgres;
GRANT ALL ON SEQUENCE m.params_idparam_seq TO site;

