
var rest = feathers.rest('/api');
var app = feathers()
	.configure(rest.jquery(window.jQuery));

var taskService = app.service('tasks');

var minutes_text = $(".minutes");
var seconds_text = $(".seconds");

var min_10x = Number(minutes_text[0]);
var min_1x = Number(minutes_text[1]);
var sec_10x = Number(seconds_text[0]);
var sec_1x = Number(seconds_text[1]);


var total_time = 2 * 60 * 1000; //total time in seconds, initially set to 2 minutes
var reset_time = total_time;
var timer;

/*Key notes on the functions:
Hitting the '+' allows users to increment the timer's minutes by 1
Hitting the '-' allows users to decrement the timer's minutes by 1, unless the time
	is less than 1 minute
Hitting "Start" starts the countdown, and if the user decides to reset the time,
	the time is reset to whatever the countdown was started at.
Hitting the "Stop" just pauses the time
Hitting "Reset" resets the time to whatever the timer was at "Start"

Relevant variables:  
	'reset_time' is the variable for the time in milliseconds that the timer is reset to
	'total_time' is the time variable that is changed everytime the timer counts down, and is incremented or decremented	
		with the '+' and '-' buttons
*/
//Compose template string
String.prototype.compose = (function () {
	var re = /\{{(.+?)\}}/g;
	return function (o) {
		return this.replace(re, function (_, k) {
			return typeof o[k] != 'undefined' ? o[k] : '';
		});
	}
} ());

$(document).ready(function () {

	taskService.find({}).then(tasks => tasks.forEach(addTask));

	//Start button begins timer
	$(".start").on("click", function () {
		if (total_time > 0) {
			reset_time = total_time;

			timer = setInterval(function () {
				total_time = total_time - 1000;
				var minutes = parseInt(total_time / 60000); //time in minutes
				var seconds = parseInt((total_time % 60000) / 1000); //time in seconds

				min_10x = parseInt(minutes / 10);
				min_1x = minutes % 10;
				sec_10x = parseInt(seconds / 10);
				sec_1x = seconds % 10;

				$(".minutes").text(min_10x.toString() + min_1x.toString());
				$(".seconds").text(sec_10x.toString() + sec_1x.toString());

				if (total_time <= 0) {
					clearInterval(timer);
					var audio = $("#timer-sound")[0];
					audio.play();
				}

			}, 1000);

		}

	});

	$(".stop").on('click', function () { //Stop button ends timer
		clearInterval(timer);
	});

	$(".reset").on('click', function () { //Reset ends timer and resets to whatever timer was at the START point
		clearInterval(timer);
		total_time = reset_time;

		var minutes = parseInt(total_time / 60000); //time in minutes
		var seconds = parseInt((total_time % 60000) / 1000); //time in seconds

		min_10x = parseInt(minutes / 10);
		min_1x = minutes % 10;
		sec_10x = parseInt(seconds / 10);
		sec_1x = seconds % 10;

		$(".minutes").text(min_10x.toString() + min_1x.toString());
		$(".seconds").text(sec_10x.toString() + sec_1x.toString());
	});


	$(".fa.fa-minus").on('click', function () { //subtracts 1 from minutes, unless total time < 1 minute

		if (total_time > 60000) {

			total_time -= 60000;
			var minutes = parseInt(total_time / 60000); //time in minutes
			min_10x = parseInt(minutes / 10);
			min_1x = minutes % 10;

			if (min_1x < 0) {
				if (min_10x <= 0) { //less than 10 minutes
					min_1x = 0;
				}
				else {  //greater than 10 minutes
					min_1x = 9;
					min_10x--;
				}
			}
			$(".minutes").text(min_10x.toString() + min_1x.toString());
		}
	});
	$(".fa.fa-plus").on('click', function () { //Adds 1 to minutes
		total_time += 60000;

		var minutes = parseInt(total_time / 60000); //time in minutes
		min_10x = parseInt(minutes / 10);
		min_1x = minutes % 10;

		if (min_1x > 9) {
			min_10x++;
			min_1x = 0;
		}
		$(".minutes").text(min_10x.toString() + min_1x.toString());
	});

	$(".save").on('click', function () {
		var description = $(".timerDescription").val();
		console.log('description', description);
		var timer = $(".minutes").text() + ":" + $(".seconds").text();
		taskService.create({
			timer: timer,
			description: description
		}).then(addTask);
	});

	function addTask(task) {
		var row = '<tr>' +
			'<td>{{id}}</td>' +
			'<td>{{timer}}</td>' +
			'<td>{{description}}</td>' +
			'</tr>';

		$(".timerTable > tbody").append(row.compose(task));
	};
});