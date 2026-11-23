# Layerly — Sprint di miglioramento

Obiettivo: rendere Layerly presentabile ai recruiter (il link è già nei CV e nelle cover letter).
**Piano aggiornato (22 nov 2026):**
1. **Adesso:** sessioni 1–4 = tutti i bloccanti (B1–B10) più V1 e V2. Obiettivo: metà dicembre.
2. **Poi:** pausa da Layerly e portfolio fotografico in versione ridotta, scritto a mano (fine gennaio).
3. **Da febbraio:** Layerly a tempo pieno: sessioni 5–7 (stile, mobile, README) e poi verso un sito vero.

Prima della prima modifica: tag `v1.0-capstone` sull'ultimo commit del capstone, così la versione consegnata resta linkabile.

Criterio per decidere cosa fare: **cosa nota un recruiter nei primi 3 minuti?**

> Tutti i numeri di pagina si riferiscono al PDF **The Coding Guide.pdf**: sono la pagina esatta dell'argomento, non l'inizio del capitolo.
> Dove c'è scritto "non nel libro", l'argomento non è trattato nella guida.

---

## 1. Cosa abbiamo scoperto controllando il codice (20 nov 2026)

Alcuni "bug" in realtà sono **funzionalità mai costruite**:

| Problema visto nel sito | Causa reale nel codice |
|---|---|
| Commenti e rating non funzionano | Esiste l'entity `Comment` (con `rating` 1–5), esiste `CommentService`, **ma nessun controller**. Il frontend usa `mockData/mockComments.ts`. `Design.rating` è pensato come media dei commenti ma non viene mai calcolato. |
| I dati del profilo modificati spariscono dopo il logout | Nel backend **non c'è nessun `PUT`/`PATCH` su `/users`**, nel frontend nessuna chiamata. Le modifiche restano solo nello stato locale. |
| La tab "Saved" della Library | Non esiste nessuna entity o migration. `LibraryPage.tsx` usa `mockSavedIds` ("MOCK TEMPORANEO"). |
| Nella repo manca il README | Nella cartella principale ci sono solo `Backend`, `Frontend` e `netlify.toml`. |

Endpoint esistenti oggi:
- `POST /auth/register`, `POST /auth/login`
- `GET /designs`, `GET /designs/{id}`, `POST /designs` (multipart), `DELETE /designs/{id}`
- `GET /orders/customer/{customerId}`, `POST /orders`
- `GET /users`, `GET /users/{id}`, `POST /users/me/photo`

---

## 2. Metodologia professionale (spiegata)

Questa è la parte che conta anche al colloquio. Il flusso è questo: **un problema diventa una issue, poi un branch, poi dei commit, poi una PR, che viene unita e chiude la issue**.
È lo stesso flusso dei team veri, solo in piccolo.

### 2.1 Una GitHub Issue per ogni problema
**Perché:** la lista vive nella repo, non in un file privato o in una chat. Chi apre il tuo GitHub vede che lavori con metodo.

Come:
1. Apri la repo su GitHub, vai su **Issues** e poi **New issue**.
2. Titolo breve e preciso, per esempio: `Purchase without login freezes the app with no message`.
3. Corpo della issue, sempre con lo stesso schema:
   ```
   Where: Payment page — desktop + mobile
   Steps: 1. Log out  2. Add a design to cart  3. Click "Buy"
   Expected: redirect to login, cart preserved, back to payment after login
   Actual: app freezes, no message
   Screenshot: (trascina qui l'immagine)
   ```
4. **Etichette (labels):** `bug`, `ui`, `enhancement`, più `frontend`/`backend`/`mobile`. Le etichette `bug` ed `enhancement` esistono già; le altre le crei da Issues → Labels.
5. **Milestone:** `Sprint 1 – Polish` per quelle dello sprint, `Later` per quelle rinviate.
6. Facoltativo ma utile: la tab **Projects**, con una board *To do / In progress / Done*.

Scrivi le issue **in inglese**: è la lingua della repo e di chi la valuta.

