
var testName, testDuration, testMode, testLogo, checkboxId, questTypeValue, numberofDivs, i, j, headercheckBoxes, listcheckBoxes, totalMark, copyMode, questModeCheck, questModeText;
var checkboxesId = 1,
	questTypeId = 1,
	state = false,
	arrayChapters = [],
	count = 1,
	countQuestions = 0,
	countMarks = 0,
	showQuestionTypeList = 1,
	totalMarksTof = 0, 
	totalMarksfill = 0, 
	totalMarkstick = 0, 
	totalMarksmatch = 0, 
	totalMarksshort = 0,
	totalMarkslong = 0,
	totalMarkspic = 0;
	
	var selectedQuestshort = [],
	    selectedQuestTof = [];
		
	$('#alertContainer').hide();
	$('#AddButton').attr('disabled', 'true');
$.ajax({
	type: 'GET',
	url: 'js/data.xml',
	dataType: 'xml',
	success: function xmlParser(xml){
		$(xml).find('chapter').each(function(){
			/* $('#chapterList').append('<input class="checkBoxes" type="checkbox" id="'+checkboxId+'"><li>' +$(this).text()+ ' </li>'); */
			$('.selectChapters').append('<div id="chapterList"><input class="checkBoxes" type="checkbox" id="'+checkboxesId+'"> '+$(this).attr('num')+'. '+$(this).text()+' </div>');
			checkboxesId = checkboxesId + 1;
		});
		
		$(xml).find('qtype').each(function(){
			$('#questionMode').append('<option class="questType" id='+questTypeId+' value='+$(this).attr('lbl')+'>'+$(this).attr('desc')+'</option>');
			questTypeId = questTypeId + 1;
		});	
	}
});

$('#questionButton').click(function(){
	
	$('#displayQuestions').show();
	$('#questionContent, #questTypeHeader').empty();
	questTypeValue = $('.questType:selected').attr('value');
	/* console.log(questTypeValue);
 */
	$('#questionContent').empty();
	var listIdCheck1 = 1;
	for(var i=0; i<=arrayChapters.length - 1; i++){
		var j = arrayChapters[i];
		var headerIdCheck = 1;	
		$('#questionContent').append('<div id="numberofDivsId'+(i+1)+'" class="numberofDivsStyle '+arrayChapters[i]+'"></div>');			
		/* console.log(j); */
		$.ajax({
			type: 'GET',
			url: 'js/data.xml',
			dataType: 'xml',
			ajaxJ: j,
			ajaxI: i,
			success: function xmlParser(xml){
				// Capture the current value of 'i'.
				j = this.ajaxJ; // Reinstate the correct value for 'i'.
				i = this.ajaxI;
				/* alert(i); */
				
				$(xml).find('question[chapter="'+j+'"][type="'+questTypeValue+'"] questTitle').each(function(){
					$('#numberofDivsId'+(i+1)).append('<input class="headercheckBoxes '+questTypeValue+'" type="checkbox" id="headerIdCheckBox'+headerIdCheck+'"/><input type="number" class="totalMark" id="totalMark'+(i+1)+'" min="0" disabled/><div class="headerStyle" id="headerStyle'+(i+1)+'" style="font-weight: bold;">'+(i+1)+'. '+$(this).text()+'</div>');
					headerIdCheck = headerIdCheck + 1;
				});
				$(xml).find('question[chapter="'+j+'"][type="'+questTypeValue+'"] images').each(function(){
					$('#headerStyle'+(i+1)).append('<div><img class="questImages" src="images/'+$(this).text()+'"/></div>');
				});
				$(xml).find('question[chapter="'+j+'"][type="'+questTypeValue+'"] subq').each(function(){
					var questTypetext = $(this).text();
					/* console.log(questTypetext); */
					var countText = (questTypetext.match(/=/g) || []).length;
					/* console.log(countText); */
					var split = questTypetext.split('=');
					$('#numberofDivsId'+(i+1)).append('<ol type="a" id="listId'+(i+1)+'"></ol>');
					var listIdCheck = 1;
					
					for(var s=0; s<=countText; s++){
						/* console.log(split[s]); */
						/* $('#listId'+(i+1)).append('<input class="listcheckBoxes" type="checkbox" id="'+listIdCheck1+'listIdCheckBox'+listIdCheck+'"><li class="listStyle">'+split[s]+'</li>'); */
						$('#listId'+(i+1)).append('<li class="listStyle"><input class="listcheckBoxes '+questTypeValue+'" type="checkbox" id="'+listIdCheck1+'listIdCheckBox'+listIdCheck+'" value="'+split[s]+'">'+split[s]+'</li>'); 
						listIdCheck = listIdCheck + 1;
					}
					listIdCheck1 = listIdCheck1 + 1;
					/* $('#numberofDivsId'+(i+1)).append(''+$(this).text()+''); */			
				});
				
			}
		});
	}
});

