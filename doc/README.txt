// ================================================== //

POŠILJANJE PODATKOV:

XML dokument s strukturo: 

<klima|padavine|sonce ?err="napaka" ?warn="opozorilo" ?msg="sporocilo" action="" id="id transakcije" postaja="st. postaje" tip="tip postaje" ime_postaje="ime postaje" user="username">
  <dklima|dpadavine|dsonce idmm="idmm" oid="id objekta" datum="yyyy-MM-dd" leto="yyyy" mesec="M" dan="d" ?max="" ?nadm_visina="" ime_vnasalca="ime vnasalca iz baze, ce obstaja" ime_opazovalca="">
    <!-- parametri in pojavi-->
    <ime_parametra val="" edit="true|false" ?min="" ?max=""/>+
  </dklima|dpadavine|dsonce>*
</klima|padavine|sonce>

// ================================================== //

POŠILJANJE NAPAK IN OPOZORIL:

XML dokument s strukturo:

<klima|sonce|padavine ?err="napaka" ?msg="sporocilo" action="insert|check"> <!-- action ima vrednost, ki jo dobi s klienta -->
  <set>
    <polje datum="" val="" desc=""/>+
  </set>*
  <dklima|dpadavine|dsonce >
    <err|warn id="id napake ali sporocila" ?lvl="0|1" ?ext=""> <!-- lvl obvezen, kadar err|warn vsebuje polja -->
      <polje datum="" ?val="0|1|2|3|4|5|6|7"/>* <!-- val samo za pojave -->    
    </err>+
  </dklima|dpadavine|dsonce>*
</klima|sonce|padavine>

// ================================================== //

POPRAVLJANJE ŠTEVILA MESECEV, V KATERIH VNAŠALEC ŠE LAHKO POPRAVLJA PODATKE

Spremenljivka MONTHS v datoteki variable.js.

// ================================================== //

POPRAVLJANJE NAJMANJŠE IN NAJVEČJE DOVOLJENE VREDNOSTI ZA TEMPERATURO

Spremenljivki TMIN in TMAX v datoteki variable.js.

// ================================================== //

POPRAVLJANJE OMEJITVE ZA PO MESECIH ZA TRAJANJE SONČNEGA OBSEVANJA

Spremenljivka sonce_max v datoteki variable.js.

// ================================================== //

NASTAVITEV PARAMETRA ZA PRIKAZ MANJKAJOČIH POJAVOV V OKNU S POJAVI

Datoteka index.htm:

<!-- aplikacija -->
<div id="mapframe" class="aplikacija_style">
	<script language="JavaScript" type="text/javascript">
		lzEmbed({url: 'Ameba.lzx.swf?showms=true', bgcolor: '#FFFFFF', width: '840', height: '720'});
	</script>
</div>

Popravimo vrednost url parametra showms. Če ima ta parameter vrednost 'true', se pojavi v oknu z izbranimi pojavi prikazujejo (modra barva), če ima vrednost 'false', pa 
se ne prikazujejo.

// ================================================== //

POVEZAVA MED OPISOM KRITERIJA IN SPOROČILOM V FORMI: 

Kriterij v datoteki index.htm:
6        Maksimalna temperatura ne more biti nižja od večerne temperature. Napaka, če je Tmax(n) - T21(n-1) < 0°C.

Sporočilo v formi za ta kriterij v datoteki AmebaMessages.lzx:
<msg id="err5" num="6" desc="Maksimalna temperatura je nižja od večerne temperature prejšnjega dne."/>

Zaporedna številka kriterija v index.htm je 6, kar v AmebaMessages.lzx pomeni num="6".

// ================================================== //

VRSTNI RED IZVAJANJA KONTROL:	
	
Kontrole se izvajajo glede na vrstni red imen kontrol v spremeljivkah controls_klima, controls_padavine, controls_sonce v datoteki variables.js. Spreminja
se lahko vrstni red vseh kontrol, razen kontrol checkIsEmpty, checkIsEqualToPrev in checkParams. Te kontrole morajo biti vedno na zečetku. 
