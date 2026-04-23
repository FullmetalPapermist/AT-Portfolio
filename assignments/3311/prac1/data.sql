--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 17.5

-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET transaction_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;

--
-- Data for Name: beer_styles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.beer_styles (id, name) FROM stdin;
1	Pale Ale
2	Lager
3	IPA
4	Porter
5	Stout
6	Brown Ale
7	Amber Ale
8	Pilsner
9	Saison
10	Wheat Beer
11	Barleywine
12	Bock
13	Hefeweizen
14	Red Ale
15	Pale Lager
16	Vienna Lager
17	Oatmeal Stout
18	Milk Stout
19	American IPA
20	Session IPA
21	Double IPA
22	Tripel
23	Dubbel
24	Quadrupel
25	Porter Baltic
26	Gose
27	Sour Ale
28	Kolsch
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.locations (id, state, country) FROM stdin;
1	New South Wales	Australia
2	Victoria	Australia
3	Queensland	Australia
4	Western Australia	Australia
5	South Australia	Australia
6	Tasmania	Australia
7	California	U.S.A.
8	Oregon	U.S.A.
9	Colorado	U.S.A.
10	New York	U.S.A.
11	Texas	U.S.A.
12	Ohio	U.S.A.
13	Washington	U.S.A.
14	Massachusetts	U.S.A.
15	\N	England
16	\N	Scotland
17	\N	Wales
18	\N	Belgium
19	Bavaria	Germany
20	Hesse	Germany
21	\N	Ireland
22	Ontario	Canada
23	Quebec	Canada
24	Auckland	New Zealand
25	\N	Netherlands
26	\N	Czech Republic
27	Catalonia	Spain
28	Lombardy	Italy
29	Zurich	Switzerland
30	Flanders	Belgium
31	Saxony	Germany
32	Brittany	France
33	Normandy	France
34	Canterbury	New Zealand
\.


--
-- Data for Name: brewer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.brewers (id, name, located_in) FROM stdin;
1	Black Sand Beer Co.	33
2	Black Sand Brewing	17
3	Copper Trail Brewery	9
4	Copper Trail Brewing	23
5	Driftwood Brewers	5
6	Evergreen Brewers	16
7	Evergreen Brewing	24
8	Frontier Brewing	19
9	Frontier Brewing Co.	11
10	Golden Anchor Brewhouse	29
11	Hollow Creek Brewery	2
12	Iron Horse Brewing	20
13	Lakeside Beer Co.	8
14	Lakeside Brewing	1
15	North Shore Brewing Co.	18
16	Oak & Stone Brewers	20
17	Pacific Ridge Brewers	7
18	Pacific Ridge Brewery	9
19	Pacific Ridge Brewhouse	17
20	Pacific Ridge Brewing	8
21	Prairie Sky Brewers	7
22	Prairie Sky Brewing	18
23	Prairie Sky Brewing Co.	10
24	Redwood Brewers	18
25	Riverstone Brewery	19
26	Seaside Brewery	14
27	Seaside Brewing Co.	22
28	Stonebridge Beer Co.	14
29	Stonebridge Brewers	17
30	Sunset Coast Beer Co.	33
31	Sunset Coast Brewing	32
32	Sunset Coast Brewing Co.	17
33	Twin Pines Beer Co.	4
34	Twin Pines Brewhouse	6
35	Twin Pines Brewing Co.	28
36	Wildflower Beer Co.	18
37	Wildflower Brewery	3
38	Wildflower Brewhouse	1
39	Wildflower Brewing Co.	22
40	Windmill Brewery	9
41	Canterbury Coast Brewing Co.	34
\.


