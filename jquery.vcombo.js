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
		var gq = '';
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
					/*$.ajax({
						url:opts.src + q,
						method:'GET',
						dataType:'JSON',
						success:function(data){
							main.find('.loading').remove();
							for(var i in data){
								var item = $("<li class='item'></li>");
								item.html(data[i].name);
								item.addClass(data[i].id);
								main.append(item);
							}

						}
					})*/
				},
				adjust:function(p){
					main.css(p);
				},
				remove:function(){
					main.remove();
				}
			}
		})();
		self.bind('mouseenter',function(e){
			console.log('entered');
			self.css({border:'1px solid #2496cd'});
			self.bind('input',function(){
				console.log('keypress triggered');
				var q = $(this).val();
				console.log(q);
				if(q != ''){
					var left = self.offset().left;
					var top = self.offset().top;
					var selfh = self.outerHeight();
					box.build();
					box.adjust({position:"absolute",top:(top+selfh),left:left});
					var timer = setTimeout(function(){
						box.fill(q);
					},500);
				}

			})
			self.bind('blur',function(){
				box.remove();
				self.css({border:'0px'});
			})

		})
	}
})(jQuery)