<?xml version="1.0"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	
	<xsl:include href="page-styling.xsl"/>
	<xsl:include href="field-styling.xsl"/>
	
	<xsl:template match="head">
		<head>
			<xsl:apply-templates/>
			<xsl:apply-templates select="." mode="forms-page"/>
			<xsl:apply-templates select="." mode="forms-field"/>
		</head>
	</xsl:template>
	
	<xsl:template match="body">
		<body>
      <!-- If template with mode 'forms-page' adds text or elements
          |  template with mode 'forms-field' can no longer add attributes!!!
          -->
			<xsl:apply-templates select="." mode="forms-page"/>
			<xsl:apply-templates select="." mode="forms-field"/>
			<xsl:apply-templates/>
		</body>
	</xsl:template>

</xsl:stylesheet>
