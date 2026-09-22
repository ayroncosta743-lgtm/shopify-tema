#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Valida config/settings_data.json contra config/settings_schema.json.

Shopify rechaza el tema entero (y lo sustituye por '[]') cuando un valor
no respeta el min/max/step de su range, no está entre las opciones de un
select, o cuando theme_author / theme_name pasan de 25 caracteres.
`shopify theme check` no cubre ninguna de esas reglas.

Uso:  python3 bin/validar-settings.py
"""
import json, io, sys

schema = json.load(io.open('config/settings_schema.json', encoding='utf-8'))
data = json.load(io.open('config/settings_data.json', encoding='utf-8'))

problems = []

# --- theme_info: límite de 25 caracteres ---
info = schema[0]
for key in ('theme_name', 'theme_author'):
    if len(info.get(key, '')) > 25:
        problems.append('theme_info.%s: %d caracteres (máximo 25)' % (key, len(info[key])))

defs = {s['id']: s for g in schema for s in g.get('settings', []) if s.get('id')}

# --- valores de cada preset y de current ---
targets = dict(data.get('presets', {}))
if isinstance(data.get('current'), dict):
    targets['current'] = data['current']

for preset_name, values in targets.items():
    for key, val in values.items():
        if key in ('color_schemes', 'sections'):
            continue
        spec = defs.get(key)
        if not spec:
            problems.append('%s > %s: no existe en settings_schema' % (preset_name, key))
            continue
        t = spec.get('type')
        if t == 'range':
            lo, hi, step = spec['min'], spec['max'], spec['step']
            if not isinstance(val, (int, float)):
                problems.append('%s > %s: %r no es numérico' % (preset_name, key, val))
            elif val < lo or val > hi:
                problems.append('%s > %s: %s fuera de [%s, %s]' % (preset_name, key, val, lo, hi))
            elif round((val - lo) / step, 6) % 1 != 0:
                near = lo + round((val - lo) / step) * step
                problems.append('%s > %s: %s no cae en el paso %s -> usar %s'
                                % (preset_name, key, val, step, near))
        elif t == 'select':
            opts = [o['value'] for o in spec.get('options', [])]
            if val not in opts:
                problems.append('%s > %s: %r no está entre %s' % (preset_name, key, val, opts))
        elif t == 'checkbox' and not isinstance(val, bool):
            problems.append('%s > %s: %r no es booleano' % (preset_name, key, val))

for p in problems:
    print('•', p)
print('problemas: %d' % len(problems))
sys.exit(1 if problems else 0)
