//========================================================================//

// format datuma
var INFO_DATE_FORMAT = new java.text.SimpleDateFormat("d.M.yyyy");
var SQL_DATE_FORMAT= new java.text.SimpleDateFormat("yyyyy-MM-dd");
var DATE_FORMAT= new java.text.SimpleDateFormat("yyyy-MM-dd");

//========================================================================//

function getInfoDate(date) {
	if (date instanceof String) date = str2date(date);
  return INFO_DATE_FORMAT.format(java.util.Date(date.valueOf()));
}

function getInfoPostaja(postaja) {	
  return formatNumber(postaja);
}

function createMsgInputFinished(postaja, date1, date2, num, mindate, maxdate) {
	num = parseInt("" + num);
	var msg = "VNOS PODATKOV ZA POSTAJO " + postaja + " ZA OBDOBJE OD " + getInfoDate(date1) + " DO " + 
						getInfoDate(date2) + " JE KON\u010cAN. ";
	if (num == 0) msg += "NI SPREMENJENIH ALI NOVIH PODATKOV! "; 
	msg += "\u0160TEVILO VNE\u0160ENIH DNI: " + num;
	if (num > 0) {
		if (num == 1) msg += ", VNE\u0160ENI DATUM: " + getInfoDate(mindate);
		else msg += ", PRVI VNE\u0160ENI DATUM: " + getInfoDate(mindate) + ", ZADNJI VNE\u0160ENI DATUM: " + getInfoDate(maxdate);
	}
	msg += ".";
	return msg;
}

function createMsgErrorValidating(postaja, date1, date2, e) {
	return "NAPAKA PRI PREVERJANJU PODATKOV ZA POSTAJO " + postaja + " ZA OBDOBJE OD " + 
				 getInfoDate(date1) + " DO " + getInfoDate(date2) + "! Napaka: " + e;
}

function createMsgErrorReading(postaja, date1, date2, e) {
	return "NAPAKA PRI BRANJU PODATKOV IZ BAZE ZA POSTAJO " + postaja + " ZA OBDOBJE OD " + 
	       getInfoDate(date1) + " DO " + getInfoDate(date2) + "! Napaka: " + e;
}

function createMsgErrorWriting(postaja, date1, date2, e) {
	return "NAPAKA PRI VNOSU PODATKOV V BAZO ZA POSTAJO " + postaja + " ZA OBDOBJE OD " + 
	       getInfoDate(date1) + " DO " + getInfoDate(date2) + "! Napaka: " + e;
}

//========================================================================//
// kreiranje objekta s podatki 
//========================================================================//

function createDataObj(objname, data) {
	var obj = new Object();
	obj[objname] = data;
	return obj;
}

//========================================================================//
// dodajanje napak, opozoril in sporocil elementu klima|padavine|sonce
//========================================================================//

// dodajanje opozorila elementu klima|padavine|sonce 
function addWarning(xml, warning) {
  xml.getRootElement().addAttribute(new Attribute("warn", warning));
  return xml;
}

// dodajanje sporocila elementu klima|padavine|sonce
function addMessage(xml, message) {
  xml.getRootElement().addAttribute(new Attribute( "msg", message));
  return xml;
}

// dodajanje napake elementu klima|padavine|sonce in posiljanje xml dokumenta
function sendError(objname, error) {
  cocoon.sendPage(objname + "_xml", createDataObj(objname, adaptXml(toXml("<" + objname + " err='" + error + "'/>"))));	
}

//========================================================================//
// vodilne nicle
//========================================================================//

// odstranjevanje vodilnih nicel
function getNumber(num) {
	var re = /([0]*)([1-9][0-9]*)/;
	return parseInt(("" + num).replace(re, "$2"));
}		

// dodajanje vodilnih nicel
function formatNumber(num) {
	var numstr = "" + num;
	while (numstr.length < 3) numstr = "0" + numstr;
	return numstr;
}		

//========================================================================//
// preverjanje url-a in dolocanje imena postaje
//========================================================================//

function checkUrl(objname, postaja, tip, datumz, datumk) {
  var today = new Date();
	var maxdate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
	if (str2date(datumz).valueOf() >= maxdate.valueOf() || str2date(datumk).valueOf() >= maxdate.valueOf()) { 
		throw "OBRAVNAVAJO SE LAHKO SAMO PODATKI DO VKLJU\u010cNO DANA\u0160NJEGA DNE!";  
		return; 
	}
  var st_postaje = getNumber(postaja); 														// stevilka postaje je lahko napisana z vodilnimi niclami in jih je treba odrezati
	var st_tipa = getNumber(tip); 																	// stevilka tipa je lahko napisana z vodilnimi niclami in jih je treba odrezati
	var ime_postaje;                                                
  if (parseInt("" + queryInt(countPostaja(st_postaje))) > 0) {    // preverimo, ali obstaja postaja z dano klimatolosko stevilko
    if (objname == "klima" && st_tipa != 2 && st_tipa !=3) {      // preverimo, ali je dani tip pravilen; za klimo mora biti 2 ali 3 
			throw "Napa\u010dna \u0161tevilka tipa."; 
			return; 
		}                                                                                                                                           
    ime_postaje = query(selectPostaja(st_postaje)).get(0).get("ime_postaje");   // poiscemo ime postaje
    if (parseInt("" + queryInt(countPostaja(st_postaje, st_tipa))) == 0) {      // preverimo, ali obstaja postaja z dano klimatolosko stevilko in danim tipom; glede na tip izpisemo sporocilo
      if (st_tipa == 1) throw "Padavinska postaja s \u0161tevilko " + st_postaje + " ne obstaja.";
      else if (st_tipa == 2) throw "Klimatolo\u0161ka postaja s \u0161tevilko " + st_postaje  + " ne obstaja.";
      else if (st_tipa == 3) throw "Glavna meteorolo\u0161ka postaja s \u0161tevilko " + st_postaje  + " ne obstaja.";
      else if (st_tipa == 14) throw "Postaja s heliografom s \u0161tevilko " + st_postaje  + " ne obstaja.";
      return;
    }
    return ime_postaje;  // ce ni napake, vrnemo ime postaje
  }
  else {
		throw "Postaja s klimatolo\u0161ko \u0161tevilko " + st_postaje  + " ne obstaja.";
    return;
  }
}

//========================================================================//
// CurrentTransaction
//========================================================================//

// glavni objekt, v katerem so podatki (transakcija)
function CurrentTransaction(objname, id, postaja, ime_postaje, tip, datumz, datumk) {
  this.getClass = function() { return "CurrentTransaction" };                               
  this.name = objname.toLowerCase(); 																											// klima|padavine|sonce
  this.id = id; 																																					// id stevilka objekta: 0,1,2,...
  this.action; 																																						// check|insert; check=preverjanje, insert=vnos v bazo; privzeto=check
  this.postaja = postaja; 																																// klimataoloska stevilka postaje
  this.tip = tip; 																																				// tip postaje (klima=2|3, padavine=1, sonce=14)
  this.ime_postaje = ime_postaje; 																												// ime postaje  
  this.datumz = datumz;																																		// zacetek intervala
  this.datumk = datumk; 																																	// konec intervala
  this.getFirst = getFirst; 																															// prvi element glede na interval
  this.getLast = getLast;  																																// zadnji element glede na interval
  this.postaje = generatePostaje(this.postaja, this.tip, this.datumz, this.datumk); 			// veljavni idmm-ji za to klimatolosko postajo v danem intervalu
  this.parametri = generateParametri(this.postaja, this.tip, this.datumz, this.datumk); 	// parametri, ki se merijo na posameznem idmm glede na this.postaje
  this.setFirstEditDate = setFirstEditDate; 																							// dolocanje prvi dan, v katerem se lahko editirajo podatki (odvisno od vloge uporabnika)
  this.getFirstEditDate = getFirstEditDate; 																							// prvi dan, v katerem se lahko editirajo podatki (odvisno od vloge uporabnika)  
  this.generateKlimaPadavineSonce = generateKlimaPadavineSonce; 													// generiranje podatkov: iz baze(status=0) in prazni(status=1)
  this.generateKlimaPadavineSonce(objname);	                                              
  this.addFirstKlimaPadavine = addFirstKlimaPadavine; 																		// dodajanje prvega elementa, ÄŤe ni idmm; status=2
  this.addFirstKlimaPadavine(objname);                                                    
  this.toXml = obj2xml; 																																	// transformacija objektov v xml - podatki 																																									
  this.toEXml = obj2errorXml;																															// transformacija objektov v xml - napake
  this.getPrev = getPrev; 																																// predhodni element
  this.getPrevByDate = getPrevByDate; 																										// predhodni element glede na datum
  this.getNext = getNext; 																																// naslednji element
  this.hasPrev = hasPrev; 																																// ali obstaja predhodni element
  this.hasNext = hasNext;  																																// ali obstaja naslednji element
  this.lastDate = getLastDate; 																														// zadnji dan, ki se vsebuje podatke
  this.insert = insertObj; 																																// vnos podatkov v bazo
  this.correct = correctObj;  																														// uskladitev podatkov ob vnosu v bazo (val = nval)
  this.validate = validateObj; 																														// preverjanje podatkov 
  this.clearErrorsWarnings = clearErrorsWarningsObj;																			// brisanje napak in opozoril
  this.numerrs; 																																					//stevilo napak
  this.numwarns;																																					// stevilo opozoril  
  this.setOldVal = setOldValueObj;																												//shranjevanje vrednosti v formi  (oval = nval)
}                                                                                         
                                                                                          
//========================================================================//
// KlimaPadavineSonce
//========================================================================//

// objekt s podatki za posmezen datum - splosen objekt za klimo, padavine, sonce
function KlimaPadavineSonce(parent, postaja, tip, idmm, datum, ime_vnasalca, ime_opazovalca) {
  this.getClass = function() { return "KlimaPadavineSonce" };
  this.parent = parent;                                                                   
  this.name = "d" + this.parent.name; 																										// dklima|dpadavine|dsonce   
  this.postaja = postaja;  																																// klimatoloska stevilka postaje
  this.tip = tip; 																																				// tip postaje (1,2,3,14)
  this.idmm = idmm; 																																			// idmm postaje - ce idmm ne obstaja, ni podatkov - lahko prazen dan (status=2)
  this.datum = datum; 																																		// datum
  this.setLetoMesecDan = setLetoMesecDan;                                                 // dolocanje parametrov leto, mesec, dan
  this.setLetoMesecDan();                                                                 
  if (ime_vnasalca) this.ime_vnasalca = ime_vnasalca; 																		// ime vnasalca
  if (ime_opazovalca) this.ime_opazovalca = ime_opazovalca; 															// ime opazovalca - ime opazovalca se bo prebralo iz baze kot idmm ali parametri, vendar zaenkrat v bazi se ni ustrezne tabele
  this.oid = date2oid(this.parent.name, this.datum); 																			// id objekta  
  this.toXml = kps2xml; 																																	// kreiranje xml-a
  this.toEXml = kps2errorXml; 																														// kreiranje xml-a za napake in opozorila 
  this.getPrev = function() {return this.parent.getPrev(this);} 													// predhodni element
  this.getPrevByDate = function() {return this.parent.getPrevByDate(this);} 							// predhodni element glede na datum; ce na ta datum ni idmm-a, je enak null
  this.getNext = function() {return this.parent.getNext(this);} 													// naslednji element
  this.hasPrev = function() {return this.parent.hasPrev(this);}														// ali ima predhodnika
  this.hasNext = function() {return this.parent.hasNext(this);}														// ali ima naslednika
  this.isChanged = isKlimaPadavineSonceChanged; 																					// ali se je objekt spremenil (primerjava obbjektov na strezniku in klientu)
  this.correct = correctKlimaPadavineSonce; 																							// popravljanje objekta, ce se podatki vnasajo v bazo - uskladitev 
  this.isEmpty = isEmpty; 																																// ali ima kaksno vrednost
  this.isEqualToPrev = isEqualToPrev; 																										// ali je enak predhodniku po datumu
  this.generateErrorsSearchKlimaPadavineSonce = generateErrorsSearchKlimaPadavineSonce; 	// generiranje kontrol 
  this.sets = new Array(); 																																// seznam polj, ki se morajo spremeniti na strezniku (led, tmokri, interpolacija)
  this.errors_warnings = new Array(); 																										// seznam napak in opozoril
  this.clearErrorsWarnings = clearErrorsWarningsKps;																			// brisanje napak in opozoril 
  this.disableControls = disableControls;																									// izkljucitev kontrol
  this.enableControls = enableControls;																										// vkljucitev kontrol				
  this.numerrs;																																						// stevilo napak
  this.numwarns;																																					// stevilo opozoril
  this.validate = validateKlimaPadavineSonce;  																						// validacija - preverjanje podatkov
  this.setOldVal = setOldValueKps;																												// dolocanje stare vrednosti
}                                                                                         
                                                                                          
