CREATE TABLE `Packages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `price` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`));
  INSERT INTO `Packages` (`id`, `price`, `createdAt`) VALUES ('1', '400', '2022-09-19');
