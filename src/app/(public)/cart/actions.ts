"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";

const itemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().nullable(),
  quantity: z.number().int().positive(),
});

const orderSchema = z.object({
  customerName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  branchId: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  items: z.array(itemSchema).min(1),
});

export type SubmitOrderInput = z.infer<typeof orderSchema>;
export type SubmitOrderResult = { success: boolean; error?: string; orderId?: string };

export async function submitOrder(input: SubmitOrderInput): Promise<SubmitOrderResult> {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please check your details and try again." };
  }
  const data = parsed.data;

  const order = await prisma.order.create({
    data: {
      customerName: data.customerName,
      phone: data.phone,
      email: data.email || null,
      branchId: data.branchId || null,
      notes: data.notes || null,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  return { success: true, orderId: order.id };
}
