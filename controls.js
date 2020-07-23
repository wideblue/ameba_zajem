// ===================================================================//

// opozorilo: manjka vrednost parametra
function generateWarningNull() {
  this.warning = new Warning(this, (this.messages.msg_null)? this.messages.msg_null : "", 0);
}

// opozorilo: manjka vrednost pojava
function generateWarningNullPojav() {
	this.warning = new Warning(this, (this.messages.msg_null)? this.messages.msg_null : "", 0, [(this.pojav3)? new Number(7) : new Number(4)]);
}

// opozorilo: manjka vrednost pojava P65
function generateWarningNullPojavK65() {
	this.warning = new Warning(this, (this.messages.msg_null)? this.messages.msg_null : "", 0, [(this.parent.leto < 1991)? new Number(7) : new Number(4)]);
}

// opozorilo: manjka vrednost pojavov P66, P67, P68, P69
function generateWarningNullPojavK66K69() {
	if (this.parent.leto < 1991) this.warning = new Warning(this, (this.messages.msg_null)? this.messages.msg_null : "", 0, [new Number(7)]);
}

// opozorilo: manjka vrednost pojava P70
function generateWarningNullPojavK70() {
  this.warning = new Warning(this, (this.messages.msg_null)? this.messages.msg_null : "", 0, [(this.parent.leto < 1991)? new Number(7) : new Number(1)]);	
}

// napaka: manjka vrednost parametra ali pojava
function generateErrorNull() {
  this.error = new Error(this, (this.messages.msg_null)? this.messages.msg_null : "", 0);
}

// ===================================================================//

// opozorilo: vrednost parametra je manjsa od dovoljene
function generateWarningMin() {  
	this.warning = new Warning(this, (this.messages.msg_minW)? this.messages.msg_minW : "", 0);
}

// napaka: vrednost parametra je manjsa od dovoljene
function generateErrorMin() {
  this.error = new Error(this, (this.messages.msg_min)? this.messages.msg_min : "", 0);
}

// opozorilo: vrednost parametra je vecja od dovoljene
function generateWarningMax() {
	this.warning = new Warning(this, (this.messages.msg_maxW)? this.messages.msg_maxW : "", 0);
}

// opozorilo: vrednost parametra je vecja od dovoljene, razlicne vrednosti zgornje meje
function generateWarningMax1() {
  this.warning = new Warning(this, (this.messages.msg_maxW1)? this.messages.msg_maxW1 : "", 0);
}

// opozorilo: vrednost parametra je vecja od dovoljene, razlicne vrednosti zgornje meje
function generateWarningMax2() {
  this.warning = new Warning(this, (this.messages.msg_maxW2)? this.messages.msg_maxW2 : "", 0);
}

// napaka: vrednost parametra je vecja od dovoljene
function generateErrorMax() {
  this.error = new Error(this, (this.messages.msg_max)? this.messages.msg_max : "", 0);
}

// ===================================================================//

// napaka: napacna sifra parametra
function generateErrorVals() {
  this.error = new Error(this, (this.messages.msg_vals)? this.messages.msg_vals : "", 0);
}

// napaka: napacna sifra pojava
function generateErrorValsPojav() {
  this.error = new Error(this, (this.messages.msg_vals)? this.messages.msg_vals : "", 0, [(this.pojav3)? new Number(7) : new Number(4)]);
}

// ===================================================================//

// opozorilo: paramatra se od leta 1991 ne meri vec
function generateWarningMeasured() {
	if (this.parent.leto >= 1991) {
		if (this.messages.msg_measured) this.warning = new Warning(this, (this.messages.msg_measured)? this.messages.msg_measured : "", 0, [new Number(this.setXval())]);
  }
}

// ===================================================================//

// opozorilo: prazen dan
function generateWarningEmpty() {
  this.errors_warnings[this.errors_warnings.length] = new Warning(this, (this.messages.msg_empty)? this.messages.msg_empty : "", 0);
  this.numwarns++;
  this.check_stop = true;
}

// ===================================================================//

// opozorilo: dan je enak predhodnemu - sonce
function generateWarningEqualSon() {
  this.errors_warnings[this.errors_warnings.length] = new Warning(this, (this.messages.msg_equal)? this.messages.msg_equal : "", 0);
  this.numwarns++;
  this.check_stop = true;
}

// opozorilo: dan je enak predhodnemu - padavine
function generateWarningEqualPad() {
	if (this.p5_padavine.nval != -1) { 
		this.errors_warnings[this.errors_warnings.length] = new Warning(this, (this.messages.msg_equal)? this.messages.msg_equal : "", 0);
  	this.numwarns++;		
	}
}

// napaka: dan je enak predhodnemu - klima
function generateErrorEqual() {
  this.errors_warnings[this.errors_warnings.length] = new Error(this, (this.messages.msg_equal)? this.messages.msg_equal : "", 0);
  this.numerrs++;
  this.check_stop = true;
}

// ===================================================================//

// generiranje napak - grobe meje
function generateErrorParams(id, level, parameters, ext) {
  this.errors_warnings[this.errors_warnings.length] = new Error(this, id, level, parameters, ext);
  this.numerrs++;
}

// generiranje opozoril - grobe meje
function generateWarningParams(id, level, parameters, ext) {
  this.errors_warnings[this.errors_warnings.length] = new Warning(this, id, level, parameters, ext);
  this.numwarns++;
}

// ===================================================================//

// dolocanje vrednosti parametra na strezniku
function generateSet(name, val, desc) {
  this.sets[this.sets.length] = new Set(this, name, val, desc);
}

// ===================================================================//

// napaka: vsota vrednosti za dan presega dovoljeno mejo - sonce
function generateErrorSum() {
  this.errors_warnings[this.errors_warnings.length] = new Error(this, (this.messages.msg_sum)? this.messages.msg_sum : "", 0, [], "Omejitev je " + this.max + ".");
  this.numerrs++;
  this.check_stop = true;
}

// ===================================================================//

// funkcije za izvajanje kontrol - klima, padavine, sonce
function generateErrorsSearchKlimaPadavineSonce() {
  this.checkIsEmpty = checkIsEmpty;
  this.checkIsEqualToPrev = checkIsEqualToPrev;
  this.checkIsEmpty.enable = true;
  this.checkIsEqualToPrev.enable = true;
}

// funkcije za izvajanje kontrol - sonce
function generateErrorsSearchSonce() {
  this.generateErrorsSearchKlimaPadavineSonce();
  this.checkParams = checkParamsSon;
  this.checkSum = checkSumSonce;
  this.checkParams.enable = true; 
  this.checkSum.enable = true;
}

// funkcije za izvajanje kontrol - klima, padavine
function generateErrorsSearchKlimaPadavine() {
  this.generateErrorsSearchKlimaPadavineSonce();
  this.checkVisinaOblika_params = checkVisinaOblika_params;
  this.checkVisinaPojaviK54K55K56K57K58_ = checkVisinaPojaviK54K55K56K57K58_;
  this.checkVisinaOblika_ = checkVisinaOblika_;
  this.checkSsnegNsneg_ = checkSsnegNsneg_;
  this.checkNsnegVisina_ = checkNsnegVisina_;
  this.checkNsnegOblika_ = checkNsnegOblika_;
  this.checkSsnegNsnegSsnegprev_ = checkSsnegNsnegSsnegprev_;  
  this.checkNsnegOblikaPojaviK55K56K57_ = checkNsnegOblikaPojaviK55K56K57_;
  this.checkVisina0AliNad3PojaviK54K55K56K57K58_ = checkVisina0AliNad3PojaviK54K55K56K57K58_;
  this.checkSsnegPojaviK54K57_ = checkSsnegPojaviK54K57_; //K
  this.checkSsnegPojaviK70_ = checkSsnegPojaviK70_;
  this.checkSsnegPojaviK70K56K57_ = checkSsnegPojaviK70K56K57_;
  this.checkVisinaSsnegSsnegprev_ = checkVisinaSsnegSsnegprev_;
}

// funkcije za izvajanje kontrol - padavine (pomozne funkcije)
function generateErrorsSearchPadavine_() {  
  this.generateErrorsSearchKlimaPadavine();  
  this.hasPojaviK54K55K56K57K58 = hasPojaviK54K55K56K57K58Pad;
  this.checkPojavi = checkPojaviPad;
  this.checkNsnegOblikaPojaviK55K56K57__ = checkNsnegOblikaPojaviK55K56K57Pad_;  
  this.checkOblika1PojaviK54K55K56K57K58 = checkOblika1PojaviK54K55K56K57K58Pad;
  this.checkOblika2PojaviK54K55K56K57K58 = checkOblika2PojaviK54K55K56K57K58Pad;
  this.checkOblika3PojaviK54K55K56K57K58 = checkOblika3PojaviK54K55K56K57K58Pad;
  this.checkOblika4PojaviK54K55K56K57K58 = checkOblika4PojaviK54K55K56K57K58Pad;
  this.checkOblika5PojaviK54K55K56K57K58 = checkOblika5PojaviK54K55K56K57K58Pad;
  this.checkOblika6PojaviK54K55K56K57K58 = checkOblika6PojaviK54K55K56K57K58Pad;
  this.checkOblika7PojaviK54K55K56K57K58 = checkOblika7PojaviK54K55K56K57K58Pad;
  this.checkOblika8PojaviK54K55K56K57K58 = checkOblika8PojaviK54K55K56K57K58Pad;
  this.checkOblika8PojaviK59K60K61K62K63 = checkOblika8PojaviK59K60K61K62K63Pad;
  this.checkSsnegPojaviK54K57__ = checkSsnegPojaviK54K57Pad_;
  this.checkSsnegPojaviK70K56K57__ = checkSsnegPojaviK70K56K57Pad_;  
  this.checkSsnegNsneg_params = checkSsnegNsneg_params;  
}

// funkcije za izvajanje kontrol - padavine
function generateErrorsSearchPadavine() {  
  this.generateErrorsSearchKlimaPadavine();
  this.generateErrorsSearch_();  
  this.checkParams = checkParamsPad;
  this.checkVisinaPojaviK54K55K56K57K58 = checkVisinaPojaviK54K55K56K57K58Pad;
  this.checkVisinaOblika = checkVisinaOblikaPad;   
  this.checkSsnegNsneg = checkSsnegNsnegPad;
  this.checkNsnegVisina = checkNsnegVisinaPad;
  this.checkNsnegOblika = checkNsnegOblikaPad;  
  this.checkSsnegNsnegSsnegprev = checkSsnegNsnegSsnegprevPad;
  this.checkNsnegOblikaPojaviK55K56K57 = checkNsnegOblikaPojaviK55K56K57Pad;
  this.checkOblikaPojaviK54K55K56K57K58 = checkOblikaPojaviK54K55K56K57K58Pad;
  this.checkOblikaPojaviK59K60K61K62K63 = checkOblikaPojaviK59K60K61K62K63Pad;
  this.checkVisina0AliNad3PojaviK54K55K56K57K58 = checkVisina0AliNad3PojaviK54K55K56K57K58Pad;
  this.checkSsnegPojaviK54K57 = checkSsnegPojaviK54K57Pad; 
  this.checkSsnegPojaviK70 = checkSsnegPojaviK70Pad;
  this.checkSsnegPojaviK70K56K57 = checkSsnegPojaviK70K56K57Pad;
  this.checkVisinaSsnegSsnegprev = checkVisinaSsnegSsnegprevPad;
	this.checkPojaviK70K56K57 = checkPojaviK70K56K57Pad;
  this.enableErrorsSearch();
}

// funkcije za izvajanje kontrol - klima (pomozne funkcije)
function generateErrorsSearchKlima_() {
  this.generateErrorsSearchKlimaPadavine();  
  this.checkPritiskRazlikaTermin_ = checkPritiskRazlikaTermin_;
  this.checkPritiskRazlikaTendenca_ = checkPritiskRazlikaTendenca_;
  this.checkTsuhiTmin_ = checkTsuhiTmin_;
  this.checkTsuhiTmax_ = checkTsuhiTmax_;
  this.checkLedTmokri_params = checkLedTmokri_params;
  this.checkLedTmokriTsuhi_ = checkLedTmokriTsuhi_;
  this.checkTmokriTsuhiDeficit_ = checkTmokriTsuhiDeficit_;
  this.checkTmokriTsuhiSpremembe_ = checkTmokriTsuhiSpremembe_;
  this.checkLed0Tmokri_ = checkLed0Tmokri_;
  this.checkLed1Tmokri_ = checkLed1Tmokri_;
  this.checkRelVlagaPsihro_ = checkRelVlagaPsihro_;
  this.checkRelVlagaPsihroRelVlagaHigro_ = checkRelVlagaPsihroRelVlagaHigro_;
  this.checkSmerHitrostVetra_ = checkSmerHitrostVetra_;
  this.checkSmerJakostVetra_ = checkSmerJakostVetra_;
  this.checkTlaZaporedniTermini_ = checkTlaZaporedniTermini_;
  this.hasPojaviK54K55K56K57K58 = hasPojaviK54K55K56K57K58Kli;
  this.checkPojavi = checkPojaviKli;  
  this.checkNsnegOblikaPojaviK55K56K57__ = checkNsnegOblikaPojaviK55K56K57Kli_;    
  this.checkSsnegNsnegVoda_params = checkSsnegNsnegVoda_params;
  this.checkOblika1PojaviK54K55K56K57K58 = checkOblika1PojaviK54K55K56K57K58Kli;
  this.checkOblika2PojaviK54K55K56K57K58 = checkOblika2PojaviK54K55K56K57K58Kli;
  this.checkOblika3PojaviK54K55K56K57K58 = checkOblika3PojaviK54K55K56K57K58Kli;
  this.checkOblika4PojaviK54K55K56K57K58 = checkOblika4PojaviK54K55K56K57K58Kli;
  this.checkOblika5PojaviK54K55K56K57K58 = checkOblika5PojaviK54K55K56K57K58Kli;
  this.checkOblika6PojaviK54K55K56K57K58 = checkOblika6PojaviK54K55K56K57K58Kli;
  this.checkOblika7PojaviK54K55K56K57K58 = checkOblika7PojaviK54K55K56K57K58Kli;
  this.checkOblika8PojaviK54K55K56K57K58 = checkOblika8PojaviK54K55K56K57K58Kli;
  this.checkOblika8PojaviK59K60K61K62K63 = checkOblika8PojaviK59K60K61K62K63Kli; 
  this.checkSsnegPojaviK54K57__ = checkSsnegPojaviK54K57Kli_;
  this.checkSsnegPojaviK70K56K57__ = checkSsnegPojaviK70K56K57Kli_;
  this.checkPritiskVodnePare_ = checkPritiskVodnePare_;	
}

// funkcije za izvajanje kontrol - klima
function generateErrorsSearchKlima() {
  this.generateErrorsSearchKlimaPadavine();
  this.generateErrorsSearch_();  
  this.checkParams_ = checkParamsKli_;
  this.checkParams = checkParamsKli;  
  this.checkPritisk = checkPritisk;
  this.checkTmaxT21Prev = checkTmaxT21Prev;
  this.checkTminT21Prev = checkTminT21Prev;
  this.checkTmin5T21Prev = checkTmin5T21Prev;
  this.checkTmin5Tmin = checkTmin5Tmin;
  this.checkTminTmax = checkTminTmax;
  this.checkTsuhiTminTmax = checkTsuhiTminTmax;  
  this.checkTmaxTerminske = checkTmaxTerminske;
  this.checkTminTerminske = checkTminTerminske;
  this.checkLedTmokriTsuhi = checkLedTmokriTsuhi;
  this.checkTmokriTsuhiDeficit = checkTmokriTsuhiDeficit;
  this.checkTmokriTsuhiSpremembe = checkTmokriTsuhiSpremembe;
  this.checkLed0Tmokri = checkLed0Tmokri;
  this.checkLed1Tmokri = checkLed1Tmokri;
  this.checkSonceOblacnost = checkSonceOblacnost;
  this.checkRelVlagaPsihro = checkRelVlagaPsihro;
  this.checkRelVlagaPsihroRelVlagaHigro = checkRelVlagaPsihroRelVlagaHigro;
  this.checkSmerHitrostVetra = checkSmerHitrostVetra;
  this.checkSmerJakostVetra = checkSmerJakostVetra;
  this.checkTlaTsuhi7 = checkTlaTsuhi7;
  this.checkTlaTsuhi14 = checkTlaTsuhi14;
  this.checkTlaTsuhi21 = checkTlaTsuhi21;
  this.checkTlaZaporedniTermini = checkTlaZaporedniTermini;
  this.checkVisinaPojaviK54K55K56K57K58 = checkVisinaPojaviK54K55K56K57K58Kli;
  this.checkVisinaOblika = checkVisinaOblikaKli;   
  this.checkSsnegTla7 = checkSsnegTla7;  
  this.checkSsnegNsneg = checkSsnegNsnegKli;
  this.checkNsnegVisina = checkNsnegVisinaKli;
  this.checkNsnegVisinaTminTmaxPrev = checkNsnegVisinaTminTmaxPrev;
  this.checkNsnegOblika = checkNsnegOblikaKli;
  this.checkSsnegNsnegSsnegprev = checkSsnegNsnegSsnegprevKli;  
  this.checkSsnegVoda = checkSsnegVoda;
  this.checkTmaxPojaviK54K58 = checkTmaxPojaviK54K58;
  this.checkPojaviK55K56K57TminPrevisoka = checkPojaviK55K56K57TminPrevisoka;
  this.checkNsnegOblikaPojaviK55K56K57 = checkNsnegOblikaPojaviK55K56K57Kli;
  this.checkOblikaPojaviK54K55K56K57K58 = checkOblikaPojaviK54K55K56K57K58Kli;
  this.checkOblikaPojaviK59K60K61K62K63 = checkOblikaPojaviK59K60K61K62K63Kli;  
  this.checkPojaviK55K56K57TminPrenizka = checkPojaviK55K56K57TminPrenizka;  
  this.checkVisina0AliNad3PojaviK54K55K56K57K58 = checkVisina0AliNad3PojaviK54K55K56K57K58Kli;
  this.checkSsnegPojaviK54K57 = checkSsnegPojaviK54K57Kli;  
  this.checkVidnostPojaviK54K56K57K59 = checkVidnostPojaviK54K56K57K59;
  this.checkVidnostPojaviK54K56K57K60 = checkVidnostPojaviK54K56K57K60;
  this.checkTlaTsuhi7Tmin5PojaviK61 = checkTlaTsuhi7Tmin5PojaviK61;
  this.checkTminTmin5PojaviK61 = checkTminTmin5PojaviK61;
  this.checkTminTmin5PojaviK62 = checkTminTmin5PojaviK62;
  this.checkTlaPojaviK62 = checkTlaPojaviK62;    
  this.checkTminPojaviK59K63 = checkTminPojaviK59K63;
  this.checkTminTmin5PojaviK59K63 = checkTminTmin5PojaviK59K63;
  this.checkTminPojaviK59K63K65 = checkTminPojaviK59K63K65;
  this.checkHitrostPod108PojavVetraPrevec = checkHitrostPod108PojavVetraPrevec;
  this.checkJakostPod6PojavVetraPrevec = checkJakostPod6PojavVetraPrevec;
  this.checkHitrostNad108PojavVetraPremalo = checkHitrostNad108PojavVetraPremalo;
  this.checkJakostNad6PojavVetraPremalo = checkJakostNad6PojavVetraPremalo;  
  this.checkSsnegPojaviK70 = checkSsnegPojaviK70Kli;
  this.checkSsnegPojaviK70K56K57 = checkSsnegPojaviK70K56K57Kli;
  this.checkTlaPojaviK70 = checkTlaPojaviK70;
  this.checkTmin5TminRazlikaJasnaOblacnaNoc = checkTmin5TminRazlikaJasnaOblacnaNoc;
  this.checkTmin5Terminske = checkTmin5Terminske;
  this.checkTmin5Tsuhi7NsnegPojaviK59 = checkTmin5Tsuhi7NsnegPojaviK59;
  this.checkPritiskVodnePare = checkPritiskVodnePare;
  this.checkVisinaSsnegSsnegprev = checkVisinaSsnegSsnegprevKli;
  this.checkTsuhi7Tmin = checkTsuhi7Tmin;
  this.checkTsuhi14Tmax = checkTsuhi14Tmax;
	this.checkPojaviK70K56K57 = checkPojaviK70K56K57Kli;	
  this.enableErrorsSearch();
}

// funkcije za izvajanje kontrol za parameter - klima, padavine, sonce
function generateErrorsSearchParam() {
  this.isNull = isNull;
  this.isAllowed = isAllowed;
  this.isInsideLimits = isInsideLimits;
}

// funkcije za izvajanje kontrol za pojav - klima, padavine
function generateErrorsSearchParamPojav() {
  this.isNull = isNull;
  this.isAllowed = isAllowed;
  this.isInsideLimits = isInsideLimits;
}

// funkcije za izvajanje kontrol za pojav K65 - klima
function generateErrorsSearchParamPojavKlimaK65() {
  this.isNull = isNull;
  this.isAllowed = isAllowedK65;
  this.isInsideLimits = isInsideLimits;
}

// funkcije za izvajanje kontrol za pojave K66, K67, K68, K69 - klima
function generateErrorsSearchParamPojavKlimaK66K69() {
  this.isNull = isNull;
  this.isAllowed = isAllowedK66K69;
  this.isInsideLimits = isInsideLimits;
}

// funkcije za izvajanje kontrol za pojav K70 - klima
function generateErrorsSearchParamPojavKlimaK70() {
  this.isNull = isNull;
  this.isAllowed = isAllowedK70;
  this.isInsideLimits = isInsideLimits;
}

// ===================================================================//

// dolocanje napak in opozoril - sonce
function generateErrorsBehaviorSonce() {
  this.set_msg_empty = generateWarningEmpty;
  this.set_msg_equal = generateWarningEqualSon;
  this.set_err_params = generateErrorParams;
  this.set_warn_params = generateWarningParams;
  this.set_msg_sum = generateErrorSum;
  this.set_set = generateSet;
}

// dolocanje napak in opozoril - padavine
function generateErrorsBehaviorPadavine() {
  this.set_msg_empty = generateWarningEmpty;
  this.set_msg_equal = generateWarningEqualPad;
  this.set_err_params = generateErrorParams;
  this.set_warn_params = generateWarningParams;
  this.set_set = generateSet;  
}

// dolocanje napak in opozoril - klima
function generateErrorsBehaviorKlima() {
  this.set_msg_empty = generateWarningEmpty;
  this.set_msg_equal = generateErrorEqual;
  this.set_err_params = generateErrorParams;
  this.set_warn_params = generateWarningParams;
  this.set_set = generateSet;
}

// dolocanje napak in opozoril za parameter - klima, padavine, sonce
function generateErrorsBehaviorParam() {
  this.set_msg_null = generateWarningNull;
  this.set_msg_min = generateErrorMin;
  this.set_msg_minW = generateWarningMin;
  this.set_msg_max = generateErrorMax;
  this.set_msg_maxW = generateWarningMax;
  this.set_msg_vals = generateErrorVals;   
}

