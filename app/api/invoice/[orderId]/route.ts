import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { orderService } from "@/services/order.service";
import { jsPDF } from "jspdf";
import { BRAND } from "@/lib/constants";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;
  const order = await orderService.getOrderById(session.user.id, orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text(BRAND.name, 20, 20);
  doc.setFontSize(10);
  doc.text(BRAND.tagline, 20, 28);
  doc.setFontSize(14);
  doc.text(`Invoice: ${order.orderNumber}`, 20, 45);
  doc.setFontSize(10);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 55);
  doc.text(`Status: ${order.status}`, 20, 62);

  let y = 80;
  doc.text("Items:", 20, y);
  y += 8;
  order.items.forEach((item) => {
    doc.text(`${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`, 25, y);
    y += 7;
  });

  y += 10;
  doc.text(`Subtotal: $${order.subtotal.toFixed(2)}`, 20, y);
  y += 7;
  doc.text(`Tax: $${order.tax.toFixed(2)}`, 20, y);
  y += 7;
  doc.text(`Shipping: $${order.shipping.toFixed(2)}`, 20, y);
  y += 7;
  if (order.discount > 0) {
    doc.text(`Discount: -$${order.discount.toFixed(2)}`, 20, y);
    y += 7;
  }
  doc.setFontSize(12);
  doc.text(`Total: $${order.total.toFixed(2)}`, 20, y + 5);

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${order.orderNumber}.pdf"`,
    },
  });
}
