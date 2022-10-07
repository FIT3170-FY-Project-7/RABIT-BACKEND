-- Inserts some simple data into the database for testing purposes.
-- Data for corner plots and their related configurations are not included

INSERT INTO rabit_user
VALUES ('temp', 'temp', 'temp@rabit.com');

INSERT INTO plot_collection
VALUES ('collection_id', 'temp', 'temp title', NULL, NOW(), NOW());

INSERT INTO file_pointer
VALUES ('file_id', 'collection_id', 'file 1'),
       ('file id 2', 'collection_id', 'file 2');

INSERT INTO base_parameter
VALUES ('param id', 'name', 'file_id'),
       ('param id 2', 'name 2', 'file_id');