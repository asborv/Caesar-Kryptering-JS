// todo legg til smart dekryptering
// todo føreslå pull request når ein skriv ikkje-definerte teikn

// category HTML-element

const tekstInn = document.getElementById("tekstInn");
const tekstUt = document.getElementById("tekstUt");
const krypteringKnapp = document.getElementById("krypteringKnapp");
const dekrypteringKnapp = document.getElementById("dekrypteringKnapp");
const bruteforceKnapp = document.getElementById("bruteforceKnapp");
const krypteringsNokkelInput = document.getElementById("krypteringsNokkel");
const bruteforceListe = document.getElementById("bruteforceListe");

// category variablar

const alfabetStr = "abcdefghijklmnopqrstuvwxyzæøåòèéàáïöôîABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅÒÈÉÀÁÏÖÔÎ!#¤%&/()=?`^¨*'-.,_:;@£$€{[]}´<>+\\\"0123456789\n\t ";



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
    * ->    uderfinderteTegn (bool): true dersom innMelding inneheld teikn som ikkje finst i alfabetStr, false elles.
    * ->                             Brukast til å stoppe kryptering.
    
    * -> Returns:
    * -> 	indexArr / null
    */
    
    // Plasshaldar
    const indexArr = [];

    // Splittar str til array og køyrer igjen dersom nødvendig
    if (typeof(innMelding) === "string") {
        return finnIndex(innMelding.split(""));
    }

    // Itererer melding
    // link https://stackoverflow.com/questions/2641347/short-circuit-array-foreach-like-calling-break
    const udefinerteTegn =
    innMelding.some(tegn => {
        const alfabetIndex = alfabetStr.indexOf(tegn);
        if (alfabetIndex !== -1) { indexArr.push(alfabetIndex); }

        // true dersom eit teikn ikkje finst
        return alfabetIndex  === -1;
    });

    // indexArr dersom alle teikn finst i alfabetStr
    return udefinerteTegn ? null : indexArr;
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
    nokkel = (nokkel % alfabetStr.length) + (nokkel < 0 ? alfabetStr.length : 0);
    if (e.target == dekrypteringKnapp) {
        nokkel = alfabetStr.length - nokkel;
    }

    const indexArr = finnIndex(innMelding);

    // Ingen tekst å kryptere. Viser at det gjekk gale og stopper funksjonen
    if (!indexArr) {
        visKopiert(e, false);
        return;
    }

    // Alfabetforskyving, roterer alfabetArr nokkel gonger
    for (let i = 0; i < nokkel; i++) {
        alfabetArr.push(alfabetArr[0]);
        alfabetArr.shift();
    }
    
    // Bygg opp kryptert melding med index frå original alfabetArr i rotert alfabetArr
    utMelding = byggUtMelding(indexArr, alfabetArr);
    
    // Set kryptert melding i utskriftfelt
    tekstUt.value = utMelding;
    
    kopierTilUtklippsTavle(tekstUt, tekstInn, e);

    return utMelding;
}

function slettAlleBarn(barnContainer) {
    /**
    * docstring
    * -> Slettar alle barn av eit HTML-element.
    * -> Fungerer rekursivt.
    
    * -> Args:
    * -> 	barnContainer (HTML-element): Container som skal tømmast for barn.

    * -> Returns:
    * -> 	null
    */
    
    
    // link https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    while (barnContainer.firstChild) {
        barnContainer.removeChild(barnContainer.lastChild);
    }

    return;
}

