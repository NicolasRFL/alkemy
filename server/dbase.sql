create database Presupuesto;

use Presupuesto;

create table operaciones
(
    id int primary key auto_increment,
    concept varchar(30),
    amount int,
    opDate varchar(30),
    opType varchar(30)
);

select * from operaciones;
