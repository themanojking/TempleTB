import jsPDF from "jspdf";

function roundedRect(doc, x, y, w, h, r, fill, stroke) {
  doc.setFillColor(...fill);
  if (stroke) doc.setDrawColor(...stroke);
  doc.roundedRect(x, y, w, h, r, r, stroke ? "FD" : "F");
}

function divider(doc, y, x1 = 10, x2 = 138) {
  doc.setDrawColor(200, 160, 80);
  doc.setLineWidth(0.2);
  doc.line(x1, y, x2, y);
}

function row(doc, label, value, y, opts = {}) {
  const { labelColor = [120, 100, 70], valueColor = [30, 25, 20] } = opts;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...labelColor);
  doc.text(label, 14, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...valueColor);
  doc.text(String(value || "—"), 80, y);
}

// ── UPI QR RECEIPT ──────────────────────────────────────────────────────────
export const generateUPIQRReceipt = (booking, upiId = "thanjaidevasthanams@upi") => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
  const W = 148;

  doc.setFillColor(250, 247, 235);
  doc.rect(0, 0, W, 210, "F");

  // Header
  doc.setFillColor(180, 115, 8);
  doc.rect(0, 0, W, 44, "F");
  doc.setFillColor(201, 136, 10);
  doc.rect(0, 40, W, 4, "F");
  doc.setTextColor(255, 248, 210);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("THANJAI DEVASTHANAMS", W / 2, 13, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("UPI Payment QR Code", W / 2, 22, { align: "center" });
  doc.setFontSize(7.5);
  doc.text("Scan with GPay · PhonePe · Paytm · BHIM · Any UPI App", W / 2, 30, { align: "center" });
  doc.text("www.thanjaidevasthanams.in", W / 2, 38, { align: "center" });

  // Amount box
  roundedRect(doc, 10, 50, W - 20, 22, 4, [255, 248, 215], [201, 136, 10]);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 70, 10);
  doc.text("Amount to Pay", W / 2, 58, { align: "center" });
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(139, 26, 26);
  doc.text("Rs. " + booking.totalAmount, W / 2, 69, { align: "center" });

  // QR Code drawing
  const qrX = 34, qrY = 78, qrSize = 80;
  roundedRect(doc, qrX - 3, qrY - 3, qrSize + 6, qrSize + 6, 4, [255, 255, 255], [180, 130, 15]);

  const cells = 21;
  const cs = qrSize / cells;
  const str = (booking.templeName + booking.totalAmount + booking.visitDate + booking.visitors + booking.phone).repeat(3);

  const drawFinder = (fx, fy) => {
    doc.setFillColor(20, 20, 20);
    doc.rect(qrX + fx * cs, qrY + fy * cs, 7 * cs, 7 * cs, "F");
    doc.setFillColor(255, 255, 255);
    doc.rect(qrX + (fx + 1) * cs, qrY + (fy + 1) * cs, 5 * cs, 5 * cs, "F");
    doc.setFillColor(20, 20, 20);
    doc.rect(qrX + (fx + 2) * cs, qrY + (fy + 2) * cs, 3 * cs, 3 * cs, "F");
  };
  drawFinder(0, 0); drawFinder(14, 0); drawFinder(0, 14);

  doc.setFillColor(20, 20, 20);
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      if ((r < 9 && c < 9) || (r < 9 && c > 12) || (r > 12 && c < 9)) continue;
      const code = str.charCodeAt((r * cells + c) % str.length);
      if ((code + r * 11 + c * 7 + booking.totalAmount) % 3 === 0) {
        doc.rect(qrX + c * cs + 0.1, qrY + r * cs + 0.1, cs * 0.82, cs * 0.82, "F");
      }
    }
  }
  // timing strips
  for (let i = 8; i < 13; i++) {
    if (i % 2 === 0) {
      doc.setFillColor(20, 20, 20);
      doc.rect(qrX + i * cs, qrY + 6 * cs, cs * 0.82, cs * 0.82, "F");
      doc.rect(qrX + 6 * cs, qrY + i * cs, cs * 0.82, cs * 0.82, "F");
    }
  }
  // OM centre
  roundedRect(doc, qrX + qrSize / 2 - 5, qrY + qrSize / 2 - 4, 10, 9, 1, [255, 255, 255]);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 110, 10);
  doc.text("OM", qrX + qrSize / 2, qrY + qrSize / 2 + 2, { align: "center" });

  // UPI Details
  roundedRect(doc, 10, 163, W - 20, 32, 3, [255, 250, 228], [180, 130, 10]);
  const uRows = [
    ["UPI ID", upiId],
    ["Payee Name", "Thanjai Devasthanams Trust"],
    ["Temple", booking.templeName],
    ["Reference", booking.slot + " · " + booking.visitors + " visitor(s)"],
  ];
  let uy = 170;
  uRows.forEach(([l, v]) => {
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 65, 10);
    doc.text(l + ":", 14, uy);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 20, 10);
    doc.text(v, 50, uy);
    uy += 7;
  });

  // Footer
  divider(doc, 199, 10, W - 10);
  doc.setFontSize(6.5);
  doc.setTextColor(150, 120, 70);
  doc.text("After payment, show this receipt at the temple counter for verification.", W / 2, 204, { align: "center" });
  doc.text("Generated: " + new Date().toLocaleString("en-IN"), W / 2, 209, { align: "center" });

  doc.save("UPI_QR_" + (booking.templeName || "Temple").replace(/\s/g, "_") + ".pdf");
};