// dolocanje napak in opozoril za pojav - klima, padavine
function generateErrorsBehaviorParamPojav() {
  this.set_msg_null = generateWarningNullPojav;
  this.set_msg_vals = generateErrorValsPojav;
}

// dolocanje napak in opozoril za pojav K65 - klima
function generateErrorsBehaviorParamPojavKlimaK65() {
  this.set_msg_null = generateWarningNullPojavK65;
  this.set_msg_vals = generateErrorValsPojav;
  this.set_msg_measured = generateWarningMeasured;
}

// dolocanje napak in opozoril za pojave K66, K67, K68, K69 - klima
function generateErrorsBehaviorParamPojavKlimaK66K69() {
  this.set_msg_null = generateWarningNullPojavK66K69;
  this.set_msg_vals = generateErrorValsPojav;
  this.set_msg_measured = generateWarningMeasured;
}

// dolocanje napak in opozoril za pojave K70 - klima
function generateErrorsBehaviorParamPojavKlimaK70() {
  this.set_msg_null = generateWarningNullPojavK70;
  this.set_msg_min = generateErrorMin;
  this.set_msg_minW = generateWarningMin;
	this.set_msg_max = generateErrorMax;
  this.set_msg_maxW = generateWarningMax;
  this.set_msg_vals = generateErrorValsPojav;
  this.set_msg_measured = generateWarningMeasured;
}

// dolocanje napak in opozoril za parametra visina, ss - klima, padavine
function generateErrorsBehaviorParamVisinaPadavinSnegSkupaj() {
  this.set_msg_null = generateWarningNull;
  this.set_msg_min = generateErrorMin;
  this.set_msg_max = generateWarningMax;
  this.set_msg_vals = generateErrorVals;
}

// dolocanje napak in opozoril za parametre jakost, hitrost - klima
function generateErrorsBehaviorParamJakostHitrostVetra() {  
  this.set_msg_null = generateWarningNull;
  this.set_msg_min = generateErrorMin;
  this.set_msg_maxW = (this.parent.postaja == 3 || this.parent.postaja == 48 || this.parent.postaja == 437)? generateWarningMax2 : generateWarningMax1;
  this.set_msg_vals = generateErrorVals;
}

// ===================================================================//

// dolocanje izvajanja kontrolo glede na uporabnika - padavine (klima)
function enableErrorsSearchPadavine() {  
  this.checkParams.enable = true;
  this.checkVisinaPojaviK54K55K56K57K58.enable = true;
  this.checkVisinaOblika.enable = true;   
  this.checkSsnegNsneg.enable = true;  
  this.checkNsnegVisina.enable = true;  
  this.checkNsnegOblika.enable = true;  
  this.checkSsnegNsnegSsnegprev.enable = true;
  this.checkNsnegOblikaPojaviK55K56K57.enable = true;
  this.checkOblikaPojaviK54K55K56K57K58.enable = true;
  this.checkOblikaPojaviK59K60K61K62K63.enable = true;  
  this.checkVisina0AliNad3PojaviK54K55K56K57K58.enable = true;
  this.checkSsnegPojaviK54K57.enable = (role == 1)? true : false;
  this.checkSsnegPojaviK70.enable = true;
  this.checkSsnegPojaviK70K56K57.enable = true;  
  this.checkVisinaSsnegSsnegprev.enable = true;
	this.checkPojaviK70K56K57.enable = true;
}

// dolocanje izvajanja kontrolo glede na uporabnika - klima
function enableErrorsSearchKlima() {  
  this.enableErrorsSearchPadavine();
  this.checkPritisk.enable = (role == 1)? true : false;
  this.checkTmaxT21Prev.enable = true;
  this.checkTminT21Prev.enable = true;
  this.checkTmin5T21Prev.enable = true;
  this.checkTmin5Tmin.enable = (role == 1)? true : false;
  this.checkTminTmax.enable = true;
  this.checkTsuhiTminTmax.enable = true;
  this.checkTmaxTerminske.enable = (role == 1)? true : false;
  this.checkTminTerminske.enable = (role == 1)? true : false;
  this.checkLedTmokriTsuhi.enable = true;
  this.checkTmokriTsuhiDeficit.enable = (role == 1)? true : false;
  this.checkTmokriTsuhiSpremembe.enable = (role == 1)? true : false;
  this.checkLed0Tmokri.enable = (role == 1)? true : false;
  this.checkLed1Tmokri.enable = true;
  this.checkSonceOblacnost.enable = true;
  this.checkRelVlagaPsihro.enable = true;
  this.checkRelVlagaPsihroRelVlagaHigro.enable = (role == 1)? true : false;
  this.checkSmerHitrostVetra.enable = true;
  this.checkSmerJakostVetra.enable = true;
  this.checkTlaTsuhi7.enable = (role == 1)? true : false;
  this.checkTlaTsuhi14.enable = (role == 1)? true : false;
  this.checkTlaTsuhi21.enable = (role == 1)? true : false;
  this.checkTlaZaporedniTermini.enable = (role == 1)? true : false;
  this.checkSsnegTla7.enable = true;  
  this.checkNsnegVisinaTminTmaxPrev.enable = (role == 1)? true : false;
  this.checkSsnegVoda.enable = true;
  this.checkTmaxPojaviK54K58.enable = (role == 1)? true : false;
  this.checkPojaviK55K56K57TminPrevisoka.enable = true;
  this.checkPojaviK55K56K57TminPrenizka.enable = (role == 1)? true : false;
  this.checkVidnostPojaviK54K56K57K59.enable = (role == 1)? true : false;
  this.checkVidnostPojaviK54K56K57K60.enable = (role == 1)? true : false;
  this.checkTlaTsuhi7Tmin5PojaviK61.enable = (role == 1)? true : false;
  this.checkTminTmin5PojaviK61.enable = (role == 1)? true : false;
  this.checkTminTmin5PojaviK62.enable = (role == 1)? true : false;
  this.checkTlaPojaviK62.enable = true;    
  this.checkTminPojaviK59K63.enable = (role == 1)? true : false;
  this.checkTminTmin5PojaviK59K63.enable = (role == 1)? true : false;
  this.checkTminPojaviK59K63K65.enable = (role == 1)? true : false;
  this.checkHitrostPod108PojavVetraPrevec.enable = (role == 1)? true : false;
  this.checkJakostPod6PojavVetraPrevec.enable = (role == 1)? true : false;
  this.checkHitrostNad108PojavVetraPremalo.enable = true;
  this.checkJakostNad6PojavVetraPremalo.enable = true;  
  this.checkTlaPojaviK70.enable = true;
  this.checkTmin5TminRazlikaJasnaOblacnaNoc.enable = (role == 1)? true : false;
  this.checkTmin5Terminske.enable = (role == 1)? true : false;
  this.checkTmin5Tsuhi7NsnegPojaviK59.enable = (role == 1)? true : false;
  this.checkPritiskVodnePare.enable = (role == 1)? true : false;  
  this.checkVisinaSsnegSsnegprev.enable = true;
  this.checkTsuhi7Tmin.enable = true;
  this.checkTsuhi14Tmax.enable = true;
	this.checkPojaviK70K56K57.enable = true;
}

// ===================================================================//

// preveri, ce obstaja vrednost - klima, padavine, sonce
function isNull() {
  if (!this.nval) this.set_msg_null();
}

// ===================================================================//

// preveri, ce je vrednost pravilno sifrirana - klima, padavine, sonce
function isAllowed() {
  if (this.nval && this.values) {
    for (var i = 0; i < this.values.length; i++) if (this.nval == this.values[i]) break;
    if (i == this.values.length) this.set_msg_vals();
  }
}

// preveri, ce je vrednost pravilno sifrirana - klima, pojav K65
function isAllowedK65() {
  if (this.nval && this.values) {
    for (var i = 0; i < this.values.length; i++) if (parseInt(this.nval) == parseInt(this.values[i])) break;
    if (i == this.values.length) this.set_msg_vals();
    else if (parseInt(this.nval) == 3 || parseInt(this.nval) == 5 || parseInt(this.nval) == 7) this.set_msg_measured();
  }
}

// preveri, ce je vrednost pravilno sifrirana - klima, pojavi K66, K67, K68, K69
function isAllowedK66K69() {
  if (this.nval && this.values) {
    for (var i = 0; i < this.values.length; i++) if (parseInt(this.nval) == parseInt(this.values[i])) break;
    if (i == this.values.length) this.set_msg_vals();
    else if (parseInt(this.nval) >= 0) this.set_msg_measured(); 
  }
}

// preveri, ce je vrednost pravilno sifrirana - klima, pojav K70
function isAllowedK70() {
  if (this.nval && this.values) {
    for (var i = 0; i < this.values.length; i++) if (parseInt(this.nval) == parseInt(this.values[i])) break;
    if (i == this.values.length) this.set_msg_vals();
    else if (parseInt(this.nval) > 1) this.set_msg_measured();
  }
}

// ===================================================================//

// preveri, ce je vrednost znotraj dovoljenih mej - klima, padavine, sonce
function isInsideLimits() {
  if (this.nval && this.min) {
    var min = (typeof this.min == "function")? parseInt(this.min()) : parseInt(this.min);
    if (this.nval < min) this.set_msg_min(); 
  }        
  if (this.nval && this.max) {
    var max = (typeof this.max == "function")? parseInt(this.max()) : parseInt(this.max);
    if (this.nval > max) this.set_msg_max(); 
  }
}

// ===================================================================//

// preveri, ce je dan prazen - klima, padavine, sonce
function checkIsEmpty() {
  if (this.isEmpty()) this.set_msg_empty();
}

// ===================================================================//

// preveri, ce je dan enak predhodnemu - klima, padavine, sonce
function checkIsEqualToPrev() {
  if (this.isEqualToPrev()) this.set_msg_equal();
}

// ===================================================================//

// preverjanje grobih mej za parametra visina, oblika + kontrole 85,77 - klima, padavine
function checkVisinaOblika_params(visina, oblika) {
  if (visina.nval && oblika.nval || !visina.nval && !oblika.nval || visina.nval && !oblika.nval) {
    if (visina.error) this.set_err_params(visina.error.id, 0, [visina], visina.min + "," + visina.max);
    if (visina.warning) this.set_warn_params(visina.warning.id, 0, [visina]);
    if (visina.nval && !oblika.nval && !visina.error) this.set_err_params(this.messages.msg_visina_85, 0, [visina, oblika]);
  }
  if (visina.nval && oblika.nval || !visina.nval && !oblika.nval || !visina.nval && oblika.nval) {
    if (oblika.error) this.set_err_params(oblika.error.id, 0, [oblika]);
    if (oblika.warning) this.set_warn_params(oblika.warning.id, 0, [oblika]);
    if (!visina.nval && oblika.nval && !oblika.error) this.set_err_params(this.messages.msg_visina_77, 0, [visina, oblika]);
  }
  if (visina.error || oblika.error) this.disableControls("checkVisinaOblika");
  if (visina.error) this.disableControls("checkVisinaPojaviK54K55K56K57K58", "checkNsnegVisina", "checkVisina0AliNad3PojaviK54K55K56K57K58");
  if (oblika.error) this.disableControls("checkNsnegOblika", "checkNsnegOblikaPojaviK55K56K57", "checkOblikaPojaviK54K55K56K57K58", "checkOblikaPojaviK59K60K61K62K63");      
}

// ===================================================================//

// preverjanje grobih mej za parametra tmokri, led + kontrole 38,38A,39,39A,40,41 - klima
function checkLedTmokri_params(tmokri, led, interpolacija, tsuhi, rh, pritisk, msg1, msg2) {
  this.setTmokri(tmokri, led, interpolacija, tsuhi, rh, pritisk);
  if (tmokri.msr && tmokri.edit()) {
    if (tmokri.nval && led.nval || !tmokri.nval && !led.nval) {// sta obe vrednosti ali ni nobene vrednosti
      if (tmokri.warning) this.set_warn_params(tmokri.warning.id, 0, [tmokri]);
      if (tmokri.error) this.set_err_params(tmokri.error.id, 0, [tmokri], tmokri.min + ", " + tmokri.max);
      if (led.error) this.set_err_params(led.error.id, 0, [led]);
      if (led.warning) this.set_warn_params(led.warning.id, 0, [led]);
    }
    else if (!tmokri.nval && led.nval) {
      if (!tmokri.nval && led.nval && !led.error) this.set_err_params(msg1, 0, [tmokri, led]);
      if (led.error) this.set_err_params(led.error.id, 0, [led]);
      if (led.warning) this.set_warn_params(led.warning.id, 0, [led]);
    }
    else if (tmokri.nval && !led.nval) {
      if (tmokri.nval && !led.nval && !tmokri.error) this.set_err_params(msg2, 0, [tmokri, led]);
      if (tmokri.error) this.set_err_params(tmokri.error.id, 0, [tmokri], tmokri.min + ", " + tmokri.max);
      if (tmokri.warning) this.set_warn_params(tmokri.warning.id, 0, [tmokri]);
    }
    if (tmokri.error || led.error) this.disableControls("checkLedTmokriTsuhi", "checkLed0Tmokri", "checkLed1Tmokri", "checkRelVlagaPsihro", "checkRelVlagaPsihroRelVlagaHigro", "checkPritiskVodnePare");
    if (tmokri.error) this.disableControls("checkTmokriTsuhiDeficit", "checkTmokriTsuhiSpremembe");
  }
}

// ===================================================================//

// preverjanje grobih mej za parametra ss, sn + kontrole 154,155 - padavine
function checkSsnegNsneg_params(ss, sn) {	
  if (ss.error) this.set_err_params(ss.error.id, 0, [ss], ss.min + "," + ss.max);
  if (sn.error) this.set_err_params(sn.error.id, 0, [sn], sn.min + "," + sn.max); 
  if (ss.edit() && ss.msr && sn.edit() && sn.msr) {
    if (ss.nval && sn.nval || !ss.nval && !sn.nval) {// oba sta ali obeh ni
      if (ss.warning) this.set_warn_params(ss.warning.id, 0, [ss]);
      if (sn.warning) this.set_warn_params(sn.warning.id, 0, [sn]);
    }    
    else {// en manjka
      if (!ss.nval && sn.nval && !sn.error) {
        if (sn.warning) this.set_warn_params(sn.warning.id, 0, [sn]);
        this.set_err_params(this.messages.msg_ss_154, 0, [ss, sn]);
      }
      if (ss.nval && !sn.nval && !ss.error) {
        if (ss.warning) this.set_warn_params(ss.warning.id, 0, [ss]);
        this.set_err_params(this.messages.msg_sn_155, 0, [ss, sn]);
      }
    }
  }
  else {
    if (ss.warning) this.set_warn_params(ss.warning.id, 0, [ss]);
    if (sn.warning) this.set_warn_params(sn.warning.id, 0, [sn]);
  }    
  if (ss.error || sn.error) this.disableControls("checkSsnegNsneg", "checkSsnegNsnegSsnegprev");
  if (ss.error) this.disableControls("checkSsnegPojaviK54K57", "checkSsnegPojaviK70", "checkSsnegPojaviK70K56K57");
  if (sn.error) this.disableControls("checkNsnegVisina", "checkNsnegOblika", "checkNsnegOblikaPojaviK55K56K57");      
} 

// preverjanje grobih mej za parametre ss, sn, voda + kontrole 154,155,156,157 - klima
function checkSsnegNsnegVoda_params(ss, sn, voda) {
  if (ss.error) this.set_err_params(ss.error.id, 0, [ss], ss.min + "," + ss.max);
  if (sn.error) this.set_err_params(sn.error.id, 0, [sn], sn.min + "," + sn.max);  
  if (voda.error) this.set_err_params(voda.error.id, 0, [voda]);
  if (ss.edit() && ss.msr) {// ss se meri
    if (sn.edit() && sn.msr && voda.edit() && voda.msr) {// sn in voda se merita
      if (!ss.nval && !sn.nval && !voda.nval || ss.nval && sn.nval && voda.nval) {// vsi trije manjkajo ali vsi trije so
        if (ss.warning) this.set_warn_params(ss.warning.id, 0, [ss]);
        if (sn.warning) this.set_warn_params(sn.warning.id, 0, [sn]);
        if (voda.warning) this.set_warn_params(voda.warning.id, 0, [voda]);
      }
      else {// vsaj en manjka
        if (ss.nval) {// ss obstaja
          if (!ss.error) {
            if (ss.warning) this.set_warn_params(ss.warning.id, 0, [ss]);
            if (sn.nval && !voda.nval && !sn.error) {// voda manjka
              if (sn.warning) this.set_warn_params(sn.warning.id, 0, [sn]);
              this.set_err_params(this.messages.msg_ss_156, 0, [ss, voda]);           
            }
            if (!sn.nval && voda.nval && !voda.error) {// sn manjka
              if (voda.warning) this.set_warn_params(voda.warning.id, 0, [voda]);
              this.set_err_params(this.messages.msg_sn_155, 0, [ss, sn]);
            }
            if (!sn.nval && !voda.nval) {// sn in voda mnajkata
              if (!sn.error) this.set_err_params(this.messages.msg_sn_155, 0, [ss, sn]); 
              if (!voda.error) this.set_err_params(this.messages.msg_ss_156, 0, [ss, voda]);              
            }          
          }
        }
        else {// ss manjka
          if (sn.nval && !voda.nval && !sn.error) {//sn obstaja 
            if (sn.warning) this.set_warn_params(sn.warning.id, 0, [sn]);
            this.set_err_params(this.messages.msg_ss_154, 0, [ss, sn]);
          }
          if (!sn.nval && voda.nval && !voda.error) {//voda obstaja
            if (voda.warning) this.set_warn_params(voda.warning.id, 0, [voda]);
            this.set_err_params(this.messages.msg_voda_157, 0, [ss, voda]);
          }
          if (sn.nval && voda.nval) {// sn in voda obstajata
            if (!sn.error) this.set_err_params(this.messages.msg_ss_154, 0, [ss, sn]);
            if (!voda.error) this.set_err_params(this.messages.msg_voda_157, 0, [ss, voda]);
          }
        }
      }
    }   
    else {// vsaj en od sn in vode se ne meri
      if (sn.edit() && sn.msr) {// sn se meri
        if (!ss.nval && !sn.nval || ss.nval && sn.nval) {//oba sta ali obeh ni 
          if (ss.warning) this.set_warn_params(ss.warning.id, 0, [ss]);
          if (sn.warning) this.set_warn_params(sn.warning.id, 0, [sn]);
        }
        if (ss.nval && !sn.nval && !ss.error) {
          if (ss.warning) this.set_warn_params(ss.warning.id, 0, [ss]);
          this.set_err_params(this.messages.msg_sn_155, 0, [ss, sn]);
        }
        if (!ss.nval && sn.nval && !sn.error) {
          if (sn.warning) this.set_warn_params(sn.warning.id, 0, [sn]);
          this.set_err_params(this.messages.msg_ss_154, 0, [ss, sn]);
        }
      }
      if (voda.edit() && voda.msr) {
        if (!ss.nval && !voda.nval || ss.nval && voda.nval) {//oba sta ali obeh ni 
          if (ss.warning) this.set_warn_params(ss.warning.id, 0, [ss]);
          if (voda.warning) this.set_warn_params(voda.warning.id, 0, [voda]);
        }
        if (ss.nval && !voda.nval && !ss.error) {
          if (ss.warning) this.set_warn_params(ss.warning.id, 0, [ss]);
          this.set_err_params(this.messages.msg_ss_156, 0, [ss, voda]);
        }
        if (!ss.nval && voda.nval && !voda.error) {
          if (voda.warning) this.set_warn_params(voda.warning.id, 0, [voda]);
          this.set_err_params(this.messages.msg_voda_157, 0, [ss, voda]);
        }
      }
    }
  }
  else {
    if (sn.warning) this.set_warn_params(sn.warning.id, 0, [sn]);  
    if (voda.warning) this.set_warn_params(voda.warning.id, 0, [voda]);  
  }
  if (ss.error || sn.error) this.disableControls("checkSsnegNsneg", "checkSsnegNsnegSsnegprev");
  if (ss.error || voda.error) this.disableControls("checkSsnegVoda");
  if (ss.error) this.disableControls("checkSsnegTla7", "checkSsnegPojaviK54K57", "checkSsnegPojaviK70", "checkSsnegPojaviK70K56K57", "checkTmin5TminRazlikaJasnaOblacnaNoc");
  if (sn.error) this.disableControls("checkNsnegVisina", "checkNsnegOblika", "checkNsnegOblikaPojaviK55K56K57", "checkTmin5Tsuhi7NsnegPojaviK59");
}

// ===================================================================//

// preverjanje grobih mej pojavov - padavine
// indeksi: p9 (0), p10 (1), p11 (2), p12 (3), p14 (4)
function checkPojaviPad() {
  var pojavi=pojavi_padavine;
  for (var i = 0; i < pojavi.length; i++) {
    if (this[pojavi[i].name].error) {
			var ext = "\u0161ifra: " + this[pojavi[i].name].nval;
      if (this[pojavi[i].name].error.parameters) this.set_err_params(this[pojavi[i].name].error.id, 0, [this[pojavi[i].name], this[pojavi[i].name].error.parameters[0]], ext);
      else this.set_err_params(this[pojavi[i].name].error.id, 0, [this[pojavi[i].name]], ext);
      if (i == 0) this.disableControls("checkVisinaPojaviK54K55K56K57K58", "checkOblikaPojaviK54K55K56K57K58", "checkSsnegPojaviK54K57", "checkNsnegOblikaPojaviK55K56K57", "checkVisina0AliNad3PojaviK54K55K56K57K58","checkSsnegPojaviK70K56K57", "checkPojaviK70K56K57");
      if (i == 1) this.disableControls("checkVisinaPojaviK54K55K56K57K58", "checkOblikaPojaviK54K55K56K57K58", "checkVisina0AliNad3PojaviK54K55K56K57K58", "checkOblikaPojaviK59K60K61K62K63"); 
      if (i == 2) this.disableControls("checkVisinaPojaviK54K55K56K57K58", "checkOblikaPojaviK54K55K56K57K58", "checkNsnegOblikaPojaviK55K56K57", "checkSsnegPojaviK70K56K57", "checkVisina0AliNad3PojaviK54K55K56K57K58", "checkOblikaPojaviK59K60K61K62K63");
      if (i == 3) this.disableControls("checkOblikaPojaviK59K60K61K62K63");
      if (i == 4) this.disableControls("checkOblikaPojaviK59K60K61K62K63", "checkSsnegPojaviK70", "checkSsnegPojaviK70K56K57", "checkPojaviK70K56K57");      
    }
    if (this[pojavi[i].name].warning) {			
			//var ext = pojavi[i].pojav1 + "," + pojavi[i].pojav2 + ((pojavi[i].pojav3)? "," + pojavi[i].pojav3 : "");
      if (this[pojavi[i].name].warning.parameters) this.set_warn_params(this[pojavi[i].name].warning.id, 0, [this[pojavi[i].name], this[pojavi[i].name].warning.parameters[0]]);
      else this.set_warn_params(this[pojavi[i].name].warning.id, 0, [this[pojavi[i].name]]);
    }
  }
}

