
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
	totalMarkspic = 0,
	innerLists = 1;
	
	var selectedQuestshort = [],
	    selectedQuestTof = [],
		selectedQuesttick = [],
		selectedQuestlong = [],
		selectedQuestfill = [];
		
	$('#alertContainer1, #alertContainer2').hide();
	$('#AddButton').attr('disabled', 'true');
	$('#hideBack').show();
	$('#hideNext, .showBottomButtons').hide();
	$('#backButton').css('opacity', '0.5');
/* 	console.log(count); */
	
	$(function () {
	$("#input").change(function () {
		// Save old value.
		$("#testDuration").val($("#input").val());
		/* console.log($("#input").val()); */
	  });
	});
	
$.ajax({
	type: 'GET',
	url: 'js/data.xml',
	dataType: 'xml',
	success: function xmlParser(xml){
		$(xml).find('chapter').each(function(){
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
	$('#questionContent').empty();
	var listIdCheck1 = 1;
	var innerlistId1 = 1;
	innerLists = 1;
	for(var i=0; i<=arrayChapters.length - 1; i++){
		var j = arrayChapters[i];
		var headerIdCheck = 1;	
		$('#questionContent').append('<div id="numberofDivsId'+(i+1)+'" class="numberofDivsStyle '+arrayChapters[i]+'"></div>');			
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
							
				$(xml).find('question[chapter="'+j+'"][type="'+questTypeValue+'"] questTitle').each(function(){
					$('#numberofDivsId'+(i+1)).append('<input class="headercheckBoxes '+questTypeValue+'" type="checkbox" id="headerIdCheckBox'+headerIdCheck+'"/><input type="number" class="totalMark" id="totalMark'+(i+1)+'" min="0" disabled/><div class="headerStyle" id="headerStyle'+(i+1)+'" style="font-weight: bold;">'+(i+1)+'. '+$(this).text()+'</div>');
					headerIdCheck = headerIdCheck + 1;
				});
				$(xml).find('question[chapter="'+j+'"][type="'+questTypeValue+'"] images').each(function(){
					$('#headerStyle'+(i+1)).append('<div><img class="questImages" src="images/'+$(this).text()+'"/></div>');
				});
				
				$(xml).find('question[chapter="'+j+'"][type="'+questTypeValue+'"] subq').each(function(){
					var questTypetext = $(this).text();
					var countText = (questTypetext.match(/=/g) || []).length;
					var split = questTypetext.split('=');
					$('#numberofDivsId'+(i+1)).append('<ol type="a" id="listId'+(i+1)+'"></ol>');
					var listIdCheck = 1;
					var innerlistId = 1;
					
					for(var s=0; s<=countText; s++){
						$('#listId'+(i+1)).append('<li id="'+listIdCheck1+'innerListId'+innerlistId+'" class="listStyle"><input class="listcheckBoxes '+questTypeValue+'" type="checkbox" id="'+listIdCheck1+'listIdCheckBox'+listIdCheck+'" value="'+split[s]+'">'+split[s]+'</li>'); 
						listIdCheck = listIdCheck + 1;
						innerlistId = innerlistId + 1;
					}
					listIdCheck1 = listIdCheck1 + 1;					
					innerlistId1 = innerlistId1 + 1;					
				});	
				$(xml).find('question[chapter="'+j+'"][type="'+questTypeValue+'"] ans').each(function(){
					var questAnswertext = $(this).text();
					/* console.log(questAnswertext) */
					var countAnswerText = (questAnswertext.match(/=/g) || []).length;
					var splitAnswer = questAnswertext.split('=');
										
					for(var k=1; k<=(countAnswerText+1); k++){
							$('#'+innerLists+'innerListId'+k).append('<span class="hideAnswers" id="'+innerLists+'innerListId'+k+'" style="float: right; border: 1px solid;">'+splitAnswer[(k-1)]+'</span>'); 
							/* listIdCheck = listIdCheck + 1; */
						}
					innerLists = innerLists + 1;
					/* listIdCheck1 = listIdCheck1 + 1; */			
				});
				
				$(xml).find('question[chapter="'+j+'"][type="match"] ans').each(function(){					
					$('#headerStyle'+(i+1)).append('<span class="hideAnswers">'+$(this).text()+'</span>');					
				});
			}
		});
	}
});

