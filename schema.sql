create table if not exists user (
    id varchar(50) primary key,
    username varchar(50) not null,
    email varchar(50) unique not null,
    password varchar(50) not null
);

SHOW user;