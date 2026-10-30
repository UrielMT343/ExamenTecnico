# Examen tecnico
Para la realización de este examen se empleo ASP Core .Net 10 para el backend y React para el front

## Configuración
### Backend
Es necesario contar con la versión 10 de .Net Core, ademas de tener la cadena de conexión a la base de datos dentro del archivo appsettings.json

``` json
"ConnectionStrings": {
  "AdventureWorksConnection": "Tu servidor"
}
```

Ademas de definir el Program.cs la ruta del front para el CORS

``` Csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "Frontend",
        policy =>
            {
                policy.WithOrigins("http://localhost:5173")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
});
```

Las dependendencias utilizadas fueron:
- Dapper
- Microsoft.Data.SqlClient

Para interactuar con la base de datos, estas ya vienen dentro del proyecto.

Una vez, se cuente con los anterior se puede correr en el puerto deseado.

### Frontend
Utilizar el administrador de paquetes **pnpm**.

Para correr el proyecto sera necesario correr los siguientes comandos:

Para instalar dependencias
``` bash
pnpm install
```

Y para acceder al entorno de desarrollo
``` bash
pnpm dev
```

A su vez de dentro del archivo src/services/api.ts
Colocar el puerto correcto del backend

``` Typescript
const API_BASE = 'http://localhost:5026/api';
```

Corriendo ambos proyectos el front puede comunicarse con el backend y realizar las peticiones.