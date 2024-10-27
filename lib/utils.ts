import { type ClassValue, clsx } from 'clsx'
import prisma from "~/lib/prisma";
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function createClient(body: any){
  //Convert Date of Birth to Date Format
  const dob = new Date(body.date_of_birth);

  //Create
  const obj = await prisma.client.create({
      data: {
          first_name: body.first_name,
          last_name: body.last_name,
          dob: dob.toISOString(),
          contact_info: body.contact_information,
          Gender:{
              connect:{
                  gender: body.gender,
              }
          },
      }
  })

  return obj
}