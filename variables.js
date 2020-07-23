// ===================================================================//

// število mesecev od trenutnega meseca, za katere lahko vnašalec popravlja in vnaša podatke
var MONTHS = 3;

// minimum in maksimum za temperaturo
var TMIN = -500;
var TMAX = 500;

// omejitev trajanja sonca po mesecih
var sonce_max = [94, 106, 130, 140, 155, 160, 160, 145, 130, 115, 100, 85];

// veter; min=spodnja meja intervala, max=zgornja meja intervala, avg=srednja vrednost, jak=sifra za jakost
var veter_vals = [{ "min":  0, "max":  2, "avg":  0, "jak": 0 }, 
									{ "min":  3, "max": 15, "avg":  9, "jak": 1 }, 
									{ "min": 16, "max": 33, "avg": 24, "jak": 2 },
									{ "min": 34, "max": 54, "avg": 44, "jak": 3 },
									{ "min": 55, "max": 79, "avg": 67, "jak": 4 },
									{ "min": 80, "max":107, "avg": 93, "jak": 5 },
									{ "min":108, "max":138, "avg":123, "jak": 6 },
									{ "min":139, "max":171, "avg":155, "jak": 7 },
									{ "min":172, "max":207, "avg":189, "jak": 8 },
									{ "min":208, "max":244, "avg":226, "jak": 9 },
									{ "min":245, "max":284, "avg":264, "jak":10 },							
									{ "min":285, "max":326, "avg":305, "jak":11 }, 
									{ "min":327, "max":369, "avg":348, "jak":12 }];

// ===================================================================//

// sporocila za sonce
var msgs_sonce = new MessagesList("msg_empty=wrn0", "msg_equal=wrn1", "msg_sum=err3");
var msgs_son_interpolacija = new MessagesList("msg_null=wrn3", "msg_vals=err2");
var msgs_son_trajanje_04_05 = new MessagesList("msg_null=wrn2", "msg_min=err1", "msg_max=err1");
var msgs_son_trajanje_05_06 = new MessagesList("msg_null=wrn4", "msg_min=err4", "msg_max=err4");
var msgs_son_trajanje_06_07 = new MessagesList("msg_null=wrn5", "msg_min=err5", "msg_max=err5");
var msgs_son_trajanje_07_08 = new MessagesList("msg_null=wrn6", "msg_min=err6", "msg_max=err6");
var msgs_son_trajanje_08_09 = new MessagesList("msg_null=wrn7", "msg_min=err7", "msg_max=err7");
var msgs_son_trajanje_09_10 = new MessagesList("msg_null=wrn8", "msg_min=err8", "msg_max=err8");
var msgs_son_trajanje_10_11 = new MessagesList("msg_null=wrn9", "msg_min=err9", "msg_max=err9");
var msgs_son_trajanje_11_12 = new MessagesList("msg_null=wrn10", "msg_min=err10", "msg_max=err10");
var msgs_son_trajanje_12_13 = new MessagesList("msg_null=wrn11", "msg_min=err11", "msg_max=err11");
var msgs_son_trajanje_13_14 = new MessagesList("msg_null=wrn12", "msg_min=err12", "msg_max=err12");
var msgs_son_trajanje_14_15 = new MessagesList("msg_null=wrn13", "msg_min=err13", "msg_max=err13");
var msgs_son_trajanje_15_16 = new MessagesList("msg_null=wrn14", "msg_min=err14", "msg_max=err14");
var msgs_son_trajanje_16_17 = new MessagesList("msg_null=wrn15", "msg_min=err15", "msg_max=err15");
var msgs_son_trajanje_17_18 = new MessagesList("msg_null=wrn16", "msg_min=err16", "msg_max=err16");
var msgs_son_trajanje_18_19 = new MessagesList("msg_null=wrn17", "msg_min=err17", "msg_max=err17");
var msgs_son_trajanje_19_20 = new MessagesList("msg_null=wrn18", "msg_min=err18", "msg_max=err18");

// parametri za sonce
var parametri_sonce = [{ "name":"son_interpolacija",  "id":59, "mval":-9, "messages":msgs_son_interpolacija  },		//0
	                     { "name":"son_trajanje_04_05", "id":59, "mval":-9, "messages":msgs_son_trajanje_04_05 },		//1
											 { "name":"son_trajanje_05_06", "id":59, "mval":-9, "messages":msgs_son_trajanje_05_06 },		//2
											 { "name":"son_trajanje_06_07", "id":59, "mval":-9, "messages":msgs_son_trajanje_06_07 },		//3
											 { "name":"son_trajanje_07_08", "id":59, "mval":-9, "messages":msgs_son_trajanje_07_08 },		//4
											 { "name":"son_trajanje_08_09", "id":59, "mval":-9, "messages":msgs_son_trajanje_08_09 },		//5
											 { "name":"son_trajanje_09_10", "id":59, "mval":-9, "messages":msgs_son_trajanje_09_10 },		//6
											 { "name":"son_trajanje_10_11", "id":59, "mval":-9, "messages":msgs_son_trajanje_10_11 },		//7
											 { "name":"son_trajanje_11_12", "id":59, "mval":-9, "messages":msgs_son_trajanje_11_12 },		//8
											 { "name":"son_trajanje_12_13", "id":59, "mval":-9, "messages":msgs_son_trajanje_12_13 },		//9
											 { "name":"son_trajanje_13_14", "id":59, "mval":-9, "messages":msgs_son_trajanje_13_14 },		//10
											 { "name":"son_trajanje_14_15", "id":59, "mval":-9, "messages":msgs_son_trajanje_14_15 },		//11
											 { "name":"son_trajanje_15_16", "id":59, "mval":-9, "messages":msgs_son_trajanje_15_16 },		//12
											 { "name":"son_trajanje_16_17", "id":59, "mval":-9, "messages":msgs_son_trajanje_16_17 },		//13
											 { "name":"son_trajanje_17_18", "id":59, "mval":-9, "messages":msgs_son_trajanje_17_18 },		//14
											 { "name":"son_trajanje_18_19", "id":59, "mval":-9, "messages":msgs_son_trajanje_18_19 },		//15
											 { "name":"son_trajanje_19_20", "id":59, "mval":-9, "messages":msgs_son_trajanje_19_20 }];  //16

