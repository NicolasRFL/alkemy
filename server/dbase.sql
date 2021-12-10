create database Presupuesto;

use Presupuesto;

create table operaciones(
    id int primary key auto_increment,
    concepto varchar(30),
    monto int,
    fecha date,
    tipo varchar(30)
)

select * from operaciones;