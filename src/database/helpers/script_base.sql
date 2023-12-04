create table SOLICITUDES (
   id_solicitud         SERIAL               not null,
   id_usuario           INT4                 null,
   nombre_solicitud     VARCHAR(255)         not null,
   correo_solicitud     VARCHAR(255)         not null,
   carrera_solicitud    VARCHAR(255)         not null,
   semestre_solicitud   VARCHAR(255)         not null,
   constraint PK_SOLICITUDES primary key (id_solicitud)
);

create unique index SOLICITUDES_PK on SOLICITUDES (
id_solicitud
);

create  index registra_FK on SOLICITUDES (
id_usuario
);

create table USUARIOS (
   id_usuario           SERIAL               not null,
   nombre_usuario       VARCHAR(255)         not null,
   apellido_usuario     VARCHAR(255)         not null,
   nick_usuario         VARCHAR(255)         not null,
   correo_usuario       VARCHAR(255)         not null,
   pass_usuario         VARCHAR(255)         not null,
   constraint PK_USUARIOS primary key (id_usuario)
);

create unique index USUARIOS_PK on USUARIOS (
id_usuario
);

alter table SOLICITUDES
   add constraint FK_SOLICITU_REGISTRA_USUARIOS foreign key (id_usuario)
      references USUARIOS (id_usuario)
      on delete restrict on update restrict;