// ===================================================================//

// sporocila za padavine in klimo                                      
var msgs_padavine = new MessagesList("msg_empty=wrn0",	 			 "msg_equal=wrn1",        "msg_visina_77=err76",   "msg_visina_85=err77", 
																		 "msg_visina_E82=err102",  "msg_visina_W82=wrn68",  "msg_visina_83=err62",   "msg_visina_84=err63", 
																		 "msg_visina_85A=err64",   "msg_visina_120=err65",  "msg_ss_88=err66",       "msg_sn_89=err69", 
																		 "msg_sn_91=err70",        "msg_sn_92=err71",       "msg_ss_93=err72",       "msg_sn_98=wrn177", 
																		 "msg_oblika_99=wrn163",   "msg_oblika_100=wrn164", "msg_oblika_101=wrn165", "msg_oblika_102=wrn166", 
																		 "msg_oblika_103=wrn167",  "msg_oblika_104=wrn168", "msg_oblika_105=wrn167", "msg_oblika_108=err114", 
																		 "msg_oblika_108B=wrn176", "msg_oblika_99A=wrn88",  "msg_oblika_100A=wrn89", "msg_oblika_101A=wrn90", 
																		 "msg_oblika_102A=wrn91",  "msg_oblika_103A=wrn92", "msg_oblika_104A=wrn93", "msg_oblika_105A=wrn94", 
																		 "msg_oblika_108A=wrn95",  "msg_visina_107=err105", "msg_visina_109=err106", "msg_ss_154=err78", 
																		 "msg_sn_155=err79",       "msg_ss_112=wrn71",      "msg_ss_126=err99",      "msg_ss_127=err101", 
																		 "msg_ss_159=err166",      "msg_odeja_127A=wrn175");
var msgs_visina = new MessagesList("msg_null=wrn18", "msg_min=err46", "msg_max=err46", "msg_maxW=wrn24");
var msgs_oblika = new MessagesList("msg_null=wrn19", "msg_vals=err47");
var msgs_ss = new MessagesList("msg_null=wrn20", "msg_min=err49", "msg_max=err49", "msg_maxW=wrn25"); 
var msgs_sn = new MessagesList("msg_null=wrn21", "msg_min=err51", "msg_max=err51", "msg_maxW=wrn162");

// ===================================================================//

// sporocila za padavine
var msgs_pad_pojavP9 = new MessagesList("msg_null=wrn23", "msg_vals=err48");
var msgs_pad_pojavP10 = new MessagesList("msg_null=wrn2", "msg_vals=err149");
var msgs_pad_pojavP11 = new MessagesList("msg_null=wrn3", "msg_vals=err150");
var msgs_pad_pojavP12 = new MessagesList("msg_null=wrn4", "msg_vals=err151");
var msgs_pad_pojavP13 = new MessagesList("msg_null=wrn5", "msg_vals=err152");
var msgs_pad_interpolacija = new MessagesList("msg_null=wrn8", "msg_vals=err4");

// parametri za padavine
var parametri_padavine = [{ "name":"p14_interpolacija", "id": 7, "mval":   9, "messages":msgs_pad_interpolacija },	//0
                          { "name":"p5_padavine",       "id": 7, "mval":-999, "messages":msgs_visina            },	//1
                          { "name":"p6_oblika",         "id": 7, "mval":  -9, "messages":msgs_oblika            },	//2
                          { "name":"p7_sneg_skupaj",    "id":51, "mval":  -9, "messages":msgs_ss                },	//3
                          { "name":"p8_sneg_novi",      "id":52, "mval":  -9, "messages":msgs_sn                }];	//4

// pojavi za padavine   
var pojavi_padavine = [{ "name":"p9_dez_sneg_dezsneg",           "id":60, "mval":9, "pojav1":"dez",          "pojav2":"sneg",    "pojav3":"dez_s_snegom",    "messages":msgs_pad_pojavP9  },	//0
                       { "name":"p10_toca_slana_megla",          "id":60, "mval":9, "pojav1":"toca",         "pojav2":"slana",   "pojav3":"megla",           "messages":msgs_pad_pojavP10 },	//1
											 { "name":"p11_ivje_sodra_bpseno",         "id":60, "mval":9, "pojav1":"ivje",         "pojav2":"sodra",   "pojav3":"babje_pseno",     "messages":msgs_pad_pojavP11 },	//2
											 { "name":"p12_poledica_nevihta_vihveter", "id":60, "mval":9, "pojav1":"poledica",     "pojav2":"nevihta", "pojav3":"mocan_veter_8bf", "messages":msgs_pad_pojavP12 },	//3
											 { "name":"p13_sneznaodeja_rosa",          "id":60, "mval":9, "pojav1":"snezna_odeja", "pojav2":"rosa",                                "messages":msgs_pad_pojavP13 }];	//4