--
-- Data for Name: beer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.beers (id, name, style, brewer) FROM stdin;
1	Hazy Double	21	11
2	Session Quadrupel	24	36
3	Imperial Dubbel	23	36
4	Amber Pale Ale	1	5
5	Midnight Dubbel	23	35
6	Dusty Lager	2	38
7	Midnight Stout	18	28
8	Coastal Stout	5	20
9	Coastal Bock	12	23
10	Stormy Ale	7	16
11	Amber Tripel	22	23
12	Sunset Porter	25	27
13	Citrus Session	20	10
14	Velvet Pilsner	8	12
15	Golden Ale	14	12
16	Bright Quadrupel	24	27
17	Stormy Gose	26	16
18	Velvet Saison	9	7
19	Coastal Wheat Beer	13	31
20	Rustic Pilsner	8	30
21	Crisp Bock	12	15
22	Golden Pilsner	8	13
23	Bright Wheat Beer	13	18
24	Red Kolsch	28	18
25	Evergreen Bock	12	33
26	Stormy Wheat Beer	13	35
27	Golden Barleywine	11	8
28	Velvet Saison #596	9	17
29	Amber Lager	2	39
30	Dusty Ale	14	21
31	Cinder Ale	14	33
32	Wild Porter	4	37
33	Hazy Ale	7	3
34	Imperial Dubbel #3	23	34
35	Sunset Gose	26	13
36	Imperial Bock	12	5
37	Bright Tripel	22	40
38	Stormy Barleywine	11	8
39	Crisp Quadrupel	24	33
40	Stormy Wheat Beer #420	10	21
41	Honey Wheat Beer	13	19
42	Midnight Stout #198	18	27
43	Wild Tripel	22	12
44	Aurora Session	20	20
45	Sunset Wheat Beer	13	1
46	Crisp Wheat Beer	10	14
47	Aurora Ale	14	39
48	Bright Double	21	30
49	Session Ale	15	14
50	Classic Stout	17	11
51	Red Tripel	22	19
52	Stormy Stout	17	40
53	Red Barleywine	11	16
54	Crisp Tripel	22	15
55	Rustic Gose	26	10
56	Coastal Pale Ale	1	16
57	Cinder Lager	16	5
58	Imperial Ale	15	37
59	Honey Ale	7	25
60	Wild Lager	16	16
61	Evergreen Stout	5	1
62	Stone Porter	25	7
63	Imperial Porter	25	15
64	Honey Ale #532	6	30
65	Sunset Lager	2	16
66	Amber Kolsch	28	30
67	Session Stout	5	34
68	Cinder Stout	18	21
69	Session Porter	25	40
70	Citrus Ale	27	33
71	Sunset Ale	14	29
72	Citrus Ale #884	6	31
73	Hazy Ale #771	15	16
74	Evergreen Ale	27	18
75	Stone Porter #535	25	32
76	Silver Double	21	18
77	Red Ale	15	19
78	Hazy Pilsner	8	22
79	Sunset Barleywine	11	6
80	Midnight Stout #238	5	25
81	Midnight Dubbel #725	23	14
82	Imperial IPA	3	27
83	Sunset Barleywine #479	11	27
84	Rustic Lager	2	27
85	Stone Wheat Beer	13	38
86	Golden Dubbel	23	37
87	Classic Wheat Beer	13	1
88	Crisp Bock #773	12	25
89	Imperial Kolsch	28	35
90	Citrus Quadrupel	24	35
91	Cinder Gose	26	15
92	Silver Lager	16	18
93	Classic Ale	14	2
94	Bright Wheat Beer #686	13	26
95	Velvet Quadrupel	24	30
96	Cinder Stout #548	5	2
97	Aurora Wheat Beer	13	37
98	Golden Tripel	22	6
99	Imperial Double	21	9
100	Session Kolsch	28	12
101	Hazy Lager	2	25
102	Rustic Barleywine	11	30
103	Bright Barleywine	11	25
104	Stone Saison	9	27
105	Red Saison	9	31
106	Citrus Pale Ale	1	35
107	Dusty Lager #231	2	5
108	Evergreen Porter	25	3
109	Golden Porter	25	16
110	Golden Ale #638	7	10
111	Midnight Pilsner	8	31
112	Amber Tripel #579	22	14
113	Honey Ale #264	15	24
114	Cinder Ale #623	6	8
115	Velvet Porter	25	20
116	Aurora Porter	4	2
117	Aurora Wheat Beer #695	10	25
118	Honey Wheat Beer #205	13	5
119	Honey American	19	16
120	Honey Porter	4	20
121	Stormy Kolsch	28	39
122	Amber Gose	26	37
123	Coastal Gose	26	23
124	Imperial Stout	18	24
125	Heritage IPA	3	22
126	Imperial Pale Ale	1	32
127	Imperial Porter #985	4	24
128	Session Double	21	10
129	Velvet Ale	14	34
130	Hazy Double #632	21	35
131	Classic Porter	25	30
132	Citrus Ale #608	14	18
133	Silver Barleywine	11	6
134	Session Saison	9	16
135	Session Porter #585	25	40
136	Wild Tripel #346	22	2
137	Bright Lager	16	12
138	Rustic Lager #365	16	17
139	Hazy Barleywine	11	39
140	Hazy Dubbel	23	36
141	Heritage Pale Ale	1	13
142	Silver IPA	3	27
143	Sunset Lager #778	16	16
144	Classic Dubbel	23	32
145	Golden Ale #97	15	19
146	Wild Pilsner	8	16
147	Stormy Wheat Beer #597	10	24
148	Sunset Lager #545	16	23
149	Citrus Ale #565	14	22
150	Honey Bock	12	30
151	Crisp Saison	9	17
152	Amber Pilsner	8	13
153	Amber Barleywine	11	35
154	Honey Porter #191	25	13
155	Citrus Ale #497	7	18
156	Aurora Quadrupel	24	34
157	Crisp Session	20	7
158	Rustic Ale	27	19
159	Dusty Pilsner	8	12
160	Golden Wheat Beer	10	35
161	Hazy Stout	5	3
162	Sunset Lager #301	2	9
163	Stone Double	21	32
164	Golden Porter #589	4	19
165	Classic Lager	16	29
166	Velvet Barleywine	11	4
167	Classic Saison	9	8
168	Red Ale #412	27	32
169	Aurora IPA	3	4
170	Midnight Stout #832	5	37
171	Red Wheat Beer	10	16
172	Sunset Porter #784	4	27
173	Cinder Session	20	40
174	Stone Pilsner	8	34
175	Session Wheat Beer	13	29
176	Aurora Wheat Beer #441	10	20
177	Cinder American	19	4
178	Citrus Session #103	20	14
179	Rustic Double	21	17
180	Red Tripel #162	22	16
181	Sunset Ale #78	6	11
182	Imperial Pale Ale #463	1	39
183	Crisp Lager	16	3
184	Crisp Pilsner	8	19
185	Session Dubbel	23	5
186	Silver Tripel	22	17
187	Evergreen Gose	26	38
188	Rustic Tripel	22	28
189	Sunset Porter #232	4	10
190	Midnight Saison	9	5
191	Velvet Lager	2	20
192	Citrus Session #846	20	37
193	Session Wheat Beer #129	10	30
194	Crisp Dubbel	23	26
195	Heritage Saison	9	35
196	Session Lager	16	6
197	Coastal Session	20	28
198	Bright Quadrupel #620	24	17
199	Red Pale Ale	1	15
200	Aurora Tripel	22	38
201	Stone Pale Ale	1	18
202	Coastal American	19	12
203	Heritage Lager	16	29
204	Velvet Saison #601	9	28
205	Classic Double	21	6
206	Dusty Lager #420	16	22
207	Stormy Barleywine #109	11	11
208	Imperial Barleywine	11	32
209	Stormy Wheat Beer #969	10	26
210	Stone Ale	27	36
211	Session Lager #92	2	21
212	Bright Saison	9	8
213	Wild Porter #887	25	33
214	Golden Ale #675	27	35
215	Imperial Ale #57	15	13
216	Dusty Stout	17	40
217	Classic Porter #642	25	29
218	Coastal Porter	25	14
219	Sunset Saison	9	9
220	Session Wheat Beer #903	10	32
221	Q Ale	1	41
222	CP Pilsner	8	41
223	White Stout	5	41
\.


