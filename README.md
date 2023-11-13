# Basic Express

Basic express.js project with basic routes:

- Express
- Joi
- Fs
- morgan
- dotenv

---

## URL

_Server_

```
http://localhost:4100
```

---

## Global Response

_Response (500 - Internal Server Error)_

```
{
  "message": "Internal Server Error"
}
```

---

## RESTful endpoints

### POST /api/gajet/:company/:type

> Create product for company

_Request Header_

```
not needed
```

_Request Params_

```
/<company_name>/<type_name>

```

_Request Body_

```
{
  "name" : "<name>",
  "tahun" : "<tahun>",
  "description" : "<description>"
}
```

_Response (200)_

```
{
    "message": "Ok",
    "data": [<data_species>]
}
```

_Response (400 - Validation Error)_

```
{
    "status": "Validation Failed",
    "message": "\"description\" is required"
}
```

---

### GET /api/gajets/:company

> Get all gajet by company

_Request Params_

```
/<company_name>

```

_Request Query Params_

```
?type=<type_name>
?pageSize=number
?pageNumber=number

```

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200) With Out query_

```
{

    "message": "Ok",
    "data": {
        "<data_type>": [
	        <data_species>
	       ]
        },

}
```

_Response (200) with query type_

```
{

    "message": "Ok",
    "data": {
        "products": [
	        <data_species>
	       ],
        "totalData":<total_data>
        },

}
```

_Response (400)_

```
{
    "status": "Bad Request",
    "message": "Page Size or Page Number notfount"
}
```

_Response (404)_

```
{
    "status": "Not Found",
    "message": "Type not found"
}
```

---

### GET /api/gajet/:company/:type/:slug

> Get by slug

_Request Params_

```
/<company_name>/<type_name>/<slug>

```

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "Ok",
    "data": {
        "name": "<name>",
        "tahun": "<tahun>",
        "slug": "<auto_generate_slug>",
        "description": "<description>"
    },
}
```

_Response (404)_

```
{
    "status": "Not Found",
    "message": "Data Not Found"
}
```

---

### PUT /api/:company/:type/:slug

> Update by slug

_Request Params_

```
/<company_name>/<type_name>/<slug>
```

_Request Header_

```
not needed
```

_Request Body_

```
{
  "name": "<name>",
  "tahun": "<tahun>",
  "description": "<description>",
}
```

_Response (200)_

```
{
    "message": "Ok",
    "data": [
        <species_list>
    ],
}
```

_Response (400 - Validation Error)_

```
{
    "status": "Validation Failed",
    "message": "\"name\" length must be at least 3 characters long"
}
```

_Response (404 - Error Not Found)_

```
{
    "status": "Not Found",
    "message": "Data Not Found"
}
```

---

### DELETE /api/:company/:type/:slug

> Delete by slug

_Request Params_

```
/<company_name>/<type_name>/<slug>
```

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "Deleted",
    "data": [<species_list>]
}
```

_Response (404 - Error Not Found)_

```
{
    "status": "Not Found",
    "message": "Data Not Found"
}
```

---
