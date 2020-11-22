// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: flag;
/* -----------------------------------------------
Most of the functions used in this script belong to
"ig-lastest-post" so all the credit goes to @supermamon
also thanks to @supermamon, his work was my inspiration
for making this script
----------------------------------------------  
Script      : randomFlag.js
Author      : t4rtufo
Version     : 1.2
Used APIs   : flagpedia.net

Description :
  -This widget displays a random Flag
  -It can show given flags as input
   in the ISO 3166 (alpha 2) format
   example: pe,de,gr,is
	in case of usa states the codes
	go like this:
		us-wv,us
   https://www.iban.com/country-codes
  
Limitations:
      -Some flags don't fit
      correctly inside the frame
      -Some urls are invalid
      due to some chars in their
      names and languages
      (Czech, Pashto, Slovak)
Changelog:
    V1.1 Now it's possible to 
         show flags given as input

    V1.2 Now the widget redirects
        to flagpedia when tapping
        for showing information
        about the flag
----------------------------------------------- */

language = "en"
// Language code to show countries' names

// Available languages 
// Czech   "cs"
// German  "de"
// Spanish "es"
// French  "fr"
// Italian "it"
// Pashto  "pl"
// Slovak  "sk"
// English "en"


// Get list of countries
const reqNames = new Request(`https://flagcdn.com/${language}/codes.json`)
const names    = await reqNames.loadJSON()


// Array to store the requested flags 
CODES = []

// get flags from the arguments if passed
let codes = args.widgetParameter || CODES.join(',')
codes = codes.split(',')


// randomly chooses a code
let code   = ""
let nombre = ""

if(!args.widgetParameter){
  // If there's not input, a random index is
  // chosen among the requested ones
  // and matches the code with its name
  let indice = 0
  nRandom    = Math.floor(Math.random()* 307)

  for (let i in names){
    if(nRandom == indice){
      code   = i
      nombre = names[i]
      break
    }else{
      indice += 1
      continue
    }
  }
} else{
  // If there's input, a random code is
  // chosen among the array if codes
  code   =  getRandom(codes)
  code   in names
  nombre =  names[code]
}

console.log('Code: ' + code)
console.log('Name: ' + nombre)

// This url will redirect to flagpedia
// and show information about the shown flag
let url

//The name needs to be in the correct format
//in order to take part of the url
let nameUrl = slugify(nombre.toLocaleLowerCase())

console.log('Formated name: ' + nameUrl)

//Assemble the url depending on the language
//and the name of the flag
switch(language){
// Czech
  case "cs":
    if (code.includes('us-')) {
      url = `https://www.statnivlajky.cz/usa-staty/${nameUrl}`
    } else if (code=="un") {
        url = "https://www.statnivlajky.cz/organizace/osn"
      }
      else if (code=="eu") {
        url = "https://www.statnivlajky.cz/organizace/eu"
      }
      else{
        url = `https://www.statnivlajky.cz/${nameUrl}`
      }
  break
  
// German
  case "de":
    if (code.includes('us-')) {
      url = `https://www.welt-flaggen.de/us-staaten/${nameUrl}`
    } else if (code=="un") {
        url = "https://www.welt-flaggen.de/organisation/vn"
      }
      else if (code=="eu") {
        url = "https://www.welt-flaggen.de/organisation/eu"
      }
      else{
        url = `https://www.welt-flaggen.de/${nameUrl}`
      }
  break
  
// Spanish
  case "es":
    if (code.includes('us-')) {
      url = `https://www.banderas-mundo.es/usa-estados/${nameUrl}`
    } else if (code=="un") {
        url = "https://www.banderas-mundo.es/organizacion/onu"
      }
      else if (code=="eu") {
        url = "https://www.banderas-mundo.es/organizacion/eu"
      }
      else{
        url = `https://www.banderas-mundo.es/${nameUrl}`
      }
  break
  
// French
   case "fr":
    if (code.includes('us-')) {
      url = `https://www.drapeauxdespays.fr/usa-etats/${nameUrl}`
    } else if (code=="un") {
        url = "https://www.drapeauxdespays.fr/organisation/onu"
      }
      else if (code=="eu") {
        url = "https://www.drapeauxdespays.fr/organisation/eu"
      }
      else{
        url = `https://www.drapeauxdespays.fr/${nameUrl}`
      }
  break

// Italian
  case "it":
    if (code.includes('us-')) {
      url = `https://www.bandiere-mondo.it/usa-stati/${nameUrl}`
    } else if (code=="un") {
        url = "https://www.bandiere-mondo.it/organizzazione/onu"
      }
      else if (code=="eu") {
        url = "https://www.bandiere-mondo.it/organizzazione/unione-europea"
      }
      else{
        url = `https://www.bandiere-mondo.it/${nameUrl}`
      }
  break

// Pashto
  case "pl":
    if (code.includes('us-')) {
      url = `https://www.flagi-panstw.pl/usa-stany/${nameUrl}`
    } else if (code=="un") {
        url = "https://www.flagi-panstw.pl/organizacja/onz"
      }
      else if (code=="eu") {
        url = "https://www.flagi-panstw.pl/organizacja/eu"
      }
      else{
        url = `https://www.flagi-panstw.pl/${nameUrl}`
      }
  break

// Slovak
  case "sk":
    if (code.includes('us-')) {
      url = `https://www.statnevlajky.sk/usa-staty/${nameUrl}`
    } else if (code=="un") {
        url = "https://www.statnevlajky.sk/organizace/osn"
      }
      else if (code=="eu") {
        url = "https://www.statnevlajky.sk/organizace/eu"
      }
      else{
        url = `https://www.statnevlajky.sk/${nameUrl}`
      }
  break

// English
  case "en":
    if (code.includes('us-')) {
      url = `https://flagpedia.net/us-states/${nameUrl}`
    } else if (code=="un") {
        url = "https://flagpedia.net/organization/un"
      }
      else if (code=="eu") {
        url = "https://flagpedia.net/organization/eu"
      }
      else{
        url = `https://flagpedia.net/${nameUrl}`
      }
  break

}

