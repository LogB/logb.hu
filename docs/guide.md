# Fejlesztői útmutató

::: warning Előzetes betekintés
A fejlesztői útmutató, illetve maga a LogB is fejlesztés alatt áll, kísérleti fázisban van. A rendszer jelenleg nem használható kritikus feladatok ellátására.
:::

## A LogB Arduinos keretrendszere

Jelenleg egy standardon dolgozunk, amivel meg lehet pontosan határozni a mérőeszközök felépítését.

### A Mérés folyamata, azaz a 'Körök'

#### <span class="icon" style="color: orange">warning</span> Beállítások megadása

Itt lehet meghatározni az:

- Időközt
- ...HAMAROSAN

#### <span class="icon" style="color: orange">warning</span> Fejlécek beállítása

- ...HAMAROSAN

## LogB standard

### Bemenetek/szenzorok

#### Mi lehet bemenet?

Szinte bármi.\
Egy LogB kompatibilis bemenetnek szolgáltatnia kell minimum egy, az Arduino kódban meghívható függvényt, aminek visszatérő értéke `String`-ben tárolható.

#### Szenzorok könyvtárai

Arduino-s szenzorok könyvtárai egymáshoz hasonló adatformában adják ki most is az adatokat, nekünk viszont pontosan meg kell határozni, hogy milyen adat érkezhet a LogB-be, a modularitás megőrzése érdekében.

#### Pontos szenzor-definíciók

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

#### Bemenet nevek

Példa bemenet:

- Modell: SHT21
- 3.3 volton működik
- Csatlakozási módja
  - I2C
  - 0x40
- Mért adata
  - C
  - int

Ennek a szenzornak a standard-beli neve: `SHT21-3V3-I2C-0X40-TEMP`

::: tip Több érték egy egységből
Több érték is kiolvasható egy egységből körönként. Minden kiolvasott adat más más szabványnévvel szerepel a LogB-ben:\
`SHT21-3V3-I2C-0X40-TEMP`\
`SHT21-3V3-I2C-0X40-HUM`
:::

::: warning Azonos adat, azonos körben töbször:
Egy körben nem kellene többször kikérni ugyan azt az adatot, bár elméletben lehetséges.
:::