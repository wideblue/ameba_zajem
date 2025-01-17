importClass(Packages.si.academa.spring.Application);
importClass(Packages.org.springframework.transaction.support.TransactionTemplate);
importClass(Packages.org.springframework.transaction.support.TransactionCallback);
importClass(Packages.org.springframework.jdbc.core.JdbcTemplate);
importClass(Packages.org.springframework.jdbc.core.RowCallbackHandler);

var datasource = "ds.ameba";

function querySql(ds, query) {
  var jt = new JdbcTemplate(Application.getBean(ds));
  return jt.queryForList(query);
}

function query4Int(ds, query) {
  var jt= new JdbcTemplate(Application.getBean(ds));
  return jt.queryForInt(query);
}

function rowCallbackFor(f) {
	return new JavaAdapter( RowCallbackHandler, { processRow: function(rs) { f(rs); }});
}

function querySqlRowCallback(ds, query, rowCallbackFunction) {
  var jt= new JdbcTemplate(Application.getBean(ds));
  var result= new java.util.ArrayList();
  jt.query( query, rowCallbackFor(rowCallbackFunction));
  return result; 
}

function query(select) {
   return querySql(datasource, select);
}

function queryInt(select) {
   return query4Int(datasource, select);
}

function executeSql(ds, statement) {
  withTransaction( function(tt) {
										 var jt= new JdbcTemplate(Application.getBean(ds)); 
										 return jt.execute(statement);
									 }, 
									 "ameba" );
}

function execute(statement) {
   return executeSql(datasource, statement);

}

//==============================================================================//

function getTableKlima() {
	if (_TABELE == 2) return "klima_vhodna";
	else return "kkd_vhodna";
}

function getTablePadavine() {
	if (_TABELE == 2) return "padavine_vhodna";
	else return "ppd_vhodna";
}

function getTableSonce() {
	if (_TABELE == 2) return "trajanje_vhodna";
	else return "stu_vhodna";
}

//==============================================================================//

// idmm
function createSelectStatementPostaje(postaja, tip, datumz, datumk) {
  var stat = "SELECT id,id_obs.idmm,nadm_visina,ge_sirina,ge_dolzina,datum_zacetka,datum_konca FROM id_obs,idmm " + 
						 "WHERE id_obs.idmm=idmm.idmm AND idmm.st_postaje=" + postaja + " AND id_obs.tip=" + tip + " AND " + 
						 "datum_konca >= DATE'" + datumz + "'" + ((tip == 14)? "" : " - INTERVAL '1 DAY' ") + " AND " + 
						 "datum_zacetka <= DATE'" + datumk + "'"; 
  if (_debug) print(stat + "\n");
  return stat;
}

//==============================================================================//

// parametri
function createSelectStatementParametri(postaja, tip, datumz, datumk) {
  var parametri = "";
  if (tip == 1) parametri = "7,51,52,60";
	else if (tip == 2 || tip == 3) parametri = "1,2,3,6,7,9,50,51,52,53,54,55,56,57,58,59,60,61,63";
  else if (tip == 14) parametri = "59";
	var stat = "SELECT id,id_parametra,datum_zacetka,datum_konca FROM parametri WHERE id IN (SELECT id FROM id_obs,idmm " + 
						 "WHERE id_obs.idmm=idmm.idmm AND idmm.st_postaje=" + postaja + " AND id_obs.tip=" + tip + " AND " + 
						 "datum_konca >= DATE'" + datumz + "'" + ((tip == 14)? "" : " - INTERVAL '1 DAY'") + " AND datum_zacetka <= " + 
						 "DATE'" + datumk + "') AND datum_konca >= DATE'" + datumz + "' - INTERVAL '1 DAY' AND datum_zacetka <= " + 
						 "DATE'" + datumk + "' AND id_parametra IN (" + parametri + ")";
  if (_debug) print(stat + "\n");
  return stat;
}

//==============================================================================//

