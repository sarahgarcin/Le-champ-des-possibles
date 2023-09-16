<?php

Kirby::plugin('sarahgarcin/smallcaps', [
  'tags' => [
    'smallcaps' => [
      'attr' => [
        'smallcaps',
      ],
      'html' => function($tag) {
        $smallcaps = $tag->attr('smallcaps');
        return '<span style="font-variant: small-caps">'.$smallcaps.'</span>';

      }
    ]
  ]
]);