function bruteForce(e) {
    /**
    * docstring
    * -> Utører bruteforce-algoritmen for alfabetforskyving på ein tekststreng.
    * -> Viser restultata i bruteforceListe.
    
    * -> Args:
    * -> 	e (event): description
    
    * -> Base variables:
    * -> 	indexArr (Array): "Map" over indeksar for teksten i tekstInn.
    * ->    alfabetArr (Array): alfabetStr splitta for kvar bokstav.
    * ->    utMelding (str): Meldinga som skal skrivast ut for kvart forsøk.
    * ->    bruteforceListeElement (HTML-element): <li>-element som inneheld kvart av brutefoce-forsøka
    * ->    bruteforceListeElementNode (str): Tekst i bruteforceListeElement: utMelding
    
    * -> Returns:
    * -> 	null:
    */
    
    
    slettAlleBarn(bruteforceListe);
    const indexArr = finnIndex(tekstInn.value);
    // Stopper funksjonen, og viser at noko gjekk gale
    if (!indexArr) {
        visKopiert(e, false)
        return;
    }
    const alfabetArr = alfabetStr.split("");
    
    for (let i = 0; i < alfabetStr.length - 1; i++) {
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

    return;
}

function elementTilNormal(element, forTekst, forbgFarge, forsinkelse) {
    /**
    * docstring
    * -> Set innerHTML og bakgrunnsfargen til det oppgjeve elementet.
    * -> Merk at funksjonen er til for meir eller mindre hardkorda situasjonar.
    
    * -> Args:
    * -> 	element (HTML-element): Elementet som skal få stilen endra.
    * ->    forTekst (str): innerHTML som skal setjast på element.
    * ->    forFarge (str): backgroundColor som skal setjast på element.
    * ->    forsinkelse (number): Forsenkinga før endringa skal skje

    * -> Returns:
    * -> 	null
    */
    

    setTimeout(() => {
        element.innerHTML = forTekst;
        element.style.backgroundColor = forbgFarge;
    }, forsinkelse);

    return;
}

function visKopiert(e, status = true) {
    /**
    * docstring
    * -> Viser med farge og tekst om tekst har blitt kopiert til utklippstavla.
    * -> Meint til å bruke på knappane krypteringsKnapp og dekrypteringsKnapp.
    * -> (Ikkje teke hensyn til andre element).
    
    * -> Args:
    * -> 	e (event)
    * ->    status (bool): Vellukka kopiering eller ikkje.
    * ->                   Tolkast frå str, altså ikkje vellukka for "".
    
    * -> Base variables:
    * -> 	forTekst (str): e.target (knappen som vert trykt) sin tekst (innerHTML) før endring.
    * ->    forFarge (str): e.target (knappen som vert trykt) sin bakgrunnsfarge (backgroundColor) før endring.
    
    * -> Returns:
    * -> 	null
    */
    
    // Initielle verdiar for knappen
    const forTekst = e.target.innerHTML;
    const forbgFarge = e.target.style.backgroundColor;

    // Endrar knappen
    e.target.style.backgroundColor = status
        ? "RGBA(0, 255, 0, .3)"
        : "RGBA(255, 0, 0, .3)";
    
    e.target.innerHTML = status
        ? "Kopiert!"
        : "Feil!";
    
    // Reset stilen på knappen
    elementTilNormal(e.target, forTekst, forbgFarge, 1000);
}

function kopierTilUtklippsTavle(element, fokusElementEtter = null, e) {
    /**
    * docstring
    * -> Kopierer value-attributten til eit <input> - eller <textarea>-felt.
    
    * -> Args:
    * -> 	element (<input> / <textarea>): Feltet ein vil kopiere frå
    * ->    fokusElementEtter (HTML-element): Elementet som skal fokuserast på etter kopiering.
    * ->                                      Default: null
    
    * -> Returns:
    * -> 	str: Den kopierte teksten
    */
    

    // Markerer <input> - eller <textarea>-felt.
    element.select();

    // Markerer heile feltet (for alle plattformer) og kopierer
    // link https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange
    element.setSelectionRange(0, 99999);
    document.execCommand("copy");
    
    // Fjerner markeringa
    element.setSelectionRange(0, 0);

    // Setter focus på definert element
    if (fokusElementEtter) {
        fokusElementEtter.focus();
    }

    // Viser om kopieringa var vellukka
    visKopiert(e, element.value);

    return element.value;
}



// category event listeners

krypteringKnapp.addEventListener("click", krypter);
dekrypteringKnapp.addEventListener("click", krypter);
bruteforceKnapp.addEventListener("click", bruteForce);



// category debugging