$(document).on('change', '.headercheckBoxes', function(){
	headercheckBoxes = $(this).attr('id');
	if($('#' +headercheckBoxes).is(':checked')){
		$('#' +headercheckBoxes).siblings('ol').find('.listcheckBoxes').prop('checked', true);
		$('#' +headercheckBoxes).siblings('.totalMark').prop('disabled', false);
		$('#hideQuestion').hide();
		$('#AddButton').css('opacity', '1')
	} 
	else{
		$('#' +headercheckBoxes).siblings('ol').find('.listcheckBoxes').prop('checked', false);
		$('#' +headercheckBoxes).siblings('.totalMark').prop('disabled', true);
	}
	
	if($(".headercheckBoxes:checked").length == 0){
		$('#hideQuestion').show();
		$('#AddButton').css('opacity', '0.5')
	}
});

$(document).on('change', '.listcheckBoxes', function(){
	listcheckBoxes = $(this).attr('id');
	if($('#' +listcheckBoxes).is(':checked')){
		$(this).parents('li').parents('ol').siblings('.headercheckBoxes').prop('checked', true);
		$(this).parents('li').parents('ol').siblings('.totalMark').prop('disabled', false);
		$('#hideQuestion').hide();
		$('#AddButton').css('opacity', '1')
	} 
	else{
		if($('#' +listcheckBoxes).parent().siblings('li').children('input').is(':checked')){
			$('#' +listcheckBoxes).parents('li').parents('ol').siblings('.headercheckBoxes').prop('checked', true);
		}
		else{			
			$('#' +listcheckBoxes).parents('li').parents('ol').siblings('.headercheckBoxes').prop('checked', false);
			$(this).parents('li').parents('ol').siblings('.totalMark').prop('disabled', true);
		}
	}	
	
	if($(".listcheckBoxes:checked").length == 0){
		$('#hideQuestion').show();
		$('#AddButton').css('opacity', '0.5')
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
	
	if(questModeCheck == 'fillblank'){
		totalMarksfill = totalMarksfill + parseInt($(this).val());
	}
	if(questModeCheck == 'longa'){
		totalMarkslong = totalMarkslong + parseInt($(this).val());
	}	
	if(questModeCheck == 'tick'){
		totalMarkstick = totalMarkstick + parseInt($(this).val());
	}
	if(questModeCheck == 'match'){
		totalMarksmatch = totalMarksmatch + parseInt($(this).val());
	}	
	if(questModeCheck == 'picQ'){
		totalMarkspic = totalMarkspic + parseInt($(this).val());
	}	
});

$('#AddButton').click(function(){
	
	countQuestions = countQuestions + $(".listcheckBoxes:checked").length;
		
	$('#questSelected').text(countQuestions);
	
	$('#hideNext').hide();
	$('#nextButton').css('opacity', '1');
	
	var length = $('.totalMark').length;	
	for(var l=1; l<=length; l++){
		if($(".headercheckBoxes:checked").siblings('#totalMark'+l).val() == ''){
			$('.alertContainer').show();
			$('.alertContent').text("Questions are selected, but 'Marks' are not provided. Please provide Marks.");
			return false;
		}
	}
	
	$('#questSelected').text(countQuestions);			
	questModeCheck = $('#questionMode').select().val();
	questModeText = $('#questionMode option:selected').text();			
	countMarks = totalMarksTof + totalMarksshort + totalMarksfill + totalMarkslong + totalMarkstick + totalMarksmatch + totalMarkspic;
	$('#totalMarks').text(countMarks);
	if(questModeCheck == 'fillblank' || questModeCheck == 'tick' || questModeCheck == 'Tof' || questModeCheck == 'longa' || questModeCheck == 'short'){
		var selected = new Array();
		var selectedAnswers = new Array();
		$(".listcheckBoxes:checked").each(function(){
			selected.push(this.value);
			selectedAnswers.push($(this).siblings('span').text());
		});	
		
		/* console.log(selectedAnswers); */
			
		if(questModeCheck == 'Tof'){
			var marks = totalMarksTof;
		}
		if(questModeCheck == 'short'){
			var marks = totalMarksshort;
		}
		
		if(questModeCheck == 'fillblank'){
			var marks = totalMarksfill;
		}
		if(questModeCheck == 'longa'){
			var marks = totalMarkslong;
		}
		
		if(questModeCheck == 'tick'){
			var marks = totalMarkstick;
		}
						
		var selectedMarks = new Array();
		$(".headercheckBoxes:checked").each(function (){
			selectedMarks.push($(this).siblings('.totalMark').val());
		});

					
		$('.showQuestions').append('<div class="showQuestionStyle" id="'+questModeCheck+'"><strong><span style="float: right;">['+marks+']</span></strong></div>');
		
		$('#'+questModeCheck).append('<strong><div id="'+showQuestionTypeList+'">'+showQuestionTypeList+'. '+questModeText+'</div></strong>')
		
		$('#'+questModeCheck).append('<ol type="a" class="showQuestionList'+questModeCheck+'"></ol>');
		for(var i=0; i<selected.length; i++){		
			$('.showQuestionList'+questModeCheck).append('<li>'+selected[i]+'</li>')
			$('.showQuestionList'+questModeCheck).append('<span class="hidePreviewAnswers" style="color: red;">Answer: '+selectedAnswers[i]+'</span>')
		}
		 showQuestionTypeList = showQuestionTypeList + 1;
		/*$('#'+questModeCheck).append('<span style="color: red;">Answers:</span>');
		$('#'+questModeCheck).append('<ol type="a" id="answerList"></ol></span>')
		for(var p=0; p<selectedAnswers.length; p++){					
			$('#'+questModeCheck).children('#answerList').append('<li style="margin-left: vmin; float: left;">'+selectedAnswers[p]+'</li>')
		} */
				
		/* if(questModeCheck == 'Tof'){
			for(var i=0; i<selected.length; i++){		
				selectedQuestTof[i] = selected[i];
			}
		}
		if(questModeCheck == 'short'){
			for(var i=0; i<selected.length; i++){		
				selectedQuestshort[i] = selected[i];	
			}
		}
		if(questModeCheck == 'fillblank'){
			for(var i=0; i<selected.length; i++){		
				selectedQuestfill[i] = selected[i];
			}
		}
		if(questModeCheck == 'longa'){
			for(var i=0; i<selected.length; i++){		
				selectedQuestlong[i] = selected[i];
			}
		}		
		if(questModeCheck == 'tick'){
			for(var i=0; i<selected.length; i++){		
				selectedQuesttick[i] = selected[i];
			}
		} */
	}
		
	if(questModeCheck == 'match'){			
		var selectedMatchImage = new Array();
		$(".match:checked").each(function () {
			selectedMatchImage.push($(this).siblings('.headerStyle').children('div').children('.questImages').attr('src'));
		});
		
		var marks = totalMarksmatch;
	
		var selectedMarks = new Array();
		/* var selectedAnswers = new Array(); */
		$(".headercheckBoxes:checked").each(function (){
			selectedMarks.push($(this).siblings('.totalMark').val());
			/* selectedAnswers.push(); */
		});	
		
		$('.showQuestions').append('<div class="showQuestionStyle" id="'+questModeCheck+'"><strong><span style="float: right;">['+marks+']</span></strong></div>');		
		$('#'+questModeCheck).append('<strong><div id="'+showQuestionTypeList+'">'+showQuestionTypeList+'. '+questModeText+'</div></strong>')		
		$('#'+questModeCheck).append('<ol type="a" class="showQuestionList'+questModeCheck+'"></ol>');
		for(var i=0; i<selectedMatchImage.length; i++){			
			$('.showQuestionList'+questModeCheck).append('<li style="margin-bottom: 2vmin;"><img style="width: 60vmin; height: 25vmin;" src="'+selectedMatchImage[i]+'"/></li>')
			/* $('#showQuestionList'+questModeCheck).append('<span style="color: red;">Answer: '+selectedAnswers[i]+'</span>') */
		}
		var questAnswertext = $(".match:checked").siblings('.headerStyle').children('span').text();
		var countAnswerText = (questAnswertext.match(/=/g) || []).length;
		var splitAnswer = questAnswertext.split('=');
		
		console.log(splitAnswer)
		$('.showQuestionList'+questModeCheck).append('<span class="hidePreviewAnswers" style="color: red;">Answer: <ol type="a" id="matchAnswerList"></ol></span>'); 
		for(var k=0; k<=countAnswerText; k++){
			
			$('.showQuestionList'+questModeCheck).children('span').children('#matchAnswerList').append('<li>'+splitAnswer[k]+'</li>'); 
		}	
		
		showQuestionTypeList = showQuestionTypeList + 1;	
		
	}
	
	if(questModeCheck == 'picQ'){
		var selectedpicQ = new Array();
		var selectedAnswers = new Array();
		$(".listcheckBoxes:checked").each(function () {
			selectedpicQ.push(this.value);
			selectedAnswers.push($(this).siblings('span').text());
		});		
			
		var marks = totalMarkspic;			
		var selectedMarks = new Array();
		$(".headercheckBoxes:checked").each(function (){
			selectedMarks.push($(this).siblings('.totalMark').val());
		});
		
		var selectedImage = new Array();
		$(".picQ:checked").each(function (){
			selectedImage.push($(this).siblings('.headerStyle').children('div').children('.questImages').attr('src'));
		});
		
		$('.showQuestions').append('<div class="showQuestionStyle" id="'+questModeCheck+'"><strong><span style="float: right;">['+marks+']</span></strong></div>');		
		$('#'+questModeCheck).append('<strong><div id="'+showQuestionTypeList+'">'+showQuestionTypeList+'. '+questModeText+'</div></strong>')		
		$('#'+questModeCheck).append('<ol type="a" class="showQuestionList'+questModeCheck+'"></ol>');
		for(var i=0; i<selectedpicQ.length; i++){
			$('.showQuestionList'+questModeCheck).append('<img style="width: 60vmin; height: 25vmin;" src="'+selectedImage[i]+'"/>')	
			$('.showQuestionList'+questModeCheck).append('<li>'+selectedpicQ[i]+'</li>');
			$('.showQuestionList'+questModeCheck).append('<span class="hidePreviewAnswers" style="color: red;">Answer: '+selectedAnswers[i]+'</span>')
			console.log(selectedpicQ[i]);
		}
		showQuestionTypeList = showQuestionTypeList + 1;
	}
});

$('#copyButton, #copyButtonImage').click(function(){	
	var copyTypeValue = $('#copyMode option:selected').attr('value');
	console.log(copyTypeValue);
	if(copyTypeValue == "Teacher's Copy"){
		$('.hidePreviewAnswers').show();
		$('#previewCopy').text($('#copyMode option:selected').val());
	}
	if(copyTypeValue == "Student's Copy"){
		$('.hidePreviewAnswers').hide();
		$('#previewCopy').text($('#copyMode option:selected').val());
	}
});

$('#back').click(function(){
	
	$('#AddButton').attr('disabled', 'true');
	showQuestionTypeList = 1;
	countMarks = 0;
	totalMarksTof = 0, 
	totalMarksfill = 0, 
	totalMarkstick = 0, 
	totalMarksmatch = 0, 
	totalMarksshort = 0,
	totalMarkslong = 0,
	totalMarkspic = 0,
	innerLists = 1;
	$('#totalMarks').text(countMarks);
	if(count == 1){
		$('#backButton').css('opacity', '0.5');
		$('#hideBack').show();
	}
	$('#div'+count).hide();
	--count;
	if(count == 1){
		$('#hideBack').show();
		$('#backButton').css('opacity', '0.5');
	}
	
	$('#topMenu'+count).children('a').removeClass('inactive').addClass('active');
	$('#topMenu'+(count+1)).children('a').removeClass('active').addClass('inactive');
	countQuestions = 0;
	$('#questSelected').text(0);
	
	if(count == 2){
		$('#hideNext').hide();
		$('#nextButton').css('opacity', '1');
		$('.showBottomButtons').hide();
	}
	
	if(count == 3){
		$('.emptyContent').empty();
		$('#nextButton').css('opacity', '0.5');
		$('#hideNext').show();
		$('#hideQuestion').show();
		$('#AddButton').css('opacity', '0.5')
	}
	$('#div'+count).show();
});

$('.alertOkayButton').click(function(){
	$('#alertContainer1').hide();
});

/* $('.alertYesButton').click(function(){
	$('#alertContainer2').hide();
});

$('.alertNoButton').click(function(){
	copyMode = $('#copyMode').select().val();
	var date = $.datepicker.formatDate('dd/mm/yy', new Date());
	$('#previewName').text(testName);
	$('#previewCopy').text(copyMode);
	$('#previewTime').text(testDuration);
	$('#previewMarks').text(countMarks);
	$('#previewDate').text(date);
}); */

$('#next').click(function(){
	testName = $('#testName').val();
	testDuration = $('#input').val();
	testMode = $('#testMode').select().val();
	testLogo = $('#blah').attr('src');
	/* console.log(testLogo); */
	$('#backButton').css('opacity', '1');
	$('#hideBack').hide();
	if($('#testName').val().length == 0 || $('#testDuration').val().length == 0){
		$('#alertContainer1').show();
		$('.alertContent').text('Enter details to proceed further.');
		$('#backButton').css('opacity', '0.5');
		$('#hideBack').show();
		return false;
	}
	
	if(count == 2 && $('.checkBoxes:checked').length == 0){
		$('#alertContainer1').show();
		$('.alertContent').text('Select Chapters, then click Next.');
		return false;
	}
	if(count == 3){
		$('.showBottomButtons').show();
		if($('.headercheckBoxes:checked').length == 0){
			$('#alertContainer1').show();
			$('.alertContent').text('Select Questions to add in the Test.');
			return false;
		}
		else{
			copyMode = $('#copyMode option:selected').val();
			var date = $.datepicker.formatDate('dd/mm/yy', new Date());
			$('#previewName').text(testName);
			$('#previewCopy').text(copyMode);
			$('#previewTime').text(testDuration);
			$('#previewMarks').text(countMarks);
			$('#previewDate').text(date);
			var countHeaderCheckBox;
			countHeaderCheckBox = $('.headercheckBoxes:checked').length;
			for(var i =1; i <=countHeaderCheckBox; i++){
			}			
		}
	}
	
	/* if(count == 4){
		$('#alertContainer').show();
		$('#alertContent').text('Do you want to Preview Test or add more Questions. Click Yes to continue and No to add more.');
		$('#nextButton').css('opacity', '0.5');
		$('#next, #nextButton').attr('disabled', true);
	} */
	
	$('#questionContent').empty();			
	$('#div'+count).hide();
	$('#topMenu'+count).children('a').removeClass('active').addClass('inactive');
	$('#topMenu'+(count+1)).children('a').removeClass('inactive').addClass('active');
	count++;
	if(count == 3){
		$('#hideNext, #hideQuestion').show();
		$('#nextButton').css('opacity', '0.5');
		$('.showBottomButtons').show();
		$('#AddButton').css('opacity', '0.5');
	}
	if(count == 4){
		/* $('#alertContainer2').show();
		$('.alertContent').text('Do you want to Preview Test or add more Questions. Click Yes to continue and No to add more.');
		count = 4; */
		/* return false; */
	}
	
	/* console.log(count); */
	countQuestions = 0;
	/* $('#questSelected').text(0); */
	$('#div'+count).show();
	
	arrayChapters.sort(function(a,b) 
	{
	   return a - b;
	});
	
});

$('#selectAll').click(function(){
	var length;
	$('.checkBoxes').each(function(){
		if(!state){
			this.checked = true;
			length = $('.checkBoxes:checked').length;
			arrayChapters.push($('#' +length).attr('id'));			
		}	
		else{
			this.checked = false; 
			length = $('.checkBoxes:not(:checked)').length;
			var removeChapter = $('#' +length).attr('id');
			arrayChapters = $.grep(arrayChapters, function(value) {
				return value != removeChapter;
			});
		}
	});
	
	if(state){
		state = false;
	}
	else{
		state = true;
	}
});

$(document).on('change', '.checkBoxes', function(){
	checkboxId = $(this).attr('id');
	if($('#' +checkboxId).is(':checked')){
		arrayChapters.push(checkboxId);
	} 
	else{
		var removeChapter = checkboxId;
		console.log(removeChapter)
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
