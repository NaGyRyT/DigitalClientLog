# Digital Client Diary

- Database: MySQL,
- Server: Node.js (express, cors, body-parser, bcrypt),
- Client: React (react-router-dom, react-bootstrap, bcryptjs-react)

## Belépés
- csak létező felhasználó tud belépni törölt, inaktivált nem

## Felhasználók

### Felhasználók listája
- módosítás
- törlés/inaktiválás
- megnézés

### Felhasználó felvétele
- két azonos felhasználó név nem engedélyezett
- a felhasználó név minimum 4 maximum 20 karakter lehet
- a név mező nem lehet üres, maximum 100 karakter lehet
- a jelszó minimum 8 karakter lehet 
- csoportot választani kötelező a legördülő listából

### Felhasználó módosítása
- felhasználónév nem módosítható
- ha jelszó mező üres marad, akkor nem változik az eredeti jelszó
- admin felhasználó csoportját nem lehet módosítani 

### Felhasználó törlése
- ha nincs naplóbejegyzése a felhasználónak akkor törölhető egyébként csak inaktiválható
- admin felhasználót nem lehet törölni


## Ügyfelek
- két azonos azonosítójú űgyfél nem lehet

#### Források
https://react.dev/
https://react-bootstrap.netlify.app/
https://www.npmjs.com/package/react-bootstrap-pagination-control
https://www.npmjs.com/package/validator