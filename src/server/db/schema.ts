import {
  pgTable,
  unique,
  integer,
  varchar,
  numeric,
  timestamp,
  foreignKey,
  boolean,
  text,
  index,
  bigint,
  serial
} from "drizzle-orm/pg-core"
import {sql} from "drizzle-orm"

export const users = pgTable("users", {
    userid: serial("userid").primaryKey(),
    name: varchar("name", {length: 255}),
    email: varchar("email", {length: 255}),
    password: varchar("password", {length: 255}),
    phonenumber: varchar("phonenumber", {length: 20}),
    profilepicture: varchar("profilepicture", {length: 255}),
    usertype: varchar("usertype", {length: 50}),
    supportid: integer("supportid"),
    geolocationradius: numeric("geolocationradius", {precision: 5, scale: 2}),
    notificationsettings: varchar("notificationsettings", {length: 255}),
    createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
    updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      usersEmailKey: unique("users_email_key").on(table.email),
    }
  });

export const companyusers = pgTable("companyusers", {
    companyuserid: serial("companyuserid").primaryKey(),
    userid: integer("userid"),
    companyid: integer("companyid"),
    role: varchar("role", {length: 50}),
    createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      companyusersUseridFkey: foreignKey({
        columns: [table.userid],
        foreignColumns: [users.userid],
        name: "companyusers_userid_fkey"
      }),
      companyusersCompanyidFkey: foreignKey({
        columns: [table.companyid],
        foreignColumns: [companies.companyid],
        name: "companyusers_companyid_fkey"
      }),
    }
  });

export const companies = pgTable("companies", {
  companyid: serial("companyid").primaryKey(),
  companyname: varchar("companyname", {length: 255}),
  address: varchar("address", {length: 255}),
  latitude: numeric("latitude", {precision: 10, scale: 8}),
  longitude: numeric("longitude", {precision: 11, scale: 8}),
  licensecompliance: boolean("licensecompliance"),
  businesscategories: varchar("businesscategories", {length: 255}),
  isactive: boolean("isactive"),
  status: integer("status").default(0),
  createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const combos = pgTable("combos", {
    comboid: serial("comboid").primaryKey(),
    companyid: integer("companyid"),
    name: varchar("name", {length: 255}),
    description: text("description"),
    price: numeric("price", {precision: 10, scale: 2}),
    image: varchar("image", {length: 255}),
    isactive: boolean("isactive"),
    startdate: timestamp("startdate", {mode: 'string'}),
    enddate: timestamp("enddate", {mode: 'string'}),
    createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
    updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      companyIdFkey: foreignKey({
        columns: [table.companyid],
        foreignColumns: [companies.companyid],
        name: "company_id_fkey"
      }),
    }
  });

export const adminusers = pgTable("adminusers", {
    adminuserid: serial("adminuserid").primaryKey(),
    userid: integer("userid"),
    role: varchar("role", {length: 50}),
    permissions: text("permissions"),
    createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
    updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      adminusersUseridFkey: foreignKey({
        columns: [table.userid],
        foreignColumns: [users.userid],
        name: "adminusers_userid_fkey"
      }),
    }
  });

export const categories = pgTable("categories", {
    categoryid: serial("categoryid").primaryKey(),
    image: varchar("image", {length: 255}),
    categoryname: varchar("categoryname", {length: 255}),
    parentcategoryid: integer("parentcategoryid"),
    createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
    updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      categoriesParentcategoryidFkey: foreignKey({
        columns: [table.parentcategoryid],
        foreignColumns: [table.categoryid],
        name: "categories_parentcategoryid_fkey"
      }),
    }
  });

export const comboitems = pgTable("comboitems", {
    comboitemid: serial("comboitemid").primaryKey(),
    comboid: integer("comboid"),
    productid: integer("productid"),
    quantity: integer("quantity"),
    createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
    updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      idxComboitemsCombo: index("idx_comboitems_combo").using("btree", table.comboid.asc().nullsLast()),
      comboitemsComboidFkey: foreignKey({
        columns: [table.comboid],
        foreignColumns: [combos.comboid],
        name: "comboitems_comboid_fkey"
      }),
      comboitemsProductidFkey: foreignKey({
        columns: [table.productid],
        foreignColumns: [products.productid],
        name: "comboitems_productid_fkey"
      }),
    }
  });

