<?php

// 子テーマのstyle.cssを後から読み込む
add_action( 'wp_enqueue_scripts', 'theme_enqueue_styles' );
function theme_enqueue_styles() {
  global $dir;
  wp_enqueue_style('style', get_template_directory_uri() . '/style.css' );

  // Google WebFont
  wp_enqueue_style('webfont', 'https://fonts.googleapis.com/css?family=Amatic+SC|Asap|Cabin|Dancing+Script|Dosis|Exo|Inconsolata|Love+Ya+Like+A+Sister|Montserrat|Nunito|Questrial|Quicksand|Ravi+Prakash|Satisfy');
  // Vendor
  wp_enqueue_style('photoswipe', $dir['theme'] . '/dist/photoswipe/photoswipe.css');
  wp_enqueue_style('photoswipe_skin', $dir['theme'] . '/dist/photoswipe/default-skin/default-skin.css');
  // Main Style
  wp_enqueue_style('child-style',
    $dir['theme'] . '/stylesheets/main.css',
    array('style')
  );
}

// Global Variable
locate_template('config/variables.php', true);

// JavaScriptを指定する関数
add_action('wp_footer', 'add_javascripts');
function add_javascripts() {
  global $dir;
  wp_enqueue_script('photoswipe', $dir['theme'] . '/dist/photoswipe/photoswipe.min.js');
  wp_enqueue_script('photoswipe_skin', $dir['theme'] . '/dist/photoswipe/photoswipe-ui-default.min.js');
  wp_enqueue_script('app', $dir['theme'] . '/dist/min/app.js' );
}


// MOREタグの下に広告を表示
add_filter('the_content', 'adMoreReplace');
function adMoreReplace($contentData) {
if (is_mobile()) {
$adTags = <<< EOF

<div class="add-area more">
  <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-7307810455044245"
       data-ad-slot="2863094389"
       data-ad-format="auto"></ins>
  <script>
  (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>

EOF;
} else {
$adTags = <<< EOF

<div class="add-area more">
  <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-7307810455044245"
       data-ad-slot="2863094389"
       data-ad-format="auto"></ins>
  <script>
  (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>

EOF;
}
  $contentData = preg_replace('/<p><span id="more-([0-9]+?)"><\/span>(.*?)<\/p>/i', $adTags, $contentData);
  $contentData = str_replace('', "", $contentData);
  $contentData = str_replace('', '', $contentData);
  return $contentData;
}
