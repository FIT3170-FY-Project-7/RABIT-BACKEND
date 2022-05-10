-- Database setup file for RABIT
-- ==============================
-- WARNING!
-- Running this file will DELETE ALL EXISTING DATA if the database is already configured
-- ==============================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS rabit_user;
DROP TABLE IF EXISTS upload;
DROP TABLE IF EXISTS file_pointer;
DROP TABLE IF EXISTS plot_collection;
DROP TABLE IF EXISTS base_parameter;
DROP TABLE IF EXISTS corner_plot;
DROP TABLE IF EXISTS parameter_config;
SET FOREIGN_KEY_CHECKS = 1;


-- Generate tables and set their primary keys as constraints

CREATE TABLE rabit_user (
    user_id BINARY(16) NOT NULL,
    username VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    email VARCHAR(255)
);

ALTER TABLE rabit_user ADD CONSTRAINT rabit_user_pk PRIMARY KEY ( user_id );

CREATE TABLE upload (
    upload_id BINARY(16) NOT NULL,
    user_id BINARY(16) NOT NULL,
    upload_datetime DATE
);

ALTER TABLE upload ADD CONSTRAINT upload_pk PRIMARY KEY (upload_id);

CREATE TABLE file_pointer (
    upload_id BINARY(16) NOT NULL,
    collection_id BINARY(16) NOT NULL,
    filepath VARCHAR(255) NOT NULL
);

ALTER TABLE file_pointer ADD CONSTRAINT file_pointer_pk PRIMARY KEY (upload_id, collection_id);

CREATE TABLE plot_collection (
    collection_id BINARY(16) NOT NULL
);

ALTER TABLE plot_collection ADD CONSTRAINT plot_collection_pk PRIMARY KEY (collection_id);

CREATE TABLE base_parameter (
    parameter_id BINARY(16) NOT NULL,
    parameter_name VARCHAR(32) NOT NULL,
    collection_id BINARY(16) NOT NULL
);

ALTER TABLE base_parameter ADD CONSTRAINT base_parameter_pk PRIMARY KEY (parameter_id);

CREATE TABLE corner_plot (
    corner_id BINARY(16) NOT NULL,
    plot_locked BOOLEAN NOT NULL,
    collection_id BINARY(16) NOT NULL,
    user_id BINARY(16) NOT NULL
);

ALTER TABLE corner_plot ADD CONSTRAINT corner_plot_pk PRIMARY KEY (corner_id);

CREATE TABLE parameter_config (
    corner_id BINARY(16) NOT NULL,
    parameter_id BINARY(16) NOT NULL,
    domain_max NUMERIC(7 , 3 ) NOT NULL,
    domain_min NUMERIC(7 , 3 ) NOT NULL,
    hidden BOOLEAN NOT NULL
);

ALTER TABLE parameter_config ADD CONSTRAINT parameter_config_pk PRIMARY KEY (corner_id, parameter_id);


-- Add foreign key constraints to tables

ALTER TABLE upload
ADD CONSTRAINT rabit_user_upload
FOREIGN KEY (user_id) REFERENCES rabit_user(user_id)
ON DELETE CASCADE;

ALTER TABLE file_pointer
ADD CONSTRAINT upload_file_pointer
FOREIGN KEY (upload_id) REFERENCES upload(upload_id)
ON DELETE CASCADE;

ALTER TABLE file_pointer
ADD CONSTRAINT plot_collection_file_pointer
FOREIGN KEY (collection_id) REFERENCES plot_collection(collection_id)
ON DELETE CASCADE;

ALTER TABLE base_parameter
ADD CONSTRAINT plot_collection_base_parameter
FOREIGN KEY (collection_id) REFERENCES plot_collection(collection_id)
ON DELETE CASCADE;

ALTER TABLE corner_plot
ADD CONSTRAINT rabit_user_corner_plot
FOREIGN KEY (user_id) REFERENCES rabit_user(user_id)
ON DELETE CASCADE;

ALTER TABLE corner_plot
ADD CONSTRAINT plot_collection_corner_plot
FOREIGN KEY (collection_id) REFERENCES plot_collection(collection_id)
ON DELETE CASCADE;

ALTER TABLE parameter_config
ADD CONSTRAINT corner_plot_parameter_config
FOREIGN KEY (corner_id) REFERENCES corner_plot(corner_id)
ON DELETE CASCADE;

ALTER TABLE parameter_config
ADD CONSTRAINT base_parameter_parameter_config
FOREIGN KEY (parameter_id) REFERENCES base_parameter(parameter_id)
ON DELETE CASCADE;