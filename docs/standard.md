# A LogB standard felépítése

Jelenleg egy standardon dolgozunk, amivel meg lehet pontosan határozni a mérőeszközök felépítését.

## Bemenetek/szenzorok

### Mi lehet bemenet?

Szinte bármi.\
Egy LogB kompatibilis bemenetnek szolgáltatnia kell minimum egy, az Arduino kódban meghívható függvényt, aminek visszatérő értéke String-ben tárolható

### Szenzorok könyvtárai

Arduino-s szenzorok könyvtárai egymáshoz hasonló adatformában adják ki most is az adatokat, nekünk viszont pontosan meg kell határozni, hogy milyen adat érkezhet a LogB-be, a modularitás megőrzése érdekében.

### Pontos szenzor-definíciók

A szenzor összes (mérésnél illetve a hardver beépítésénél) fontos tulajdonságát meghatározzuk:

- Név
- Feszültség
- Kapcsolódás
  - Típusa
  - címe (opcionális)
- Mérés
  - Mértékegység (opcionális)
  - Változó típusa

Egy példa:

```json
{
    "name": "SHT21",
    "voltage": "3v3",
    "connection": {
        "type": "I2C",
        "address": "0x40"
    },
    "meas": {
        "temp": {
            "unit": "C",
            "type": "float"
        },
        "hum":{
            "unit": "RH%",
            "type": "float"
        }
    }
}
```

::: warning Fontos
A mértékegységeket a szenzor könyvtára határozza meg. A nyers adatok módosítása máshol történik.
:::

::: tip Több azonos szenzor
Több azonos I2C című egységnél I2C multiplexer-re van szükség.
:::

A példánál maradva azt a szenzort, amely:

- Modellje SHT21
- 3.3 volton működik
- I2C-n csatlakozik
- Mérés
  - Mértékegység
  - Változó típusa