--
-- Data for Name: taster; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tasters (id, family, given, lives_in) FROM stdin;
1	Thomas	Mark	9
2	Miller	Olivia	6
3	Nelson	Jessica	3
4	Johnson	David	14
5	Anderson	Mia	2
6	Baker	Matthew	2
7	Clark	Mark	29
8	Nelson	Andrew	1
9	Hernandez	Jessica	22
10	Moore	Charles	14
11	Perez	Richard	6
12	Harris	Richard	23
13	Thompson	Lucas	17
14	Williams	Karen	2
15	Davis	Elizabeth	6
16	Baker	Joshua	24
17	Adams	Matthew	5
18	Williams	Mark	19
19	Garcia	Mark	7
20	Harris	Andrew	30
21	White	Christopher	24
22	Thompson	Anthony	18
23	Jones	Lucas	11
24	Green	Paul	11
25	Walker	Elizabeth	18
26	Baker	Mark	21
27	Brown	Mark	3
28	Lee	Barbara	18
29	Jones	Anthony	21
30	Wilson	Ethan	26
31	Walker	Charles	17
32	Rodriguez	Paul	18
33	Green	Steven	28
34	Nelson	Barbara	24
35	Anderson	Thomas	33
36	King	David	4
37	Davis	Charles	11
38	Ramirez	Lucas	5
39	Harris	Elizabeth	30
40	Scott	Steven	18
41	Smith	Joseph	2
42	Moore	Patricia	8
43	Jackson	Jessica	11
44	Walker	James	17
45	Wright	Daniel	33
46	Miller	Edward	33
47	Hill	Matthew	10
48	White	Christopher	2
49	Scott	James	21
50	King	John	8
51	White	Edward	16
52	Brown	Paul	6
53	Garcia	Ethan	5
54	Green	Thomas	9
55	Young	Liam	11
56	Taylor	Noah	28
57	Wilson	Olivia	13
58	Martin	Barbara	24
59	Lewis	Noah	29
60	Davis	Paul	15
61	Jones	Patricia	2
62	Nelson	Liam	15
63	Nelson	Mark	1
64	Jones	Michael	15
65	Jones	Robert	22
66	Jones	Mia	16
67	Moore	Ethan	14
68	Green	Thomas	31
69	Thomas	Alice	27
70	Gonzalez	Richard	7
71	Ramirez	Jennifer	28
72	Clark	Karen	4
73	Miller	Michael	26
74	Perez	Richard	16
75	Gonzalez	Matthew	2
76	Lewis	Thomas	28
77	Lopez	Andrew	30
78	Thomas	William	29
79	Baker	Richard	4
80	Green	James	6
81	Hart	Alice	34
82	Khan	Omar	34
83	Nguyen	Linh	34
\.


