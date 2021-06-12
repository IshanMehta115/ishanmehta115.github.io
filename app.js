var factor = 6;
var dist = 250;
var y_coordinate = 1;
var x_coordinate = 200;
var page_numbers = 5;


loading = function(){
  
  var t1 = document.getElementById("loader");
  // t1.style.transition = "ease";
  // t2.style.transition = "ease";
  // t2.style.display = "none";
  // t1.style.display = "initial";
  console.log("in function");
  t1.style.opacity = "0";
  t1.style.transition = "opacity 1s";
}
window.onload = function(){
    var index = window.location.href.indexOf("#page");
    if(index!=-1){
        console.log(index);
        window.location.href = window.location.href.substr(0,index);
    }
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
    // var op_value;
    // var temp = document.getElementById("particles-js");
    // var offset = 4*(-dist);
    // temp.style.transform = "perspective(250px) translateZ("+offset+"px)";

    // op_value = opacity_value(-offset,pageYOffset/factor);
    // if(op_value<=0){
    //   op_value = 0;
    // }
    // else if(1<=op_value){
    //     op_value=1;
    // }
    // temp.style.opacity = op_value;
    setTimeout(loading,3000);
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

window.onscroll = function(){

    var name,x;
    name = document.getElementById("name");
    x = pageYOffset/factor;
    name.style.transform = "perspective(400px) translateZ("+(-x)+"px)";

    name = document.getElementById("projects");
    x = pageYOffset/factor-dist*2;
    if(x>-100 && x<100)
        name.style.transform = "perspective(400px) translateZ("+(x)+"px)";

    name = document.getElementById("c_items");
    x = pageYOffset/factor-dist*3;
    if(x>10 && x<90)
        name.style.transform = "perspective(400px) translateZ("+(x)+"px)";

    var headings = document.getElementsByClassName("section-title");
    // console.log(headings.length);

    // var x = pageYOffset/factor;
    // headings.style.transform = "perspective(400px) translateZ("+(-x)+"px)";
    for(var i=0;i<page_numbers;i++){

        var op_value;
        var temp = document.getElementById("page"+(i+1));
        var x = pageYOffset/factor-(dist*i);

        // if(1<=i && i<=3){
        //     headings[i-1].style.transform = "perspective(600px) translateZ("+(x)+"px)";
        // }
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
    // var op_value;
    // var temp = document.getElementById("particles-js");
    // var x = pageYOffset/factor-(dist*4);

    //     // if(1<=i && i<=3){
    //     //     headings[i-1].style.transform = "perspective(600px) translateZ("+(x)+"px)";
    //     // }
    // temp.style.transform = "perspective(250px) translateZ("+x+"px)";

    // op_value = opacity_value(dist*4,pageYOffset/factor);
    // if(op_value<=0){
    //     op_value = 0;
    // }
    // else if(1<=op_value){
    //     op_value=1;
    // }
    // temp.style.opacity = op_value;
}




var flag = 0;
remove_box = function(){
  document.getElementById("copy_box").style.opacity = 0;
}
change_z_index = function(){
  document.getElementById("copy_box").style.zIndex=-100;
  flag=0;
}
copy_function = function(type){
  var temp = document.getElementById(type);
  var data = temp.textContent;
  const el = document.createElement('textarea');
  el.value = data;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  console.log(document.getElementById("copy_box").style.zIndex);
  if(flag==0)
  {
    flag=1;
    document.getElementById("copy_box").style.zIndex=100;
    document.getElementById("copy_box").style.opacity = 1;
    setTimeout(remove_box,1500);
    setTimeout(change_z_index,2000);
  }
}



/* -----------------------------------------------
/* How to use? : Check the GitHub README
/* ----------------------------------------------- */

/* To load a config file (particles.json) you need to host this demo (MAMP/WAMP/local)... */
/*
particlesJS.load('particles-js', 'particles.json', function() {
  console.log('particles.js loaded - callback');
});
*/

/* Otherwise just put the config content (json): */
particlesJS('particles-js',
  
  {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 5,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 6,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true,
    "config_demo": {
      "hide_card": false,
      "background_color": "#b61924",
      "background_image": "",
      "background_position": "50% 50%",
      "background_repeat": "no-repeat",
      "background_size": "cover"
    }
  }

);