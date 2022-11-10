POST http://localhost:8080/v1/fragments
#[MultipartFormData]
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: image/jpeg
file,images/cat.jpeg;

HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "image/jpeg"
jsonpath "$.fragment.size" == 4497
[Captures]
url: header "Location"

GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200
Content-Length: 4497
[Asserts]
header "Content-Type" startsWith "image/jpeg"
