DROP TABLE IF EXISTS items;
CREATE TABLE items
(
  `id`         INTEGER PRIMARY KEY AUTOINCREMENT,
  `name`       varchar(255) NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
);
INSERT INTO items (`id`, `name`)
VALUES (1, 'T-shirt'),
       (2, 'Pants');

DROP TABLE IF EXISTS variants;
CREATE TABLE variants
(
  `id`         INTEGER PRIMARY KEY AUTOINCREMENT,
  `item_id`    INTEGER       NOT NULL,
  `name`       varchar(255)  NOT NULL,
  `sku`        varchar(255)  NOT NULL,
  `price`      DECIMAL(6, 2) NOT NULL,
  `quantity`   INTEGER       NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
);
INSERT INTO variants (`item_id`, `name`, `sku`, `price`, `quantity`)
VALUES (1, 'Red shirt', 'sh-1', 10.00, 10),
       (1, 'Blue shirt', 'sh-2', 10.00, 10),
       (1, 'Green shirt', 'sh-3', 10.00, 10),
       (2, 'Red pants', 'pa-1', 20.00, 10),
       (2, 'Blue pants', 'pa-2', 20.00, 10),
       (2, 'Green pants', 'pa-3', 20.00, 10);

DROP TABLE IF EXISTS purchase_orders;
CREATE TABLE purchase_orders
(
  `id`                     INT PRIMARY KEY,
  `vendor_name`            VARCHAR(255) NOT NULL,
  `order_date`             DATE         NOT NULL,
  `expected_delivery_date` DATE         NOT NULL,
  `created_at`             TIMESTAMP NULL,
  `updated_at`             TIMESTAMP NULL
);

DROP TABLE IF EXISTS purchase_order_line_items;
CREATE TABLE purchase_order_line_items
(
  `id`                INT PRIMARY KEY,
  `purchase_order_id` INT            NOT NULL,
  `variant_id`        INT            NOT NULL,
  `quantity`          INT            NOT NULL,
  `total_cost`        DECIMAL(10, 2) NOT NULL,
  `created_at`        TIMESTAMP NULL,
  `updated_at`        TIMESTAMP NULL
);
