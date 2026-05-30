const fs = require("fs");
const path = require("path");
const diccionarioPokemon = {

    // ===== PARADOJAS =====

    "colmilargo":"great-tusk",
    "colacrito":"scream-tail",
    "furioseta":"brute-bonnet",
    "melena aleteo":"flutter-mane",
    "melenaleteo":"flutter-mane",
    "reptalada":"slither-wing",
    "pelarena":"sandy-shocks",
    "bramaluna":"roaring-moon",
    "ondulagua":"walking-wake",
    "flamariete":"gouging-fire",
    "electrofuria":"raging-bolt",

    "ferrodada":"iron-treads",
    "ferrosaco":"iron-bundle",
    "ferropalmas":"iron-hands",
    "ferrocuello":"iron-jugulis",
    "ferropolilla":"iron-moth",
    "ferropuas":"iron-thorns",
    "ferropaladin":"iron-valiant",
    "ferroverdor":"iron-leaves",
    "ferromole":"iron-boulder",
    "ferrotesta":"iron-crown",

    // ===== FORMAS IMPORTANTES =====

    "giratina":"giratina-altered",
    "shaymin":"shaymin-land",
    "tornadus":"tornadus-incarnate",
    "thundurus":"thundurus-incarnate",
    "landorus":"landorus-incarnate",
    "enamorus":"enamorus-incarnate",

    "keldeo":"keldeo-ordinary",
    "meloetta":"meloetta-aria",

    "zygarde":"zygarde-50",
    "wishiwashi":"wishiwashi-solo",

    "minior":"minior-red-meteor",

    "mimikyu":"mimikyu-disguised",

    "eiscue":"eiscue-ice-face",

    "morpeko":"morpeko-full-belly",

    "zacian":"zacian-hero",
    "zamazenta":"zamazenta-hero",

    "eternatus":"eternatus",

    "urshifu":"urshifu-single-strike",

    "calyrex":"calyrex",

    // ===== NECROZMA =====

    "necrozma":"necrozma",
    "ultranecrozma":"necrozma-ultra",

    // ===== PALAFIN =====

    "palafin":"palafin-zero",

    // ===== MAUSHOLD =====

    "maushold":"maushold-family-of-four",

    // ===== DUDUNSPARCE =====

    "dudunsparce":"dudunsparce-two-segment",

    // ===== TATSUGIRI =====

    "tatsugiri":"tatsugiri-curly",

    // ===== GENDER =====

    "jellicent":"jellicent-male",
    "frillish":"frillish-male",

    "indeedee":"indeedee-male",
    "basculegion":"basculegion-male",
    "oinkologne":"oinkologne-male",
    "pyroar":"pyroar-male",
    "meowstic":"meowstic-male",

    // ===== NIDORAN =====

    "nidoran":"nidoran-m",

    // ===== MR MIME =====

    "mr mime":"mr-mime",
    "mr. mime":"mr-mime",

    // ===== TAPUS =====

    "tapu koko":"tapu-koko",
    "tapu lele":"tapu-lele",
    "tapu bulu":"tapu-bulu",
    "tapu fini":"tapu-fini",

    // ===== RUIN =====

    "ting lu":"ting-lu",
    "chien pao":"chien-pao",
    "wo chien":"wo-chien",
    "chi yu":"chi-yu",

    // ===== ORICORIO =====

    "oricorio":"oricorio-baile",

    // ===== LYCANROC =====

    "lycanroc":"lycanroc-midday",

    // ===== TOXTRICITY =====

    "toxtricity":"toxtricity-amped",

    // ===== AEGISLASH =====

    "aegislash":"aegislash-shield",

    // ===== BASCULIN =====

    "basculin":"basculin-red-striped",

    // ===== DARMANITAN =====

    "darmanitan":"darmanitan-standard",

    // ===== DEOXYS =====

    "deoxys":"deoxys-normal",

    // ===== BURMY =====

    "burmy":"burmy-plant",
    "wormadam":"wormadam-plant",

    // ===== GENESECT =====

    "genesect":"genesect",

    // ===== PUMPKABOO =====

    "pumpkaboo":"pumpkaboo-average",
    "gourgeist":"gourgeist-average",

    // ===== SILVALLY =====

    "silvally":"silvally-normal",

    // ===== ARCEUS =====

    "arceus":"arceus-normal",

    // ===== CASTFORM =====

    "castform":"castform-normal",

    // ===== ROTOM =====

    "rotom":"rotom",

    // ===== VIVILLON =====

    "vivillon":"vivillon-icy-snow",

    // ===== XERNEAS =====

    "xerneas":"xerneas-neutral",

};

async function crearForms(){

    const pokemons = [];

    const carpetaSprites =
    path.join(
      __dirname,
      "www/assets/pokemones"
    );

    const responseForms =
    await fetch(
      "https://pokeapi.co/api/v2/pokemon-form?limit=10000"
    );

    const dataForms =
    await responseForms.json();

    for(const form of dataForms.results){

        try{

            if(
              !form.name.includes("-")
            ){

                continue;

            }

            const response =
            await fetch(form.url);

            if(!response.ok){

                continue;

            }

            const data =
            await response.json();

            const pokemonResponse =
            await fetch(
              data.pokemon.url
            );

            const pokemonData =
            await pokemonResponse.json();

            const spriteUrl =
            pokemonData.sprites.front_default;

            if(!spriteUrl){

                continue;

            }

            const spriteResponse =
            await fetch(spriteUrl);

            const arrayBuffer =
            await spriteResponse.arrayBuffer();

            const buffer =
            Buffer.from(arrayBuffer);

            const nombreArchivo =
            `${data.name}.png`;

            const rutaArchivo =
            path.join(
              carpetaSprites,
              nombreArchivo
            );

            fs.writeFileSync(
              rutaArchivo,
              buffer
            );

            pokemons.push({

                id:pokemonData.id,

                name: Object.keys(diccionarioPokemon).find(key =>diccionarioPokemon[key]=== data.name)||data.name,
                
                types:pokemonData.types.map(
                  t => t.type.name
                ),

                sprite:
                `./assets/pokemones/${nombreArchivo}`

            });

            console.log(
              `Descargado: ${data.name}`
            );

        }catch(error){

            console.log(
              `Error con ${form.name}`
            );

        }

    }

    fs.writeFileSync(

        path.join(
          __dirname,
          "www/estructura/data/forms.json"
        ),

        JSON.stringify(
          pokemons,
          null,
          2
        )

    );

    console.log(
      "FORMS COMPLETADAS"
    );

}

crearForms();