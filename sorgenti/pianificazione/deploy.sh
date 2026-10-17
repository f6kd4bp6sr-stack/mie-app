#!/bin/sh
# Pubblica Pianificazione in /mie-app/licenze/ (non tocca «Il mio mondo» nella cartella principale)
set -e
cd /home/claude/mie-app && git fetch -q origin main && git reset -q --hard origin/main
# le novità le aggiorna ogni mattina l'attività programmata: prendo la versione pubblicata prima di costruire
[ -f /home/claude/mie-app/licenze/news-pensione.json ] && cp /home/claude/mie-app/licenze/news-pensione.json /home/claude/pian/statici/news-pensione.json
cd /home/claude/pian && python3 build.py
rm -rf /home/claude/mie-app/licenze && mkdir -p /home/claude/mie-app/licenze && cp -r /home/claude/pian/out/licenze/. /home/claude/mie-app/licenze/
python3 /home/claude/pian/tools/sorgenti_pubbliche.py /home/claude/pian pianificazione
cd /home/claude/mie-app && git add -A licenze sorgenti/pianificazione
git -c user.name="Marco" -c user.email="noreply@example.com" commit -q -m "${1:-Aggiornamento di Pianificazione}

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01WZ9PCYVjkAFsCmPtVbZLCu" || true
git push -q origin main
