<?php

Kirby::plugin('sarahgarcin/frame', [
  'tags' => [
    'frame' => [
      'attr' => [
        'frame',
        'black' 
      ],
      'html' => function($tag) {
        $frame = $tag->attr('frame');
        $black = $tag->attr('black');
        $class = '';
        if($black =='yes'):
          $class = "black";
        else:
          $class = "";
        endif; 
        return '<span class="highlight '. $class.'">'.$frame.'</span>';

      }
    ]
  ]
]);