### 2.2 Un branch per ogni issue (o piccolo gruppo di issue)
**Perché:** `main` resta sempre funzionante, ed è quello che Netlify e Render pubblicano. Se un lavoro va male, butti il branch e il sito non ne risente.

Nome del branch: prefisso, numero della issue e descrizione in kebab-case minuscolo.
```
fix/12-cart-login-redirect
feat/15-comments-endpoint
style/20-sass-theme
docs/30-readme
```
Comandi (libro pag. **319–321**: branch, merge, fetch/pull/push):
```
git switch main
git pull
git switch -c fix/12-cart-login-redirect
... lavori ...
git push -u origin fix/12-cart-login-redirect
```

### 2.3 Commit piccoli con un prefisso (Conventional Commits)
**Perché:** la storia diventa leggibile, e la parola chiave `closes #n` chiude la issue automaticamente quando arriva su `main`.

| Prefisso | Quando |
|---|---|
| `fix:` | correggi un bug |
| `feat:` | aggiungi una funzionalità |
| `style:` | solo aspetto (CSS/Sass) |
| `refactor:` | riorganizzi il codice senza cambiarne il comportamento |
| `docs:` | README e documentazione |
| `chore:` | pulizia, configurazione, file inutili |

Esempi:
```
fix: redirect guests to login on checkout and keep cart (closes #12)
feat: add GET/POST /designs/{id}/comments
style: replace default Bootstrap palette with Sass variables
```
Regola: **un commit = una cosa**. Se nel messaggio ti viene da scrivere "e", probabilmente sono due commit.

### 2.4 Pull Request verso main
**Perché:** ti obbliga a rileggere tutto il diff prima che vada online. È la tua code review.

1. Su GitHub: **Compare & pull request**.
2. Nella descrizione: cosa cambia, come l'hai testato, `Closes #12`, uno screenshot se è un cambiamento visivo.
3. Nella tab **Files changed** rileggi tutto: console.log dimenticati, codice commentato, segreti.
4. **Merge** e poi elimina il branch.
5. Netlify e Render ripubblicano da `main`: aspetta il deploy e controlla il sito online.

Il flusso Gitflow completo con develop, release e hotfix è a pag. **323** (ripasso a pag. **324**). Per un progetto da solo basta `main` con i branch per le issue.

### 2.5 Definition of Done: quando una issue si può chiudere
- [ ] Funziona su **desktop e su mobile** (DevTools → modalità dispositivo, poi anche sul telefono vero)
- [ ] Nessun errore nella console del browser né nei log del backend
- [ ] Se arrivano dati dall'utente, il **backend li valida**, non solo il frontend
- [ ] Testato in locale, poi **sul sito online** dopo il deploy
- [ ] Commit con il prefisso giusto, PR unita, issue chiusa
- [ ] Se il cambiamento è visivo: screenshot "dopo" salvato

### 2.6 Time-box e "parcheggio" delle idee
Durante il lavoro ti verranno nuove idee: è normale. **Non le implementi subito.** Apri una issue `enhancement` con milestone `Later` e torni a quello che stavi facendo.
È la difesa contro il progetto che non finisce mai.

### 2.7 Metodo di studio dentro ogni sessione
1. Leggi le pagine del libro indicate per quella sessione (max 10, di solito 5–6).
2. A libro chiuso: 3–4 frasi con parole tue, poi controlli.
3. Implementi da solo. Se ti blocchi su una sintassi che non è nel libro, chiedi solo lo scheletro.

### 2.8 La storia da raccontare al colloquio
"Ho pubblicato il mio capstone e ho chiesto un parere a un collega. Mi ha detto che era brutto e pieno di bug. Ho fatto un giro completo del sito su desktop e mobile, ho aperto una issue per ogni problema, li ho classificati in bloccanti, visibili e funzionalità future, e li ho risolti in ordine di priorità con branch, PR e commit convenzionali. Quello che non c'era tempo di fare è nel README come roadmap."
È esattamente il tipo di esempio concreto che chiedono ai junior: accetti le critiche, dai priorità, lavori con un processo.

