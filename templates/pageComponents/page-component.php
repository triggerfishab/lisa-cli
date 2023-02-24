<?php

return [
    'key' => 'field_page_components_COMPONENTNAMESNAKECASE',
    'name' => 'COMPONENTNAMESNAKECASE',
    'label' => esc_html__('COMPONENTLABEL', 'lisa'),
    'sub_fields' => [
        [
            'key' => 'field_page_components_COMPONENTNAMESNAKECASE_content_tab',
            'type' => 'tab',
            'label' => esc_html__('Content', 'lisa'),
        ],
        [
            'key' => 'field_page_components_COMPONENTNAMESNAKECASE_settings_tab',
            'type' => 'tab',
            'label' => esc_html__('Settings', 'lisa'),
        ],
        [
            'key' => 'field_page_components_content_COMPONENTNAMESNAKECASE_settings_name',
            'type' => 'clone',
            'clone' => [
                'field_clone_component_settings_component_name',
            ],
        ],
    ]
];
