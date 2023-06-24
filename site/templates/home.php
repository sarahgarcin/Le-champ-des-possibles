<?php snippet('header'); ?>


<?php $chapters = $site->find('interieur')->children()->listed();?>
<?php foreach($chapters as $chapter):?>
	<?php if($chapter->intendedTemplate() == "toc"):?>
		<div class="toc-page">
			<h1><?= $chapter->title()?></h1>
			<section id="table-of-contents"></section>
		</div>
	<?php endif;?>
	<?php if($chapter->intendedTemplate() == "map"):?>
		<div class="map map-left">
			<?php if($map = $chapter->pics()->toFile()):?>
				<figure class="map-image">
					<img src="<?= $map->url()?>" alt="<?= $chapter->title()?>">
				</figure>
			<?php endif;?>
		</div>
		<div class="map map-right">
			<?php if($map = $chapter->pics()->toFile()):?>
				<figure class="map-image">
					<img src="<?= $map->url()?>" alt="<?= $chapter->title()?>">
				</figure>
			<?php endif;?>
			<div class="map-infos">
				<h3><?= $chapter->title()?></h3>
				<p><?= $chapter->caption()?></p>
			</div>
		</div>
	<?php endif?>
	<?php if($chapter->intendedTemplate() == "default"):?>
		<div class="chapter-left-page">
			<?php if($icone = $chapter->icone()->toFile()): ?>
				<figure class="icone">
					<?= $icone ?>
				</figure>
			<?php endif;?>
		</div>
		<div class="chapter <?= $chapter->uid() ?>">
			<h1><span class="highlight"><?= $chapter->title() ?></span></h1>
			<section class="summary">
				<ol>
				<?php foreach($chapter->summary()->toStructure() as $item):?>
					<li><?= $item->title()?></li>
				<?php endforeach ?>
				</ol>
			</section>
			<section class="content">
				<?= $chapter->text()->toBlocks() ?>
			</section>
			<?php if($chapter->sources()->isNotEmpty()): ?>
				<section class="sources">
					<h2>Sources</h2>
					<?= $chapter->sources()->kt() ?>
				</section>
			<?php endif;?>
		</div>
	<?php endif;?>
	<?php if($chapter->intendedTemplate() == "glossary"):?>
		<div class="glossary-page">
			<h1><?= $chapter->title()?></h1>
			<section id="glossary">
				<ul>
				<?php foreach($chapter->glossary()->toStructure() as $item):?>
					<li>
						<h2><?= $item->title()?></h2>
						<?= $item->def()->kt()?>
						<div class="glossary-link-page">21, 30, 45, 120</div>
					</li>
				<?php endforeach ?>
				</ul>
			</section>
			
		</div>
	<?php endif;?>
<?php endforeach ?>

<?php snippet('footer'); ?>