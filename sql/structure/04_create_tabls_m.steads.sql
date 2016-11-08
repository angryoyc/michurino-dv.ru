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
-- Name: steads; Type: TABLE; Schema: m; Owner: postgres
--

drop table m.steads cascade;

CREATE TABLE m.steads (
	idstead bigint NOT NULL,
	pp int,
	cadastr varchar(20),
	s int,
	groupnum int,
	price int,
	k real,
	status varchar(20),
	start varchar(100),
	points varchar(400)
);

ALTER TABLE m.steads OWNER TO postgres;


CREATE SEQUENCE m.steads_idstead_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE m.steads_idstead_seq OWNER TO postgres;
ALTER SEQUENCE m.steads_idstead_seq OWNED BY m.steads.idstead;
ALTER TABLE ONLY m.steads ALTER COLUMN idstead SET DEFAULT nextval('m.steads_idstead_seq'::regclass);
SELECT pg_catalog.setval('m.steads_idstead_seq', 1, false);
ALTER TABLE ONLY m.steads ADD CONSTRAINT steads_pkey PRIMARY KEY (idstead);

--
-- GRANTS:
--

REVOKE ALL ON TABLE m.steads FROM PUBLIC;
REVOKE ALL ON TABLE m.steads FROM postgres;
REVOKE ALL ON TABLE m.steads FROM site;
GRANT ALL ON TABLE m.steads TO postgres;
GRANT ALL ON TABLE m.steads TO site;

REVOKE ALL ON SEQUENCE m.steads_idstead_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE m.steads_idstead_seq FROM postgres;
REVOKE ALL ON SEQUENCE m.steads_idstead_seq FROM site;
GRANT ALL ON SEQUENCE m.steads_idstead_seq TO postgres;
GRANT ALL ON SEQUENCE m.steads_idstead_seq TO site;


COPY m.steads (groupnum, pp, cadastr, s) FROM stdin;
1	1	27:17:0329001:3463	827
1	2	27:17:0329001:3464	1000
1	3	27:17:0329001:3465	1000
1	4	27:17:0329001:3466	1000
1	5	27:17:0329001:3467	1000
1	6	27:17:0329001:3468	1000
1	7	27:17:0329001:3469	1000
1	8	27:17:0329001:3470	1000
1	9	27:17:0329001:3471	1276
1	10	27:17:0329001:3472	1200
1	11	27:17:0329001:3473	1200
1	12	27:17:0329001:3474	1200
1	13	27:17:0329001:3475	1200
1	14	27:17:0329001:3476	1270
1	15	27:17:0329001:3477	1890
2	16	27:17:0329001:3479	836
2	17	27:17:0329001:3480	1000
2	18	27:17:0329001:3478	1000
2	19	27:17:0329001:3481	1000
2	20	27:17:0329001:3482	1000
2	21	27:17:0329001:3483	1000
2	22	27:17:0329001:3484	1204
2	23	27:17:0329001:3485	1156
2	24	27:17:0329001:3486	1000
2	25	27:17:0329001:3487	1000
2	26	27:17:0329001:3488	1000
2	27	27:17:0329001:3489	1000
2	28	27:17:0329001:3490	1000
2	29	27:17:0329001:3491	1000
2	30	27:17:0329001:3492	1000
2	31	27:17:0329001:3493	1000
2	32	27:17:0329001:3494	1028
3	33	27:17:0329001:3495	843
3	34	27:17:0329001:3496	1000
3	35	27:17:0329001:3497	1000
3	36	27:17:0329001:3498	1000
3	37	27:17:0329001:3499	1000
3	38	27:17:0329001:3500	1267
3	39	27:17:0329001:3501	1219
3	40	27:17:0329001:3502	1000
3	41	27:17:0329001:3503	1000
3	42	27:17:0329001:3504	1000
3	43	27:17:0329001:3505	1000
3	44	27:17:0329001:3506	1000
3	45	27:17:0329001:3507	1000
3	46	27:17:0329001:3508	1000
3	47	27:17:0329001:3509	1243
4	48	27:17:0329001:3510	852
4	49	27:17:0329001:3511	1000
4	50	27:17:0329001:3512	1000
4	51	27:17:0329001:3513	1000
4	52	27:17:0329001:3514	1001
4	53	27:17:0329001:3515	952
4	54	27:17:0329001:3516	1000
4	55	27:17:0329001:3517	1000
4	56	27:17:0329001:3518	1000
4	57	27:17:0329001:3519	1000
4	58	27:17:0329001:3520	1000
4	59	27:17:0329001:3521	1000
4	60	27:17:0329001:3522	1100
5	61	27:17:0329001:3525	858
5	62	27:17:0329001:3526	1000
5	63	27:17:0329001:3527	1000
5	64	27:17:0329001:3528	1065
5	65	27:17:0329001:3529	1016
5	66	27:17:0329001:3530	1000
5	67	27:17:0329001:3531	1000
5	68	27:17:0329001:3532	1000
5	69	27:17:0329001:3533	1000
5	70	27:17:0329001:3534	1000
5	71	27:17:0329001:3523	1083
5	72	27:17:0329001:3524	1100
\.

update m.steads set status='free';
update m.steads set start='0,0';

update m.steads set k=1;
update m.steads set price=s*550;

select * from m.steads;
