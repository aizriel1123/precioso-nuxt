import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Fetch transactions with all related data, including the new ServiceTransaction
    const transactionsData = await prisma.transaction.findMany({
      include: {
        Client: true,
        Therapist: true,
        ModeOfPayment: true,
        ProductsSold: {
          include: {
            Product: true,
          },
        },
        PromoTransaction: true, // if needed
        ServiceTransaction: true,
      },
    });

    // Process each transaction to calculate totals and combine related items.
    const output = transactionsData.map((transaction) => {
      // Sales from products: product sell price * quantity
      const salesFromProducts = transaction.ProductsSold.reduce((acc, ps) => {
        const sellPrice = ps.Product.sell
          ? parseFloat(ps.Product.sell.toString())
          : 0;
        const quantity = ps.quantity || 0;
        return acc + sellPrice * quantity;
      }, 0);

      // Sales from promo transactions: use promo_price (assume 1 unit per record)
      const salesFromPromos = transaction.PromoTransaction.reduce((acc, pt) => {
        const price = pt.promo_price
          ? parseFloat(pt.promo_price.toString())
          : 0;
        return acc + price;
      }, 0);

      // Sales from direct service transactions: service_price * quantity
      const salesFromService = transaction.ServiceTransaction.reduce((acc, st) => {
        const price = st.service_price
          ? parseFloat(st.service_price.toString())
          : 0;
        const quantity = st.quantity || 0;
        return acc + price * quantity;
      }, 0);

      const totalSales = salesFromProducts + salesFromPromos + salesFromService;

      // Commission calculations
      // For products, commission is computed from Product.commission * quantity.
      const commissionFromProducts = transaction.ProductsSold.reduce((acc, ps) => {
        const commissionValue = ps.Product.commission
          ? parseFloat(ps.Product.commission.toString())
          : 0;
        const quantity = ps.quantity || 0;
        return acc + commissionValue * quantity;
      }, 0);
      // If you need to compute commissions on promos or direct services, add them here.
      // For this example, we assume commission is only applied to products.
      const totalCommission = commissionFromProducts;

      // Build combined type and name strings for display.
      const types = [];
      const names = [];
      if (transaction.ServiceTransaction.length > 0) {
        types.push("Service");
        // Display the service names from ServiceTransaction.
        names.push(
          transaction.ServiceTransaction.map((st) => st.service_name).join(", ")
        );
      }
      if (transaction.ProductsSold.length > 0) {
        types.push("Product");
        names.push(
          transaction.ProductsSold.map((ps) => ps.Product.name).join(", ")
        );
      }
      if (transaction.PromoTransaction.length > 0) {
        types.push("Promo");
        // Use the promo_name stored in PromoTransaction; if missing, fall back to Promo.promo.
        names.push(
          transaction.PromoTransaction
            .map((pt) => pt.promo_name || pt.Promo?.promo)
            .join(", ")
        );
      }
      const type = types.join(" / ") || "N/A";
      const serviceName = names.join(" / ") || "";

      return {
        id: transaction.id,
        date: transaction.date,
        client: transaction.Client
          ? `${transaction.Client.first_name} ${transaction.Client.last_name}`
          : "",
        therapist: transaction.Therapist
          ? `${transaction.Therapist.first_name} ${transaction.Therapist.last_name}`
          : "",
        type, // Combined type string (e.g., "Service / Promo")
        service: serviceName, // Combined names of items sold
        sales: totalSales, // Total sales amount
        mop: transaction.ModeOfPayment ? transaction.ModeOfPayment.mode : "",
        commission: totalCommission, // Total commission (only for products in this example)
      };
    });

    return output;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { error: "Failed to fetch transactions" };
  }
});
