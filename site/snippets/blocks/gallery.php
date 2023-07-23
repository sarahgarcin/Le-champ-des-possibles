<?php
/** @var \Kirby\Cms\Block $block */
$caption = $block->caption();
$crop    = $block->crop()->isTrue();
$ratio   = $block->ratio()->or('auto');
$imagesCount = $block->images()->toFiles()->count();
$class = "col-2";
if($imagesCount == 2):
  $class = "col-1";
else:
  $class = "col-2";
endif; ?>
<figure<?= Html::attr(['data-ratio' => $ratio, 'data-crop' => $crop], null, ' ') ?> class="images-gallery full-page">
  <ul class="<?= $class ?>">
    <?php foreach ($block->images()->toFiles() as $image): ?>
    <li>
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