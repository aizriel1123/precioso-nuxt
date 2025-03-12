import prisma from '~/lib/prisma'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const promoStatus = await prisma.promoStatus.findMany({
      select: {
        id: true,
        status: true,
      },
    })
    return promoStatus
  } catch (error) {
    console.error('Error fetching promo status:', error)
    throw createError({ statusCode: 500, message: 'Failed to fetch promo status' })
  }
})