$(document).on('change', '.headercheckBoxes', function(){
	headercheckBoxes = $(this).attr('id');
	if($('#' +headercheckBoxes).is(':checked')){
		$('#' +headercheckBoxes).siblings('ol').find('.listcheckBoxes').prop('checked', true);
		/* countQuestions = countQuestions + $('#' +headercheckBoxes).siblings('ol').find('.listcheckBoxes').prop('checked', true).length;
		
		console.log(countQuestions)
		$('#questSelected').text(countQuestions); */
		
		$('#' +headercheckBoxes).siblings('.totalMark').prop('disabled', false);
		$('#AddButton').removeAttr("disabled");
	} 
	else{
		/* countQuestions = countQuestions - $('#' +headercheckBoxes).siblings('ol').find('.listcheckBoxes:checked').length;
		console.log(countQuestions)
		$('#questSelected').text(countQuestions); */
		$('#' +headercheckBoxes).siblings('ol').find('.listcheckBoxes').prop('checked', false);
		$('#' +headercheckBoxes).siblings('.totalMark').prop('disabled', true);
		/*  */
	}
	
	if($(".headercheckBoxes:checked").length == 0){
		$('#AddButton').attr('disabled', 'true');
	}
});

$(document).on('change', '.listcheckBoxes', function(){
	listcheckBoxes = $(this).attr('id');
	if($('#' +listcheckBoxes).is(':checked')){
		$(this).parents('li').parents('ol').siblings('.headercheckBoxes').prop('checked', true);
		/* countQuestions = countQuestions + $('#' +listcheckBoxes).prop('checked', true).length;
		console.log(countQuestions)
		$('#questSelected').text(countQuestions); */
		$(this).parents('li').parents('ol').siblings('.totalMark').prop('disabled', false);
	} 
	else{
		if($('#' +listcheckBoxes).parent().siblings('li').children('input').is(':checked')){
			$('#' +listcheckBoxes).parents('li').parents('ol').siblings('.headercheckBoxes').prop('checked', true);
			/* countQuestions = countQuestions - $('#' +listcheckBoxes).prop('checked', false).length;
			console.log(countQuestions)
			$('#questSelected').text(countQuestions); */
		}
		else{			
			/* countQuestions = countQuestions - $('#' +listcheckBoxes).prop('checked', false).length;
			console.log(countQuestions)
			$('#questSelected').text(countQuestions); */
			$('#' +listcheckBoxes).parents('li').parents('ol').siblings('.headercheckBoxes').prop('checked', false);
			$(this).parents('li').parents('ol').siblings('.totalMark').prop('disabled', true);
		}
	}
});

$(document).on('change', '.totalMark', function(){
	
	questModeCheck = $('#questionMode').select().val();
	
	if(questModeCheck == 'Tof'){
		totalMarksTof = totalMarksTof + parseInt($(this).val());
	}
	if(questModeCheck == 'short'){
		totalMarksshort = totalMarksshort + parseInt($(this).val());
	}
	console.log('totalMarksTof:' +totalMarksTof);
	console.log('totalMarksshort:' +totalMarksshort);
	
});

