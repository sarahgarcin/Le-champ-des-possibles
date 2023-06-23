<?php
/** @var \Kirby\Cms\Block $block */
$caption = $block->caption();
$crop    = $block->crop()->isTrue();
$ratio   = $block->ratio()->or('auto');
?>
<figure<?= Html::attr(['data-ratio' => $ratio, 'data-crop' => $crop], null, ' ') ?> class="images-gallery">
  <ul>
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