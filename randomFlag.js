// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: flag;
/* -----------------------------------------------
All the functions used in this widget were taken from "ig-lastest-post" 
so all the credit goes to @supermamon also thanks
to @supermamon, his work was my inspiration for making this script
----------------------------------------------  
Script      : randomFlag.js
Author      : t4rtufo
Version     : 1.0
Used APIs   : flagpedia.net
				 restcountries.eu

Description :
  Displays a random Flag

Limitations:
			  Some flags dont fit correctly inside the frame
 
----------------------------------------------- */
//Language code to show contries' names
language = "en"
// Get list of countries
const reqNames = new Request(`https://flagcdn.com/${language}/codes.json`)
const  names= await reqNames.loadJSON()

// randomly chooses a code
var code = ""
var indice =0
nRandom=Math.floor(Math.random() * 307)

 for (let i in names){
	if(nRandom==indice){
		code=i
		break
	}else{
		indice +=1
		continue
	}
 }
console.log(code)

// match the code with its name
// if there no name related just an
// empty String is shown

const reqName = new Request(`https://restcountries.eu/rest/v2/alpha/${code}`)
const resName = await reqName.loadJSON()
var nombre=""
if(resName.name!=undefined){
	nombre=resName.name
}

// get the flag
const reqFlag = new Request(`https://flagcdn.com/w1280/${code}.png`)
const  flag = await reqFlag.loadImage()


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


//---------------------------------
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


       const eUsr = addText(stats,nombre,'left',fontSize)

  }

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
