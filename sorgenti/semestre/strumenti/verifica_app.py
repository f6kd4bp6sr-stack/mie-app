"""Verifica automatica dell'app pubblicata in locale (uso, dalla cartella principale del repository):
   python3 sorgenti/semestre/build.py && python3 sorgenti/semestre/strumenti/verifica_app.py
Serve Playwright con Chromium (PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers nell'ambiente cloud).
Controlla: errori JavaScript, ogni argomento (pagina, tendine, animazione che disegna), tutti i pulsanti di navigazione
e delle serie di esercizi, test d'ingresso diversi a ogni ripetizione, simulazioni diverse, prova reale 2025 con badge,
salvataggio dopo il riavvio, novità del giorno, ricerca, autodiagnosi, larghezza telefono senza scorrimento orizzontale.
Esce con codice 1 se trova problemi e stampa l'elenco."""
import asyncio, sys, subprocess, time, os, json
from playwright.async_api import async_playwright
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),"../../.."))
PORT=8791
srv=subprocess.Popen([sys.executable,"-m","http.server",str(PORT),"-d",ROOT],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
B=f"http://localhost:{PORT}/semestre/"
P=[]
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch();ctx=await br.new_context(viewport={"width":1180,"height":900});pg=await ctx.new_page();errs=[]
    pg.on("pageerror",lambda e:errs.append(str(e)));pg.on("console",lambda m:m.type=="error" and "favicon" not in m.text and errs.append(m.text))
    pg.on("dialog",lambda d:(P.append("finestra di dialogo: "+d.message),asyncio.ensure_future(d.dismiss())))
    await pg.goto(B);await pg.wait_for_timeout(900)
    n=0
    for ex in ["fis","chi","bio"]:
      await pg.goto(B+f"#{ex}/arg");await pg.wait_for_timeout(300)
      for h in await pg.evaluate("[...document.querySelectorAll('.trow[data-go*=\"/t/\"]')].map(b=>b.dataset.go)"):
        await pg.goto(B+"#"+h);await pg.wait_for_timeout(220);n+=1
        r=await pg.evaluate("()=>{const a=document.querySelector('#animBox .ainfo');return{h1:(document.querySelector('#main h1')||{}).innerText||'',info:a?a.innerHTML.length:-1,folds:document.querySelectorAll('details.fold').length}}")
        if r["info"]==0: await pg.wait_for_timeout(700);r["info"]=await pg.evaluate("document.querySelector('#animBox .ainfo').innerHTML.length")
        if not r["h1"]: P.append("argomento senza titolo "+h)
        if r["info"]<=0: P.append(("animazione che non disegna " if r["info"]==0 else "argomento senza animazione ")+h)
        if r["folds"]<3: P.append("tendine mancanti "+h)
    views=["","novita","cerca","regole","fonti","prog","installa"]+[f"{e}{s}" for e in ["fis","chi","bio"] for s in ["","/test","/arg","/es","/sim","/storico","/form","/info"]]
    clicked=0
    for v in views:
      await pg.goto(B+"#"+v);await pg.wait_for_timeout(220)
      if len((await pg.evaluate("document.querySelector('#main').innerText")).strip())<40: P.append("vista vuota #"+v)
      for g in (await pg.evaluate("[...new Set([...document.querySelectorAll('#main [data-go]')].map(b=>b.dataset.go))]"))[:25]:
        await pg.goto(B+"#"+v);await pg.wait_for_timeout(100);el=await pg.query_selector(f'#main [data-go="{g}"]')
        if not el: continue
        await pg.evaluate("e=>{const d=e.closest('details');if(d)d.open=true;}",el)
        try: await el.click(timeout=2000)
        except Exception: P.append(f"pulsante non cliccabile #{v} → {g}");continue
        await pg.wait_for_timeout(120);clicked+=1
        if len((await pg.evaluate("document.querySelector('#main').innerText")).strip())<40: P.append(f"pagina vuota dopo #{v} → {g}")
      for m in (await pg.evaluate("[...new Set([...document.querySelectorAll('#main [data-pr]')].map(b=>b.dataset.pr))]"))[:12]:
        await pg.goto(B+"#"+v);await pg.wait_for_timeout(100);el=await pg.query_selector(f'#main [data-pr="{m}"]')
        if not el or await el.is_disabled(): continue
        await pg.evaluate("e=>{const d=e.closest('details');if(d)d.open=true;}",el)
        try: await el.click(timeout=2000)
        except Exception: P.append(f"serie non cliccabile #{v} {m}");continue
        await pg.wait_for_timeout(120);clicked+=1
        if not await pg.query_selector("#prBox") and "Nessuna domanda" not in (await pg.evaluate("document.getElementById('toast').textContent")): P.append(f"serie non partita #{v} {m}")
    # test d'ingresso: mai uguali
    for ex in ["fis","chi","bio"]:
      sets=[]
      for r in range(4):
        await pg.goto(B+f"#{ex}/test");await pg.reload();await pg.wait_for_timeout(600)
        if await pg.query_selector("#ptRedo"): await pg.click("#ptRedo");await pg.wait_for_timeout(300)
        for i,q in enumerate(await pg.query_selector_all("[data-pt]")):
          await (await q.query_selector_all(".opt"))[(i+r)%5].click()
        await pg.click("#ptDone");await pg.wait_for_timeout(250)
        sets.append(json.dumps(sorted(await pg.evaluate(f"JSON.parse(localStorage.getItem('semestre-v1')).exams.{ex}.pt.sel"))))
      if len(set(sets))<4: P.append(f"{ex}: test d'ingresso ripetuti")
    # simulazioni diverse e prova reale
    sims=[]
    for r in range(2):
      await pg.goto(B+"#fis/sim");await pg.reload();await pg.wait_for_timeout(600);await pg.click("#simStart");await pg.wait_for_timeout(300)
      sims.append(set(await pg.evaluate("JSON.parse(localStorage.getItem('semestre-v1')).exams.fis.run.q")));await pg.click("#simEnd");await pg.wait_for_timeout(700);await pg.click("#simEnd");await pg.wait_for_timeout(300)
    if len(sims[0]&sims[1])>3: P.append("simulazioni consecutive troppo simili")
    await pg.goto(B+"#fis/sim");await pg.reload();await pg.wait_for_timeout(600)
    rb=await pg.query_selector_all("[data-real]")
    if len(rb)!=2: P.append("pulsanti prova reale: "+str(len(rb)))
    else:
      await rb[0].click();await pg.wait_for_timeout(300);await pg.click("#simEnd");await pg.wait_for_timeout(700);await pg.click("#simEnd");await pg.wait_for_timeout(300)
      if await pg.evaluate("document.querySelectorAll('.realb').length")<20: P.append("badge prova reale mancanti in correzione")
    await pg.reload();await pg.wait_for_timeout(600)
    if await pg.evaluate("JSON.parse(localStorage.getItem('semestre-v1')).exams.fis.hist.length")<5: P.append("storico non salvato dopo il riavvio")
    await pg.goto(B+"#novita");await pg.wait_for_timeout(500)
    if await pg.evaluate("document.querySelectorAll('.nrow').length")<1: P.append("novità del giorno vuote")
    await pg.goto(B+"#cerca");await pg.wait_for_timeout(300);await pg.fill("#srch","mitosi");await pg.wait_for_timeout(200)
    if await pg.evaluate("document.querySelectorAll('#srchRes .trow').length")<1: P.append("la ricerca non trova «mitosi»")
    d=await pg.evaluate("JSON.parse(localStorage.getItem('semestre-v1')).diag")
    if not d: P.append("autodiagnosi non eseguita")
    elif d["warn"]: P.append("autodiagnosi: "+"; ".join(d["warn"]))
    await ctx.close()
    ctx=await br.new_context(viewport={"width":375,"height":800},color_scheme="dark");pg2=await ctx.new_page();pg2.on("pageerror",lambda e:errs.append(str(e)))
    for h in ["","fis/t/u3c","chi/arg","bio/sim","novita","prog"]:
      await pg2.goto(B+"#"+h);await pg2.reload();await pg2.wait_for_timeout(500)
      if await pg2.evaluate("document.documentElement.scrollWidth>innerWidth+2"): P.append("scorrimento orizzontale sul telefono: #"+h)
    await br.close()
    P.extend("errore JavaScript: "+e for e in errs)
    print(f"argomenti controllati {n}, pulsanti provati {clicked}")
asyncio.run(main());srv.terminate()
if P: print("❌ "+str(len(P))+" problemi:\n"+"\n".join(P));sys.exit(1)
print("✅ app in ordine")
