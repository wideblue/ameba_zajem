<?xml version="1.0"?>

<xsl:stylesheet version="1.0"
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns:fi="http://apache.org/cocoon/forms/1.0#instance"
		exclude-result-prefixes="fi">
	
	<xsl:import href="field-styling.xsl"/>
	<xsl:include href="calendar-styling.xsl"/>
	
	<xsl:param name="resources-uri">resources</xsl:param>
	<xsl:param name="nw-uri">resources/winScripts</xsl:param>
	
	<xsl:template match="head" mode="forms-field">
		<xsl:apply-imports/>
		<script src="{$resources-uri}/mattkruse-lib/AnchorPosition.js" type="text/javascript"/>
		<script src="{$resources-uri}/mattkruse-lib/PopupWindow.js" type="text/javascript"/>
		<script src="{$resources-uri}/mattkruse-lib/OptionTransfer.js" type="text/javascript"/>
		<script src="{$resources-uri}/mattkruse-lib/selectbox.js" type="text/javascript"/>
		<xsl:apply-templates select="." mode="forms-calendar"/>		
	</xsl:template>
	
	<xsl:template match="body" mode="forms-field">
		<xsl:apply-imports/>
		<xsl:apply-templates select="." mode="forms-calendar"/>
	</xsl:template>

  <!--+ This template should not be necessary as this stylesheet "inherits"
      | all templates from 'forms-field-styling.xsl', but without it, it does
      | not work for me (using Xalan 2.5.1). It's like adding all methods of
      | a superclass in a subclass and calling everywhere only the super
      | implementation.
      +-->
	<xsl:template match="*">
		<xsl:apply-imports/>
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