--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ratings (taster, beer, score) FROM stdin;
28	2	2
8	4	3
48	4	3
43	6	2
27	7	2
67	8	2
47	8	5
62	9	2
56	11	2
19	12	4
17	12	2
23	13	4
52	13	4
71	15	2
44	15	2
17	15	3
39	16	2
78	17	2
21	17	2
49	17	2
22	18	5
56	18	5
81	18	4
26	19	4
14	19	3
60	19	5
77	20	4
63	21	2
20	21	5
13	22	4
26	22	3
81	22	3
52	23	5
56	24	4
73	25	2
76	25	2
7	26	4
15	26	2
77	27	4
27	27	5
36	28	5
18	28	2
34	28	5
61	29	4
27	29	5
32	30	4
11	30	3
26	31	2
68	31	2
47	32	2
49	32	5
23	33	2
60	33	2
63	33	3
83	34	2
18	34	4
49	35	4
4	35	2
66	35	4
21	36	5
71	36	4
17	36	4
69	37	5
20	37	2
36	38	3
21	38	4
58	38	3
73	39	2
21	39	2
83	40	4
80	40	2
76	40	3
26	41	5
41	41	3
77	42	3
4	42	2
20	43	2
12	43	4
62	44	2
59	44	5
4	45	4
35	45	5
32	46	3
6	46	4
49	47	3
30	47	2
64	48	3
46	48	2
50	48	4
23	49	5
36	49	3
52	50	4
43	50	5
40	50	4
45	51	4
36	51	2
16	52	4
13	52	2
67	52	3
41	53	2
16	53	2
77	53	3
55	54	4
30	54	4
53	55	5
80	55	2
68	55	2
50	56	3
66	56	4
2	57	4
31	57	2
55	57	3
80	58	2
17	58	3
55	59	3
69	59	5
70	60	2
66	60	2
40	61	4
44	61	5
62	61	2
10	62	2
32	62	3
61	63	4
4	63	4
46	64	4
67	64	2
39	65	4
59	65	2
40	65	2
22	66	4
6	66	3
33	66	4
9	67	4
12	67	4
18	67	4
16	68	4
12	68	3
27	69	4
42	69	2
11	69	5
59	70	5
6	70	3
40	70	3
6	71	5
22	71	4
68	72	4
26	72	4
20	72	3
56	73	2
77	73	4
25	73	5
57	74	3
12	74	3
30	75	4
66	75	5
56	76	3
62	76	2
36	76	5
37	77	4
50	77	2
70	77	3
75	78	2
52	78	4
58	79	5
30	79	3
59	79	4
49	80	5
2	80	4
1	80	2
21	81	3
16	81	3
36	82	2
53	82	4
41	82	3
6	83	3
28	83	5
41	83	5
13	84	3
64	84	4
11	84	4
3	85	4
24	85	3
39	86	4
79	86	3
69	86	2
69	87	4
66	87	3
31	87	3
62	88	5
9	88	2
75	88	4
10	89	5
23	89	5
62	89	5
44	90	3
18	90	2
40	91	3
63	91	5
36	92	2
47	92	2
51	92	5
63	93	4
75	93	4
44	94	4
69	94	5
77	94	4
35	95	3
56	95	2
81	95	3
22	96	4
19	96	5
46	96	3
7	97	2
41	97	4
47	97	4
30	98	3
66	98	5
11	98	5
16	99	3
47	99	4
53	99	2
78	100	5
23	100	4
37	101	4
18	101	3
9	102	4
70	102	3
54	102	3
28	103	5
16	103	3
70	103	3
2	104	3
57	104	3
44	105	2
67	105	5
74	106	2
62	106	5
71	106	3
33	107	5
38	107	2
8	107	4
52	108	2
17	108	4
23	108	2
50	109	3
20	109	2
2	109	5
45	110	5
8	110	5
34	110	3
28	111	5
1	111	5
82	112	2
39	112	4
51	113	3
62	113	5
83	114	4
17	114	5
59	115	2
12	115	4
3	115	2
5	116	4
49	116	2
67	117	5
79	117	3
16	117	2
13	118	3
66	118	5
36	119	3
46	119	3
34	119	5
19	120	3
27	120	2
80	120	2
40	121	4
43	121	3
71	122	4
57	122	3
21	122	3
60	123	3
53	123	2
78	123	4
49	124	2
7	124	5
46	125	4
33	125	3
62	126	4
40	126	2
6	127	2
81	127	4
68	127	4
76	128	5
57	128	5
56	128	4
2	129	5
5	129	5
21	130	3
72	130	5
76	130	3
52	131	5
43	131	2
29	131	4
24	132	4
38	132	5
54	132	5
43	133	2
53	133	2
7	134	3
55	134	2
37	135	4
79	135	2
22	136	5
75	136	3
26	137	5
55	137	3
9	138	3
26	138	2
3	139	3
29	139	4
4	139	3
41	140	5
73	140	5
35	140	3
25	141	5
46	141	2
63	141	5
68	142	5
20	142	5
66	142	5
48	143	4
44	143	4
54	143	4
58	144	3
56	144	2
41	145	4
26	145	5
15	145	5
82	146	5
20	146	3
18	146	4
69	147	3
33	147	4
22	147	4
43	148	2
36	148	4
38	149	3
18	149	5
49	150	2
72	150	4
24	150	4
23	151	2
43	151	4
23	152	2
69	152	3
54	152	2
62	153	3
70	153	4
9	154	3
34	154	5
10	154	4
55	155	3
60	155	4
1	156	4
58	156	5
75	156	4
33	157	3
16	157	3
60	158	3
6	158	2
25	158	5
52	159	5
28	159	5
55	159	5
36	160	3
53	160	2
56	160	5
5	161	2
18	161	2
9	161	4
31	162	3
14	162	5
12	163	5
37	163	3
11	163	5
46	164	3
76	164	3
59	165	4
52	165	5
17	165	4
9	166	4
62	166	3
75	167	5
54	167	2
64	168	3
54	168	4
78	168	5
67	169	4
68	169	2
63	169	4
81	170	4
17	170	4
67	171	4
41	171	5
1	171	3
59	172	4
73	172	3
77	172	2
14	173	4
21	173	2
61	174	5
77	174	5
17	174	2
34	175	2
39	175	4
30	175	4
79	176	4
38	176	5
78	176	2
79	177	3
8	177	2
12	178	2
43	178	3
27	179	4
71	179	4
17	179	3
9	180	2
21	180	4
53	181	4
56	181	3
11	181	5
29	182	3
17	182	4
80	183	3
23	183	5
55	184	2
33	184	3
18	185	4
16	185	4
81	186	2
5	186	5
42	186	3
34	187	4
21	187	5
46	188	2
11	188	2
52	188	4
72	189	5
73	189	5
67	190	2
55	190	2
9	191	4
2	191	4
5	192	5
30	192	4
22	193	5
19	193	3
12	194	4
52	194	4
40	194	4
6	195	2
63	195	2
47	196	4
6	196	3
29	197	4
68	197	3
75	198	3
7	198	5
79	199	3
68	199	2
75	200	4
72	200	3
55	200	3
32	201	2
5	201	2
67	202	3
19	202	4
74	203	4
22	203	2
46	203	2
69	204	4
80	204	2
75	205	2
12	205	3
31	205	4
18	206	5
75	206	5
76	207	2
7	207	5
67	207	4
68	208	2
45	208	2
32	209	4
33	209	3
80	210	3
13	210	3
25	210	3
70	211	3
55	211	5
50	212	2
52	212	3
59	212	5
49	213	3
60	213	3
58	214	5
33	214	5
27	215	2
1	1	4
1	2	4
1	3	5
1	12	3
1	14	1
1	16	3
1	20	2
2	14	1
2	5	4
2	6	1
3	1	1
3	10	3
3	3	4
4	10	4
4	11	3
4	14	1
4	5	3
4	6	2
4	8	3
4	9	3
5	4	5
5	3	3
5	1	3
6	21	3
6	3	4
7	3	4
7	7	3
8	16	3
8	9	4
8	23	4
9	24	5
10	23	5
11	14	3
81	221	4
81	222	4
81	223	4
82	221	4
82	222	4
82	223	4
83	221	4
83	222	4
83	223	4
54	215	5
8	215	4
80	216	2
31	216	2
29	217	2
24	217	4
61	218	2
49	218	4
74	218	5
83	219	3
79	219	5
9	220	5
24	220	3
\.


-- --
-- -- Name: beer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
-- --

-- SELECT pg_catalog.setval('public.beers_id_seq', 223, true);


-- --
-- -- Name: beer_styles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
-- --

-- SELECT pg_catalog.setval('public.beer_styles_id_seq', 28, true);


-- --
-- -- Name: brewer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
-- --

-- SELECT pg_catalog.setval('public.brewers_id_seq', 41, true);


-- --
-- -- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
-- --

-- SELECT pg_catalog.setval('public.locations_id_seq', 37, true);


-- --
-- -- Name: taster_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
-- --

-- SELECT pg_catalog.setval('public.tasters_id_seq', 83, true);


--
-- PostgreSQL database dump complete
--

