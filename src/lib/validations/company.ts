import { z } from 'zod';

export const CompanySchema = z.object({    
    companyname: z.string({ required_error: "Name is required." }).min(2, { message: "Name must be at least 2 characters." }),
    address: z.string({ required_error: "Address is required." }).min(10, { message: "Address must be at least 10 characters." }),    
    latitude:  z.string({ required_error: "Latitude is required." }).transform((val) => typeof val === "string" ? parseFloat(val) : val),   
    longitude:  z.string({ required_error: "Longitude is required." }).transform((val) => typeof val === "string" ? parseFloat(val) : val),  
    licensecompliance: z.string({ required_error: "License Compliance is required." }),   
    businesscategories: z.string({ required_error: "Business category is required." }).min(3, { message: "Business category must be at least 10 characters." }),     
    isactive: z.string({ required_error: "Is Active is required." }).default('active'),
    status: z.string({ required_error: "Status is required." })
});
export const createCompanySchema = CompanySchema.pick({    
    companyname: true,
    address: true,
    latitude: true,
    longitude: true,
    licensecompliance:true,
    businesscategories: true,
    status:true
});
export type CompanyData = z.infer<typeof CompanySchema>;
export type CreateCompanyData = z.infer<typeof createCompanySchema>;
