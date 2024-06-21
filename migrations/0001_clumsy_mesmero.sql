ALTER TABLE `users` ADD `customer_id` text;--> statement-breakpoint
ALTER TABLE `users` ADD `plan` text;--> statement-breakpoint
ALTER TABLE `users` ADD `price_id` text;--> statement-breakpoint
ALTER TABLE `users` ADD `subscription_id` text;--> statement-breakpoint
ALTER TABLE `users` ADD `subscription_status` text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_customer_id_unique` ON `users` (`customer_id`);