// preverjanje grobih mej pojavov - klima
// indeksi: k54 (0), k55 (1), k56 (2), k57 (3), k58 (4), k59 (5), k61 (7), k62 (8), k63 (9), k65 (11), k70 (16)
function checkPojaviKli() {
  var pojavi=pojavi_klima;
  for (var i = 0; i < pojavi.length; i++) {
    if (this[pojavi[i].name].error) {
			var ext = "\u0161ifra: " + this[pojavi[i].name].nval;
      if (this[pojavi[i].name].error.parameters) this.set_err_params(this[pojavi[i].name].error.id, 0, [this[pojavi[i].name], this[pojavi[i].name].error.parameters[0]], ext);
      else this.set_err_params(this[pojavi[i].name].error.id, 0, [this[pojavi[i].name]], ext);       
			if (i == 0) this.disableControls("checkVidnostPojaviK54K56K57K60", "checkTmaxPojaviK54K58", "checkVisinaPojaviK54K55K56K57K58", "checkOblikaPojaviK54K55K56K57K58", "checkVisina0AliNad3PojaviK54K55K56K57K58", "checkVidnostPojaviK54K56K57K59", "checkSsnegPojaviK54K57");
			if (i == 1) this.disableControls("checkPojaviK55K56K57TminPrevisoka", "checkNsnegOblikaPojaviK55K56K57", "checkPojaviK55K56K57TminPrenizka", "checkVisinaPojaviK54K55K56K57K58", "checkOblikaPojaviK54K55K56K57K58", "checkVisina0AliNad3PojaviK54K55K56K57K58");
      if (i == 2) this.disableControls("checkVidnostPojaviK54K56K57K60", "checkSsnegPojaviK70K56K57", "checkPojaviK55K56K57TminPrevisoka", "checkNsnegOblikaPojaviK55K56K57", "checkPojaviK55K56K57TminPrenizka", "checkVisinaPojaviK54K55K56K57K58", "checkVisina0AliNad3PojaviK54K55K56K57K58", "checkVidnostPojaviK54K56K57K59", "checkOblikaPojaviK54K55K56K57K58", "checkPojaviK70K56K57");
			if (i == 3) this.disableControls("checkVidnostPojaviK54K56K57K60", "checkSsnegPojaviK70K56K57", "checkPojaviK55K56K57TminPrevisoka", "checkNsnegOblikaPojaviK55K56K57", "checkPojaviK55K56K57TminPrenizka", "checkVisinaPojaviK54K55K56K57K58", "checkOblikaPojaviK54K55K56K57K58", "checkSsnegPojaviK54K57", "checkVidnostPojaviK54K56K57K59", "checkVisina0AliNad3PojaviK54K55K56K57K58", "checkPojaviK70K56K57");      
			if (i == 4) this.disableControls("checkTmaxPojaviK54K58", "checkVisinaPojaviK54K55K56K57K58", "checkOblikaPojaviK54K55K56K57K58", "checkVidnostPojaviK54K56K57K59", "checkVisina0AliNad3PojaviK54K55K56K57K58");            
			if (i == 5) this.disableControls("checkTminPojaviK59K63K65", "checkTminPojaviK59K63", "checkTminTmin5PojaviK59K63", "checkTmin5Tsuhi7NsnegPojaviK59", "checkOblikaPojaviK59K60K61K62K63", "checkVidnostPojaviK54K56K57K60");      
			if (i == 7) this.disableControls("checkTlaTsuhi7Tmin5PojaviK61", "checkTminTmin5PojaviK61", "checkOblikaPojaviK59K60K61K62K63");      
			if (i == 8) this.disableControls("checkTminTmin5PojaviK62", "checkTlaPojaviK62", "checkOblikaPojaviK59K60K61K62K63");      
			if (i == 9) this.disableControls("checkTminPojaviK59K63K65", "checkTminPojaviK59K63", "checkTminTmin5PojaviK59K63", "checkOblikaPojaviK59K60K61K62K63");      
			if (i == 11) this.disableControls("checkTminPojaviK59K63K65", "checkHitrostPod108PojavVetraPrevec", "checkJakostPod6PojavVetraPrevec", "checkHitrostNad108PojavVetraPremalo", "checkJakostNad6PojavVetraPremalo");      
			if (i == 16) this.disableControls("checkSsnegPojaviK70", "checkSsnegPojaviK70K56K57", "checkTlaPojaviK70", "checkPojaviK70K56K57");
    }
    if (this[pojavi[i].name].warning) {
			//var ext = pojavi[i].pojav1 + "," + pojavi[i].pojav2 + ((pojavi[i].pojav3)? "," + pojavi[i].pojav3 : "");
      if (this[pojavi[i].name].warning.parameters) this.set_warn_params(this[pojavi[i].name].warning.id, 0, [this[pojavi[i].name], this[pojavi[i].name].warning.parameters[0]]);
      else this.set_warn_params(this[pojavi[i].name].warning.id, 0, [this[pojavi[i].name]]);
    }
  }
}

// ===================================================================//

// preverjanje grobih mej parametrov - sonce
// indeksi: interpolcija (0), trajanje po urah (1 - 15) 
function checkParamsSon() {
  for (var i = 1; i < parametri_sonce.length; i++) {
    if (this[parametri_sonce[i].name].error) {
      this.set_err_params(this[parametri_sonce[i].name].error.id, 0, [this[parametri_sonce[i].name]], "0, " + this[parametri_sonce[i].name].max());
      this.disableControls("checkSum");
    }
    if (this[parametri_sonce[i].name].warning) this.set_warn_params(this[parametri_sonce[i].name].warning.id, 0, [this[parametri_sonce[i].name]]);
  }
  if (this[parametri_sonce[0].name].error) this.set_err_params(this[parametri_sonce[0].name].error.id, 0, [this[parametri_sonce[0].name]]);
  if (this[parametri_sonce[0].name].warning) this.set_warn_params(this[parametri_sonce[0].name].warning.id, 0, [this[parametri_sonce[0].name]]);
}

// preverjanje grobih mej parametrov  in pojavov - padavine
function checkParamsPad() {
  this.checkVisinaOblika_params(this.p5_padavine, this.p6_oblika);
  this.checkSsnegNsneg_params(this.p7_sneg_skupaj, this.p8_sneg_novi);
  this.checkPojavi();
  if (this.p14_interpolacija.error) this.set_err_params(this.p14_interpolacija.error.id, 0, [this.p14_interpolacija]);
  if (this.p14_interpolacija.warning) this.set_warn_params(this.p14_interpolacija.warning.id, 0, [this.p14_interpolacija]);
}

// preverjanje grobih mej parametrov - klima
// indeksi: pritisk (0,1,2), tmax (4), tmin (6), tmin5 (8), tsuhi (10,12,14), led (22,23,24), smer vetra (27,28,29), jakost vetra (30,31,32), hitrost vetra (33,34,35), tla (36,37,38), vidnost (39,40,41), sonce(42), oblacnost (43,44,45)
function checkParamsKli_() {
  var args = arguments;
  var ext;
  for (var i = 0; i < args.length; i++) {
    if (this[parametri_klima[args[i]].name].error) {
      if (args[i] < 3) ext = this[parametri_klima[args[i]].name].min() + ", "+ this[parametri_klima[args[i]].name].max();
      else if (args[i] > 3 && args[i] < 15 && args[i] % 2 == 0) ext = this[parametri_klima[args[i]].name].min + ", "+ this[parametri_klima[args[i]].name].max;
      else if (args[i] == 42) ext = this[parametri_klima[args[i]].name].max();
			else if (args[i] == 27 || args[i] == 28 || args[i] == 29 || args[i] == 39 || args[i] == 40 || args[i] == 41) ext = "\u0161ifra: " + this[parametri_klima[args[i]].name].nval;
			else ext = "";     
      if (ext.length > 0) this.set_err_params(this[parametri_klima[args[i]].name].error.id, 0, [this[parametri_klima[args[i]].name]], ext);
      else this.set_err_params(this[parametri_klima[args[i]].name].error.id, 0, [this[parametri_klima[args[i]].name]]);
			if (args[i] < 3) this.disableControls("checkRelVlagaPsihroRelVlagaHigro", "checkRelVlagaPsihro", "checkPritiskVodnePare", "checkPritisk");      
			if (args[i] == 4) this.disableControls("checkTsuhiTminTmax", "checkTmaxTerminske", "checkTminTmax", "checkTsuhi14Tmax", "checkTmaxT21Prev", "checkTmaxPojaviK54K58");      
			if (args[i] == 6) this.disableControls("checkTsuhiTminTmax", "checkTminTerminske", "checkTminTmax", "checkTsuhi7Tmin", "checkTminT21Prev", "checkPojaviK55K56K57TminPrenizka", "checkTminPojaviK59K63", "checkTmin5TminRazlikaJasnaOblacnaNoc", "checkTmin5Tmin", "checkTminTmin5PojaviK61", "checkTminTmin5PojaviK62", "checkTminTmin5PojaviK59K63", "checkTminPojaviK59K63K65");
			if (args[i] == 8) this.disableControls("checkTmin5TminRazlikaJasnaOblacnaNoc", "checkTmin5Tmin", "checkTminTmin5PojaviK61", "checkTminTmin5PojaviK62", "checkTmin5T21Prev", "checkTminTmin5PojaviK59K63", "checkTlaTsuhi7Tmin5PojaviK61", "checkTmin5Terminske", "checkTmin5Tsuhi7NsnegPojaviK59");
			if (args[i] == 10) this.disableControls("checkRelVlagaPsihroRelVlagaHigro", "checkRelVlagaPsihro", "checkPritiskVodnePare", "checkTsuhiTminTmax", "checkTmaxTerminske", "checkTminTerminske", "checkLedTmokriTsuhi", "checkTmokriTsuhiDeficit", "checkTmokriTsuhiSpremembe", "checkTsuhi7Tmin", "checkTlaTsuhi7Tmin5PojaviK61", "checkTmin5Terminske", "checkTmin5Tsuhi7NsnegPojaviK59", "checkTlaTsuhi7");
			if (args[i] == 12) this.disableControls("checkRelVlagaPsihroRelVlagaHigro", "checkRelVlagaPsihro", "checkPritiskVodnePare", "checkTsuhiTminTmax", "checkTmaxTerminske", "checkTminTerminske", "checkLedTmokriTsuhi", "checkTmokriTsuhiDeficit", "checkTmokriTsuhiSpremembe", "checkTsuhi14Tmax", "checkTlaTsuhi14"); 
			if (args[i] == 14) this.disableControls("checkRelVlagaPsihroRelVlagaHigro", "checkRelVlagaPsihro", "checkPritiskVodnePare", "checkTsuhiTminTmax", "checkTmaxTerminske", "checkTminTerminske", "checkLedTmokriTsuhi", "checkTmokriTsuhiDeficit", "checkTmokriTsuhiSpremembe", "checkTlaTsuhi7Tmin5PojaviK61", "checkTlaTsuhi21"); 
			if (args[i] == 22 || args[i] == 23 || args[i] == 24) this.disableControls("checkRelVlagaPsihroRelVlagaHigro");
			if (args[i] == 27 || args[i] == 28 || args[i] == 29) this.disableControls("checkSmerJakostVetra", "checkSmerHitrostVetra"); 
      if (args[i] == 30 || args[i] == 31 || args[i] == 32) this.disableControls("checkTminPojaviK59K63K65", "checkSmerJakostVetra", "checkJakostPod6PojavVetraPrevec", "checkJakostNad6PojavVetraPremalo");
      if (args[i] == 33 || args[i] == 34 || args[i] == 35) this.disableControls("checkTminPojaviK59K63K65", "checkSmerHitrostVetra", "checkHitrostPod108PojavVetraPrevec", "checkHitrostNad108PojavVetraPremalo");
      if (args[i] == 36) this.disableControls("checkSsnegTla7", "checkTlaTsuhi7Tmin5PojaviK61", "checkTlaTsuhi7", "checkTlaZaporedniTermini", "checkTlaPojaviK62", "checkTlaPojaviK70"); // tla17
			if (args[i] == 37) this.disableControls("checkTlaTsuhi14", "checkTlaZaporedniTermini", "checkTlaPojaviK62", "checkTlaPojaviK70"); //tla14
			if (args[i] == 38) this.disableControls("checkTlaTsuhi7Tmin5PojaviK61", "checkTlaTsuhi21", "checkTlaZaporedniTermini", "checkTlaPojaviK62", "checkTlaPojaviK70"); //tla21
      if (args[i] == 39 || args[i] == 40 || args[i] == 41) this.disableControls("checkVidnostPojaviK54K56K57K59", "checkVidnostPojaviK54K56K57K60"); //vidnost
			if (args[i] == 42 || args[i] == 44 || args[i] == 45) this.disableControls("checkSonceOblacnost");
      if (args[i] == 43) this.disableControls("checkTmin5TminRazlikaJasnaOblacnaNoc", "checkSonceOblacnost");
    }
    if (this[parametri_klima[args[i]].name].warning) this.set_warn_params(this[parametri_klima[args[i]].name].warning.id, 0, [this[parametri_klima[args[i]].name]]);
  }
}

// preverjanje grobih mej parametrov in pojavov + vrstni red izvajanja kontrol - klima
function checkParamsKli() {
  this.checkParams_(0, 1, 2, 4, 3, 8, 7, 6, 5, 10, 9, 12, 11, 14, 13);
  this.checkLedTmokri_params(this.k14_temperatura_mokri_7h, this.k17_led_7h, this.k29_inter_tm07, this.k11_temperatura_suhi_7h, this.k20_rel_vlaga_7h, this.k5_pritisk_7h, this.messages.msg_led_38, this.messages.msg_led_38A);
  this.checkParams_(15);                                               
  this.checkLedTmokri_params(this.k15_temperatura_mokri_14h, this.k18_led_14h, this.k30_inter_tm14, this.k12_temperatura_suhi_14h, this.k21_rel_vlaga_14h, this.k6_pritisk_14h, this.messages.msg_led_39, this.messages.msg_led_39A);
  this.checkParams_(17);  
  this.checkLedTmokri_params(this.k16_temperatura_mokri_21h, this.k19_led_21h, this.k31_inter_tm21, this.k13_temperatura_suhi_21h, this.k22_rel_vlaga_21h, this.k7_pritisk_21h, this.messages.msg_led_40, this.messages.msg_led_41);  
  this.checkParams_(19, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 43, 44, 45, 42);
  this.checkVisinaOblika_params(this.k49_padavine, this.k50_oblika_padavin);
  this.checkParams_(46);
  this.checkSsnegNsnegVoda_params(this.k51_sneg_skupaj, this.k52_sneg_novi, this.k53_voda_v_snegu); 
  this.checkPojavi();
}

//========================================================================//

// preveri, ali vsota vrednost za ta dan presega dovoljeno mejo - sonce
function checkSumSonce() {
  if (this.numerrs == 0) {
    var sum = 0;
    for (var i = 1; i < parametri_sonce.length; i++) if (this[parametri_sonce[i].name].nval) sum += parseInt(this[parametri_sonce[i].name].nval);
    if (sum > parseInt(this.max)) this.set_msg_sum();
  }
}

// ===================================================================//

// preveri, ali je šifra pojava enaka kateri od navedenih vrednosti - klima, padavine 
function nvalEqualsVals() {  
  for (var i = 0; i < arguments.length; i++) 
		if ("" + this.nval == "" + arguments[i]) return true; //if (parseInt("" + this.nval) == parseInt("" + arguments[i])) return true;
  return false;
}

// ===================================================================//

// kontrola 82 - klima, padavine (pomozna funkcija)
function checkVisinaPojaviK54K55K56K57K58_(visina1, visina2, params) {
	if (visina1.msr && visina2.msr && (!visina1.nval || parseInt(visina1.nval) == -1) && (!visina2.nval || parseInt(visina2.nval) == -1)) 
		this.set_err_params(this.messages.msg_visina_E82, 0, params);		
  else if ((!visina1.msr && visina2.msr && (!visina2.nval || parseInt(visina2.nval) == -1)) || (visina1.msr && !visina2.msr && (!visina1.nval || parseInt(visina1.nval) == -1)) || !visina1.msr && !visina2.msr) 
		this.set_warn_params(this.messages.msg_visina_W82, 0, params);
}

// kontrola 82 - padavine
function checkVisinaPojaviK54K55K56K57K58Pad() {
  if (this.prev && !this.prev.p9_dez_sneg_dezsneg.error && !this.prev.p10_toca_slana_megla.error && !this.prev.p11_ivje_sodra_bpseno.error && !this.prev.p5_padavine.error) {
		var params = [this.prev.p9_dez_sneg_dezsneg, this.prev.p10_toca_slana_megla, this.prev.p11_ivje_sodra_bpseno, this.prev.p5_padavine, this.p5_padavine];
		if (!this.prev.hasPojaviK54K55K56K57K58) this.prev.hasPojaviK54K55K56K57K58 = hasPojaviK54K55K56K57K58Pad;
		if (this.prev.hasPojaviK54K55K56K57K58()) this.checkVisinaPojaviK54K55K56K57K58_(this.prev.p5_padavine, this.p5_padavine, params);
  }
}

// kontrola 82 - klima
function checkVisinaPojaviK54K55K56K57K58Kli() {
  if (this.prev && !this.prev.k54_dez_rosenje_ploha_dezja.error && !this.prev.k55_dez_zmrz_rosen_zmrz_iglice.error && !this.prev.k56_sneg_zrnat_sneg_ploha_snega.error && !this.prev.k57_dez_s_sn_babje_psen_ploh_ds.error && !this.prev.k58_toca_sodra_dim.error && !this.prev.k49_padavine.error) {
		var params = [this.prev.k54_dez_rosenje_ploha_dezja, this.prev.k55_dez_zmrz_rosen_zmrz_iglice, this.prev.k56_sneg_zrnat_sneg_ploha_snega, this.prev.k57_dez_s_sn_babje_psen_ploh_ds, this.prev.k58_toca_sodra_dim, this.prev.k49_padavine, this.k49_padavine];
    if (!this.prev.hasPojaviK54K55K56K57K58) this.prev.hasPojaviK54K55K56K57K58 = hasPojaviK54K55K56K57K58Kli;
    if (this.prev.hasPojaviK54K55K56K57K58()) this.checkVisinaPojaviK54K55K56K57K58_(this.prev.k49_padavine, this.k49_padavine, params);
  }
}

// ===================================================================//

// atmosferski pojavi - padavine
function hasPojaviK54K55K56K57K58Pad() {
  if (!this.p9_dez_sneg_dezsneg.equals(null, 0)) return true;
  if (this.p10_toca_slana_megla.equals(1, 4, 5, 7)) return true;
  if (!this.p11_ivje_sodra_bpseno.equals(null, 0, 1)) return true;
	return false;
}

// atmosferski pojavi - klima
function hasPojaviK54K55K56K57K58Kli() {
  if (!this.k54_dez_rosenje_ploha_dezja.equals(null, 0)) return true;
  if (!this.k55_dez_zmrz_rosen_zmrz_iglice.equals(null, 0)) return true;
  if (!this.k56_sneg_zrnat_sneg_ploha_snega.equals(null, 0)) return true;
  if (!this.k57_dez_s_sn_babje_psen_ploh_ds.equals(null, 0)) return true;
  if (!this.k58_toca_sodra_dim.equals(null, 0, 3)) return true;
  return false;
}

// ===================================================================//

// kontrole 83,84,85A,120 - klima, padavine (pomozna funkcija)
function checkVisinaOblika_(visina, oblika, msg1, msg2, msg3, msg4) {
  if (visina.nval && oblika.nval) {
    if (visina.nval > 0 && (oblika.nval < 1 || oblika.nval > 8)) this.set_err_params(msg1, 0, [visina, oblika]);
    if (visina.nval == 0 && oblika.nval != 9) this.set_err_params(msg2, 0, [visina, oblika]);
    if (visina.nval == -1 && oblika.nval != -1) this.set_err_params(msg3, 0, [visina, oblika]);
    if (oblika.nval == 8 && (visina.nval < 1 || visina.nval > 3)) this.set_err_params(msg4, 0, [visina, oblika]);
  } 
}

// kontrole 83,84,85A,120 - padavine
function checkVisinaOblikaPad() {
  this.checkVisinaOblika_(this.p5_padavine, this.p6_oblika, this.messages.msg_visina_83, this.messages.msg_visina_84, this.messages.msg_visina_85A, this.messages.msg_visina_120);
}

// kontrole 83,84,85A,120 - klima
function checkVisinaOblikaKli() {
 this.checkVisinaOblika_(this.k49_padavine, this.k50_oblika_padavin, this.messages.msg_visina_83, this.messages.msg_visina_84, this.messages.msg_visina_85A, this.messages.msg_visina_120);
}

// ===================================================================//

// kontrola 88 - klima, padavine (pomozna funkcija)
function checkSsnegNsneg_(ss, sn, msg) {
  if (ss.nval && sn.nval && ss.nval < sn.nval) this.set_err_params(this.messages.msg_ss_88, 0, [ss, sn]);
}

// kontrola 88 - padavine
function checkSsnegNsnegPad() {
  this.checkSsnegNsneg_(this.p7_sneg_skupaj, this.p8_sneg_novi);  
}

// kontrola 88 - klima
function checkSsnegNsnegKli() {
  this.checkSsnegNsneg_(this.k51_sneg_skupaj, this.k52_sneg_novi);  
}

// ===================================================================//

// kontrola 89 - klima, padavine (pomozna funkcija)
function checkNsnegVisina_(sn, visina) {
  if (sn.nval && visina.nval && sn.nval >= 0 && visina.nval == -1) this.set_err_params(this.messages.msg_sn_89, 0, [sn, visina]);
}

// kontrola 89 - padavine
function checkNsnegVisinaPad() {
  this.checkNsnegVisina_(this.p8_sneg_novi, this.p5_padavine);
}

// kontrola 89 - klima
function checkNsnegVisinaKli() {
  this.checkNsnegVisina_(this.k52_sneg_novi, this.k49_padavine);
}

// ===================================================================//

// kontrole 91,92 - klima, padavine (pomozna funkcija)
function checkNsnegOblika_(sn, oblika) {
  if (sn.nval && oblika.nval) {
    if (oblika.nval >= 2 && oblika.nval <= 7 && sn.nval == -1) this.set_err_params(this.messages.msg_sn_91, 0, [sn, oblika]);        
    if (sn.nval >= 0 && (oblika.nval == -1 || oblika.nval == 1 || oblika.nval == 8)) this.set_err_params(this.messages.msg_sn_92, 0, [sn, oblika]);        
  }
}

// kontrole 91,92 - padavine
function checkNsnegOblikaPad() {
  this.checkNsnegOblika_(this.p8_sneg_novi, this.p6_oblika);  
}

// kontrole 91,92 - klima
function checkNsnegOblikaKli() {
  this.checkNsnegOblika_(this.k52_sneg_novi, this.k50_oblika_padavin);  
}