// klima - select
function createSelectStatementKlima(postaja, tip, datumz, datumk) {
  var stat = "SELECT kkd.postaja,kkd.tip,kkd.idmm,kkd.datum,kkd.ime_vnasalca,idmm.nadm_visina";
  for (var i = 0; i < parametri_klima.length; i++) { if (i < 30 || i > 32) stat += ",kkd." + parametri_klima[i].name; }
  for (var i = 0; i < pojavi_klima.length; i++) stat += ",kkd." + pojavi_klima[i].name;
  stat += " FROM " + getTableKlima() + " kkd,(SELECT postaja,tip,datum,max(cas_vnosa) AS casv FROM " + getTableKlima() + 
				  " GROUP BY postaja,tip,datum HAVING postaja=" + postaja + " AND tip=" + tip + " AND datum BETWEEN DATE'" + 
					datumz + "' - INTERVAL '1 DAY' AND DATE'" + datumk + "') ss,(SELECT idmm,nadm_visina FROM idmm WHERE st_postaje=" + 
					postaja + ") idmm WHERE kkd.cas_vnosa=ss.casv AND kkd.postaja=ss.postaja AND kkd.tip=ss.tip AND kkd.datum=ss.datum " + 
					"AND kkd.postaja=" + postaja + " AND kkd.tip=" + tip + " AND kkd.datum BETWEEN DATE'" + datumz + "' - INTERVAL '1 DAY' " + 
					"AND DATE'" + datumk + "' AND kkd.idmm=idmm.idmm ORDER BY kkd.datum";
  if (_debug) print(stat + "\n");
  return stat;
}

//-----------------------------------------------------------------------------//

// klima - insert
function createInsertStatementKlima() {
	var cols = new java.lang.StringBuffer("postaja,idmm,tip,leto,mesec,dan,datum,ime_vnasalca");
  var vals = new java.lang.StringBuffer(this.postaja + "," + this.idmm  + "," + this.tip + "," + this.leto + "," + 
																				this.mesec + "," + this.dan + ",'" + this.datum + "','" + user + "'");
  for (var i = 0; i < parametri_klima.length; i++) {
    if (i < 30 || i > 32) {
      cols.append("," + parametri_klima[i].name); 
      vals.append("," + this[parametri_klima[i].name].nval2bval());    
    }
  }
  for (var i = 0; i < pojavi_klima.length; i++) {
    cols.append("," + pojavi_klima[i].name); 
    vals.append("," + this[pojavi_klima[i].name].nval2bval());
  }
  var stat = "INSERT INTO " + getTableKlima() + " (" + cols.toString() + ") VALUES(" + vals.toString() + ");";
	if (_debug) print(stat + "\n");
	return stat;
}

//-----------------------------------------------------------------------------//

// klima - update
function createUpdateStatementKlima() {
	var stat = new java.lang.StringBuffer("UPDATE klima_vhodna SET cas_vnosa=now(),ime_vnasalca='" + user + "'");
	for (var i = 0; i < parametri_klima.length; i++)
    if (i < 30 || i > 32) stat.append("," + parametri_klima[i].name + "=" + this[parametri_klima[i].name].nval2bval());
  for (var i = 0; i < pojavi_klima.length; i++) 
		stat.append("," + pojavi_klima[i].name + "=" + this[pojavi_klima[i].name].nval2bval());
	stat.append(" WHERE postaja=" + this.postaja + " AND idmm=" + this.idmm + " AND tip=" + this.tip + 
							" AND leto=" + this.leto + " AND mesec=" + this.mesec + " AND dan=" + this.dan + ";");
	if (_debug) print(stat + "\n");
	return stat;
}

//-----------------------------------------------------------------------------//

// klima - count
function createCountStatementKlima() {
  var stat = "SELECT count(*) FROM " + getTableKlima() + " WHERE postaja=" + this.postaja + " AND tip=" + this.tip + 
						 " AND idmm=" + this.idmm + " AND leto=" + this.leto + " AND mesec=" + this.mesec + " AND dan=" + this.dan;
  if (_debug) print(stat + "\n");
  return stat;
}

//==============================================================================//

