$(document).ready(function() {
  var today = new Date();
  var this_year = today.getFullYear();
  var this_month = parseInt(today.getMonth())+1;
  var this_day = today.getDate();
  var days = new Array();

  var submit_d = this_day;
  var submit_m = this_month;
  var submit_y = this_year;
  var submit_w = 1;
  var TYPE = 1;

  var $mon = $('.mon');
  var $days = $('.days');
  var $year = $('.yrs');
  var $post = $('.post');

  function getDays(year){
    days[0] = 0;
    for(var i=1; i<13; i++){
      if(i<8){
        if(i%2 == 1)
          days[i] = 31;
        else{
          if(i == 2){
            if((year%4 == 0 && year%100 != 0) || year%400 == 0)
              days[i] = 29;
            else
              days[i] = 28;
          }else
            days[i] = 30;
        }
      }else{
        if(i%2 == 1)
          days[i] = 30;
        else
          days[i] = 31;
      }
    }
  }

  function getSundays(year, month){
    var temp = new Date();
    temp.setFullYear(year, month-1, 1);
    var day_of_first = temp.getDay();      // day of month.first
    var sunday = 1;
    if(day_of_first == 0){
      sunday = 1;
    }else{
      sunday = 7-day_of_first+1;
    }
    return sunday;
  }

  function setColor_ofSunday(first_sunday){
    var sunday = first_sunday;
    while(sunday < 32){
      $('.dclass:nth-child('+sunday+')').addClass('sunday');
      sunday += 7;
    }
  }

  function setDays(this_month){
    $days.empty();
    for(var i=0; i<days[this_month]; i++){
      $days.append("<p class='dclass'>"+(i+1)+"</p>");
    }
  }

  function setmonText(this_month){
    if(this_month<10)
      $mon.text("0"+this_month);
    else
      $mon.text(this_month);
  }

  function accessToServer(type){  // 1 >> write, 2 >> read

    var request_url;
    var method_type;
    var data_to_send;
    if(type === 1){
      request_url = '/post';
      method_type = 'post';
      data_to_send = { content:$('.mypost').val(),
               date:submit_y+"_"+submit_m+"_"+submit_d,
               weather:submit_w }
    }
    else if(type === 2){
      request_url = '/post/'+submit_y+"_"+submit_m+"_"+submit_d,
      method_type = 'get';
      data_to_send = { date:submit_y+"_"+submit_m+"_"+submit_d }
    }

    $.ajax({
      url: request_url,
      type: method_type,
      dataType: 'json',
      data: data_to_send,

      complete: function (jqXHR, textStatus) {
        // callback
      },
      success: function (data, textStatus, jqXHR) {
        if(type == 1)
          alert("저장되었습니다");
        else{
          $('.mypost').val(data.content);
          setWeather(data.weather);
          var temp = data.updated_at.split("T");
          var y_m_d = temp[0].split("-");
          var to_show = y_m_d[0]+". "+y_m_d[1]+". "+y_m_d[2];
          var time = temp[1].split(".")[0];
          to_show = to_show+" - "+time;
          $('.written-date').append(to_show);
        }
        // success callback
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // error callback
      }
    });
  }

  function setWeather(nth_child){
    var $weather = $('.weather');
    $weather.removeClass('w-selected');
    $('.weather:nth-child('+nth_child+')').addClass('w-selected');
  }

  function resetMyPost(){
    $('.mypost').val("");
    $post.fadeOut('700');
    $post.fadeIn('1000');
  }

  getDays(this_year);   // count days in this year on each month
  setDays(this_month);  // append days on this month
  var first_sunday = getSundays(this_year, this_month);
  setColor_ofSunday(first_sunday);
  $post.hide();
  $post.fadeIn('1000');
  $year.text(this_year);
  setmonText(this_month);
  $('.dclass:nth-child('+this_day+')').addClass("d-selected");
  TYPE = 2;
  accessToServer(TYPE);

  // event handlers

  $(document).on('click', '.dclass', function(){
    $('.dclass').removeClass('d-selected');
    $(this).addClass('d-selected');
    $('.written-date').text("updated at ");
    submit_d = $(this).text();
    $('.mypost').val('');
    $post.fadeOut('700');
    $post.fadeIn('1000');
    TYPE = 2;
    accessToServer(TYPE);
  });

  $(document).on('click', '.submit-button', function(){
    TYPE = 1;
    if(confirm("등록하시겠습니까?")){
      accessToServer(TYPE);
    }else{
    }
  });

  $(document).on('click', '.backward', function(){
    var current_month = $mon.text();
    var prev_month;
    if(current_month > 1){
      prev_month = current_month - 1;
    }else{
      prev_month = 12;
      var prev_year = $year.text() - 1;
      $year.text(prev_year);
      submit_y = prev_year;
      getDays(prev_year);
    }
    setmonText(prev_month);
    setDays(prev_month);
    submit_m = prev_month;
    var first_sunday = getSundays(submit_y, submit_m);
    setColor_ofSunday(first_sunday);
    resetMyPost();
    this_day = 1;
    submit_d = this_day;
    $('.dclass:first-child').addClass('d-selected');
  });

  $(document).on('click', '.forward', function(){
    var current_month = $mon.text();
    var next_month;
    if(current_month < 12){
      next_month = parseInt(current_month, 10) + 1;
    }else{
      next_month = 1;
      var next_year = parseInt($year.text()) + 1;
      $year.text(next_year);
      submit_y = next_year;
      getDays(next_year);
    }
    setmonText(next_month);
    setDays(next_month);
    submit_m = next_month;
    var first_sunday = getSundays(submit_y, submit_m);
    setColor_ofSunday(first_sunday);
    resetMyPost();
    this_day = 1;
    submit_d = this_day;
    $('.dclass:first-child').addClass('d-selected');
  });

  $(document).on('click', '.weather', function(){
    submit_w = $(this).attr('value');
    setWeather(submit_w);
  });

});

