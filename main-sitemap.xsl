<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap - NEXLINK</title>
        <style type="text/css">
          body { font-family: sans-serif; font-size: 14px; color: #333; margin: 0; padding: 20px; background: #f4f4f4; }
          h1 { color: #000; font-size: 24px; }
          table { width: 100%; border-collapse: collapse; background: #fff; box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
          th { background: #000; color: #fff; padding: 12px; text-align: left; }
          td { padding: 12px; border-bottom: 1px solid #eee; }
          tr:hover { background: #f9f9f9; }
          a { color: #0066cc; text-decoration: none; }
          .priority-high { color: #d9534f; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap (Generated for Human)</h1>
        <p>Total URLs: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></p>
        <table>
          <tr>
            <th>URL Path</th>
            <th>Priority</th>
            <th>Last Modified</th>
          </tr>
          <xsl:for-each select="sitemap:urlset/sitemap:url">
            <tr>
              <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
              <td>
                <xsl:choose>
                  <xsl:when test="sitemap:priority &gt;= 0.8">
                    <span class="priority-high"><xsl:value-of select="sitemap:priority"/></span>
                  </xsl:when>
                  <xsl:otherwise><xsl:value-of select="sitemap:priority"/></xsl:otherwise>
                </xsl:choose>
              </td>
              <td><xsl:value-of select="sitemap:lastmod"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>