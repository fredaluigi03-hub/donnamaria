# Client

## Company

Name: Donna Maria Suite & Relax

Industry: Ospitalità / boutique hotel

Website: valore reale in `config/site.ts` → `NEXT_PUBLIC_SITE_URL` (dominio
di produzione su Vercel; non fissato in questo file per evitare di
duplicare una fonte che può cambiare).

Location: Via Tenente Paolo de Vivo 10, 83028 Serino (AV), Irpinia,
Campania.

Target Audience: non documentato esplicitamente — dedotto dal copy
esistente ("rifugio di charme", "ospitalità autentica"): coppie/adulti in
cerca di un soggiorno di relax nell'entroterra campano (Irpinia), non
famiglie con bambini o turismo di massa.

Primary Goal: prenotazioni dirette (bottone "Prenota Ora" in evidenza in
ogni Hero).

Secondary Goals: non documentati.

---

## Brand

Mission: non documentata.

Vision: non documentata.

Core Values: non documentati.

Tone of Voice: non formalizzato — `docs/01_Brand.md` è ancora il template
vuoto. Dal copy esistente: registro caldo, evocativo, in italiano,
seconda persona implicita ("il tuo rifugio di charme").

Brand Personality: non documentata formalmente.

---

## Visual Identity

Primary Colors: vedi token in `app/globals.css` (`@theme`) — non duplicati
qui per evitare disallineamento, quella è la fonte di verità.

Secondary Colors: idem.

Accent Colors: idem.

Typography: vedi `lib/fonts.ts` / `app/globals.css`.

Logo: `public/images/logo.png`.

Style References: non documentati formalmente.

---

## Competitors

Non documentati — nessun audit competitor esiste per questo progetto.

---

## Notes

- Amenità confermate (da `app/page.tsx`, JSON-LD strutturato): piscina
  panoramica, jacuzzi, sauna, Wi-Fi gratuito, parcheggio privato.
- Nessuna email di contatto reale confermata ancora — `config/site.ts` usa
  un placeholder deliberatamente riconoscibile (`DA-COMPILARE@...`)
  invece di un indirizzo plausibile, apposta per non rischiare che finisca
  in produzione inosservato.
- Nessun `reviewsUrl` (Google/Booking) ancora fornito — il bottone "Leggi
  tutte le recensioni" resta non renderizzato finché non arriva.
- Nessun profilo social attivo al momento (`config/site.ts`, `links: {}`).
- `docs/01_Brand.md` a livello di progetto è ancora il template non
  compilato — questo file (`client.md`) contiene solo i fatti reali già
  reperibili nel codice; voce/tono/posizionamento andrebbero definiti
  formalmente in una sessione dedicata, non inferiti a posteriori dal
  copy esistente.
