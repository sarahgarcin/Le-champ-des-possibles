<?php /** @var \Kirby\Cms\Block $block */ ?>
<blockquote class="verbatim">
  <?= $block->text()->kt() ?>
  <?php if ($block->citation()->isNotEmpty()): ?>
  <footer>
    <?= $block->citation() ?>
  </footer>
  <?php endif ?>
</blockquote>