// pojavi za padavine - struktura posameznega pojava 
var pojavi_padavine_ = ["dez",          "sneg",    "dez_s_snegom", 	    //p9
                        "toca",         "slana",   "megla", 	          //p10
												"ivje",         "sodra",   "babje_pseno", 	    //p11
												"poledica",     "nevihta", "mocan_veter_8bf", 	//p12
												"snezna_odeja", "rosa"]; 												//p13

// ===================================================================//

// sporocila klimo
var msgs_klima = new MessagesList("msg_empty=wrn0",          "msg_equal=err0",         "msg_pp_1=wrn2",         "msg_pp_2=wrn3",
																	"msg_pp_3=wrn4",           "msg_pp_4=wrn5",          "msg_pp_5=wrn6",         "msg_tmax_6=err5",
																	"msg_tmin_7=err6",         "msg_tmin5_141=err13",    "msg_tmin5_8=wrn39",     "msg_tmin_158=err88",  
																	"msg_ts_9=err7",           "msg_ts_10=err8",         "msg_ts_11=err9",        "msg_ts_12=err10", 
																	"msg_ts_13=err11",         "msg_ts_14=err12",        "msg_tmax_15a=wrn40",    "msg_tmax_15b=wrn41",
																	"msg_tmin_16a=wrn42",      "msg_tmin_16b=wrn43",     "msg_tmin_16c=wrn44",    "msg_led_17=err14",
																	"msg_led_18=err15",        "msg_led_19=err16",       "msg_led_34=err20",      "msg_led_35=err21",     
																	"msg_led_36=err22",        "msg_tm_20=wrn45",        "msg_tm_21=wrn46",       "msg_tm_22=wrn47",     
																	"msg_tm_23=wrn48",         "msg_tm_24=wrn49",        "msg_tm_25=wrn50",       "msg_tm_26=wrn51",     
																	"msg_tm_27=wrn52",         "msg_led_28=wrn33",       "msg_led_29=wrn34",      "msg_led_30=wrn35",
																	"msg_led_31=err17",        "msg_led_32=err18",       "msg_led_33=err19",      "msg_led_38=err80",   
																	"msg_led_39=err81",        "msg_led_40=err82",       "msg_led_38A=err83",     "msg_led_39A=err84",    
																	"msg_led_41=err85",        "msg_son_37=err52",       "msg_rh_46=err116",      "msg_rh_47=err117",    
																	"msg_rh_48=err118",        "msg_rh_49=wrn85",        "msg_rh_50=wrn86",       "msg_rh_51=wrn87",     
																	"msg_smer_58=err53",       "msg_smer_59=err54",      "msg_smer_60=err55",     "msg_smer_58J=err119", 
																	"msg_smer_59J=err120",     "msg_smer_60J=err121",    "msg_hitrost_61=err56",  "msg_hitrost_62=err57", 
																	"msg_hitrost_63=err58",    "msg_jakost_61J=err59",   "msg_jakost_62J=err60",  "msg_jakost_63J=err61", 
																	"msg_tla_67=wrn65",        "msg_tla_68=wrn66",       "msg_tla_69=wrn67",      "msg_tla_70=wrn36", 
																	"msg_tla_71=wrn37",        "msg_tla_72=wrn38",       "msg_visina_77=err76",   "msg_visina_85=err77", 
																	"msg_visina_E82=err102",   "msg_visina_W82=wrn68",   "msg_visina_83=err62",   "msg_visina_84=err63", 
																	"msg_visina_85A=err64",    "msg_visina_120=err65",   "msg_ss_86=err67",       "msg_ss_87=err68", 
																	"msg_ss_88=err66",         "msg_sn_89=err69",        "msg_sn_90=wrn69",       "msg_sn_91=err70", 
																	"msg_sn_92=err71",         "msg_ss_93=err72",        "msg_voda_94=err73",     "msg_voda_95=err74", 
																	"msg_tmax_96=wrn70",       "msg_tmin_97=err89",      "msg_sn_98=wrn177",      "msg_oblika_99=wrn163",
																	"msg_oblika_100=wrn164",   "msg_oblika_101=wrn165",  "msg_oblika_102=wrn166", "msg_oblika_103=wrn167", 
																	"msg_oblika_104=wrn168",   "msg_oblika_105=wrn169",  "msg_oblika_108=err114", "msg_oblika_108B=wrn176", 
																	"msg_oblika_99A=wrn88",    "msg_oblika_100A=wrn89",  "msg_oblika_101A=wrn90", "msg_oblika_102A=wrn91", 
																	"msg_oblika_103A=wrn92",   "msg_oblika_104A=wrn93",  "msg_oblika_105A=wrn94", "msg_oblika_108A=wrn95", 
																	"msg_tmin_106=err104",     "msg_visina_107=err105",  "msg_visina_109=err106", "msg_ss_154=err78", 
																	"msg_sn_155=err79",        "msg_voda_157=err86",     "msg_ss_156=err87",      "msg_ss_112=wrn71", 
																	"msg_vid_113=wrn72",       "msg_vid_114=wrn73",      "msg_tla_115=wrn74",     "msg_tmin_116=wrn75", 
																	"msg_tmin_118=wrn76",      "msg_tla_119=wrn170",     "msg_tmin_121=wrn77",    "msg_tmin_122=wrn78",
																	"msg_tivje_123=wrn79",     "msg_tivje_123J=wrn80",   "msg_hitrost_124=wrn29", "msg_hitrost_124A=wrn30", 
																	"msg_jakost_124J=wrn31",   "msg_jakost_124JA=wrn32", "msg_hitrost_125=err91", "msg_hitrost_125A=err92", 
																	"msg_hitrost_125B=wrn173", "msg_hitrost_125C=err94", "msg_jakost_125J=err95", "msg_jakost_125JA=err96", 
																	"msg_jakost_125JB=wrn174", "msg_jakost_125JC=err98", "msg_ss_126=err99",      "msg_ss_127=err101", 
																	"msg_tla_128=err100",      "msg_tmin5_133=wrn81",    "msg_tmin5_134=wrn82",   "msg_tmin5_139=wrn83", 
																	"msg_tmin5_140=wrn84",     "msg_rh_135=wrn96",       "msg_rh_136=wrn97",      "msg_rh_137=wrn98", 
																	"msg_ss_159=err166",       "msg_ts7_178=wrn171",     "msg_ts14_179=wrn172",   "msg_odeja_127A=wrn175");
