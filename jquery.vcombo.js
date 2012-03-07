//     vcombo.js 1.0.0
//     (c) 2012 Viking.
//     For all details and documentation:
//     https://github.com/vikingmute/vcombo
(function(){
	var settings = {
		method:"ajax",
		numlimit:5,
		src:'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20music.artist.search%20where%20keyword%3D%22{{name}}%22%20limit%205&format=json&diagnostics=true&callback=?'
	};
	$.fn.vcombo = function(options,callback){
		var opts = $.extend({},options,settings);
		var self = $(this);
		var triggered = false;
		var throttle = function(fn, delay) {
		  var timer = null;
		  return function () {
		    var context = this, args = arguments;
		    clearTimeout(timer);
		    timer = setTimeout(function () {
		      fn.apply(context, args);
		    }, delay);
		  };
		}
		var box = (function(){
			var main = $("<ul id='combo' class='s_round'></ul>");
			return {
				build:function(){
					main.html('');
					main.append("<div class='loading'>Loading...</div>")
					$('body').append(main);
				},
				fill:function(q){
					var src = opts.src.replace(/{{name}}/g,q);
					$.getJSON(src,function(raw){
						main.find('.loading').remove();
						main.html('');
							callback(raw,main);
					})
				},
				adjust:function(p){
					main.css(p);
				},
				remove:function(){
					main.remove();
				},
				next:function(){
					var active = main.find('li.active').removeClass('active');
					var next = active.next();
					if (!next.length) {
        				next = $(main.find('li')[0]);
      				}
					next.addClass('active');
				},
				prev:function(){
					var active = main.find('li.active').removeClass('active');
					var prev = active.prev();
					if(!prev.length){
						prev = main.find('li').last();
					}
					prev.addClass('active');
				},
				select:function(){
					var active = main.find('li.active');
					console.log(active);
					self.val(active.html());
				}
			}
		})();
		self.bind('focus',function(){
			console.log('entered');
			self.css({border:'1px solid #2496cd'});
			self.bind('input',throttle(function(){
				console.log('keypress triggered');
				var q = $(this).val();
				console.log(q);
				if(q != ''){
					var left = self.offset().left;
					var top = self.offset().top;
					var selfh = self.outerHeight();
					box.build();
					box.adjust({position:"absolute",top:(top+selfh),left:left});
					box.fill(q);
					triggered = true;
					$('#combo li').live('mouseenter',function(){
						var cli = $(this);
						cli.siblings().removeClass('active');
						cli.addClass('active');
					})
					$('#combo li').live('click',function(e){
						e.preventDefault();
						box.select();
					})
				}
			},500))
			self.bind('blur',function(){
				box.remove();
				self.css({border:'1px solid #ccc'});
			})
			self.bind('keypress',function(e){
				if(!triggered)	return;
				 e.stopPropagation();
				 switch(e.keyCode){

					case 38: // up arrow
					e.preventDefault();
					box.prev();
					break

					case 40: // down arrow
					e.preventDefault();
					box.next();
					break

					case 13://enter
					e.preventDefault();
					box.select();
					box.remove();
					break 

					case 27://esc
					box.remove();
				 }
			})
		})
	}
})(jQuery)