// padavine - select
function createSelectStatementPadavine(postaja, tip, datumz, datumk) {
	var stat = "SELECT pad.postaja," + tip + "::integer as tip,pad.idmm,pad.datum,pad.ime_vnasalca,idmm.nadm_visina";
  for (var i = 0; i < parametri_padavine.length; i++) stat += ",pad." + parametri_padavine[i].name;
  for (var i = 0; i < pojavi_padavine.length; i++) stat += ",pad." + pojavi_padavine[i].name;
  stat += " FROM " + getTablePadavine() + " pad,(SELECT postaja,datum,max(cas_vnosa) AS casv FROM " + getTablePadavine() + 
				  " GROUP BY postaja,datum HAVING postaja=" + postaja + " AND datum BETWEEN DATE'" + datumz + "' - INTERVAL '1 DAY' " + 
					"AND DATE'" + datumk + "') ss,(SELECT idmm,nadm_visina FROM idmm WHERE st_postaje=" + postaja + ") idmm WHERE " + 
					"pad.cas_vnosa=ss.casv AND pad.postaja=ss.postaja AND pad.datum=ss.datum AND pad.postaja=" + postaja + " AND pad.datum " + 
					"BETWEEN DATE'" + datumz + "' - INTERVAL '1 DAY'  AND DATE'" + datumk + "' AND pad.idmm=idmm.idmm ORDER BY pad.datum";
  if (_debug) print(stat + "\n");
  return stat;
}

//-----------------------------------------------------------------------------//

// padavine - insert
function createInsertStatementPadavine() {
	var cols = new java.lang.StringBuffer("postaja,idmm,leto,mesec,dan,datum,ime_vnasalca");
  var vals = new java.lang.StringBuffer(this.postaja + "," + this.idmm + "," + this.leto + "," + this.mesec + "," + 
																				this.dan + ",'" + this.datum + "','" + user + "'");
  for (var i = 0; i < parametri_padavine.length; i++) {
    cols.append("," + parametri_padavine[i].name); 
    vals.append("," + this[parametri_padavine[i].name].nval2bval());
  }
  for (var i = 0; i < pojavi_padavine.length; i++) {
    cols.append("," + pojavi_padavine[i].name); 
    vals.append("," + this[pojavi_padavine[i].name].nval2bval());
  }
  var stat = "INSERT INTO " + getTablePadavine() + " (" + cols.toString() + ") VALUES(" + vals.toString() + ");";
	if (_debug) print(stat + "\n");
	return stat;
}

//-----------------------------------------------------------------------------//

// padavine - update
function createUpdateStatementPadavine() {
	var stat = new java.lang.StringBuffer("UPDATE padavine_vhodna SET cas_vnosa=now(),ime_vnasalca='" + user + "'");
  for (var i = 0; i < parametri_padavine.length; i++) 
		stat.append("," + parametri_padavine[i].name + "=" + this[parametri_padavine[i].name].nval2bval());
  for (var i = 0; i < pojavi_padavine.length; i++) 
		stat.append("," + pojavi_padavine[i].name + "=" + this[pojavi_padavine[i].name].nval2bval());
  stat.append(" WHERE postaja=" + this.postaja + " AND idmm=" + this.idmm + " AND leto=" + this.leto + 
							" AND mesec=" + this.mesec + " AND dan=" + this.dan + ";");
	if (_debug) print(stat + "\n");
	return stat;
}

//-----------------------------------------------------------------------------//

// padavine - count
function createCountStatementPadavine() {
  var stat = "SELECT count(*) FROM " + getTablePadavine() + " WHERE postaja=" + this.postaja + " AND idmm=" + 
             this.idmm + " AND leto=" + this.leto + " AND mesec=" + this.mesec + " AND dan=" + this.dan;
  if (_debug) print(stat + "\n");
  return stat;
}

//========================================================================//

// sonce - select
function createSelectStatementSonce(postaja, tip, datumz, datumk) {
	var stat = "SELECT son.postaja," + tip + "::integer as tip,son.idmm,son.datum,son.ime_vnasalca,idmm.ge_dolzina,idmm.ge_sirina";
  for (var i = 0; i < parametri_sonce.length; i++) stat += ",son." + parametri_sonce[i].name;
  stat += " FROM " + getTableSonce() + " son,(SELECT postaja,datum,max(cas_vnosa) AS casv FROM " + getTableSonce() + 
					" GROUP BY postaja,datum HAVING postaja=" + postaja + " AND datum BETWEEN DATE'" + datumz + "' AND DATE'" + 
					datumk + "') ss,(SELECT idmm,ge_sirina,ge_dolzina FROM idmm WHERE st_postaje=" + postaja + ") idmm " + 
					"WHERE son.cas_vnosa=ss.casv AND son.postaja=ss.postaja AND son.datum=ss.datum AND son.postaja=" + postaja + 
					" AND son.datum BETWEEN DATE'" + datumz + "' AND DATE'" + datumk + "' AND son.idmm=idmm.idmm ORDER BY son.datum";
  if (_debug) print(stat + "\n");
  return stat;  
}