var msgs_kli_pritisk7 = new MessagesList("msg_null=wrn1", "msg_min=err1", "msg_max=err1");
var msgs_kli_pritisk14 = new MessagesList("msg_null=wrn99", "msg_min=err122", "msg_max=err122");
var msgs_kli_pritisk21 = new MessagesList("msg_null=wrn100", "msg_min=err123", "msg_max=err123");
var msgs_kli_tmax = new MessagesList("msg_null=wrn7", "msg_min=err3", "msg_max=err3");
var msgs_kli_tmin = new MessagesList("msg_null=wrn101", "msg_min=err124", "msg_max=err124");
var msgs_kli_tmin5 = new MessagesList("msg_null=wrn102", "msg_min=err125", "msg_max=err125");
var msgs_kli_tsuhi7 = new MessagesList("msg_null=wrn103", "msg_min=err126", "msg_max=err126");
var msgs_kli_tsuhi14 = new MessagesList("msg_null=wrn104", "msg_min=err127", "msg_max=err127");
var msgs_kli_tsuhi21 = new MessagesList("msg_null=wrn105", "msg_min=err128", "msg_max=err128");
var msgs_kli_tmokri7 = new MessagesList("msg_null=wrn106", "msg_min=err129", "msg_max=err129");
var msgs_kli_tmokri14 = new MessagesList("msg_null=wrn107", "msg_min=err130", "msg_max=err130");
var msgs_kli_tmokri21 = new MessagesList("msg_null=wrn108", "msg_min=err131", "msg_max=err131");
var msgs_kli_led7 = new MessagesList("msg_null=wrn9", "msg_vals=err45");
var msgs_kli_led14 = new MessagesList("msg_null=wrn109", "msg_vals=err132");
var msgs_kli_led21 = new MessagesList("msg_null=wrn110", "msg_vals=err133");
var msgs_kli_rh7 = new MessagesList("msg_null=wrn10", "msg_min=err23", "msg_max=err23");
var msgs_kli_rh14 = new MessagesList("msg_null=wrn111", "msg_min=err134", "msg_max=err134");
var msgs_kli_rh21 = new MessagesList("msg_null=wrn112", "msg_min=err135", "msg_max=err135");
var msgs_kli_smer7 = new MessagesList("msg_null=wrn11", "msg_vals=err29"); 
var msgs_kli_smer14 = new MessagesList("msg_null=wrn113", "msg_vals=err30"); 
var msgs_kli_smer21 = new MessagesList("msg_null=wrn114", "msg_vals=err31"); 
var msgs_kli_hitrost7 = new MessagesList("msg_null=wrn12", "msg_min=err32", "msg_maxW1=wrn53", "msg_maxW2=wrn54");
var msgs_kli_hitrost14 = new MessagesList("msg_null=wrn115", "msg_min=err136", "msg_maxW1=wrn55", "msg_maxW2=wrn56");
var msgs_kli_hitrost21 = new MessagesList("msg_null=wrn116", "msg_min=err137", "msg_maxW1=wrn57", "msg_maxW2=wrn58");
var msgs_kli_jakost7 = new MessagesList("msg_null=wrn13", "msg_vals=err33", "msg_maxW1=wrn59", "msg_maxW2=wrn60");
var msgs_kli_jakost14 = new MessagesList("msg_null=wrn117", "msg_vals=err138", "msg_maxW1=wrn61", "msg_maxW2=wrn62");
var msgs_kli_jakost21 = new MessagesList("msg_null=wrn118", "msg_vals=err139", "msg_maxW1=wrn63", "msg_maxW2=wrn64");
var msgs_kli_tla7 = new MessagesList("msg_null=wrn14", "msg_vals=err34");
var msgs_kli_tla14 = new MessagesList("msg_null=wrn119", "msg_vals=err35");
var msgs_kli_tla21 = new MessagesList("msg_null=wrn120", "msg_vals=err36");
var msgs_kli_vidnost7 = new MessagesList("msg_null=wrn15", "msg_vals=err37");
var msgs_kli_vidnost14 = new MessagesList("msg_null=wrn121", "msg_vals=err38");
var msgs_kli_vidnost21 = new MessagesList("msg_null=wrn122", "msg_vals=err39");
var msgs_kli_sonce = new MessagesList("msg_null=wrn17", "msg_min=err40", "msg_max=err41");
var msgs_kli_oblacnost7 = new MessagesList("msg_null=wrn16", "msg_vals=err42");
var msgs_kli_oblacnost14 = new MessagesList("msg_null=wrn123", "msg_vals=err43");
var msgs_kli_oblacnost21 = new MessagesList("msg_null=wrn124", "msg_vals=err44");
var msgs_kli_voda = new MessagesList("msg_null=wrn22", "msg_min=err50", "msg_max=err75");
var msgs_kli_interpolacija_tmax = new MessagesList("msg_null=wrn8", "msg_vals=err4");
var msgs_kli_interpolacija_tmin = new MessagesList("msg_null=wrn125", "msg_vals=err140");
var msgs_kli_interpolacija_tmin5 = new MessagesList("msg_null=wrn126", "msg_vals=err141");
var msgs_kli_interpolacija_tsuhi7 = new MessagesList("msg_null=wrn127", "msg_vals=err142");
var msgs_kli_interpolacija_tsuhi14 = new MessagesList("msg_null=wrn128", "msg_vals=err143");
var msgs_kli_interpolacija_tsuhi21 = new MessagesList("msg_null=wrn129", "msg_vals=err144");
var msgs_kli_interpolacija_tmokri7 = new MessagesList("msg_null=wrn130", "msg_vals=err145");
var msgs_kli_interpolacija_tmokri14 = new MessagesList("msg_null=wrn131", "msg_vals=err146");
var msgs_kli_interpolacija_tmokri21 = new MessagesList("msg_null=wrn132", "msg_vals=err147");
var msgs_kli_interpolacija_visina = new MessagesList("msg_null=wrn133", "msg_vals=err148");
var msgs_kli_pojavK54 = new MessagesList("msg_null=wrn23", "msg_vals=err48");
var msgs_kli_pojavK55 = new MessagesList("msg_null=wrn134", "msg_vals=err149");
var msgs_kli_pojavK56 = new MessagesList("msg_null=wrn135", "msg_vals=err150");
var msgs_kli_pojavK57 = new MessagesList("msg_null=wrn136", "msg_vals=err151");
var msgs_kli_pojavK58 = new MessagesList("msg_null=wrn137", "msg_vals=err152");
var msgs_kli_pojavK59 = new MessagesList("msg_null=wrn138", "msg_vals=err153");
var msgs_kli_pojavK60 = new MessagesList("msg_null=wrn139", "msg_vals=err154");
var msgs_kli_pojavK61 = new MessagesList("msg_null=wrn140", "msg_vals=err155");
var msgs_kli_pojavK62 = new MessagesList("msg_null=wrn141", "msg_vals=err157");
var msgs_kli_pojavK63 = new MessagesList("msg_null=wrn142", "msg_vals=err158");
var msgs_kli_pojavK64 = new MessagesList("msg_null=wrn143", "msg_vals=err159");
var msgs_kli_pojavK65 = new MessagesList("msg_null=wrn144", "msg_vals=err160", "msg_measured=wrn27");
var msgs_kli_pojavK66 = new MessagesList("msg_null=wrn145", "msg_vals=err161", "msg_measured=wrn26");
var msgs_kli_pojavK67 = new MessagesList("msg_null=wrn146", "msg_vals=err162", "msg_measured=wrn179");
var msgs_kli_pojavK68 = new MessagesList("msg_null=wrn147", "msg_vals=err163", "msg_measured=wrn180");
var msgs_kli_pojavK69 = new MessagesList("msg_null=wrn148", "msg_vals=err164", "msg_measured=wrn181");
var msgs_kli_pojavK70 = new MessagesList("msg_null=wrn149", "msg_vals=err165", "msg_measured=wrn28");

