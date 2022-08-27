-- Inserts some simple data into the database for testing purposes.
-- Data for corner plots and their related configurations are not included

INSERT INTO rabit_user
VALUES ('temp', 'temp', 'temp@rabit.com');

INSERT INTO upload
VALUES ('upload id', 'temp', NULL);

INSERT INTO plot_collection
VALUES ('collection_id', 'temp title', NULL);

INSERT INTO file_pointer
VALUES ('file_id', 'upload id', 'collection_id');

INSERT INTO base_parameter
VALUES ('param id', 'name', 'file_id');