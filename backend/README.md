## We use the following programs to generate our backend based on our DB scheme

- https://github.com/web-ridge/gqlgen-sqlboiler
- https://github.com/web-ridge/sqlboiler-graphql-schema

## Generate ORM interface (/models/\* folders)

```
sqlboiler psql
```

## Generate Schema

```
go run github.com/web-ridge/sqlboiler-graphql-schema --output=../schema.graphql --pagination=no
```

## Generate API + converts

```
go run convert_plugin.go
```
