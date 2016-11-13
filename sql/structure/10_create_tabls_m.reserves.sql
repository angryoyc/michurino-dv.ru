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

drop table m.reserves cascade;

CREATE TABLE m.reserves (
	idreserve bigint NOT NULL,
	idstead int,
	from_dt timestamptz,
	to_dt timestamptz,
	type varchar(10),
	fio varchar(50),
	phone varchar(25),
	contract_nom varchar(25),
	contract_date date,
	price int,
	note text
);

ALTER TABLE m.reserves OWNER TO postgres;

CREATE SEQUENCE m.reserves_idreserve_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE m.reserves_idreserve_seq OWNER TO postgres;
ALTER SEQUENCE m.reserves_idreserve_seq OWNED BY m.reserves.idreserve;
ALTER TABLE ONLY m.reserves ALTER COLUMN idreserve SET DEFAULT nextval('m.reserves_idreserve_seq'::regclass);
SELECT pg_catalog.setval('m.reserves_idreserve_seq', 1, false);
ALTER TABLE ONLY m.reserves ADD CONSTRAINT reserves_pkey PRIMARY KEY (idreserve);

ALTER TABLE ONLY m.reserves ADD CONSTRAINT constr_reserves2steads  FOREIGN KEY (idstead) REFERENCES m.steads(idstead) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- GRANTS:
--

REVOKE ALL ON TABLE m.reserves FROM PUBLIC;
REVOKE ALL ON TABLE m.reserves FROM postgres;
REVOKE ALL ON TABLE m.reserves FROM site;
GRANT ALL ON TABLE m.reserves TO postgres;
GRANT ALL ON TABLE m.reserves TO site;

REVOKE ALL ON SEQUENCE m.reserves_idreserve_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE m.reserves_idreserve_seq FROM postgres;
REVOKE ALL ON SEQUENCE m.reserves_idreserve_seq FROM site;
GRANT ALL ON SEQUENCE m.reserves_idreserve_seq TO postgres;
GRANT ALL ON SEQUENCE m.reserves_idreserve_seq TO site;
