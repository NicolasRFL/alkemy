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

insert into operaciones values(1,'erez',25,now(),'Gerente Tecnico');

select * from operaciones;
drop table operaciones;