//-----------------------------------------------------------------------------//

// sonce - insert
function createInsertStatementSonce() {
	var cols = new java.lang.StringBuffer("postaja,idmm,leto,mesec,dan,datum,ime_vnasalca");
  var vals = new java.lang.StringBuffer(this.postaja + "," + this.idmm + "," + this.leto + "," + this.mesec + "," + 
																				this.dan + ",'" + this.datum + "','" + user + "'");
  for (var i = 0; i < parametri_sonce.length; i++) {
    cols.append("," + parametri_sonce[i].name); 
    vals.append("," + this[parametri_sonce[i].name].nval2bval());
  }	
  var stat = "INSERT INTO " + getTableSonce() + " (" + cols.toString() + ") VALUES(" + vals.toString() + ");";
	if (_debug) print(stat + "\n");
	return stat;	
}

//-----------------------------------------------------------------------------//

// sonce - update
function createUpdateStatementSonce() {
	var stat = new java.lang.StringBuffer("UPDATE trajanje_vhodna SET cas_vnosa=now(),ime_vnasalca='" + user + "'");
  for (var i = 0; i < parametri_sonce.length; i++) 
    stat.append("," + parametri_sonce[i].name + "=" + this[parametri_sonce[i].name].nval2bval());
  stat.append(" WHERE postaja=" + this.postaja + " AND idmm=" + this.idmm + " AND leto=" + this.leto + 
							" AND mesec=" + this.mesec + " AND dan=" + this.dan + ";");
	if (_debug) print(stat + "\n");
	return stat;
}

//-----------------------------------------------------------------------------//

// sonce - count
function createCountStatementSonce() {
  var stat = "SELECT count(*) FROM " + getTableSonce() + " WHERE postaja=" + this.postaja + " AND idmm=" + 
             this.idmm + " AND leto=" + this.leto + " AND mesec=" + this.mesec + " AND dan=" + this.dan;
  if (_debug) print(stat + "\n");
  return stat;
}

//==============================================================================//

// ali obstajajo podatki
function countEntries(objname, postaja, tip, sdate, edate) {
	if (objname == "klima") 
		return "SELECT COUNT(*) FROM " + getTableKlima() + " WHERE postaja=" + postaja + " AND tip=" + tip + " AND datum BETWEEN DATE'" + 
	         sdate + "' - INTERVAL '1 DAY' AND DATE'" + edate + "'";
  else if (objname == "padavine") 
		return "SELECT COUNT(*) FROM " + getTablePadavine() + " WHERE postaja=" + postaja + " AND datum BETWEEN DATE'" + 
	         sdate + "' - INTERVAL '1 DAY' AND DATE'" + edate + "'";
  else if (objname == "sonce") 
		return "SELECT COUNT(*) FROM " + getTableSonce() + " WHERE postaja=" + postaja + " AND datum BETWEEN DATE'" + 
	         sdate + "' AND DATE'" + edate + "'";
}

//zadnji datum
function selectLastEntry(objname, postaja, tip) {
  if (objname == "klima") return "SELECT MAX(datum) AS datum FROM " + getTableKlima() + " WHERE postaja=" + postaja + " AND tip=" + tip;
  else if (objname == "padavine") return "SELECT MAX(datum) AS datum FROM " + getTablePadavine() + " WHERE postaja = " + postaja;
  else if (objname == "sonce") return "SELECT MAX(datum) AS datum FROM " + getTableSonce() + " WHERE postaja = " + postaja;
}

// ime_postaje
function selectPostaja(postaja) {
   return "SELECT ime_postaje FROM idmm WHERE st_postaje=" + postaja + "  LIMIT 1";
}

function countPostaja(postaja, tip) {
  if (tip) return "SELECT COUNT(*) FROM idmm,id_obs WHERE idmm.idmm=id_obs.idmm AND idmm.st_postaje=" + postaja + 
									" AND id_obs.tip=" + tip;
  else return "SELECT COUNT(*) FROM idmm WHERE idmm.st_postaje=" + postaja;
}
