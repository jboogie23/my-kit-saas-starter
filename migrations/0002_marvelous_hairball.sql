ALTER TABLE `users` ADD `subscription_start_date` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `subscription_end_date` integer;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `plan`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `price_id`;