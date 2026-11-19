import { NextRequest, NextResponse } from "next/server"

export function GET(request: NextRequest) {
  // The status page checks Mercado Pago and Medusa using the original checkout.
  // Query parameters sent by the browser are never used to confirm a payment.
  return NextResponse.redirect(new URL("/br/pagamento", request.nextUrl.origin))
}
