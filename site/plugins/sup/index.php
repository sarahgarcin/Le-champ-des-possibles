<?php

Kirby::plugin('sarahgarcin/sup', [
  'tags' => [
    'sup' => [
      'attr' => [
        'sup',
      ],
      'html' => function($tag) {
        $sup = $tag->attr('sup');
        return '<sup>'.$sup.'</sup>';

      }
    ]
  ]
]);