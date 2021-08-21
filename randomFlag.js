// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: flag;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: flag;
/* -----------------------------------------------
Most of the functions used in this script belong to
"ig-lastest-post" so all the credit goes to @supermamon
also thanks to @supermamon, his script was my inspiration
for making this one
----------------------------------------------  
Script      : randomFlag.js
Author      : t4rtufo
Version     : 1.2.1
Used APIs   : flagpedia.net

Description :
  -This widget displays a random Flag
  -It can show given flags as input
   in the ISO 3166 (alpha 2) format
   example: pe,ar,gr,is
	in case of usa states the codes
	go like this:
		us-wv,us-nm

  https://www.iban.com/country-codes
  
Limitations:
      -Some flags do not fit
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

const language = 'es';
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

// Fetch the country codes and names from flagcdn.com
const reqCountries = new Request(`https://flagcdn.com/${language}/codes.json`);
const countries = await reqCountries.loadJSON();

// input has priority if is given
const codes = args.widgetParameter
	? args.widgetParameter.split(',')
	: Object.keys(countries);

// randomly chooses a code
const code = codes.sort(() => (Math.random() > 0.5 ? 1 : -1))[0];
const countryName = countries[code];

//The name needs to be in the correct format
//in order to take part of the url
const formatedName = slugify(countryName.toLocaleLowerCase());

// This url will redirect to flagpedia
// and show information about the flag
const url = createURL(language);

console.log(`
	code: ${code}
	name: ${countryName}
	formated: ${formatedName}
	url: ${url}
`);

// Get the flag
const reqFlag = new Request(`https://flagcdn.com/h240/${code}.png`);
const flag = await reqFlag.loadImage();

// Start the process
if (config.runsInWidget) {
	let widget = flag.has_error
		? await createErrorWidget(flag)
		: await createWidget(flag);
	Script.setWidget(widget);
} else {
	const options = ['Small', 'Medium', 'Large', 'Cancel'];
	let resp = await presentAlert('Preview Widget', options);
	if (resp == options.length - 1) return;
	let size = options[resp];
	let widget = flag.has_error
		? await createErrorWidget(post)
		: await createWidget(flag, size.toLowerCase());

	await widget[`present${size}`]();
}

Script.complete();

//-------------------------------------
async function presentAlert(prompt, items, asSheet) {
	let alert = new Alert();
	alert.message = prompt;

	for (const item of items) {
		alert.addAction(item);
	}
	let resp = asSheet ? await alert.presentSheet() : await alert.presentAlert();
	return resp;
}
//---------------------------------
async function createWidget(data, widgetFamily) {
	widgetFamily = widgetFamily || config.widgetFamily;
	const padd = widgetFamily == 'large' ? 12 : 10;
	const fontSize = widgetFamily == 'large' ? 14 : 10;

	const img = flag;

	const widget = new ListWidget();

	widget.setPadding(padd, padd, padd, padd);
	widget.backgroundImage = img;

	if (true) {
		// add gradient with a semi-transparent
		// dark section at the bottom. this helps
		// with the readability of the status line
		widget.backgroundGradient = newLinearGradient(
			['#ffffff00', '#ffffff00', '#00000088'],
			[0, 0.75, 1]
		);

		// top spacer to push the bottom stack down
		widget.addSpacer();

		// horizontal stack to hold the status line
		const stats = widget.addStack();
		stats.layoutHorizontally();
		stats.centerAlignContent();
		stats.spacing = 3;

		const text = addText(stats, countryName, 'left', fontSize);
	}
	widget.url = url;

	return widget;
}
//---------------------------------
function newLinearGradient(hexcolors, locations) {
	let gradient = new LinearGradient();
	gradient.locations = locations;
	gradient.colors = hexcolors.map((color) => new Color(color));
	return gradient;
}
//---------------------------------
function addText(container, text, align, size) {
	const txt = container.addText(text);
	txt[`${align}AlignText`]();
	txt.font = Font.systemFont(size);
	txt.shadowRadius = 3;
	txt.textColor = Color.white();
	txt.shadowColor = Color.black();
}
//---------------------------------
function createURL(language) {
	switch (language) {
		// Czech
		case 'cs':
			if (code.includes('us-')) {
				return `https://www.statnivlajky.cz/usa-staty/${formatedName}`;
			} else if (code == 'un') {
				return 'https://www.statnivlajky.cz/organizace/osn';
			} else if (code == 'eu') {
				return 'https://www.statnivlajky.cz/organizace/eu';
			} else {
				return `https://www.statnivlajky.cz/${formatedName}`;
			}

		// German
		case 'de':
			if (code.includes('us-')) {
				return `https://www.welt-flaggen.de/us-staaten/${formatedName}`;
			} else if (code == 'un') {
				return 'https://www.welt-flaggen.de/organisation/vn';
			} else if (code == 'eu') {
				return 'https://www.welt-flaggen.de/organisation/eu';
			} else {
				return `https://www.welt-flaggen.de/${formatedName}`;
			}

		// Spanish
		case 'es':
			if (code.includes('us-')) {
				return `https://www.banderas-mundo.es/usa-estados/${formatedName}`;
			} else if (code == 'un') {
				return 'https://www.banderas-mundo.es/organizacion/onu';
			} else if (code == 'eu') {
				return 'https://www.banderas-mundo.es/organizacion/eu';
			} else {
				return `https://www.banderas-mundo.es/${formatedName}`;
			}

		// French
		case 'fr':
			if (code.includes('us-')) {
				return `https://www.drapeauxdespays.fr/usa-etats/${formatedName}`;
			} else if (code == 'un') {
				return 'https://www.drapeauxdespays.fr/organisation/onu';
			} else if (code == 'eu') {
				return 'https://www.drapeauxdespays.fr/organisation/eu';
			} else {
				return `https://www.drapeauxdespays.fr/${formatedName}`;
			}

		// Italian
		case 'it':
			if (code.includes('us-')) {
				return `https://www.bandiere-mondo.it/usa-stati/${formatedName}`;
			} else if (code == 'un') {
				return 'https://www.bandiere-mondo.it/organizzazione/onu';
			} else if (code == 'eu') {
				return 'https://www.bandiere-mondo.it/organizzazione/unione-europea';
			} else {
				return `https://www.bandiere-mondo.it/${formatedName}`;
			}

		// Pashto
		case 'pl':
			if (code.includes('us-')) {
				return `https://www.flagi-panstw.pl/usa-stany/${formatedName}`;
			} else if (code == 'un') {
				return 'https://www.flagi-panstw.pl/organizacja/onz';
			} else if (code == 'eu') {
				return 'https://www.flagi-panstw.pl/organizacja/eu';
			} else {
				return `https://www.flagi-panstw.pl/${formatedName}`;
			}

		// Slovak
		case 'sk':
			if (code.includes('us-')) {
				return `https://www.statnevlajky.sk/usa-staty/${formatedName}`;
			} else if (code == 'un') {
				return 'https://www.statnevlajky.sk/organizace/osn';
			} else if (code == 'eu') {
				return 'https://www.statnevlajky.sk/organizace/eu';
			} else {
				return `https://www.statnevlajky.sk/${formatedName}`;
			}

		// English
		case 'en':
			if (code.includes('us-')) {
				return `https://flagpedia.net/us-states/${formatedName}`;
			} else if (code == 'un') {
				return 'https://flagpedia.net/organization/un';
			} else if (code == 'eu') {
				return 'https://flagpedia.net/organization/eu';
			} else {
				return `https://flagpedia.net/${formatedName}`;
			}
	}
}
// -------------------------------
// Thanks to @Mercelo-ribeiro
function slugify(str) {
	const map = {
		'-': "'| ",
		a: 'á|à|ã|â|ä|å|ą',
		e: 'é|è|ê|ě|ë|ę',
		i: 'í|ì|î|ï|į',
		o: 'ó|ò|ô|õ|ö',
		u: 'ú|ù|û|ü|ů',
		y: 'ý|ÿ',
		c: 'ç|č',
		l: 'ł',
		r: 'ř',
		z: 'ž|ż|ź',
		ss: 'ß',
		s: 'š|ś',
		n: 'ñ|ń'
	};

	for (let pattern in map) {
		str = str.replace(new RegExp(map[pattern], 'g'), pattern);
	}

	return str;
}
