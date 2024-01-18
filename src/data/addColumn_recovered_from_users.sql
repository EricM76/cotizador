ALTER TABLE `cotizador`.`Users` 
ADD COLUMN `recovered` TINYINT(1) NULL DEFAULT 0 AFTER `infinity`;