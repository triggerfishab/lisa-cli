<?php

namespace Lisa\PostTypes;

class Faq
{
    public static $postType = 'POSTNAMEKEBABCASE';

    public static function register()
    {
        register_post_type(self::$postType, [
            'label' => esc_html__('POSTNAMEHUMAN', 'lisa'),
            'public' => true,
            'show_in_graphql' => true,
            'graphql_single_name' => 'faq',
            'graphql_plural_name' => 'faqs',
            'has_archive' => false,
            'menu_icon' => 'dashicons-editor-help',
        ]);
    }
}