export const products = pgTable("products", {
    productid: serial("productid").primaryKey(),
    categoryid: integer("categoryid"),
    companyid: integer("companyid"),
    name: varchar("name", {length: 255}),
    image: varchar("image", {length: 255}),
    description: text("description"),
    baseprice: numeric("baseprice", {precision: 10, scale: 2}),
    createdby: integer("createdby").default(1),
    inqwerty: boolean("inqwerty"),
    isactive: boolean("isactive"),
    createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
    updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      idxProductsCategory: index("idx_products_category").using("btree", table.categoryid.asc().nullsLast()),
      productsCategoryidFkey: foreignKey({
        columns: [table.categoryid],
        foreignColumns: [categories.categoryid],
        name: "products_categoryid_fkey"
      }),
      createdByFkey: foreignKey({
        columns: [table.createdby],
        foreignColumns: [users.userid],
        name: "created_by_userid_fkey"
      }),
      companyIdFkey: foreignKey({
        columns: [table.companyid],
        foreignColumns: [companies.companyid],
        name: "company_id_fkey"
      }),
    }
  });

export const productinventory = pgTable("productinventory", {
    inventoryid: serial("inventoryid").primaryKey(),
    productid: integer("productid"),
    quantityavailable: integer("quantityavailable"),
    lastupdated: timestamp("lastupdated", {mode: 'string'}),
    createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
    updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      productinventoryProductidFkey: foreignKey({
        columns: [table.productid],
        foreignColumns: [products.productid],
        name: "productinventory_productid_fkey",
      }),
    }
  });

export const offers = pgTable("offers", {
  offerid: serial("offerid").primaryKey(),
  name: varchar("name", {length: 255}),
  description: text("description"),
  discounttype: varchar("discounttype", {length: 50}),
  discountvalue: numeric("discountvalue", {precision: 10, scale: 2}),
  startdate: timestamp("startdate", {mode: 'string'}),
  enddate: timestamp("enddate", {mode: 'string'}),
  isactive: boolean("isactive"),
  createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const offerapplications = pgTable("offerapplications", {
    offerappid: serial("offerappid").primaryKey(),
    offerid: integer("offerid"),
    productid: integer("productid"),
    comboid: integer("comboid"),
    createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
    updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      offerapplicationsOfferidFkey: foreignKey({
        columns: [table.offerid],
        foreignColumns: [offers.offerid],
        name: "offerapplications_offerid_fkey"
      }),
      offerapplicationsProductidFkey: foreignKey({
        columns: [table.productid],
        foreignColumns: [products.productid],
        name: "offerapplications_productid_fkey"
      }),
      offerapplicationsComboidFkey: foreignKey({
        columns: [table.comboid],
        foreignColumns: [combos.comboid],
        name: "offerapplications_comboid_fkey"
      }),
    }
  });

export const orders = pgTable("orders", {
    orderid: serial("orderid").primaryKey(),
    userid: integer("userid"),
    status: varchar("status", {length: 50}),
    paymentstatus: varchar("paymentstatus", {length: 50}),
    paymentmethod: varchar("paymentmethod", {length: 50}),
    totalamount: numeric("totalamount", {precision: 10, scale: 2}),
    createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
    updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      ordersUseridFkey: foreignKey({
        columns: [table.userid],
        foreignColumns: [users.userid],
        name: "orders_userid_fkey"
      }),
    }
  });

export const orderitems = pgTable("orderitems", {
    orderitemid: serial("orderitemid").primaryKey(),
    orderid: integer("orderid"),
    productid: integer("productid"),
    comboid: integer("comboid"),
    quantity: integer("quantity"),
    unitprice: numeric("unitprice", {precision: 10, scale: 2}),
    discountapplied: boolean("discountapplied"),
    ordertype: varchar("ordertype", {length: 20}),
    createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
    updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      idxOrderitemsCombo: index("idx_orderitems_combo").using("btree", table.comboid.asc().nullsLast()),
      idxOrderitemsOrder: index("idx_orderitems_order").using("btree", table.orderid.asc().nullsLast()),
      idxOrderitemsProduct: index("idx_orderitems_product").using("btree", table.productid.asc().nullsLast()),
      orderitemsOrderidFkey: foreignKey({
        columns: [table.orderid],
        foreignColumns: [orders.orderid],
        name: "orderitems_orderid_fkey"
      }),
      orderitemsProductidFkey: foreignKey({
        columns: [table.productid],
        foreignColumns: [products.productid],
        name: "orderitems_productid_fkey"
      }),
      orderitemsComboidFkey: foreignKey({
        columns: [table.comboid],
        foreignColumns: [combos.comboid],
        name: "orderitems_comboid_fkey"
      }),
    }
  });