console.log('Url: ' + url)

// Get the flag
const reqFlag = new Request(`https://flagcdn.com/h240/${code}.png`)
const flag    = await reqFlag.loadImage()


// Start the process
if (config.runsInWidget) {
  let widget = flag.has_error ? 
  await createErrorWidget(flag) :
  await createWidget(flag)
  Script.setWidget(widget)
} else {

  const options = ['Small', 'Medium', 'Large', 'Cancel']
  let resp = await presentAlert('Preview Widget', options)
  if (resp==options.length-1) return
  let size = options[resp]
  let widget = flag.has_error ? 
  await createErrorWidget(post) :
  await createWidget(flag, size.toLowerCase())
  
  await widget[`present${size}`]()
}

Script.complete() 


//-------------------------------------
async function presentAlert(prompt,items,asSheet) 
{
  let alert = new Alert()
  alert.message = prompt
  
  for (const item of items) {
    alert.addAction(item)
  }
  let resp = asSheet ? 
    await alert.presentSheet() : 
    await alert.presentAlert()
  return resp
}
//---------------------------------
async function createWidget(data, widgetFamily) {
  
  widgetFamily = widgetFamily || config.widgetFamily
  const padd = widgetFamily=='large' ? 12 : 10
  const fontSize = widgetFamily=='large' ? 14 : 10

  const img = flag
  
  const widget = new ListWidget()

  widget.setPadding(padd,padd,padd,padd)
  widget.backgroundImage = img

  if (true) {

    // add gradient with a semi-transparent 
    // dark section at the bottom. this helps
    // with the readability of the status line
    widget.backgroundGradient = newLinearGradient(
      ['#ffffff00','#ffffff00','#00000088'],
      [0,.75,1])

    // top spacer to push the bottom stack down
    widget.addSpacer()

    // horizontal stack to hold the status line
    const stats = widget.addStack()
    stats.layoutHorizontally()
    stats.centerAlignContent()
    stats.spacing = 3


       const text = addText(stats,nombre,'left',fontSize)

  }
  widget.url=url
  
  return widget
  
}
//---------------------------------
function newLinearGradient(hexcolors, locations) {
  let gradient = new LinearGradient()
  gradient.locations = locations
  gradient.colors = hexcolors
                     .map(color=>new Color(color))
  return gradient
}
//---------------------------------
function addText(container, text, align, size) {
  const txt = container.addText(text)
  txt[`${align}AlignText`]()
  txt.font = Font.systemFont(size)
  txt.shadowRadius = 3
  txt.textColor = Color.white()
  txt.shadowColor = Color.black()   
}
//---------------------------------
function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}
// -------------------------------
// Thanks to @Mercelo-ribeiro
function slugify (str) {
    var map = {
        '-' : "'| ",
        'a' : 'á|à|ã|â|ä|å|ą',
        'e' : 'é|è|ê|ě|ë|ę',
        'i' : 'í|ì|î|ï|į',
        'o' : 'ó|ò|ô|õ|ö',
        'u' : 'ú|ù|û|ü|ů',
			 'y' : 'ý|ÿ',
        'c' : 'ç|č',
			 'l' : 'ł',
			 'r' : 'ř',
			 'z' : 'ž|ż|ź',
			"ss" : 'ß',
			 's' : 'š|ś',
        'n' : 'ñ|ń'
    }
    
    for (var pattern in map) {
        str = str.replace(new RegExp(map[pattern], 'g'), pattern)
    }

    return str
}
