<?php

Kirby::plugin('sarahgarcin/break', [
  'tags' => [
    'break' => [
      'attr' => [
        'break', 
      ],
      'html' => function($tag) {
        $break = $tag->attr('break'); 
        return '<div class="pagebreak"></div>';

      }
    ]
  ]
]);