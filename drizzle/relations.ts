import { relations } from "drizzle-orm/relations";
import { users, companyusers, companies, adminusers, categories, combos, comboitems, products, productinventory, offers, offerapplications, orders, orderitems, transactions, notifications, reports, companyregistrationrequests } from "./schema";

export const companyusersRelations = relations(companyusers, ({one}) => ({
	user: one(users, {
		fields: [companyusers.userid],
		references: [users.userid]
	}),
	company: one(companies, {
		fields: [companyusers.companyid],
		references: [companies.companyid]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	companyusers: many(companyusers),
	adminusers: many(adminusers),
	orders: many(orders),
	notifications: many(notifications),
	companyregistrationrequests: many(companyregistrationrequests),
}));

export const companiesRelations = relations(companies, ({many}) => ({
	companyusers: many(companyusers),
	transactions: many(transactions),
	reports: many(reports),
	companyregistrationrequests: many(companyregistrationrequests),
}));

export const adminusersRelations = relations(adminusers, ({one, many}) => ({
	user: one(users, {
		fields: [adminusers.userid],
		references: [users.userid]
	}),
	companyregistrationrequests: many(companyregistrationrequests),
}));

export const categoriesRelations = relations(categories, ({one, many}) => ({
	category: one(categories, {
		fields: [categories.parentcategoryid],
		references: [categories.categoryid],
		relationName: "categories_parentcategoryid_categories_categoryid"
	}),
	categories: many(categories, {
		relationName: "categories_parentcategoryid_categories_categoryid"
	}),
	products: many(products),
}));

export const comboitemsRelations = relations(comboitems, ({one}) => ({
	combo: one(combos, {
		fields: [comboitems.comboid],
		references: [combos.comboid]
	}),
	product: one(products, {
		fields: [comboitems.productid],
		references: [products.productid]
	}),
}));

export const combosRelations = relations(combos, ({many}) => ({
	comboitems: many(comboitems),
	offerapplications: many(offerapplications),
	orderitems: many(orderitems),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	comboitems: many(comboitems),
	category: one(categories, {
		fields: [products.categoryid],
		references: [categories.categoryid]
	}),
	productinventories: many(productinventory),
	offerapplications: many(offerapplications),
	orderitems: many(orderitems),
}));

export const productinventoryRelations = relations(productinventory, ({one}) => ({
	product: one(products, {
		fields: [productinventory.productid],
		references: [products.productid]
	}),
}));

export const offerapplicationsRelations = relations(offerapplications, ({one}) => ({
	offer: one(offers, {
		fields: [offerapplications.offerid],
		references: [offers.offerid]
	}),
	product: one(products, {
		fields: [offerapplications.productid],
		references: [products.productid]
	}),
	combo: one(combos, {
		fields: [offerapplications.comboid],
		references: [combos.comboid]
	}),
}));

export const offersRelations = relations(offers, ({many}) => ({
	offerapplications: many(offerapplications),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	user: one(users, {
		fields: [orders.userid],
		references: [users.userid]
	}),
	orderitems: many(orderitems),
	transactions: many(transactions),
}));

export const orderitemsRelations = relations(orderitems, ({one}) => ({
	order: one(orders, {
		fields: [orderitems.orderid],
		references: [orders.orderid]
	}),
	product: one(products, {
		fields: [orderitems.productid],
		references: [products.productid]
	}),
	combo: one(combos, {
		fields: [orderitems.comboid],
		references: [combos.comboid]
	}),
}));

export const transactionsRelations = relations(transactions, ({one}) => ({
	order: one(orders, {
		fields: [transactions.orderid],
		references: [orders.orderid]
	}),
	company: one(companies, {
		fields: [transactions.companyid],
		references: [companies.companyid]
	}),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user: one(users, {
		fields: [notifications.userid],
		references: [users.userid]
	}),
}));

export const reportsRelations = relations(reports, ({one}) => ({
	company: one(companies, {
		fields: [reports.companyid],
		references: [companies.companyid]
	}),
}));

export const companyregistrationrequestsRelations = relations(companyregistrationrequests, ({one}) => ({
	adminuser: one(adminusers, {
		fields: [companyregistrationrequests.adminuserid],
		references: [adminusers.adminuserid]
	}),
	company: one(companies, {
		fields: [companyregistrationrequests.companyid],
		references: [companies.companyid]
	}),
	user: one(users, {
		fields: [companyregistrationrequests.submittedbyuserid],
		references: [users.userid]
	}),
}));