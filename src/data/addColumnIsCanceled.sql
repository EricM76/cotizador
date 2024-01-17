ALTER TABLE `cotizador`.`Orders` 
ADD COLUMN `isCanceled` TINYINT NULL DEFAULT 0 AFTER `ticket`;