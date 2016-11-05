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
-- Name: gallery; Type: TABLE; Schema: m; Owner: postgres
--

drop table m.gallery cascade;

CREATE TABLE m.gallery (
	idgallery bigint NOT NULL,
	title varchar(250),
	note text,
	enabled boolean,
	dt timestamp
);

alter table m.gallery alter column "enabled" set default false;

ALTER TABLE m.gallery OWNER TO postgres;


CREATE SEQUENCE m.gallery_idgallery_seq
	START WITH 1
	INCREMENT BY 1
	NO MINVALUE
	NO MAXVALUE
	CACHE 1;


ALTER TABLE m.gallery_idgallery_seq OWNER TO postgres;
ALTER SEQUENCE m.gallery_idgallery_seq OWNED BY m.gallery.idgallery;
ALTER TABLE ONLY m.gallery ALTER COLUMN idgallery SET DEFAULT nextval('m.gallery_idgallery_seq'::regclass);
SELECT pg_catalog.setval('m.gallery_idgallery_seq', 1, false);
ALTER TABLE ONLY m.gallery ADD CONSTRAINT gallery_pkey PRIMARY KEY (idgallery);

--
-- GRANTS:
--

REVOKE ALL ON TABLE m.gallery FROM PUBLIC;
REVOKE ALL ON TABLE m.gallery FROM postgres;
REVOKE ALL ON TABLE m.gallery FROM site;
GRANT ALL ON TABLE m.gallery TO postgres;
GRANT ALL ON TABLE m.gallery TO site;

REVOKE ALL ON SEQUENCE m.gallery_idgallery_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE m.gallery_idgallery_seq FROM postgres;
REVOKE ALL ON SEQUENCE m.gallery_idgallery_seq FROM site;
GRANT ALL ON SEQUENCE m.gallery_idgallery_seq TO postgres;
GRANT ALL ON SEQUENCE m.gallery_idgallery_seq TO site;