$('#AddButton').click(function(){
	
	var length = $('.totalMark').length;
	
	for(var l=1; l<=length; l++){
		if($(".headercheckBoxes:checked").siblings('#totalMark'+l).val() == ''){
			$('#alertContainer').show();
			$('#alertContent').text("Questions are selected, but 'Marks' are not provided. <br/> Please provide Marks");
			return false;
		}
	}
				
		/* countQuestions = countQuestions + $('.listcheckBoxes').prop('checked', true).length; */
		
		/* countQuestions = countQuestions + 1; */
			$('#questSelected').text(countQuestions);
			
			questModeCheck = $('#questionMode').select().val();
			questModeText = $('#questionMode option:selected').text();
			
			countMarks = totalMarksTof + totalMarksshort;
			console.log('countMarks:' +countMarks);
			
			$('#totalMarks').text(countMarks);
			
			console.log(questModeText);
			
			if(questModeCheck == 'fillblank' || questModeCheck == 'tick' || questModeCheck == 'Tof' || questModeCheck == 'longa' || questModeCheck == 'short'){
				var selected = new Array();
				$(".listcheckBoxes:checked").each(function(){
					selected.push(this.value);
				});	
				
				if(questModeCheck == 'Tof'){
					var marks = totalMarksTof;
				}
				if(questModeCheck == 'short'){
					var marks = totalMarksshort;
				}
				
				var selectedMarks = new Array();
				$(".headercheckBoxes:checked").each(function (){
					selectedMarks.push($(this).siblings('.totalMark').val());
				});
				console.log(selectedMarks);
						
				$('.showQuestions').append('<div class="showQuestionStyle" id="'+questModeCheck+'"><span style="float: right;">['+marks+']</span></div>');
				
				$('#'+questModeCheck).append('<div id="'+showQuestionTypeList+'">'+showQuestionTypeList+'. '+questModeText+'</div>')
				
				$('#'+questModeCheck).append('<ol type="a" id="showQuestionList'+questModeCheck+'"></ol>');
				for(var i=0; i<selected.length; i++){		
					$('#showQuestionList'+questModeCheck).append('<li>'+selected[i]+'</li>')
					/* console.log(selected[i]);		 */	
				}
				showQuestionTypeList = showQuestionTypeList + 1;
				
				if(questModeCheck == 'Tof'){
					for(var i=0; i<selected.length; i++){		
						selectedQuestTof[i] = selected[i];
						/* console.log(selectedQuestTof[i]);	 */		
					}
				}
				if(questModeCheck == 'short'){
					for(var i=0; i<selected.length; i++){		
						selectedQuestshort[i] = selected[i];
						/* console.log(selectedQuestshort[i]);	 */		
					}
				}
			}
			
			if(questModeCheck == 'match'){
				
				var selectedMatchImage = new Array();
				$(".match:checked").each(function () {
					selectedMatchImage.push($(this).siblings('.headerStyle').children('div').children('.questImages').attr('src'));
				});
				
				console.log(selectedMatchImage)
				
				$('.showQuestions').append('<div class="showQuestionStyle" id="'+questModeCheck+'"></div>');
				
				$('#'+questModeCheck).append('<div id="'+showQuestionTypeList+'">'+showQuestionTypeList+'. '+questModeText+'</div>')
			
				$('#'+questModeCheck).append('<ol type="a" class="showQuestionList'+questModeCheck+'"></ol>');
				for(var i=0; i<selectedMatchImage.length; i++){			
					$('.showQuestionList'+questModeCheck).append('<li style="margin-bottom: 2vmin;"><img src="'+selectedMatchImage[i]+'"/></li>')
					console.log(selectedMatchImage[i]);
				}
				showQuestionTypeList = showQuestionTypeList + 1;
			}
			
			if(questModeCheck == 'picQ'){
				/* var checkedId; */
				var selectedpicQ = new Array();
				$(".listcheckBoxes:checked").each(function () {
					selectedpicQ.push(this.value);
					/* checkedId = $(this).attr('id');
					console.log(checkedId) */
				});
				
				var selectedImage = new Array();
				$(".picQ:checked").each(function (){
					selectedImage.push($(this).siblings('.headerStyle').children('div').children('.questImages').attr('src'));
				});
				
				console.log(selectedImage)
				
				$('.showQuestions').append('<div class="showQuestionStyle" id="'+questModeCheck+'"></div>');
				
				$('#'+questModeCheck).append('<div id="'+showQuestionTypeList+'">'+showQuestionTypeList+'. '+questModeText+'</div>')
			
				$('#'+questModeCheck).append('<ol type="a" class="showQuestionList'+questModeCheck+'"></ol>');
				for(var i=0; i<selectedpicQ.length; i++){
					$('.showQuestionList'+questModeCheck).append('<img src="'+selectedImage[i]+'"/>')	
					$('.showQuestionList'+questModeCheck).append('<li>'+selectedpicQ[i]+'</li>')
					console.log(selectedpicQ[i]);
				}
				showQuestionTypeList = showQuestionTypeList + 1;
			}
		
	
});