// ===================================================================//

// kontrola 93 - klima, padavine (pomozna funkcija)
function checkSsnegNsnegSsnegprev_(ss, sn, ssprev) {
  if (ss.nval && sn.nval && ssprev.nval && (ssprev.nval > -1 || sn.nval > -1 || ss.nval > -1)) {
		var ssprev_ = (ssprev.nval == -1)? 0 : ssprev.nval;
		var sn_ = (sn.nval == -1)? 0 : sn.nval;
		var ss_ = (ss.nval == -1)? 0 : ss.nval;
		if (ssprev_ + sn_ < ss_) this.set_err_params(this.messages.msg_ss_93, 0, [ssprev,  sn, ss]);
	}
}

// kontrola 93 - padavine
function checkSsnegNsnegSsnegprevPad() {
  if (this.prev && !this.prev.p7_sneg_skupaj.error) 	this.checkSsnegNsnegSsnegprev_(this.p7_sneg_skupaj, this.p8_sneg_novi, this.prev.p7_sneg_skupaj);
}


// kontrola 93 - klima
function checkSsnegNsnegSsnegprevKli() {
  if (this.prev && !this.prev.k51_sneg_skupaj.error) this.checkSsnegNsnegSsnegprev_(this.k51_sneg_skupaj, this.k52_sneg_novi, this.prev.k51_sneg_skupaj);
}

// ===================================================================//

// kontrole 94,95 - klima
function checkSsnegVoda() {
  if (this.k51_sneg_skupaj.nval && this.k53_voda_v_snegu.nval && this.pravi_datum()) {
		if (this.k51_sneg_skupaj.nval >= 10 && this.k53_voda_v_snegu.nval == -1) this.set_err_params(this.messages.msg_voda_94, 0, [this.k51_sneg_skupaj, this.k53_voda_v_snegu]);
		if (this.k51_sneg_skupaj.nval < 10 && this.k53_voda_v_snegu.nval >= 0) this.set_err_params(this.messages.msg_voda_95, 0, [this.k51_sneg_skupaj, this.k53_voda_v_snegu]);
  }
}

// ===================================================================//

// kontrole 107,109 - klima, padavine (pomozna funkcija)
function checkVisina0AliNad3PojaviK54K55K56K57K58_(visina, oblika, params) {  
  if (!oblika.error && visina.nval == 0 && oblika.nval == 9) {
    params[params.length] = oblika; 
    this.set_err_params(this.messages.msg_visina_109, 0, params);
  }
  if (visina.nval > 3) this.set_err_params(this.messages.msg_visina_107, 0, params);
}

// kontrole 107,109 - padavine
function checkVisina0AliNad3PojaviK54K55K56K57K58Pad() {  
  if (this.prev && !this.prev.p9_dez_sneg_dezsneg.error && !this.prev.p10_toca_slana_megla.error && !this.prev.p11_ivje_sodra_bpseno.error) {
		var params = [this.prev.p9_dez_sneg_dezsneg, new Number(7), this.prev.p10_toca_slana_megla, new Number(1), this.prev.p11_ivje_sodra_bpseno, new Number(6), this.p9_dez_sneg_dezsneg, new Number(7), this.p10_toca_slana_megla, new Number(1), this.p11_ivje_sodra_bpseno, new Number(6), this.p5_padavine]; 
    if (!this.prev.hasPojaviK54K55K56K57K58) this.prev.hasPojaviK54K55K56K57K58 = hasPojaviK54K55K56K57K58Pad;
    if (this.p5_padavine.nval && !this.prev.hasPojaviK54K55K56K57K58() && !this.hasPojaviK54K55K56K57K58()) 
			this.checkVisina0AliNad3PojaviK54K55K56K57K58_(this.p5_padavine, this.p6_oblika, params);
  }
}

// kontrole 107,109 - klima
function checkVisina0AliNad3PojaviK54K55K56K57K58Kli() {  
  if (this.prev && !this.prev.k54_dez_rosenje_ploha_dezja.error && !this.prev.k55_dez_zmrz_rosen_zmrz_iglice.error && !this.prev.k56_sneg_zrnat_sneg_ploha_snega.error && !this.prev.k57_dez_s_sn_babje_psen_ploh_ds.error && !this.prev.k58_toca_sodra_dim.error) {
		var params = [this.prev.k54_dez_rosenje_ploha_dezja, new Number(7), this.prev.k55_dez_zmrz_rosen_zmrz_iglice, new Number(7), this.prev.k56_sneg_zrnat_sneg_ploha_snega, new Number(7),  this.prev.k57_dez_s_sn_babje_psen_ploh_ds, new Number(7), this.prev.k58_toca_sodra_dim, new Number(4), this.k54_dez_rosenje_ploha_dezja, new Number(7), this.k55_dez_zmrz_rosen_zmrz_iglice, new Number(7),  this.k56_sneg_zrnat_sneg_ploha_snega, new Number(7), this.k57_dez_s_sn_babje_psen_ploh_ds, new Number(7), this.k58_toca_sodra_dim, new Number(4), this.k49_padavine];
		if (!this.prev.hasPojaviK54K55K56K57K58) this.prev.hasPojaviK54K55K56K57K58 = hasPojaviK54K55K56K57K58Kli;
		if (this.k49_padavine.nval && !this.prev.hasPojaviK54K55K56K57K58() && !this.hasPojaviK54K55K56K57K58()) 
			this.checkVisina0AliNad3PojaviK54K55K56K57K58_(this.k49_padavine, this.k50_oblika_padavin, params);
  }
}

// ===================================================================//

// kontrola 98 - klima, padavine (pomozna funkcija)
function checkNsnegOblikaPojaviK55K56K57_(sn, snprev, oblika) {
  if (oblika.nval && oblika.nval == 9 && (!sn.nval || sn.nval != 0 && sn.nval != 1) && (!snprev.nval || snprev.nval != 0 && sn.nval != 1)) {
		var params = [sn, snprev, oblika];
		params = this.checkNsnegOblikaPojaviK55K56K57__(params);
		if (params.length > 3) this.set_warn_params(this.messages.msg_sn_98, 0, params);
  }
}

// kontrola 98 - padavine (pomozna funkcija)
function checkNsnegOblikaPojaviK55K56K57Pad_(params) {
  if (!this.p9_dez_sneg_dezsneg.equals(null, 0, 1)) params = params.concat([this.p9_dez_sneg_dezsneg, new Number(5)]);
  if (this.p11_ivje_sodra_bpseno.equals(3, 5, 6, 7)) params = params.concat([this.p11_ivje_sodra_bpseno, new Number(3)]);
  return params;
}

// kontrola 98 - klima (pomozna funkcija)
function checkNsnegOblikaPojaviK55K56K57Kli_(params) {
  if (this.k55_dez_zmrz_rosen_zmrz_iglice.equals(3, 5, 6, 7))  params = params.concat([this.k55_dez_zmrz_rosen_zmrz_iglice, new Number(3)])
  if (!this.k56_sneg_zrnat_sneg_ploha_snega.equals(null, 0)) params[params.length] = this.k56_sneg_zrnat_sneg_ploha_snega;
  if (!this.k57_dez_s_sn_babje_psen_ploh_ds.equals(null, 0)) params[params.length] = this.k57_dez_s_sn_babje_psen_ploh_ds;
  return params;
}

// kontrola 98 - padavine
function checkNsnegOblikaPojaviK55K56K57Pad() {
  if (this.prev && !this.prev.p8_sneg_novi.error) this.checkNsnegOblikaPojaviK55K56K57_(this.p8_sneg_novi, this.prev.p8_sneg_novi, this.p6_oblika);
}

// kontrola 98 - klima
function checkNsnegOblikaPojaviK55K56K57Kli() {
  if (this.prev && !this.prev.k52_sneg_novi.error) this.checkNsnegOblikaPojaviK55K56K57_(this.k52_sneg_novi, this.prev.k52_sneg_novi, this.k50_oblika_padavin);
}

// ===================================================================//

// kontrola 112 - klima, padavine (pomozna funkcija)
function checkSsnegPojaviK54K57_(ssprev, ss) {
  if (ssprev.nval && ss.nval && ssprev.nval - ss.nval > 15 && (ss.nval == 0 || ss.nval == -1)) {
		var params = [ssprev, ss];
    params = this.checkSsnegPojaviK54K57__(params);
    if (params.length > 2) this.set_warn_params(this.messages.msg_ss_112, 0, params);
  }
}

// kontrola 112 - padavine (pomozna funkcija)
function checkSsnegPojaviK54K57Pad_(params) {
  if (!this.p9_dez_sneg_dezsneg.equals(1, 3, 5)) params = params.concat([this.p9_dez_sneg_dezsneg, new Number(5)]);
  return params;
}

// kontrola 112 - klima (pomozna funkcija)
function checkSsnegPojaviK54K57Kli_(params) {
  if (this.k54_dez_rosenje_ploha_dezja.equals(null, 0) && !this.k57_dez_s_sn_babje_psen_ploh_ds.equals(1, 3, 5)) 
		params = params.concat([this.k54_dez_rosenje_ploha_dezja, new Number(7), this.k57_dez_s_sn_babje_psen_ploh_ds, new Number(5)])
  return params;
}

// kontrola 112 - padavine
function checkSsnegPojaviK54K57Pad() {
  if (this.prev && !this.prev.p7_sneg_skupaj.error) this.checkSsnegPojaviK54K57_(this.prev.p7_sneg_skupaj, this.p7_sneg_skupaj);
}

// kontrola 112 - klima
function checkSsnegPojaviK54K57Kli() {
  if (this.prev && !this.prev.k51_sneg_skupaj.error) this.checkSsnegPojaviK54K57_(this.prev.k51_sneg_skupaj, this.k51_sneg_skupaj);
}

// ===================================================================//

// kontrola 126 - klima, padavine (pomozna funkcija)
function checkSsnegPojaviK70_(ss, k70) {
  if (ss.nval && ss.nval > 0 && k70.edit() && k70.msr && k70.equals(null, 0, 2, 3, 6)) 
		this.set_err_params(this.messages.msg_ss_126, 0, [ss, k70, new Number(1)]);
}

// kontrola 126 - padavine
function checkSsnegPojaviK70Pad() {
  this.checkSsnegPojaviK70_(this.p7_sneg_skupaj, this.p13_sneznaodeja_rosa); 
}

// kontrola 126 - klima
function checkSsnegPojaviK70Kli() {
  this.checkSsnegPojaviK70_(this.k51_sneg_skupaj, this.k70_snezna_odeja); 
}

// ===================================================================//

// kontrola 127 - klima, padavine
function checkSsnegPojaviK70K56K57_(ss, k70) {
  if (ss.nval && ss.nval == -1 && k70.equals(1, 4, 5, 7)) {
    var params = [ss, k70, new Number(1)];
    params = this.checkSsnegPojaviK70K56K57__(params); 
    if (params.length > 3) this.set_err_params(this.messages.msg_ss_127, 0, params);
  }
}

// kontrola 127 - padavine (pomozna funkcija)
function checkSsnegPojaviK70K56K57Pad_(params) {
  if (this.p9_dez_sneg_dezsneg.equals(0, 1) && this.p11_ivje_sodra_bpseno.equals(0, 1, 2, 4)) 
		params = params.concat([this.p9_dez_sneg_dezsneg, new Number(6), this.p11_ivje_sodra_bpseno, new Number(3)]);
  return params;
}

// kontrola 127 - klima (pomozna funkcija)
function checkSsnegPojaviK70K56K57Kli_(params) {
  if (this.k56_sneg_zrnat_sneg_ploha_snega.equals(0) && this.k57_dez_s_sn_babje_psen_ploh_ds.equals(0)) 
		params = params.concat([this.k56_sneg_zrnat_sneg_ploha_snega, new Number(7), this.k57_dez_s_sn_babje_psen_ploh_ds, new Number(7)]);
  return params;
}

// kontrola 127 - padavine
function checkSsnegPojaviK70K56K57Pad() {
  this.checkSsnegPojaviK70K56K57_(this.p7_sneg_skupaj, this.p13_sneznaodeja_rosa);
}

// kontrola 127 - klima
function checkSsnegPojaviK70K56K57Kli() {
  this.checkSsnegPojaviK70K56K57_(this.k51_sneg_skupaj, this.k70_snezna_odeja);
}

// ===================================================================//

// preveri, ce pojavi P59,P69,P61,P62,P63 ustrezajo obliki padavin 8 - padavine
function checkOblika8PojaviK59K60K61K62K63Pad(days, p10, p11, p12, p13, p10p, p11p, p12p, p13p) {
  if (days == 2) {
    if (!p10.equals(null, 0, 1) || !p10p.equals(null, 0, 1) || p11.equals(1, 4, 5, 7) || p11p.equals(1, 4, 5, 7) || p12.equals(1, 4, 5, 7) || p12p.equals(1, 4, 5, 7) || p13.equals(2, 4) || p13p.equals(2, 4)) return 0; 
    return 1; 
  }
  else {
    if (!p10.equals(null, 0, 1) || p11.equals(1, 4, 5, 7) || p12.equals(1, 4, 5, 7) || p13.equals(2, 4)) return 0; 
    return 1;
  }
}

// preveri, ce pojavi P59,P69,P61,P62,P63 ustrezajo obliki padavin 8 - klima
function checkOblika8PojaviK59K60K61K62K63Kli(days, k59, k60, k61, k62, k63, k59p, k60p, k61p, k62p, k63p) {
  if (days == 2) {
    if (!k59.equals(null, 0) || !k59p.equals(null, 0) || k60.equals(1, 3, 5) || k60p.equals(1, 3, 5) || !k61.equals(null, 0) || !k61p.equals(null, 0) || k62.equals(1, 2, 4) || k62p.equals(1, 2, 4) || !k63.equals(null, 0, 3) || !k63p.equals(null, 0, 3)) return 0;
    return 1;
  }
  else {
    if (!k59.equals(null, 0) || !k60.equals(null, 0) || !k61.equals(null, 0) || k62.equals(1, 2, 4) || !k63.equals(null, 0, 3)) return 0;
    return 1;
  }
}

// ===================================================================//

// kontrole 108,108A - padavine
function checkOblikaPojaviK59K60K61K62K63Pad() {
  if (this.p6_oblika.nval && this.p6_oblika.nval == 8) {
    var params = [this.p6_oblika];
    var p10p, p11p, p12p, p13p, p10, p11, p12, p13;
    if (this.prev && this.prev.p10_toca_slana_megla.msr) {
      p10p = this.prev.p10_toca_slana_megla;
      p11p = this.prev.p11_ivje_sodra_bpseno;
      p12p = this.prev.p12_poledica_nevihta_vihveter;
      p13p = this.prev.p13_sneznaodeja_rosa;
      params = params.concat([p10p, new Number(6), p11p, new Number(1), p12p, new Number(1), p13p, new Number(2)]);
    }
    if (this.p10_toca_slana_megla.msr && this.p10_toca_slana_megla.edit()) {
      p10 = this.p10_toca_slana_megla;
      p11 = this.p11_ivje_sodra_bpseno;
      p12 = this.p12_poledica_nevihta_vihveter;
      p13 = this.p13_sneznaodeja_rosa;
      params = params.concat([p10, new Number(6), p11, new Number(1), p12, new Number(1), p13, new Number(2)]);
    }
    if (p10p && p11p && p12p && p13p && p10 && p11 && p12 && p13) {
      var oblika = this.checkOblika8PojaviK59K60K61K62K63(2, p10, p11, p12, p13, p10p, p11p, p12p, p13p);
      if (oblika > 0) this.set_err_params(this.messages.msg_oblika_108, 0, params);
    }
    else {
      if (p10p && p11p && p12p && p13p && !p10 && !p11 && !p12 && !p13) var oblika = this.checkOblika8PojaviK59K60K61K62K63(1, p10p, p11p, p12p, p13p);
      if (!p10p && !p11p && !p12p && !p13p && p10 && p11 && p12 && p13) var oblika = this.checkOblika8PojaviK59K60K61K62K63(1, p10, p11, p12, p13);
      if (!oblika || oblika > 0) this.set_warn_params(this.messages.msg_oblika_108A, 0, params);
    }
  }
}

// kontrole 108,108A - klima
function checkOblikaPojaviK59K60K61K62K63Kli() {
  if (this.k50_oblika_padavin.nval && this.k50_oblika_padavin.nval == 8) {
    var params = [this.k50_oblika_padavin];
    var k59p, k60p, k61p, k62p, k63p, k59, k60, k61, k62, k63;
    if (this.prev && this.prev.k59_megla_megla_z_vid_neb_led_m.msr) {
      k59p = this.prev.k59_megla_megla_z_vid_neb_led_m;
      k60p = this.prev.k60_meglic_suha_motnost_talna_m;
      k61p = this.prev.k61_rosa_slana_prsec_z_vodne_p_;
      k62p = this.prev.k62_poledica_zled_poled__na_tl_;
      k63p = this.prev.k63_ivje_trdo_ivje_elijev_og_;
      params = params.concat([k59p, new Number(7), k60p, new Number(7), k61p, new Number(7), k62p, new Number(4), k63p, new Number(4)]);
    }
    if (this.k59_megla_megla_z_vid_neb_led_m.msr && this.k59_megla_megla_z_vid_neb_led_m.edit()) {
      k59 = this.k59_megla_megla_z_vid_neb_led_m;
      k60 = this.k60_meglic_suha_motnost_talna_m;
      k61 = this.k61_rosa_slana_prsec_z_vodne_p_;
      k62 = this.k62_poledica_zled_poled__na_tl_;
      k63 = this.k63_ivje_trdo_ivje_elijev_og_;
      params = params.concat([k59, new Number(7), k60, new Number(7), k61, new Number(7), k62, new Number(4), k63, new Number(4)]);
    }
    if (k59p && k60p && k61p && k62p && k63p && k59 && k60 && k61 && k62 && k63) {  
      var oblika = this.checkOblika8PojaviK59K60K61K62K63(2, k59, k60, k61, k62, k63, k59p, k60p, k61p, k62p, k63p);
      if (oblika > 0) this.set_err_params(this.messages.msg_oblika_108, 0, params);
    }
    else {
      if (k59p && k60p && k61p && k62p && k63p && !k59 && !k60 && !k61 && !k62 && !k63) var oblika = this.checkOblika8PojaviK59K60K61K62K63(1, k59p, k60p, k61p, k62p, k63p);
      if (!k59p && !k60p && !k61p && !k62p && !k63p && k59 && k60 && k61 && k62 && k63) var oblika = this.checkOblika8PojaviK59K60K61K62K63(1, k59, k60, k61, k62, k63);
      if (!oblika || oblika > 0) this.set_warn_params(this.messages.msg_oblika_108A, 0, params);
    }
  }
}

// ===================================================================//

// preveri, ce pojavi P54,P55,P56,P57,P58 ustrezajo obliki padavin 1 - padavine
function checkOblika1PojaviK54K55K56K57K58Pad(days, p9, p10, p11, p9p, p10p, p11p) {
  if (days == 2) {
    if (!p9.equals(null, 0, 1) || !p9p.equals(null, 0, 1) || p11.equals(3, 5, 6, 7) || p11p.equals(3, 5, 6, 7)) return 2;
    if (p9.equals(1) || p9p.equals(1) || p10.equals(1, 4, 5, 7) || p10p.equals(1, 4, 5, 7) || p11.equals(2, 4) || p11p.equals(2, 4)) return 0; 
    return 1;
  }
  else {
    if (!p9.equals(null, 0, 1) || p11.equals(3, 5, 6, 7)) return 2;
    if (p9.equals(1) || p10.equals(1, 4, 5, 7) || p11.equals(2, 4)) return 0; 
    return 1;
  }
}

// preveri, ce pojavi P54,P55,P56,P57,P58 ustrezajo obliki padavin 1 - klima
function checkOblika1PojaviK54K55K56K57K58Kli(days, k54, k55, k56, k57, k58, k54p, k55p, k56p, k57p, k58p) {
  if (days == 2) {
    if (k55.equals(3, 5, 6, 7) || k55p.equals(3, 5, 6, 7) || !k56.equals(null, 0) || !k56p.equals(null, 0) || !k57.equals(null, 0) || !k57p.equals(null, 0)) return 2;
    if (!k54.equals(null, 0) || !k54p.equals(null, 0) || k55.equals(1, 2, 4) || k55p.equals(1, 2, 4) || !k58.equals(null, 0, 3) || !k58p.equals(null, 0, 3)) return 0;
    return 1;
  }
  else {
    if (k55.equals(3, 5, 6, 7) || !k56.equals(null, 0) || !k57.equals(null, 0)) return 2;
    if (!k54.equals(null, 0) || k55.equals(1, 2, 4) || !k58.equals(null, 0, 3)) return 0;
    return 1;
  }
}

// ===================================================================//

// preveri, ce pojavi P54,P55,P56,P57,P58 ustrezajo obliki padavin 2 - padavine
function checkOblika2PojaviK54K55K56K57K58Pad(days, p9, p10, p11, p9p, p10p, p11p) {
  if (days == 2) {
    if (!p9.equals(null, 0, 2) || !p9p.equals(null, 0, 2) || p10.equals(1, 4, 5, 7) || p10p.equals(1, 4, 5, 7) || p11.equals(2, 4, 6, 7) || p11p.equals(2, 4, 6, 7)) return 2;
    if (p9.equals(2) || p9p.equals(2) || p11.equals(3, 5) || p11p.equals(3, 5)) return 0; // ok
    return 1;
  }
  else {
    if (!p9.equals(null, 0, 2) || p10.equals(1, 4, 5, 7) || p11.equals(2, 4, 6, 7)) return 2;
    if (p9.equals(2) || p11.equals(3, 5)) return 0; // ok
    return 1;
  }
}

// preveri, ce pojavi P54,P55,P56,P57,P58 ustrezajo obliki padavin 2 - klima
function checkOblika2PojaviK54K55K56K57K58Kli(days, k54, k55, k56, k57, k58, k54p, k55p, k56p, k57p, k58p) {
  if (days == 2) {
    if (!k54.equals(null, 0) || !k54p.equals(null, 0) || !k55.equals(null, 0, 3) || !k55p.equals(null, 0, 3) || !k57.equals(null, 0, 2) || !k57p.equals(null, 0, 2) || !k58.equals(null, 0, 3) || !k58p.equals(null, 0, 3)) return 2;
    if (k55.equals(3) || k55p.equals(3) || !k56.equals(null, 0) || !k56p.equals(null, 0) || k57.equals(2) || k57p.equals(2)) return 0; 
    return 1;
  }
  else {
    if (!k54.equals(null, 0) || !k55.equals(null, 0, 3) || !k57.equals(null, 0, 2) || !k58.equals(null, 0, 3)) return 2;
    if (k55.equals(3) || !k56.equals(null, 0) || k57.equals(2)) return 0; 
    return 1;
  }
}

// ===================================================================//

