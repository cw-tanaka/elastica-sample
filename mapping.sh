#!/bin/sh


ELASTICA_URL="http://localhost:9200/"


curl -XDELETE "${ELASTICA_URL}cw" > /dev/null 2>&1

curl -XPOST "${ELASTICA_URL}cw" -d '{
  "mappings": {
    "chat": {
      "properties": {
        "id": {"type": "integer"},
        "message": {"type": "string", "index": "analyzed"},
        "create_date" : {"type": "date", "format" : "YYYY-MM-dd HH:mm:ss"},
        "rid": {"type": "integer"},
        "aid": {"type": "integer"}
      }
    }
  }
}'