$('#copyButton').click(function(){
	
	/* if($('#copyMode').select().val() == "Student's Copy"){
		var questModeCheck = $('#questionMode').select().val();
		var questModeText = $('#questionMode option:selected').text();

		console.log(questModeText);
		
		if(questModeCheck == 'fillblank' || questModeCheck == 'tick' || questModeCheck == 'Tof' || questModeCheck == 'longa' || questModeCheck == 'short'){
			var selected = new Array();
			$(".listcheckBoxes:checked").each(function(){
				selected.push(this.value);
			});
					
			$('.showQuestions').append('<div class="showQuestionStyle" id="'+questModeCheck+'"></div>');
			
			$('#'+questModeCheck).append('<div id="'+showQuestionTypeList+'">'+showQuestionTypeList+'. '+questModeText+'</div>')
			
			$('#'+questModeCheck).append('<ol type="a" id="showQuestionList'+questModeCheck+'"></ol>');
			for(var i=0; i<selected.length; i++){		
				$('#showQuestionList'+questModeCheck).append('<li>'+selected[i]+'</li>')
				console.log(selected[i]);			
			}
			showQuestionTypeList = showQuestionTypeList + 1;
		}
		
		if(questModeCheck == 'match'){
			
			var selectedMatchImage = new Array();
			$(".match:checked").each(function () {
				selectedMatchImage.push($(this).siblings('.headerStyle').children('div').children('.questImages').attr('src'));
			});
			
			console.log(selectedMatchImage)
			
			$('.showQuestions').append('<div class="showQuestionStyle" id="'+questModeCheck+'"></div>');
			
			$('#'+questModeCheck).append('<div id="'+showQuestionTypeList+'">'+showQuestionTypeList+'. '+questModeText+'</div>')
		
			$('#'+questModeCheck).append('<ol type="a" class="showQuestionList'+questModeCheck+'"></ol>');
			for(var i=0; i<selectedMatchImage.length; i++){			
				$('.showQuestionList'+questModeCheck).append('<li style="margin-bottom: 2vmin;"><img src="'+selectedMatchImage[i]+'"/></li>')
				console.log(selectedMatchImage[i]);
			}
			showQuestionTypeList = showQuestionTypeList + 1;
		}
		
		if(questModeCheck == 'picQ'){
			var selectedpicQ = new Array();
			$(".listcheckBoxes:checked").each(function () {
				selectedpicQ.push(this.value);
			});
			
			var selectedImage = new Array();
			$(".picQ:checked").each(function (){
				selectedImage.push($(this).siblings('.headerStyle').children('div').children('.questImages').attr('src'));
			});
			
			console.log(selectedImage)
			
			$('.showQuestions').append('<div class="showQuestionStyle" id="'+questModeCheck+'"></div>');
			
			$('#'+questModeCheck).append('<div id="'+showQuestionTypeList+'">'+showQuestionTypeList+'. '+questModeText+'</div>')
		
			$('#'+questModeCheck).append('<ol type="a" class="showQuestionList'+questModeCheck+'"></ol>');
			for(var i=0; i<selectedpicQ.length; i++){
				$('.showQuestionList'+questModeCheck).append('<img src="'+selectedImage[i]+'"/>')	
				$('.showQuestionList'+questModeCheck).append('<li>'+selectedpicQ[i]+'</li>')
				console.log(selectedpicQ[i]);
			}
			showQuestionTypeList = showQuestionTypeList + 1;
		}
	} */
	/*if($('#copyMode').select().val() == "Teacher's Copy"){
		
		
		
		 $('.showQuestionStyle').empty();
		console.log(questModeText);
		
		if(questModeCheck == 'fillblank' || questModeCheck == 'tick' || questModeCheck == 'Tof' || questModeCheck == 'longa' || questModeCheck == 'short'){
			
			$('.showQuestions').append('<div class="showQuestionStyle" id="'+questModeCheck+'"></div>');
			
			$('#'+questModeCheck).append('<div id="'+showQuestionTypeList+'">'+showQuestionTypeList+'. '+questModeText+'</div>')
			
			$('#'+questModeCheck).append('<ol type="a" id="showQuestionList'+questModeCheck+'"></ol>');
			if(questModeCheck == 'Tof'){
				for(var i=0; i<selectedQuestTof.length; i++){		
					$('#showQuestionList'+questModeCheck).append('<li>'+selectedQuestTof[i]+'</li>')
					console.log(selectedQuestTof[i]);			
				}
			}			
			$('#'+questModeCheck).append('<div class="showQuestionAnswer" id="">Answer</div>')
			showQuestionTypeList = showQuestionTypeList + 1;
		}
		
		if(questModeCheck == 'match'){
			
			var selectedMatchImage = new Array();
			$(".match:checked").each(function () {
				selectedMatchImage.push($(this).siblings('.headerStyle').children('div').children('.questImages').attr('src'));
			});
			
			console.log(selectedMatchImage)
			
			$('.showQuestions').append('<div class="showQuestionStyle" id="'+questModeCheck+'"></div>');
			
			$('#'+questModeCheck).append('<div id="'+showQuestionTypeList+'">'+showQuestionTypeList+'. '+questModeText+'</div>')
		
			$('#'+questModeCheck).append('<ol type="a" class="showQuestionList'+questModeCheck+'"></ol>');
			for(var i=0; i<selectedMatchImage.length; i++){			
				$('.showQuestionList'+questModeCheck).append('<li style="margin-bottom: 2vmin;"><img src="'+selectedMatchImage[i]+'"/></li>')
				console.log(selectedMatchImage[i]);
			}
			showQuestionTypeList = showQuestionTypeList + 1;
		}
		
		if(questModeCheck == 'picQ'){
			var selectedpicQ = new Array();
			$(".listcheckBoxes:checked").each(function () {
				selectedpicQ.push(this.value);
			});
			
			var selectedImage = new Array();
			$(".picQ:checked").each(function (){
				selectedImage.push($(this).siblings('.headerStyle').children('div').children('.questImages').attr('src'));
			});
			
			console.log(selectedImage)
			
			$('.showQuestions').append('<div class="showQuestionStyle" id="'+questModeCheck+'"></div>');
			
			$('#'+questModeCheck).append('<div id="'+showQuestionTypeList+'">'+showQuestionTypeList+'. '+questModeText+'</div>')
		
			$('#'+questModeCheck).append('<ol type="a" class="showQuestionList'+questModeCheck+'"></ol>');
			for(var i=0; i<selectedpicQ.length; i++){
				$('.showQuestionList'+questModeCheck).append('<img src="'+selectedImage[i]+'"/>')	
				$('.showQuestionList'+questModeCheck).append('<li>'+selectedpicQ[i]+'</li>')
				console.log(selectedpicQ[i]);
			}
			showQuestionTypeList = showQuestionTypeList + 1;
		}
	} */
	
	
});