// parametri za klimo
var parametri_klima = [{ "name":"k5_pritisk_7h",                 "id": 2, "mval":-999, "messages":msgs_kli_pritisk7	              },	//0
	                     { "name":"k6_pritisk_14h",                "id": 2, "mval":-999, "messages":msgs_kli_pritisk14              },	//1 
											 { "name":"k7_pritisk_21h",                "id": 2, "mval":-999, "messages":msgs_kli_pritisk21              },	//2
											 { "name":"k23_inter_tmaks",               "id":57, "mval":   9, "messages":msgs_kli_interpolacija_tmax     },	//3
											 { "name":"k8_maksimalna_temperatura",     "id":57, "mval":-999, "messages":msgs_kli_tmax                   },	//4
											 { "name":"k24_inter_tmin",                "id":56, "mval":   9, "messages":msgs_kli_interpolacija_tmin     },	//5
											 { "name":"k9_minimalna_temperatura",      "id":56, "mval":-999, "messages":msgs_kli_tmin                   },	//6
											 { "name":"k25_inter_tmin5",               "id": 9, "mval":   9, "messages":msgs_kli_interpolacija_tmin5    },	//7
											 { "name":"k10_minimalna_temperatura_5cm", "id": 9, "mval":-999, "messages":msgs_kli_tmin5                  },	//8
											 { "name":"k26_inter_ts07",                "id": 1, "mval":   9, "messages":msgs_kli_interpolacija_tsuhi7   },	//9
											 { "name":"k11_temperatura_suhi_7h",       "id": 1, "mval":-999, "messages":msgs_kli_tsuhi7                 },	//10
											 { "name":"k27_inter_ts14",                "id": 1, "mval":   9, "messages":msgs_kli_interpolacija_tsuhi14  },	//11
											 { "name":"k12_temperatura_suhi_14h",      "id": 1, "mval":-999, "messages":msgs_kli_tsuhi14                },	//12
											 { "name":"k28_inter_ts21",                "id": 1, "mval":   9, "messages":msgs_kli_interpolacija_tsuhi21  },	//13
											 { "name":"k13_temperatura_suhi_21h",      "id": 1, "mval":-999, "messages":msgs_kli_tsuhi21                },	//14
											 { "name":"k29_inter_tm07",                "id":50, "mval":   9, "messages":msgs_kli_interpolacija_tmokri7  },	//15
											 { "name":"k14_temperatura_mokri_7h",      "id":50, "mval":-999, "messages":msgs_kli_tmokri7                },	//16
											 { "name":"k30_inter_tm14",                "id":50, "mval":   9, "messages":msgs_kli_interpolacija_tmokri14 },	//17
											 { "name":"k15_temperatura_mokri_14h",     "id":50, "mval":-999, "messages":msgs_kli_tmokri14               },	//18
											 { "name":"k31_inter_tm21",                "id":50, "mval":   9, "messages":msgs_kli_interpolacija_tmokri21 },	//19
											 { "name":"k16_temperatura_mokri_21h",     "id":50, "mval":-999, "messages":msgs_kli_tmokri21               },	//20 
											 { "name":"k17_led_7h",                    "id":50, "mval":   9, "messages":msgs_kli_led7                   },	//21
											 { "name":"k18_led_14h",                   "id":50, "mval":   9, "messages":msgs_kli_led14                  },	//22
											 { "name":"k19_led_21h",                   "id":50, "mval":   9, "messages":msgs_kli_led21                  },	//23
											 { "name":"k20_rel_vlaga_7h",              "id": 3, "mval":  -9, "messages":msgs_kli_rh7                    },	//24
											 { "name":"k21_rel_vlaga_14h",             "id": 3, "mval":  -9, "messages":msgs_kli_rh14                   },	//25
											 { "name":"k22_rel_vlaga_21h",             "id": 3, "mval":  -9, "messages":msgs_kli_rh21                   },	//26
											 { "name":"k33_smer_vetra_7h", 		         "id":55, "mval":  -9, "messages":msgs_kli_smer7                  },	//27
											 { "name":"k35_smer_vetra_14h",            "id":55, "mval":  -9, "messages":msgs_kli_smer14                 },	//28
											 { "name":"k37_smer_vetra_21h",            "id":55, "mval":  -9, "messages":msgs_kli_smer21                 },	//29
											 { "name":"k34_jakost_vetra_7h",           "id":63, "mval":  -9, "messages":msgs_kli_jakost7                },	//30
											 { "name":"k36_jakost_vetra_14h",          "id":63, "mval":  -9, "messages":msgs_kli_jakost14               },	//31
											 { "name":"k38_jakost_vetra_21h",          "id":63, "mval":  -9, "messages":msgs_kli_jakost21               },	//32
											 { "name":"k34_hitrost_vetra_7h",          "id": 6, "mval":  -9, "messages":msgs_kli_hitrost7               },	//33
											 { "name":"k36_hitrost_vetra_14h",         "id": 6, "mval":  -9, "messages":msgs_kli_hitrost14              },	//34
											 { "name":"k38_hitrost_vetra_21h",         "id": 6, "mval":  -9, "messages":msgs_kli_hitrost21              },	//35
											 { "name":"k39_stanje_tal_7h",             "id":61, "mval":  -9, "messages":msgs_kli_tla7                   },	//36
											 { "name":"k40_stanje_tal_14h",            "id":61, "mval":  -9, "messages":msgs_kli_tla14                  },	//37
											 { "name":"k41_stanje_tal_21h",            "id":61, "mval":  -9, "messages":msgs_kli_tla21                  },	//38
											 { "name":"k42_vidnost_7h",                "id":53, "mval":  -9, "messages":msgs_kli_vidnost7               },	//39
											 { "name":"k43_vidnost_14h",               "id":53, "mval":  -9, "messages":msgs_kli_vidnost14              },	//40
											 { "name":"k44_vidnost_21h",               "id":53, "mval":  -9, "messages":msgs_kli_vidnost21              },	//41
											 { "name":"k45_trajanje_sonca",            "id":59, "mval":  -9, "messages":msgs_kli_sonce                  },	//42
											 { "name":"k46_oblacnost_7h",              "id":54, "mval":  -9, "messages":msgs_kli_oblacnost7             },	//43
											 { "name":"k47_oblacnost_14h",             "id":54, "mval":  -9, "messages":msgs_kli_oblacnost14            },	//44
											 { "name":"k48_oblacnost_21h",             "id":54, "mval":  -9, "messages":msgs_kli_oblacnost21            },	//45
											 { "name":"k32_inter_padavine",            "id": 7, "mval":   9, "messages":msgs_kli_interpolacija_visina   },	//46
											 { "name":"k49_padavine",                  "id": 7, "mval":-999, "messages":msgs_visina                     },	//47
											 { "name":"k50_oblika_padavin",            "id": 7, "mval":  -9, "messages":msgs_oblika                     },	//48
											 { "name":"k51_sneg_skupaj",               "id":51, "mval":  -9, "messages":msgs_ss                         },	//49
											 { "name":"k52_sneg_novi",                 "id":52, "mval":  -9, "messages":msgs_sn                         },	//50
											 { "name":"k53_voda_v_snegu",              "id":58, "mval":  -9, "messages":msgs_kli_voda                   }];	//51
                       