// preveri, ce pojavi P54,P55,P56,P57,P58 ustrezajo obliki padavin 3 - padavine
function checkOblika3PojaviK54K55K56K57K58Pad(days, p9, p10, p11, p9p, p10p, p11p) {
  if (days == 2) {
    if (!p9.equals(null, 0, 3) || !p9p.equals(null, 0, 3) || p10.equals(1, 4, 5, 7) || p10p.equals(1, 4, 5, 7) || !p11.equals(null, 0, 1) || !p11p.equals(null, 0, 1)) return 2;
    if (p9.equals(3) || p9p.equals(3)) return 0; // ok
    return 1;
  }
  else {
    if (!p9.equals(null, 0, 3) || p10.equals(1, 4, 5, 7) || !p11.equals(null, 0, 1)) return 2;
    if (p9.equals(3)) return 0; // ok
    return 1;
  }
}

// preveri, ce pojavi P54,P55,P56,P57,P58 ustrezajo obliki padavin 3 - klima
function checkOblika3PojaviK54K55K56K57K58Kli(days, k54, k55, k56, k57, k58, k54p, k55p, k56p, k57p, k58p) {
  if (days == 2) {
    if (!k54.equals(null, 0) || !k54p.equals(null, 0) || !k55.equals(null, 0) || !k55p.equals(null, 0) || !k56.equals(null, 0) || !k56p.equals(null, 0) || k57.equals(2, 4, 6, 7) || k57p.equals(2, 4, 6, 7) || !k58.equals(null, 0, 3) || !k58p.equals(null, 0, 3)) return 2;
    if (k57.equals(1, 3, 5) || k57p.equals(1, 3, 5)) return 0; 
    return 1;
  }
  else {
    if (!k54.equals(null, 0) || !k55.equals(null, 0) || !k56.equals(null, 0) || k57.equals(2, 4, 6, 7) || !k58.equals(null, 0, 3))  return 2;
    if (k57.equals(1, 3, 5)) return 0; 
    return 1;
  }
}

// ===================================================================//

// preveri, ce pojavi P54,P55,P56,P57,P58 ustrezajo obliki padavin 4 - padavine
function checkOblika4PojaviK54K55K56K57K58Pad(days, p9, p10, p11, p9p, p10p, p11p) {
  if (days == 2) {
    if (p9.equals(3, 5, 6, 7) || p9p.equals(3, 5, 6, 7)) return 2;
    if ((p9.equals(1, 4) || p9p.equals(1, 4) || p10.equals(1, 4, 5, 7) || p10p.equals(1, 4, 5, 7) || p11.equals(2, 4, 6, 7) || p11p.equals(2, 4, 6, 7)) && (p9.equals(2, 4) || p9p.equals(2, 4) || p11.equals(3, 5, 6, 7) || p11p.equals(3, 5, 6, 7))) return 0;
    return 1;
  }
  else {
    if (p9.equals(3, 5, 6, 7)) return 2;
    if ((p9.equals(1, 4) || p10.equals(1, 4, 5, 7) || p11.equals(2, 4, 6, 7)) && (p9.equals(2, 4) || p11.equals(3, 5, 6, 7))) return 0;
    return 1;
  }
}

// preveri, ce pojavi P54,P55,P56,P57,P58 ustrezajo obliki padavin 4 - klima
function checkOblika4PojaviK54K55K56K57K58Kli(days, k54, k55, k56, k57, k58, k54p, k55p, k56p, k57p, k58p) {
  if (days == 2) {
    if (!k57.equals(null, 0, 2) || !k57p.equals(null, 0, 2)) return 2; // napaka, ce mesane
    if (k55.equals(5, 6, 7) || k55p.equals(5, 6, 7) || ((!k54.equals(null, 0) || !k54p.equals(null, 0) || k55.equals(1, 2, 4) || k55p.equals(1, 2, 4) || !k58.equals(null, 0, 3) || !k58p.equals(null, 0, 3)) && (k55.equals(3) || k55p.equals(3) || !k56.equals(null, 0) || !k56p.equals(null, 0) || k57.equals(2) || k57p.equals(2)))) return 0;   
    return 1;
  }
  else {
    if (!k57.equals(null, 0, 2)) return 2; // napaka, ce mesane
    if (k55.equals(5, 6, 7) || ((!k54.equals(null, 0) || k55.equals(1, 2, 4) || !k58.equals(null, 0, 3)) && (k55.equals(3) || !k56.equals(null, 0) || k57.equals(2)))) return 0;   
    return 1;
  }
}

// ===================================================================//

// preveri, ce pojavi P54,P55,P56,P57,P58 ustrezajo obliki padavin 5 - padavine
function checkOblika5PojaviK54K55K56K57K58Pad(days, p9, p10, p11, p9p, p10p, p11p) {
  if (days == 2) {
    if (p9.equals(2, 4, 6, 7) || p9p.equals(2, 4, 6, 7) || p11.equals(3, 5, 6, 7) || p11p.equals(3, 5, 6, 7)) return 2;
    if (p9.equals(5) || p9p.equals(5) || (p9.equals(3) || p9p.equals(3)) && (p9.equals(1, 3) || p9p.equals(1, 3) || p10.equals(1, 4, 5, 7) || p10p.equals(1, 4, 5, 7) || p11.equals(2, 4) || p11p.equals(2, 4))) return 0;
    else return 1;
  }
  else {
    if (p9.equals(2, 4, 6, 7) || p11.equals(3, 5, 6, 7)) return 2;
    if (p9.equals(5) || p9.equals(3) && (p10.equals(1, 4, 5, 7) || p11.equals(2, 4))) return 0;
    else return 1;
  }
}

// preveri, ce pojavi P54,P55,P56,P57,P58 ustrezajo obliki padavin 5 - klima
function checkOblika5PojaviK54K55K56K57K58Kli(days, k54, k55, k56, k57, k58, k54p, k55p, k56p, k57p, k58p) {
  if (days == 2) {
    if (k55.equals(3, 5, 6, 7) || k55p.equals(3, 5, 6, 7) || !k56.equals(null, 0) || !k56p.equals(null, 0) || k57.equals(2, 4, 6, 7) || k57p.equals(2, 4, 6, 7)) return 2;
    if ((!k54.equals(null, 0) || !k54p.equals(null, 0) || k55.equals(1, 2, 4) || k55p.equals(1, 2, 4) || !k58.equals(null, 0, 3) || !k58p.equals(null, 0, 3)) && (k57.equals(1, 3, 5) || k57p.equals(1, 3, 5))) return 0;
    return 1;
  }  
  else {
    if (k55.equals(3, 5, 6, 7) || !k56.equals(null, 0) || k57.equals(2, 4, 6, 7)) return 2;
    if ((!k54.equals(null, 0) || k55.equals(1, 2, 4) || !k58.equals(null, 0, 3)) && k57.equals(1, 3, 5)) return 0;
    return 1;
  }
}

// ===================================================================//

// preveri, ce pojavi P54,P55,P56,P57,P58 ustrezajo obliki padavin 6 - padavine
function checkOblika6PojaviK54K55K56K57K58Pad(days, p9, p10, p11, p9p, p10p, p11p) {
  if (days == 2) {
    if (p9.equals(1, 4, 5, 7) || p9p.equals(1, 4, 5, 7) || p10.equals(1, 4, 5, 7) || p10p.equals(1, 4, 5, 7) || p11.equals(2, 4, 6, 7) || p11p.equals(2, 4, 6, 7)) return 2;
    if (p9.equals(6) || p9p.equals(6) || (p9.equals(3) || p9p.equals(3)) && (p9.equals(2, 3, 6) || p9p.equals(2, 3, 6) || p11.equals(3, 5) || p11p.equals(3, 5))) return 0; 
    return 1; // manjkajo
  }
  else {
    if (p9.equals(1, 4, 5, 7) || p10.equals(1, 4, 5, 7) || p11.equals(2, 4, 6, 7)) return 2;
    if (p9.equals(6) || p9.equals(3) && p11.equals(3, 5)) return 0;
    return 1; // manjkajo
  }
}

// preveri, ce pojavi P54,P55,P56,P57,P58 ustrezajo obliki padavin 6 - klima
function checkOblika6PojaviK54K55K56K57K58Kli(days, k54, k55, k56, k57, k58, k54p, k55p, k56p, k57p, k58p) {
  if (days == 2) {
    if (!k54.equals(null, 0) || !k54p.equals(null, 0) || !k55.equals(null, 0, 3) || !k55p.equals(null, 0, 3) || !k58.equals(null, 0, 3) || !k58p.equals(null, 0, 3)) return 2;
    if ((k57.equals(4, 6, 7) || k57p.equals(4, 6, 7)) || ((k55.equals(3) || k55p.equals(3) || !k56.equals(null, 0) || !k56p.equals(null, 0)) && (k57.equals(1, 3, 5) || k57p.equals(1, 3, 5)))) return 0;
    else return 1; // manjkajo
  }
  else {
    if (!k54.equals(null, 0) || !k55.equals(null, 0, 3) || !k58.equals(null, 0, 3)) return 2;
    if (k57.equals(4, 6, 7) || (k55.equals(3) || !k56.equals(null, 0) && k57.equals(1, 3, 5))) return 0;
    else return 1; // manjkajo
  }
}

// ===================================================================//

// preveri, ce pojavi P54,P55,P56,P57,P58 ustrezajo obliki padavin 7 - padavine
function checkOblika7PojaviK54K55K56K57K58Pad(days, p9, p10, p11, p9p, p10p, p11p) {
  if (days == 2) {
    if ((p9.equals(3, 5, 6, 7) || p9p.equals(3, 5, 6, 7)) && (p9.equals(1, 4, 5, 7) || p9p.equals(1, 4, 5, 7) || p10.equals(1, 4, 5, 7) || p10p.equals(1, 4, 5, 7) || p11.equals(2, 4, 6, 7) || p11p.equals(2, 4, 6, 7)) && (p9.equals(2, 4, 6, 7) || p9p.equals(2, 4, 6, 7) || p11.equals(3, 5, 6, 7) || p11p.equals(3, 5, 6, 7))) return 0;
    else return 1;  
  }
  else {
    if (p9.equals(7) || p9.equals(6) && (p10.equals(1, 4, 5, 7) || p11.equals(2, 4, 6, 7)) || p9.equals(5) && p11.equals(3, 5, 6, 7) || p9.equals(3) && (p11.equals(6, 7) || p10.equals(1, 4, 5, 7) && p11.equals(3, 5))) return 0;
    return 1;
  }
}

// preveri, ce pojavi P54,P55,P56,P57,P58 ustrezajo obliki padavin 7 - klima
function checkOblika7PojaviK54K55K56K57K58Kli(days, k54, k55, k56, k57, k58, k54p, k55p, k56p, k57p, k58p) {
  if (days == 2) {
    if ((k57.equals(4, 6, 7) || k57p.equals(4, 6, 7)) && (!k54.equals(null, 0) || !k54p.equals(null, 0) || !k55.equals(null, 0, 3) || !k55p.equals(null, 0, 3) || !k58.equals(null, 0, 3) || k58p.equals(null, 0, 3)) || (k57.equals(1, 3, 5) || k57p.equals(1, 3, 5)) && ((k55.equals(5, 6, 7) || k55p.equals(5, 6, 7) || (!k54.equals(null, 0) || !k54p.equals(null, 0) || k55.equals(1, 2, 4) || k55p.equals(1, 2, 4) || !k58.equals(null, 0, 3) || k58p.equals(null, 0, 3)) && (k55.equals(3) || k55p.equals(3) || !k56.equals(null, 0) || !k56p.equals(null, 0))))) return 0;
    return 1;
  }
  else {
    if ((k57.equals(4, 6, 7) && (!k54.equals(null, 0) || !k55.equals(null, 0, 3) || !k58.equals(null, 0, 3))) || (k57.equals(1, 3, 5) && (k55.equals(5, 6, 7) || (k55.equals(1, 2, 4) || !k54.equals(null, 0) || !k58.equals(null, 0, 3)) && (k55.equals(3) || !k56.equals(null, 0))))) return 0;
    return 1;
  }
}

// ===================================================================//

// preveri, ce pojavi P54,P55,P56,P57,P58 ustrezajo obliki padavin 8 - padavine
function checkOblika8PojaviK54K55K56K57K58Pad(days, p9, p10, p11, p9p, p10p, p11p) {
  if (days == 2) {
    if (!this.hasPojaviK54K55K56K57K58) this.hasPojaviK54K55K56K57K58 = hasPojaviK54K55K56K57K58Pad;
    if (this.hasPojaviK54K55K56K57K58()) return 2;
    return 0;
  }
  else {
    if (!this.hasPojaviK54K55K56K57K58) this.hasPojaviK54K55K56K57K58 = hasPojaviK54K55K56K57K58Pad;
    if (this.hasPojaviK54K55K56K57K58()) return 2;
    return 0;
  }
}

// preveri, ce pojavi P54,P55,P56,P57,P58 ustrezajo obliki padavin 8 - klima
function checkOblika8PojaviK54K55K56K57K58Kli(days, k54, k55, k56, k57, k58, k54p, k55p, k56p, k57p, k58p) {
  if (days == 2) {
    if (!this.prev.hasPojaviK54K55K56K57K58) this.prev.hasPojaviK54K55K56K57K58 = hasPojaviK54K55K56K57K58Kli;
    if (this.prev.hasPojaviK54K55K56K57K58() || this.hasPojaviK54K55K56K57K58()) return 2;
    return 0;
  }
  else {
    if (!this.hasPojaviK54K55K56K57K58) this.hasPojaviK54K55K56K57K58 = hasPojaviK54K55K56K57K58Kli;
    if (this.hasPojaviK54K55K56K57K58()) return 2;
    return 0;
  }
}

// ===================================================================//

// kontrole 99,100,101,102,103,104,105 - padavine
function checkOblikaPojaviK54K55K56K57K58Pad() {
  if (this.p6_oblika.nval && this.p6_oblika.nval >= 1 && this.p6_oblika.nval <= 8) {
    var params = [this.p6_oblika];
    var p9p, p10p, p11p, p9, p10, p11;
    if (this.prev && this.prev.p9_dez_sneg_dezsneg.msr) {
      p9p = this.prev.p9_dez_sneg_dezsneg;
      p10p = this.prev.p10_toca_slana_megla;
      p11p = this.prev.p11_ivje_sodra_bpseno;
      params = params.concat([p9p, new Number(7), p10p, new Number(1), p11p, new Number(6)]);
    }
    if (this.p9_dez_sneg_dezsneg.msr && this.p9_dez_sneg_dezsneg.edit()) {
      p9 = this.p9_dez_sneg_dezsneg;
      p10 = this.p10_toca_slana_megla;
      p11 = this.p11_ivje_sodra_bpseno;
      params = params.concat([p9, new Number(7), p10, new Number(1), p11, new Number(6)]);
    }
    if (p9p && p10p && p11p && p9 && p10 && p11) {
      var oblika;
      if (this.p6_oblika.nval == 1) oblika = this.checkOblika1PojaviK54K55K56K57K58(2, p9, p10, p11, p9p, p10p, p11p);
      if (this.p6_oblika.nval == 2) oblika = this.checkOblika2PojaviK54K55K56K57K58(2, p9, p10, p11, p9p, p10p, p11p);
      if (this.p6_oblika.nval == 3) oblika = this.checkOblika3PojaviK54K55K56K57K58(2, p9, p10, p11, p9p, p10p, p11p);
      if (this.p6_oblika.nval == 4) oblika = this.checkOblika4PojaviK54K55K56K57K58(2, p9, p10, p11, p9p, p10p, p11p);
      if (this.p6_oblika.nval == 5) oblika = this.checkOblika5PojaviK54K55K56K57K58(2, p9, p10, p11, p9p, p10p, p11p);
      if (this.p6_oblika.nval == 6) oblika = this.checkOblika6PojaviK54K55K56K57K58(2, p9, p10, p11, p9p, p10p, p11p);
      if (this.p6_oblika.nval == 7) oblika = this.checkOblika7PojaviK54K55K56K57K58(2, p9, p10, p11, p9p, p10p, p11p);
      if (this.p6_oblika.nval == 8) oblika = this.checkOblika8PojaviK54K55K56K57K58(2, p9, p10, p11, p9p, p10p, p11p);
      if (oblika > 0) {
        if (this.p6_oblika.nval == 1) this.set_warn_params(this.messages.msg_oblika_99, 1, params);
        if (this.p6_oblika.nval == 2) this.set_warn_params(this.messages.msg_oblika_100, 1, params);
        if (this.p6_oblika.nval == 3) this.set_warn_params(this.messages.msg_oblika_101, 1, params);
        if (this.p6_oblika.nval == 4) this.set_warn_params(this.messages.msg_oblika_102, 1, params);
        if (this.p6_oblika.nval == 5) this.set_warn_params(this.messages.msg_oblika_103, 1, params);
        if (this.p6_oblika.nval == 6) this.set_warn_params(this.messages.msg_oblika_104, 1, params);
        if (this.p6_oblika.nval == 7) this.set_warn_params(this.messages.msg_oblika_105, 1, params);
				if (this.p6_oblika.nval == 8) this.set_warn_params(this.messages.msg_oblika_108B, 1, params);
      }
    }
    else {
      var oblika;
			if (p9p && p10p && p11p && !p9 && !p10 && !p11) {
        if (this.p6_oblika.nval == 1) oblika = this.checkOblika1PojaviK54K55K56K57K58(1, p9p, p10p, p11p);
        if (this.p6_oblika.nval == 2) oblika = this.checkOblika2PojaviK54K55K56K57K58(1, p9p, p10p, p11p);
        if (this.p6_oblika.nval == 3) oblika = this.checkOblika3PojaviK54K55K56K57K58(1, p9p, p10p, p11p);
        if (this.p6_oblika.nval == 4) oblika = this.checkOblika4PojaviK54K55K56K57K58(1, p9p, p10p, p11p);
        if (this.p6_oblika.nval == 5) oblika = this.checkOblika5PojaviK54K55K56K57K58(1, p9p, p10p, p11p);
        if (this.p6_oblika.nval == 6) oblika = this.checkOblika6PojaviK54K55K56K57K58(1, p9p, p10p, p11p);
        if (this.p6_oblika.nval == 7) oblika = this.checkOblika7PojaviK54K55K56K57K58(1, p9p, p10p, p11p);
        if (this.p6_oblika.nval == 8) oblika = this.checkOblika8PojaviK54K55K56K57K58(1, p9p, p10p, p11p);
      }
      else if (!p9p && !p10p && !p11p && p9 && p10 && p11) {
        if (this.p6_oblika.nval == 1) oblika = this.checkOblika1PojaviK54K55K56K57K58(1, p9, p10, p11);
        if (this.p6_oblika.nval == 2) oblika = this.checkOblika2PojaviK54K55K56K57K58(1, p9, p10, p11);
        if (this.p6_oblika.nval == 3) oblika = this.checkOblika3PojaviK54K55K56K57K58(1, p9, p10, p11);
        if (this.p6_oblika.nval == 4) oblika = this.checkOblika4PojaviK54K55K56K57K58(1, p9, p10, p11);
        if (this.p6_oblika.nval == 5) oblika = this.checkOblika5PojaviK54K55K56K57K58(1, p9, p10, p11);
        if (this.p6_oblika.nval == 6) oblika = this.checkOblika6PojaviK54K55K56K57K58(1, p9, p10, p11);
        if (this.p6_oblika.nval == 7) oblika = this.checkOblika7PojaviK54K55K56K57K58(1, p9, p10, p11);
        if (this.p6_oblika.nval == 8) oblika = this.checkOblika8PojaviK54K55K56K57K58(1, p9, p10, p11);
      }
      if (!oblika || oblika > 0) {
        if (this.p6_oblika.nval == 1) this.set_warn_params(this.messages.msg_oblika_99A, 0, params);
        if (this.p6_oblika.nval == 2) this.set_warn_params(this.messages.msg_oblika_100A, 0, params);
        if (this.p6_oblika.nval == 3) this.set_warn_params(this.messages.msg_oblika_101A, 0, params);
        if (this.p6_oblika.nval == 4) this.set_warn_params(this.messages.msg_oblika_102A, 0, params);
        if (this.p6_oblika.nval == 5) this.set_warn_params(this.messages.msg_oblika_103A, 0, params);
        if (this.p6_oblika.nval == 6) this.set_warn_params(this.messages.msg_oblika_104A, 0, params);
        if (this.p6_oblika.nval == 7) this.set_warn_params(this.messages.msg_oblika_105A, 0, params);
      }
    }
  }
}

