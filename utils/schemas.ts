// This file contains the schemas for the application's data validation.
import * as z from 'zod'
import { ZodSchema } from 'zod'

// This function is used to validate the data from the form
export const profileSchema = z.object({
    // firstName: z.string().min(2, { message: '...name must be at least two characters.' }),
    firstName: z.string().min(2, {
        message: 'First name must be at least two characters. '
    }),
    lastName: z.string().min(2, {
        message: 'Last name must be at least two characters. '
    }),
    username: z.string().min(2, {
        message: 'Username must be at least two characters. '
    }),
});

// This function is used to validate the data from a form using zod schema
export function validateWithZodSchema<T>(
    schema: ZodSchema<T>, 
    data: unknown
    ): T {

    const result = schema.safeParse(data);

    if (!result.success) {
        const errors = result.error.errors.map((error) => error.message)
        // Join the error/s and throw an error
        throw new Error(errors.join(''));
    }
    // Return the data if it is valid
    return result.data;
}

export const ImageSchema = z.object({
    image: validateFile()
})

// This function is used to validate an image file type for uploaded by the user
function validateFile() {
    const maxUploadSize = 1 * 1024 * 1024; // 1MB
    const acceptedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    return z
        .instanceof(File)
        .refine((file) => {
            return !file || file.size <= maxUploadSize;
        }, 'File size must be less that 1 MB')
        .refine((file) => {
            return !file || acceptedFileTypes.some((type) => file.type.startsWith(type)
        );
        }, 'File must be an image')
}

export const propertySchema = z.object({
    name: z
      .string()
      .min(2, {
        message: 'name must be at least 2 characters.',
      })
      .max(100, {
        message: 'name must be less than 100 characters.',
      }),
    tagline: z
      .string()
      .min(2, {
        message: 'tagline must be at least 2 characters.',
      })
      .max(100, {
        message: 'tagline must be less than 100 characters.',
      }),
    price: z.coerce.number().int().min(0, {
      message: 'price must be a positive number.',
    }),
    category: z.string(),
    description: z.string().refine(
      (description) => {
        const wordCount = description.split(' ').length;
        return wordCount >= 10 && wordCount <= 1000;
      },
      {
        message: 'description must be between 10 and 1000 words.',
      }
    ),
    country: z.string(),
    guests: z.coerce.number().int().min(0, {
      message: 'guest amount must be a positive number.',
    }),
    bedrooms: z.coerce.number().int().min(0, {
      message: 'bedrooms amount must be a positive number.',
    }),
    beds: z.coerce.number().int().min(0, {
      message: 'beds amount must be a positive number.',
    }),
    baths: z.coerce.number().int().min(0, {
      message: 'baths amount must be a positive number.',
    }),
    amenities: z.string(),
  });

export const createReviewSchema = z.object({
  propertyId: z.string(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000),
});