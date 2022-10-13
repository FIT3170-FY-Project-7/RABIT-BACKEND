-- Database setup file for RABIT
-- ==============================
-- WARNING!
-- Running this file will DELETE ALL EXISTING DATA if the database is already configured
-- ==============================

SET foreign_key_checks = 0;

DROP TABLE IF EXISTS rabit_user;
DROP TABLE IF EXISTS upload;
DROP TABLE IF EXISTS file_pointer;
DROP TABLE IF EXISTS plot_collection;
DROP TABLE IF EXISTS base_parameter;
DROP TABLE IF EXISTS corner_plot;
DROP TABLE IF EXISTS parameter_config;
DROP TABLE IF EXISTS dataset_config;
DROP TABLE IF EXISTS dataset_sigma;
DROP TABLE IF EXISTS dataset_quantile;

SET foreign_key_checks = 1;

-- Generate tables and set their primary keys as constraints
CREATE TABLE rabit_user
(
    user_id      CHAR(28)     NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NOT NULL
);

ALTER TABLE rabit_user
    ADD CONSTRAINT rabit_user_pk PRIMARY KEY (user_id);

CREATE TABLE file_pointer
(
    file_id       CHAR(36)     NOT NULL,
    collection_id CHAR(36)     NOT NULL,
    file_name     VARCHAR(512) NOT NULL
);

ALTER TABLE file_pointer
    ADD CONSTRAINT file_pointer_pk PRIMARY KEY (file_id);

CREATE TABLE plot_collection
(
    collection_id          CHAR(36)     NOT NULL,
    user_id                CHAR(28)     NOT NULL,
    collection_title       VARCHAR(255) NOT NULL,
    collection_description VARCHAR(1023),
    last_modified          DATETIME     NOT NULL,
    date_created           DATETIME     NOT NULL
);

ALTER TABLE plot_collection
    ADD CONSTRAINT plot_collection_pk PRIMARY KEY (collection_id);

CREATE TABLE base_parameter
(
    parameter_id   CHAR(36)     NOT NULL,
    parameter_name VARCHAR(255) NOT NULL,
    file_id        CHAR(36)     NOT NULL
);

ALTER TABLE base_parameter
    ADD CONSTRAINT base_parameter_pk PRIMARY KEY (parameter_id),
    ADD CONSTRAINT base_parameter_unique UNIQUE (parameter_name, file_id);

CREATE TABLE corner_plot
(
    corner_id         CHAR(36)   NOT NULL,
    last_modified     DATETIME   NOT NULL,
    date_created      DATETIME   NOT NULL,
    collection_id     CHAR(36)   NOT NULL,
    user_id           CHAR(28)   NOT NULL,
    plot_size         NUMERIC(5) NOT NULL,
    subplot_size      NUMERIC(5) NOT NULL,
    margin_horizontal NUMERIC(3) NOT NULL,
    margin_vertical   NUMERIC(3) NOT NULL,
    axis_size         NUMERIC(5) NOT NULL,
    axis_ticksize     NUMERIC(5) NOT NULL,
    axis_ticks        NUMERIC(3) NOT NULL,
    background_color  CHAR(7)    NOT NULL
);

ALTER TABLE corner_plot
    ADD CONSTRAINT corner_plot_pk PRIMARY KEY (corner_id);

CREATE TABLE parameter_config
(
    corner_id    CHAR(36)     NOT NULL,
    parameter_id CHAR(36)     NOT NULL,
    domain_max   VARCHAR(64)  NOT NULL,
    domain_min   VARCHAR(64)  NOT NULL,
    label_text   VARCHAR(255) NOT NULL
);

ALTER TABLE parameter_config
    ADD CONSTRAINT parameter_config_pk PRIMARY KEY (corner_id, parameter_id);

CREATE TABLE dataset_config
(
    dataconf_id CHAR(36)      NOT NULL,
    corner_id   CHAR(36)      NOT NULL,
    file_id     CHAR(36)      NOT NULL,
    bins        NUMERIC(4)    NOT NULL,
    color       CHAR(7)       NOT NULL,
    line_width  NUMERIC(4, 2) NOT NULL,
    blur_radius NUMERIC(4, 2) NOT NULL
);

ALTER TABLE dataset_config
    ADD CONSTRAINT dataset_config_pk PRIMARY KEY (dataconf_id),
    ADD CONSTRAINT dataset_config_unique UNIQUE (corner_id, file_id);

CREATE TABLE dataset_sigma
(
    dataconf_id CHAR(36)   NOT NULL,
    sigma_value NUMERIC(1) NOT NULL
);

ALTER TABLE dataset_sigma
    ADD CONSTRAINT dataset_sigma_pk PRIMARY KEY (dataconf_id, sigma_value);

CREATE TABLE dataset_quantile
(
    dataconf_id    CHAR(36)      NOT NULL,
    quantile_value NUMERIC(3, 2) NOT NULL
);

ALTER TABLE dataset_quantile
    ADD CONSTRAINT dataset_quantile_pk PRIMARY KEY (dataconf_id, quantile_value);

-- Add foreign key constraints to tables
ALTER TABLE plot_collection
    ADD CONSTRAINT rabit_user_plot_collection FOREIGN KEY (user_id) REFERENCES rabit_user (
                                                                                           user_id) ON DELETE CASCADE;

ALTER TABLE file_pointer
    ADD CONSTRAINT plot_collection_file_pointer FOREIGN KEY (collection_id)
        REFERENCES plot_collection (collection_id) ON DELETE CASCADE;

ALTER TABLE base_parameter
    ADD CONSTRAINT file_id_base_parameter FOREIGN KEY (file_id) REFERENCES
        file_pointer (file_id) ON DELETE CASCADE;

ALTER TABLE corner_plot
    ADD CONSTRAINT rabit_user_corner_plot FOREIGN KEY (user_id) REFERENCES
        rabit_user (user_id) ON DELETE CASCADE;

ALTER TABLE corner_plot
    ADD CONSTRAINT plot_collection_corner_plot FOREIGN KEY (collection_id)
        REFERENCES plot_collection (collection_id) ON DELETE CASCADE;

ALTER TABLE parameter_config
    ADD CONSTRAINT corner_plot_parameter_config FOREIGN KEY (corner_id) REFERENCES
        corner_plot (corner_id) ON DELETE CASCADE;

ALTER TABLE parameter_config
    ADD CONSTRAINT base_parameter_parameter_config FOREIGN KEY (parameter_id)
        REFERENCES base_parameter (parameter_id) ON DELETE CASCADE;

ALTER TABLE dataset_config
    ADD CONSTRAINT dataset_config_file_pointer FOREIGN KEY (file_id) REFERENCES
        file_pointer (file_id) ON DELETE CASCADE;

ALTER TABLE dataset_config
    ADD CONSTRAINT dataset_config_corner_plot FOREIGN KEY (corner_id) REFERENCES
        corner_plot (corner_id) ON DELETE CASCADE;

ALTER TABLE dataset_sigma
    ADD CONSTRAINT dataset_sigma_dataset_config FOREIGN KEY (dataconf_id) REFERENCES
        dataset_config (dataconf_id) ON DELETE CASCADE;

ALTER TABLE dataset_quantile
    ADD CONSTRAINT dataset_quantile_dataset_config FOREIGN KEY (dataconf_id) REFERENCES
        dataset_config (dataconf_id) ON DELETE CASCADE;
