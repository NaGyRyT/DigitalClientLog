# DigitalClientLog

---

Egy egyszerű programot készítettem amivel ügyfelek adatait (név, cím, stb.) és az ügyfél találkozással kapcsolatos adatokat (dátum, időtartam, leírás, stb.) lehet tárolni React, NodeJS, MySQL felhasználásával. A programban lehetőség van felhasználókat és csoportokat is felvenni. 

---

Ha kíváncsi vagy hogy működik a program látogass el ide: https://tryme.digitalclientlog.com

Az adatbázis minden nap 23:59-kor (GMT+1) felülíródik a minta adatokkal!

Bejelentkezéshez:
- adminisztrátor: admin/22222222
- felhasználó: user/11111111

---

GitHub: https://github.com/NaGyRyT/DigitalClientLog

---

## Belépés
- csak létező felhasználó tud belépni törölt, inaktivált nem
- a bejelentkezett felhasználó neve megjelenik a menüben rákattintva módosítható a bejelentkezett felhasználó neve és jelszava

## Felhasználó
Ezt a menüpontotot csak az admin csoport tagjai láthatják/kezelhetik.

### Új felhasználó felvétele
- két azonos felhasználónév nem engedélyezett
- a felhasználónév minimum 4 maximum 20 karakter lehet
- a név mező nem lehet üres, maximum 100 karakter lehet
- A jelszónak minimum 1 kisbetűt, 1 nagybetűt, 1 számot és 1 speciális karaktert kell tartalmaznia. A hossza minimum 8 maximum 60 karakter lehet. 
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

## Csoport
Ezt a menüpontotot csak az admin csoport tagjai láthatják/kezelhetik.
A felhasználók csak a saját csoportjukban lévő ügyfeleket és felhasználókat láthatják.
Ha a felhasználó "átmegy" másik csoportba akkor az eddigi ügyfeleit, naplóbejegyzéseit nem látja.

### Új csoport felvitele
- név minimum 5 karakter, két ugyanolyan nevű csoport nem lehet
- leírás kötelező

### Csoportok listája
- részletek
- szerkesztés
- törlés

## Ügyfél

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
- csak a saját csoportban lévő adatokból készül kimutatás kivéve az admin csoport tagjait ahol az összes csoport adataiból
- nem (férfi/nő)
- korosztály (0-18, 18-40, 41-65, 65 felett)
- ügyféltalálkozások időtartama
- ügyfelek települések szerintei eloszlása
- felhasználókhoz tartozó naplóbejegyzések száma (havi lebontásban)
- felhasználók naplóbejegyzéseinek száma
- admin csoport tagjai azoknak felhasználóknak a kimutatásait is lekérdezhetik akiknek van naplóbejegyzésük, egyéb csoport tagjai csak a saját kimutatásaikat láthatják

---

#### Adatbázis felépítés

| Táblanév | clients            |
|----------|--------------------|
| Mezők    | id(int)            |
|          | accessgroup(int)   |
|          | name(vc100)        |
|          | birth_date(date)   |
|          | phone(vc15)        |
|          | email(vc100)       |
|          | gender(vc6)        |
|          | client_id(vc9)     |
|          | city_id(int)       |
|          | street(vc100)      |
|          | house_number(vc5)  |
|          | floor(vc3)         |
|          | door(vc4)          |

| Táblanév | log                |
|----------|--------------------|
| Mezők    | id(int)            |
|          | user_id(int)       |
|          | client_id(int)     |
|          | date_time(datetime)|
|          | duration(vc3)      |
|          | description(text)  |

| Táblanév | users              |
|----------|--------------------|
| Mezők    | id(int)            |
|          | username(vc20)     |
|          | password(vc60)     |
|          | name(vc100)        |
|          | accessgroup(int)   |
|          | inactive(tinyint1) |

| Táblanév | company            |
|----------|--------------------|
| Mezők    | id(int)            |
|          | name(vc100)        |
|          | shortname(vc20)    |
|          | address(vc100)     |

| Táblanév | accessgroup        |
|----------|--------------------|
| Mezők    | id(int)            |
|          | group_name(vc100)  |
|          | description(text)  |

| Táblanév | cities             |
|----------|--------------------|
| Mezők    | id(int)            |
|          | zip(vc4)           |
|          | city(vc100)        |



#### Források/erőforrások

- Adatbázis: MySQL
- Szerver: Node.js 
- Kliens: React
---
- https://react.dev/
- https://www.npmjs.com/package/mysql
- https://react-bootstrap.netlify.app/
- https://www.npmjs.com/package
- react-bootstrap-pagination-control
- https://www.npmjs.com/package/validator
- https://www.npmjs.com/package/bcrypt
- https://www.npmjs.com/package/bcryptjs-react
- https://www.npmjs.com/package/react-markdown
- https://www.npmjs.com/package/remark-gfm
- https://www.chartjs.org/docs/latest/
- https://letsencrypt.org/getting-started/
- https://certbot.eff.org/
- https://www.arubacloud.com/
- https://www.forpsi.hu/domain/