// ── PAYMENT RECEIPT ─────────────────────────────────────────────────────────
export const generatePaymentReceipt = (booking) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
  const W = 148;

  doc.setFillColor(255, 253, 245);
  doc.rect(0, 0, W, 210, "F");

  // Header
  doc.setFillColor(110, 15, 15);
  doc.rect(0, 0, W, 46, "F");
  doc.setFillColor(201, 136, 10);
  doc.rect(0, 42, W, 4, "F");
  doc.setTextColor(255, 238, 190);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("PAYMENT RECEIPT", W / 2, 13, { align: "center" });
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.text("Thanjai Devasthanams — Temple Ticket Booking", W / 2, 22, { align: "center" });
  doc.setFontSize(7.5);
  doc.setTextColor(255, 215, 140);
  doc.text("Official Receipt | Valid for Temple Entry", W / 2, 31, { align: "center" });
  doc.text("www.thanjaidevasthanams.in", W / 2, 39, { align: "center" });

  // PAID badge
  roundedRect(doc, W - 43, 49, 32, 13, 3, [22, 150, 65]);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.text("PAID", W - 27, 57, { align: "center" });

  // Receipt meta
  const receiptNo = "TDV-" + (booking._id?.toString().slice(-6).toUpperCase() || Date.now().toString().slice(-6));
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 60, 10);
  doc.text("Receipt No: " + receiptNo, 14, 54);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 60, 30);
  doc.text("Date: " + new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), 14, 61);
  doc.text("Time: " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), 14, 68);

  // Temple banner
  roundedRect(doc, 10, 74, W - 20, 16, 3, [255, 243, 200], [201, 130, 10]);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(110, 55, 0);
  doc.text(booking.templeName || "Temple", W / 2, 82, { align: "center" });
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(140, 95, 15);
  doc.text("Thanjavur District, Tamil Nadu", W / 2, 88, { align: "center" });

  // Booking section
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(110, 15, 15);
  doc.text("BOOKING DETAILS", 14, 99);
  divider(doc, 102);

  const visitDate = booking.visitDate
    ? new Date(booking.visitDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "—";

  const bookRows = [
    ["Booking ID", "#" + (booking._id?.toString().slice(-8).toUpperCase() || "N/A")],
    ["Visitor Name", booking.visitorName],
    ["Email Address", booking.email],
    ["WhatsApp No.", booking.phone],
    ["Visit Date", visitDate],
    ["Time Slot", booking.slot],
    ["Slot Timing", booking.slotTime || booking.slot],
    ["No. of Visitors", booking.visitors + " person(s)"],
  ];

  let y = 109;
  bookRows.forEach(([l, v], i) => {
    if (i % 2 === 0) { doc.setFillColor(252, 247, 236); doc.rect(10, y - 4, W - 20, 7, "F"); }
    row(doc, l, v, y);
    y += 7;
  });

  // Payment section
  y += 2;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(110, 15, 15);
  doc.text("PAYMENT DETAILS", 14, y);
  divider(doc, y + 3);
  y += 9;

  const priceEach = Math.round(booking.totalAmount / (booking.visitors || 1));
  const payRows = [
    ["Transaction ID", booking.paymentId || ("SIM" + Date.now().toString().slice(-8))],
    ["Payment Method", booking.paymentMethod || "ONLINE"],
    ["Payment Status", "SUCCESS"],
    ["Price per Person", "Rs. " + priceEach],
    ["No. of Visitors", "x " + (booking.visitors || 1)],
  ];
  payRows.forEach(([l, v], i) => {
    if (i % 2 === 0) { doc.setFillColor(252, 247, 236); doc.rect(10, y - 4, W - 20, 7, "F"); }
    row(doc, l, v, y, { valueColor: l === "Payment Status" ? [15, 130, 55] : [30, 25, 20] });
    y += 7;
  });

  // Total box
  y += 2;
  doc.setFillColor(110, 15, 15);
  doc.roundedRect(10, y, W - 20, 16, 3, 3, "F");
  doc.setTextColor(255, 230, 170);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL AMOUNT PAID", 18, y + 7);
  doc.setFontSize(15);
  doc.setTextColor(255, 215, 0);
  doc.text("Rs. " + booking.totalAmount, W - 14, y + 10, { align: "right" });
  doc.setFontSize(6.5);
  doc.setTextColor(220, 195, 140);
  doc.text("inclusive of all charges", W - 14, y + 15, { align: "right" });

  // Note
  y += 21;
  roundedRect(doc, 10, y, W - 20, 18, 3, [255, 248, 220], [180, 130, 10]);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 65, 5);
  doc.text("Important Instructions", W / 2, y + 6, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 55, 10);
  doc.text("Carry this receipt + valid Govt ID · Arrive 15 min early", W / 2, y + 12, { align: "center" });
  doc.text("Dress code applicable · Non-transferable ticket", W / 2, y + 17, { align: "center" });

  // Footer
  y += 23;
  divider(doc, y, 10, W - 10);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(150, 100, 15);
  doc.text("Hara Hara Mahadeva  |  Om Nama Shivaya  |  Arogara", W / 2, y + 6, { align: "center" });
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(170, 145, 100);
  doc.text("Thanjai Devasthanams  (c) " + new Date().getFullYear() + "  |  " + new Date().toLocaleString("en-IN"), W / 2, y + 12, { align: "center" });

  doc.save("Payment_Receipt_" + receiptNo + ".pdf");
};

