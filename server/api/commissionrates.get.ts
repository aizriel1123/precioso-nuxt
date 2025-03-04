import prisma from '~/lib/prisma'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const commissionRates = await prisma.commissionRate.findMany({
      select: {
        id: true,
        rate: true,
      },
    })
    return commissionRates
  } catch (error) {
    console.error('Error fetching commission rates:', error)
    throw createError({ statusCode: 500, message: 'Failed to fetch commission rates' })
  }
})