//========================================================================//              
// Klima                                                                                  
//========================================================================//

// objekt s podatki za klimo
function Klima(parent, postaja, tip, idmm, datum, ime_vnasalca, ime_opazovalca, nadm_visina, k5_pritisk_7h, k6_pritisk_14h, 
							 k7_pritisk_21h, k23_inter_tmaks, k8_maksimalna_temperatura, k24_inter_tmin, k9_minimalna_temperatura, 
							 k25_inter_tmin5, k10_minimalna_temperatura_5cm, k26_inter_ts07, k11_temperatura_suhi_7h, k27_inter_ts14, 
							 k12_temperatura_suhi_14h, k28_inter_ts21, k13_temperatura_suhi_21h, k29_inter_tm07, k14_temperatura_mokri_7h, 
							 k30_inter_tm14, k15_temperatura_mokri_14h, k31_inter_tm21, k16_temperatura_mokri_21h, k17_led_7h, k18_led_14h, 
							 k19_led_21h, k20_rel_vlaga_7h, k21_rel_vlaga_14h, k22_rel_vlaga_21h, k33_smer_vetra_7h, k35_smer_vetra_14h, 
							 k37_smer_vetra_21h, k34_jakost_vetra_7h, k36_jakost_vetra_14h, k38_jakost_vetra_21h, k34_hitrost_vetra_7h, 
							 k36_hitrost_vetra_14h, k38_hitrost_vetra_21h, k39_stanje_tal_7h, k40_stanje_tal_14h, k41_stanje_tal_21h, 
							 k42_vidnost_7h, k43_vidnost_14h, k44_vidnost_21h, k45_trajanje_sonca, k46_oblacnost_7h, k47_oblacnost_14h, 
							 k48_oblacnost_21h, k32_inter_padavine, k49_padavine, k50_oblika_padavin, k51_sneg_skupaj, k52_sneg_novi,
							 k53_voda_v_snegu, k54_dez_rosenje_ploha_dezja, k55_dez_zmrz_rosen_zmrz_iglice, k56_sneg_zrnat_sneg_ploha_snega, 
							 k57_dez_s_sn_babje_psen_ploh_ds, k58_toca_sodra_dim, k59_megla_megla_z_vid_neb_led_m, k60_meglic_suha_motnost_talna_m, 
							 k61_rosa_slana_prsec_z_vodne_p_, k62_poledica_zled_poled__na_tl_, k63_ivje_trdo_ivje_elijev_og_, 
							 k64_nevihta_grmenje_bliskanje, k65_mocan_veter_6bf_8bf, k66_snezni_vrtici_tromba_1, k67_prasni_pesceni_vrtinci_2, 
							 k68_halo_venec_ok_sonca_mavrica, k69_halo_venec_ok_lune_zrcalje, k70_snezna_odeja) {
  KlimaPadavineSonce.apply(this, [parent, postaja, tip, idmm, datum, ime_vnasalca, ime_opazovalca]);
  this.nadm_visina = nadm_visina;																														// nadmorska visina postaje
  this.pavg = pavg_mmhg(nadm_visina);  																											// povprecen zracni pritisk na postaji
  this.st_dni = getNumberOfDays(this.leto, this.mesec);																			// stevilo dni v mesecu
  this.pravi_datum = isDayCorrect;																													// ali je datum pravi 5,10,15,25, zadnji v mesecu - za parameter voda
  this.setTmokri = setTmokri;																																// dolocanje tmokri, led, interpolacija na strezniku
  for (var i = 0; i < parametri_klima.length; i++) {																				// dolocanje vrednosti parametrov
    eval("var bval = " + parametri_klima[i].name);                                          
    this[parametri_klima[i].name] = generateKlimaParam(this, parametri_klima[i], bval);     
    if (i == 33 || i == 34 || i == 35) this[parametri_klima[i].name].ms2bfs(); 							// dolocanje parametra jakost
    this[parametri_klima[i].name].messages = parametri_klima[i].messages;										// dodajanje sporocil parametru	
  }                                                                                         
  for (var i = 0; i < pojavi_klima.length; i++) {																						// dolocanje vrednosti pojavov
    eval("var bval = " + pojavi_klima[i].name);                                             
    this[pojavi_klima[i].name] = generateKlimaPojav(this, pojavi_klima[i], bval);           
    this[pojavi_klima[i].name].messages = pojavi_klima[i].messages;                         
  }                                                                                         
  this.messages = msgs_klima;																																// dodajanje sporocil		
  this.generateErrorsSearchKlimaPadavine = generateErrorsSearchKlimaPadavine;								// funkcije za izvajanje kontrol
  this.generateErrorsSearch_ = generateErrorsSearchKlima_;
  this.generateErrorsSearch = generateErrorsSearchKlima;                                    
  this.enableErrorsSearchPadavine = enableErrorsSearchPadavine;                             
  this.enableErrorsSearch = enableErrorsSearchKlima;                                        
  this.generateErrorsBehavior = generateErrorsBehaviorKlima;                                
  this.controls = controls_klima;																														// seznam kontrol		
	this.insert = createInsertStatementKlima;																									// insert stavek
	this.update = createUpdateStatementKlima;																									// update stavek (samo za klima_vhodna)
	this.count = createCountStatementKlima;																									  // count stavek
	this.clearPojavi = clearPojavi;                                                           // DODANO ZA POJAVE NA 9
}                                                                                           

// povprecen pritisk v mmgh
function pavg_mmhg(h) {
  var phpa, pmmhg;
  if (h <= 500) phpa = Math.round(10 * 1013.246 * Math.exp((-h * 9.806 / 287.05) / (34 -h * 24.5 / 2515 + 273.15))) / 10; 
  else phpa = Math.round(10 * 1013.246 * Math.exp((-h * 9.806 / 287.05) / (17 - h * 7.5 / 2515 + 273.15))) / 10; 
  pmmhg = Math.round(100 * (3 / 4) * phpa) / 10;
  return pmmhg;
}

//DODANO ZA POJAVE NA 9
function clearPojavi() {
	eval("var pojavi = pojavi_" + this.parent.name);
  for (var i = 0; i < pojavi.length; i++) this[pojavi[i].name].toNull();
}

//========================================================================//
// Padavine
//========================================================================//

// objekt s podatki za padavine
function Padavine(parent, postaja, tip, idmm, datum, ime_vnasalca, ime_opazovalca, nadm_visina, p14_interpolacija, p5_padavine, 
									p6_oblika, p7_sneg_skupaj, p8_sneg_novi, p9_dez_sneg_dezsneg, p10_toca_slana_megla, p11_ivje_sodra_bpseno, 
									p12_poledica_nevihta_vihveter, p13_sneznaodeja_rosa) {
  KlimaPadavineSonce.apply(this, [parent, postaja, tip, idmm, datum, ime_vnasalca, ime_opazovalca]);
  this.nadm_visina = nadm_visina;																																																													// nadmorska visina postaje
  for (var i = 0; i < parametri_padavine.length; i++) {																							// dolocanje vrednosti parametrov
    eval("var bval = " + parametri_padavine[i].name);                                               
    this[parametri_padavine[i].name] = generatePadavineParam(this, parametri_padavine[i], bval);    
    this[parametri_padavine[i].name].messages = parametri_padavine[i].messages;                     
  }                                                                                                 
  for (var i = 0; i < pojavi_padavine.length; i++) {																								// dolocanje vrednosti pojavov
    eval("var bval = " + pojavi_padavine[i].name);                                                  
    this[pojavi_padavine[i].name] = generatePadavinePojav(this, pojavi_padavine[i], bval);          
    this[pojavi_padavine[i].name].messages = pojavi_padavine[i].messages;                           
  }                                                                                                 
  this.messages = msgs_padavine;																																		// dodajanje sporocil
  this.generateErrorsSearchKlimaPadavine = generateErrorsSearchKlimaPadavine;												// funkcije za izvajanje kontrol
  this.generateErrorsSearch_ = generateErrorsSearchPadavine_;                                       
  this.generateErrorsSearch = generateErrorsSearchPadavine;                                         
  this.enableErrorsSearch = enableErrorsSearchPadavine;                                             
  this.generateErrorsBehavior = generateErrorsBehaviorPadavine;                                     
	this.controls = controls_padavine; 																																// seznam kontrol
  this.insert = createInsertStatementPadavine;																											// insert stavek
	this.update = createUpdateStatementPadavine;																											// update stavek (samo za padavine_vhodna)
	this.count = createCountStatementPadavine;																									      // count stavek	
	this.clearPojavi = clearPojavi;	                                                                  // DODANO ZA POJAVE NA 9                                           
}

//========================================================================//
// Sonce
//========================================================================//

// objekt s podatki za sonce
function Sonce(parent, postaja, tip, idmm, datum, ime_vnasalca, ime_opazovalca, ge_dolzina, ge_sirina, son_interpolacija, son_trajanje_04_05, son_trajanje_05_06, son_trajanje_06_07, son_trajanje_07_08, son_trajanje_08_09, son_trajanje_09_10, son_trajanje_10_11, son_trajanje_11_12, son_trajanje_12_13, son_trajanje_13_14, son_trajanje_14_15, son_trajanje_15_16, son_trajanje_16_17, son_trajanje_17_18, son_trajanje_18_19, son_trajanje_19_20) {
  KlimaPadavineSonce.apply(this, [parent, postaja, tip, idmm, datum, ime_vnasalca, ime_opazovalca]);
  this.ge_sirina = ge_sirina;																																																															// geografska sirina postaje
  this.ge_dolzina = ge_dolzina;																																																												// geografska visina postaje
  var sun = getSunriseSunset(this.ge_dolzina, this.ge_sirina, this.leto, this.mesec, this.dan);		// cas soncnega vzhoda in zahoda
  this.sunrise = sun.sunrise;                                                                     
  this.sunset = sun.sunset;                                                                       
  this.max = sonce_max[this.mesec - 1];																														// omejitev za trajanje sonca glede na mesec
	for (var i = 0; i < parametri_sonce.length; i++) {																							// dolocanje vrednosti parametrov
    eval("var bval = " + parametri_sonce[i].name);                                                
    this[parametri_sonce[i].name] = generateSonceParam(this, parametri_sonce[i], bval);           
    this[parametri_sonce[i].name].messages = parametri_sonce[i].messages;                         
  }                                                                                               
  this.messages = msgs_sonce;																																			// dodajanje sporocil
  this.generateErrorsSearch = generateErrorsSearchSonce;																					// funkcije za izvajanje kontrol
  this.generateErrorsBehavior = generateErrorsBehaviorSonce;                                      
	this.controls = controls_sonce; 																																// seznam kontrol
  this.insert = createInsertStatementSonce;																												// insert stavek
	this.update = createUpdateStatementSonce;																												// update stavek (samo za trajanje_vhodna)
	this.count = createCountStatementSonce;																									        // count stavek
}                                                                                                 
                                                                                                  
