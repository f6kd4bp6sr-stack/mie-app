"""Controllo dei 🎓 Corsi online di Pianificazione.
- sezioni/corsi_dati.json: la lista dei corsi. Il controllo parte da solo a ogni build e, con un errore, il build si ferma.
Uso a mano:
  python3 strumenti/verifica_corsi.py sezioni/corsi_dati.json"""
import json, re, sys, datetime

LINGUE = {'Italiano', 'Sottotitoli in italiano', 'Italiano e inglese'}
LIVELLI = {'Principiante', 'Intermedio', 'Avanzato'}
FORMATI = {'Al proprio ritmo', 'Con date'}
TIPI = {'Università', 'Università popolare'}
MODALITA = {'Online', 'In presenza', 'Online e in presenza'}
ATTESTATI = {'Gratis', 'A pagamento (il corso è gratis)', 'No'}
CAMPI = ('id', 'area', 'tema', 'titolo', 'ente', 'paese', 'piattaforma', 'lingua', 'livello', 'formato', 'durata', 'attestato', 'sintesi', 'url', 'verificato', 'tipo', 'modalita')


def controlla(path):
    e = []
    try:
        d = json.load(open(path, encoding='utf-8'))
    except Exception as x:
        return ['%s non si legge: %s' % (path, x)]
    if d.get('app') != 'corsi-online':
        e.append('app deve essere «corsi-online»')
    temi = d.get('temi') or {}
    if set(temi) != {'ia', 'pens'}:
        e.append('temi deve avere le aree ia e pens')
    corsi = d.get('corsi')
    if not isinstance(corsi, list):
        return e + ['corsi deve essere una lista']
    ids, urls = set(), set()
    oggi = datetime.date.today()
    for i, c in enumerate(corsi):
        w = 'corso %d (%s)' % (i + 1, c.get('id', '?'))
        for k in CAMPI:
            if not str(c.get(k) or '').strip():
                e.append('%s: manca «%s»' % (w, k))
        if c.get('gratuito') is not True:
            e.append('%s: «gratuito» deve essere true (solo corsi gratuiti)' % w)
        if c.get('aperto') is not True:
            e.append('%s: «aperto» deve essere true (iscrizione aperta a tutti, senza essere studenti universitari)' % w)
        if c.get('modalita') in ('In presenza', 'Online e in presenza') and not str(c.get('citta') or '').strip():
            e.append('%s: per i corsi in presenza serve «citta»' % w)
        if not re.fullmatch(r'c-[a-z0-9-]+', str(c.get('id', ''))):
            e.append('%s: id deve iniziare con c- (minuscole, cifre, trattini)' % w)
        if c.get('id') in ids:
            e.append('%s: id ripetuto' % w)
        ids.add(c.get('id'))
        if c.get('area') not in temi:
            e.append('%s: area sconosciuta' % w)
        elif c.get('tema') not in temi[c['area']]:
            e.append('%s: tema «%s» non è tra quelli dell\'area' % (w, c.get('tema')))
        for k, ok in (('lingua', LINGUE), ('livello', LIVELLI), ('formato', FORMATI), ('attestato', ATTESTATI), ('tipo', TIPI), ('modalita', MODALITA)):
            if c.get(k) and c[k] not in ok:
                e.append('%s: %s «%s» non ammesso (%s)' % (w, k, c[k], ', '.join(sorted(ok))))
        u = str(c.get('url', ''))
        if not u.startswith('https://'):
            e.append('%s: url deve iniziare con https://' % w)
        if u in urls:
            e.append('%s: url ripetuto' % w)
        urls.add(u)
        if len(str(c.get('titolo', ''))) > 110:
            e.append('%s: titolo troppo lungo' % w)
        if len(str(c.get('sintesi', '')).split()) > 45:
            e.append('%s: sintesi oltre 45 parole' % w)
        try:
            v = datetime.date.fromisoformat(str(c.get('verificato')))
            if v > oggi or (oggi - v).days > 400:
                e.append('%s: data di verifica fuori intervallo' % w)
        except ValueError:
            e.append('%s: verificato deve essere AAAA-MM-GG' % w)
    prop = d.get('proposti') or []
    if not isinstance(prop, list): e.append('proposti deve essere una lista')
    for q in d.get('a_quota') or []:
        for k in ('id','nome','citta','quota','comprende','iscrizione','modalita','url','verificato'):
            if not str(q.get(k) or '').strip(): e.append('a quota %s: manca «%s»' % (q.get('id','?'), k))
        if not str(q.get('url','')).startswith('https://'): e.append('a quota %s: url deve iniziare con https://' % q.get('id'))
        if q.get('url') not in prop: e.append('a quota %s: l\'url deve essere anche in «proposti»' % q.get('id'))
    lotti = {}
    for c in corsi:
        lo = c.get('lotto')
        if not isinstance(lo, int) or lo < 1: e.append('corso %s: serve «lotto» (numero da 1)' % c.get('id'))
        else: lotti[lo] = lotti.get(lo, 0) + 1
        if c.get('url') not in prop: e.append('corso %s: l\'url deve essere anche in «proposti»' % c.get('id'))
        if isinstance(lo, int) and lo >= 3:  # 8/11/2026: dalla tappa 3 ogni corso spiega il programma e perché è il passo dopo i corsi finiti
            pg = c.get('programma')
            if not isinstance(pg, list) or not 3 <= len(pg) <= 5 or any(len(str(x).split()) > 12 for x in pg):
                e.append('corso %s: «programma» deve avere da 3 a 5 argomenti di massimo 12 parole' % c.get('id'))
            if not str(c.get('perche') or '').strip() or len(str(c.get('perche')).split()) > 30:
                e.append('corso %s: «perche» mancante o oltre 30 parole' % c.get('id'))
    for lo, n in lotti.items():
        if n > 10: e.append('lotto %d: massimo 10 corsi per ricerca (ora %d)' % (lo, n))
    if d.get('pronto'):
        if len(corsi) < 10:
            e.append('pronto: servono almeno 10 corsi (ora %d)' % len(corsi))
        for a in ('ia', 'pens'):
            n = sum(1 for c in corsi if c.get('area') == a)
            if n < 4:
                e.append('pronto: area %s con %d corsi, ne servono almeno 4' % (a, n))
        if sum(1 for c in corsi if c.get('paese') != 'Italia') < 1:
            e.append('pronto: serve almeno 1 corso di un ente non italiano')
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', str(d.get('updated', ''))):
            e.append('pronto: updated deve essere AAAA-MM-GG')
    return e


if __name__ == '__main__':
    err = []
    for p in sys.argv[1:] or ['sezioni/corsi_dati.json']:
        err += controlla(p)
    if err:
        print('❌ da sistemare:\n- ' + '\n- '.join(err))
        sys.exit(1)
    print('✅ tutto a posto')
