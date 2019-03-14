---
sidebar: auto
---

# Fejlesztői útmutató

::: warning Előzetes betekintés :construction:
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
Igen, az első kör a `setup()`-ban, a második pedig a `loop()`-ban fut le.
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
Ebben az esetben a kód így változik:

 ```c
#include "logb.h"
#include "Sodaq_SHT2x.h"
#include "BH1750.h"
Settings set;
BH1750 lightMeter;
```

:::

### Első kör

#### Beállítások megadása

Itt lehet meghatározni a LogB beállításait:

- Eszköz
  - Nevét
  - Jelszavát 
- Mentés helyét 
  - a -> Serial
  - b -> SD
  - c -> LogB Cloud
  - ...
- A fájlban történő elválasztójelet
- Lehetőség van a tizedespont vesszőre történő cseréjére

::: warning Fontos
Az elválasztás jele (`set.seperate`) alapértelmezetten `;`. Ha nem szeretnénk megváltoztatni, akkor a `setup()`-ban nem kell beállítani. 
A `set.toComma` alapértelmezett `false`, így ha magyar Excel miatt szükséges a vessző ezt `true`-ra kell állítani.
:::

A beállításokon kívül itt kell elindítani a szenzorokat és a kommunikációkat:
- Serial kommukáció setén -> `Serial.begin()`
- I2C kommonikáció esetén -> `Wire.begin()`
- `LogB Cloud` és `UnixTime()` esetén -> `WiFi.begin()`
- Ezeken kívül pedig a kiválasztott szenzorok elindítasa szükséges

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
set.seperate="/";
set.toComma=true;
...
```
::: tip Serial kommunikáció
A soros kommunikáció baud rátája 115200-re van állítva alapból, de igény esetén , megváltoztatható.
:::

#### <span class="icon" style="color: orange">warning</span> Fejlécek beállítása

1. Lépésben létre kell hozni a mérés nevét a `CreateName()` segítségével.
  
- A mérés neve az eszköz nevéből és egy számból áll. Az azonosító számhoz javasoljuk az `UnixTime()` használatát.
  - A `UnixTime()` paramétere a GMT-től való eltérés. (Magyarország esetében télen 1, nyáron 2)

::: warning Fontos
A `UnixTime()` használatához internet szükséges, ez jelenleg `ESP8266` wifi modul használatával lehetséges.
:::

1. `AddNewSensorData()` függvény segítségével megadjuk a fejléc nevét.

- Első paraméter a standard név
  - Második paraméter a fejléc neve

1. A `Send()` függvény segítségével kiküldjük a fejlécet az előre meghatározott kimenetre.

```c
CreateName(UnixTime(1)); // GMT+1
AddNewHeaderParam("SHT21-I2C-3V3-TEMP-C", "Hőmérséklet");
AddNewHeaderParam("SHT21-I2C-3V3-HUM-%", "Páratartalom");
AddNewHeaderParam("BH1750-I2C-3V3-LIGHT-lx", "Fénymennyiség");
Send();
```

### Második kör

Ez a kör fut le újra és újra.
Itt történik a szenzorok értékeinek kiolvasása és az adatsorok kiírása.

::: tip A mérési időköz
Valószínű, hogy határozott időközönként szeretnén új mérést végezni.
Ehhez ajánljuk az alábbi metódust:

```c
set.currentMillis = millis();

if (set.currentMillis - set.previousMillis >= 42000){ //42 másodperc
set.previousMillis = set.currentMillis;
/* A szenzorok értékeinek kiolvasása itt történik */
}
```

Ezzel meghatározhatjuk a mérések közötti minimum időtartamot.
Ha a megadott miliszekundumnyi időtartamnál tovább tart a mérés, azonal elkezdi a következőt.\
Ha még nem érte el, várakozik amíg eléri.

:::

1. Be kell állítanunk az időt a `Time()` segítségével.
    - A függvény paramétere Unix idő. Ehhez a már fentebb említett `UnixTime()` függvényt is használhatjuk.
2. Az `AddNewSensorData()` függvény segítségével tároljuk a kiolvasott szenzor értékeket.
    - Első paraméternek a szensor standard nevét kell használni.
    - Második paraméter pedig a szenzor kiolvasott értéke `String`-be konvertálva.
    ::: tip Mentett szenzor érték változtatása
    Mentés előtt lehetőség van a kiolvasott érték megváltoztatására.
    :::

3. Ha az összes szenzor értéket mentettük történhet az adatok elküldése a `Send()` segítségével.

```c
Time(UnixTime(1));
AddNewSensorData("SHT21-I2C-3V3-TEMP-C", String(SHT2x.GetTemperature()));
AddNewSensorData("SHT21-I2C-3V3-HUM-%", String(SHT2x.GetHumidity()));
AddNewSensorData("BH1750-I2C-3V3-LIGHT-lx", String(lightMeter.readLightLevel()));
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

A szenzor összes (mérésnél illetve a hardver beépítésénél) fontos tulajdonságát meghatározzuk:

- Név
- Feszültség
- Kapcsolódás
  - Típusa
  - címe (opcionális, i2c esetében)
- Mérés (= beérkező adat)
  - Mértékegysége
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

Ennek a szenzornak a standard-beli neve: `SHT21-3V3-I2C-TEMP`

::: tip Több érték egy egységből
Több érték is kiolvasható egy egységből körönként. Minden kiolvasott adat más más szabványnévvel szerepel a LogB-ben:\
`SHT21-3V3-I2C-TEMP`\
`SHT21-3V3-I2C-HUM`
:::

::: warning Azonos adat, azonos körben töbször:
Ha szükség van rá lehetséges ugyan azt a szenzornak ugyan azt a mért adatát kikérni egy körben, de az azonosítójának egyedinek kell lennie, különben felülírja az előző mért adatot! \
(Egy körben nem kéne kikérni ugyan azt az adatot, hiszen a mérés pillanatszerű.)
:::

## ESP8266-os alaplapok használata

1. Az további Alaplap-kezelő URL megadása.
    - Arduino program megnyitás
    - Fájl
    - Beállítások `CTRL + ,`
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