$('#back').click(function(){
	showQuestionTypeList = 1;
	countMarks = 0;
	totalMarksTof = 0, 
	totalMarksfill = 0, 
	totalMarkstick = 0, 
	totalMarksmatch = 0, 
	totalMarksshort = 0,
	totalMarkslong = 0,
	totalMarkspic = 0;
	$('#totalMarks').text(countMarks);
	$('#div'+count).hide();
	--count;
	console.log(count);
	$('#topMenu'+count).children('a').removeClass('inactive').addClass('active');
	$('#topMenu'+(count+1)).children('a').removeClass('active').addClass('inactive');
	countQuestions = 0;
	$('#questSelected').text(0);
	if(count == 3){
		$('.emptyContent').empty();
	}
	$('#div'+count).show();	
	/* $('#nextButton').show(); */
});

$('#alertOkayButton').click(function(){
	$('#alertContainer').hide();
});

$('#next').click(function(){
	console.log(count);
	testName = $('#testName').val();
	testDuration = $('#testDuration').val();
	testMode = $('#testMode').select().val();
	testLogo = $('#blah').attr('src');
	console.log(testLogo);
	if($('#testName').val().length == 0 || $('#testDuration').val().length == 0){
		/* alert('Enter details') */
		$('#alertContainer').show();
		$('#alertContent').text('Enter details to proceed further.');
		return false;
	}
	/* else{
		console.log(testName.length);
		console.log(testDuration);
		console.log(testMode);		
	} */
		
	if(count == 2 && $('.checkBoxes:checked').length == 0){
		$('#alertContainer').show();
		$('#alertContent').text('Select Chapters, then click Next.');
		/* alert('Please select Chapters'); */
		return false;
	}
	if(count == 3){
		if($('.headercheckBoxes:checked').length == 0){
			$('#alertContainer').show();
			$('#alertContent').text('Select Questions to add in the Test.');
			return false;
		}
		else{
			copyMode = $('#copyMode').select().val();
			var date = $.datepicker.formatDate('dd/mm/yy', new Date());
			/* $('#previewLogo').append('img src=""') */
			$('#previewName').text(testName);
			$('#previewCopy').text(copyMode);
			$('#previewTime').text(testDuration);
			$('#previewMarks').text(countMarks);
			$('#previewDate').text(date);
			var countHeaderCheckBox;
			countHeaderCheckBox = $('.headercheckBoxes:checked').length;
			for(var i =1; i <=countHeaderCheckBox; i++){
				/* alert($('.headercheckBoxes:checked').attr('id')) */
			}			
		}
	}
	
	if(count == 4){
		$('#alertContainer').show();
		$('#alertContent').text('Do you want to Preview Test or add more Questions. Click Yes to continue and No to add more.');
	}
	
	$('#questionContent').empty();
			
			$('#div'+count).hide();
			$('#topMenu'+count).children('a').removeClass('active').addClass('inactive');
			$('#topMenu'+(count+1)).children('a').removeClass('inactive').addClass('active');
			++count;
			console.log(count);
			
			
			countQuestions = 0;
			$('#questSelected').text(0);
			$('#div'+count).show();

			
			arrayChapters.sort(function(a,b) 
			{
			   return a - b;
			});
	
});

