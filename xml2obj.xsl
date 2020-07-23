<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:output method="text"/>
	
  <xsl:template match="sonce|padavine|klima">
    var id = new Number(<xsl:value-of select="@id"/>);
    id = parseInt("" + id);    
    try { transactions[<xsl:value-of select="@id"/>]; }
    catch(e) { throw "Seja je potekla!"; }
    transactions[<xsl:value-of select="@id"/>]["action"] = '<xsl:value-of select="@action"/>';
		transactions[<xsl:value-of select="@id"/>]["insertAll"] = new Boolean(<xsl:value-of select="@interval"/>);
    <xsl:apply-templates select="dsonce|dpadavine|dklima">
      <xsl:with-param name="id" select="@id" tunnel= "yes"/>
      <xsl:with-param name="type" select="name()" tunnel= "yes"/>
    </xsl:apply-templates>
  </xsl:template>
	
  <xsl:template match="dsonce|dpadavine|dklima">
    <xsl:param name="id" tunnel="yes"/>
    <xsl:param name="type" tunnel="yes"/>
    <xsl:apply-templates select="*">
      <xsl:with-param name="oid" select="@oid" tunnel= "yes"/>
    </xsl:apply-templates>
  </xsl:template>
	
	<xsl:template match="son_interpolacija|son_trajanje_04_05|son_trajanje_05_06|son_trajanje_06_07|son_trajanje_07_08|son_trajanje_08_09|son_trajanje_09_10|son_trajanje_10_11|son_trajanje_11_12|son_trajanje_12_13|son_trajanje_13_14|son_trajanje_14_15|son_trajanje_15_16|son_trajanje_16_17|son_trajanje_17_18|son_trajanje_18_19|son_trajanje_19_20|p14_interpolacija|p5_padavine|p6_oblika|p7_sneg_skupaj|p8_sneg_novi|p9_dez_sneg_dezsneg|p10_toca_slana_megla|p11_ivje_sodra_bpseno|p12_poledica_nevihta_vihveter|p13_sneznaodeja_rosa|k5_pritisk_7h|k6_pritisk_14h|k7_pritisk_21h|k5_pritisk_7h|k6_pritisk_14h|k7_pritisk_21h|k23_inter_tmaks|k8_maksimalna_temperatura|k24_inter_tmin|k9_minimalna_temperatura|k25_inter_tmin5|k10_minimalna_temperatura_5cm|k26_inter_ts07|k11_temperatura_suhi_7h|k27_inter_ts14|k12_temperatura_suhi_14h|k28_inter_ts21|k13_temperatura_suhi_21h|k29_inter_tm07|k14_temperatura_mokri_7h|k30_inter_tm14|k15_temperatura_mokri_14h|k31_inter_tm21|k16_temperatura_mokri_21h|k17_led_7h|k18_led_14h|k19_led_21h|k20_rel_vlaga_7h|k21_rel_vlaga_14h|k22_rel_vlaga_21h|k33_smer_vetra_7h|k35_smer_vetra_14h|k37_smer_vetra_21h|k34_jakost_vetra_7h|k36_jakost_vetra_14h|k38_jakost_vetra_21h|k34_hitrost_vetra_7h|k36_hitrost_vetra_14h|k38_hitrost_vetra_21h|k39_stanje_tal_7h|k40_stanje_tal_14h|k41_stanje_tal_21h|k42_vidnost_7h|k43_vidnost_14h|k44_vidnost_21h|k45_trajanje_sonca|k46_oblacnost_7h|k47_oblacnost_14h|k48_oblacnost_21h|k32_inter_padavine|k49_padavine|k50_oblika_padavin|k51_sneg_skupaj|k52_sneg_novi|k53_voda_v_snegu|k54_dez_rosenje_ploha_dezja|k55_dez_zmrz_rosen_zmrz_iglice|k56_sneg_zrnat_sneg_ploha_snega|k57_dez_s_sn_babje_psen_ploh_ds|k58_toca_sodra_dim|k59_megla_megla_z_vid_neb_led_m|k60_meglic_suha_motnost_talna_m|k61_rosa_slana_prsec_z_vodne_p_|k62_poledica_zled_poled__na_tl_|k63_ivje_trdo_ivje_elijev_og_|k64_nevihta_grmenje_bliskanje|k65_mocan_veter_6bf_8bf|k66_snezni_vrtici_tromba_1|k67_prasni_pesceni_vrtinci_2|k68_halo_venec_ok_sonca_mavrica|k69_halo_venec_ok_lune_zrcalje|k70_snezna_odeja">
    <xsl:param name="id" tunnel="yes"/>
    <xsl:param name="oid" tunnel="yes"/>		
    transactions[<xsl:value-of select="$id"/>]['<xsl:value-of select="$oid"/>']['<xsl:value-of select="name()"/>'].setNewVal(<xsl:value-of select="@val"/>);
  </xsl:template>
	
</xsl:stylesheet>