function getSunriseSunset(lon, lat, year, month, day) {
  var mj = mjd(day, month, year, 0.0);
  var sun = find_sun_for_date(mj, 1, lon, lat);  
  var risehourmax = 10 - parseInt(parseFloat(sun.rise - parseInt(sun.rise) - 0.05) * 10);
  if (risehourmax == 0) risehourmax = 1;
  else if (risehourmax > 10) risehourmax = 10;
  var sethourmax = parseInt((parseFloat(sun.set - parseInt(sun.set)) + 0.05) * 10); 
  if (sethourmax == 0) sethourmax = 1;
  else if (sethourmax > 10) sethourmax = 10;
  return {
		sunrise:{ "hrs":parseInt(sun.rise), "max":risehourmax }, 
		sunset:{ "hrs":parseInt(sun.set), "max":sethourmax }
	}
}

//========================================================================//
// Parameter
//========================================================================//

// objekt s podatki za parameter - klima, padavine, sonce
function Parameter(parent, name, param, mval, bval) {
  this.getClass = function() { return "Parameter" };
  this.parent = parent;
  this.name = name;																																																																																																// ime parametra v bazi 
  this.param = param;																																																																																															// stevilka parametra v bazi
  this.mval = parseInt(mval);																																																																																										// oznaka za manjkajoco vrednost v bazi
  this.bval = (bval == null)? parseInt(mval) : parseInt(bval);																																																																	// vrednost parametra v baz zo. manjkajoca vrednost
  this.msr = isParamMeasured(this.parent.parent.postaje, this.parent.parent.parametri, this.param, this.parent.idmm, this.parent.datum); 	// ali se parameter meri
  this.edit = setEdit;  																																																																																																// ali se parameter lahko editira	
  this.val = (this.bval != this.mval)? new Number(this.bval) : null;																																																													// vrednost parametra	
  this.toXml = param2xml;																																																																																												// transformacija v xml element 												
  this.nval;  																																																																																																							// nova vrednost parametra																																
  this.oval = this.val;																																																																																																// stara vrednost parametra																																																			
  this.isChanged = isValueChanged;																																																																																				// ali se je vrednost spremenila
  this.nval2bval = nval2bvalParam;																																																																																					// izracun vrednosti za vnos v bazo
  this.correct = correctParam;																																																																																									// popravek parametra		
  this.generateErrorsSearch = generateErrorsSearchParam;																																																																	// funkcije za izvajanje kontrol
  this.generateErrorsBehavior = generateErrorsBehaviorParam;
  this.setNewVal = setNewValueParam;																																																																																	// dolocanje nove vrednosti
  this.setOldVal = setOldValueParam;																																																																																			// dolocanje stare vrednosti
}

//========================================================================//
// ParameterInterpolacija
//========================================================================//

// interpolacija
function ParameterInterpolacija(parent, name, id, mval, bval) {//splosno
  Parameter.apply(this, [parent, name, id, mval, bval]);
  this.val = (this.bval != this.mval)? new Number(this.bval) : null;
  this.edit = setEditInterpolacija;
  this.values = [0,1,2,3,4,5,6,7,8];
}

// interpolacija sonce
function ParameterSonInterpolacija(parent, name, id, mval, bval) {//posebej za sonce, ker so drugacne vrednosti
  ParameterInterpolacija.apply(this, [parent, name, id, mval, bval]);
  this.values = [0,11,12,13,14,15,16,21,22,23,24,25,26,31,32,33,34,35,36,41,42,43,44,45,46,51,52,53,54,55,56];
}

// interpolacija padavine
function ParameterPadInterpolacija(parent, name, id, mval, bval) {
  ParameterInterpolacija.apply(this, [parent, name, id, mval, bval]);
}

// interpolacija klima
function ParameterKliInterpolacija(parent, name, id, mval, bval) {
  ParameterInterpolacija.apply(this, [parent, name, id, mval, bval]);
}

// interpolacija za temeperaturo mokrega termometra - klima
function ParameterKliInterpolacijatmokri(parent, name, id, mval, bval) {
  ParameterKliInterpolacija.apply(this, [parent, name, id, mval, bval]);
  this.setNewVal = setNewValueParamTmokriLedInterpolacijatmokri;
  this.isChanged = isValueChangedTmokriLedInterpolacijatmokri;
  this.nval2bval = nval2bvalParamTmokriLedInterpolacijatmokri;
}

//========================================================================//
// ParameterSonTrajanje
//========================================================================//

// trajanje soncnega obsevanja v 1 uri - sonce
function ParameterSonTrajanje(parent, name, id, mval, bval) {  
  Parameter.apply(this, [parent, name, id, mval, bval]);
  this.min = new Number(0);
  this.max = setMaxSonTrajanje;
}

function setMaxSonTrajanje() {
  var re = /son_trajanje_([01][0-9])_[0-9]{2}/g;
  var hrs = parseInt(this.name.replace(re, "$1"));
  if (hrs < parseInt(this.parent.sunrise.hrs) || hrs > parseInt(this.parent.sunset.hrs)) return new Number(0);
  else if (hrs == parseInt(this.parent.sunrise.hrs)) return new Number(this.parent.sunrise.max);
  else if (hrs == parseInt(this.parent.sunset.hrs)) return new Number(this.parent.sunset.max);
  return new Number(10);  
}

//========================================================================//
// ParameterTemperatura, ParameterKliLed
//========================================================================//

// temperatura - klima
function ParameterTemperatura(parent, name, id, mval, bval) {
  Parameter.apply(this, [parent, name, id, mval, bval]);
  this.min = TMIN;
  this.max = TMAX;
}

// maksimalna temperatura - klima
function ParameterKliMaksimalnaTemperatura(parent, name, id, mval, bval) {
  ParameterTemperatura.apply(this, [parent, name, id, mval, bval]);
}

// minimalna temperatura - klima
function ParameterKliMinimalnaTemperatura(parent, name, id, mval, bval) {
  ParameterTemperatura.apply(this, [parent, name, id, mval, bval]);
}

// minimalna temperatura na 5 cm - klima
function ParameterKliMinimalnaTemperatura5cm(parent, name, id, mval, bval) {
  ParameterTemperatura.apply(this, [parent, name, id, mval, bval]);
}

// temperatura suhega termometra - klima
function ParameterKliTemperaturaSuhi(parent, name, id, mval, bval) {
  ParameterTemperatura.apply(this, [parent, name, id, mval, bval]);
}
 
// temperatura mokrega termometra - klima
function ParameterKliTemperaturaMokri(parent, name, id, mval, bval) {
  ParameterTemperatura.apply(this, [parent, name, id, mval, bval]);
  this.setNewVal = setNewValueParamTmokriLedInterpolacijatmokri;
  this.isChanged = isValueChangedTmokriLedInterpolacijatmokri;  
  this.nval2bval = nval2bvalParamTmokriLedInterpolacijatmokri;
}

// led - klima
function ParameterKliLed(parent, name, id, mval, bval) {
  Parameter.apply(this, [parent, name, id, mval, bval]);
  this.values = [0, 1];
  this.setNewVal = setNewValueParamTmokriLedInterpolacijatmokri;
  this.isChanged = isValueChangedTmokriLedInterpolacijatmokri;
  this.nval2bval = nval2bvalParamTmokriLedInterpolacijatmokri;
}

//racunanje temperature  mokrega termometra is temperature suhega termometra in relativne vlage po higrometru
function getTmokri(tsuhi, rh, pritisk, led) {
  var c1, c2, c3, c, vp, svp, t1, t2, tmokri, trosisce, diff, min_v, _tmokri;
  tsuhi = tsuhi * 0.1; // ker je vrednost v desetinah
  led = (led)? led : ((tsuhi >= 0)? 0 : 1); // led iz tsuhega
	pritisk = pritisk * 0.1 * (4 / 3); // pritisk v hpa
  
  // konstante
	c1 = 6.1078;   
  if (tsuhi >= 0) {c2 = 17.08085; c3 = 234.175;}
  else {c2 = 17.84362; c3 = 245.425;}  
	
	vp = rh * c1 * Math.exp(c2 * tsuhi / (c3 + tsuhi)) * 0.01;
  trosisce = (c3 * Math.log(vp / c1)) / (c2 - Math.log(vp / c1));
  svp = c1 * Math.exp(c2 * trosisce / (c3 + trosisce));

  // iteracija
  t1 = Math.round(trosisce * 1000);
  t2 = Math.round(tsuhi * 1000);  
  if (t1 > t2) {var x = t1; t1 = t2; t2 = x; } //zamenjava
  min_v = 100;
  for (var i = t1 - 2000; i <= t2 + 400; i++) {
    tmokri = i * 0.001; 
		if (tsuhi >= 0) { c1 = 6.1078; c2 = 17.08085; c3 = 234.175; c = 0.00066 * (1 + 0.00115 * tmokri); }
		if (led == 1) { c1 = 6.10714; c2 = 22.44294; c3 = 272.44; c = 0.000582; }
		if (led == 0 && tsuhi < 0) { c1 = 6.1078; c2 = 17.84362; c3 = 245.425; c = 0.00066 * (1 + 0.00115 * tmokri); }
    diff = Math.abs(svp - (c1 * Math.exp(c2 * tmokri / (c3 + tmokri)) - c * (tsuhi - tmokri) * pritisk));
    if (diff < min_v) {
      min_v = diff;
      _tmokri = tmokri;
    }
  }
  tmokri = _tmokri * 10;	
  return {
		tmokri:parseInt("" + tmokri), 
		led:led
	};
}

//========================================================================//
// ParameterPadavine
//========================================================================//

// visina padavin - klima, padavine
function ParameterPadavine(parent, name, id, mval, bval) {
  Parameter.apply(this, [parent, name, id, mval, bval]);
  this.min = -1;
  this.max = 9000;
	this.maxW = 1000;
}

// visina padavin - klima
function ParameterKliPadavine(parent, name, id, mval, bval) {
  ParameterPadavine.apply(this, [parent, name, id, mval, bval]);
}

// visina padavin - padavine
function ParameterPadPadavine(parent, name, id, mval, bval) {
  ParameterPadavine.apply(this, [parent, name, id, mval, bval]);
}

//========================================================================//
// ParameterOblikaPadavin
//========================================================================//

// oblika padavin - klima, padavine
function ParameterOblikaPadavin(parent, name, id, mval, bval) {
  Parameter.apply(this, [parent, name, id, mval, bval]);
  this.values = [-1, 1, 2, 3, 4, 5, 6, 7, 8, 9];
}

// oblika padavin - klima
function ParameterKliOblikaPadavin(parent, name, id, mval, bval) {
  ParameterOblikaPadavin.apply(this, [parent, name, id, mval, bval]);
}

