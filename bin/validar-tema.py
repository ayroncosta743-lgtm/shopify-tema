#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Valida el tema contra las reglas que `shopify theme check` no cubre.

Shopify rechaza un archivo entero (y a veces lo sustituye por '[]') cuando:
  - un valor de range no cae exactamente en su min/max/step;
  - un valor de select no está entre sus opciones;
  - un checkbox no es booleano;
  - theme_name / theme_author pasan de 25 caracteres;
  - el nombre de una sección pasa de 25 caracteres.

Revisa config/settings_data.json y todos los templates y grupos de
secciones, incluidos los ajustes de cada bloque.

Uso:  python3 bin/validar-tema.py
"""
import json, io, re, os, glob, sys

problems = []


def load_json(path):
    with io.open(path, encoding='utf-8') as fh:
        return json.load(fh)


def section_schema(section_type):
    path = 'sections/%s.liquid' % section_type
    if not os.path.exists(path):
        return None
    with io.open(path, encoding='utf-8') as fh:
        m = re.search(r'\{%\s*schema\s*%\}(.*?)\{%\s*endschema\s*%\}', fh.read(), re.S)
    return json.loads(m.group(1)) if m else None


def check_value(where, key, val, spec):
    t = spec.get('type')
    if t == 'range':
        lo, hi, step = spec['min'], spec['max'], spec['step']
        if not isinstance(val, (int, float)) or isinstance(val, bool):
            problems.append('%s > %s: %r no es numérico' % (where, key, val))
        elif val < lo or val > hi:
            problems.append('%s > %s: %s fuera de [%s, %s]' % (where, key, val, lo, hi))
        elif round((val - lo) / step, 6) % 1 != 0:
            near = lo + round((val - lo) / step) * step
            near = int(near) if float(near).is_integer() else near
            problems.append('%s > %s: %s no cae en el paso %s (min %s) -> usar %s'
                            % (where, key, val, step, lo, near))
    elif t == 'select':
        opts = [o['value'] for o in spec.get('options', [])]
        if val not in opts:
            problems.append('%s > %s: %r no está entre %s' % (where, key, val, opts))
    elif t == 'checkbox' and not isinstance(val, bool):
        problems.append('%s > %s: %r no es booleano' % (where, key, val))


def check_settings(where, values, specs):
    index = {s['id']: s for s in specs if s.get('id')}
    for key, val in values.items():
        spec = index.get(key)
        if spec is None:
            problems.append('%s: el ajuste "%s" no existe en el schema' % (where, key))
        else:
            check_value(where, key, val, spec)


# ------------------------------------------------ settings_schema + settings_data
schema = load_json('config/settings_schema.json')
info = schema[0]
for key in ('theme_name', 'theme_author'):
    if len(info.get(key, '')) > 25:
        problems.append('theme_info.%s: %d caracteres (máximo 25)' % (key, len(info[key])))

global_specs = [s for g in schema for s in g.get('settings', []) if s.get('id')]
data = load_json('config/settings_data.json')
targets = dict(data.get('presets', {}))
if isinstance(data.get('current'), dict):
    targets['current'] = data['current']
for preset, values in targets.items():
    clean = {k: v for k, v in values.items() if k not in ('color_schemes', 'sections')}
    check_settings('settings_data[%s]' % preset, clean, global_specs)

# ------------------------------------------------ nombres de sección
for path in sorted(glob.glob('sections/*.liquid')):
    sch = section_schema(os.path.basename(path)[:-7])
    if sch and len(sch.get('name', '')) > 25 and not sch['name'].startswith('t:'):
        problems.append('%s: nombre de %d caracteres (máximo 25)' % (path, len(sch['name'])))

# ------------------------------------------------ templates y grupos
for tpl in sorted(glob.glob('templates/*.json') + glob.glob('sections/*-group.json')):
    doc = load_json(tpl)
    for sec_id, sec in doc.get('sections', {}).items():
        sch = section_schema(sec.get('type'))
        if sch is None:
            continue
        where = '%s > %s' % (tpl, sec_id)
        check_settings(where, sec.get('settings', {}), sch.get('settings', []))

        block_specs = {b['type']: b.get('settings', []) for b in sch.get('blocks', [])}
        for blk_id, blk in sec.get('blocks', {}).items():
            specs = block_specs.get(blk.get('type'))
            if specs is None:
                if blk.get('type') != '@app':
                    problems.append('%s > bloque %s: tipo "%s" no existe' % (where, blk_id, blk.get('type')))
                continue
            check_settings('%s > bloque %s' % (where, blk_id), blk.get('settings', {}), specs)

for p in problems:
    print('•', p)
print('problemas: %d' % len(problems))
sys.exit(1 if problems else 0)
