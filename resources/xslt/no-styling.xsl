<?xml version="1.0"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns:fi="http://apache.org/cocoon/forms/1.0#instance"
                exclude-result-prefixes="fi">
	
	<xsl:template match="@*|node()" priority="-1">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
		</xsl:copy>
	</xsl:template>

	
</xsl:stylesheet>
