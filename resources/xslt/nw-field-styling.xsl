<?xml version="1.0"?>

<xsl:stylesheet version="1.0"
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns:fi="http://apache.org/cocoon/forms/1.0#instance"
		exclude-result-prefixes="fi">s
	
	<xsl:import href="field-styling.xsl"/>
	
	<xsl:param name="resources-uri">resources</xsl:param>
	<xsl:param name="nw-uri">resources/nw</xsl:param>
	<xsl:param name="context-path"/>
	
	<xsl:template match="head" mode="forms-field">
		<xsl:apply-imports/>
		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="web/form.css"/>
		<style type="text/css">@import "all.css";</style>
		<link rel="stylesheet" type="text/css" href="web/nw.css"/>		
			<!-- FORMS -->
		<script src="{$resources-uri}/mattkruse-lib/AnchorPosition.js" type="text/javascript"/>
		<script src="{$resources-uri}/mattkruse-lib/PopupWindow.js" type="text/javascript"/>
		<script src="{$resources-uri}/mattkruse-lib/OptionTransfer.js" type="text/javascript"/>
		<script src="{$resources-uri}/mattkruse-lib/selectbox.js" type="text/javascript"/>
		<!-- NETWINDOWS -->
		<script type="text/javascript">
			var _contextPath= "/default/";
			NWconfig = [];
			NWconfig["applyThemedStyles"] = false;	
		</script>
		<script src="{$nw-uri}/winScripts/netWindows.js" type="text/javascript"/>
			<script type="text/javascript">
			<![CDATA[
			with(__scripts__){
				//widget includes
				require(__config__.widgetPath+"window_widget.js");
				require(__config__.widgetPath+"combo_box_widget.js");
			}
			function envInit(){
				// create_console('debugging console', 0, 0, 'right', 'top', 600, 200, 80);
			}
			__sig__.connectByName(__env__, "onLoad", null, "envInit");
			]]>
		</script>			
		<script type="text/javascript" src="../lib/web/form.js"/>
		</xsl:template>
	
	<xsl:template match="body" mode="forms-field">
		<xsl:apply-imports/>
	</xsl:template>

  <!--+ This template should not be necessary as this stylesheet "inherits"
      | all templates from 'field-styling.xsl', but without it, it does
      | not work for me (using Xalan 2.5.1). It's like adding all methods of
      | a superclass in a subclass and calling everywhere only the super
      | implementation.
      +-->
	<xsl:template match="*">
		<xsl:apply-imports/>
	</xsl:template>
	
	  <!--+
      | Generic fi:field : produce an <input>
      +-->
	  <!--
	<xsl:template match="fi:field">
		<a class="forms-field" title="{fi:hint}" type="text">
			<xsl:apply-templates select="." mode="styling"/>
			<xsl:value-of select="fi:value"/>
		</a>
		<xsl:apply-templates select="." mode="common"/>
		<input name="{@id}" id="{@id}" type="hidden">
			<xsl:attribute name="value" select="fi:value"/>
		</input>
	</xsl:template>