$('#selectAll').click(function(){
	$('.checkBoxes').each(function(){
		if(!state){
			this.checked = true; 
		}	
		else{
			this.checked = false; 
		}
	});
	
	if(state){
		state = false;
	}
	else{
		state = true;
	}
});



/* $(document).on('click', '.checkBoxes', function(){
	checkboxId = $(this).attr('id');
	if($('#' +checkboxId).is(':checked')){
		console.log($('#' +checkboxId).attr('id'));
		$('#questionContent').append('<div id="numberofDivsId'+checkboxId+'" class="numberofDivsStyle"></div>');
		$.ajax({
			type: 'GET',
			url: 'js/data.xml',
			dataType: 'xml',
			success: xmlParserQuestion
		});
	} 
	else{
		$('#numberofDivsId'+checkboxId).remove();
	}
}); */

$(document).on('change', '.checkBoxes', function(){
	checkboxId = $(this).attr('id');
	if($('#' +checkboxId).is(':checked')){
		arrayChapters.push(checkboxId);
	} 
	else{
		var removeChapter = checkboxId;
		console.log(removeChapter)
		// arrayChapters.splice($.inArray(itemtoRemove, arrayChapters), 1);
		arrayChapters = $.grep(arrayChapters, function(value) {
		  return value != removeChapter;
		});
	}
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
			$('#blah').css('width', '20vmin');
			$('#blah').css('height', '20vmin');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$("#imgInp").change(function(){
    readURL(this);
});



/* For refernce */
$('#button1').click(function(){
	$('#questionContent').empty();
	numberofDivs = $('#input1').val();	
	for(i=1; i<=numberofDivs; i++){
		$('#questionContent').append('<div id="numberofDivsId'+i+'" class="numberofDivsStyle"></div>');
	}
});

function printData()
{
   var divToPrint=document.getElementById("printContent");
   newWin= window.open("");
   newWin.document.write(divToPrint.outerHTML);
   newWin.print();
   newWin.close();
}

$('#printButton').on('click',function(){
	printData();
})

/* 
for(var i=0; i<10; i++){
   (function(index){
      $.ajax({
       //
       success:function(data){
          $("#p" + index + "_points").html(data);
       }
      });
   })(i);
} */