// kontrole 99,100,101,102,103,104,105 - klima
function checkOblikaPojaviK54K55K56K57K58Kli() {
  if (this.k50_oblika_padavin.nval && this.k50_oblika_padavin.nval >= 1 && this.k50_oblika_padavin.nval <= 8) {
    var params = [this.k50_oblika_padavin];
    var k54p, k55p, k56p, k57p, k58p, k54, k55, k56, k57, k58;
    if (this.prev && this.prev.k54_dez_rosenje_ploha_dezja.msr) {
      k54p = this.prev.k54_dez_rosenje_ploha_dezja;
      k55p = this.prev.k55_dez_zmrz_rosen_zmrz_iglice;
      k56p = this.prev.k56_sneg_zrnat_sneg_ploha_snega;
      k57p = this.prev.k57_dez_s_sn_babje_psen_ploh_ds;
      k58p = this.prev.k58_toca_sodra_dim;
      params = params.concat([k54p, new Number(7), k55p, new Number(7), k56p, new Number(7), k57p, new Number(7), k58p, (k58p.nval == 3 || k58p.nval >= 5)? new Number(7) : new Number(4)]);
    }
    if (this.k54_dez_rosenje_ploha_dezja.msr && this.k54_dez_rosenje_ploha_dezja.edit()) {
      k54 = this.k54_dez_rosenje_ploha_dezja;
      k55 = this.k55_dez_zmrz_rosen_zmrz_iglice;
      k56 = this.k56_sneg_zrnat_sneg_ploha_snega;
      k57 = this.k57_dez_s_sn_babje_psen_ploh_ds;
      k58 = this.k58_toca_sodra_dim;
      params = params.concat([k54, new Number(7), k55, new Number(7), k56, new Number(7), k57, new Number(7), k58, (k58.nval == 3 || k58.nval >= 5)? new Number(7) : new Number(4)]);
    }
    if (k54p && k55p && k56p && k57p && k58p && k54 && k55 && k56 && k57 && k58) {
			var oblika;
      if (this.k50_oblika_padavin.nval == 1) oblika = this.checkOblika1PojaviK54K55K56K57K58(2, k54, k55, k56, k57, k58, k54p, k55p, k56p, k57p, k58p);
      if (this.k50_oblika_padavin.nval == 2) oblika = this.checkOblika2PojaviK54K55K56K57K58(2, k54, k55, k56, k57, k58, k54p, k55p, k56p, k57p, k58p);
      if (this.k50_oblika_padavin.nval == 3) oblika = this.checkOblika3PojaviK54K55K56K57K58(2, k54, k55, k56, k57, k58, k54p, k55p, k56p, k57p, k58p);
      if (this.k50_oblika_padavin.nval == 4) oblika = this.checkOblika4PojaviK54K55K56K57K58(2, k54, k55, k56, k57, k58, k54p, k55p, k56p, k57p, k58p);
      if (this.k50_oblika_padavin.nval == 5) oblika = this.checkOblika5PojaviK54K55K56K57K58(2, k54, k55, k56, k57, k58, k54p, k55p, k56p, k57p, k58p);
      if (this.k50_oblika_padavin.nval == 6) oblika = this.checkOblika6PojaviK54K55K56K57K58(2, k54, k55, k56, k57, k58, k54p, k55p, k56p, k57p, k58p);
      if (this.k50_oblika_padavin.nval == 7) oblika = this.checkOblika7PojaviK54K55K56K57K58(2, k54, k55, k56, k57, k58, k54p, k55p, k56p, k57p, k58p);
      if (this.k50_oblika_padavin.nval == 8) oblika = this.checkOblika8PojaviK54K55K56K57K58(2, k54, k55, k56, k57, k58, k54p, k55p, k56p, k57p, k58p);
      if (oblika > 0) {
        if (this.k50_oblika_padavin.nval == 1) this.set_warn_params(this.messages.msg_oblika_99, 1, params);
        if (this.k50_oblika_padavin.nval == 2) this.set_warn_params(this.messages.msg_oblika_100, 1, params);
        if (this.k50_oblika_padavin.nval == 3) this.set_warn_params(this.messages.msg_oblika_101, 1, params);
        if (this.k50_oblika_padavin.nval == 4) this.set_warn_params(this.messages.msg_oblika_102, 1, params);
        if (this.k50_oblika_padavin.nval == 5) this.set_warn_params(this.messages.msg_oblika_103, 1, params);
        if (this.k50_oblika_padavin.nval == 6) this.set_warn_params(this.messages.msg_oblika_104, 1, params);
        if (this.k50_oblika_padavin.nval == 7) this.set_warn_params(this.messages.msg_oblika_105, 1, params);
				if (this.k50_oblika_padavin.nval == 8) this.set_warn_params(this.messages.msg_oblika_108B, 1, params);
      }
    }
    else {
			var oblika;
      if (k54p && k55p && k56p && k57p && k58p && !k54 && !k55 && !k56 && !k57 && !k58) {				
				if (this.k50_oblika_padavin.nval == 1) oblika = this.checkOblika1PojaviK54K55K56K57K58(1, k54p, k55p, k56p, k57p, k58p);
				if (this.k50_oblika_padavin.nval == 2) oblika = this.checkOblika2PojaviK54K55K56K57K58(1, k54p, k55p, k56p, k57p, k58p);
				if (this.k50_oblika_padavin.nval == 3) oblika = this.checkOblika3PojaviK54K55K56K57K58(1, k54p, k55p, k56p, k57p, k58p);
				if (this.k50_oblika_padavin.nval == 4) oblika = this.checkOblika4PojaviK54K55K56K57K58(1, k54p, k55p, k56p, k57p, k58p);
				if (this.k50_oblika_padavin.nval == 5) oblika = this.checkOblika5PojaviK54K55K56K57K58(1, k54p, k55p, k56p, k57p, k58p);
				if (this.k50_oblika_padavin.nval == 6) oblika = this.checkOblika6PojaviK54K55K56K57K58(1, k54p, k55p, k56p, k57p, k58p);
				if (this.k50_oblika_padavin.nval == 7) oblika = this.checkOblika7PojaviK54K55K56K57K58(1, k54p, k55p, k56p, k57p, k58p);
				if (this.k50_oblika_padavin.nval == 8) oblika = this.checkOblika8PojaviK54K55K56K57K58(1, k54p, k55p, k56p, k57p, k58p);
      }  
      if (!k54p && !k55p && !k56p && !k57p && !k58p && k54 && k55 && k56 && k57 && k58) { 
        if (this.k50_oblika_padavin.nval == 1) oblika = this.checkOblika1PojaviK54K55K56K57K58(1, k54, k55, k56, k57, k58);
        if (this.k50_oblika_padavin.nval == 2) oblika = this.checkOblika2PojaviK54K55K56K57K58(1, k54, k55, k56, k57, k58);
        if (this.k50_oblika_padavin.nval == 3) oblika = this.checkOblika3PojaviK54K55K56K57K58(1, k54, k55, k56, k57, k58);
        if (this.k50_oblika_padavin.nval == 4) oblika = this.checkOblika4PojaviK54K55K56K57K58(1, k54, k55, k56, k57, k58);
        if (this.k50_oblika_padavin.nval == 5) oblika = this.checkOblika5PojaviK54K55K56K57K58(1, k54, k55, k56, k57, k58);
        if (this.k50_oblika_padavin.nval == 6) oblika = this.checkOblika6PojaviK54K55K56K57K58(1, k54, k55, k56, k57, k58);
        if (this.k50_oblika_padavin.nval == 7) oblika = this.checkOblika7PojaviK54K55K56K57K58(1, k54, k55, k56, k57, k58);
        if (this.k50_oblika_padavin.nval == 8) oblika = this.checkOblika8PojaviK54K55K56K57K58(1, k54, k55, k56, k57, k58);
      }  
      if (!oblika || oblika > 0) {
        if (this.k50_oblika_padavin.nval == 1) this.set_warn_params(this.messages.msg_oblika_99A, 0, params);
        if (this.k50_oblika_padavin.nval == 2) this.set_warn_params(this.messages.msg_oblika_100A, 0, params);
        if (this.k50_oblika_padavin.nval == 3) this.set_warn_params(this.messages.msg_oblika_101A, 0, params);
        if (this.k50_oblika_padavin.nval == 4) this.set_warn_params(this.messages.msg_oblika_102A, 0, params);
        if (this.k50_oblika_padavin.nval == 5) this.set_warn_params(this.messages.msg_oblika_103A, 0, params);
        if (this.k50_oblika_padavin.nval == 6) this.set_warn_params(this.messages.msg_oblika_104A, 0, params);
        if (this.k50_oblika_padavin.nval == 7) this.set_warn_params(this.messages.msg_oblika_105A, 0, params);
      }
    }
  }
}

// ===================================================================//

// kontrole 1,3,5 - klima (pomozna funkcija)
function checkPritiskRazlikaTermin_(pp1, pp2, msg) {
  if (pp1.nval && pp2.nval && Math.abs(pp1.nval - pp2.nval) > 150) this.set_warn_params(msg, 0, [pp1, pp2]);
}

// kontrole 2,4 - klima (pomozna funkcija)
function checkPritiskRazlikaTendenca_(pp1, pp2, pp3, max, msg) {
  if (pp1.nval && pp2.nval && pp3.nval && Math.abs(2 * pp1.nval - pp2.nval - pp3.nval) > max) this.set_warn_params(msg, 0, [pp1, pp2, pp3]);
}

// kontrole 1,2,3,4,5 - klima
function checkPritisk() {
  if (this.prev && !this.prev.k7_pritisk_21h.error) {
    this.checkPritiskRazlikaTermin_(this.prev.k7_pritisk_21h, this.k5_pritisk_7h, this.messages.msg_pp_1);
    this.checkPritiskRazlikaTendenca_(this.k5_pritisk_7h, this.k6_pritisk_14h, this.prev.k7_pritisk_21h, 80, this.messages.msg_pp_2);
  }
  this.checkPritiskRazlikaTermin_(this.k6_pritisk_14h, this.k5_pritisk_7h, this.messages.msg_pp_3);
  this.checkPritiskRazlikaTendenca_(this.k6_pritisk_14h, this.k5_pritisk_7h, this.k7_pritisk_21h, 60, this.messages.msg_pp_4);
  this.checkPritiskRazlikaTermin_(this.k7_pritisk_21h, this.k6_pritisk_14h, this.messages.msg_pp_5);
}

// ===================================================================//

// kontrola 6 - klima
function checkTmaxT21Prev() {
  if (this.prev && !this.prev.k13_temperatura_suhi_21h.error && this.prev.k13_temperatura_suhi_21h.nval && this.k8_maksimalna_temperatura.nval && this.k8_maksimalna_temperatura.nval < this.prev.k13_temperatura_suhi_21h.nval)
		this.set_err_params(this.messages.msg_tmax_6, 0, [this.k8_maksimalna_temperatura, this.prev.k13_temperatura_suhi_21h]);
}

// ===================================================================//

// kontrola 7 - klima
function checkTminT21Prev() {
  if (this.prev && !this.prev.k13_temperatura_suhi_21h.error && this.prev.k13_temperatura_suhi_21h.nval && this.k9_minimalna_temperatura.nval && this.k9_minimalna_temperatura.nval > this.prev.k13_temperatura_suhi_21h.nval)
		this.set_err_params(this.messages.msg_tmin_7, 0, [this.k9_minimalna_temperatura, this.prev.k13_temperatura_suhi_21h]);
}

// ===================================================================//

// kontrola 141 - klima
function checkTmin5T21Prev() {
  if (this.prev && !this.prev.k13_temperatura_suhi_21h.error && this.prev.k13_temperatura_suhi_21h.nval && this.k10_minimalna_temperatura_5cm.nval && this.k10_minimalna_temperatura_5cm.nval > this.prev.k13_temperatura_suhi_21h.nval) 
		this.set_err_params(this.messages.msg_tmin5_141, 0, [this.k10_minimalna_temperatura_5cm, this.prev.k13_temperatura_suhi_21h]);
}

// ===================================================================//

// kontrola 158 - klima
function checkTminTmax() {
  if (this.k8_maksimalna_temperatura.nval && this.k9_minimalna_temperatura.nval && this.k9_minimalna_temperatura.nval > this.k8_maksimalna_temperatura.nval)
    this.set_err_params(this.messages.msg_tmin_158, 0, [this.k9_minimalna_temperatura, this.k8_maksimalna_temperatura]);
}

// ===================================================================//

// kontrola 8 - klima
function checkTmin5Tmin() { 
  if (this.k10_minimalna_temperatura_5cm.nval && this.k9_minimalna_temperatura.nval) {
    var diff = this.k10_minimalna_temperatura_5cm.nval - this.k9_minimalna_temperatura.nval;
		var params = [this.k10_minimalna_temperatura_5cm, this.k9_minimalna_temperatura];
		if (diff > 5 && !this.k13_temperatura_suhi_21h.error && this.k13_temperatura_suhi_21h.nval && this.k13_temperatura_suhi_21h.nval - this.k9_minimalna_temperatura.nval > 25 && (diff > 15  || (diff <= 15 && !this.k52_sneg_novi.error && this.k52_sneg_novi.nval && this.k52_sneg_novi.nval == -1))) {
			params = params.concat([this.k13_temperatura_suhi_21h, this.k52_sneg_novi]);
			this.set_warn_params(this.messages.msg_tmin5_8, 0, params);
		}      
  }
}

// ===================================================================//

// maksimum vrednosti
function getMax(vals) {
  var max = vals[0];
  for (var i = 0; i < vals.length; i++) if (vals[i] > max) max = vals[i];
  return max;  
}

// minimum vrednosti
function getMin(vals) {
  var min = vals[0];
  for (var i = 0; i < vals.length; i++) if (vals[i] < min) min = vals[i];
  return min;  
}

// ===================================================================//

// kontrola 15 - klima
function checkTmaxTerminske() {
  var vals = []; var params = [];  
  if (this.prev && this.prev.k13_temperatura_suhi_21h.nval) {
    if (!this.prev.k13_temperatura_suhi_21h.error) vals[vals.length] = this.prev.k13_temperatura_suhi_21h.nval;
    else return;
  }    
  if (this.k11_temperatura_suhi_7h.nval) vals[vals.length] = this.k11_temperatura_suhi_7h.nval;
  if (this.k12_temperatura_suhi_14h.nval) vals[vals.length] = this.k12_temperatura_suhi_14h.nval;
  if (this.k13_temperatura_suhi_21h.nval) vals[vals.length] = this.k13_temperatura_suhi_21h.nval;
  if (vals.length > 0 && this.k8_maksimalna_temperatura.nval) {
		var diff = this.k8_maksimalna_temperatura.nval - getMax(vals);
		var params = [this.k8_maksimalna_temperatura, this.k11_temperatura_suhi_7h, this.k12_temperatura_suhi_14h, this.k13_temperatura_suhi_21h];
		if (this.prev) params[params.length] = this.prev.k13_temperatura_suhi_21h;
		if (diff >= 80) this.set_warn_params(this.messages.msg_tmax_15b, 0, params);
		else if (diff < 80 && diff >= 50 && !this.k54_dez_rosenje_ploha_dezja.error && !this.k54_dez_rosenje_ploha_dezja.equals(1, 3, 4, 5, 7)) {
			params = params.concat([this.k54_dez_rosenje_ploha_dezja, new Number(4)]);
			this.set_warn_params(this.messages.msg_tmax_15a, 0, params);
		}
  }
}

// ===================================================================//

// kontrola 16 - klima
function checkTminTerminske() {
  var vals = []; var params = [];  
  if (this.prev && this.prev.k13_temperatura_suhi_21h.nval) {
    if (!this.prev.k13_temperatura_suhi_21h.error) vals[vals.length] = parseInt(this.prev.k13_temperatura_suhi_21h.nval);
    else return;
  }                                                                                   
  if (this.k11_temperatura_suhi_7h.nval) vals[vals.length] = parseInt(this.k11_temperatura_suhi_7h.nval);
  if (this.k12_temperatura_suhi_14h.nval) vals[vals.length] = parseInt(this.k12_temperatura_suhi_14h.nval);
  if (this.k13_temperatura_suhi_21h.nval) vals[vals.length] = parseInt(this.k13_temperatura_suhi_21h.nval);
  if (vals.length > 0 && this.k9_minimalna_temperatura.nval) {
		var diff = getMin(vals) - parseInt(this.k9_minimalna_temperatura.nval);
		var params = [this.k9_minimalna_temperatura, this.k11_temperatura_suhi_7h, this.k12_temperatura_suhi_14h, this.k13_temperatura_suhi_21h];
		if (this.prev) params[params.length] = this.prev.k13_temperatura_suhi_21h;
		if ((this.mesec <= 2 || this.mesec >= 10) && diff > 60) this.set_warn_params(this.messages.msg_tmin_16a, 0, params);
		if ((this.mesec == 3 || this.mesec == 4 || this.parent.mesec == 9) && diff > 80) this.set_warn_params(this.messages.msg_tmin_16b, 0, params);
		if (this.mesec >= 5 && this.mesec <= 8 && diff > 90) this.set_warn_params(this.messages.msg_tmin_16c, 0, params);
  }
}

// ===================================================================//

// kontrole 20,21,22 - klima (pomozna funkcija)
function checkTmokriTsuhiDeficit_(tmokri, tsuhi, msg) {
  if (tmokri.nval && tsuhi.nval && tsuhi.nval < 0) {
    var r = (tsuhi.nval < -200)? 10 : parseInt(0.2 * tsuhi.nval + 50);
    if (tsuhi.nval - tmokri.nval > r) this.set_warn_params(msg, 0, [tsuhi, tmokri]);   
  }
}

// kontrole 20,21,22 - klima
function checkTmokriTsuhiDeficit() {
  this.checkTmokriTsuhiDeficit_(this.k14_temperatura_mokri_7h, this.k11_temperatura_suhi_7h, this.messages.msg_tm_20);
  this.checkTmokriTsuhiDeficit_(this.k15_temperatura_mokri_14h, this.k12_temperatura_suhi_14h, this.messages.msg_tm_21);
  this.checkTmokriTsuhiDeficit_(this.k16_temperatura_mokri_21h, this.k13_temperatura_suhi_21h, this.messages.msg_tm_22);
}

// ===================================================================//

// kontrole 23,24,25,26,27 - klima (pomozna funkcija)
function checkTmokriTsuhiSpremembe_(tmokri1, tmokri2, tsuhi1, tsuhi2, cmp, msg1, msg2) {
  if (tmokri1.nval && tmokri2.nval && tsuhi1.nval && tsuhi2.nval) {
    var diff1 = tsuhi1.nval - tsuhi2.nval;
    var diff2 = tmokri1.nval - tmokri2.nval;
    if (cmp == 1 && Math.abs(diff1  - diff2) > 60) this.set_warn_params(msg1, 0, [tmokri1, tmokri2, tsuhi1, tsuhi2]);
    if (cmp == 2) {
      if (Math.abs(diff1) >= 100 && Math.abs(diff1 - diff2) > 110) this.set_warn_params(msg1, 0, [tmokri1, tmokri2, tsuhi1, tsuhi2]);
      if (Math.abs(diff1) < 50 && Math.abs(diff1 - diff2) > 55 || Math.abs(diff1) >= 50 && Math.abs(diff1) < 100 && Math.abs(diff1 - diff2) > Math.abs(diff1) * 1.1) this.set_warn_params(msg2, 0, [tmokri1, tmokri2, tsuhi1, tsuhi2]);
    }
  }
}

// kontrole 23,24,25,26,27 - klima
function checkTmokriTsuhiSpremembe() {
  if (this.prev) { 
    if (!this.prev.k16_temperatura_mokri_21h.error && !this.prev.k14_temperatura_mokri_7h.error) this.checkTmokriTsuhiSpremembe_(this.prev.k16_temperatura_mokri_21h, this.k14_temperatura_mokri_7h, this.prev.k13_temperatura_suhi_21h, this.k11_temperatura_suhi_7h, 1, this.messages.msg_tm_23);
    else return;                                                        
  }
  this.checkTmokriTsuhiSpremembe_(this.k14_temperatura_mokri_7h, this.k15_temperatura_mokri_14h, this.k11_temperatura_suhi_7h, this.k12_temperatura_suhi_14h, 2, this.messages.msg_tm_24, this.messages.msg_tm_25);
  this.checkTmokriTsuhiSpremembe_(this.k15_temperatura_mokri_14h, this.k16_temperatura_mokri_21h, this.k12_temperatura_suhi_14h, this.k13_temperatura_suhi_21h, 2, this.messages.msg_tm_26, this.messages.msg_tm_27);
}

// ===================================================================//

// kontrole 9,11,13 - klima (pomozna funkcija)
function checkTsuhiTmax_(tsuhi, msg) {  
  if (tsuhi.nval && this.k8_maksimalna_temperatura.nval && tsuhi.nval > this.k8_maksimalna_temperatura.nval) this.set_err_params(msg, 0, [tsuhi, this.k8_maksimalna_temperatura]);
}

// kontrole 10,12,14 - klima (pomozna funkcija)
function checkTsuhiTmin_(tsuhi, msg) {  
  if (tsuhi.nval && this.k9_minimalna_temperatura.nval && tsuhi.nval < this.k9_minimalna_temperatura.nval) this.set_err_params(msg, 0, [tsuhi, this.k9_minimalna_temperatura]);
}

// kontrole 9,10,11,12,13,14 - klima
function checkTsuhiTminTmax() {
  this.checkTsuhiTmax_(this.k11_temperatura_suhi_7h, this.messages.msg_ts_9);
  this.checkTsuhiTmin_(this.k11_temperatura_suhi_7h, this.messages.msg_ts_10);
  this.checkTsuhiTmax_(this.k12_temperatura_suhi_14h, this.messages.msg_ts_11);
  this.checkTsuhiTmin_(this.k12_temperatura_suhi_14h, this.messages.msg_ts_12);
  this.checkTsuhiTmax_(this.k13_temperatura_suhi_21h, this.messages.msg_ts_13);
  this.checkTsuhiTmin_(this.k13_temperatura_suhi_21h, this.messages.msg_ts_14);
}

// ===================================================================//

// kontrole 28,29,30 - klima (pomozna funkcija)
function checkLed0Tmokri_(led, tmokri, msg) {
  if (led.nval && tmokri.nval && led.nval == 0 && tmokri.nval < -50) this.set_warn_params(msg, 0, [led, tmokri]);
}

// kontrole 28,29,30 - klima
function checkLed0Tmokri() {
  this.checkLed0Tmokri_(this.k17_led_7h, this.k14_temperatura_mokri_7h, this.messages.msg_led_28);
  this.checkLed0Tmokri_(this.k18_led_14h, this.k15_temperatura_mokri_14h, this.messages.msg_led_29);
  this.checkLed0Tmokri_(this.k19_led_21h, this.k16_temperatura_mokri_21h, this.messages.msg_led_30);
}

// ===================================================================//

// kontrole 31,32,33 - klima (pomozna funkcija)
function checkLed1Tmokri_(led, tmokri, msg) {
  if (led.nval && tmokri.nval && tmokri.nval >= 0 && led.nval == 1) this.set_err_params(msg, 0, [led, tmokri]);
}

// kontrole 31,32,33 - klima
function checkLed1Tmokri() {
  this.checkLed1Tmokri_(this.k17_led_7h, this.k14_temperatura_mokri_7h, this.messages.msg_led_31);
  this.checkLed1Tmokri_(this.k18_led_14h, this.k15_temperatura_mokri_14h, this.messages.msg_led_32);
  this.checkLed1Tmokri_(this.k19_led_21h, this.k16_temperatura_mokri_21h, this.messages.msg_led_33);
}

// ===================================================================//

// kontrole 17,18,19,34,35,36 - klima (pomozna funkcija)
function checkLedTmokriTsuhi_(led, tmokri, tsuhi, msg1, msg2) {
  if (led.nval && tmokri.nval && tsuhi.nval) {
    if (led.nval == 0 && tmokri.nval > tsuhi.nval) this.set_err_params(msg1, 0, [led, tmokri, tsuhi]);
    if (led.nval == 1 && tmokri.nval < 0) {
      var diff = tmokri.nval - tsuhi.nval;
      if (diff > 0 && tsuhi.nval > -16 || diff > 1 && tsuhi.nval > -41 || diff > 2 && tsuhi.nval > -78 || diff > 3) this.set_err_params(msg2, 0, [led, tmokri, tsuhi]);      
    }
  }
}

// kontrole 17,18,19,34,35,36 - klima
function checkLedTmokriTsuhi() {
  this.checkLedTmokriTsuhi_(this.k17_led_7h, this.k14_temperatura_mokri_7h, this.k11_temperatura_suhi_7h, this.messages.msg_led_17, this.messages.msg_led_34);
  this.checkLedTmokriTsuhi_(this.k18_led_14h, this.k15_temperatura_mokri_14h, this.k12_temperatura_suhi_14h, this.messages.msg_led_18, this.messages.msg_led_35);
  this.checkLedTmokriTsuhi_(this.k19_led_21h, this.k16_temperatura_mokri_21h, this.k13_temperatura_suhi_21h, this.messages.msg_led_19, this.messages.msg_led_36);
}

// ===================================================================//

// kontrole 46,47,48 - klima (pomozna funkcija)
function checkRelVlagaPsihro_(tsuhi, tmokri, led, pritisk, msg) {
  var pp = (pritisk.nval)? pritisk.nval : this.pavg;
  var postaja = this.postaja;
  if (tsuhi.nval && tmokri.nval && led.nval) {
    var psihro = getRhPsihro(tsuhi.nval, led.nval, tmokri.nval, pp).rh;
    var min = (postaja == 3 || postaja == 48 || postaja == 437)? 0 : 10;
    if (psihro < min || psihro > 100) 	this.set_err_params(msg, 0, [tsuhi, tmokri, led, pritisk], "Relativna vlaga po psihrometru: " + psihro + "%, " + ((psihro < min)? ("min: " + min) : "max: 100") + "%."); 
  }
}

