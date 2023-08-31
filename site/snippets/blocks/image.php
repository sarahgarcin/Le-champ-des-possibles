<?php

/** @var \Kirby\Cms\Block $block */
$alt     = $block->alt();
$caption = $block->caption();
$crop    = $block->crop()->isTrue();
$link    = $block->link();
$ratio   = $block->ratio()->or('auto');
$src     = null;
$position = $block->position();
$background = $block->background();

$image = $block->image()->toFile();

if ($block->location() == 'web') {
    $src = $block->src()->esc();
} elseif ($image) {
    $alt = $alt->or($image->alt());
    $src = $image->url();
}

if($image->ratio() > 1):
  $orientation = "landscape";
elseif($image->ratio() == 1):
  $orientation = "square";
else:
  $orientation = "portrait";
endif;

?>
<?php if ($src): ?>
<figure class="full-page single-image <?= $position?> background-<?= $background?> <?= $orientation?>" <?= Html::attr(['data-ratio' => $ratio, 'data-crop' => $crop], null, ' ') ?>>
  <?php if ($link->isNotEmpty()): ?>
  <a href="<?= Str::esc($link->toUrl()) ?>">
    <img src="<?= $src ?>" alt="<?= $alt->esc() ?>">
  </a>
  <?php else: ?>
  <img src="<?= $src ?>" alt="<?= $alt->esc() ?>">
  <?php endif ?>

  <?php if ($caption->isNotEmpty()): ?>
  <figcaption>
    <?= $caption ?>
  </figcaption>
  <?php endif ?>
</figure>
<?php endif ?>