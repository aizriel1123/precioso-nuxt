// api/client/client_transaction.get.ts
import prisma from '~/lib/prisma';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        Therapist: true,
        ModeOfPayment: true,
        Appointment: {
          include: {
            Service: {
              include: {
                PriceOptions: true,
              },
            },
          },
        },
      },
    });

    const output = transactions.map((transaction) => {
      // If transaction.date is null, default to current date
      const txDate = transaction.date ? new Date(transaction.date) : new Date();
      
      // Calculate total sale from all appointments using the base price option
      const totalSale = transaction.Appointment.reduce((total, apt) => {
        let price = 0;
        if (apt.Service && apt.Service.PriceOptions) {
          // Find the PriceOption with type 'Single Session'
          const basePriceOption = apt.Service.PriceOptions.find(
            (option) => option.type === 'Single Session'
          );
          if (basePriceOption) {
            price = parseFloat(basePriceOption.price.toString());
          }
        }
        const quantity = apt.quantity || 1;
        return total + price * quantity;
      }, 0);

      return {
        date: txDate.toLocaleDateString(),
        time: txDate.toLocaleTimeString(),
        assignedTherapist: transaction.Therapist
          ? `${transaction.Therapist.first_name} ${transaction.Therapist.last_name}`
          : "",
        totalSale,
        modeOfPayment: transaction.ModeOfPayment ? transaction.ModeOfPayment.mode : "",
        productsAvailed: transaction.Appointment
          .map((apt) => (apt.Service ? apt.Service.name : ""))
          .join(", "),
      };
    });

    return output;
  } catch (error) {
    console.error("Error fetching transactions summary:", error);
    throw error;
  }
});
