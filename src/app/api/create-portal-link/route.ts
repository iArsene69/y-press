import { stripe } from "@/lib/stripe";
import { createOrRetrieveCustomer } from "@/lib/stripe/adminTasks";
import { getURL } from "@/lib/utils";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("cannot find user");
    const customer = await createOrRetrieveCustomer({
      email: user.email || "",
      uuid: user.id || "",
    });
    if (!customer) throw new Error("No customer found");
    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getURL()}/dashboard`,
    });
    return NextResponse.json({ url });
  } catch (error) {
    return new NextResponse("Internal server dies", { status: 500 });
  }
}
