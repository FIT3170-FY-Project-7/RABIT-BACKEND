INSERT INTO rabit_user(user_id, display_name, email)
VALUES (UUID_TO_BIN(UUID()), 'root', 'root@gmail.com');

SELECT *
FROM rabit_user;

INSERT INTO upload(upload_id, user_id, upload_datetime)
VALUES (UUID_TO_BIN(UUID()), (SELECT user_id FROM rabit_user WHERE display_name = 'root' AND email = 'root@gmail.com'),
        NOW());

SELECT user_id
FROM rabit_user
WHERE display_name = 'root';

INSERT INTO rabit_user(user_id, display_name, email)
VALUES (UUID_TO_BIN(UUID()), 'Teigan', 'teigan@gmail.com'),
       (UUID_TO_BIN(UUID()), 'Pooja', 'pooja@gmail.com');

INSERT INTO plot_collection(collection_id)
VALUES (UUID_TO_BIN(UUID()));

INSERT INTO file_pointer(upload_id, collection_id, filepath)
VALUES ((SELECT upload_id FROM upload),
        (SELECT collection_id FROM plot_collection),
        'test/filepath/data.json');

INSERT INTO corner_plot(corner_id, plot_locked, collection_id, user_id)
VALUES (UUID_TO_BIN(UUID()),
        0,
        (SELECT collection_id FROM plot_collection),
        (SELECT user_id FROM rabit_user WHERE display_name = 'root'));

INSERT INTO base_parameter(parameter_id, parameter_name, collection_id)
VALUES (UUID_TO_BIN(UUID()),
        'm1',
        (SELECT collection_id FROM plot_collection));

INSERT INTO parameter_config(corner_id, parameter_id, domain_max, domain_min, hidden)
VALUES ((SELECT corner_id
         FROM corner_plot
         WHERE user_id = (SELECT user_id
                          FROM rabit_user
                          WHERE display_name = 'root')),
        (SELECT parameter_id FROM base_parameter WHERE parameter_name = 'm1'),
        100,
        150.123,
        0);


-- Correctly fails (user_id value does not reference a valid user)
-- INSERT INTO upload(upload_id, user_id)
-- VALUES (UUID_TO_BIN(UUID()),
--        UUID_TO_BIN(UUID()));