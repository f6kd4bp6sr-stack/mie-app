#!/bin/sh
# Pubblica l'ultima versione dell'app su GitHub Pages
set -e
cd /home/claude/app && python3 build.py >/dev/null && node /tmp/claude-0/icons.js
cd /home/claude/mie-app && git fetch -q origin main && git reset -q --hard origin/main
# aggiorna solo i file di «Il mio mondo» nella cartella principale: /licenze/, /semestre/ e /sorgenti/ restano intatte
cp -r /home/claude/mondo-out/. /home/claude/mie-app/
# memoria dell'app nel repository: sorgenti senza dati personali in /sorgenti/il-mio-mondo/
python3 /home/claude/app/tools/sorgenti_pubbliche.py /home/claude/app il-mio-mondo
cd /home/claude/mie-app && touch .nojekyll && git add -A . ':!semestre' ':!sorgenti/semestre' ':!licenze'
git -c user.name="Marco" -c user.email="noreply@example.com" commit -q -m "${1:-Aggiornamento dell'app}

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01WZ9PCYVjkAFsCmPtVbZLCu" || true
git push -q origin main
