-- Update items to use high-quality local images


UPDATE items
SET image_url = (
    CASE 
        -- Just assigning random images based on ID hash or something simple
        -- Since we can't do random easily in a simple way for each row reliably without a complex query
        -- We will just do a simple modulo on the row number
        WHEN image_url IS NOT NULL THEN
            (ARRAY[
                '/img/photo_10_2026-07-17_20-58-21.jpg',
                '/img/photo_11_2026-07-17_20-58-21.jpg',
                '/img/photo_12_2026-07-17_20-58-21.jpg',
                '/img/photo_13_2026-07-17_20-58-21.jpg',
                '/img/photo_14_2026-07-17_20-58-21.jpg',
                '/img/photo_15_2026-07-17_20-58-21.jpg',
                '/img/photo_16_2026-07-17_20-58-21.jpg',
                '/img/photo_17_2026-07-17_20-58-21.jpg',
                '/img/photo_18_2026-07-17_20-58-21.jpg',
                '/img/photo_19_2026-07-17_20-58-21.jpg',
                '/img/photo_1_2026-07-17_20-54-23.jpg',
                '/img/photo_1_2026-07-17_20-58-21.jpg',
                '/img/photo_2026-07-17_20-54-16.jpg',
                '/img/photo_2026-07-17_20-54-30.jpg',
                '/img/photo_2026-07-17_20-54-35.jpg',
                '/img/photo_2026-07-17_20-54-39.jpg',
                '/img/photo_2026-07-17_20-54-42.jpg',
                '/img/photo_20_2026-07-17_20-58-21.jpg',
                '/img/photo_21_2026-07-17_20-58-21.jpg',
                '/img/photo_22_2026-07-17_20-58-21.jpg',
                '/img/photo_23_2026-07-17_20-58-21.jpg',
                '/img/photo_24_2026-07-17_20-58-21.jpg',
                '/img/photo_25_2026-07-17_20-58-21.jpg',
                '/img/photo_26_2026-07-17_20-58-21.jpg',
                '/img/photo_27_2026-07-17_20-58-21.jpg',
                '/img/photo_28_2026-07-17_20-58-21.jpg',
                '/img/photo_29_2026-07-17_20-58-21.jpg',
                '/img/photo_2_2026-07-17_20-54-23.jpg',
                '/img/photo_2_2026-07-17_20-58-21.jpg',
                '/img/photo_30_2026-07-17_20-58-21.jpg',
                '/img/photo_31_2026-07-17_20-58-21.jpg',
                '/img/photo_32_2026-07-17_20-58-21.jpg',
                '/img/photo_33_2026-07-17_20-58-21.jpg',
                '/img/photo_34_2026-07-17_20-58-21.jpg',
                '/img/photo_35_2026-07-17_20-58-21.jpg',
                '/img/photo_36_2026-07-17_20-58-21.jpg',
                '/img/photo_3_2026-07-17_20-54-23.jpg',
                '/img/photo_3_2026-07-17_20-58-21.jpg',
                '/img/photo_4_2026-07-17_20-54-23.jpg',
                '/img/photo_4_2026-07-17_20-58-21.jpg',
                '/img/photo_5_2026-07-17_20-58-21.jpg',
                '/img/photo_6_2026-07-17_20-58-21.jpg',
                '/img/photo_7_2026-07-17_20-58-21.jpg',
                '/img/photo_8_2026-07-17_20-58-21.jpg',
                '/img/photo_9_2026-07-17_20-58-21.jpg',
                '/img/Screenshot 2026-07-17 205307.jpg'
            ])[mod(abs(hashtext(id::text)), 46) + 1]
        ELSE NULL
    END
)
WHERE image_url LIKE '%tablebeep%';
