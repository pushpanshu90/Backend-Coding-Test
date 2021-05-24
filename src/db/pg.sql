CREATE TABLE public.users (
    id integer NOT NULL,
    user_name character varying(100),
    dob character varying(20),
    metadata character varying(20),
    isactive boolean NOT NULL
);

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


    CREATE TABLE public.blog (
    id character varying(100) NOT NULL,
    title character varying(200),
    body character varying(500),
    updated_date character varying(50)
);

ALTER TABLE ONLY public.blog
    ADD CONSTRAINT blog_pkey PRIMARY KEY (id);