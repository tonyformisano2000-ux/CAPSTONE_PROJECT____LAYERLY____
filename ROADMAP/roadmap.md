# Layerly — Roadmap Capstone Project

**E-commerce di progetti 3D stampabili — Consegna: 12/08/2026**
**Inizio: 29/07/2026 · 14 giorni operativi**

---

## 1. Stack tecnologico completo

### Frontend
| Livello | Tecnologia |
|---|---|
| Build tool | Vite |
| Linguaggio | TypeScript |
| UI Library | React 18 |
| State (client) | Redux Toolkit |
| State (server) | TanStack Query (React Query) |
| Routing | React Router v6 |
| UI Kit | React-Bootstrap + Sass (customizzazione tema) |
| Form | React Hook Form + Zod |
| HTTP client | Axios (con interceptor JWT) |
| Preview 3D | react-three-fiber + drei (rendering STL/GLTF nel browser) |
| Test | Vitest + React Testing Library |

### Backend
| Livello | Tecnologia |
|---|---|
| Framework | Spring Boot |
| Sicurezza | Spring Security + JJWT 0.13.x |
| Persistenza | Spring Data JPA |
| Database | PostgreSQL |
| Migrazioni | Flyway |
| Validazione | Bean Validation (jakarta.validation) |
| Documentazione API | Springdoc OpenAPI (Swagger UI) |
| Test | JUnit 5 + Mockito |
| Pagamenti | Stripe (test mode) |
| Storage file (STL/immagini) | Cloudinary |

### Trasversali
- Docker Compose (Postgres locale)
- GitHub Actions (build + test pipeline minimale)
- Postman/Insomnia (collection API)
- ESLint + Prettier

---

## 2. Architettura funzionale

### Ruoli utente
- **CUSTOMER** — naviga catalogo, acquista, scarica file dopo pagamento, lascia recensioni
- **DESIGNER** — carica/gestisce i propri progetti 3D, vede le vendite
- **ADMIN** — gestione categorie, moderazione, utenti

### Entità principali
```
User (id, email, password, role, nome, ...)
Design (id, titolo, descrizione, prezzo, fileUrl(STL), previewImages[], designerId, categoryId, licenseType, createdAt)
Category (id, nome, slug)
Order (id, customerId, status, totale, createdAt)
OrderItem (id, orderId, designId, prezzoAlMomento)
Review (id, designId, customerId, rating, commento)
Cart (gestito lato client con Redux, sincronizzato all'ordine finale)
```

### Flussi chiave (MVP)
1. Registrazione/login con scelta ruolo (customer/designer)
2. Designer carica un progetto (file STL + immagini preview + metadati)
3. Customer naviga/filtra catalogo, vede anteprima 3D interattiva
4. Customer aggiunge al carrello → checkout → pagamento Stripe test
5. Post-pagamento: accesso al download del file
6. Recensioni sui progetti acquistati
7. Dashboard designer: elenco progetti caricati, vendite, guadagni stimati

### Cosa NON è MVP (da menzionare come "sviluppi futuri" nella presentazione)
- Sistema di messaggistica designer-cliente
- Wishlist
- Sistema di licenze avanzato (commerciale vs personale)
- Notifiche email

---

## 3. Scaletta aggiornata al 31/07 (stato reale)

> Ultimo aggiornamento: 31/07, dopo un giorno perso su un problema di tipizzazione redux-persist + TypeScript. Sostituisce le tabelle precedenti. Aggiornami quotidianamente su tempo effettivo disponibile: questa scaletta è un punto di partenza, non un vincolo rigido.

