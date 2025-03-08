-- CreateTable
CREATE TABLE "ServiceTransaction" (
    "transaction_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "quantity" INTEGER,
    "service_name" VARCHAR(100),
    "service_price" DECIMAL(10,2),

    CONSTRAINT "ServiceTransaction_pkey" PRIMARY KEY ("transaction_id","service_id")
);

-- AddForeignKey
ALTER TABLE "ServiceTransaction" ADD CONSTRAINT "ServiceTransaction_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ServiceTransaction" ADD CONSTRAINT "ServiceTransaction_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
