/*
 * JTip2
 * By Stuart Loxton (http://stuartloxton.com/)
 * 
 * jTip By Cody Lindley (http://www.codylindley.com)
 * 
 * Under an Attribution, Share Alike License
 * JTip is built on top of the very light weight jquery library.
 */

//on page load (as soon as its ready) call JT_init

jTip2 = {
	show: function(reference, url, settings) {
		title = reference.name;
		if(title == false) title="&nbsp;";
		var de = document.documentElement;
		var w = self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
		var position = jQuery(reference).position();
		var offset = jQuery(reference).offset();
		var hasArea = w - position.left;
		var clickElementy = position.top - 3; //set y position
    
		var queryString = url.replace(/^[^\?]+\??/,'');
		var params = parseQuery( queryString );
		if(params['width'] === undefined){params['width'] = 250};
		if(params['link'] !== undefined){
		jQuery(reference).bind('click',function(){window.location = params['link']});
		jQuery(reference).css('cursor','pointer');
		}
    
		if(hasArea>((params['width']*1)+75)){
			jQuery("body").append("<div id='JT' style='width:"+params['width']*1+"px'><div id='JT_arrow_left'></div><div id='JT_close_left'>"+title+"</div><div id='JT_copy'><div class='JT_loader'><div></div></div>");//right side
			var arrowOffset = jQuery(reference).width() + 20;
			var clickElementx = offset.left + arrowOffset; //set x position
		}else{
			jQuery("body").append("<div id='JT' style='width:"+params['width']*1+"px'><div id='JT_arrow_right' style='left:"+((params['width']*1)+1)+"px'></div><div id='JT_close_right'>"+title+"</div><div id='JT_copy'><div class='JT_loader'><div></div></div>");//left side
			var clickElementx = position.left - ((params['width']*1) + 15); //set x position
		}
    
		jQuery('#JT').css({left: clickElementx+"px", top: clickElementy+"px"});
		jQuery('#JT').fadeIn(settings.fadeIn);
		if(/^#/.test(url)) {
			jQuery('#JT_copy').html(jQuery(url).html());
		} else if(/^\:/.test(url)) {
			segs = url.split(':');
			if(typeof(jTip2.downloaded[segs[1]]) == 'undefined') {
				jQuery.getJSON(segs[1], function(data) {
					jTip2.downloaded[segs[1]] = data;
					pathL = segs.length;
					pathI = 2;
					soFar = jTip2.downloaded[segs[1]];
					while(pathI < pathL) {
						soFar = soFar[segs[pathI]];
						pathI++;
					}
					jQuery('#JT_copy').html(soFar);
				});
			} else {
				data = jTip2.downloaded[segs[1]];
				pathL = segs.length;
				pathI = 2;
				soFar = jTip2.downloaded[segs[1]];
				while(pathI < pathL) {
					soFar = soFar[segs[pathI]];
					pathI++;
				}
				jQuery('#JT_copy').html(soFar);
			}
		} else {
			if(typeof(jTip2.downloaded[url]) == 'undefined') {
				jQuery('#JT_copy').load(url, function(data) {
					jTip2.downloaded[url] = data;
				});
			} else {
				jQuery('#JT_copy').html(jTip2.downloaded[url]);
			}
		}
	},
	hide: function(options) {
		jTip2.needsDeleting = true;
		settings = jQuery.extend({
			fadeIn: 2000,
			fadeOut: 500
		}, options);
		jQuery('#JT').fadeOut(settings.fadeOut, function() {
			if(jTip2.needsDeleting) {
				jQuery('#JT').remove();
				jTip2.needsDeleting = false;
			}
		});
	},
	downloaded: {}
}

jQuery.fn.jTipOn = function(x, options) {
	settings = jQuery.extend({
			showOn: 'mouseover',
			hideOn: 'mouseout',
			fadeIn: 2000,
			fadeOut: 1000
		}, options);
	this.each(function() {
		$obj = jQuery(this);
		$obj.bind(settings.showOn, function() {
			jQuery('#JT').remove();
			jTip2.needsDeleting = false;
			jTip2.show(this, jQuery(this).attr(x), settings);
		});
		$obj.bind(settings.hideOn, function() {
			jTip2.hide();	
		});
	});
}
jQuery.jTipPreloadURL = function(url) {
	jQuery.get(url, function(data) {
		jTip2.downloaded[url] = data;
	});
}
jQuery.jTipPreloadJSON = function(url) {
	jQuery.getJSON(url, function(data) {
		jTip2.downloaded[url] = data;
	});
}

function parseQuery ( query ) {
   var Params = new Object ();
   if ( ! query ) return Params; // return empty object
   var Pairs = query.split(/[;&]/);
   for ( var i = 0; i < Pairs.length; i++ ) {
      var KeyVal = Pairs[i].split('=');
      if ( ! KeyVal || KeyVal.length != 2 ) continue;
      var key = unescape( KeyVal[0] );
      var val = unescape( KeyVal[1] );
      val = val.replace(/\+/g, ' ');
      Params[key] = val;
   }
   return Params;
}