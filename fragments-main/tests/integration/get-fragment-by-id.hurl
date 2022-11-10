POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/markdown
```# This is a fragment!```

HTTP/1.1 201
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "text/markdown"
[Captures]
url: header "Location"
GET {{url}}
HTTP/1.1 401

GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhjlkkj3JkMQ==
HTTP/1.1 401

GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
Content-Length: 21
[Asserts]
header "Content-Type" startsWith "text/markdown"
body == "# This is a fragment!"

GET {{url}}.html
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
Content-Length: 29
[Asserts]
header "Content-Type" startsWith "text/html"
body contains "<h1>This is a fragment!</h1>"

GET {{url}}.png
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 415

GET http://localhost:8080/v1/fragments/randomid
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 404
