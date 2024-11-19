<#import "template.ftl" as layout>
<@layout.registrationLayout section>

<!-- Encabezado -->
<div class="header">
    <img src="../../assets/UNAHUR.png" alt="${msg("logoAlt")}" />
    <div class="header-title">${msg("labNotebookTitle")}</div>
</div>

<!-- Tarjeta de inicio de sesión -->
<div class="login-card">
    <h1>${msg("loginAccountTitle")}</h1>
    <form action="${url.loginAction}" method="post">
        <input type="text" name="username" placeholder="${msg("usernamePlaceholder")}" required />
        <input type="password" name="password" placeholder="${msg("passwordPlaceholder")}" required />
        <button type="submit">${msg("loginButton")}</button>
    </form>
    <a href="${url.forgotPasswordUrl}" class="forgot-password">${msg("forgotPasswordLink")}</a>
</div>

<!-- Pie de página -->
<div class="footer">
    <span>${msg("footerLocation")}</span>
    <span>${msg("footerInstitution")}</span>
    <span>${msg("footerContact")}</span>
</div>

</@layout.registrationLayout>
