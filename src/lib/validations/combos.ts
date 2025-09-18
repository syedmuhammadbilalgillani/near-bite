import { z } from 'zod';

export const ComboProductSchema = z.object({ 
    companyid: z.string({ required_error: "Company is required." }).default("10"),
    name: z.string({ required_error: "Name is required." }).min(3, { message: "Name must be at least 3 characters." }),
    description: z.string({ required_error: "Description is required." }).min(10, { message: "Description must be at least 10 characters." }),         
    image: z.string({ required_error: "Image is required." }).optional(), 
    price: z.string({ required_error: "Base Price is required." }),        
    startdate: z.string({ required_error: "Start Date is required." }),
    enddate: z.string({ required_error: "Start Date is required." }),
    isactive: z.string({ required_error: "Is Active is required." }).default('active')
});
export const createComboProductSchema = ComboProductSchema.pick({ 
    name: true,
    description:true,
    price: true,
    startdate:true,
    enddate:true,
    isactive:true
});
export type ProductData = z.infer<typeof ComboProductSchema>;
export type CreateComboProductData = z.infer<typeof createComboProductSchema>;
