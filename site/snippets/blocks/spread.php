<?php

/** @var \Kirby\Cms\Block $block */
$alt     = $block->alt();
$caption = $block->caption();
$src     = null;

if ($block->location() == 'web') {
    $src = $block->src()->esc();
} elseif ($image = $block->image()->toFile()) {
    $alt = $alt->or($image->alt());
    $src = $image->url();
}

?>
<?php if ($src): ?>
  <div class="map map-left">
    <figure class="map-image">
      <img src="<?= $src ?>" alt="<?= $alt->esc() ?>">
    </figure>
  </div>
  <div class="map map-right">
    <figure class="map-image">
      <img src="<?= $src ?>" alt="<?= $alt->esc() ?>">
    </figure>
    <?php if ($caption->isNotEmpty()): ?>
      <div class="map-infos">
        <p><?= $caption ?></p>
      </div>
    <?php endif;?>
  </div>
<?php endif ?>