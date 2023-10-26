<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<title>Sign up</title>
</head>

<body>
	<div class="login">
		<h1>Sign up</h1>
		<form action="/includes/signup-script.php" method="post">
			<label for="username">
				<i class="fas fa-user"></i>
			</label>
			<input type="text" name="username" placeholder="Username" id="username" required>

			<input type="password" name="password" placeholder="Password" id="password" required>
			<input type="password" name="repeat" placeholder="Repeat password" id="repeat" required>
			<input type="submit" name="submit" value="submit">
		</form>
	</div>
</body>

</html>