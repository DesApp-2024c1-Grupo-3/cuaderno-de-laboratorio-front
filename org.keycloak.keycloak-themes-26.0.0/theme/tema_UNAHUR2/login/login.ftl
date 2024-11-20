<#import "template.ftl" as layout>
<html>
    <head>
        <title>PROBANDO PROBANDO</title>
    </head>
    <body>
        <h1>Welcome to My Custom Login</h1>
        <form action="${url.loginAction}" method="POST">
            <label for="username">Username</label>
            <input type="text" name="username" id="username" required/>
            <label for="password">Password</label>
            <input type="password" name="password" id="password" required/>
            <button type="submit">Login</button>
        </form>
    </body>
</html>
