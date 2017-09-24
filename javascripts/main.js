// Dependence jQuery
(function($) {
  'use strict';

  let is_sp = () => {
    let ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
      return true;
    } else if (ua.indexOf('Mobile') > 0) {
      return true;
    } else {
      return false;
    }
  };

  // Wrap
  let body = $('body');

  // for Single
  if (body.hasClass('single')) {
    // Gallery DOM
    let gallery = body.find('.foogallery-container');
    // PhotoSwipe DOM
    let photoSwipeDom = body.find('.psgal');

    // For PhotoSwipe Gallery
    if (photoSwipeDom.length) {
      let photoSwipeTrigger = photoSwipeDom.find('a');
      let captionText = photoSwipeDom.siblings('h3').text();

      function replacePhotoSwipeSetting(element) {
        // h3設定し忘れていた場合、記事タイトルを入れる
        if (captionText === undefined || captionText === '') {
          captionText = photoSwipeDom.parents('.entry-title').text();
        }

        element.each(function(i) {
          let currentIndex = i + 1;
          // captionを設定
          let figCaption = captionText + ' ' + currentIndex + '枚目';

          // figcaptionにテキストを設定
          $(this)
            .attr('data-caption', figCaption)
            .siblings('figcaption').text(figCaption);
        });
      }

      // トリガーがあったら実行
      if (photoSwipeTrigger.length) {
        replacePhotoSwipeSetting(photoSwipeTrigger);
      }
    }

    // for Foo Gallery
    if (gallery.length) {
      // Foo Galleryがあったらトリガー用Classで囲む
      gallery.wrap('<div class="re-gallery">');

      // サムネイル取得
      let thumbnail = gallery.find('a');
      let headlineText = gallery.parent().siblings('h3').text();

      if (thumbnail.length) {
        replaceFooGalleryDom(thumbnail);

        $(window).on('load', function() {
          setFooGalleryImageSize(thumbnail);
        });
      }

      function replaceFooGalleryDom(element) {
        element.each(function(i) {
          // Create Caption Text
          let captionText = $(this).attr('data-caption-title');
          let currentIndex = i + 1;

          // caption設定していなかった場合
          if (captionText === undefined) {
            if (headlineText === undefined) {
              headlineText = '';
            }

            captionText = headlineText + ' ' + currentIndex;
          }

          // figureで囲む
          $(this).wrap('<figure>');
          // figureの末尾にfigcaptionを追加する
          $(this).after('<figcaption>' + captionText);
        });
      }

      function setFooGalleryImageSize(element) {
        element.each(function(i) {
          // Image Setting
          let img = this.children[0],
              width = img.naturalWidth,
              height  = img.naturalHeight;

          if (width === 0 || width === undefined) {
            width = $(this).outerWidth() * 2;
            height = $(this).outerHeight() * 2;
          }

          // w x h の文字列を保存
          let size = width + 'x' + height,
              naturalSize = String(size);

          // data属性をセット
          $(this).attr('data-size', naturalSize);
        });
      }
    }
  }

  // for Home
  if (body.hasClass('home')) {
    const bg = $('#bg-blur');
    const slickElement = body.find('.slickcar');



    if (bg.length) {
      bg.backgroundBlur({
        imageURL: bg.data('blurimg'),
        blurAmount: 3,
        imageClass: 'blur-img-svg'
      });
    }

    // ピックアップがあったら
    if (slickElement.length) {
      slickElement.slick({
        centerMode: true,
        dots: true,
        autoplay: false,
        autoplaySpeed: 3000,
        speed: 260,
        centerPadding: '90px',
        slidesToShow: 4,
        responsive: [{
          breakpoint: 1160,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 4
          }
        },
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 3
          }
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '20px',
            slidesToShow: 1
          }
        }]
      });
    }
  }
})(jQuery);

// Vanilla JS
(function() {
  'use strict';

  // PhotoSwipe Setting
  let initPhotoSwipeFromDOM = function(gallerySelector) {
    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
      var thumbElements = el.childNodes,
          numNodes = thumbElements.length,
          items = [],
          figureEl,
          linkEl,
          size,
          item;

      for(var i = 0; i < numNodes; i++) {
        figureEl = thumbElements[i]; // <figure> element

        // include only element nodes 
        if(figureEl.nodeType !== 1) {
            continue;
        }

        linkEl = figureEl.children[0]; // <a> element

        size = linkEl.getAttribute('data-size').split('x');

        // create slide object
        item = {
            src: linkEl.getAttribute('href'),
            w: parseInt(size[0], 10),
            h: parseInt(size[1], 10)
        };



        if(figureEl.children.length > 1) {
            // <figcaption> content
            item.title = figureEl.children[1].innerHTML; 
        }

        if(linkEl.children.length > 0) {
            // <img> thumbnail element, retrieving thumbnail url
            item.msrc = linkEl.children[0].getAttribute('src');
        } 

        item.el = figureEl; // save link to element for getThumbBoundsFn
        items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
      e = e || window.event;
      e.preventDefault ? e.preventDefault() : e.returnValue = false;

      var eTarget = e.target || e.srcElement;

      // find root element of slide
      var clickedListItem = closest(eTarget, function(el) {
          return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
      });

      if(!clickedListItem) {
          return;
      }

      // find index of clicked item by looping through all child nodes
      // alternatively, you may define index via data- attribute
      var clickedGallery = clickedListItem.parentNode,
          childNodes = clickedListItem.parentNode.childNodes,
          numChildNodes = childNodes.length,
          nodeIndex = 0,
          index;

      for (var i = 0; i < numChildNodes; i++) {
          if(childNodes[i].nodeType !== 1) { 
              continue; 
          }

          if(childNodes[i] === clickedListItem) {
              index = nodeIndex;
              break;
          }
          nodeIndex++;
      }



      if(index >= 0) {
          // open PhotoSwipe if valid index found
          openPhotoSwipe( index, clickedGallery );
      }
      return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
      var hash = window.location.hash.substring(1),
      params = {};

      if(hash.length < 5) {
          return params;
      }

      var vars = hash.split('&');
      for (var i = 0; i < vars.length; i++) {
          if(!vars[i]) {
              continue;
          }
          var pair = vars[i].split('=');  
          if(pair.length < 2) {
              continue;
          }           
          params[pair[0]] = pair[1];
      }

      if(params.gid) {
          params.gid = parseInt(params.gid, 10);
      }

      return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
      openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
  };

  // Initialize
  initPhotoSwipeFromDOM('.re-gallery');
})();
