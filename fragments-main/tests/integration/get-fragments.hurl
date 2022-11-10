GET http://localhost:8080/v1/fragments
HTTP/1.1 401

GET http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhjlkkj3JkMQ==
HTTP/1.1 401

POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/plain
```This is fragment!```
HTTP/1.1 201

GET http://localhost:8080/v1/fragments?expand=1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" isCollection
jsonpath "$.fragments[0].id" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.fragments[0].ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragments[0].created" isString
jsonpath "$.fragments[0].updated" isString
jsonpath "$.fragments[0].type" isString
jsonpath "$.fragments[0].size" isInteger
