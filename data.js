// ==================================//

// GENERIRANJE PODATKOV  
function selectData(objname) {
  if (kontrolor == 0 && vnasalec == 0) { // uporabnik nima ustrezne vloge, zato nima dostopa do  podatkov 
		sendError(objname, "S tem uporabni\u0161kim imenom nimate dostopa!"); 
		return; 
	}   
	
	var prevTrans =  cocoon.request.getParameter("prev");  // stevilka prejšnje transakcije
	if (transactions && prevTrans) transactions[prevTrans] = null;
	
	var postaja =  cocoon.request.getParameter("postaja");  // stevilka postaje
  if (("" + postaja).length == 0) { sendError(objname, "Napa\u010den url! Manjka \u0161tevilka postaje."); return; }	
	
	var tip = (objname == "klima")? cocoon.request.getParameter("tip") : ((objname == "padavine")? 1 : 14);  // stevilka tipa
  if (objname == "klima" && ("" + tip).length == 0) { 
	  sendError(objname, "Napa\u010den url! Manjka tip postaje."); 
		return; 
	}
	
	var datumz = cocoon.request.getParameter("od");  // zacetek obdobja
  if (("" + datumz).length == 0) { 
		sendError(objname, "Napa\u010den url! Manjka za\u010detek obdobja."); 
		return; 
	}	
	
	var datumk = (cocoon.request.getParameter("do"))? cocoon.request.getParameter("do") : datumz;  // konec obdobja
	
	var ime_postaje;
  try { ime_postaje = checkUrl(objname, postaja, tip, datumz, datumk); } // preverjanje url-a glede na podatke v bazi
  catch(e) { sendError(objname, e); return; }
	
	//podatki
	if (typeof transactions == "undefined") transactions = new Array();
  var current = transactions.length;
  try {
		transactions[current] = new CurrentTransaction(objname.replace(/^[a-z]/, ("" + objname.charAt(0)).toUpperCase()), 
																									 current, getNumber(postaja), ime_postaje, getNumber(tip), datumz, datumk);
    if (transactions[current].postaje.length == 0) { 
		  sendError(objname, "POGOJEM NE USTREZA NOBEN IDMM!"); 
			return; 
		}
  }
  catch(e) { 
	  sendError(objname, createMsgErrorReading(transactions[current].postaja, transactions[current].datumz, transactions[current].datumk, e)); 
		return; 
	}
  // kreiranje xml-a
	var _xml = transactions[current].toXml();            	
  if (kontrolor == 0 && str2date(transactions[current].datumz) < transactions[current].getFirstEditDate()) 
		_xml = addWarning(_xml, "PODATKE ZA DNEVE DO VKLJU\u010cNO " + getInfoDate(transactions[current].getFirstEditDate()) + 
											" LAHKO VNA\u0160A IN POPRAVLJA SAMO KONTROLOR."); 	//opozorilo vnasalcu, da ima omejen dostop do podatkov
	//posiljanje podatkov
  cocoon.response.setHeader("Content-type", "text/xml; charset=UTF-8");
  cocoon.sendPage(objname + "_xml", createDataObj(objname, adaptXml(_xml)));
}

// transformacija xml dokumenta v objekte in dolocanje novih vrednosti
function xml2obj(objname, xml) {
  var output = java.io.ByteArrayOutputStream();
  var pipeutil = cocoon.createObject(Packages.org.apache.cocoon.components.flow.util.PipelineUtil);
	pipeutil.processToStream( objname + "_transform", createDataObj(objname, xml), output);
	return output.toString();
}

// ==================================//

// PREVERJANJE IN VNOS PODATKOV 
function resultData(objname) {
  // transformacija dobljenega xml-a
  var _rez = cocoon.request.getParameter("content");
  if (_debug) print(objname + "_rez: " + _rez);
  try { eval("" + xml2obj(objname, _rez)); }
  catch(e) { sendError(objname, e); return; }
	try { transactions[id].validate(); } //preverjanje podatkov
  catch(e) { 
	  sendError(objname, createMsgErrorValidating(transactions[id].postaja, transactions[id].datumz, transactions[id].datumk, e)); 
		return; 
	}
	transactions[id].setOldVal(); // shranjevanje prebranih vrednosti
  var _xml = transactions[id].toEXml(); // kreiranje xml-a		  
  _xml.getRootElement().addAttribute(new Attribute( "action", transactions[id].action)); // dodajanje atributa action - insert=vnos podatkov, check=preverjanje podatkov
	// vnos v bazo
  if (transactions[id].action == "insert") {
		try {
			var inserted; 
			try { inserted = transactions[id].insert(); }
      catch(e) { throw e; }
			if (inserted) {
        transactions[id].correct();
        _xml = addMessage(_xml, createMsgInputFinished(transactions[id].postaja, transactions[id].datumz, transactions[id].datumk, 
																											 inserted.num, inserted.mindate, inserted.maxdate));
      }
      else _xml = addMessage(_xml, createMsgInputFinished(transactions[id].postaja, transactions[id].datumz, transactions[id].datumk, 0)); 
    }
    catch (e) { 
		  _xml = addMessage(_xml, createMsgErrorWriting(transactions[id].postaja, transactions[id].datumz, transactions[id].datumk, e)); 
		}
  }
	transactions[id].action = null;                               
  transactions[id].clearErrorsWarnings(); // brisanje napak in opozoril
	// posiljanje podatkov
  cocoon.response.setHeader("Content-type", "text/xml; charset=UTF-8");
  cocoon.sendPage(objname + "_xml", createDataObj(objname, adaptXml(_xml)));
}

// ==================================//

//sonce
function sonceSelect() { selectData("sonce"); }
function sonceResult() { resultData("sonce"); }

//padavine
function padavineSelect() { selectData("padavine"); }
function padavineResult() { resultData("padavine"); }
 
//klima
function klimaSelect() { selectData("klima"); }
function klimaResult() { resultData("klima"); }
