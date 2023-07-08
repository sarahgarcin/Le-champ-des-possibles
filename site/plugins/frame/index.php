<?php

Kirby::plugin('sarahgarcin/frame', [
  'tags' => [
    'frame' => [
      'attr' => [
        'frame',
        'black', 
        'grey' 
      ],
      'html' => function($tag) {
        $frame = $tag->attr('frame');
        $black = $tag->attr('black');
        $grey = $tag->attr('grey');
        $class = '';
        if($black =='yes'):
          $class = "black";
        elseif ($grey =='yes'):
          $class = "grey";
        else:
          $class = "";
        endif; 
        return '<span class="highlight '. $class.'">'.$frame.'</span>';

      }
    ]
  ]
]);