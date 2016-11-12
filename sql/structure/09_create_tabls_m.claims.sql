#!./!applay_sql_2_local_db_MICHURINO.sh -W

--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET client_min_messages = warning;
SET search_path = m, pg_catalog;
SET default_tablespace = '';
SET default_with_oids = false;

--
-- Name: params; Type: TABLE; Schema: m; Owner: postgres
--

drop table m.claims cascade;

CREATE TABLE m.claims (
	idclaim bigint NOT NULL,
	dt timestamp,
	alias varchar(20),
	idstead int,
	fio varchar(50),
	phone varchar(25),
	note text
);
ALTER TABLE m.claims OWNER TO postgres;

CREATE SEQUENCE m.claims_idclaim_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE m.claims_idclaim_seq OWNER TO postgres;
ALTER SEQUENCE m.claims_idclaim_seq OWNED BY m.claims.idclaim;
ALTER TABLE ONLY m.claims ALTER COLUMN idclaim SET DEFAULT nextval('m.claims_idclaim_seq'::regclass);
SELECT pg_catalog.setval('m.claims_idclaim_seq', 1, false);
ALTER TABLE ONLY m.claims ADD CONSTRAINT claims_pkey PRIMARY KEY (idclaim);

ALTER TABLE ONLY m.claims ADD CONSTRAINT constr_claims2steads  FOREIGN KEY (idstead) REFERENCES m.steads(idstead) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- GRANTS:
--

REVOKE ALL ON TABLE m.claims FROM PUBLIC;
REVOKE ALL ON TABLE m.claims FROM postgres;
REVOKE ALL ON TABLE m.claims FROM site;
GRANT ALL ON TABLE m.claims TO postgres;
GRANT ALL ON TABLE m.claims TO site;

REVOKE ALL ON SEQUENCE m.claims_idclaim_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE m.claims_idclaim_seq FROM postgres;
REVOKE ALL ON SEQUENCE m.claims_idclaim_seq FROM site;
GRANT ALL ON SEQUENCE m.claims_idclaim_seq TO postgres;
GRANT ALL ON SEQUENCE m.claims_idclaim_seq TO site;
