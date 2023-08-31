<?php
/** @var \Kirby\Cms\Block $block */
$caption = $block->caption();
$crop    = $block->crop()->isTrue();
$ratio   = $block->ratio()->or('auto');
$background = $block->background();
$imagesCount = $block->images()->toFiles()->count();
$orientation = "landscape";

$class = "col-2";
if($imagesCount == 2):
  $class = "col-1";
elseif($imagesCount == 3):
  $class = "strip";
else:
  $class = "col-2";
endif; 
?>

<figure<?= Html::attr(['data-ratio' => $ratio, 'data-crop' => $crop], null, ' ') ?> class="images-gallery full-page background-<?= $background?>">
  <ul class="<?= $class ?>">
    <?php foreach ($block->images()->toFiles() as $image): ?>
      <?php 
        if($image->ratio() > 1):
          $orientation = "landscape";
        elseif($image->ratio() == 1):
          $orientation = "square";
        else:
          $orientation = "portrait";
        endif;
      ?>
    <li class="<?= $orientation ?>">
      <?= $image ?>
      <?php if ($image->caption()->isNotEmpty()): ?>
        <figcaption>
          <?= $image->caption() ?>
        </figcaption>
      <?php endif ?>
    </li>
    <?php endforeach ?>
  </ul>
  <?php if ($caption->isNotEmpty()): ?>
  <figcaption>
    <?= $caption ?>
  </figcaption>
  <?php endif ?>
</figure>