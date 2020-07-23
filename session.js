function refreshSession() {
	var root = "<root time='" + (new Date()).valueOf() + "'/>";
  cocoon.sendPage("session_xml", createDataObj("session", adaptXml(toXml(root))));
}

function getUserInfo() {
	var root = "<root user='" + user + "' role='" + role + "'/>"; //vnasalec:role=0, kontrolor:role=1
  cocoon.sendPage("userinfo_xml", createDataObj("userinfo", adaptXml(toXml(root))));
}

function getInsertInfo() {
	cocoon.sendPage("insertinfo_html", { tab:java.lang.Integer(_TABELE) });
}

function setInsert() {
	var fobject = { tab:java.lang.Integer(_TABELE) }
  var form = new Form("forms/setInsert.fd");
  form.createBinding("forms/setInsert.fb");
  form.load(fobject);
  form.showForm("setInsert.ft");
	form.save(fobject); 
	_TABELE = parseInt("" + fobject.tab);
	cocoon.redirectTo("index_" + _TABELE + ".htm");
}


