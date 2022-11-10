POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: audio/mpeg
```Unsupported ...```

HTTP/1.1 415
[Asserts]
header "Content-Type" startsWith "application/json"
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415
jsonpath "$.error.message" isString