// pojavi za klimo                                    
var pojavi_klima = [{ "name":"k54_dez_rosenje_ploha_dezja",     "id":60, "mval":9, "pojav1":"dez", 				      "pojav2":"rosenje",                    "pojav3":"ploha_dez",                  "messages":msgs_kli_pojavK54 },	 //0
	                  { "name":"k55_dez_zmrz_rosen_zmrz_iglice",  "id":60, "mval":9, "pojav1":"dez_zmrzuje",      "pojav2":"rosenje_zmrzuje",            "pojav3":"iglice",                     "messages":msgs_kli_pojavK55 },	 //1
										{ "name":"k56_sneg_zrnat_sneg_ploha_snega", "id":60, "mval":9, "pojav1":"sneg",             "pojav2":"zrnat_sneg",                 "pojav3":"ploha_sneg",                 "messages":msgs_kli_pojavK56 },	 //2
										{ "name":"k57_dez_s_sn_babje_psen_ploh_ds", "id":60, "mval":9, "pojav1":"dez_s_snegom",     "pojav2":"babje_pseno",                "pojav3":"ploha_dez_sneg",             "messages":msgs_kli_pojavK57 },	 //3 
										{ "name":"k58_toca_sodra_dim",              "id":60, "mval":9, "pojav1":"toca", 	          "pojav2":"sodra",                      "pojav3":"dim", 						            "messages":msgs_kli_pojavK58 },	 //4
										{ "name":"k59_megla_megla_z_vid_neb_led_m", "id":60, "mval":9, "pojav1":"megla",            "pojav2":"megla_vidno_nebo",           "pojav3":"ledena_megla",               "messages":msgs_kli_pojavK59 },	 //5 
										{ "name":"k60_meglic_suha_motnost_talna_m", "id":60, "mval":9, "pojav1":"meglica",          "pojav2":"suha_motnost",               "pojav3":"talna_megla",                "messages":msgs_kli_pojavK60 },	 //6
										{ "name":"k61_rosa_slana_prsec_z_vodne_p_", "id":60, "mval":9, "pojav1":"rosa",             "pojav2":"slana",                      "pojav3":"prsec",                      "messages":msgs_kli_pojavK61 },	 //7
										{ "name":"k62_poledica_zled_poled__na_tl_", "id":60, "mval":9, "pojav1":"poledica",         "pojav2":"poledica_tla",               "pojav3":"ledena_skorja",              "messages":msgs_kli_pojavK62 },	 //8 
										{ "name":"k63_ivje_trdo_ivje_elijev_og_",   "id":60, "mval":9, "pojav1":"ivje",             "pojav2":"trdo_ivje",                  "pojav3":"elijev_ogenj",               "messages":msgs_kli_pojavK63 },	 //9
										{ "name":"k64_nevihta_grmenje_bliskanje",   "id":60, "mval":9, "pojav1":"nevihta",          "pojav2":"grmenje",                    "pojav3":"bliskanje",                  "messages":msgs_kli_pojavK64 },	 //10
										{ "name":"k65_mocan_veter_6bf_8bf",         "id":60, "mval":9, "pojav1":"mocan_veter_6bf",  "pojav2":"mocan_veter_8bf",            "pojav3":"pesceni_ali_prasni_vrtinec", "messages":msgs_kli_pojavK65 },	 //11
										{ "name":"k66_snezni_vrtici_tromba_1",      "id":60, "mval":9, "pojav1":"snezni_vrtinci",   "pojav2":"nizki_snezni_vrtinci",       "pojav3":"tromba",                     "messages":msgs_kli_pojavK66 },	 //12
										{ "name":"k67_prasni_pesceni_vrtinci_2",    "id":60, "mval":9, "pojav1":"pescena_megla",    "pojav2":"prasni_ali_pesceni_vrtinci", "pojav3":"prasno_ali_pesceno_neurje",  "messages":msgs_kli_pojavK67 },	 //13
										{ "name":"k68_halo_venec_ok_sonca_mavrica", "id":60, "mval":9, "pojav1":"halo_okoli_sonca", "pojav2":"venec_okoli_sonca",          "pojav3":"mavrica",                    "messages":msgs_kli_pojavK68 },	 //14
										{ "name":"k69_halo_venec_ok_lune_zrcalje",  "id":60, "mval":9, "pojav1":"halo_okoli_lune",  "pojav2":"venec_okoli_lune",           "pojav3":"zrcaljenje",                 "messages":msgs_kli_pojavK69 },	 //15
										{ "name":"k70_snezna_odeja",                "id":60, "mval":9, "pojav1":"snezna_odeja",     "pojav2":"polarni_sij",                "pojav3":"svetlobni_stebri",           "messages":msgs_kli_pojavK70 }]; //16

