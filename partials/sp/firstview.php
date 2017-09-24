<?php
  $fv_args = array(
    'posts_per_page' => 5,
    'order' => 'DESC',
    'orderby' => 'rand',
    'post_status' => 'publish',
  );
  // Main Post
  $fv_query = new WP_Query($fv_args);
  $fv_bg = '';
  while ($fv_query->have_posts()) {
    $fv_query->the_post();

    if (has_post_thumbnail()) {
      $thumbnail_id = get_post_thumbnail_id();

      if ($thumbnail_id) {
        $fv_bg = wp_get_attachment_image_src($thumbnail_id, 'full')[0]; // 0 is File URL
      }
    }

    if (! empty($fv_bg)) {
      break;
    }
  }

?>
<div id="firstview">
  <div id="bg-blur" data-blurimg="<?php echo $fv_bg; ?>"></div>
</div>

<header class="header" role="banner">
  <div id="logo" class="gf rere">
  <?php if (is_home() || is_front_page()) { ?>
    <h1 class="h1 text site-title">
      <a href="<?php echo home_url(); ?>" rel="nofollow"><?php bloginfo('name'); ?></a>
    </h1>
  <?php } else { // トップページ以外 ?>
    <p class="h1 text site-title">
      <a href="<?php echo home_url(); ?>"><?php bloginfo('name'); ?></a>
    </p>
  <?php } ?>
  </div>

  <div id="inner-header" class="wrap cf">
    <?php if (! get_option('side_options_header_search')) { // 検索ボックスを表示するがONだったら ?>
    <a href="#searchbox" data-remodal-target="searchbox" class="nav_btn search_btn">
      <span class="text gf">search</span>
    </a>
    <?php } ?>

    <a href="#spnavi" data-remodal-target="spnavi" class="nav_btn"><span class="text gf">menu</span></a>
  </div>

  <div id="pickup-posts">
    <?php get_template_part('parts_homeheader'); ?>
  </div>
</header>
