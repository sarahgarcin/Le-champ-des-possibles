<?php snippet('header'); ?>


<?php $chapters = $site->find('interieur')->children()->listed();?>
<?php foreach($chapters as $chapter):?>
	<?php if($chapter->intendedTemplate() == "blank"):?>
		<div class="blank-page <?= $chapter->whiteblack() ?>"></div>
	<?php endif;?>
	<?php if($chapter->intendedTemplate() == "entrance"):?>
		<div class="entrance-page" id="<?= Str::slug($chapter->title())?>">
			<?php 
				$pics = $chapter->icones()->toStructure();
				$picsOne = $pics->slice(0, $pics->count() / 2);
				$picsTwo = $pics->slice($pics->count() / 2, $pics->count());
			?>
			<div class="entrance-page-left">
				<h2><?= $chapter->info() ?></h2>
				<ul>
					<?php foreach($picsOne as $pic):?>
						<li>
							<figure>
								<?php $image = $pic->icone()->toFile();?>
								<img src="<?= $image->url()?>">
								<figcaption>
									<p class="sommaire-visuel-title"><?= $pic->title()?></p>
									<p class="sommaire-visuel-page"><?= $pic->page()?></p>
								</figcaption>
							</figure>
						</li>
					<?php endforeach?>
				</ul>
			</div>
			<div class="entrance-page-right">
				<ul>
					<?php foreach($picsTwo as $pic):?>
						<li>
							<figure>
								<?php $image = $pic->icone()->toFile();?>
								<img src="<?= $image->url()?>">
								<figcaption>
									<p class="sommaire-visuel-title"><?= $pic->title()?></p>
									<p class="sommaire-visuel-page"><?= $pic->page()?></p>
								</figcaption>
							</figure>
						</li>
					<?php endforeach?>
				</ul>
			</div>
		</div>
	<?php endif;?>
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
				<ul id="list-index-generated-glossary-index">
				<?php foreach($chapter->glossary()->toStructure() as $item):?>
					<li class="list-index-element" data-list-index="<?= Str::slug($item->title())?>">
						<h2 class="index-value"><?= $item->title()?></h2>
						<div class="index-content">
							<?= $item->def()->kt()?>
						</div>
						<div class="links-pages"></div>
					</li>
				<?php endforeach ?>
				</ul>
			</section>
			
		</div>
	<?php endif;?>
<?php endforeach ?>

<?php snippet('footer'); ?>