---

## 3. Prima di iniziare (sessione 0, circa 30 min)

- [ ] **Cancella dal database di produzione (Neon)** gli account e i contenuti di test del tuo amico. Un recruiter che li trova su una pagina designer vale più di qualunque bug grafico.
- [ ] Salva gli screenshot **"prima"** (home, catalogo, dettaglio, carrello, pagina designer, pagamento), su desktop e su mobile. Mettili in una cartella fuori dalla repo, o in `docs/screenshots/before/`.
- [ ] Crea le **labels** e le **milestones** su GitHub e apri le issue della sezione 4 (anche quelle "Later").
- [ ] Portfolio: verifica che la V4 (`CollectionPhoto` + `CollectionPhotoId`) sia committata e pushata su `feature/db-schema`.
- [ ] Pulizia (`chore:`): elimina `Frontend/public/_redirects.txt` (vuoto; quello buono è `_redirects`); sposta le note "come funziona Flyway" da `db/migration` a `docs/`; elimina `MainAction`/`Mainstate` in `types/index.ts` se non sono usati.

---

## 4. La lista classificata

### 🔴 Bloccanti: milestone `Sprint 1 – Polish`, label `bug`
| ID | Problema | Peso |
|---|---|---|
| B1 | L'acquisto senza login blocca l'app senza messaggio → deve portare al login **conservando il carrello** e poi tornare al pagamento | M |
| B2 | Il carrello non segue il login (resta tra un account e l'altro). Regola: da ospite il carrello è permesso; al login resta; al **logout si svuota** | M |
| B3 | Commenti e rating finti → controller, collegamento al frontend, ricalcolo della media | L |
| B4 | Profilo che non salva → `PUT /users/me` | M |
| B5 | Library e Purchase History: dati veri (titolo, miniatura, link al dettaglio); **nascondere la tab Saved**; "Purchased" coerente con Purchase History | M |
| B6 | Searchbar non funzionante → ricerca base per titolo/tag (oppure toglierla) | M |
| B7 | Login e registrazione: messaggi di errore chiari; nome e cognome senza numeri; email validata **anche nel backend** | S |
| B8 | Card della homepage non cliccabili | S |
| B9 | Testi segnaposto nel footer; placeholder della carta che sembra un IBAN; testi non in inglese | S |
| B10 | Upload di un design: nessun caricamento e alert del browser → spinner + messaggio nella pagina | S |

Nota sull'email: `cazzo@cazzo.com` ha un **formato valido**. Nessuna validazione può bloccarla; la soluzione vera è la verifica via email, che va in "Later".

### 🟡 Visibili: label `ui` (sessioni 5–6, tranne V1 e V2)
| ID | Problema |
|---|---|
| V1 | Bottone **"Fill demo data"** in login, registrazione e pagamento (costa poco e rende molto: anticipato alla sessione 1) |
| V2 | Pagamento da loggato: nome ed email compilati in automatico (anticipato alla sessione 1) |
| V3 | Tema Sass: palette, font, angoli, ombre. Basta con il "tutto bianco" |
| V4 | Nuovo design delle card: hover, `cursor: pointer` su tutto ciò che è cliccabile, rating in stelle **uguale** su card e dettaglio, rating visibile anche nelle card del profilo, togliere l'icona dell'occhio, icona che cambia quando il design è nel carrello |
| V5 | Allineamenti: carrello e login nella navbar, "published on … by …" nel dettaglio, la X dentro l'avviso rosso, bottoni attaccati al footer ("Save changes", "Keep exploring"), iniziali maiuscole |
| V6 | Bottone search della searchbar da ridisegnare |
| V7 | Spinner tra una chiamata API e l'altra (in generale) |
| V8 | Dettaglio con foto verticale: la selezione delle foto esce dal viewport |
| V9 | Pagina designer: placeholder quando è vuota, descrizione a destra del nome, box che separa la sezione designs, sfumatura tra sfondo e box info |
| V10 | Mobile: searchbar come icona accanto al carrello (o su una riga sotto); form di login più largo; margine sopra il titolo di Personal info; Order Summary in alto e a tutta larghezza, con prezzo, nome ed € allineati; carosello della home più basso; dettaglio con carosello in alto, info sotto, "published on" sotto "more about my design", miniatura cliccabile del designer |

### ⚪ Fuori dallo sprint: milestone `Later`, label `enhancement` → README "Miglioramenti previsti"
- Pagina di ricerca dedicata con filtri (tag, designer, titolo/descrizione, posizione)
- Saved / wishlist (richiede entity, migration ed endpoint)
- Personalizzazione del profilo designer (colori, font, sfondi, animazioni)
- Passaggio profilo utente ↔ designer e PRO ↔ AMATORIAL dal profilo
- Il designer cambia la propria foto di sfondo
- Selettore lingua (spagnolo)
- "Buy now" e "View cart" accanto ad "Add to cart"
- Bottone commenti sulle card (le card portano già al dettaglio)
- Freccia "indietro" o breadcrumb
- Verifica dell'email in registrazione

---

## 5. Piano delle sessioni

### Sessione 1: carrello e autenticazione (B1, B2, V1, V2)
**Libro**
- Redux: store, action, reducer → pag. **171–175**; reducer multipli e azioni asincrone → pag. **178–179**
- React Router, `useNavigate` → pag. **153–154**; `useLocation` (per ricordare da dove arrivavi) → pag. **155**; hook del router → pag. **156**
- Web Storage e JSON.stringify/parse → pag. **113** (`redux-persist`, che usi già, *non è nel libro*)
- Input controllati (per "Fill demo data" e per l'autocompilazione) → pag. **137–139**

**Cosa decidere e fare**
1. Leggi `cartReducer.tsx` e la configurazione di persist in `redux/store/index.tsx`: dove viene salvato il carrello e chi lo svuota?
2. Logout: deve spedire anche un'azione che svuota il carrello.
3. Checkout da ospite: invece di chiamare l'API, porta al login ricordando la pagina di provenienza; dopo il login torni lì con il carrello intatto.
4. Prima di chiamare `POST /orders` controlla il token. Se la chiamata fallisce, mostra un messaggio: niente blocchi silenziosi.
5. "Fill demo data": un bottone che imposta lo stato del form con dati finti evidenti (`demo@layerly.dev`, la carta di test `4242 4242 4242 4242`). **Mai dati reali.**
6. Pagamento da loggato: nome ed email presi dallo store (`useSelector`).

### Sessione 2: profilo, Library e Purchase History (B4, B5, B9)
**Libro**
- Controller, `@RequestBody`, `@PathVariable` → pag. **279–282**
- Update che riusa `findById` → pag. **285**
- `@AuthenticationPrincipal` per l'endpoint `/users/me` → pag. **301** (esempio di `/me` a pag. **305**)
- DTO e validazione con `@Valid`, `@Email` → pag. **290–291**
- Status code (200 per PUT/PATCH) → pag. **277**
- fetch con PUT → pag. **124**; try/catch → pag. **123**
- Relazioni e lato proprietario (Order → OrderItem → Design) → pag. **239–241**; ripasso → pag. **242–243**

**Cosa fare**
1. Backend: `PUT /users/me` con un DTO che contiene solo i campi modificabili (mai password o ruolo). L'utente arriva da `@AuthenticationPrincipal`, **non da un id nell'URL**: altrimenti chiunque potrebbe modificare chiunque.
2. Frontend: Personal info chiama l'endpoint e aggiorna anche lo store, così i dati restano dopo il refresh.
3. Ordini: la risposta di `GET /orders/customer/{id}` deve contenere titolo e miniatura di ogni design (un DTO con gli `OrderItem`). Attenzione alla `LazyInitializationException`: è il ripasso di pag. **242–243**.
4. Purchase History: titolo, miniatura, link al dettaglio. Library "Purchased": stessi dati. Tab "Saved": **nascosta**.
5. Footer, placeholder della carta, testi in inglese.

### Sessione 3: commenti e rating (B3)
**Libro**
- Relazioni `@ManyToOne` / `@OneToMany` / `mappedBy` → pag. **239–241**
- Repository, service, query → pag. **268–270**
- Controller e parametri → pag. **279–282**
- Gestione errori con `@ControllerAdvice` → pag. **287–288**
- Validazione (`@Min(1) @Max(5)` sul rating) → pag. **290–291**
- Filtro JWT e utente autenticato → pag. **296**, **301**
- Frontend: data fetching, loader, errori → pag. **140–143**

**Cosa fare**
1. `CommentController`: `GET /designs/{id}/comments` (pubblico: SecurityConfig permette già GET su `/comments/**`, quindi controlla quale percorso scegli) e `POST /designs/{id}/comments` (solo da autenticati; l'autore arriva da `@AuthenticationPrincipal`).
2. Un DTO in ingresso con testo e rating; un DTO in uscita con autore, data, testo e rating (non restituire l'entity `User` intera).
3. Nel service, dopo il salvataggio, ricalcola `Design.rating` come media dei commenti.
4. Frontend: sostituisci `mockComments.ts` con le chiamate vere, poi elimina il file mock (`chore:`).
5. Domanda da colloquio da prepararsi: "Un utente può commentare due volte lo stesso design? Come lo impediresti?" (vincolo UNIQUE su `(user_id, design_id)` con una nuova migration). Decidi tu se farlo o metterlo in `Later`.

### Sessione 4: ricerca, card, validazione e feedback (B6, B7, B8, B10)
**Libro**
- Query derivate con `Containing` e `IgnoreCase` → pag. **271**
- `@RequestParam` → pag. **279–283**
- Link e navigazione → pag. **154**; leggere la query string dall'URL → pag. **155**
- Validazione backend → pag. **290–291**; errori restituiti al client → pag. **287–288**
- Spinner e messaggi di errore (Alert) → pag. **142–143** (il componente Toast *non è nel libro*: va bene anche un Alert dentro la pagina)

**Cosa fare**
1. Backend: `GET /designs?q=...` che cerca nel titolo (ed eventualmente nei tag), senza distinguere maiuscole e minuscole.
2. Frontend: la searchbar porta al catalogo con `?q=...`; il catalogo legge il parametro e chiama l'API. Nessuna pagina nuova: quella dedicata è in `Later`.
3. Card: tutta la card diventa un link al dettaglio.
4. Login e registrazione: il backend restituisce messaggi precisi (`@NotBlank`, `@Email`, `@Pattern` su nome e cognome; `@Pattern` *non è nel libro*, la sintassi è simile alle altre annotazioni di pag. 290). Il frontend li mostra sotto il campo giusto.
5. Upload: spinner durante l'invio, poi un messaggio nella pagina invece dell'`alert()`.

### Sessioni 5 e 6: aspetto e mobile (V3–V10)
**Libro**
- Personalizzare Bootstrap: override CSS e variabili Sass → pag. **103–105** (le variabili sono in `node_modules/bootstrap/scss/_variables.scss`, pag. **105**; con Sass cambi anche gli stati hover/active/disabled, pag. **104–105**)
- Sass: media query e breakpoint → pag. **101**; schemi riassuntivi → pag. **102**
- Responsive design, media query, mobile first → pag. **72–73**
- Componenti interattivi di Bootstrap (carousel) → pag. **94** (in React-Bootstrap il `Carousel` è un componente, non un attributo `data-bs-*`)

**Cosa fare**
1. Sessione 5: un file di variabili Sass (`$primary`, `$secondary`, `$font-family-base`, `$headings-font-family`, `$border-radius`, ombre), importato **prima** di Bootstrap. Scegli 2 font (Google Fonts) e una palette di 3–4 colori. Poi navbar, card (V4), allineamenti (V5), bottone search (V6).
2. Sessione 6: mobile (V10), dettaglio con foto verticale (V8), pagina designer (V9), spinner generali (V7).
3. Dopo ogni modifica visiva: controlla a 375 px (telefono), 768 px (tablet) e 1280 px (desktop).

### Sessione 7: README e chiusura
**Libro:** Git, merge, push → pag. **319–321**; ripasso → pag. **324**

**Il README (in inglese) deve contenere**
1. Nome e una frase su cosa fa Layerly
2. Link al sito online + nota: *"The backend runs on Render's free tier: the first request can take ~50 seconds to wake the server up."*
3. Credenziali demo (un utente e un designer di prova), oppure un rimando al bottone "Fill demo data"
4. 3–4 screenshot (home, dettaglio, profilo designer, versione mobile)
5. Stack: frontend (React, TypeScript, Redux Toolkit, React Router, React-Bootstrap, Sass), backend (Java 25, Spring Boot, Spring Security + JWT, Spring Data JPA, Flyway), database (PostgreSQL su Neon), Cloudinary, deploy (Netlify + Render)
6. Come avviarlo in locale (variabili d'ambiente richieste, **senza i valori**)
7. "Planned improvements" = la lista `Later`, magari con il link alla milestone su GitHub
8. Facoltativo: una sezione "What I improved after feedback" con un paio di screenshot prima/dopo

Chiusura: chiudi la milestone `Sprint 1 – Polish`, fai il percorso del recruiter completo sul sito online e torna al portfolio.

---

## 6. Regole per l'assistente nel terminale

Da incollare o ricordare all'inizio di ogni sessione:
- Modalità di lavoro su Layerly: **io do le istruzioni, l'assistente nel terminale scrive il codice**. Prima di modificare, spiega in breve cosa farai e in quali file; dopo, spiega cosa hai cambiato e perché, in modo che io sappia rispiegarlo a un colloquio.
- Una issue alla volta, su un branch dedicato; commit piccoli con Conventional Commits e `closes #n`.
- Quando mi rimandi alla teoria, usa le pagine esatte del PDF *The Coding Guide* indicate in questo file.
- Valutazioni critiche e oneste, niente linguaggio generico.
- Sicurezza:
  - i segreti (DB_PASSWORD, TOKEN_PW, API_KEY, API_SECRET) stanno solo nelle variabili d'ambiente di Render e nel file locale `env.properties`, che è in `.gitignore`. **Mai nel frontend, nella repo o in chat.**
  - Il frontend contiene solo `VITE_API_URL`; dopo averla cambiata su Netlify serve un redeploy.
- Flyway: **mai modificare una migration già eseguita**. Ogni modifica allo schema va in una nuova `V<n>__descrizione.sql`, perché Flyway salva il checksum di ogni file in `flyway_schema_history`.
- Non fare commit né push senza che io lo chieda.

---

## 7. Stato avanzamento

Aggiornato a ogni sessione (✅ fatto · 🔄 in corso · ⬜ da fare).

| ID | Stato | Branch / PR | Note |
|---|---|---|---|
| Sessione 0 | 🔄 | — | ✅ pulizia DB test (utente 13, 22 nov) · ⬜ issue B1/B2 · ⬜ commit del piano |
| B1 | ⬜ | | checkout da ospite → login → ritorno al pagamento |
| B2 | ⬜ | | svuotare il carrello al LOGOUT |
| B3 | ⬜ | | commenti e rating |
| B4 | ⬜ | | PUT /users/me |
| B5 | ⬜ | | Library e Purchase History |
| B6 | ⬜ | | ricerca base |
| B7 | ⬜ | | validazione login/register |
| B8 | ⬜ | | card cliccabili |
| B9 | ⬜ | | footer, placeholder carta, testi in inglese |
| B10 | ⬜ | | upload: spinner + messaggio |
| V1 | ⬜ | | Fill demo data |
| V2 | ⬜ | | autocompilazione nome/email al pagamento |
| V3–V10 | ⬜ | | stile e mobile (sessioni 5–6) |
| README | ⬜ | | sessione 7 |
