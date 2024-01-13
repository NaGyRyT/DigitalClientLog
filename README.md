# Digital Client Log
- Database: MySQL,
- Server: Node.js (express, cors, body-parser, bcrypt),
- Client: React (react-router-dom, react-bootstrap, bcryptjs-react)

## Belépés
- csak létező felhasználó tud belépni törölt, inaktivált nem
- a bejelentkezett felhasználó neve megjelenik a menüben rákattintva módosítható a bejelentkezett felhasználó neve és jelszava

## Felhasználók 
- ezt a menüpontotot csak az admin csoport tagjai láthatják

### Új felhasználó felvétele
- két azonos felhasználónév nem engedélyezett
- a felhasználónév minimum 4 maximum 20 karakter lehet
- a név mező nem lehet üres, maximum 100 karakter lehet
- a jelszó minimum 8 karakter lehet 
- csoportot választani kötelező a legördülő listából

### Felhasználók listája
- részletek
- szerkesztés
- törlés/inaktiválás
- a táblában lehet keresni és rendezni is
- az inaktavált felhasználókat meg lehet jeleníteni és újra lehet őket aktiválni

#### Felhasználó adatainak szerkesztése
- felhasználónév nem módosítható
- ha jelszó mező üres marad, akkor nem változik az eredeti jelszó
- admin felhasználó csoportját nem lehet módosítani 

#### Felhasználó törlése
- ha nincs naplóbejegyzése a felhasználónak akkor törölhető egyébként csak inaktiválható
- admin felhasználót nem lehet törölni

## Csoportok
A felhasználók csak a saját csoportjukban lévő ügyfeleket és felhasználókat láthatják.
Ha a felhasználó "átmegy" másik csoportba akkor az eddigi ügyfeleit, naplóbejegyzéseit nem látja.

### Új csoport felvitele
- név minimum 5 karakter, két ugyanolyan nevű csoport nem lehet
- leírás kötelező

### Csoportok listája
- részletek
- szerkesztés
- törlés

## Ügyfelek

### Új ügyfél felvétele
- a név mező nem lehet üres
- ügyfél azonosító 9 karakter lehet (pl.: TAJ)
- két azonos azonosítójú űgyfél egy csoporton belül nem lehet
- jövőbeni születési dátum nem engedélyezett
- nem választás kötelező
- e-mail kötelező validálva van a @ és a .
- irányítószám, város kötelező, egymástól függő mezők
- utca, házszám, emelet nem kötelező

### Ügyfelek listája
- részletek
- új naplóbejegyzés felvitele
- szerkesztés
- törlés

####  Ügyfél adatainak megnézése (részletek)
- ha tartozik az ügyfélhez naplóbejegyzés akkor az itt is megjelenik
- itt is felvihetőek új naplóbejegyzések
- a naplóbejegyzéseket itt is lehet nézni, szerkeszteni és törölni

#### Ügyfél adatainak szerkesztése
- minden mező módosítható
- ugyanaz a validáció, mint az új ügyfél felvitelénél

#### Ügyfél törlése
- csak az az ügyfél törölhető amelyiknek nincs naplóbejegyzése

## Napló

### Naplóbejegyzések listája
- csak saját naplóbejegyzést lehet törölni és szerkeszteni
- részletek
- szerkesztés
- törlés

## Kimutatások
- korosztály (0-18, 18-40, 41-65, 65 felett )
- nem (férfi/nő)
- felhasználókhoz tartozó naplóbejegyzések száma (havi lebontásban)
- ügyféltalálkozások időtartama 
- felhasználók naplóbejegyzéseinek száma 


#### Források
https://react.dev/
https://react-bootstrap.netlify.app/
https://www.npmjs.com/package/react-bootstrap-pagination-control
https://www.npmjs.com/package/validator
https://www.npmjs.com/package/bcrypt
https://www.npmjs.com/package/bcryptjs-react
https://www.chartjs.org/docs/latest/