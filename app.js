var factor = 6;
var dist = 350;
var y_coordinate = 1;
var x_coordinate = 200;
var page_numbers = 5;
var maxScrollY = 0;
var blocked_time;

window.onload = function(){

  blocked_time = Date.now();
  const contentHeight = document.documentElement.scrollHeight;
  const viewportHeight = window.innerHeight;
  maxScrollY = contentHeight - viewportHeight;


  slides = document.getElementsByClassName('project');
  total_slides = slides.length;
  next_button = document.getElementById('next_btn');
  prev_button = document.getElementById('prev_btn');
  slide_width = slides[0].getBoundingClientRect().width;
  console.log(slide_width)
  cur_slide_index = 0;
  carousel_change_time = 10000;

  for (var i = 0; i < slides.length; i++) {
    slides[i].style.left = slide_width * i + 'px';
  }
  next_button.addEventListener('click', e => {

    move_to_next_slide();

  })
  prev_button.addEventListener('click', e => {
    move_to_prev_slide();

  })
  ele = document.getElementById('slide_number');
  ele.textContent = "1 / " + String(total_slides);
  setInterval(move_to_next_slide, carousel_change_time);
  setInterval(correct_y_offset, 3000);

  for(var i=0;i<page_numbers;i++){
      var op_value;
      var temp = document.getElementById("page"+(i+1));
      var offset = i*(-dist);
      temp.style.transform = "perspective(250px) translateZ("+offset+"px)";

      op_value = opacity_value(-offset,pageYOffset/factor);
      if(op_value<=0){
            op_value = 0;
        }
        else if(1<=op_value){
          op_value=1;
      }
      temp.style.opacity = op_value;
  }
}
    
function opacity_value(mid_point,cur_pos){
  var x1,x2,y1,y2;
  if(cur_pos<=mid_point){
    x2 = mid_point;
    y2 = y_coordinate;
    x1 = mid_point-x_coordinate;
    y1 = 0;
  }
else{
  x2 = mid_point;
    y2 = y_coordinate;
    x1 = mid_point+x_coordinate;
    y1 = 0;
}
return ((y2-y1)/(x2-x1))*(cur_pos-x1)+y1;
}

function set_y_offset(yOffset){
  blocked_time = Date.now() + 1000;
  window.scrollTo({
    top: yOffset,
    behavior: 'smooth'
  });
}

function correct_y_offset(){
  if((Date.now() - blocked_time) < 0){
    return;
  }
  var corrected_value = Math.round((pageYOffset / maxScrollY) * (page_numbers - 1)) * (maxScrollY / (page_numbers - 1));
  set_y_offset(corrected_value);
}

window.onscroll = function(){

    blocked_time = Date.now() + 1000; 

    var name,x;
    name = document.getElementById("name");
    x = pageYOffset/factor;
    name.style.transform = "perspective(400px) translateZ("+(-x)+"px)";

    for(var i=0;i<page_numbers;i++){

        var op_value;
        var temp = document.getElementById("page"+(i+1));
        var x = pageYOffset/factor-(dist*i);

        temp.style.transform = "perspective(250px) translateZ("+x+"px)";

        op_value = opacity_value(dist*i,pageYOffset/factor);
        if(op_value<=0){
            op_value = 0;
        }
        else if(1<=op_value){
            op_value=1;
        }
        temp.style.opacity = op_value;
    }
}




var flag = 0;
remove_box = function(){
  document.getElementById("copy_box").style.opacity = 0;
}
change_z_index = function(){
  document.getElementById("copy_box").style.zIndex=-100;
  flag=0;
}
function display_text(Text){
  if(Text.length > 30) return;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile) {
    return;
  }
  var ele = document.getElementById("icon_text");
  data = Text
  if("Email"==Text){
    data = data + "<br>(ishan19309@iiitd.ac.in)"
  }
  else if("Github"==Text){
    data = data + "<br>(github.com/IshanMehta115)"
  }
  ele.innerHTML = data
  ele.style.opacity = 1;
}

function hide_text(){
  var ele = document.getElementById("icon_text");
  ele.style.opacity = 0;
}


var slides;
var next_button;
var prev_button;
var nav_btns;
var nav_indicators;
var slide_width;
var total_slides;
var cur_slide_index;
var carousel_change_time;


set_new_slide = function (target_index) {
  ele = document.getElementById('slide_number');
  ele.textContent = String(target_index + 1) + " / " + String(total_slides);
  var amount_to_shift = self.slides[target_index].style.left;

  for (var i = 0; i < slides.length; i++) {
    slides[i].style.transform = 'translateX(-' + amount_to_shift + ')';
  }
  cur_slide_index = target_index;

  console.log(cur_slide_index);
}
move_to_next_slide = function () {
  var target_slide_index = (cur_slide_index + 1) % (total_slides);
  set_new_slide(target_slide_index);
}
move_to_prev_slide = function () {
  var target_slide_index = (cur_slide_index - 1 + total_slides) % (total_slides);
  set_new_slide(target_slide_index);
}