// kontrole 46,47,48 - klima
function checkRelVlagaPsihro() {
  this.checkRelVlagaPsihro_(this.k11_temperatura_suhi_7h, this.k14_temperatura_mokri_7h, this.k17_led_7h, this.k5_pritisk_7h, this.messages.msg_rh_46);
  this.checkRelVlagaPsihro_(this.k12_temperatura_suhi_14h, this.k15_temperatura_mokri_14h, this.k18_led_14h, this.k6_pritisk_14h, this.messages.msg_rh_47);
  this.checkRelVlagaPsihro_(this.k13_temperatura_suhi_21h, this.k16_temperatura_mokri_21h, this.k19_led_21h, this.k7_pritisk_21h, this.messages.msg_rh_48);
}

// ===================================================================//

// kontrole 135,136,137 - klima (pomozna funkcija)
function checkPritiskVodnePare_(tsuhi1, tmokri1, led1, pritisk1, tsuhi2, tmokri2, led2, pritisk2, msg) {
  var pp1 = (pritisk1.nval)? pritisk1.nval : this.pavg;
  var pp2 = (pritisk2.nval)? pritisk2.nval : this.pavg;
  if (tsuhi1.nval && tmokri1.nval && led1.nval && tsuhi2.nval && tmokri2.nval && led2.nval) {
    var vp1 = getRhPsihro(tsuhi1.nval, led1.nval, tmokri1.nval, pp1).vp;
    var vp2 = getRhPsihro(tsuhi2.nval, led2.nval, tmokri2.nval, pp2).vp;     
    if (Math.abs(vp2 - vp1) > 1.0 * getMax([vp2, vp1])) 
			this.set_err_params(msg, 0, [tsuhi1, tmokri1, led1, pritisk1, tsuhi2, tmokri2, led2, pritisk2], "Delni pritisk vodne pare ob " + tsuhi1.name.split("_")[3] + ": " + parseFloat(Math.round(vp1 * 10000) + "e-4") + ", " + "delni pritisk vodne pare ob " + tsuhi2.name.split("_")[3] + ": " + parseFloat(Math.round(vp2 * 10000) + "e-4") + "."); 
  }
}

// kontrole 135,136,137 - klima
function checkPritiskVodnePare() {
  if (this.prev && !this.prev.k13_temperatura_suhi_21h.error && !this.prev.k16_temperatura_mokri_21h.error && !this.prev.k19_led_21h.error && !this.prev.k7_pritisk_21h.error) 
		this.checkPritiskVodnePare_(this.prev.k13_temperatura_suhi_21h, this.prev.k16_temperatura_mokri_21h, this.prev.k19_led_21h, this.prev.k7_pritisk_21h, this.k11_temperatura_suhi_7h, this.k14_temperatura_mokri_7h, this.k17_led_7h, this.k5_pritisk_7h, this.messages.msg_rh_135);  
  this.checkPritiskVodnePare_(this.k11_temperatura_suhi_7h, this.k14_temperatura_mokri_7h, this.k17_led_7h, this.k5_pritisk_7h, this.k12_temperatura_suhi_14h, this.k15_temperatura_mokri_14h, this.k18_led_14h, this.k6_pritisk_14h, this.messages.msg_rh_136);
  this.checkPritiskVodnePare_(this.k12_temperatura_suhi_14h, this.k15_temperatura_mokri_14h, this.k18_led_14h, this.k6_pritisk_14h,this.k13_temperatura_suhi_21h, this.k16_temperatura_mokri_21h, this.k19_led_21h, this.k7_pritisk_21h, this.messages.msg_rh_137);
}

// ===================================================================//

// kontrole 49,50,51 - klima (pomozna funkcija)
function checkRelVlagaPsihroRelVlagaHigro_(tsuhi, tmokri, led, pritisk, higro, msg) {
  if (this.leto >= 1992) {
    var pp = (pritisk.nval)? pritisk.nval : Math.round(this.pavg); // pritisk v mmhg; 777.7 --> 7777 kot je vnesen v formo - v desetinah
		if (tsuhi.nval && tmokri.nval && led.nval && higro.nval) {
			var psihro = getRhPsihro(tsuhi.nval, led.nval, tmokri.nval, pp).rh;
      var diff = Math.abs(psihro - higro.nval);			
      if (tsuhi.nval > -100 && diff >= (5 + 160 / (30 + tsuhi.nval * 0.1)) || tsuhi.nval <= -100 && diff >= 20) 
				this.set_warn_params(msg, 0, [tsuhi, tmokri, led, pritisk, higro], "Relativna vlaga po psihrometru: " + psihro + "%, relativna vlaga po higrometru: " + higro.nval + "%.");
    }
  }
}

// kontrole 49,50,51 - klima
function checkRelVlagaPsihroRelVlagaHigro() {
  this.checkRelVlagaPsihroRelVlagaHigro_(this.k11_temperatura_suhi_7h, this.k14_temperatura_mokri_7h, this.k17_led_7h, this.k5_pritisk_7h, this.k20_rel_vlaga_7h, this.messages.msg_rh_49);
  this.checkRelVlagaPsihroRelVlagaHigro_(this.k12_temperatura_suhi_14h, this.k15_temperatura_mokri_14h, this.k18_led_14h, this.k6_pritisk_14h, this.k21_rel_vlaga_14h, this.messages.msg_rh_50);
  this.checkRelVlagaPsihroRelVlagaHigro_(this.k13_temperatura_suhi_21h, this.k16_temperatura_mokri_21h, this.k19_led_21h, this.k7_pritisk_21h, this.k22_rel_vlaga_21h, this.messages.msg_rh_51);
}

// ===================================================================//

// kontrole 58,59,60,61,62,63 - klima (pomozna funkcija)
function checkSmerHitrostVetra_(smer, hitrost, msg1, msg2) {
  if (hitrost.msr && hitrost.edit() && smer.nval && hitrost.nval) {
		if (smer.nval == 0 && hitrost.nval > 0) this.set_err_params(msg1, 0, [smer, hitrost]);   
    if (smer.nval > 0 && hitrost.nval == 0) this.set_err_params(msg2, 0, [smer, hitrost]);
  }
}

// kontrole 58,59,60,61,62,63 - klima
function checkSmerHitrostVetra() {
  this.checkSmerHitrostVetra_(this.k33_smer_vetra_7h, this.k34_hitrost_vetra_7h,  this.messages.msg_hitrost_61, this.messages.msg_smer_58);
  this.checkSmerHitrostVetra_(this.k35_smer_vetra_14h, this.k36_hitrost_vetra_14h, this.messages.msg_hitrost_62, this.messages.msg_smer_59);
  this.checkSmerHitrostVetra_(this.k37_smer_vetra_21h, this.k38_hitrost_vetra_21h, this.messages.msg_hitrost_63, this.messages.msg_smer_60);
}

// ===================================================================//

// kontrole 58J,59J,60J,61J,62J,63J - klima (pomozna funkcija)
function checkSmerJakostVetra_(smer, jakost, msg1, msg2) {
  if (jakost.msr && jakost.edit() && smer.nval && jakost.nval) {
		if (smer.nval == 0 && jakost.nval > 0) this.set_err_params(msg1, 0, [smer, jakost]);
		if (smer.nval > 0 && jakost.nval == 0) this.set_err_params(msg2, 0, [smer, jakost]);
  }
}

// kontrole 58J,59J,60J,61J,62J,63J - klima
function checkSmerJakostVetra() {
  this.checkSmerJakostVetra_(this.k33_smer_vetra_7h, this.k34_jakost_vetra_7h, this.messages.msg_jakost_61J, this.messages.msg_smer_58J);
  this.checkSmerJakostVetra_(this.k35_smer_vetra_14h, this.k36_jakost_vetra_14h, this.messages.msg_jakost_62J, this.messages.msg_smer_59J);
  this.checkSmerJakostVetra_(this.k37_smer_vetra_21h, this.k38_jakost_vetra_21h, this.messages.msg_jakost_63J, this.messages.msg_smer_60J);
}

// ===================================================================//

// kontrola 67 - klima
function checkTlaTsuhi7() {
  if (this.k39_stanje_tal_7h.nval && this.k11_temperatura_suhi_7h.nval  && this.k39_stanje_tal_7h.nval == 3 && this.k11_temperatura_suhi_7h.nval > 30)
		this.set_warn_params(this.messages.msg_tla_67, 0, [this.k39_stanje_tal_7h, this.k11_temperatura_suhi_7h]);
}

// ===================================================================//

// kontrola 68 - klima
function checkTlaTsuhi14() {
  if (this.k40_stanje_tal_14h.nval && this.k12_temperatura_suhi_14h.nval && this.k40_stanje_tal_14h.nval == 3 && this.k12_temperatura_suhi_14h.nval > 0) {
    var params = [this.k40_stanje_tal_14h, this.k12_temperatura_suhi_14h];
    if (this.k12_temperatura_suhi_14h.nval > 30) this.set_warn_params(this.messages.msg_tla_68, 0, params);
    else if (!this.k39_stanje_tal_7h.error && this.k39_stanje_tal_7h.nval && this.k39_stanje_tal_7h.nval != 3) {
			params[params.length] = this.k39_stanje_tal_7h;
			this.set_warn_params(this.messages.msg_tla_68, 0, params);
    }
  }
}

// ===================================================================//

// kontrola 69 - klima
function checkTlaTsuhi21() {
  if (this.k41_stanje_tal_21h.nval && this.k13_temperatura_suhi_21h.nval && this.k41_stanje_tal_21h.nval == 3 && this.k13_temperatura_suhi_21h.nval > 20) 
		this.set_warn_params(this.messages.msg_tla_69, 0, [this.k41_stanje_tal_21h, this.k13_temperatura_suhi_21h]);
}

// ===================================================================//

// kontrola 70,71,72 - klima (pomozna funkcija)
function checkTlaZaporedniTermini_(tla1, tla2, msg) {
  if (tla1.nval && tla2.nval && tla1.nval == 2 && tla2.nval == 0) this.set_warn_params(msg, 0, [tla1, tla2]);
}

// kontrola 70,71,72 - klima
function checkTlaZaporedniTermini() {
  if (this.prev && !this.prev.k41_stanje_tal_21h.error) this.checkTlaZaporedniTermini_(this.prev.k41_stanje_tal_21h, this.k39_stanje_tal_7h, this.messages.msg_tla_70);
  this.checkTlaZaporedniTermini_(this.k39_stanje_tal_7h, this.k40_stanje_tal_14h, this.messages.msg_tla_71);
  this.checkTlaZaporedniTermini_(this.k40_stanje_tal_14h, this.k41_stanje_tal_21h, this.messages.msg_tla_72);
}

// ===================================================================//

// kontrola 37 - klima
function checkSonceOblacnost() {
  if (this.k45_trajanje_sonca.nval && this.k46_oblacnost_7h.nval && this.k47_oblacnost_14h.nval && this.k48_oblacnost_21h.nval && this.k45_trajanje_sonca.nval == 0 && (this.k46_oblacnost_7h.nval + this.k47_oblacnost_14h.nval + this.k48_oblacnost_21h.nval < 10)) 
		this.set_err_params(this.messages.msg_son_37, 0, [this.k45_trajanje_sonca, this.k46_oblacnost_7h, this.k47_oblacnost_14h, this.k48_oblacnost_21h]);
}

// ===================================================================//

// kontrole 86,87 - klima
function checkSsnegTla7() {
  if (this.k51_sneg_skupaj.nval && this.k39_stanje_tal_7h.nval) {
    if (this.k51_sneg_skupaj.nval > 0 && this.k39_stanje_tal_7h.nval < 6) this.set_err_params(this.messages.msg_ss_86, 0, [this.k51_sneg_skupaj, this.k39_stanje_tal_7h]);
    if (this.k51_sneg_skupaj.nval <= 0 && this.k39_stanje_tal_7h.nval > 5) this.set_err_params(this.messages.msg_ss_87, 0, [this.k51_sneg_skupaj, this.k39_stanje_tal_7h]);
  }
}

// ===================================================================//

// kontrola 90 - klima
function checkNsnegVisinaTminTmaxPrev() {
  if (this.prev && !this.prev.k8_maksimalna_temperatura.error && !this.prev.k9_minimalna_temperatura.error && this.k52_sneg_novi.nval && this.k49_padavine.nval && this.prev.k8_maksimalna_temperatura.nval && this.prev.k9_minimalna_temperatura.nval && this.k52_sneg_novi.nval > this.k49_padavine.nval / 10 + 5 && (this.prev.k8_maksimalna_temperatura.nval + this.prev.k9_minimalna_temperatura.nval) / 2 > -30)
		this.set_warn_params(this.messages.msg_sn_90, 0, [this.k52_sneg_novi, this.k49_padavine, this.prev.k8_maksimalna_temperatura, this.prev.k9_minimalna_temperatura]);
}

// ===================================================================//

// kontrola 96 - klima
function checkTmaxPojaviK54K58() {
  if (this.k8_maksimalna_temperatura.nval && this.k8_maksimalna_temperatura.nval < 5) {
    var params = [this.k8_maksimalna_temperatura];
    if (!this.k54_dez_rosenje_ploha_dezja.equals(null, 0)) params[params.length] =  this.k54_dez_rosenje_ploha_dezja;
    if (!this.k58_toca_sodra_dim.equals(null, 0, 3)) params[params.length] =  this.k58_toca_sodra_dim;
    if (params.length > 1) this.set_warn_params(this.messages.msg_tmax_96, 0, params);
  }
}

// ===================================================================//

// kontrola 97 - klima
function checkPojaviK55K56K57TminPrevisoka() {
  if (this.k9_minimalna_temperatura.nval && this.k9_minimalna_temperatura.nval > 50) {
    var params = [this.k9_minimalna_temperatura];
    if (!this.k55_dez_zmrz_rosen_zmrz_iglice.equals(null, 0)) params[params.length] = this.k55_dez_zmrz_rosen_zmrz_iglice;
    if (!this.k56_sneg_zrnat_sneg_ploha_snega.equals(null, 0)) params[params.length] = this.k56_sneg_zrnat_sneg_ploha_snega;
    if (!this.k57_dez_s_sn_babje_psen_ploh_ds.equals(null, 0)) params[params.length] = this.k57_dez_s_sn_babje_psen_ploh_ds;
    if (params.length > 1) this.set_err_params(this.messages.msg_tmin_97, 0, params);
  }
}

// ===================================================================//

// kontrola 106 - klima
function checkPojaviK55K56K57TminPrenizka() {
  if (this.k9_minimalna_temperatura.nval && this.k9_minimalna_temperatura.nval > 20) {
    var params = [this.k9_minimalna_temperatura];
    if (this.k55_dez_zmrz_rosen_zmrz_iglice.equals(3)) params[params.length] = this.k55_dez_zmrz_rosen_zmrz_iglice;
    if (!this.k56_sneg_zrnat_sneg_ploha_snega.equals(null, 0)) params[params.length] = this.k56_sneg_zrnat_sneg_ploha_snega;
    if (!this.k57_dez_s_sn_babje_psen_ploh_ds.equals(null, 0)) params[params.length] = this.k57_dez_s_sn_babje_psen_ploh_ds;
    if (params.length > 1) this.set_err_params(this.messages.msg_tmin_106, 0, params);
  }
}

// ===================================================================//

// kontrola 113 - klima
/*
function checkVidnostPojaviK54K56K57K59() {
  var k42 = this.k42_vidnost_7h;
  var k43 = this.k43_vidnost_14h;
  var k44 = this.k44_vidnost_21h;  
  var k59 = this.k59_megla_megla_z_vid_neb_led_m;
  var k54 = this.k54_dez_rosenje_ploha_dezja;
  var k56 = this.k56_sneg_zrnat_sneg_ploha_snega;
  var k57 = this.k57_dez_s_sn_babje_psen_ploh_ds; 
  if ((k42.nval && k42.nval <= 3 || k43.nval && k43.nval <= 3 || k44.nval && k44.nval <= 3) && k59.equals(null, 0) && k54.equals(null, 0) && k56.equals(null, 0) && k57.equals(null, 0)) 
		this.set_warn_params(this.messages.msg_vid_113, 0, [k42, k43, k44, k59, new Number(7), k54, new Number(7), k56, new Number(7), k57, new Number(7)]);
}
*/
function checkVidnostPojaviK54K56K57K59() {
  var k59 = this.k59_megla_megla_z_vid_neb_led_m;
  var k54 = this.k54_dez_rosenje_ploha_dezja;
  var k56 = this.k56_sneg_zrnat_sneg_ploha_snega;
  var k57 = this.k57_dez_s_sn_babje_psen_ploh_ds; 	
	var params = [];
	if (this.k42_vidnost_7h.nval && this.k42_vidnost_7h.nval <= 3) params[params.length] = this.k42_vidnost_7h;
	if (this.k43_vidnost_14h.nval && this.k43_vidnost_14h.nval <= 3) params[params.length] = this.k43_vidnost_14h;
	if (this.k44_vidnost_21h.nval && this.k44_vidnost_21h.nval <= 3) params[params.length] = this.k44_vidnost_21h;
	if (params.length > 0 && k59.equals(null, 0) && k54.equals(null, 0) && k56.equals(null, 0) && k57.equals(null, 0)) { 
		params = params.concat([k59, new Number(7), k54, new Number(7), k56, new Number(7), k57, new Number(7)]);
		this.set_warn_params(this.messages.msg_vid_113, 0, params);
	}
}

// ===================================================================//

// kontrola 114 - klima
/*
function checkVidnostPojaviK54K56K57K60() {
  var k42 = this.k42_vidnost_7h;
  var k43 = this.k43_vidnost_14h;
  var k44 = this.k44_vidnost_21h;  
  var k60 = this.k60_meglic_suha_motnost_talna_m;
  var k54 = this.k54_dez_rosenje_ploha_dezja;
  var k56 = this.k56_sneg_zrnat_sneg_ploha_snega;
  var k57 = this.k57_dez_s_sn_babje_psen_ploh_ds;
  if ((k42.nval && k42.nval >= 4 && k42.nval <= 6 || k43.nval && k43.nval >= 4 && k43.nval <= 6 || k44.nval && k44.nval >= 4 && k44.nval <= 6) && k60.equals(null, 0, 3) && k54.equals(null, 0) && k56.equals(null, 0) && k57.equals(null, 0))
		this.set_warn_params(this.messages.msg_vid_114, 0, [k42, k43, k44, k60, new Number(4), k54, new Number(7), k56, new Number(7), k57, new Number(7)]);    
}
*/
function checkVidnostPojaviK54K56K57K60() {
  var k60 = this.k60_meglic_suha_motnost_talna_m;
  var k54 = this.k54_dez_rosenje_ploha_dezja;
  var k56 = this.k56_sneg_zrnat_sneg_ploha_snega;
  var k57 = this.k57_dez_s_sn_babje_psen_ploh_ds;
	var params = [];
  if (this.k42_vidnost_7h.nval && this.k42_vidnost_7h.nval >= 4 && this.k42_vidnost_7h.nval <= 6) params[params.length] = this.k42_vidnost_7h;
	if (this.k43_vidnost_14h.nval && this.k43_vidnost_14h.nval >= 4 && this.k43_vidnost_14h.nval <= 6) params[params.length] = this.k43_vidnost_14h;
	if (this.k44_vidnost_21h.nval && this.k44_vidnost_21h.nval >= 4 && this.k44_vidnost_21h.nval <= 6) params[params.length] = this.k44_vidnost_21h;
	if (params.length > 0 && k60.equals(null, 0, 3) && k54.equals(null, 0) && k56.equals(null, 0) && k57.equals(null, 0)) {
		params = params.concat([k60, new Number(4), k54, new Number(7), k56, new Number(7), k57, new Number(7)]);
		this.set_warn_params(this.messages.msg_vid_114, 0, params);
	}
}
// ===================================================================//

// kontrola 115 - klima
function checkTlaTsuhi7Tmin5PojaviK61() {
  var k61 = this.k61_rosa_slana_prsec_z_vodne_p_;
  var k39 = this.k39_stanje_tal_7h;
  var k41 = this.k41_stanje_tal_21h;
  var k10 = this.k10_minimalna_temperatura_5cm;
  var k11 = this.k11_temperatura_suhi_7h;  
  var k13 = this.k13_temperatura_suhi_21h;
  if (k61.equals(1) && (k39.nval && k39.nval > 2 || k11.nval && k11.nval < 10 || k10.nval && k10.nval < -5) && !(k41.nval && k41.nval <= 2 && k13.nval && k13.nval > 0)) 
		this.set_warn_params(this.messages.msg_tla_115, 0, [k61, k39, k11, k10, k41]);    
}

// ===================================================================//

// kontrola 116 - klima
function checkTminTmin5PojaviK61() {  
  var k61 = this.k61_rosa_slana_prsec_z_vodne_p_;
  var k9 = this.k9_minimalna_temperatura;
  var k10 = this.k10_minimalna_temperatura_5cm;
  if (k61.equals(2) && (k9.nval && k9.nval > 50 || k10.nval && k10.nval > 0)) this.set_warn_params(this.messages.msg_tmin_116, 0, [k61, k9, k10]);
}

// ===================================================================//

// kontrola 118 - klima
function checkTminTmin5PojaviK62() {
  var k62 = this.k62_poledica_zled_poled__na_tl_;
  var k9 = this.k9_minimalna_temperatura;
  var k10 = this.k10_minimalna_temperatura_5cm;  
  if (!k62.equals(null, 0) && (k9.nval && k9.nval > 10 || k10.nval && k10.nval > 0)) this.set_warn_params(this.messages.msg_tmin_118, 0, [k62, k9, k10]);
}

// ===================================================================//

// kontrola 121 - klima
function checkTminPojaviK59K63() {
  var k59 = this.k59_megla_megla_z_vid_neb_led_m;
  var k63 = this.k63_ivje_trdo_ivje_elijev_og_;
  var k9 = this.k9_minimalna_temperatura;
	if (k63.equals(1, 4) && k9.nval && k9.nval > -30) {
		if (!this.prev && !k59.equals(null, 0)) this.set_warn_params(this.messages.msg_tmin_121, 0, [k63, k9, k59]);
		else if (this.prev && !this.k59_megla_megla_z_vid_neb_led_m.errror && (!k59.equals(null, 0) || !this.prev.k59_megla_megla_z_vid_neb_led_m.equals(null, 0))) 
			this.set_warn_params(this.messages.msg_tmin_121, 0, [k63, k9, k59, this.prev.k59_megla_megla_z_vid_neb_led_m]);
	}
}

// ===================================================================//

