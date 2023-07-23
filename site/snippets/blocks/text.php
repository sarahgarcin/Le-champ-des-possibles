<?php /** @var \Kirby\Cms\Block $block */ ?>
<?php if($block->spacing()->isNotEmpty()):?>
	<div style="letter-spacing: <?= $block->spacing() ?>px">
<?php endif;?>
	<?= $block->text()->kt();?>
<?php if($block->spacing()->isNotEmpty()):?>
	</div>
<?php endif;?>