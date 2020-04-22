## We use the following programs to generate converts between DB and GraphQL

- https://github.com/web-ridge/gqlgen-sqlboiler
- https://github.com/web-ridge/sqlboiler-graphql-schema

## Generate ORM interface (/models/\* folders)

```
sqlboiler psql
```

## Generate Schema (only to copy from since it's customized now)

```
go run github.com/web-ridge/sqlboiler-graphql-schema --output=../schema.graphql
```

## Generate API + converts (only to copy from since it's customized now)

```
go run convert_plugin.go
```
