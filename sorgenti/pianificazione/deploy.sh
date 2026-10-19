#!/bin/sh
# Pubblica Pianificazione in /mie-app/licenze/ (non tocca «Il mio mondo» nella cartella principale)
set -e
cd /home/claude/mie-app && git fetch -q origin main && git reset -q --hard origin/main
# le novità le aggiorna ogni mattina l'attività programmata: prendo la versione pubblicata prima di costruire
python3 - <<'PY'
import json, os, shutil
r, l = '/home/claude/mie-app/licenze/news-pensione.json', '/home/claude/pian/statici/news-pensione.json'
if os.path.exists(r):
    up = lambda f: json.load(open(f, encoding='utf-8')).get('updated', '')
    if not os.path.exists(l) or up(r) > up(l): shutil.copy(r, l); print('novità: presa la versione pubblicata')
# la scheda cifrata la aggiorna anche l'attività: vince la revisione più alta
r, l = '/home/claude/mie-app/licenze/scheda-pensione.cifrata.json', '/home/claude/pian/statici/scheda-pensione.cifrata.json'
if os.path.exists(r):
    rv = lambda f: int(json.load(open(f, encoding='utf-8')).get('rev') or 0)
    if not os.path.exists(l) or rv(r) > rv(l): shutil.copy(r, l); print('scheda cifrata: presa la versione pubblicata')
PY
cd /home/claude/pian && python3 build.py
rm -rf /home/claude/mie-app/licenze && mkdir -p /home/claude/mie-app/licenze && cp -r /home/claude/pian/out/licenze/. /home/claude/mie-app/licenze/
python3 /home/claude/pian/tools/sorgenti_pubbliche.py /home/claude/pian pianificazione
cd /home/claude/mie-app && git add -A licenze sorgenti/pianificazione
git -c user.name="Marco" -c user.email="noreply@example.com" commit -q -m "${1:-Aggiornamento di Pianificazione}

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01WZ9PCYVjkAFsCmPtVbZLCu" || true
git push -q origin main
