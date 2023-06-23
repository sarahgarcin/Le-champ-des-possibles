<?php

Kirby::plugin('sarahgarcin/notes-tag', [
  'tags' => [
    'note' => [
      'attr' => [
        'note', 
      ],
      'html' => function($tag) {
        $note = $tag->attr('note');

        return '<span class="margin-note">'.$note.'</span>';

      }
    ]
  ]
]);