// kontrola 122 - klima
function checkTminTmin5PojaviK59K63() {
  var k59 = this.k59_megla_megla_z_vid_neb_led_m;
  var k63 = this.k63_ivje_trdo_ivje_elijev_og_;
  var k9 = this.k9_minimalna_temperatura;
  var k10 = this.k10_minimalna_temperatura_5cm;
  if (this.prev && !this.k59_megla_megla_z_vid_neb_led_m.errror && k63.equals(1, 4) && k9.nval && k9.nval > -30 && k10.nval && k10.nval > -60 && k59.equals(null, 0) && this.prev.k59_megla_megla_z_vid_neb_led_m.equals(null, 0)) 
		this.set_warn_params(this.messages.msg_tmin_122, 0, [k63, k9, k10, k59, new Number(7), this.prev.k59_megla_megla_z_vid_neb_led_m, new Number(7)]);
}

// ===================================================================//

// kontrola 123,123J - klima
function checkTminPojaviK59K63K65() {
  var k9 = this.k9_minimalna_temperatura; 
  var k63 = this.k63_ivje_trdo_ivje_elijev_og_;
  var k59 = this.k59_megla_megla_z_vid_neb_led_m;
  var k65 = this.k65_mocan_veter_6bf_8bf;
  if (k63.equals(2, 4)) {
    var hitrost = 0, jakost = 0;
    if (this.k34_hitrost_vetra_7h.msr) {
      var k34 = this.k34_hitrost_vetra_7h; 
      var k36 = this.k36_hitrost_vetra_14h; 
      var k38 = this.k38_hitrost_vetra_21h;      
      if (k34.nval && k34.nval < 55 && k36.nval && k36.nval < 55 && k38.nval && k38.nval < 55) hitrost = 1;
    } 
    if (this.k34_jakost_vetra_7h.msr) {
      var k34 = this.k34_jakost_vetra_7h; 
      var k36 = this.k36_jakost_vetra_14h; 
      var k38 = this.k38_jakost_vetra_21h;
      if (k34.nval && k34.nval < 4 && k36.nval && k36.nval < 4 && k38.nval && k38.nval < 4) jakost = 1;
    }    
    if (k9.nval && k9.nval > 0 || k59.equals(null, 0) || !k65.equals(1, 4, 5, 7) && (jakost == 1 || hitrost == 1)) {
      var params = [k63, k9, k59, (!k59.equals(null, 0))? new Number(k59.nval) : new Number(7), k65, (k65.equals(1, 4, 5, 7))? new Number(k65.setXval(1)) : new Number(4)];
      if (k65.equals(null, 0, 3) && this.k34_jakost_vetra_7h.msr && jakost == 1) 
				params = params.concat([this.k34_jakost_vetra_7h, this.k36_jakost_vetra_14h, this.k38_jakost_vetra_21h]);
      else params = params.concat([this.k34_hitrost_vetra_7h, this.k36_hitrost_vetra_14h, this.k38_hitrost_vetra_21h]);
      if (k65.equals(null, 0, 3) && this.k34_jakost_vetra_7h.msr && jakost == 1) this.set_warn_params(this.messages.msg_tivje_123J, 0, params); 
      else this.set_warn_params(this.messages.msg_tivje_123, 0, params);
    }
  }
}

// ===================================================================//

// kontrole 124,124A - klima
function checkHitrostPod108PojavVetraPrevec() { // pojav vetra prevec
  var k65 = this.k65_mocan_veter_6bf_8bf;
  var k34 = this.k34_hitrost_vetra_7h;
  var k36 = this.k36_hitrost_vetra_14h;
  var k38 = this.k38_hitrost_vetra_21h;
  if (k34.msr && k34.edit()) {
    if (k65.equals(1, 5) && ((!k34.nval || k34.nval < 108) && (!k36.nval || k36.nval < 108) && (!k38.nval || k38.nval < 108))) this.set_warn_params(this.messages.msg_hitrost_124, 0, [k65, new Number(1), k34, k36, k38]);
    if (k65.equals(4, 7) && ((!k34.nval || k34.nval < 172) && (!k36.nval || k36.nval < 172) && (!k38.nval || k38.nval < 172))) this.set_warn_params(this.messages.msg_hitrost_124A, 0, [k65, new Number(4), k34, k36, k38]);
  }
}

// kontrole 124J,124AJ - klima
function checkJakostPod6PojavVetraPrevec() { // pojav vetra prevec
  var k65 = this.k65_mocan_veter_6bf_8bf;
  var k34 = this.k34_jakost_vetra_7h;
  var k36 = this.k36_jakost_vetra_14h;
  var k38 = this.k38_jakost_vetra_21h;
  if (k34.msr && k34.edit()) {    
    if (k65.equals(1, 5) && ((!k34.nval || k34.nval < 6) && (!k36.nval || k36.nval < 6) && (!k38.nval || k38.nval < 6))) this.set_warn_params(this.messages.msg_jakost_124J, 0, [k65, new Number(1), k34, k36, k38]);
    if (k65.equals(4, 7) && ((!k34.nval || k34.nval < 8) && (!k36.nval || k36.nval < 8) && (!k38.nval || k38.nval < 8))) this.set_warn_params(this.messages.msg_jakost_124JA, 0, [k65, new Number(4), k34, k36, k38]);
  }  
}

// ===================================================================//

// kontrole 125,125A,125B,125C - klima
/*
function checkHitrostNad108PojavVetraPremalo() {// pojav vetra premalo
  var k65 = this.k65_mocan_veter_6bf_8bf;
  var k34 = this.k34_hitrost_vetra_7h;
  var k36 = this.k36_hitrost_vetra_14h;
  var k38 = this.k38_hitrost_vetra_21h;  
  if (k34.msr && k65.msr && k65.edit()) {
    var params = [k34, k36, k38, k65];
    if (k34.nval && k34.nval >= 108 || k36.nval && k36.nval >= 108 || k38.nval && k38.nval >= 108) { 
      if (k34.nval && k34.nval >= 172 || k36.nval && k36.nval >= 172 || k38.nval && k38.nval >= 172) { 
        if (k65.equals(null, 0, 3)) {// pojav manjka
          params[params.length] = new Number(4);
          this.set_err_params(this.messages.msg_hitrost_125A, 0, params); // manjka pojav 8
        }
        if (k65.equals(1, 5)){
					params[params.length] = new Number(2);
					this.set_err_params(this.messages.msg_hitrost_125C, 0, params); // 6 namesto 8
				}
      }
      else {
        if (k65.equals(null, 0, 3)) {
          params[params.length] = new Number(1);
          this.set_err_params(this.messages.msg_hitrost_125, 0, params); // manjka pojav 6
        }
        if (k65.equals(4, 7)) {
					params[params.length] = new Number(2);
					this.set_warn_params(this.messages.msg_hitrost_125B, 1, params); // 8 namesto 6
				}
      }
    }
  }
}

// kontrole 125J,125AJ,125BJ,125CJ - klima
function checkJakostNad6PojavVetraPremalo() {// pojav vetra premalo
  var k65 = this.k65_mocan_veter_6bf_8bf;
  var k34 = this.k34_jakost_vetra_7h;
  var k36 = this.k36_jakost_vetra_14h;
  var k38 = this.k38_jakost_vetra_21h;  
  if (k34.msr && k65.msr && k65.edit()) {
    var params = [k34, k36, k38, k65];
    if (k34.nval && k34.nval >= 6 || k36.nval && k36.nval >= 6 || k38.nval && k38.nval >= 6) {
      if (k34.nval && k34.nval >= 8 || k36.nval && k36.nval >= 8 || k38.nval && k38.nval >= 8) {
        if (k65.equals(null, 0, 3)) {
          params[params.length] = new Number(4);
          this.set_err_params(this.messages.msg_jakost_125JA, 0, params); // manjka pojav 8
        }
        if (k65.equals(1, 5)) {
					params[params.length] = new Number(2);
					this.set_err_params(this.messages.msg_jakost_125JC, 0, params); // 6 namesto 8
				}
      }
      else {
        if (k65.equals(null, 0, 3)) {
          params[params.length] = new Number(1);
          this.set_err_params(this.messages.msg_jakost_125J, 0, params); // manjka pojav 6
        }
        if (k65.equals(4, 7)) {
					params[params.length] = new Number(2);
					this.set_warn_params(this.messages.msg_jakost_125JB, 1, params); // 8 namesto 6
				}
      }
    }
  }
}
*/
function checkHitrostNad108PojavVetraPremalo() {// pojav vetra premalo
  var k65 = this.k65_mocan_veter_6bf_8bf;
  var k34 = this.k34_hitrost_vetra_7h;
  var k36 = this.k36_hitrost_vetra_14h;
  var k38 = this.k38_hitrost_vetra_21h;  
  if (k34.msr && k65.msr && k65.edit()) {
    var params = [];
		if (k34.nval && k34.nval >= 172) params[params.length] = k34;
		if (k36.nval && k36.nval >= 172) params[params.length] = k36;
		if (k38.nval && k38.nval >= 172) params[params.length] = k38;
		if (params.length > 0) {
			if (k65.equals(null, 0, 3)) this.set_err_params(this.messages.msg_hitrost_125A, 0, params.concat([k65, new Number(4)])); // manjka pojav 8
      if (k65.equals(1, 5)) this.set_err_params(this.messages.msg_hitrost_125C, 0, params.concat([k65, new Number(2)])); // 6 namesto 8
		}
    params = [];
		if (k34.nval && k34.nval >= 108 && k34.nval < 172) params[params.length] = k34;
		if (k36.nval && k36.nval >= 108 && k36.nval < 172) params[params.length] = k36;
		if (k38.nval && k38.nval >= 108 && k38.nval < 172) params[params.length] = k38;
		if (params.length > 0) {
			if (k65.equals(null, 0, 3)) this.set_err_params(this.messages.msg_hitrost_125, 0, params.concat([k65, new Number(1)])); // manjka pojav 6
			if (k65.equals(4, 7)) this.set_warn_params(this.messages.msg_hitrost_125B, 1, params.concat([k65, new Number(2)])); // 8 namesto 6
	  }
	}
}

// kontrole 125J,125AJ,125BJ,125CJ - klima
function checkJakostNad6PojavVetraPremalo() {// pojav vetra premalo
  var k65 = this.k65_mocan_veter_6bf_8bf;
  var k34 = this.k34_jakost_vetra_7h;
  var k36 = this.k36_jakost_vetra_14h;
  var k38 = this.k38_jakost_vetra_21h;  
  if (k34.msr && k65.msr && k65.edit()) {
    var params = [];
		if (k34.nval && k34.nval >= 8) params[params.length] = k34;
		if (k36.nval && k36.nval >= 8) params[params.length] = k36;
		if (k38.nval && k38.nval >= 8) params[params.length] = k38;
		if (params.length > 0) {
			if (k65.equals(null, 0, 3)) this.set_err_params(this.messages.msg_jakost_125JA, 0, params.concat([k65, new Number(4)])); // manjka pojav 8
      if (k65.equals(1, 5)) this.set_err_params(this.messages.msg_jakost_125JC, 0, params.concat([k65, new Number(2)])); // 6 namesto 8
		}
    params = [];
		if (k34.nval && k34.nval >= 6 && k34.nval < 8) params[params.length] = k34;
		if (k36.nval && k36.nval >= 6 && k36.nval < 8) params[params.length] = k36;
		if (k38.nval && k38.nval >= 6 && k38.nval < 8) params[params.length] = k38;
		if (params.length > 0) {
			if (k65.equals(null, 0, 3)) this.set_err_params(this.messages.msg_jakost_125J, 0, params.concat([k65, new Number(1)])); // manjka pojav 6
			if (k65.equals(4, 7)) this.set_warn_params(this.messages.msg_jakost_125JB, 1, params.concat([k65, new Number(2)])); // 8 namesto 6
	  }
	}
}

// ===================================================================//

// kontrola 128 - klima
/*
function checkTlaPojaviK70() {
  var k39 = this.k39_stanje_tal_7h;
  var k40 = this.k40_stanje_tal_14h;
  var k41 = this.k41_stanje_tal_21h;
  var k70 = this.k70_snezna_odeja;  
	if ((k39.nval && k39.nval > 5 || k40.nval && k40.nval > 5 || k41.nval && k41.nval > 5) && k70.edit() && k70.msr && k70.equals(null, 0, 2, 3, 6)) 
		this.set_err_params(this.messages.msg_tla_128, 0, [k39, k40, k41, k70, new Number(1)]);
}
*/
function checkTlaPojaviK70() {
  var k70 = this.k70_snezna_odeja;
	var params = [];
	if (this.k39_stanje_tal_7h.nval && this.k39_stanje_tal_7h.nval > 5) params[params.length] = this.k39_stanje_tal_7h;
	if (this.k40_stanje_tal_14h.nval && this.k40_stanje_tal_14h.nval > 5) params[params.length] = this.k40_stanje_tal_14h;
	if (this.k41_stanje_tal_21h.nval && this.k41_stanje_tal_21h.nval > 5) params[params.length] = this.k41_stanje_tal_21h;
	if (params.length > 0 && k70.edit() && k70.msr && k70.equals(null, 0, 2, 3, 6)) {
		params = params.concat([k70, new Number(1)]);
		this.set_err_params(this.messages.msg_tla_128, 0, params);
	}
}

// ===================================================================//

// kontrole 133,134 - klima
function checkTmin5TminRazlikaJasnaOblacnaNoc() {
  if (this.prev && !this.prev.k48_oblacnost_21h.error) {
    var k10 = this.k10_minimalna_temperatura_5cm;
    var k9 = this.k9_minimalna_temperatura;
    var k46 = this.k46_oblacnost_7h;
    var k51 = this.k51_sneg_skupaj;
    if (k10.nval && k9.nval && k46.nval && this.prev.k48_oblacnost_21h.nval) {
      var sum = this.prev.k48_oblacnost_21h.nval + k46.nval;
      var diff = k10.nval - k9.nval;
      if (sum <= 15 && diff < -110) this.set_warn_params(this.messages.msg_tmin5_133, 0, [k10, k9, k46, this.prev.k48_oblacnost_21h]);
      if (sum > 15 && ((!k51.nval || k51.nval == -1) && diff < -70 || k51.nval && k51.nval > -1 && diff < -80)) this.set_warn_params(this.messages.msg_tmin5_134, 0, [k10, k9, k46, k51, this.prev.k48_oblacnost_21h]);
    }
  }
}

// ===================================================================//

// kontrola 139 - klima
function checkTmin5Terminske() {
  if (this.prev && !this.prev.k13_temperatura_suhi_21h.error) {
    var k10 = this.k10_minimalna_temperatura_5cm;
    var k13 = this.prev.k13_temperatura_suhi_21h;
    var k11 = this.k11_temperatura_suhi_7h;    
    if (k10.nval && k13.nval && k11.nval && k10.nval - getMin([k13.nval, k11.nval]) < -110) 
			this.set_warn_params(this.messages.msg_tmin5_139, 0, [k10, k13, k11]);      
  }
}

// ===================================================================//

// kontrola 140 - klima
function checkTmin5Tsuhi7NsnegPojaviK59() {
  var k10 = this.k10_minimalna_temperatura_5cm;
  var k11 = this.k11_temperatura_suhi_7h;
  var k59 = this.k59_megla_megla_z_vid_neb_led_m;
  var k52 = this.k52_sneg_novi;
  if (k10.nval && k11.nval) {
    var diff = k10.nval - k11.nval;
    if (diff > 25) this.set_warn_params(this.messages.msg_tmin5_140, 0, [k10, k11]);
    if (diff > 15 && diff <= 25 && k52.nval && k52.nval == -1) this.set_warn_params(this.messages.msg_tmin5_140, 0, [k10, k11, k52]); 
    if (diff > 0 && diff <= 15 && k59.equals(null, 0) && k52.nval && k52.nval == -1) this.set_warn_params(this.messages.msg_tmin5_140, 0, [k10, k11, k59, k52]);
  }
}

// ===================================================================//

// kontrola 119 - klima
function checkTlaPojaviK62() {  
  if (this.k39_stanje_tal_7h.edit() && !this.k62_poledica_zled_poled__na_tl_.equals(null, 0) && this.k39_stanje_tal_7h.nval != 4 && this.k40_stanje_tal_14h.nval != 4 && this.k41_stanje_tal_21h.nval != 4)
		this.set_warn_params(this.messages.msg_tla_119, 0, [this.k62_poledica_zled_poled__na_tl_, this.k39_stanje_tal_7h, this.k40_stanje_tal_14h, this.k41_stanje_tal_21h]);
}

// ===================================================================//

// kontrola 159 - klima, padavine (pomozna funkcija)
function checkVisinaSsnegSsnegprev_(ss, ssprev, visina, k70) {
  if (ssprev.nval && ss.nval && ssprev.nval == -1 && ss.nval > -1) {
    if (!visina.nval || visina.nval == -1) {
      if (k70.equals(1, 4, 5, 7)) this.set_err_params(this.messages.msg_ss_159, 0, [ssprev, visina, ss, k70]);
      else this.set_err_params(this.messages.msg_ss_159, 0, [ssprev, visina, ss]);
    }
  }
}

// kontrola 159 - padavine
function checkVisinaSsnegSsnegprevPad() {
  if (this.prev && !this.prev.p7_sneg_skupaj.error) 
		this.checkVisinaSsnegSsnegprev_(this.p7_sneg_skupaj, this.prev.p7_sneg_skupaj, this.p5_padavine, this.p13_sneznaodeja_rosa);
}

// kontrola 159 - klima
function checkVisinaSsnegSsnegprevKli() {
  if (this.prev && !this.prev.k51_sneg_skupaj.error) 
		this.checkVisinaSsnegSsnegprev_(this.k51_sneg_skupaj, this.prev.k51_sneg_skupaj, this.k49_padavine, this.k70_snezna_odeja);
}

// ===================================================================//

// kontrola 178 - klima
function checkTsuhi7Tmin() {
  if (this.k11_temperatura_suhi_7h.nval && this.k9_minimalna_temperatura.nval && Math.abs(this.k11_temperatura_suhi_7h.nval - this.k9_minimalna_temperatura.nval) >= 50) 
		this.set_warn_params(this.messages.msg_ts7_178, 0, [this.k11_temperatura_suhi_7h, this.k9_minimalna_temperatura]);
}

// ===================================================================//

// kontrola 179 - klima
function checkTsuhi14Tmax() {
  if (this.k12_temperatura_suhi_14h.nval && this.k8_maksimalna_temperatura.nval && Math.abs(this.k12_temperatura_suhi_14h.nval - this.k8_maksimalna_temperatura.nval) >= 50) 
		this.set_warn_params(this.messages.msg_ts14_179, 0, [this.k12_temperatura_suhi_14h, this.k8_maksimalna_temperatura]);
}

// ===================================================================//

// kontrola 127A - padavine
function checkPojaviK70K56K57Pad() {
  if (this.p13_sneznaodeja_rosa.equals(null, 0, 2) && !this.p9_dez_sneg_dezsneg.equals(null, 0, 1)) 
		this.set_warn_params(this.messages.msg_odeja_127A, 0, [this.p13_sneznaodeja_rosa, this.p9_dez_sneg_dezsneg]);
}

// kontrola 127A - klima
function checkPojaviK70K56K57Kli() {
	if (this.k70_snezna_odeja.equals(null, 0, 2, 3, 6) && (!this.k56_sneg_zrnat_sneg_ploha_snega.equals(null, 0) || !this.k57_dez_s_sn_babje_psen_ploh_ds.equals(null, 0))) 
		this.set_warn_params(this.messages.msg_odeja_127A, 0, [this.k70_snezna_odeja, this.k56_sneg_zrnat_sneg_ploha_snega, this.k57_dez_s_sn_babje_psen_ploh_ds]);
}

// ===================================================================//

// dolocanje in popravljanje parametrov tmokri,led na strezniku - klima
function setTmokri(tmokri, led, interpolacija, tsuhi, rh, pritisk) {
  var termin = tmokri.name.split("_")[3];
  var _case = 0;
  if (!tmokri.error && !led.error && !interpolacija.error && !tsuhi.error && !rh.error && !pritisk.error) {// noben od parametrov nima napake
    if (tsuhi.nval && rh.nval && rh.nval > 0 && !tmokri.nval && !led.nval) _case = 1; // manjkata tm, led  => izracun tm, ledu, interpolacija = 2
    if (tmokri.nval && led.nval && (interpolacija.nval == 2 || interpolacija.nval == 3)) { // tm in led obstajata, interpolacija = 2 ali 3
      if (!tsuhi.nval || !rh.nval || rh.nval == 0) _case = 2; // manjka ts ali manjka rh ali rh = 0 => tm=led=null, inetrpolacija = 0
      else {// ts in rh obstajata
        if (!tsuhi.oval || parseInt(tsuhi.nval) != parseInt(tsuhi.oval) || !rh.oval || parseInt(rh.nval) != parseInt(rh.oval)) {// sprememba ts ali sprememba rh; 
          if (tsuhi.val && parseInt(tsuhi.nval) != parseInt(tsuhi.val) || rh.val && parseInt(rh.nval) != parseInt(rh.val)) _case = 3; //sprememba v bazi
          else _case = 4; //sprememba samo v formi 
        }
        else {// ni spremembe ts in ni sprememebe rh
          if (!tmokri.oval || parseInt(tmokri.nval) != parseInt(tmokri.oval) || !led.oval || parseInt(led.nval) != parseInt(led.oval)) { // sprememba tmokri ali sprememba led
            if (tsuhi.val && parseInt(tsuhi.nval) != parseInt(tsuhi.val) || rh.val && parseInt(rh.nval) != parseInt(rh.val)) _case = 5; // sprememba ts ali sprememba rh v bazi
            else _case = 6;  // sprememba ts ali sprememba rh samo v formi
          }
        }
      }
    }
    if (_case == 0) return;
    if (_case == 2) {// brisanje vrednosti
      this.set_set(tmokri.name, "", "Temperatura mokrega termometra ob " + termin);
      this.set_set(led.name, "", "Led ob " + termin);
      this.set_set(interpolacija.name, 0, "Interpolacija temperature mokrega termometra ob " + termin);
      tmokri.setNewVal();
      led.setNewVal();
      interpolacija.setNewVal(0);
    }
    else {// racunanje vrednosti; 1,3,4,5,6
      var tm = getTmokri(tsuhi.nval, rh.nval, (pritisk.nval)? pritisk.nval : this.pavg);
      if (tm.tmokri < 0 && tm.led == 0) tm = getTmokri(tsuhi.nval, rh.nval, (pritisk.nval)? pritisk.nval : this.pavg, 1);
      this.set_set(tmokri.name, tm.tmokri, "Temperatura mokrega termometra ob " + termin);
      this.set_set(led.name, tm.led, "Led ob " + termin);
      this.set_set(interpolacija.name, (_case == 1 || _case == 4 || _case == 6)? 2 : 3, "Interpolacija temperature mokrega termometra ob " + termin);
      tmokri.setNewVal(tm.tmokri);
      led.setNewVal(tm.led);
      interpolacija.setNewVal((_case == 1 || _case == 4 || _case == 6)? 2 : 3); 
    }
  }
}

// ===================================================================//

