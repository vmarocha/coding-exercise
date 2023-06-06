DROP TABLE IF EXISTS items;
CREATE TABLE items (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` varchar(255) NOT NULL);
INSERT INTO items (`id`, `name`) VALUES
  (1, 'T-shirt'),
  (2, 'Pants');

DROP TABLE IF EXISTS variants;
CREATE TABLE variants (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `item_id` INTEGER, `name` varchar(255), `sku` varchar(255), `price` DECIMAL(6,2), `quantity` INTEGER);
INSERT INTO variants (`item_id`, `name`, `sku`, `price`, `quantity`) VALUES
  (1, 'Red shirt', 'sh-1', 10.00, 10),
  (1, 'Blue shirt', 'sh-2', 10.00, 10),
  (1, 'Green shirt', 'sh-3', 10.00, 10),
  (2, 'Red pants', 'pa-1', 20.00, 10),
  (2, 'Blue pants', 'pa-2', 20.00, 10),
  (2, 'Green pants', 'pa-3', 20.00, 10);