| Giorno | Data | Focus |
|---|---|---|
| ~~1-2~~ | ~~29-30/07~~ | Setup, tipi, mock, routing, Redux — **fatto** |
| 3 | Sab 1/08 | Homepage + Catalogo popolati con mock, contatore carrello in Navbar collegato a Redux |
| 4 | Dom 2/08 | DesignDetailPage con mock + preview 3D (anche solo un modello placeholder) + filtro tag su Catalogo |
| 5 | Lun 3/08 | CartPage + CheckoutPage (UI statica, no Stripe ancora) |
| 6 | Mar 4/08 | AuthPage (login/register + validazione) + LibraryPage/BusinessPage con mock |
| 7 | Mer 5/08 | Buffer recupero ritardi + **avvio backend**: Spring Boot init, entità JPA, Postgres+Flyway |
| 8 | Gio 6/08 | Backend: Auth JWT |
| 9 | Ven 7/08 | Backend: CRUD Design + upload |
| 10 | Sab 8/08 | Backend: Cart/Order + Stripe test |
| 11 | Dom 9/08 | Backend: Review + filtri + Swagger + deploy backend |
| 12 | Lun 10/08 | **Integrazione**: sostituzione mock con chiamate reali, auth vera |
| 13 | Mar 11/08 | **Estetica** (giornata dedicata, non improvvisata) + testing generale + bugfix + deploy frontend |
| — | Mer 12/08 | **Consegna** |

Se un blocco tecnico ruba ancora tempo durante la settimana, il primo candidato al taglio è la preview 3D con foto/video multipli: tienila minimale (un solo modello statico) piuttosto che rincorrere l'interattività completa.

---

## 4. Checklist copertura curriculum EPICODE (6 mesi)

Layerly deve dimostrare ogni tecnologia studiata. La maggior parte emerge naturalmente dalla struttura già definita; solo 3 voci richiedono un'azione deliberata.

| Argomento | Dove vive in Layerly | Stato |
|---|---|---|
| HTML5/CSS3, Flexbox, Animations | Layout, transizioni | Naturale |
| Bootstrap/Sass | React-Bootstrap + variabili Sass custom | Naturale |
| JS fondamenti, DOM, ES6, BOM, Forms | Sotto ogni componente React | Naturale |
| Fetch/AJAX/Promises/Async-await | Axios + React Query | Naturale |
| React/SPA/componenti/state/lifecycle | Core dell'app | Naturale |
| Redux/Reducers/TypeScript/state elevation | Slice carrello + auth | Naturale |
| React Router | Le 12 pagine | Naturale |
| **React Testing** | — | ⚠️ Aggiungere di proposito: 2-3 test Vitest/RTL su componenti chiave |
| Java/OOP, Collections, Streams/Lambda, File Handling | Logica servizi backend | ⚠️ Rendere visibile: usare esplicitamente uno Stream (`.filter().map()`) nel filtro catalogo |
| SQL/PostgreSQL/JPA | Entità + query | Naturale |
| Spring Framework/IoC/DI/Spring Data/JUnit | Struttura standard Spring Boot | Naturale |
| REST API/Error Handling/File Upload | CRUD Design + upload STL | Naturale |
| Spring Security/JWT/Password Hashing | Auth | Naturale |
| **Design Patterns** | — | ⚠️ Sceglierne uno deliberato e nominarlo nel README (es. Strategy per prezzo/licenza, Builder per l'ordine) |
| Advanced Git | Commit incrementali, branch feature | Naturale se si mantiene disciplina commit |

### Regola anti-dispersione: COMING SOON
Ogni idea che emerge e **non serve a coprire una voce di questa tabella** (wishlist, messaggistica designer-cliente, licenze avanzate, notifiche email...) va inserita come voce visibile ma disabilitata/etichettata **"Coming Soon"** nell'interfaccia — mai come codice funzionante. Questo mantiene il progetto percepibile come completo senza doverlo costruire davvero, e protegge il tempo per l'MVP reale.

## 5. Note operative
- Riutilizza la logica JWT già collaudata nel progetto "Gestione Eventi" (jjwt 0.13.x, package `exeptions`, DTO inline)
- Committa versioni funzionanti incrementali ad ogni giornata, non a fine feature
- La preview 3D con react-three-fiber è il differenziatore del progetto: se il tempo stringe, tienila come priorità rispetto a feature secondarie come le recensioni
- Ricorda di aggiungere il link GitHub nei documenti CV/cover letter una volta pubblicato
