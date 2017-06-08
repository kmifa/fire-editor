function clickBtn(){
	var btn = $("#send");

	btn.on("click",function(){
		
		var name = $("#name").val();
		var mail = $("#mail").val();
		var age = $("#age").val();
		var url = "anke-data/re-data.php";

		var obj = {
			"name" : name,
			"mail" : mail,
			"age" : age
		}

		$.ajax({
			url: url,
			type: 'POST',
			data: obj,
			dataType : 'json'
		})
		.done(function(data) {
			console.log("success");
			console.log(data);
		})
		.fail(function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest);
			console.log(textStatus);
			console.log(errorThrown);
		});

		return false;

	});
	
}

clickBtn();