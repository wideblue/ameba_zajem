importPackage(java.util);
importPackage(java.lang);
importPackage(java.text);
importPackage(java.io);
importClass(Packages.nu.xom.Attribute);
importClass(Packages.nu.xom.Element);
importClass(Packages.nu.xom.Document);

cocoon.load("resource://org/apache/cocoon/forms/flow/javascript/Form.js");

var _debug = false;    // kadar je _debug = true, se izpisujejo sql stavki                                                   

var user = "" + Packages.si.academa.spring.Application.username;   // uporabnisko ime
var kontrolor = 0, vnasalec= 0, role = 0;																		// vloga; ce ni vansalec ali kontrolor, je napaka	
var auths = Packages.si.academa.spring.Application.authentication.authorities;

for(var i = 0; i < auths.length; i ++ ) {
  if ("" + auths[i].authority == "ROLE_vnasalec") vnasalec = 1;
  if ("" + auths[i].authority == "ROLE_kontrolor") kontrolor = 1;
}

if (kontrolor == 1) role = 1;

var transactions;    // transakcije

var _TABELE = 1; // vnos v tabele kkd_vhodna, ppd_vhodna, stv_vhodna; _TABELE = 2 => vnos v tabele klima_vhodna, padavine_vhodna, trajanje_vhodna


