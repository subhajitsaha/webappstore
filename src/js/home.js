(function(){
   //console.log('Home loaded');
   
   var el = document.getElementById("box");
   var delta = 20;
   
   el.style.left = '0px';
   el.style.backgroundColor = getRandomColor();
   
   function moveIt () {
       var left = parseInt((el.style.left).replace('px', ''), 10);
       
       //console.log('Left ' + left);
   
       if (left >= window.innerWidth - el.offsetWidth) {
           delta = -20;
           el.style.backgroundColor = getRandomColor();
       } 
       
       if (left <= 0) {
           delta = 20;
           el.style.backgroundColor = getRandomColor();
       }
       
       el.style.left = (parseInt(left, 10)+delta) + 'px';
       
       setTimeout(moveIt, 1000/60);
    }
   
    function getRandomColor() {
       var letters = '0123456789ABCDEF'.split('');
       var color = '#';
    
       for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
       }
       return color;
    }
   
    moveIt();
}());