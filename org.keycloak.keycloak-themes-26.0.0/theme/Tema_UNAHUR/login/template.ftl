<#macro registrationLayout section>
  <html lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${msg("labNotebookTitle")}</title>
      <link rel="stylesheet" href="${url.resourcesPath}/themes/${theme}/login/resources/css/styles.css">
    </head>
    <body>
      <div class="layout-container">
        <div class="header">
          <img src="${url.resourcesPath}/themes/${theme}/resources/img/logo.png" alt="${msg("logoAlt")}">
          <h1>${msg("labNotebookTitle")}</h1>
        </div>

        <div class="content">
          <#if section == "header">
            <div class="header-content">
              <h2>${msg("loginAccountTitle")}</h2>
            </div>
          </#if>

          <#if section == "form">
            <div class="form-content">
              <#include "login.ftl">
            </div>
          </#if>

          <#if section == "info">
            <div class="info-content">
              <p>${msg("footerLocation")}</p>
              <p>${msg("footerInstitution")}</p>
              <p>${msg("footerContact")}</p>
            </div>
          </#if>

          <#if section == "socialProviders">
            <div class="social-providers-content">
              <#include "social-providers.ftl">
            </div>
          </#if>
        </div>

        <div class="footer">
          <p>&copy; ${msg("footerInstitution")} | ${msg("footerLocation")}</p>
          <p>${msg("footerContact")}</p>
        </div>
      </div>
    </body>
  </html>
</#macro>
