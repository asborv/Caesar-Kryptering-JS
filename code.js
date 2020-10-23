// todo sjekk at finnIndex og byggUtMelding fungerer med ulike typer argumenter
// todo takle funksjonar for tomme inputs, må gjerast for individuelle?
// todo kopier til utklippstavla
// todo direkte indeksering av str fungerer, sjekk kva alfabetArr som kan byttast ut med alfabetStr. Unngå forvirring med alfabet/alfabetStr
// todo legg til smart dekryptering

// category HTML-element

const tekstInn = document.getElementById("tekstInn");
const tekstUt = document.getElementById("tekstUt");
const krypteringKnapp = document.getElementById("krypteringKnapp");
const dekrypteringKnapp = document.getElementById("dekrypteringKnapp");
const bruteforceKnapp = document.getElementById("bruteforceKnapp");
const krypteringsNokkelInput = document.getElementById("krypteringsNokkel");
const bruteforceListe = document.getElementById("bruteforceListe");

// category variablar

const alfabetStr = "abcdefghijklmnopqrstuvwxyzæøåABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ!#¤%&/()=?`^¨*'-.,_:;@£$€{[]}´<>+\\\"0123456789\n\t ";



// category funksjonar

function finnIndex(innMelding) {
    /**
    * docstring
    * -> Tek inn ein streng (eller array som vert konvertert til streng).
    * -> Returnerer ein array med indeksen til dei ulike teikna i alfabet.
    * -> Dersom indeksen ikkje fint, stoppar programmet og ein skildrande feil vert skriven til konsollen.
    
    * -> Args:
    * -> 	innMelding (str): Streng som skal "mappast" til alfabet.
    * ->                      Kan òg vere array, vert då konvertert til streng, og vert køyrd med konvertert verdi.
    
    * -> Base variables:
    * -> 	indexArr (Array): Inneheld indeksar til elementa i innMelding i alfabet, i rekkjefølgje
    
    * -> Returns:
    * -> 	indexArr
    */
    

    // Plasshaldar
    const indexArr = [];

    // Splittar str til array og køyrer igjen dersom nødvendig
    if (typeof(innMelding) === "string") {
        return finnIndex(innMelding.split(""));
    }

    // Itererer melding
    innMelding.forEach(tegn => {
        const alfabetIndex = alfabetStr.indexOf(tegn);
        if (alfabetIndex  == -1) {
            // Dersom teiknet ikkje er i alfabetet
            // todo gjer noko som viser brukaren dette
            //link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw#Description
            throw new Error(`${tegn} finst ikkje i alfabetet.`);
        } else {
            // Legg til index i array med oversikt
            indexArr.push(alfabetIndex);
        }
    });

    return indexArr;
}

function byggUtMelding(indexArr, rotertAlfabet) {
    /**
    * docstring
    * -> Tek inn ein array med indeksar til eit ord i alfabet, og eit rotert alfabet.
    * -> Finn deretter teikna til kvar indeks i rotertAlfabet, legg dette til utMelding.
    
    * -> Args:
    * -> 	indexArr (Array): "Map" over indeksar til ein bestemt streng i alfabet.
    * ->    rotertAlfabet (Array): Alfabet i rekkjefølgje, men rotert eit gjeve tal plassar.
    
    * -> Base variables:
    * -> 	utMelding (str): Teikn i streng etter alfabetrotasjon.
    * ->                     Melding som skal returnerast, anten av kryptering eller dekryptering.
    
    * -> Returns:
    * -> 	utMelding
    */
    
    // Plasshaldar
    let utMelding = "";

    // Køyrer funksjonen med rotertAlfabet som Array om nødvendig
    // ! test denne
    if (typeof(rotertAlfabet) === "string") {
        return byggUtMelding(indexArr, rotertAlfabet.split(""));
    }

    // Finn teikn av kvar indeks i indexArray, byggjer opp utMelding
    indexArr.forEach(i => {
        utMelding += rotertAlfabet[i];
    });

    return utMelding;
}

function krypter(e) {
    /**
    * docstring
    * -> Tek inn ein melding, og utfører ein Caesar-kryptering.
    * -> Finn indeksen til alle teikn i alfabetetet over.
    * -> Roterer deretter alfabetet, slik at denne indeksen i det roterte alfabetet tilsvarar ein bokstavforskyving definert av brukar.
    
    * -> Args:
    * -> 	innMelding (str): Melding å kryptere eller dekryptere
    * ->    nokkel (number): Krypteringsnykkelen som gjev kor langt ein skal rotere alfabetet
    
    * -> Base variables:
    * -> 	utMelding (str): Kryptert eller dekryptert medling
    * ->    indexArr (Array): Alle indeksar til teikna i innMelding i alfabetStr
    * ->    innMeldingArr (Array): innMelding splitta for alle teikn

    * -> Returns:
    * -> 	utMelding
    */

    // Lagar array av streng, må settast tilbake grunna alfabetforskyving
    const alfabetArr = alfabetStr.split("");

    // Verdiar frå HTML-element
    const innMelding = tekstInn.value;
    let nokkel = parseInt(krypteringsNokkelInput.value);

    // Set nokkel til minste verdi i restklassen til krypteringsnykkelen (restoperator)
    // Legg til lengda dersom nokkel < 0: t.d. -1 vert 101 ( dersom alfabetStr er 102 lang)
    nokkel = (nokkel % alfabetArr.length) + (nokkel < 0 ? alfabetArr.length : 0);
    if (e.target == dekrypteringKnapp) {
    nokkel = alfabetArr.length - nokkel;
    }

    const indexArr = finnIndex(innMelding)

    // Alfabetforskyving, roterer alfabetArr nokkel gonger
    for (let i = 0; i < nokkel; i++) {
        alfabetArr.push(alfabetArr[0]);
        alfabetArr.shift();
    }
    
    // Bygg opp kryptert melding med index frå original alfabetArr i rotert alfabetArr
    utMelding = byggUtMelding(indexArr, alfabetArr);
    
    // Set kryptert melding i utskriftfelt
    tekstUt.value = utMelding;
    
    return utMelding;
}

function slettAlleBarn(barnContainer) {
    // todo lag docstring
    
    // link https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    while (barnContainer.firstChild) {
        barnContainer.removeChild(barnContainer.lastChild);
    }

    return;
}

function bruteForce(e) {
    // todo lag docstring
    
    slettAlleBarn(bruteforceListe); //! Merk at denne ikkje er defienrt per no
    const indexArr = finnIndex(tekstInn.value);
    const alfabetArr = alfabetStr.split("");
    
    for (let i = 0; i < alfabetArr.length - 1; i++) {
        // Set tilbake utMelding mellom kvar iterasjon av alfabetrotasjon
        let utMelding = "";
        
        // Roterer alfabet
        alfabetArr.push(alfabetArr[0]);
        alfabetArr.shift();
        // Lagar utMelding
        indexArr.forEach(j => {
            utMelding += alfabetArr[j]; 
        });

        // Legg til i ul-liste i HTML
        // link https://www.w3schools.com/js/js_htmldom_nodes.asp
        const bruteforceListeElement = document.createElement("li");
        const bruteforceListeElementNode = document.createTextNode(utMelding);
        
        bruteforceListeElement.appendChild(bruteforceListeElementNode);
        bruteforceListe.appendChild(bruteforceListeElement);        
    }

}



// category event listeners

krypteringKnapp.addEventListener("click", krypter);
dekrypteringKnapp.addEventListener("click", krypter);
bruteforceKnapp.addEventListener("click", bruteForce);



// category debugging
