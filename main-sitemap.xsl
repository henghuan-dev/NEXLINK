<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap - NEXLINK</title>
        <style type="text/css">
          body { font-family: sans-serif; font-size: 13px; color: #333; margin: 0; padding: 20px; background: #f4f4f4; }
          table { width: 100%; border-collapse: collapse; background: #fff; box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; margin-top: 20px;}
          th { background: #000; color: #fff; padding: 12px; text-align: left; }
          td { padding: 12px; border-bottom: 1px solid #eee; vertical-align: top; }
          tr:hover { background: #f9f9f9; }
          a { color: #0066cc; text-decoration: none; word-break: break-all; }
          .priority-high { color: #d9534f; font-weight: bold; }
          .media-list { margin: 0; padding: 0; list-style: none; font-size: 11px; }
          .media-item { margin-bottom: 5px; color: #666; }
          .video-label { background: #ff0000; color: #fff; padding: 2px 5px; border-radius: 3px; font-weight: bold; margin-right: 5px;}
        </style>
      </head>
      <body>
        <h1>XML Sitemap (Generated for Human)</h1>
        <p>Total URLs: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></p>
        <table>
          <tr>
            <th width="35%">URL Path</th>
            <th width="5%">Prio</th>
            <th width="30%">Images</th>
            <th width="20%">Video</th>
            <th width="10%">Modified</th>
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
              <td>
                <ul class="media-list">
                  <xsl:for-each select="image:image">
                    <li class="media-item">
                      📸 <a href="{image:loc}" target="_blank"><xsl:value-of select="image:title"/></a>
                    </li>
                  </xsl:for-each>
                </ul>
              </td>
              <td>
                <xsl:for-each select="video:video">
                  <div class="media-item">
                    <span class="video-label">VIDEO</span> <xsl:value-of select="video:title"/><br/>
                    <small>Duration: <xsl:value-of select="video:duration"/>s</small>
                  </div>
                </xsl:for-each>
              </td>
              <td><xsl:value-of select="sitemap:lastmod"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>