// oblika padavin - padavine
function ParameterPadOblika(parent, name, id, mval, bval) {
  ParameterOblikaPadavin.apply(this, [parent, name, id, mval, bval]);
}

//========================================================================//
// ParameterSnegSkupaj
//========================================================================//

// visina skupne snezne odeje - klima, padavine
function ParameterSnegSkupaj(parent, name, id, mval, bval) {
  Parameter.apply(this, [parent, name, id, mval, bval]);
  this.min = -1;
  var h = parseInt("" + this.parent.nadm_visina);
	this.max = (h >= 3000)? null : ((h >= 2000)? 1400 : ((h >= 1500)? 1000 : ((h >= 1000)? 800 : ((h >= 500)? 500 : 300))));
	this.maxW = (h <= 1500)? 200 : null;
}

// visina skupne snezne odeje - klima
function ParameterKliSnegSkupaj(parent, name, id, mval, bval) {
  ParameterSnegSkupaj.apply(this, [parent, name, id, mval, bval]);
}

// visina skupne snezne odeje - padavine
function ParameterPadSnegSkupaj(parent, name, id, mval, bval) {
  ParameterSnegSkupaj.apply(this, [parent, name, id, mval, bval]);
}

//========================================================================//
// ParameterSnegNovi
//========================================================================//

// visina novozapadlega snega - klima, padavine
function ParameterSnegNovi(parent, name, id, mval, bval) {
  Parameter.apply(this, [parent, name, id, mval, bval]);
  this.min = -1;
  var h = parseInt(this.parent.nadm_visina);
  this.max = 300;
	this.maxW = ((parseInt(this.parent.nadm_visina) <= 1500))? 200 : null;
}

// visina novozapadlega snega - klima
function ParameterKliSnegNovi(parent, name, id, mval, bval) {
  ParameterSnegNovi.apply(this, [parent, name, id, mval, bval]);
}

// visina novozapadlega snega - padavine
function ParameterPadSnegNovi(parent, name, id, mval, bval) {
  ParameterSnegNovi.apply(this, [parent, name, id, mval, bval]);
}

//========================================================================//
// ParameterKliVodaVSnegu
//========================================================================//

// voda - klima
function ParameterKliVodaVSnegu(parent, name, id, mval, bval) {
  Parameter.apply(this, [parent, name, id, mval, bval]);
  this.min = -1;  
  if (!this.parent.pravi_datum()) this.max = -1;
}

//========================================================================//
// ParameterKliPritisk
//========================================================================//

// pritisk - klima
function ParameterKliPritisk(parent, name, id, mval, bval) {
  Parameter.apply(this, [parent, name, id, mval, bval]);
  this.min = function() {return(parseInt(this.parent.pavg * 0.93));}
  this.max = function() {return(parseInt(this.parent.pavg * 1.07));}
}

//========================================================================//
// ParameterKliRelVlaga
//========================================================================//

// relativna vlaga - klima
function ParameterKliRelVlaga(parent, name, id, mval, bval) {
  Parameter.apply(this, [parent, name, id, mval, bval]);
  this.min = new Number(0);
  this.max = 100;
}

//racunanje relativne vlage po psihrometru
function getRhPsihro(tsuhi, led, tmokri, pritisk) {
  var c1, c2, c3, c, vp, rh; // vp=parcialni tlak vodne pare, rh=relativna vlaga po psihrometru    
  tsuhi = tsuhi * 0.1;
  tmokri = tmokri * 0.1;
	pritisk = pritisk * 0.1 * (4 / 3); // pritisk v hpa
	if (tsuhi >= 0) { c1 = 6.1078; c2 = 17.08085; c3 = 234.175; c = 0.00066 * (1 + 0.00115 * tmokri); }
	if (led == 1) { c1 = 6.10714; c2 = 22.44294; c3 = 272.44; c = 0.000582; }
	if (led == 0 && tsuhi < 0) { c1 = 6.1078; c2 = 17.84362; c3 = 245.425; c = 0.00066 * (1 + 0.00115 * tmokri); }
  vp = c1 * Math.exp(c2 * tmokri / (c3 + tmokri)) - c * (tsuhi - tmokri) * pritisk;	
	c1 = 6.1078;
	if (tsuhi < 0) { c2 = 17.84362;  c3 = 245.425; }
	else { c2 = 17.08085;  c3 = 234.175; }
	rh = 100 * vp / (c1 * Math.exp(c2 * tsuhi / (c3 + tsuhi)));		
  return {"rh":parseInt("" + rh), "vp":vp};
}

//========================================================================//
// ParameterKliSmerVetra
//========================================================================//

// smer vetra - klima
function ParameterKliSmerVetra(parent, name, id, mval, bval) {
  Parameter.apply(this, [parent, name, id, mval, bval]);
  this.values = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];
}

//========================================================================//
// ParameterKliJakostVetra, ParameterKliHitrostVetra
//========================================================================//

// jakost vetra - klima
function ParameterKliJakostVetra(parent, name, id, mval, bval) {
  Parameter.apply(this, [parent, name, id, mval, bval]);   
  this.values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	if (role == 1) 
		this.maxW = (parseInt(this.parent.postaja) == 3 || parseInt(this.parent.postaja) == 48 || parseInt(this.parent.postaja) == 437)? 10 : 7;
  this.setNewVal = setNewValueParamJakostVetra;
  this.bfs2ms = bfs2ms;  
  this.generateErrorsBehavior = generateErrorsBehaviorParamJakostHitrostVetra;
}

// hitrost vetra - klima
function ParameterKliHitrostVetra(parent, name, id, mval, bval) {
  Parameter.apply(this, [parent, name, id, mval, bval]);
  this.min = new Number(0);
	if (role == 1) 
		this.maxW = (parseInt(this.parent.postaja) == 3 || parseInt(this.parent.postaja) == 48 || parseInt(this.parent.postaja) == 437)? 245 : 138;
  this.ms2bfs = ms2bfs;
  this.toXml = paramHitrostVetra2xml;
  this.generateErrorsBehavior = generateErrorsBehaviorParamJakostHitrostVetra;
  this.nval2bval = nval2bvalParamHitrostVetra;
}

// jakost vetra v hitrost vetra
function bfs2ms() {// jakost v hitrost
  if (!this.nval || parseInt(this.nval) >= veter_vals.length) this.parent[(this.name).replace("jakost", "hitrost")].nval = null;
  else this.parent[this.name.replace("jakost", "hitrost")].nval = new Number(veter_vals[parseInt(this.nval)].avg);
}

// hitrost vetra v jakost vetra
function ms2bfs() {
  var jakost = this.parent[this.name.replace("hitrost", "jakost")];
  if (jakost.msr && this.val) {//poiscem vrednost
    for (var i = 0; i < veter_vals.length; i++) {
      if (parseInt(this.val) >= veter_vals[i].min && parseInt(this.val) <= veter_vals[i].max) {
        this.parent[this.name.replace("hitrost", "jakost")].val = new Number(i);
        this.parent[this.name.replace("hitrost", "jakost")].bval = new Number(i);
      }
      if (i >= veter_vals.length) jakost.val = null;
    }
  }
  else jakost.val = null; 
}

//========================================================================//
// ParameterKliStanjeTal
//========================================================================//

// stanje tal - klima
function ParameterKliStanjeTal(parent, name, id, mval, bval) {
  Parameter.apply(this, [parent, name, id, mval, bval]);
  this.values = [0,1,2,3,4,5,6,7,8,9];
}

//========================================================================//
// ParameterKliVidnost
//========================================================================//

// vidnost - klima
function ParameterKliVidnost(parent, name, id, mval, bval) {
  Parameter.apply(this, [parent, name, id, mval, bval]);
  this.values = [0,1,2,3,4,5,6,7,8,9];
}

//========================================================================//
// ParameterKliTrajanjeSonca, ParameterKliOblacnost
//========================================================================//

// trajanje sonca - klima
function ParameterKliTrajanjeSonca(parent, name, id, mval, bval) {
  Parameter.apply(this, [parent, name, id, mval, bval]);
  this.min = new Number(0);
  this.max = function() {return sonce_max[parseInt(this.parent.mesec) - 1];}
}
 
// oblacnost - klima
function ParameterKliOblacnost(parent, name, id, mval, bval) {
  Parameter.apply(this, [parent, name, id, mval, bval]);
  this.values = [0,1,2,3,4,5,6,7,8,9,10];
}

//========================================================================//
// ParameterPojav
//========================================================================//

// objekt s podatki za parameter - klima, padavine
function ParameterPojav(parent, name, param, mval, bval, pojav1, pojav2, pojav3) {
  Parameter.apply(this, [parent, name, param, mval, bval]);
  this.getClass = function() {return "ParameterPojav"};
  this.values = [0,1,2,3,4,5,6,7];														      // dovoljene vrednosti
  this.pojav1 = pojav1; 																						// prvi pojav	v stolpcu
  this.pojav2 = pojav2; 																						// drugi pojav v stolpcu
  if (pojav3) this.pojav3 = pojav3;																	// treji pojav v stolpci, ce obstaja 
  this.generateErrorsBehavior = generateErrorsBehaviorParamPojav;		// funkcije za izvajanje kontrol
  this.generateErrorsSearch = generateErrorsSearchParamPojav;       
  this.equals = nvalEqualsVals;  																		// katerim od navedenih vrednosti ustreza vrednost parametra  
	//DODANO                                                          
	this.toNull = function () {this.nval = null;}
}

// pojav - klima
function ParameterPojavKlima(parent, name, param, mval, bval, pojav1, pojav2, pojav3) {
  ParameterPojav.apply(this, [parent, name, param, mval, bval, pojav1, pojav2, pojav3]);
}

// pojav P65 - klima
function ParameterPojavKlimaK65(parent, name, param, mval, bval, pojav1, pojav2, pojav3) {
  ParameterPojavKlima.apply(this, [parent, name, param, mval, bval, pojav1, pojav2, pojav3]);
  this.values = [0,1,4,5,7]; //this.values = [0,1,3,4,5,7];
	this.generateErrorsBehavior = generateErrorsBehaviorParamPojavKlimaK65;
  this.generateErrorsSearch = generateErrorsSearchParamPojavKlimaK65;
  this.setXval = setXvalK65;	
}

// pojav P66,P67,P68,P69 - klima
function ParameterPojavKlimaK66K69(parent, name, param, mval, bval, pojav1, pojav2, pojav3) {
  ParameterPojavKlima.apply(this, [parent, name, param, mval, bval, pojav1, pojav2, pojav3]);
	this.generateErrorsBehavior = generateErrorsBehaviorParamPojavKlimaK66K69;
  this.generateErrorsSearch = generateErrorsSearchParamPojavKlimaK66K69;  
	this.setXval = setXvalK66K69;
}

// pojav P70 - klima
function ParameterPojavKlimaK70(parent, name, param, mval, bval, pojav1, pojav2, pojav3) {
  ParameterPojavKlima.apply(this, [parent, name, param, mval, bval, pojav1, pojav2, pojav3]);
	this.generateErrorsBehavior = generateErrorsBehaviorParamPojavKlimaK70;
  this.generateErrorsSearch = generateErrorsSearchParamPojavKlimaK70;    
  this.setXval = setXvalK70;
}

// pojav - padavine
function ParameterPojavPadavine(parent, name, param, mval, bval, pojav1, pojav2, pojav3) {
  ParameterPojav.apply(this, [parent, name, param, mval, bval, pojav1, pojav2, pojav3]);
}

//========================================================================//
// MessagesList
//========================================================================//

