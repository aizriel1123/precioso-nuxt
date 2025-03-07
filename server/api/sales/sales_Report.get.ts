import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Fetch transactions with all related data, including PromoTransaction
    const transactionsData = await prisma.transaction.findMany({
      include: {
        Client: true,
        Therapist: true,
        ModeOfPayment: true,
        Appointment: {
          include: {
            Service: {
              include: {
                CommissionRate: true,
              },
            },
          },
        },
        ProductsSold: {
          include: {
            Product: true,
          },
        },
        PromoTransaction: {
          include: {
            Promo: {
              include: {
                CommissionRate: true,
              },
            },
            PromoStatus: true, // Optional, if needed
          },
        },
      },
    });

    // Process each transaction to calculate totals and combine related items
    const output = transactionsData.map((transaction) => {
      // Sales from appointments: service price * quantity
      const salesFromAppointments = transaction.Appointment.reduce((acc, appointment) => {
        const price = appointment.Service.price
          ? parseFloat(appointment.Service.price.toString())
          : 0;
        return acc + price * appointment.quantity;
      }, 0);

      // Sales from products sold: product sell price * quantity
      const salesFromProducts = transaction.ProductsSold.reduce((acc, ps) => {
        const sellPrice = ps.Product.sell
          ? parseFloat(ps.Product.sell.toString())
          : 0;
        const quantity = ps.quantity || 0;
        return acc + sellPrice * quantity;
      }, 0);

      // Sales from promo transactions: promo price (assume one unit per promo transaction)
      const salesFromPromos = transaction.PromoTransaction.reduce((acc, pt) => {
        const price = pt.Promo.price
          ? parseFloat(pt.Promo.price.toString())
          : 0;
        return acc + price;
      }, 0);

      const totalSales = salesFromAppointments + salesFromProducts + salesFromPromos;

      // Commission from appointments: service price * quantity * commission rate
      const commissionFromAppointments = transaction.Appointment.reduce((acc, appointment) => {
        const rate = appointment.Service.CommissionRate && appointment.Service.CommissionRate.rate
          ? parseFloat(appointment.Service.CommissionRate.rate.toString())
          : 0;
        const price = appointment.Service.price
          ? parseFloat(appointment.Service.price.toString())
          : 0;
        return acc + price * appointment.quantity * rate;
      }, 0);

      // Commission from products sold: product commission * quantity
      const commissionFromProducts = transaction.ProductsSold.reduce((acc, ps) => {
        const commissionValue = ps.Product.commission
          ? parseFloat(ps.Product.commission.toString())
          : 0;
        const quantity = ps.quantity || 0;
        return acc + commissionValue * quantity;
      }, 0);

      // Commission from promo transactions: promo price * commission rate
      const commissionFromPromos = transaction.PromoTransaction.reduce((acc, pt) => {
        const rate = pt.Promo.CommissionRate && pt.Promo.CommissionRate.rate
          ? parseFloat(pt.Promo.CommissionRate.rate.toString())
          : 0;
        const price = pt.Promo.price
          ? parseFloat(pt.Promo.price.toString())
          : 0;
        return acc + price * rate;
      }, 0);

      const totalCommission = commissionFromAppointments + commissionFromProducts + commissionFromPromos;

      // Combine the related items into type and service name strings.
      const types = [];
      const names = [];
      if (transaction.Appointment.length > 0) {
        types.push("Service");
        names.push(transaction.Appointment.map(a => a.Service.name).join(", "));
      }
      if (transaction.ProductsSold.length > 0) {
        types.push("Product");
        names.push(transaction.ProductsSold.map(ps => ps.Product.name).join(", "));
      }
      if (transaction.PromoTransaction.length > 0) {
        types.push("Promo");
        names.push(transaction.PromoTransaction.map(pt => pt.Promo.promo).join(", "));
      }
      const type = types.join(" / ") || "N/A";
      const serviceName = names.join(" / ") || "";

      return {
        id: transaction.id,
        date: transaction.date, // DateTime value
        client: transaction.Client
          ? `${transaction.Client.first_name} ${transaction.Client.last_name}`
          : "",
        therapist: transaction.Therapist
          ? `${transaction.Therapist.first_name} ${transaction.Therapist.last_name}`
          : "",
        type,         // Combined type string (e.g., "Service / Promo")
        service: serviceName,  // Combined service/promo names
        sales: totalSales,     // Total sales amount
        mop: transaction.ModeOfPayment ? transaction.ModeOfPayment.mode : "",
        commission: totalCommission, // Total commission
      };
    });

    return output;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { error: "Failed to fetch transactions" };
  }
});