// pojavi za klimo - struktura posameznega pojava																
var pojavi_klima_ = ["dez",              "rosenje",                    "ploha_dez",                   //k54
                     "dez_zmrzuje",      "rosenje_zmrzuje",            "iglice", 											//k55
										 "sneg",             "zrnat_sneg",                 "ploha_sneg", 									//k56
										 "dez_s_snegom",     "babje_pseno",                "ploha_dez_sneg", 							//k57
										 "toca",             "sodra",                      "dim", 												//k58
										 "megla",            "megla_vidno_nebo",           "ledena_megla", 								//k59
										 "meglica",          "suha_motnost",               "talna_megla", 								//k60
										 "rosa",             "slana",                      "prsec",                       //k61                 
										 "poledica",         "poledica_tla",               "ledena_skorja", 							//k62
										 "ivje",             "trdo_ivje",                  "elijev_ogenj", 								//k63
										 "nevihta",          "grmenje",                    "bliskanje", 									//k64
										 "mocan_veter_6bf",  "mocan_veter_8bf",            "pesceni_ali_prasni_vrtinec", 	//k65
										 "snezni_vrtinci",   "nizki_snezni_vrtinci",       "tromba", 											//k66
										 "pescena_megla",    "prasni_ali_pesceni_vrtinci", "prasno_ali_pesceno_neurje", 	//k67
										 "halo_okoli_sonca", "venec_okoli_sonca",          "mavrica", 										//k68
										 "halo_okoli_lune",  "venec_okoli_lune",           "zrcaljenje", 									//k69
										 "snezna_odeja",     "polarni_sij",                "svetlobni_stebri"]; 					//k70
																	