// seznam sporocil - klima, padavine, sonce
function MessagesList() {
  for (var i = 0; i < arguments.length; i++) {
    var msg = arguments[i].split("=");
    this[msg[0]] = msg[1];
  }
}

//========================================================================//
// Set
//========================================================================//

// dolocanje vrednosti na strezniku - klima, padavine, sonce
function Set(parent, name, val, desc) {
  this.parent = parent;
  this.name = name;
  this.val = val;
  if (desc) this.desc = desc;
  this.toXml = set2xml;  
}

//========================================================================//
// Error
//========================================================================//

// napaka - klima, padavine, sonce
function Error(parent, id, level, parameters, ext) {
  this.parent = parent;
  this.id = id;
  this.level = level;// vedno 0
  if (parameters && parameters.length > 0) this.parameters = parameters;// array
  if (ext) this.ext = ext;
  this.toXml = error2xml;
}

//========================================================================//
// Warning
//========================================================================//

// opozorilo - klima, padavine, sonce
function Warning(parent, id, level, parameters, ext) {
  this.parent = parent;
  this.id = id;
  this.level = level;//0, 1
  if (parameters && parameters.length > 0) this.parameters = parameters;
  if (ext) this.ext = ext;
  this.toXml = warning2xml;
}

//========================================================================//
// generiranje objektov dklima|dpadavine|dsonce
//========================================================================//

// generiranje objektov - klima, padavine, sonce
function generateKlimaPadavineSonce(objname) {
  try {
    eval("var dbobjs = query(createSelectStatement" + objname + "(" + this.postaja + "," + this.tip + ",'" + 
				 this.datumz + "','" + this.datumk + "'))");
		if (parseInt(dbobjs.size()) > 0) {
      var iter = dbobjs.iterator();
      while (iter.hasNext()) {
        var obj = iter.next();        
				var nobj;
				if (objname == "Klima") nobj = generateKlimaDb(this, obj);
				else if (objname == "Padavine") nobj = generatePadavineDb(this, obj);
				else nobj = generateSonceDb(this, obj);
        nobj.status = 0; //star
        this[date2oid(this.name, "" + obj.get("datum"))] = nobj;
      }
    }  
    var current_date = str2date(this.datumz);
    if (objname != "sonce") current_date = getDayBefore(current_date);
    while (1) {    
      if (!this[date2oid(this.name, date2str(current_date))]) {
        var desc = getDescFromPostaje(this.postaje, date2str(current_date));
        if (desc) {        
          var obj = desc; 
          obj.datum = date2str(current_date);
					var nobj;
					if (objname == "Klima") nobj = generateKlimaNew(this, obj);
					else if (objname == "Padavine") nobj = generatePadavineNew(this, obj);
					else nobj = generateSonceNew(this, obj);
          nobj.status = 1; //nov
          this[date2oid(this.name, date2str(current_date))] = nobj;        
        }         
      }
      current_date = getDayAfter(current_date);    
      if (current_date > str2date(this.datumk)) return;
    }
  }
  catch(e) { throw e; }
}

// generiranje in dodajanje praznega objekta s stausom 2 - klima, padavine
function addFirstKlimaPadavine(objname) {
  try {
		if (objname != "Sonce") {
			var first = this.getFirst();
			if (first && str2date(first.datum) >= str2date(this.datumz)) {
				var current_date = getDayBefore(str2date(first.datum));
			  var obj = {"id":"", "idmm":"", "nadm_visina":"", "ge_sirina":"", "ge_dolzina":"", "datum_zacetka":"", "datum_konca":""};
				obj.datum = date2str(current_date);  	
				var nobj = (objname == "Klima")? generateKlimaNew(this, obj) : generatePadavineNew(this, obj);
				nobj.status = 2; //prvi; za ta datum ne obstaja idmm za to postajo+tip
				this[date2oid(this.name, date2str(current_date))] = nobj;
			}
		}
  }
  catch(e) {
    throw e;
  }
}

// generiranje objekta - klima
function generateKlimaDb(obj, data) {
  return new Klima(obj, obj.postaja, obj.tip, data.get("idmm"), "" + data.get("datum"), "" + data.get("ime_vnasalca"), "", 
									 data.get("nadm_visina"), data.get("k5_pritisk_7h"), data.get("k6_pritisk_14h"), data.get("k7_pritisk_21h"), 
									 data.get("k23_inter_tmaks"), data.get("k8_maksimalna_temperatura"), data.get("k24_inter_tmin"), 
									 data.get("k9_minimalna_temperatura"), data.get("k25_inter_tmin5"), data.get("k10_minimalna_temperatura_5cm"), 
									 data.get("k26_inter_ts07"), data.get("k11_temperatura_suhi_7h"), data.get("k27_inter_ts14"), 
									 data.get("k12_temperatura_suhi_14h"), data.get("k28_inter_ts21"), data.get("k13_temperatura_suhi_21h"), 
									 data.get("k29_inter_tm07"), data.get("k14_temperatura_mokri_7h"), data.get("k30_inter_tm14"), 
									 data.get("k15_temperatura_mokri_14h"), data.get("k31_inter_tm21"), data.get("k16_temperatura_mokri_21h"), 
									 data.get("k17_led_7h"), data.get("k18_led_14h"), data.get("k19_led_21h"), data.get("k20_rel_vlaga_7h"), 
									 data.get("k21_rel_vlaga_14h"), data.get("k22_rel_vlaga_21h"), data.get("k33_smer_vetra_7h"), data.get("k35_smer_vetra_14h"), 
									 data.get("k37_smer_vetra_21h"), null, null, null, data.get("k34_hitrost_vetra_7h"), data.get("k36_hitrost_vetra_14h"), 
									 data.get("k38_hitrost_vetra_21h"), data.get("k39_stanje_tal_7h"), data.get("k40_stanje_tal_14h"), 
									 data.get("k41_stanje_tal_21h"), data.get("k42_vidnost_7h"), data.get("k43_vidnost_14h"), data.get("k44_vidnost_21h"), 
									 data.get("k45_trajanje_sonca"), data.get("k46_oblacnost_7h"), data.get("k47_oblacnost_14h"), data.get("k48_oblacnost_21h"), 
									 data.get("k32_inter_padavine"), data.get("k49_padavine"), data.get("k50_oblika_padavin"), data.get("k51_sneg_skupaj"), 
									 data.get("k52_sneg_novi"), data.get("k53_voda_v_snegu"), data.get("k54_dez_rosenje_ploha_dezja"), 
									 data.get("k55_dez_zmrz_rosen_zmrz_iglice"), data.get("k56_sneg_zrnat_sneg_ploha_snega"), 
									 data.get("k57_dez_s_sn_babje_psen_ploh_ds"), data.get("k58_toca_sodra_dim"), data.get("k59_megla_megla_z_vid_neb_led_m"), 
									 data.get("k60_meglic_suha_motnost_talna_m"), data.get("k61_rosa_slana_prsec_z_vodne_p_"), 
									 data.get("k62_poledica_zled_poled__na_tl_"), data.get("k63_ivje_trdo_ivje_elijev_og_"), 
									 data.get("k64_nevihta_grmenje_bliskanje"), data.get("k65_mocan_veter_6bf_8bf"), data.get("k66_snezni_vrtici_tromba_1"), 
									 data.get("k67_prasni_pesceni_vrtinci_2"), data.get("k68_halo_venec_ok_sonca_mavrica"), 
									 data.get("k69_halo_venec_ok_lune_zrcalje"), data.get("k70_snezna_odeja"));  
}

function generateKlimaNew(obj, data) {
	return new Klima(obj, obj.postaja, obj.tip, data.idmm, "" + data.datum, "", "", data.nadm_visina, null, null, null, 0, null, 0, 
									 null, 0, null, 0, null, 0, null, 0, null, 0, null, 0, null, 0, null, null, null, null, null, null, null, null, 
									 null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 
									 null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 
									 null, null, null);
}

// generiranje objekta - padavine
function generatePadavineDb(obj, data) {
  return new Padavine(obj, obj.postaja, obj.tip, data.get("idmm"), "" + data.get("datum"), "" + data.get("ime_vnasalca"), "", 
											data.get("nadm_visina"), data.get("p14_interpolacija"), data.get("p5_padavine"), data.get("p6_oblika"), 
											data.get("p7_sneg_skupaj"), data.get("p8_sneg_novi"), data.get("p9_dez_sneg_dezsneg"), data.get("p10_toca_slana_megla"), 
											data.get("p11_ivje_sodra_bpseno"), data.get("p12_poledica_nevihta_vihveter"), data.get("p13_sneznaodeja_rosa"));
}

function generatePadavineNew(obj, data) {
	return new Padavine(obj, obj.postaja, obj.tip, data.idmm, "" + data.datum, "", "", data.nadm_visina, 0, null, null, null, null, 
											null, null, null, null, null);
}

// generiranje objekta - sonce
function generateSonceDb(obj, data) {
  return new Sonce(obj, obj.postaja, obj.tip, data.get("idmm"), "" + data.get("datum"), "" + data.get("ime_vnasalca"), "", 
									 data.get("ge_dolzina"), data.get("ge_sirina"), data.get("son_interpolacija"), data.get("son_trajanje_04_05"), 
									 data.get("son_trajanje_05_06"), data.get("son_trajanje_06_07"), data.get("son_trajanje_07_08"), 
									 data.get("son_trajanje_08_09"), data.get("son_trajanje_09_10"), data.get("son_trajanje_10_11"), 
									 data.get("son_trajanje_11_12"), data.get("son_trajanje_12_13"), data.get("son_trajanje_13_14"), 
									 data.get("son_trajanje_14_15"), data.get("son_trajanje_15_16"), data.get("son_trajanje_16_17"), 
									 data.get("son_trajanje_17_18"), data.get("son_trajanje_18_19"), data.get("son_trajanje_19_20"));
}