-->
	<!-- combo box -->
	
	<xsl:template match="fi:field[fi:selection-list]" priority="1">
		<xsl:variable name="value" select="fi:selection-list/fi:item[1]/fi:label/node()"/>
		<input type="text" class="forms-select" readonly="readonly" onclick="showComboFor(this)">
			<xsl:attribute name="value" select="$value"/>
			<xsl:attribute name="title" select="$value"/>
		</input>
		<!--
		<a href="#" class="forms-field, forms-select" onclick="showComboFor(this)">
			<xsl:attribute name="title" select="$value"/>
			<xsl:value-of select="concat(substring( $value, 1, 10 ),'...')"/>					
		</a>
		-->
		<!-- hidden input for posting -->
		<input name="{@id}" id="{@id}" type="hidden">
			<xsl:attribute name="value" select="fi:value"/>
			<xsl:attribute name="dataClass" select="fi:styling/@dataClass"/>
		</input>
	</xsl:template>
	
  <!--+
      | Add fi:help to the common stuff.
      +-->
	<xsl:template match="fi:*" mode="common">
		<xsl:apply-imports/>
		<xsl:apply-templates select="fi:help"/>
	</xsl:template>

  <!--+
      | 
      +-->
	<xsl:template match="fi:help">
		<xsl:variable name="id" select="generate-id()"/>
		<div class="forms-help" id="help{$id}" style="visibility:hidden; position:absolute;">
			<xsl:apply-templates select="node()"/>
		</div>
		<script type="text/javascript">
      var helpWin<xsl:value-of select="$id"/> = forms_createPopupWindow('help<xsl:value-of select="$id"/>');
    </script>
		<a id="{$id}" name="{$id}" href="#" onclick="helpWin{$id}.showPopup('{$id}');return false;">
			<img border="0" src="{$resources-uri}/help.gif"/>
		</a>
	</xsl:template>
	
	<!--+
      | fi:multivaluefield with list-type='double-listbox' styling
      +-->
	<xsl:template match="fi:multivaluefield[fi:styling/@list-type='double-listbox']">
		<xsl:variable name="id" select="@id"/>
		<xsl:variable name="values" select="fi:values/fi:value/text()"/>
		
		<span class="forms-doubleList" title="{fi:hint}">
			<table>
				<xsl:if test="fi:styling/fi:available-label|fi:styling/fi:selected-label">
					<tr>
						<th>
							<xsl:copy-of select="fi:styling/fi:available-label/node()"/>
						</th>
						<th></th>
						<th>
							<xsl:copy-of select="fi:styling/fi:selected-label/node()"/>
						</th>
					</tr>
				</xsl:if>
				<tr>
					<td>
            <!-- select for the unselected values -->
						<select id="{@id}.unselected" name="{@id}.unselected" multiple="multiple"
								ondblclick="opt{generate-id()}.forms_transferRight()">
							<xsl:apply-templates select="." mode="styling"/>
							<xsl:for-each select="fi:selection-list/fi:item">
								<xsl:variable name="value" select="@value"/>
								<xsl:if test="not($values[. = $value])">
									<option value="{$value}">
										<xsl:copy-of select="fi:label/node()"/>
									</option>
								</xsl:if>
							</xsl:for-each>
						</select>
					</td>
					<td>
            <!-- command buttons -->
            <!-- strangely, IE adds an extra blank line if there only a button on a line. So we surround it with nbsp -->
						<xsl:text>&#160;</xsl:text>
						<input type="button" value="&gt;" onclick="opt{generate-id()}.forms_transferRight()"/>
						<xsl:text>&#160;</xsl:text>
						<br/>
						<xsl:text>&#160;</xsl:text>
						<input type="button" value="&gt;&gt;" onclick="opt{generate-id()}.forms_transferAllRight()"/>
						<xsl:text>&#160;</xsl:text>
						<br/>
						<xsl:text>&#160;</xsl:text>
						<input type="button" value="&lt;" onclick="opt{generate-id()}.forms_transferLeft()"/>
						<xsl:text>&#160;</xsl:text>
						<br/>
						<xsl:text>&#160;</xsl:text>
						<input type="button" value="&lt;&lt;" onclick="opt{generate-id()}.forms_transferAllLeft()"/>
						<xsl:text>&#160;</xsl:text>
						<br/>
						<xsl:apply-templates select="." mode="common"/>
					</td>
					<td>
            <!-- select for the selected values -->
						<select id="{@id}" name="{@id}" multiple="multiple"
								ondblclick="opt{generate-id()}.forms_transferLeft()">
							<xsl:apply-templates select="." mode="styling"/>
							<xsl:for-each select="fi:selection-list/fi:item">
								<xsl:variable name="value" select="@value"/>
								<xsl:if test="$values[. = $value]">
									<option value="{$value}">
										<xsl:copy-of select="fi:label/node()"/>
									</option>
								</xsl:if>
							</xsl:for-each>
						</select>
					</td>
				</tr>
			</table>
			<script type="text/javascript">
        var opt<xsl:value-of select="generate-id()"/> = forms_createOptionTransfer('<xsl:value-of select="@id"/>', <xsl:value-of select="fi:styling/@submit-on-change = 'true'"/>);
      </script>
		</span>
	</xsl:template>
	
	<xsl:template match="fi:multivaluefield/fi:styling[@list-type='double-listbox']/@submit-on-change" mode="styling"/>

</xsl:stylesheet>