// ===================================================================//

//seznam kontrol za sonce																					
var controls_sonce = ["checkIsEmpty", "checkIsEqualToPrev", "checkParams", "checkSum"];
																	
// ===================================================================//

//seznam kontrol za klimo
var controls_klima = ["checkIsEmpty",                             "checkIsEqualToPrev",                   "checkParams", 
											"checkPritisk",                             "checkTmaxT21Prev",                     "checkTminT21Prev", 
											"checkTmaxTerminske",                       "checkTminTerminske",                   "checkTminTmax", 
											"checkTmin5Tmin",                           "checkTmin5TminRazlikaJasnaOblacnaNoc", "checkTmin5Terminske", 
											"checkTmin5Tsuhi7NsnegPojaviK59",           "checkTmin5T21Prev",                    "checkTsuhiTminTmax", 
											"checkLedTmokriTsuhi",                      "checkTmokriTsuhiDeficit",              "checkTmokriTsuhiSpremembe", 
											"checkLed0Tmokri",                          "checkLed1Tmokri",                      "checkTsuhi7Tmin", 
											"checkTsuhi14Tmax",                         "checkRelVlagaPsihro",                  "checkRelVlagaPsihroRelVlagaHigro", 
											"checkPritiskVodnePare",                    "checkSmerHitrostVetra",                "checkSmerJakostVetra", 
											"checkHitrostPod108PojavVetraPrevec",       "checkJakostPod6PojavVetraPrevec",      "checkHitrostNad108PojavVetraPremalo", 											
											"checkJakostNad6PojavVetraPremalo",         "checkTlaTsuhi7",                       "checkTlaTsuhi14", 
											"checkTlaTsuhi21",                          "checkTlaZaporedniTermini",             "checkVidnostPojaviK54K56K57K59", 
											"checkVidnostPojaviK54K56K57K60",           "checkSonceOblacnost",                  "checkVisinaPojaviK54K55K56K57K58", 
											"checkVisinaOblika",                        "checkSsnegTla7",                       "checkSsnegNsneg", 
											"checkNsnegVisina",                         "checkNsnegVisinaTminTmaxPrev",         "checkNsnegOblika", 
											"checkSsnegNsnegSsnegprev",                 "checkNsnegOblikaPojaviK55K56K57",      "checkSsnegPojaviK54K57", 
											"checkVisinaSsnegSsnegprev",                "checkSsnegVoda",                       "checkTmaxPojaviK54K58", 
											"checkPojaviK55K56K57TminPrevisoka",        "checkOblikaPojaviK54K55K56K57K58",     "checkPojaviK55K56K57TminPrenizka", 
											"checkVisina0AliNad3PojaviK54K55K56K57K58", "checkOblikaPojaviK59K60K61K62K63",     "checkTlaTsuhi7Tmin5PojaviK61", 
											"checkTminTmin5PojaviK61",                  "checkTminTmin5PojaviK62",              "checkTlaPojaviK62", 
											"checkTminPojaviK59K63",                    "checkTminTmin5PojaviK59K63",           "checkTminPojaviK59K63K65", 
											"checkSsnegPojaviK70",                      "checkSsnegPojaviK70K56K57",            "checkTlaPojaviK70", 
											"checkPojaviK70K56K57"];

// ===================================================================//

//seznam kontrol za padavine
var controls_padavine = ["checkIsEmpty",                     "checkIsEqualToPrev",                       "checkParams", 
                         "checkVisinaPojaviK54K55K56K57K58", "checkVisinaOblika",                        "checkSsnegNsneg", 
                         "checkNsnegVisina",                 "checkNsnegOblika",                         "checkSsnegNsnegSsnegprev", 
                         "checkNsnegOblikaPojaviK55K56K57",  "checkSsnegPojaviK54K57",                   "checkVisinaSsnegSsnegprev", 
                         "checkOblikaPojaviK54K55K56K57K58", "checkVisina0AliNad3PojaviK54K55K56K57K58", "checkOblikaPojaviK59K60K61K62K63", 
                         "checkSsnegPojaviK70",              "checkSsnegPojaviK70K56K57",                "checkPojaviK70K56K57"];
																					
// ===================================================================//

