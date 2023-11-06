<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<title>Log in</title>
</head>

<body>
	<div class="login">
		<h1>Login</h1>
		<form action="/scripts/php/authenticate-script.php" method="post">
			<label for="username">
				<i class="fas fa-user"></i>
			</label>
			<input type="text" name="username" placeholder="Username" id="username" required>
			<br>
			<input type="password" name="password" placeholder="Password" id="password" required>
			<br>
			<label for="checkbox">remember my login </label>
			<input type="checkbox" name="remember">
			<br>
			<input type="submit" name="submit" value="Login">
		</form>
	</div>
</body>

</html>