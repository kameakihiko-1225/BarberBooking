-- Clean up existing gallery files
DELETE FROM media_files WHERE route = 'gallery';

-- Insert image files
INSERT INTO media_files (route, filename, type, url) VALUES
('gallery', 'F265D940-B71F-4322-9204-6F80D66BA823.JPG', 'image', '/public/media/gallery/F265D940-B71F-4322-9204-6F80D66BA823.JPG'),
('gallery', 'IMG_0410.jpg', 'image', '/public/media/gallery/IMG_0410.jpg'),
('gallery', 'IMG_0415.jpg', 'image', '/public/media/gallery/IMG_0415.jpg'),
('gallery', 'IMG_0416.jpg', 'image', '/public/media/gallery/IMG_0416.jpg'),
('gallery', 'IMG_0420.jpg', 'image', '/public/media/gallery/IMG_0420.jpg'),
('gallery', 'IMG_0734.jpg', 'image', '/public/media/gallery/IMG_0734.jpg'),
('gallery', 'IMG_1331.jpg', 'image', '/public/media/gallery/IMG_1331.jpg'),
('gallery', 'IMG_1548.jpg', 'image', '/public/media/gallery/IMG_1548.jpg'),
('gallery', 'IMG_1946.jpg', 'image', '/public/media/gallery/IMG_1946.jpg'),
('gallery', 'IMG_1957.jpg', 'image', '/public/media/gallery/IMG_1957.jpg'),
('gallery', 'IMG_1960.jpg', 'image', '/public/media/gallery/IMG_1960.jpg'),
('gallery', 'IMG_1982.jpg', 'image', '/public/media/gallery/IMG_1982.jpg'),
('gallery', 'IMG_2689.jpg', 'image', '/public/media/gallery/IMG_2689.jpg'),
('gallery', 'IMG_3105.jpg', 'image', '/public/media/gallery/IMG_3105.jpg'),
('gallery', 'IMG_3108.jpg', 'image', '/public/media/gallery/IMG_3108.jpg'),
('gallery', 'IMG_3111.jpg', 'image', '/public/media/gallery/IMG_3111.jpg'),
('gallery', 'IMG_3142.jpg', 'image', '/public/media/gallery/IMG_3142.jpg'),
('gallery', 'IMG_3144.jpg', 'image', '/public/media/gallery/IMG_3144.jpg'),
('gallery', 'IMG_3194.jpg', 'image', '/public/media/gallery/IMG_3194.jpg'),
('gallery', 'IMG_3224.jpg', 'image', '/public/media/gallery/IMG_3224.jpg'),
('gallery', 'IMG_3225.jpg', 'image', '/public/media/gallery/IMG_3225.jpg');

-- Insert video files
INSERT INTO media_files (route, filename, type, url) VALUES
('gallery', 'IMG_0968.MOV', 'video', '/public/media/gallery/IMG_0968.MOV'),
('gallery', 'IMG_0971.MOV', 'video', '/public/media/gallery/IMG_0971.MOV'),
('gallery', 'IMG_0977.MOV', 'video', '/public/media/gallery/IMG_0977.MOV'),
('gallery', 'IMG_0983.MOV', 'video', '/public/media/gallery/IMG_0983.MOV'),
('gallery', 'IMG_1316.MOV', 'video', '/public/media/gallery/IMG_1316.MOV'),
('gallery', 'IMG_1317.MOV', 'video', '/public/media/gallery/IMG_1317.MOV'),
('gallery', 'IMG_1318.MOV', 'video', '/public/media/gallery/IMG_1318.MOV'),
('gallery', 'IMG_1319.MOV', 'video', '/public/media/gallery/IMG_1319.MOV'),
('gallery', 'IMG_1320.MOV', 'video', '/public/media/gallery/IMG_1320.MOV'),
('gallery', 'IMG_1321.MOV', 'video', '/public/media/gallery/IMG_1321.MOV'),
('gallery', 'IMG_1322.MOV', 'video', '/public/media/gallery/IMG_1322.MOV'),
('gallery', 'IMG_1323.MOV', 'video', '/public/media/gallery/IMG_1323.MOV'),
('gallery', 'IMG_1326.MOV', 'video', '/public/media/gallery/IMG_1326.MOV'),
('gallery', 'IMG_1327.MOV', 'video', '/public/media/gallery/IMG_1327.MOV'),
('gallery', 'IMG_1338.MOV', 'video', '/public/media/gallery/IMG_1338.MOV'),
('gallery', 'IMG_3236.MOV', 'video', '/public/media/gallery/IMG_3236.MOV'),
('gallery', 'IMG_3341.MOV', 'video', '/public/media/gallery/IMG_3341.MOV'),
('gallery', 'IMG_3378.MOV', 'video', '/public/media/gallery/IMG_3378.MOV'),
('gallery', 'IMG_3382.MOV', 'video', '/public/media/gallery/IMG_3382.MOV'),
('gallery', 'IMG_3438.MOV', 'video', '/public/media/gallery/IMG_3438.MOV');