export const transactions = pgTable("transactions", {
    transactionid: serial("transactionid").primaryKey(),
    orderid: integer("orderid"),
    companyid: integer("companyid"),
    transactiondate: timestamp("transactiondate", {mode: 'string'}),
    amount: numeric("amount", {precision: 10, scale: 2}),
    paymentgatewayid: integer("paymentgatewayid"),
    paymentstatus: varchar("paymentstatus", {length: 50}),
    createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
    updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      idxTransactionsOrder: index("idx_transactions_order").using("btree", table.orderid.asc().nullsLast()),
      transactionsOrderidFkey: foreignKey({
        columns: [table.orderid],
        foreignColumns: [orders.orderid],
        name: "transactions_orderid_fkey"
      }),
      transactionsCompanyidFkey: foreignKey({
        columns: [table.companyid],
        foreignColumns: [companies.companyid],
        name: "transactions_companyid_fkey"
      }),
    }
  });

export const paymentgateways = pgTable("paymentgateways", {
  paymentgatewayid: serial("paymentgatewayid").primaryKey(),
  gatewayname: varchar("gatewayname", {length: 255}),
  apikey: varchar("apikey", {length: 255}),
  apisecret: varchar("apisecret", {length: 255}),
  isactive: boolean("isactive"),
  createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const paymentmethods = pgTable("paymentmethods", {
  paymentmethodid: serial("paymentmethodid").primaryKey(),
  methodtype: varchar("methodtype", {length: 50}),
  details: text("details"),
  isdefault: boolean("isdefault"),
  createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
});

export const notifications = pgTable("notifications", {
    notificationid: serial("notificationid").primaryKey(),
    userid: integer("userid"),
    notificationtype: varchar("notificationtype", {length: 50}),
    message: text("message"),
    relatedentityid: integer("relatedentityid"),
    isread: boolean("isread"),
    sentat: timestamp("sentat", {mode: 'string'}),
    createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
    updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      idxNotificationsUser: index("idx_notifications_user").using("btree", table.userid.asc().nullsLast()),
      notificationsUseridFkey: foreignKey({
        columns: [table.userid],
        foreignColumns: [users.userid],
        name: "notifications_userid_fkey"
      }),
    }
  });

export const reports = pgTable("reports", {
    reportid: serial("reportid").primaryKey(),
    companyid: integer("companyid"),
    reporttype: varchar("reporttype", {length: 50}),
    parameters: text("parameters"),
    generatedat: timestamp("generatedat", {mode: 'string'}),
    createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
    updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      reportsCompanyidFkey: foreignKey({
        columns: [table.companyid],
        foreignColumns: [companies.companyid],
        name: "reports_companyid_fkey"
      }),
    }
  });

export const companyregistrationrequests = pgTable("companyregistrationrequests", {
    requestid: serial("requestid").primaryKey(),
    companyid: integer("companyid"),
    submittedbyuserid: integer("submittedbyuserid"),
    applicationdate: timestamp("applicationdate", {mode: 'string'}),
    adminuserid: integer("adminuserid"),
    notes: text("notes"),
    createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
    updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      companyregistrationrequestsAdminuseridFkey: foreignKey({
        columns: [table.adminuserid],
        foreignColumns: [adminusers.adminuserid],
        name: "companyregistrationrequests_adminuserid_fkey"
      }),
      companyregistrationrequestsCompanyidFkey: foreignKey({
        columns: [table.companyid],
        foreignColumns: [companies.companyid],
        name: "companyregistrationrequests_companyid_fkey"
      }),
      companyregistrationrequestsSubmittedbyuseridFkey: foreignKey({
        columns: [table.submittedbyuserid],
        foreignColumns: [users.userid],
        name: "companyregistrationrequests_submittedbyuserid_fkey"
      }),
    }
  });

export const comboPriceAnalysis = pgTable("combo_price_analysis", {
  comboid: serial("comboid").primaryKey(),
  comboName: varchar("combo_name", {length: 255}),
  comboPrice: numeric("combo_price", {precision: 10, scale: 2}),
  totalIndividualPrice: numeric("total_individual_price"),
  totalSavings: numeric("total_savings"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  numberOfProducts: bigint("number_of_products", {mode: "number"}),
});


export const announcements = pgTable("announcements", {
    announcementid: serial("announcementid").primaryKey(),
    companyid: integer("companyid"),
    title: varchar("title", {length: 255}),
    content: text("content"),
    isactive: boolean("isactive").default(true), // Indicates if the announcement is currently active
    startdate: timestamp("startdate", {mode: 'string'}), // Optional: Start date for the announcement
    enddate: timestamp("enddate", {mode: 'string'}), // Optional: End date for the announcement
    createdat: timestamp("createdat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
    updatedat: timestamp("updatedat", {mode: 'string'}).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      announcementsCompanyidFkey: foreignKey({
        columns: [table.companyid],
        foreignColumns: [companies.companyid],
        name: "announcements_companyid_fkey"
      }),
    }
  });