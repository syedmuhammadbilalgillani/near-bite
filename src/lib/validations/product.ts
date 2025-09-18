import { z } from 'zod';

export const ProductSchema = z.object({    
    categoryid: z.string({ required_error: "Category is required." }).min(1, { message: "Category must be at least 1 characters." }),
    companyid: z.string({ required_error: "Company is required." }).default("10"),
    name: z.string({ required_error: "Name is required." }).min(3, { message: "Name must be at least 3 characters." }),
    description: z.string({ required_error: "Description is required." }).min(10, { message: "Description must be at least 10 characters." }),         
    image: z.string({ required_error: "Image is required." }).optional(), 
    baseprice: z.string({ required_error: "Base Price is required." }),        
    inqwerty: z.string({ required_error: "Inqwerty is required." }).default('active'),
    isactive: z.string({ required_error: "Is Active is required." }).default('active'),    
    inventory: z.string({ required_error: "Is Active is required." })  
});
export const createProductSchema = ProductSchema.pick({    
    categoryid: true,    
    name: true,
    description:true,
    baseprice: true,
    inqwerty:true,
    isactive:true,
    inventory:true
});
export type ProductData = z.infer<typeof ProductSchema>;
export type CreateProductData = z.infer<typeof createProductSchema>;
