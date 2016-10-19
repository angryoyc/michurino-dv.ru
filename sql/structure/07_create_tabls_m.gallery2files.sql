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

drop table m.gallery2files cascade;

CREATE TABLE m.gallery2files (
	idgallery bigint NOT NULL,
	idfile bigint NOT NULL
);

ALTER TABLE m.gallery2files OWNER TO postgres;
ALTER TABLE ONLY m.gallery2files ADD CONSTRAINT galleryfile_pkey PRIMARY KEY (idgallery, idfile);
CREATE INDEX gallery2files_idgallery ON m.gallery2files USING btree (idgallery);
CREATE INDEX gallery2files_idfile ON m.gallery2files USING btree (idfile);

ALTER TABLE ONLY m.gallery2files ADD CONSTRAINT constr_gallery2files_gallery  FOREIGN KEY (idgallery) REFERENCES m.gallery(idgallery) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY m.gallery2files ADD CONSTRAINT constr_gallery2files_files  FOREIGN KEY (idfile) REFERENCES m.files(idfile) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;

--
-- GRANTS:
--

REVOKE ALL ON TABLE m.gallery2files FROM PUBLIC;
REVOKE ALL ON TABLE m.gallery2files FROM postgres;
REVOKE ALL ON TABLE m.gallery2files FROM site;
GRANT ALL ON TABLE m.gallery2files TO postgres;
GRANT ALL ON TABLE m.gallery2files TO site;