function generateSonceNew(obj, data) {
  return new Sonce(obj, obj.postaja, obj.tip, data.idmm, "" + data.datum, "", "", data.ge_dolzina, data.ge_sirina, 0, 
									 null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
}
//========================================================================//
// generiranje parametrov za dklima|dpadavine|dsonce 
//========================================================================//

// generiranje parametra - klima
function generateKlimaParam(parent, param, bval) {
  var name = param.name.split("_");
  if (name[1] == "inter") {
    if (name[2].substr(0,2) == "tm") return new ParameterKliInterpolacijatmokri(parent, param.name, param.id, param.mval, bval);
    else return new ParameterKliInterpolacija(parent, param.name, param.id, param.mval, bval);    
  }
  else {
    if (name[1] == "pritisk") return new ParameterKliPritisk(parent, param.name, param.id, param.mval, bval);
    else if (name[1] == "maksimalna") return new ParameterKliMaksimalnaTemperatura(parent, param.name, param.id, param.mval, bval);    
    else if (name[1] == "minimalna") {
      if (name.length == 3) return new ParameterKliMinimalnaTemperatura(parent, param.name, param.id, param.mval, bval);
      else return new ParameterKliMinimalnaTemperatura5cm(parent, param.name, param.id, param.mval, bval);
    }
    else if (name[2] == "suhi") return new ParameterKliTemperaturaSuhi(parent, param.name, param.id, param.mval, bval);
    else if (name[2] == "mokri") return new ParameterKliTemperaturaMokri(parent, param.name, param.id, param.mval, bval);
    else if (name[1] == "led") return new ParameterKliLed(parent, param.name, param.id, param.mval, bval);
    else if (name[2] == "vlaga") return new ParameterKliRelVlaga(parent, param.name, param.id, param.mval, bval);    
    else if (name[1] == "smer") return new ParameterKliSmerVetra(parent, param.name, param.id, param.mval, bval);
    else if (name[1] == "jakost") return new ParameterKliJakostVetra(parent, param.name, param.id, param.mval, bval);
    else if (name[1] == "hitrost") return new ParameterKliHitrostVetra(parent, param.name, param.id, param.mval, bval);
    else if (name[1] == "stanje") return new ParameterKliStanjeTal(parent, param.name, param.id, param.mval, bval);
    else if (name[1] == "vidnost") return new ParameterKliVidnost(parent, param.name, param.id, param.mval, bval);
    else if (name[1] == "trajanje") return new ParameterKliTrajanjeSonca(parent, param.name, param.id, param.mval, bval);
    else if (name[1] == "oblacnost") return new ParameterKliOblacnost(parent, param.name, param.id, param.mval, bval);
    else if (name[1] == "padavine") return new ParameterKliPadavine(parent, param.name, param.id, param.mval, bval);
    else if (name[1] == "oblika") return new ParameterKliOblikaPadavin(parent, param.name, param.id, param.mval, bval);
    else if (name[1] == "voda") return new ParameterKliVodaVSnegu(parent, param.name, param.id, param.mval, bval);
    else if (name[1] == "sneg") {
      if (name[2] == "skupaj") return new ParameterKliSnegSkupaj(parent, param.name, param.id, param.mval, bval);
      else return new ParameterKliSnegNovi(parent, param.name, param.id, param.mval, bval);
    }  
  }
}

// generiranje parametra - padavine
function generatePadavineParam(parent, param, bval) {
  var name = param.name.split("_");
  if (name[1] == "interpolacija") return new ParameterPadInterpolacija(parent, param.name, param.id, param.mval, bval);
  else if (name[1] == "padavine") return new ParameterPadPadavine(parent, param.name, param.id, param.mval, bval);
  else if (name[1] == "oblika") return new ParameterPadOblika(parent, param.name, param.id, param.mval, bval);
  else {
    if (name[2] == "skupaj") return new ParameterPadSnegSkupaj(parent, param.name, param.id, param.mval, bval);
    else return new ParameterPadSnegNovi(parent, param.name, param.id, param.mval, bval);
  }  
}

// generiranje parametra - sonce
function generateSonceParam(parent, param, bval) {
  var name = param.name.split("_");
  if (name[1] == "interpolacija") return new ParameterSonInterpolacija(parent, param.name, param.id, param.mval, bval);
  else return new ParameterSonTrajanje(parent, param.name, param.id, param.mval, bval);
}

//========================================================================//
// generiranje pojavov za dklima|dpadavine 
//========================================================================//

// generiranje pojava - klima
function generateKlimaPojav(parent, param, bval) {
  var name = param.name.substr(0,3);
  if (name == "k65") return new ParameterPojavKlimaK65(parent, param.name, param.id, param.mval, bval, param.pojav1, 
																											 param.pojav2, (param.pojav3)? param.pojav3 : null);
  else if (name == "k66" || name == "k67" || name == "k68" || name == "k69") 
		return new ParameterPojavKlimaK66K69(parent, param.name, param.id, param.mval, bval, param.pojav1, 
																				 param.pojav2, (param.pojav3)? param.pojav3 : null);
	else if (name == "k70") return new ParameterPojavKlimaK70(parent, param.name, param.id, param.mval, bval, param.pojav1, 
																														param.pojav2, (param.pojav3)? param.pojav3 : null);
  else return new ParameterPojavKlima(parent, param.name, param.id, param.mval, bval, param.pojav1, 
																			param.pojav2, (param.pojav3)? param.pojav3 : null);
}

// generiranje pojava - padavine
function generatePadavinePojav(parent, param, bval) {
  return new ParameterPojavPadavine(parent, param.name, param.id, param.mval, bval, param.pojav1, 
																		param.pojav2, (param.pojav3)? param.pojav3 : null);
}

//========================================================================//
// postaje 
//========================================================================//

//idmm-ji za izbrano postajo v izbranem obdobju
function generatePostaje(postaja, tip, datumz, datumk) {
  var dbobjs = query(createSelectStatementPostaje(postaja, tip, datumz, datumk));
  var postaje = new Array();
  datumz = date2str(getDayBefore(str2date(datumz)));
  var iter = dbobjs.iterator(); 
  while (iter.hasNext()) {
    var obj = iter.next();    
    var dz = str2date("" + obj.get("datum_zacetka"));
    dz = (dz < str2date(datumz))? datumz : date2str(dz);
    var dk = str2date("" + obj.get("datum_konca"));
    dk = (dk > str2date(datumk))? datumk : date2str(dk);
    postaje[postaje.length] = { "id":obj.get("id"), "idmm":obj.get("idmm"), "nadm_visina":obj.get("nadm_visina"), 
																"ge_sirina":obj.get("ge_sirina"), "ge_dolzina":obj.get("ge_dolzina"), 
		                            "datum_zacetka":dz, "datum_konca":dk };
  }  
  return postaje;
}

function getDescFromPostaje(postaje, date) {
  for (var i = 0; i < postaje.length; i++) 
		if (str2date(postaje[i].datum_zacetka) <= str2date(date) && str2date(postaje[i].datum_konca) >= str2date(date)) 
		return postaje[i];
  return null;
}

function getIdFromPostaje(postaje, idmm, date) {
  for (var i = 0; i < postaje.length; i++) 
		if (parseInt(postaje[i].idmm) == parseInt(idmm) && str2date(postaje[i].datum_zacetka) <= str2date(date) && 
				str2date(postaje[i].datum_konca) >= str2date(date)) return postaje[i].id;
  return null;
}

//========================================================================//
// parametri 
//========================================================================//

//parametri za izbrano postajo v izbranem obdobju
function generateParametri(postaja, tip, datumz, datumk) {
  var dbobjs = query(createSelectStatementParametri(postaja, tip, datumz, datumk));
  var parametri = new Array();
  datumz = date2str(getDayBefore(str2date(datumz)));
  var iter = dbobjs.iterator(); 
  while (iter.hasNext()) {
    var obj = iter.next();    
    var dz = str2date("" + obj.get("datum_zacetka"));
    dz = (dz < str2date(datumz))? datumz : date2str(dz);
    var dk = str2date("" + obj.get("datum_konca"));
    dk = (dk > str2date(datumk))? datumk : date2str(dk);
    parametri[parametri.length] = {"id":obj.get("id"), "id_parametra":obj.get("id_parametra"), "datum_zacetka":dz, "datum_konca":dk};
  }  
  return parametri;
}

function getDescFromParametri(postaje, parametri, idpar, idmm, date) {
  var idp = getIdFromPostaje(postaje, idmm, date);
  for (var i = 0; i < parametri.length; i++) 
    if (parseInt(parametri[i].id) == parseInt(idp) && parseInt(parametri[i].id_parametra) == parseInt(idpar) && 
				str2date(parametri[i].datum_zacetka) <= str2date(date) && str2date(parametri[i].datum_konca) >= str2date(date)) 
			return parametri[i]; 
  return null;
}

//========================================================================//
// funkcije za prvi, zadnji, prejsnji, naslednji element
//========================================================================//

// prvi element ne glede na datum
function getFirst() {
  var date = str2date(this.datumz);
  if (this.name == "klima" || this.name == "padavine") date = getDayBefore(date);
  while (!this[date2oid(this.name, date2str(date))]) {
    date = getDayAfter(date);
    if (date > str2date(this.datumk)) return null;
  }
  return this[date2oid(this.name, date2str(date))];
}

// zadnji element
function getLast() {
  var date = str2date(this.datumk);  
  while (!this[date2oid(this.name, date2str(date))]) {
    date = getDayBefore(date);
    if (date < str2date(this.datumz)) return null;
  }
  return this[date2oid(this.name, date2str(date))];
}

// prejsnji element
function getPrev(obj) {
  var first_date = (obj.parent.name != "sonce")? getDayBefore(str2date(obj.parent.datumz)) : str2date(obj.parent.datumz);  
  var date = getDayBefore(str2date(obj.datum)); 
  while (date >= first_date) {    
    if (this[date2oid(obj.parent.name, date2str(date))]) return this[date2oid(obj.parent.name, date2str(date))];
    else date = getDayBefore(date);
  }
  return null;
} 

//ali obstaja prejsnji
function hasPrev(obj) {
	if (obj.getPrev()) return true;
  return false;
}

// naslednji element
function getNext(obj) {
  var date = getDayAfter(str2date(obj.datum));
	var last_date = str2date(obj.parent.datumk);
  while (date <= last_date) {    
    if (this[date2oid(obj.parent.name, date2str(date))]) return this[date2oid(obj.parent.name, date2str(date))];
		else date = getDayAfter(date);
  }
  return null;
} 

// ali obstaja naslednji
function hasNext(obj) {
	if (obj.getNext()) return true;
  return false;
}

// prejsnji element glede na datum
function getPrevByDate(obj) {
  var date = str2date(obj.datum);
  var prev;
  if (date >= obj.parent.getFirstEditDate()) {
		prev = this[date2oid(obj.parent.name, date2str(getDayBefore(date)))];
		if (prev && prev.status == 2) prev = null;
	}
  else prev = null;	
  return prev;
}

// zadnji datum, ki vsebuje podatke
function getLastDate() {  
  var obj = this.getLast();
  if (obj) {
    var date;
		if (this.insertAll == true) return str2date(obj.datum);
    while(1) {
      date = str2date(obj.datum);
      if (obj.errors_warnings.length == 1 && obj.errors_warnings[0].id == "wrn0" && obj.status == 1) {// nov + prazen
        obj = obj.getPrev();
        if (!obj) { date = getDayBefore(date); break; }
      }
      else break;
    }
    return date;
  }  
  return null;
}
//========================================================================//
// prvi dan, ki se ga lahko editira
//========================================================================//

// prvi dan, v katerem se lahko popravljajo podatki - odvisno od uporabnika
function setFirstEditDate() {
  var firstedit;  
  firstedit = str2date(this.datumz);
  if (role != 1) {
    var newfirstedit = new Date();
    newfirstedit.setMonth(parseInt(newfirstedit.getMonth()) - MONTHS);
    newfirstedit.setDate(1);
    newfirstedit.setDate(parseInt(newfirstedit.getDate()) - 1);
    if (firstedit <= newfirstedit) firstedit = newfirstedit;
  }
  return firstedit;
}

function getFirstEditDate() {
  return this.setFirstEditDate();
}

//========================================================================//
// tranformacije objektov v xml
//========================================================================//

function obj2xml() {//sonce, padavine, klima
  var xmlstr = new java.lang.StringBuffer("");
  xmlstr.append("<" + this.name + " action=''" + " interval='false' id='" + this.id + "' postaja='" + 
								formatNumber(this.postaja) + "' tip='" + formatNumber(this.tip) + "' ime_postaje='" + 
								this.ime_postaje + "' user='" + user + "'>"); // za izpis postaje z vodilnimi niÄŤlami
  var obj = this.getFirst();
  if (obj) {
    while (1) {
      xmlstr.append(obj.toXml());
      if (obj.hasNext()) obj = obj.getNext();
			else break;
    }
  }
  xmlstr.append("</" + this.name + ">");
  return toXml(xmlstr.toString());
}

function kps2xml() {//dsonce, dpadavine, dklima
  var xmlstr = new java.lang.StringBuffer("<" + this.name + " idmm='" + this.idmm + "' oid='" + this.oid + "' datum='" + 
																					((this.status == 2)? '' : this.datum) + "' leto='" + this.leto + "' mesec='" + 
																					this.mesec + "' dan='" + this.dan + "' ");
  if (this.max) xmlstr.append(" max='" + this.max + "'");
  if (this.nadm_visina) xmlstr.append(" nadm_visina='" + parseInt(this.nadm_visina) + "'");
  xmlstr.append(" ime_vnasalca='" + ((this.ime_vnasalca)? this.ime_vnasalca : '') + "'");
  xmlstr.append(" ime_opazovalca='" + ((this.ime_opazovalca)? this.ime_opazovalca : '') + "'");
  xmlstr.append(">");  
  eval("var params = parametri_" + this.parent.name); 
  for (var i = 0; i < params.length; i++) xmlstr.append(this[params[i].name].toXml());
  if (this.parent.name == "padavine" || this.parent.name == "klima") {
    eval("var pojavi = pojavi_" + this.parent.name);
    for (var i = 0; i < pojavi.length; i++) xmlstr.append(this[pojavi[i].name].toXml());
  }
  xmlstr.append("</" + this.name + ">");  
  return xmlstr;
}

function param2xml() {
  var xmlstr = new java.lang.StringBuffer("<" + this.name + " val='" + ((this.val)? this.val : '') + "' edit='" + this.edit() + "'");
	var xmlstr = new java.lang.StringBuffer("<" + this.name + " val='" + ((this.val)? this.val : '') + "' edit='" + this.edit() + "'");
  if (this.min) xmlstr.append(" min='" + ((typeof this.min == "function")? this.min() : this.min) + "'");
  if (this.max) xmlstr.append(" max='" + ((typeof this.max == "function")? this.max() : this.max) + "'");
  xmlstr.append("/>");
  return xmlstr;
}

function paramHitrostVetra2xml() {
  var jakost = this.parent[this.name.replace("hitrost", "jakost")];
  var xmlstr = new java.lang.StringBuffer("<" + this.name + " val='" + ((this.val && !jakost.msr)? this.val : '') + 
																					"' edit='" + this.edit() + "'");
  if (this.min) xmlstr.append(" min='" + ((typeof this.min == "function")? this.min() : this.min) + "'");
  if (this.max) xmlstr.append(" max='" + ((typeof this.max == "function")? this.max() : this.max) + "'");
  xmlstr.append("/>");
  return xmlstr;
}

//========================================================================//
// tranformacije v xml za set, error, warning
//========================================================================//

function set2xml() {
  var xmlstr = new java.lang.StringBuffer("<" + this.name + " datum='" + this.parent.datum + "' val='" + this.val + "'");
  if (this.desc) xmlstr.append(" desc='" + this.desc + "'");
  xmlstr.append("/>");
  return xmlstr.toString();    
}

function error2xml() {
  var xmlstr = new java.lang.StringBuffer("<err id='" + this.id + "' lvl='" + this.level + "' ");
  if (this.ext) xmlstr.append(" ext='" + this.ext + "'");
  xmlstr.append(">");  
  if (this.parameters) {
    for (var i = 0; i < this.parameters.length; i++) {
      xmlstr.append("<" + this.parameters[i].name + " datum='" + this.parameters[i].parent.datum + "'");
      if (this.parameters[i].getClass() == "ParameterPojav") {
        if (i < this.parameters.length - 1 && this.parameters[i + 1] instanceof Number) { 
				  xmlstr.append(" val='" + this.parameters[i + 1] + "'"); 
					i++; 
				}
        else xmlstr.append(" val='" + ((this.parameters[i].nval)? this.parameters[i].nval : '')  + "'");
      }            
      xmlstr.append("/>");      
    } 
  }
  xmlstr.append("</err>");
  return xmlstr.toString();    
}

function warning2xml() {
  var xmlstr = new java.lang.StringBuffer("<warn id='" + this.id + "' lvl='" + this.level + "' ");
  if (this.ext) xmlstr.append(" ext='" + this.ext + "'");
  xmlstr.append(">");  
  if (this.parameters) {
    for (var i = 0; i < this.parameters.length; i++) {
      xmlstr.append("<" + this.parameters[i].name + " datum='" + this.parameters[i].parent.datum + "'");
      if (this.parameters[i].getClass() == "ParameterPojav") {//pojav
        if (i < this.parameters.length - 1 && this.parameters[i + 1] instanceof Number) { 
				  xmlstr.append(" val='" + this.parameters[i + 1] + "'"); 
					i++; 
				}
        else xmlstr.append(" val='" + ((this.parameters[i].nval)? this.parameters[i].nval : '')  + "'");
      }            
      xmlstr.append("/>");      
    } 
  }
  xmlstr.append("</warn>");
  return xmlstr.toString();    
}

//========================================================================//
// tranformacije objektov v xml z napakami in opozorili
//========================================================================//

function obj2errorXml() {
  var xmlstr = new java.lang.StringBuffer("<" + this.name + ">"); // klima|padavine|sonce
  var obj = this.getFirst();
  var xmlstr1 = new java.lang.StringBuffer("");//set
  var xmlstr2 = new java.lang.StringBuffer("");//err
  var xmlstr_;
  while (1) {
    xmlstr_ = obj.toEXml();    
    xmlstr1.append(xmlstr_.sets);
    xmlstr2.append(xmlstr_.msgs);
    if (obj.hasNext()) obj = obj.getNext();
    else break;
  }
  if (("" + xmlstr1.toString()).length > 0) xmlstr.append("<set>" + xmlstr1.toString() + "</set>");
  xmlstr.append(xmlstr2.toString());
  xmlstr.append("</" + this.name + ">");  
  return toXml(xmlstr.toString());
}

function kps2errorXml() {
  var xmlstr1 = "", xmlstr2 = "";
  if (this.sets.length > 0) {
    xmlstr1 = new java.lang.StringBuffer("");
    for (var i = 0; i < this.sets.length; i++) xmlstr1.append(this.sets[i].toXml());
    xmlstr1 = xmlstr1.toString();
  }  
  if (this.errors_warnings.length > 0) { 
    xmlstr2 = new java.lang.StringBuffer("<" + this.name + " datum='" + this.datum + "'>");
    for (var i = 0; i < this.errors_warnings.length; i++) xmlstr2.append(this.errors_warnings[i].toXml());
    xmlstr2.append("</" + this.name + ">");
    xmlstr2 = xmlstr2.toString();
  }
  return {"sets":xmlstr1, "msgs":xmlstr2};
}

//========================================================================//
// validacija objektov
//========================================================================//

// validacija
function validateObj() {
  this.numerrs = 0;
  this.numwarns = 0;
  var obj = this.getFirst();
  while (1) {
    obj.validate();
    this.numerrs += obj.numerrs;
    this.numwarns += obj.numwarns;
    if (obj.hasNext()) obj = obj.getNext();
    else break;
  }  
}

function validateKlimaPadavineSonce() {
  this.numerrs = 0;
  this.numwarns = 0;
  if (str2date(this.datum) >= this.parent.getFirstEditDate()) {
    this.prev = this.getPrevByDate();
    this.generateErrorsSearch();
    this.enableControls();
    this.generateErrorsBehavior();
    this.check_stop = false;  
    for (var i = 0; i < this.controls.length; i++) {
      if (this[this.controls[i]] && this[this.controls[i]].enable) this[this.controls[i]]();
      if (this.check_stop) break;
    }
    this.enableControls();
  }
}

//========================================================================//
// vnos objektov v bazo
//========================================================================//

// vnos v bazo
function insertObj() {
  var insert = new java.lang.StringBuffer(""); 
  var obj = this.getFirst();
	var c, num = 0, mindate = "", maxdate="";
  if (obj) {
    while (1) {
      if (str2date(obj.datum) >= this.getFirstEditDate() && str2date(obj.datum) <= this.lastDate()) {//pregled od prvega datuma, ki se ga lahko popravlja do zadnjega polnega dneva
        if (obj.isChanged()) { 
					if (_TABELE == 2 && parseInt("" + queryInt(obj.count())) > 0) insert.append(obj.update()); // popravek v klima_vhodna,padavine_vhodna,trajanje_vhodna
					else insert.append(obj.insert()); // vnos
					num++;
					if (mindate.length == 0) mindate = obj.datum; 
					maxdate = obj.datum;
				}
      }
      if (obj.hasNext()) obj = obj.getNext();
      else break;
    }
    try { 
			execute(insert.toString());
			if (num > 0) return  { num:num, mindate:str2date(mindate), maxdate:str2date(maxdate) }
			else return { num:num }
		}
    catch (e) { throw e; }
  }
}


//========================================================================//
// popravljanje vrednosti po vnosu v bazo za uskladitev podatkov na klientu in v bazi
//========================================================================//

// popravljanje objekta po vnosu v bazo
function correctObj() {
  var obj = this.getFirst();
  if (obj) {
    while (1) {
      if (str2date(obj.datum) >= this.getFirstEditDate() && str2date(obj.datum) <= this.lastDate() && obj.isChanged()) obj.correct();
      if (obj.hasNext()) obj = obj.getNext();
      else break;
    }
  }
}

function correctKlimaPadavineSonce() {
  if (this.isChanged()) {
    this.status = 0;
    eval("var params = parametri_" + this.parent.name);
    for (var i = 0; i < params.length; i++) if (this[params[i].name].isChanged()) this[params[i].name].correct();
    if (this.parent.name == "padavine" || this.parent.name == "klima") {
      eval("var pojavi = pojavi_" + this.parent.name);
      for (var i = 0; i < pojavi.length; i++) if (this[pojavi[i].name].isChanged()) this[pojavi[i].name].correct();
    }
  }
}

function correctParam() {
  this.bval = this.nval2bval();
  this.val = this.nval;
  this.nval = null;
}

//========================================================================//
// brisanje napak in opozoril
//========================================================================//

//brisanje napak in opozoril
function clearErrorsWarningsObj() {
  var obj = this.getFirst();
  while (1) {
    obj.clearErrorsWarnings();
    if (obj.hasNext()) obj = obj.getNext();
    else break;
  }
}

function clearErrorsWarningsKps() {
  this.sets = [];
  this.errors_warnings = [];
  eval("var params = parametri_" + this.parent.name);
  for (var i = 0; i < params.length; i++) {
    if (this[params[i].name].error) this[params[i].name].error = null;
    if (this[params[i].name].warning) this[params[i].name].warning = null;
  }
  if (this.parent.name == "padavine" || this.parent.name == "klima") {
    eval("var pojavi = pojavi_" + this.parent.name);
    for (var i = 0; i < pojavi.length; i++) {
      if (this[pojavi[i].name].error) this[pojavi[i].name].error = null;
      if (this[pojavi[i].name].warning) this[pojavi[i].name].warning = null;
    }
  }
}

//========================================================================//
// dolocanje polj leto, mesec, dan 
//========================================================================//

function setLetoMesecDan() {
  var datespl = this.datum.split("-");   
  this.leto = getNumber(datespl[0]); 
  this.mesec = getNumber(datespl[1]);
  this.dan = getNumber(datespl[2]);
}

function isDayCorrect() {
	var cdays = [5, 10, 15, 20, 25, this.st_dni];
  for (var i = 0; i < cdays.length; i++) 
		if (this.dan == cdays[i]) return true;
  return false;
}
//========================================================================//
// vkljucevanje in izkljucevanje kontrol 
//========================================================================//

function disableControls() {
  if (!this.disabledControls) this.disabledControls = new Array();
  for (var i = 0; i < arguments.length; i++) {
    if (this[arguments[i]].enable) {
      this[arguments[i]].enable = false;
      this.disabledControls[this.disabledControls.length] = arguments[i];
    }
  }
}

function enableControls() {
  if (this.disabledControls) {
    for (var i = 0; i < this.disabledControls.length; i++) 
			if (!this[this.disabledControls[i]].enable) this[this.disabledControls[i]].enable = true; 
    delete(this.disabledControls);
  }
}

//========================================================================//
// isEmpty 
//========================================================================//

/*
Prazen dan glede na formo:
SONCE: parametri = null, interpolacija = 0
PADAVINE: parametri = null, interpolacija = 0, pojavi = 0
KLIMA: parametri = null, interpolacije = 0, 
 			 pojavi (i <= 11, i == 16) = 0
			 pojavi (i > 11, i < 16, leto < 1991) = 0
			 pojavi (i > 11, i < 16, leto >= 1991) = null
*/
function isEmpty() {
	if (this.status == 2) return false; 																																// preskocimo dan, za katerega ne obstaja idmm 
	if (str2date(this.datum) >= this.parent.getFirstEditDate()) { 																			// preverjamo samo podatke, ki jih lahko vnaĹˇamo (npr. vnasalec lahko vnaĹˇa podatke samo za 3 mesece nazaj: zdaj=junij, vnos=junij, maj, april, marec)
    eval("var params = parametri_" + this.parent.name); 																							// parametri
    for (var i = 0; i < params.length; i++) {                                                         
      if (this[params[i].name].msr && this[params[i].name].edit()) {    															// ÄŤe se parameter meri
        if (params[i].name.search(/inter/i) > -1) {                                  									// interpolacija pri praznih dnevnih je 0
          if (this[params[i].name].nval && parseInt(this[params[i].name].nval) != 0) return false;    
        }                                                                                             
        else if (this[params[i].name].nval) return false;                         										// parameter se meri in obstaja vrednost        
      }                                                                                                     
    }
    if (this.parent.name == "padavine" || this.parent.name == "klima") {// pojavi - samo klima in padavine
      eval("var pojavi = pojavi_" + this.parent.name); // pojavi
      for (var i = 0; i < pojavi.length; i++)
				if (this[pojavi[i].name].msr && this[pojavi[i].name].edit() && this[pojavi[i].name].nval) return false;
    }
    return true;  
  }
  return false;
}

//========================================================================//
// isEqualToPrev 
//========================================================================//

function isEqualToPrev() {
  if (str2date(this.datum) >= this.parent.getFirstEditDate()) { // samo tisti, ki se lahko editirajo
    var prev = this.getPrev(); // predhodni 
    if (prev != null) { // ce prednodni obstaja 
      eval("var params = parametri_" + this.parent.name);   // parametri
      for (var i = 0; i < params.length; i++) {
        if (this[params[i].name].nval != null && prev[params[i].name].nval == null) return false;
        else if (this[params[i].name].nval == null && prev[params[i].name].nval != null ) return false;
        else if (this[params[i].name].nval != null  && prev[params[i].name].nval != null  && 
								 parseInt(this[params[i].name].nval) != parseInt(prev[params[i].name].nval)) return false;
      }
      // pojavi
      if (this.parent.name == "padavine" || this.parent.name == "klima") {
        eval("var pojavi = pojavi_" + this.parent.name);        
        for (var i = 0; i < pojavi.length; i++) {
          if (this[pojavi[i].name].nval != null  && prev[pojavi[i].name].nval == null) return false;
          else if (this[pojavi[i].name].nval == null && prev[pojavi[i].name].nval != null) return false;
          else if (this[pojavi[i].name].nval != null && prev[pojavi[i].name].nval != null && 
									 parseInt(this[pojavi[i].name].nval) != parseInt(prev[pojavi[i].name].nval)) return false;
        }
      }
      return true;
    }
  }
  return false;  
}

//========================================================================//
// dolocanje starih vrednosti
//========================================================================//

function setOldValueObj() {
  var obj = this.getFirst();
  if (obj) {
    while (1) {
      obj.setOldVal();
      if (obj.hasNext()) obj = obj.getNext();
      else break;
    }
  }
}

function setOldValueKps() {
  eval("var params = parametri_" + this.parent.name);
  for (var i = 0; i < params.length; i++) this[params[i].name].setOldVal();
  if (this.parent.name == "padavine" || this.parent.name == "klima") {
    eval("var pojavi = pojavi_" + this.parent.name);
    for (var i = 0; i < pojavi.length; i++) this[pojavi[i].name].setOldVal();
  }
}

function setOldValueParam() {
  this.oval = this.nval; 
}

//========================================================================//
// dolocanje novih vrednosti
//========================================================================//

function setNewValueParam(val) {
	if (this.edit()) {
    var nval = (arguments.length == 1)? new Number(val) : null;
		this.nval = nval;
    this.generateErrorsSearch();
    this.generateErrorsBehavior(); 
    this.isNull();
    this.isInsideLimits();
    this.isAllowed();
  }
  else if (!this.edit() && this.msr) this.nval = (this.val)? parseInt(this.val) : this.val;  //dodano za dneve, ki se ne editirajo
}

function setNewValueParamTmokriLedInterpolacijatmokri(val) {
  var nval = (arguments.length == 1)? new Number(val) : null;
  this.nval = nval;
  if (this.edit()) {
    this.generateErrorsSearch();
    this.generateErrorsBehavior();
    this.isNull();
    this.isInsideLimits();
    this.isAllowed();
  }
}

function setNewValueParamJakostVetra() { 
  if (this.edit()) {
    var nval = (arguments.length == 1)? new Number(arguments[0]) : null;  
    this.nval = nval;
    if (this.msr) this.bfs2ms();
    this.generateErrorsSearch();
    this.generateErrorsBehavior(); 
    this.isNull();
    this.isInsideLimits();
    this.isAllowed();
  }
  if (!this.edit() && this.msr) {   //dodano za dneve, ki se ne editirajo
    this.nval = (this.val)? parseInt(this.val) : this.val;
    if (this.msr) this.bfs2ms();
  }
}

//========================================================================//
// dolocanje vrednosti za prikaz napak na pojavih
//========================================================================//

function setXvalK65(pojav) {
	if (!pojav) pojav = 3;
	if (pojav == 3) {
		if (parseInt(this.nval) == 3 || parseInt(this.nval) == 5 || parseInt(this.nval) == 7) return 3;		
		return parseInt(this.nval);
	}
	else {
		if (parseInt(this.nval) == 5) return 1;
		if (parseInt(this.nval) == 7) return 4;		
		return parseInt(this.nval);
	}
}

function setXvalK66K69() {
  if (parseInt(this.nval) == 0) return 7;
  else return this.nval;
}

function setXvalK70() {
  if (parseInt(this.nval) == 4) return 2;
  if (parseInt(this.nval) == 5) return 3;
  if (parseInt(this.nval) == 7) return 6;
  else return this.nval;
}

//========================================================================//
// stevilo dni v mesecu, prejnji dan, naslednji dan
//========================================================================//

function getNumberOfDays(leto, mesec) {
	if (leto && mesec) {	
		var cal = new GregorianCalendar(parseInt("" + leto), parseInt("" + mesec) - 1, 1);
		return parseInt("" +  cal.getActualMaximum(Calendar.DAY_OF_MONTH));
	}
	return null;
}

function getDayBefore(date) {
  var day = parseInt(date.getDate()) - 1;
  date.setDate(day);
  return date;
}

function getDayAfter(date) {
  var day = parseInt(date.getDate()) + 1;
  date.setDate(day);
  return date;    
}

//========================================================================//
// date2oid, oid2date
//========================================================================//

function date2oid(name, date) {
  var re = /([0-9]{4,5})\-([0-9]{2})\-([0-9]{2})/;
  return ("" + name.substr(0, 3) + date.replace(re, "$1$2$3"));
}

function oid2date(oid) {
  var re1 = /[sonklipad]{3}([0-9]{4})([0-9]{2})([0-9]{2})/;
	var re2 = /[sonklipad]{3}([0-9]{5})([0-9]{2})([0-9]{2})/;
  return (oid.length == 11)? str2date("" + oid.replace(re1, "$1-$2-$3")) : str2date("" + oid.replace(re2, "$1-$2-$3"));
}

//========================================================================//
// transformacija datuma in oid
//========================================================================//

// transformacija datuma: datum --> yyyy-mm-dd
function date2str(date) {	
	if (date.getFullYear() >= 10000) return  "" + SQL_DATE_FORMAT.format(java.util.Date(date.valueOf()));	
	return "" + DATE_FORMAT.format(java.util.Date(date.valueOf()));
}

// transformacija datuma: yyyy-mm-dd --> datum
function str2date(date) {
	var ch = '' + date.charAt(0);
	if ( ch < '0' || ch > '9') return new Date( 10000, 0, 1 );
	return new Date(SQL_DATE_FORMAT.parse(date).getTime());
}

//========================================================================//
// iskanje sprememb vrednosti
//========================================================================//

function isKlimaPadavineSonceChanged() {
  if (this.status == 1) return true; // ce je nov
  eval("var params = parametri_" + this.parent.name);  
  for (var i = 0; i < params.length; i++) if (this[params[i].name].isChanged()) return true; // ce je spremenjena kaksna vrednost
  if (this.parent.name == "padavine" || this.parent.name == "klima") {
    eval("var pojavi = pojavi_" + this.parent.name);
    for (var i = 0; i < pojavi.length; i++) if (this[pojavi[i].name].isChanged()) return true;
  }
  return false;
}

// ali se je spremenila vrednost
function isValueChanged() {
  if (this.edit()) {        
    if (parseInt(this.nval2bval()) == parseInt(this.bval)) return false;
    else return true; // spremenjena vrednost
  }
  return false;
}

function isValueChangedTmokriLedInterpolacijatmokri() {
  if (parseInt(this.nval2bval()) == parseInt(this.bval)) return false;
  else return true; // spremenjena vrednost
}

//========================================================================//
// nval2bval
//========================================================================//

// vrednost, ki gre v bazo
function nval2bvalParam() {
  if (this.edit() && this.msr) {
    if (this.nval) return this.nval; 
    else return this.mval;
  }
  else return this.bval;
}

function nval2bvalParamHitrostVetra() {
  if (this.edit() && this.msr) {
    if (this.nval) return this.nval; 
    else return this.mval;
  }
  else {
    var jakost = this.parent[this.name.replace("hitrost", "jakost")];
    if (jakost.edit() && jakost.msr && this.nval) return this.nval;
    else return this.bval;
  }
}

function nval2bvalParamTmokriLedInterpolacijatmokri() {
  if (this.nval) return this.nval; 
  else return this.mval;
}

//========================================================================//
// ali se parameter meri
//========================================================================//

function isParamMeasured(postaje, parametri, idpar, idmm, date) {
  if (getDescFromParametri(postaje, parametri, idpar, idmm, date)) return true;
  return false;
}

//========================================================================//
// ali se parameter lahko editira
//========================================================================//

function setEdit() {
  if (str2date(this.parent.datum) < this.parent.parent.getFirstEditDate()) return false;
  else return this.msr;      
}

function setEditInterpolacija() {
  if (role == 0 || (str2date(this.parent.datum) < this.parent.parent.getFirstEditDate())) return false;
  else return this.msr;      
}

//========================================================================//
//========================================================================//