// ── DARSHAN TICKET ──────────────────────────────────────────────────────────
export const generateTicketPDF = (booking) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
  const W = 148;

  doc.setFillColor(255, 248, 220);
  doc.rect(0, 0, W, 210, "F");

  doc.setFillColor(201, 136, 10);
  doc.rect(0, 0, W, 42, "F");
  doc.setFillColor(180, 110, 5);
  doc.rect(0, 38, W, 4, "F");

  doc.setTextColor(255, 248, 220);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("TEMPLE DARSHAN TICKET", W / 2, 14, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Thanjai Devasthanams", W / 2, 23, { align: "center" });
  doc.setFontSize(8);
  doc.text("www.thanjaidevasthanams.in", W / 2, 32, { align: "center" });

  roundedRect(doc, 10, 48, W - 20, 16, 3, [255, 243, 200], [201, 136, 10]);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(120, 60, 0);
  doc.text(booking.templeName || "Temple", W / 2, 56, { align: "center" });
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 100, 20);
  doc.text("Thanjavur District, Tamil Nadu", W / 2, 62, { align: "center" });

  divider(doc, 70);

  const visitDate = booking.visitDate
    ? new Date(booking.visitDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "—";

  const tRows = [
    ["Booking ID", "#" + (booking._id?.toString().slice(-8).toUpperCase() || "N/A")],
    ["Visitor Name", booking.visitorName],
    ["Visit Date", visitDate],
    ["Time Slot", booking.slot],
    ["Slot Timing", booking.slotTime || booking.slot],
    ["No. of Visitors", booking.visitors + " person(s)"],
    ["WhatsApp", booking.phone],
    ["Amount Paid", "Rs. " + booking.totalAmount],
    ["Payment Method", booking.paymentMethod || "ONLINE"],
    ["Status", "CONFIRMED"],
  ];

  let y = 78;
  tRows.forEach(([l, v], i) => {
    if (i % 2 === 0) { doc.setFillColor(255, 248, 230); doc.rect(10, y - 4, W - 20, 7, "F"); }
    row(doc, l, v || "—", y, {
      valueColor: l === "Status" ? [15, 130, 55] : l === "Amount Paid" ? [110, 25, 0] : [30, 25, 20],
    });
    y += 7;
  });

  y += 4;
  roundedRect(doc, 10, y, W - 20, 16, 3, [255, 243, 200], [180, 130, 10]);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 60, 0);
  doc.text("Please carry this ticket and a valid Govt ID for entry.", W / 2, y + 7, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 80, 10);
  doc.text("Non-transferable | Dress code strictly enforced", W / 2, y + 13, { align: "center" });

  y += 22;
  divider(doc, y, 10, W - 10);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(150, 100, 20);
  doc.text("Hara Hara Mahadeva  |  Om Nama Shivaya", W / 2, y + 7, { align: "center" });

  doc.save("Darshan_Ticket_" + (booking._id?.toString().slice(-8).toUpperCase() || "ticket") + ".pdf");
};

// ── WHATSAPP ─────────────────────────────────────────────────────────────────
export const sendWhatsAppTicket = (booking) => {
  const receiptNo = "TDV-" + (booking._id?.toString().slice(-6).toUpperCase() || Date.now().toString().slice(-6));
  const visitDate = booking.visitDate
    ? new Date(booking.visitDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";
  const msg = encodeURIComponent(
    "🙏 *THANJAI DEVASTHANAMS*\n*Darshan Ticket Confirmed!*\n\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "🏛️ *Temple:* " + booking.templeName + "\n" +
    "🎫 *Receipt:* " + receiptNo + "\n" +
    "📅 *Date:* " + visitDate + "\n" +
    "⏰ *Slot:* " + booking.slot + "\n" +
    "👥 *Visitors:* " + booking.visitors + "\n" +
    "💰 *Paid:* Rs." + booking.totalAmount + " via " + (booking.paymentMethod || "Online") + " ✓\n" +
    "━━━━━━━━━━━━━━━━━━━━\n\n" +
    "📌 Carry this + valid Govt ID\n" +
    "⏱ Arrive 15 min before slot\n" +
    "👔 Dress code enforced\n\n" +
    "🙏 *Hara Hara Mahadeva!*\n" +
    "_thanjaidevasthanams.in_"
  );
  const phone = booking.phone?.replace(/\D/g, "");
  window.open("https://wa.me/" + phone + "?text=" + msg, "_blank");
};
