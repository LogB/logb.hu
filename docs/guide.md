---
sidebar: auto
---

# Fejlesztői útmutató

::: warning Előzetes betekintés
A fejlesztői útmutató, illetve maga a LogB is fejlesztés alatt áll. A rendszer jelenleg nem használható kritikus feladatok ellátására. [Projektek státusza](/status.md#projektek-allapota)
:::

## A LogB Arduino-s keretrendszere <Badge text="alpha" type="error"/>

Jelenleg egy standardon dolgozunk, amivel meg lehet pontosan határozni a mérőeszközök felépítését.

### A Mérés folyamata

A LogB mérési folyamata két 'körből' áll:

- Az első egyszer fut le:
  - Beállítások
  - Fejlécek
- A második meghatározott időközönként, újra és újra lefut az első után.
  - Aktuális adatok bekérése, azok struktúrába rendezése
  - Adatsor küldése

::: tip Arduinoval megfeleltetés
Igen, az első kör a `setup()`-ban, a második pedig a `loop()`-ban fut le./
:::

### Nulladik kör

#### Függvény könyvtárak és deklarációk

A kód elején szükséges bizonyos header fájlokra hivatkozni:

1. LogB Arduino könyvtárat include-olni
2. Használni kívánt szenzor könyvtárát
    - Amennyiben szükséges definiálni kell a szenzort.
3. A `set` globális változó deklarálása

```c
#include <logb.h>
#include <Sodaq_SHT2x.h>
#include <BH1750.h>
Settings set;
BH1750 lightMeter;
```

::: warning Fontos
Amennyiben nincs az Arduino programhoz hozzáadva a szükséges könyvtár, akkor az `.ino` fájl mellé másolva is használhatjuk.
Ebben az esetben a könyvtárak neve nem `<>` között, hanem `""` kell hogy legyen:

 ```c
#include "logb.h"
#include "Sodaq_SHT2x.h"
#include "BH1750.h"
Settings set;
BH1750 lightMeter;
```

:::

### Első kör

#### LogB beállítások megadása

| Leírás                              | Kód                | Típus      | Alapértelmezett érték       |
| ----------------------------------- | ------------------ | ---------- | --------------------------- |
| Mérési időköz                       | `set.timeInterval` | `long`     | `0` (= nem vár)             |
| Kimenetek                           | `set.where`        | `String`   | `null`   (= nincs kimenet!) |
| LogB Cloud Device_ID                | `set.device_id`    | `String`   | `null`                      |
| LogB Cloud Pin                      | `set.pin`          | `String`   | `null`                      |
| CSV elválasztó karakter             | `set.separate`     | `String`   | `;`                         |
| Tizedespont vesszőre\való cseréjére | `set.toComma`      | `bool`     | `false`                     |
| Fájl név                            | `CreateName()`     | `DateTime` | `null`                      |

::: tip Az alapértelmezett értékek
Ha nem szeretnénk változtatni az alapértelmezett értékeken, nem kell a kódba írni.
:::

::: tip Tipp
Ha a kirás csak `Serial`-ra történik nem szükséges fájl nevet lértehozni.
Viszont bármelyik másikhoz **kötelező**
:::

A beállításokon kívül itt kell elindítani a szenzorokat és a kommunikációkat:

- Serial kommukáció setén -> `Serial.begin()`
- I2C kommonikáció esetén -> `Wire.begin()`
- `LogB Cloud` és `UnixTime()` esetén -> `WiFi.begin()`
- Ezeken kívül pedig a kiválasztott szenzorok elindítasa szükséges

A mérés nevét ahogy az a [táblázatban](/guide.md#logb-beallitasok-megadasa) is szerepel, a `CreateName()` függvény segítségével lehet elkészíteni.

- A mérés neve az eszköz nevéből és egy számból áll. Az azonosító számnak **egyedinek** kell lennie, ehhez javasoljuk az `UnixTime()` használatát.
  - A `UnixTime()` paramétere a GMT-től való eltérés. (Magyarország esetében télen UTC+`1`, nyáron UTC+`2`, San Fransisco például télen UTC`-8`, nyáron UTC`-7`)

::: warning Fontos
A `UnixTime()` használatához internet szükséges, ez jelenleg `ESP8266` wifi modul használatával lehetséges.
:::

Példa kód:

```c
Serial.begin(115200);
Wire.begin();
WiFi.begin("/* wifi SSID */", "/* wifi jelszava */");
while (WiFi.status() != WL_CONNECTED) {delay(50);}
lightMeter.begin();
//ezek a LogB Cloud használatához kellenek
set.device_id="/* eszköz azonosítója */";
set.pin="/* eszköz jelszava */";
set.where="ac"; //= Serial & LogB Cloud
set.timeIntervall=2000; // 2 mp
set.seperate="/";
set.toComma=true;
CreateName(UnixTime(1)); // GMT+1
...
```

::: tip Serial kommunikáció
A soros kommunikáció baud rátája 115200-re van állítva alapból, de igény esetén megváltoztatható.
:::

### Második kör

Ez a kör fut le újra és újra.
Itt történik a szenzorok értékeinek kiolvasása és az adatsorok kiírása.

::: tip A mérési időköz
Valószínű, hogy határozott időközönként szeretnén új mérést végezni.
Ehhez ajánljuk az alábbi metódust:

```c
set.currentMillis = millis();

if (set.currentMillis - set.previousMillis >= set.timeIntervall){
set.previousMillis = set.currentMillis;
/* A szenzorok értékeinek kiolvasása itt történik */
}
```

Ezzel meghatározhatjuk a mérések közötti minimum időtartamot.
Ha a megadott miliszekundumnyi időtartamnál tovább tart a mérés, azonal elkezdi a következőt.\
Ha még nem érte el, várakozik amíg eléri.

:::

1. Az `AddData()` függvény segítségével tároljuk a kiolvasott szenzor értékeket.
    - Első paraméternek a szensor standard nevét kell használni.
    - Második paraméter a használni kívánt fejléc.
    - Harmadik paraméter pedig a szenzor kiolvasott értéke `String`-be konvertálva.

    ::: tip Mentett szenzor érték változtatása
    Mentés előtt lehetőség van a kiolvasott érték megváltoztatására.
    :::

 ::: warning Fontos
 Az első `AddData()`-ban be kell állítani az időt. Ezt úgy tehetjük meg, hogy a `Time()`-nak egy `DateTime`-ot adunk.

- Ehhez a már fentebb említett `UnixTime()` függvényt is használhatjuk.
- Természetesen RTC-ből nyert idő is használható. (`rtc.now()`)
- Haa nincs időmérésre lehetőségünk a mérés indításától eltelt másodpercekért a `NoTime()` függvényt kell a `Time()`-ba írni.
:::

2. Ha az összes szenzor értéket mentettük történhet az adatok elküldése a `Send()` segítségével.

```c
AddData("NTP", "Date", Time(UnixTime()));
AddData("SHT21-Hum","Humidity", String(SHT2x.GetHumidity()));
AddData("SHT21-Temp","Temperature", String(SHT2x.GetTemperature()));
Send();
```

## LogB standard <Badge text="alpha" type="error"/>

### Bemenetek/szenzorok

#### Mi lehet bemenet?

Szinte bármi.\
Egy LogB kompatibilis bemenetnek szolgáltatnia kell minimum egy, az Arduino kódban meghívható függvényt, aminek visszatérő értéke `String`-ben tárolható.

#### Szenzorok könyvtárai

Arduino-s szenzorok könyvtárai egymáshoz hasonló adatformában adják ki most is az adatokat, nekünk viszont pontosan meg kell határozni, hogy milyen adat érkezhet a LogB-be, a modularitás megőrzése érdekében.

#### Pontos szenzor-definíciók

A fájl elérhető [itt](https://api.logb.hu/v1.1/inputs.json)

A szenzor összes (mérésnél illetve a hardver beépítésénél) fontos tulajdonságát meghatározzuk:

- Név
- Feszültség
- Kapcsolódás
  - Típusa
- Mérés (= beérkező adat)
  - Mértékegysége
  - Változó típusa

Egy részlet:

```json
{
    "SHT21": {
        "name": "SHT21",
        "voltage": "3v3",
        "connection": "I2C",
        "code": {
            "include": "Sodaq_SHT2x.h",
            "preSetup": "",
            "setup": {
                "begin": "Wire"
            },
            "values": {
                "TEMP": {
                    "unit": "C",
                    "getValue": "SHT2x.GetTemperature()"
                },
                "HUM": {
                    "unit": "RH%",
                    "getValue": "SHT2x.GetHumidity()"
                },
                "DEW": {
                    "unit": "C",
                    "getValue": "SHT2x.GetDewPoint()"
                }
            }
        }
    },
    ...
```

::: warning Fontos
A mértékegységeket a szenzor könyvtára határozza meg. A nyers adatok módosítása később történhet.
:::

::: tip Több azonos szenzor
Több azonos I2C című egységnél I2C multiplexer-re van szükség, vagy meg kell szakítani a mérés idejére a többi azonos című elemet.
:::

#### Bemenet nevek

Példa bemenet:

- Modell: SHT21
- 3.3 volton működik
- Csatlakozási módja
  - I2C
- Mért adata
  - Hőmérséklet

Ennek a szenzornak a standard-beli neve: `SHT21-TEMP`

::: tip Több érték egy egységből
Több érték is kiolvasható egy egységből körönként. Minden kiolvasott adat más más szabványnévvel szerepel a LogB-ben:\
`SHT21-TEMP` & `SHT21-HUM`
:::

::: warning Azonos adat, azonos körben töbször:
Ha szükség van rá, lehetséges ugyan azt a szenzornak ugyan azt a mért adatát kikérni egy körben, de az azonosítójának egyedinek kell lennie, különben felülírja az előzőleg mért, azonos azonosítóval rendelkező adatot! \
(Egy körben nem kéne kikérni ugyan azt, hiszen a mérés pillanatszerű.)
:::

## ESP8266-os alaplapok használata

1. Az további Alaplap-kezelő URL megadása.
    - Arduino program megnyitás
    - Fájl
    - Beállítások `CTRL` + `,`
    - További Alaplap-kezelő URL-ek: <span class="select_all">`http://arduino.esp8266.com/stable/package_esp8266com_index.json`</span>
2. Alaplap letöltése és telepítése
    - Eszközök
    - Alaplap
    - Alaplap-kezelő
    - A kereső sávba beírjuk: `ESP8266`
    - Telepítés
3. Ugyanúgy használhatjuk az alaplapot, mint bármely másik Arduino alaplapot.

::: tip Alaplap frissítése
Pár havonta ajánlott az Alaplap-kezelőben elvégezni a frissítést, így a legújabb `ESP8266`-al rendelkező mikrokontrollereket is használhatjuk.
:::
