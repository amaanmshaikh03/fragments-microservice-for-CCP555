PUT http://localhost:8080/v1/fragments/randomid
Content-Type: text/plain
"hello"
HTTP/1.1 401

PUT http://localhost:8080/v1/fragments/randomid
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhjlkkj3JkMQ==
Content-Type: text/plain
"hello"
HTTP/1.1 401

# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/plain
```This is a fragment!```
HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"

# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"
id: jsonpath "$.fragment.id"

GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
Content-Length: 19
[Asserts]
header "Content-Type" startsWith "text/plain"
body == "This is a fragment!"

PUT {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/markdown
```# This is an updated fragment!```
HTTP/1.1 400

PUT {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/plain
```This is an updated fragment!```
HTTP/1.1 201
[Asserts]
jsonpath "$.fragment.id" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
jsonpath "$.fragment.size" == 28

GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
Content-Length: 28
[Asserts]
header "Content-Type" startsWith "text/plain"
body == "This is an updated fragment!"

PUT http://localhost:8080/v1/fragments/random
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/plain
```This is an updated fragment!```
HTTP/1.1 404
