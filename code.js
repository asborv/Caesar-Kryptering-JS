// category HTML-element

const tekstInn = document.getElementById("tekstInn");
const tekstUt = document.getElementById("tekstUt");
const krypteringKnapp = document.getElementById("krypteringKnapp");
const dekrypteringKnapp = document.getElementById("dekrypteringKnapp");
const bruteforceKnapp = document.getElementById("bruteforceKnapp");

// category variablar

const alfabetStr = "abcdefghijklmnopqrstuvwxyzæøåABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ!#¤%&/()=?`^¨*'-.,_:;@£$€{[]}´\\\"0123456789\n\t";
const alfabetArr = alfabetStr.split("");



// category funksjonar

function krypter(innMelding, nokkel) { // TODO endre navn på meldingsnavn
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
    
    
    // Plasshaldarar
    let utMelding = "";
    const indexArr = [];
    // Lagar arrayar av streng
    const innMeldingArr = innMelding.split("");
    
    // Set nokkel til minste verdi i restklassen til krypteringsnykkelen (restoperator)
    // Legg til lengda dersom nokkel < 0: t.d. -1 vert 101 (alfabetStr er 102 lang)
    nokkel = (nokkel % alfabetArr.length) + (nokkel < 0 ? alfabetArr.length : 0);
    
    // Itererer melding
    innMeldingArr.forEach(tegn => {
        const alfabetIndex = alfabetStr.indexOf(tegn);
        if (alfabetIndex  == -1) {
            // Dersom teiknet ikkje er i alfabetet
            throw new Error(`${tegn} finst ikkje i alfabetet.`);
        } else {
            // Legg til index i array med oversikt
            indexArr.push(alfabetIndex);
        }
    });
    
    // Alfabetforskyving, roterer alfabetArr nokkel gonger
    for (let i = 0; i < nokkel; i++) {
        alfabetArr.push(alfabetArr[0]);
        alfabetArr.shift();
    }

    // Bygg opp kryptert melding med index frå original alfabetArr i rotert alfabetArr
    indexArr.forEach(i => {
        utMelding += alfabetArr[i];
    });

    return utMelding;
}



// category event listeners

krypteringKnapp.addEventListener("click", krypter);



// category debugging