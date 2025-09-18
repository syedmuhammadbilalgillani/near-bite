import { z } from 'zod';

export const CategorySchema = z.object({    
    categoryname: z.string({ required_error: "Category is required." }).min(1, { message: "Category must be at least 1 characters." }),    
    image: z.string({ required_error: "Image is required." }).optional(),    
    parentcategoryid: z.string({ required_error: "Is Active is required." }).optional()
});
export const createCategorySchema = CategorySchema.pick({    
    categoryname: true
});
export type CategoryData = z.infer<typeof CategorySchema>;
export type CreateCategoryData = z.infer<typeof createCategorySchema>;
