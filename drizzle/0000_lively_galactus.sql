CREATE TABLE `account` (
	`user_id` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`provider_account_id` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `provider_account_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`session_token` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `shops` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`image` text,
	`merchant_id` text,
	`phone_number` text NOT NULL,
	`upi_id` text NOT NULL,
	`name` text NOT NULL,
	`address` text,
	`status` text DEFAULT 'active',
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`merchant_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`shop_id` integer,
	`customer_id` text,
	`amount` real NOT NULL,
	`notes` text,
	`is_paid` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`email` text(255) NOT NULL,
	`email_verified` integer DEFAULT (unixepoch()),
	`image` text(255)
);
--> statement-breakpoint
CREATE TABLE `verification_token` (
	`identifier` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`userId`);--> statement-breakpoint
CREATE INDEX `merchant_id_idx` ON `shops` (`merchant_id`);--> statement-breakpoint
CREATE INDEX `upi_id_idx` ON `shops` (`upi_id`);--> statement-breakpoint
CREATE INDEX `phone_number_idx` ON `shops` (`phone_number`);--> statement-breakpoint
CREATE INDEX `transactions_shop_id_idx` ON `transactions` (`shop_id`);--> statement-breakpoint
CREATE INDEX `transactions_customer_id_idx` ON `transactions` (`customer_id`);