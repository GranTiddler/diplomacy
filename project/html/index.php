<html>
<script>
	function getAspectRatio(image) {

		const w = image.naturalWidth;
		const h = image.naturalHeight;

		let aspectRatio = h / w;

		return aspectRatio;
	};

	const images = [];
</script>
<?php
$photos = preg_grep('/^([^.])/', scandir("assets"));
foreach ($photos as $value) {
	echo "<script type='text/JavaScript'>images.push('$value');</script>";
}
?>

<script>
	const image_elements = [];

	for (const element of images) {
		var new_image = document.createElement('img');
		new_image.src = '/assets/' + element;

		new_image.setAttribute('id', element)
		new_image.setAttribute('class', 'image')
		image_elements.push(new_image);
	}


	const aspect_ratios = [];
	image_elements.forEach(element => aspect_ratios.push(getAspectRatio(element)));

	console.log(image_elements);
	console.log(aspect_ratios);


</script>

<style>
	div {
		max-width: 100%;
		height: 100%;
	}

	img {
		width: 100%;
	}

	.image {
		width: 100%
	}

	.row {
		width: 100%;
		display: flex;
	}

	.col {
		width: 33.33%;
		align-self: top;
	}
</style>

<body>
	<div class="row">
		<div class='col' id='col1'></div>
		<div class='col' id='col2'></div>
		<div class='col' id='col3'></div>
	</div>

	<script>

		var col1_height = 0;
		var col2_height = 0;
		var col3_height = 0;

		let col1 = document.getElementById("col1");
		let col2 = document.getElementById("col2");
		let col3 = document.getElementById("col3");


		for (const element of image_elements) {
			if (col1_height <= col2_height && col1_height <= col3_height) {
				col1.appendChild(element);
				col1_height += getAspectRatio(element);
			}
			else if (col2_height <= col1_height && col2_height <= col3_height) {
				col2.appendChild(element);
				col2_height += getAspectRatio(element);
				
			}
			else {
				col3.appendChild(element);
				col3_height += getAspectRatio(element);
			}
			
			console.log("-----")
			console.log(col1_height);
			console.log(col2_height);
			console.log(col3_height);
		}
	</script>
</body>

</html>